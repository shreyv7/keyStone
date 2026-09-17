import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  Code, 
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  lastUsed: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'revoked' | 'expired';
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'CI_SCANNER_PROD',
    prefix: 'key_live_9x8a...4b12',
    scopes: ['ingest:write', 'graph:read', 'simulate:write'],
    lastUsed: '4 mins ago',
    createdAt: 'Aug 12, 2026',
    expiresAt: 'In 334 days',
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'JIRA_SYNC_CONNECTOR',
    prefix: 'key_live_3c71...99ef',
    scopes: ['graph:read', 'mitigation:read'],
    lastUsed: '2 hours ago',
    createdAt: 'Jul 01, 2026',
    expiresAt: 'In 290 days',
    status: 'active'
  },
  {
    id: 'key-3',
    name: 'DEV_LOCAL_CLI_ALEX',
    prefix: 'key_test_1f44...2a09',
    scopes: ['developer:sandbox', 'graph:read'],
    lastUsed: '1 day ago',
    createdAt: 'Sep 02, 2026',
    expiresAt: 'In 82 days',
    status: 'active'
  },
  {
    id: 'key-4',
    name: 'LEGACY_SCANNER_DEPRECATED',
    prefix: 'key_live_001a...77cd',
    scopes: ['ingest:write'],
    lastUsed: 'Aug 30, 2026',
    createdAt: 'Jan 15, 2026',
    expiresAt: 'Expired',
    status: 'revoked'
  }
];

