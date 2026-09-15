import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Settings, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Key, 
  Server, 
  Bell, 
  Check, 
  Copy,
  Clock,
  ArrowRight,
  Filter,
  UploadCloud
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ConnectorsPageProps {
  onOpenSBOMModal?: () => void;
}

export interface ConnectorItem {
  id: string;
  name: string;
  category: 'scm' | 'registry' | 'ci' | 'alerts';
  description: string;
  icon: string;
  status: 'connected' | 'available' | 'syncing' | 'error';
  lastSync?: string;
  scope?: string;
  webhookHealth?: string;
  details: {
    target: string;
    version?: string;
    policyEnforced?: boolean;
    autoPr?: boolean;
  };
}

const INITIAL_CONNECTORS: ConnectorItem[] = [
  {
    id: 'github-app',
    name: 'GitHub Enterprise / Cloud',
    category: 'scm',
    description: 'Bi-directional repository sync, real-time lockfile diffing, and coordinated multi-repo pull request dispatch.',
    icon: '🐙',
    status: 'connected',
    lastSync: '3 mins ago',
    scope: '42 Monitored Repos',
    webhookHealth: '100% (0 dropped)',
    details: { target: 'org:acme-corp', policyEnforced: true, autoPr: true }
  },
  {
    id: 'gitlab',
    name: 'GitLab Self-Managed & SaaS',
    category: 'scm',
    description: 'Group-level dependency graph extraction, merge request security widgets, and CycloneDX pipeline ingestion.',
    icon: '🦊',
    status: 'available',
    details: { target: 'gitlab.internal.acme.com', policyEnforced: false, autoPr: false }
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket Data Center',
    category: 'scm',
    description: 'Enterprise Git repository integration with branch permission gating and pull request checks.',
    icon: '🪣',
    status: 'available',
    details: { target: 'bitbucket.acme.net', policyEnforced: false, autoPr: false }
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps Repos',
    category: 'scm',
    description: 'Azure Repos scanning, service hook ingestion, and pipeline blast-radius gates.',
    icon: '☁️',
    status: 'available',
    details: { target: 'dev.azure.com/acme-infra', policyEnforced: false, autoPr: false }
  },
  {
    id: 'npm-registry',
    name: 'npm Private & Public Registry',
    category: 'registry',
    description: 'Real-time package metadata resolver, semantic version drift watcher, and maintainer account anomaly monitor.',
    icon: '📦',
    status: 'connected',
    lastSync: '12 mins ago',
    scope: '18 Internal Scopes (@acme/*)',
    webhookHealth: '99.9% (Continuous polling)',
    details: { target: 'registry.npmjs.org + Artifactory Mirror', policyEnforced: true }
  },
  {
    id: 'maven-central',
    name: 'Maven Central & Sonatype Nexus',
    category: 'registry',
    description: 'Transitive JAR dependency resolution, pom.xml parent inheritance parsing, and SHA-256 integrity verification.',
    icon: '☕',
    status: 'connected',
    lastSync: '1 hour ago',
    scope: '320 Java Keystones',
    webhookHealth: '100%',
    details: { target: 'nexus.corp.acme.com', policyEnforced: true }
  },
  {
    id: 'pypi-artifactory',
    name: 'PyPI / JFrog Artifactory',
    category: 'registry',
    description: 'Python wheel, tarball, and pyproject.toml / poetry.lock topological resolver with setup.py execution sandboxing.',
    icon: '🐍',
    status: 'available',
    details: { target: 'pypi.org + private index', policyEnforced: false }
  },
  {
    id: 'oci-harbor',
    name: 'OCI / Harbor Container Registry',
    category: 'registry',
    description: 'Container base image SBOM extraction, Syft/Grype layer decompilation, and base image provenance enforcement.',
    icon: '🐳',
    status: 'available',
    details: { target: 'harbor.cloud.acme.internal', policyEnforced: false }
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions PURL Enforcer',
    category: 'ci',
    description: 'Fails PR workflows that introduce unmitigated SIFI keystones with systemic reachability into Tier-1 assets.',
    icon: '⚡',
    status: 'connected',
    lastSync: 'Live Webhook Stream',
    scope: 'Strict Mode Enabled',
    webhookHealth: '1,420 Checks Run Today',
    details: { target: '.github/workflows/keystone-guard.yml', policyEnforced: true }
  },
  {
    id: 'jenkins-plugin',
    name: 'Jenkins Enterprise Plugin',
    category: 'ci',
    description: 'Pipeline build step to evaluate blast-radius delta before publishing packages or promotion to staging.',
    icon: '🤵',
    status: 'available',
    details: { target: 'jenkins.internal.acme.com:8443', policyEnforced: false }
  },
  {
    id: 'slack-alerts',
    name: 'Slack Security Operations',
    category: 'alerts',
    description: 'Instant notification dispatch for escalating centralities, fresh maintainer anomalies, and 1-click circuit breakers.',
    icon: '💬',
    status: 'connected',
    lastSync: 'Active Socket',
    scope: '#keystone-secops, #ciso-alerts',
    webhookHealth: 'Instant',
    details: { target: 'Slack Workspace AcmeCorp', policyEnforced: true }
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty SIFI Escalation',
    category: 'alerts',
    description: 'Pages on-call security architects when a Crown Jewel blast-radius path is actively traversable without mitigation.',
    icon: '🚨',
    status: 'connected',
    lastSync: 'Active Webhook',
    scope: 'Service: Supply-Chain-P1',
    webhookHealth: 'Zero Lag',
    details: { target: 'PD-SERVICE-KEYSTONE-P1', policyEnforced: true }
  },
  {
    id: 'jira-security',
    name: 'Jira Software Security Issues',
    category: 'alerts',
    description: 'Automatically creates coordinated mitigation tickets with dependency upgrade matrices across affected squads.',
    icon: '📋',
    status: 'available',
    details: { target: 'acme.atlassian.net', policyEnforced: false }
  }
];