export const ApiKeysPage: React.FC = () => {
  const { isLight } = useTheme();
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'live' | 'test'>('live');
  const [newKeyExpiry, setNewKeyExpiry] = useState('90d');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['ingest:write', 'graph:read']);
  const [newlyCreatedSecret, setNewlyCreatedSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [codeTab, setCodeTab] = useState<'curl' | 'python' | 'node'>('curl');

  const availableScopes = [
    { id: 'ingest:write', label: 'Ingest SBOMs & Lockfiles', desc: 'Permits pipeline scanners to upload CycloneDX / SPDX manifests' },
    { id: 'graph:read', label: 'Query Topology Graph', desc: 'Permits querying reachability, articulation cut vertices, and systemic scores' },
    { id: 'simulate:write', label: 'Execute Blast Radius Simulations', desc: 'Permits triggering propagation simulations across Crown Jewel assets' },
    { id: 'mitigation:write', label: 'Dispatch Coordinated PRs', desc: 'Authorizes opening synchronized pull requests across multi-repos' },
    { id: 'circuit:write', label: 'Freeze Circuit Breakers', desc: 'Permits locking compromised dependencies via PURL enforcement' }
  ];

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeId) ? prev.filter(s => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomSecret = `key_${newKeyEnv}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const maskedPrefix = `key_${newKeyEnv}_${randomSecret.slice(9, 13)}...${randomSecret.slice(-4)}`;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: maskedPrefix,
      scopes: selectedScopes,
      lastUsed: 'Never',
      createdAt: 'Just now',
      expiresAt: newKeyExpiry === 'never' ? 'Never' : newKeyExpiry === '30d' ? 'In 30 days' : 'In 90 days',
      status: 'active'
    };

    setKeys(prev => [newKey, ...prev]);
    setNewlyCreatedSecret(randomSecret);
    setNewKeyName('');
  };

  const handleRevoke = (id: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
  };

  return (
    <div className={`w-full h-full overflow-y-auto px-6 py-8 select-text ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616] text-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">API Keys & Machine Access</h1>
            <p className="text-sm mt-2 max-w-3xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage scoped API credentials for CI/CD pipelines, automated scanners, and integrations.
            </p>
          </div>

          <button
            onClick={() => {
              setNewlyCreatedSecret(null);
              setIsCreateModalOpen(true);
            }}
            className="btn-3d-primary px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New API Key</span>
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="connector-3d-card p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Active API Keys</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {keys.filter(k => k.status === 'active').length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Tokens</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> FIPS 140-2 Keyring
            </span>
          </div>

          <div className="connector-3d-card p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Monthly API Invocations</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">142,800</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">calls</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              p99 latency 14ms
            </span>
          </div>

          <div className="connector-3d-card p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Authentication Success</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">100%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">0 auth failures</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Zero rogue calls
            </span>
          </div>

          <div className="connector-3d-card p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Rate Limit Quota</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">10,000</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">req / min</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Enterprise Dedicated
            </span>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="connector-3d-card overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Machine Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scoped tokens for CLI automation and CI/CD pipelines.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`border-b font-semibold uppercase tracking-wider text-xs ${
                isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}>
                <tr>
                  <th className="py-3 px-4">Key Identifier</th>
                  <th className="py-3 px-4">Prefix / Secret Token</th>
                  <th className="py-3 px-4">Granted Scopes</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4">Status / Expiry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold block text-slate-900 dark:text-white text-sm">{k.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Created {k.createdAt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {k.prefix}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {k.scopes.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {k.lastUsed}
                    </td>
                    <td className="py-3.5 px-4">
                      {k.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                          {k.expiresAt}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Revoked
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {k.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(k.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Revoke Key Immediately"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Usage & Documentation Drawer */}
        <div className={`p-6 rounded-xl border flex flex-col gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">API Quickstart & Code Snippets</h3>
            </div>

            <div className={`flex items-center gap-1 p-1 rounded-lg border ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setCodeTab('curl')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium cursor-pointer transition-colors ${
                  codeTab === 'curl'
                    ? isLight ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setCodeTab('python')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium cursor-pointer transition-colors ${
                  codeTab === 'python'
                    ? isLight ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setCodeTab('node')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium cursor-pointer transition-colors ${
                  codeTab === 'node'
                    ? isLight ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                TypeScript / Node
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto leading-relaxed ${
            isLight ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-black/90 text-slate-200 border-slate-800'
          }`}>
            {codeTab === 'curl' && (
              <pre>
{`# 1. Ingest CycloneDX SBOM into Keystone graph
curl -X POST https://api.keystonesecurity.io/v1/sbom/ingest \\
  -H "Authorization: Bearer key_live_9x8a...4b12" \\
  -H "Content-Type: application/json" \\
  -d @bom.json

# 2. Query Crown Jewel blast radius for snakeyaml
curl -X GET "https://api.keystonesecurity.io/v1/graph/keystones/snakeyaml/blast-radius?depth=4" \\
  -H "Authorization: Bearer key_live_9x8a...4b12"`}
              </pre>
            )}

            {codeTab === 'python' && (
              <pre>
{`from keystone_sdk import KeystoneClient

client = KeystoneClient(api_key="key_live_9x8a...4b12")

# Inspect systemic score and articulation status
risk = client.keystones.get_systemic_score("snakeyaml")
print(f"SIFI Score: {risk.systemic_score} | Cut Vertex: {risk.articulation_point}")

# Dispatch coordinated PR
if risk.systemic_score > 0.70:
    client.mitigation.dispatch_coordinated_pr(
        package="snakeyaml",
        target_version="2.0",
        affected_repos=7
    )`}
              </pre>
            )}

            {codeTab === 'node' && (
              <pre>
{`import { KeystoneClient } from '@keystone/sdk';

const keystone = new KeystoneClient({
  apiKey: process.env.KEYSTONE_API_KEY
});

// Enforce in CI pipeline
const { passes, blastRadius } = await keystone.verifyPR({
  lockfilePath: './pnpm-lock.yaml',
  maxSifiConcentration: 0.70
});

if (!passes) {
  throw new Error(\`Supply-chain policy breached: \${blastRadius.financialExposure}\`);
}`}
              </pre>
            )}
          </div>
        </div>

      </div>

      {/* Create Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col gap-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            
            {newlyCreatedSecret ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h2 className="text-base font-semibold">API Key Generated Successfully</h2>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>Please copy your secret key now. You will not be able to view it again.</span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 font-mono text-xs ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
                }`}>
                  <code className="text-blue-600 dark:text-blue-400 font-semibold break-all">{newlyCreatedSecret}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newlyCreatedSecret);
                      setCopiedSecret(true);
                      setTimeout(() => setCopiedSecret(false), 2000);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer shrink-0"
                    title="Copy Secret"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setNewlyCreatedSecret(null);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">Generate New API Key</h2>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Key Description / Purpose *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., GITHUB_ACTIONS_DEPLOY_GATE"
                      value={newKeyName}
                      onChange={e => setNewKeyName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Environment</label>
                      <select
                        value={newKeyEnv}
                        onChange={e => setNewKeyEnv(e.target.value as any)}
                        className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        }`}
                      >
                        <option value="live">Production (key_live_...)</option>
                        <option value="test">Sandbox / Dev (key_test_...)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Expiration Period</label>
                      <select
                        value={newKeyExpiry}
                        onChange={e => setNewKeyExpiry(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                        }`}
                      >
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days (Recommended)</option>
                        <option value="1y">1 Year</option>
                        <option value="never">Never (Requires SecOps Approval)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Permitted Scopes</label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                      {availableScopes.map(scope => (
                        <div
                          key={scope.id}
                          onClick={() => handleToggleScope(scope.id)}
                          className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition-colors ${
                            selectedScopes.includes(scope.id)
                              ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600'
                              : isLight ? 'border-slate-200' : 'border-slate-800'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedScopes.includes(scope.id)}
                            onChange={() => {}}
                            className="mt-0.5 accent-blue-600 rounded cursor-pointer"
                          />
                          <div>
                            <span className="font-semibold block font-mono text-xs text-slate-900 dark:text-white">{scope.id}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{scope.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors"
                  >
                    Create API Token
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