export const ConnectorsPage: React.FC<ConnectorsPageProps> = ({ onOpenSBOMModal }) => {
  const { isLight } = useTheme();
  const [connectors, setConnectors] = useState<ConnectorItem[]>(INITIAL_CONNECTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'scm' | 'registry' | 'ci' | 'alerts'>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessId, setSyncSuccessId] = useState<string | null>(null);
  const [selectedConfigConnector, setSelectedConfigConnector] = useState<ConnectorItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newConnectorName, setNewConnectorName] = useState('');
  const [newConnectorCategory, setNewConnectorCategory] = useState<'scm' | 'registry' | 'ci' | 'alerts'>('scm');
  const [newConnectorUrl, setNewConnectorUrl] = useState('');

  // Filtering
  const filteredConnectors = connectors.filter(c => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = connectors.filter(c => c.status === 'connected').length;

  const handleTriggerSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setSyncSuccessId(id);
      setConnectors(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, lastSync: 'Just now' };
        }
        return item;
      }));
      setTimeout(() => setSyncSuccessId(null), 3000);
    }, 1200);
  };

  const handleToggleConnection = (id: string) => {
    setConnectors(prev => prev.map(item => {
      if (item.id === id) {
        const isNowConnected = item.status !== 'connected';
        return {
          ...item,
          status: isNowConnected ? 'connected' : 'available',
          lastSync: isNowConnected ? 'Just now' : undefined,
          scope: isNowConnected ? 'Configured & Active' : undefined,
          webhookHealth: isNowConnected ? '100%' : undefined
        };
      }
      return item;
    }));
  };

  const handleCreateConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnectorName.trim()) return;

    const newId = `custom-${Date.now()}`;
    const newItem: ConnectorItem = {
      id: newId,
      name: newConnectorName,
      category: newConnectorCategory,
      description: `Custom ${newConnectorCategory.toUpperCase()} integration hooked into ${newConnectorUrl || 'https://api.internal.corp'}.`,
      icon: newConnectorCategory === 'scm' ? '🐙' : newConnectorCategory === 'registry' ? '📦' : newConnectorCategory === 'ci' ? '⚡' : '🔔',
      status: 'connected',
      lastSync: 'Just created',
      scope: 'Active Webhook',
      webhookHealth: '100%',
      details: {
        target: newConnectorUrl || 'custom-hook.acme.corp',
        policyEnforced: true
      }
    };

    setConnectors(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewConnectorName('');
    setNewConnectorUrl('');
  };

  return (
    <div className={`w-full h-full overflow-y-auto px-6 py-8 select-text ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616] text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
                ECOSYSTEM INGESTION
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">• Continuous Graph Sync</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Connectors & Integrations</h1>
            <p className="text-sm mt-1.5 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
              Connect your source control platforms, package registries, CI/CD runners, and incident channels.
              Keystone continuously correlates package lockfiles, resolves transitive dependency graphs, and dispatches coordinated mitigation PRs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onOpenSBOMModal && (
              <button
                onClick={onOpenSBOMModal}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
                title="Connect Repository / Ingest CycloneDX SBOM or Lockfile (F1)"
              >
                <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Ingest SBOM / Lock</span>
                <span className="text-xs px-1.5 py-0.2 rounded font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  F1
                </span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Connector</span>
            </button>
          </div>
        </div>

        {/* Dedicated CycloneDX & SPDX Ingestion Banner */}
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">CycloneDX, SPDX & Direct Lockfile Ingestion</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                  Zero-Code Upload
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Upload <code>package-lock.json</code>, <code>pnpm-lock.yaml</code>, <code>poetry.lock</code>, or CycloneDX JSON to parse and correlate systemic keystone risks.
              </p>
            </div>
          </div>

          {onOpenSBOMModal && (
            <button
              onClick={onOpenSBOMModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload SBOM / Lockfile</span>
              <span className="text-xs opacity-70 font-mono">F1</span>
            </button>
          )}
        </div>

        {/* Status Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Connectors</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{connectedCount}</span>
              <span className="text-xs text-slate-500">/ {connectors.length} total</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> All healthy & syncing
            </span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Repositories Ingested</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">42</span>
              <span className="text-xs text-slate-500">Production Core</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Next scheduled sync: 12m</span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Keystones Tracked</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1,489</span>
              <span className="text-xs text-slate-500">transitive nodes</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">5 SIFI Escalations</span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Webhook Reliability</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">100%</span>
              <span className="text-xs text-slate-500">p99 &lt; 180ms</span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Zero dropped events</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Category Tabs */}
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto w-full sm:w-auto ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
          }`}>
            {[
              { id: 'all', label: `All (${connectors.length})` },
              { id: 'scm', label: 'Source Control' },
              { id: 'registry', label: 'Registries' },
              { id: 'ci', label: 'CI / CD' },
              { id: 'alerts', label: 'Alerts & Incident' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? isLight ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'bg-slate-800 text-white font-semibold'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter connectors..."
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border outline-hidden transition-all ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-900 focus:border-blue-500' 
                  : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredConnectors.map((item) => {
            const isConnected = item.status === 'connected';
            const isSyncing = syncingId === item.id;
            const isSuccess = syncSuccessId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-150 relative ${
                  isConnected
                    ? isLight 
                      ? 'bg-white border-slate-200/90 shadow-xs hover:border-blue-300' 
                      : 'bg-slate-900/70 border-slate-800 hover:border-blue-800/60'
                    : isLight
                      ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-xs">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">{item.name}</h3>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {item.category === 'scm' ? 'Source Control' : item.category === 'registry' ? 'Package Registry' : item.category === 'ci' ? 'CI Enforcement' : 'ChatOps / Alerting'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>

                {/* Scope & Metadata if connected */}
                {isConnected && (
                  <div className={`p-3 rounded-lg border text-xs flex flex-col gap-1.5 font-mono ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/80 border-slate-800/80'
                  }`}>
                    {item.scope && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-sans">Scope:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.scope}</span>
                      </div>
                    )}
                    {item.lastSync && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-sans">Last Sync:</span>
                        <span className="text-slate-600 dark:text-slate-400">{item.lastSync}</span>
                      </div>
                    )}
                    {item.webhookHealth && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-sans">Webhook:</span>
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">{item.webhookHealth}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Controls Footer */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                  {isConnected ? (
                    <>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTriggerSync(item.id)}
                          disabled={isSyncing}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                          }`}
                          title="Trigger immediate lockfile scan and graph correlation"
                        >
                          {isSyncing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                          ) : isSuccess ? (
                            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>{isSyncing ? 'Syncing...' : isSuccess ? 'Synced' : 'Sync Now'}</span>
                        </button>

                        <button
                          onClick={() => setSelectedConfigConnector(item)}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                          }`}
                          title="Configure Connector Parameters"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleConnection(item.id)}
                        className="text-xs text-slate-500 hover:text-red-600 font-medium px-2 py-1 transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleToggleConnection(item.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Connect Integration</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Configuration Drawer Modal */}
      {selectedConfigConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedConfigConnector.icon}</span>
                <div>
                  <h2 className="text-base font-bold">{selectedConfigConnector.name}</h2>
                  <p className="text-xs text-slate-400">Settings & Ingestion Rules</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConfigConnector(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 py-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Endpoint / Host</label>
                <input
                  type="text"
                  readOnly
                  value={selectedConfigConnector.details.target}
                  className={`w-full px-3 py-2 rounded-lg border font-mono ${
                    isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white block">Automatic Coordinated PR Creation</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Permit Keystone to open multi-repo pull requests for minimum-cut cut vertices.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={selectedConfigConnector.details.autoPr ?? true}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white block">Strict Policy Enforcement</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Block build pipelines if an introduced keystone elevates SIFI concentration above 80%.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={selectedConfigConnector.details.policyEnforced ?? true}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Webhook Secret Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value="whsec_994b210f88a91c32de782f9"
                    readOnly
                    className={`flex-1 px-3.5 py-2 rounded-lg border font-mono text-sm ${
                      isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText('whsec_994b210f88a91c32de782f9')}
                    className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title="Copy Secret"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedConfigConnector(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Connector Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreateConnector} className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl flex flex-col gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Custom Connector</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3.5 text-sm">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Connector Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Internal GitLab Runner or Nexus Staging"
                  value={newConnectorName}
                  onChange={e => setNewConnectorName(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-hidden ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={newConnectorCategory}
                  onChange={e => setNewConnectorCategory(e.target.value as any)}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-hidden ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                >
                  <option value="scm">Source Code Management (SCM)</option>
                  <option value="registry">Package / Artifact Registry</option>
                  <option value="ci">Continuous Integration (CI/CD)</option>
                  <option value="alerts">Alerting / Incident Response</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Webhook URL or Service Endpoint</label>
                <input
                  type="text"
                  placeholder="https://gitlab.internal.corp/api/v4"
                  value={newConnectorUrl}
                  onChange={e => setNewConnectorUrl(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-hidden font-mono ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                Create Connector
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
