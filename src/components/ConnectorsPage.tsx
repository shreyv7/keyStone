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
  UploadCloud,
  Layers,
  Sparkles,
  Link2,
  Lock,
  Radio,
  FileCode2,
  Database,
  Terminal,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export interface ConnectorsPageProps {
  onOpenSBOMModal?: () => void;
}

export interface ConnectorItem {
  id: string;
  name: string;
  category: 'scm' | 'registry' | 'ci' | 'alerts';
  categoryLabel: string;
  description: string;
  logo: string;
  status: 'connected' | 'available' | 'syncing' | 'error';
  lastSync?: string;
  scope?: string;
  webhookHealth?: string;
  tags: string[];
  details: {
    target: string;
    version?: string;
    policyEnforced?: boolean;
    autoPr?: boolean;
    authType?: string;
    monitoredCount?: number;
  };
}

const INITIAL_CONNECTORS: ConnectorItem[] = [
  {
    id: 'github-app',
    name: 'GitHub Enterprise & Cloud',
    category: 'scm',
    categoryLabel: 'Source Control',
    description: 'Bi-directional repo sync & multi-repo PR dispatch',
    logo: '/assets/connectors/1.png',
    status: 'connected',
    lastSync: '3m ago',
    scope: '42 Repos',
    webhookHealth: '100% Health',
    tags: ['OAuth 2.0', 'Auto-PR'],
    details: { 
      target: 'api.github.com / org:acme-corp', 
      policyEnforced: true, 
      autoPr: true, 
      authType: 'GitHub App Installation',
      monitoredCount: 42
    }
  },
  {
    id: 'gitlab',
    name: 'GitLab SaaS & Self-Managed',
    category: 'scm',
    categoryLabel: 'Source Control',
    description: 'Dependency graph extraction & MR security widgets',
    logo: '/assets/connectors/2.png',
    status: 'available',
    tags: ['GraphQL', 'CI Widget'],
    details: { 
      target: 'gitlab.internal.acme.com', 
      policyEnforced: false, 
      autoPr: false,
      authType: 'Project Access Token' 
    }
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket Data Center',
    category: 'scm',
    categoryLabel: 'Source Control',
    description: 'Branch permission gating & lockfile ingestion',
    logo: '/assets/connectors/3.png',
    status: 'available',
    tags: ['REST v2', 'App Passwords'],
    details: { 
      target: 'bitbucket.acme.net', 
      policyEnforced: false, 
      autoPr: false,
      authType: 'Personal Access Token' 
    }
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps Repos',
    category: 'scm',
    categoryLabel: 'Source Control',
    description: 'Azure Repos scanning & build pipeline gates',
    logo: '/assets/connectors/4.jpeg',
    status: 'available',
    tags: ['Service Hooks', 'PAT Auth'],
    details: { 
      target: 'dev.azure.com/acme-infra', 
      policyEnforced: false, 
      autoPr: false,
      authType: 'Personal Access Token' 
    }
  },
  {
    id: 'npm-registry',
    name: 'npm Registry & Artifactory',
    category: 'registry',
    categoryLabel: 'Package Registry',
    description: 'Package metadata resolver & maintainer anomaly watch',
    logo: '/assets/connectors/5.png',
    status: 'connected',
    lastSync: '12m ago',
    scope: '18 Scopes',
    webhookHealth: '99.98% Health',
    tags: ['PURL Resolver', 'Audit Feed'],
    details: { 
      target: 'registry.npmjs.org + Artifactory Mirror', 
      policyEnforced: true,
      authType: 'Bearer Token Automation',
      monitoredCount: 18
    }
  },
  {
    id: 'maven-central',
    name: 'Maven Central & Nexus',
    category: 'registry',
    categoryLabel: 'Package Registry',
    description: 'Transitive JAR resolution & SHA-256 validation',
    logo: '/assets/connectors/6.png',
    status: 'connected',
    lastSync: '1h ago',
    scope: '320 Keystones',
    webhookHealth: '100% Health',
    tags: ['POM Parser', 'SHA-256 Check'],
    details: { 
      target: 'nexus.corp.acme.com', 
      policyEnforced: true,
      authType: 'User Token / Basic Auth',
      monitoredCount: 320
    }
  },
  {
    id: 'pypi-artifactory',
    name: 'PyPI & JFrog Artifactory',
    category: 'registry',
    categoryLabel: 'Package Registry',
    description: 'Python wheel inspection & lockfile resolution',
    logo: '/assets/connectors/7.png',
    status: 'available',
    tags: ['Wheel Inspector', 'Poetry Lock'],
    details: { 
      target: 'pypi.org + internal private index', 
      policyEnforced: false,
      authType: 'PyPI API Token' 
    }
  },
  {
    id: 'oci-harbor',
    name: 'Harbor & OCI Registry',
    category: 'registry',
    categoryLabel: 'Container Registry',
    description: 'Container base image SBOM extraction & provenance',
    logo: '/assets/connectors/8.png',
    status: 'available',
    tags: ['OCI Manifest', 'Syft SBOM'],
    details: { 
      target: 'harbor.cloud.acme.internal', 
      policyEnforced: false,
      authType: 'Robot Account Token' 
    }
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions Gate',
    category: 'ci',
    categoryLabel: 'CI / CD Gate',
    description: 'Fails PRs introducing vulnerable keystones',
    logo: '/assets/connectors/9.png',
    status: 'connected',
    lastSync: 'Live Webhook',
    scope: '42 Repos',
    webhookHealth: '1,420 Checks',
    tags: ['PR Gate', 'SARIF Export'],
    details: { 
      target: '.github/workflows/keystone-guard.yml', 
      policyEnforced: true,
      authType: 'GITHUB_TOKEN Action Secret',
      monitoredCount: 42
    }
  },
  {
    id: 'jenkins-plugin',
    name: 'Jenkins Enterprise',
    category: 'ci',
    categoryLabel: 'CI / CD Gate',
    description: 'Pipeline build step & blast-radius evaluation',
    logo: '/assets/connectors/10.png',
    status: 'available',
    tags: ['Pipeline Step', 'Build Gate'],
    details: { 
      target: 'jenkins.internal.acme.com:8443', 
      policyEnforced: false,
      authType: 'Jenkins API Token' 
    }
  },
  {
    id: 'slack-alerts',
    name: 'Slack Security Ops',
    category: 'alerts',
    categoryLabel: 'Incident & ChatOps',
    description: 'Real-time anomaly alerts & 1-click circuit break',
    logo: '/assets/connectors/11.png',
    status: 'connected',
    lastSync: 'Active Socket',
    scope: '#keystone-secops',
    webhookHealth: '< 50ms Lag',
    tags: ['Interactive Cards', '1-Click Sever'],
    details: { 
      target: 'Slack Workspace: AcmeCorp Infrastructure', 
      policyEnforced: true,
      authType: 'OAuth Bot Token',
      monitoredCount: 2
    }
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty SIFI Escalation',
    category: 'alerts',
    categoryLabel: 'Incident & ChatOps',
    description: 'Escalate on-call alerts for critical sink paths',
    logo: '/assets/connectors/12.png',
    status: 'connected',
    lastSync: 'Active Hook',
    scope: 'P1-Supply-Chain',
    webhookHealth: 'Zero Lag',
    tags: ['P1 Escalation', 'On-Call Page'],
    details: { 
      target: 'PD-SERVICE-KEYSTONE-P1', 
      policyEnforced: true,
      authType: 'Events API v2 Integration Key',
      monitoredCount: 1
    }
  },
  {
    id: 'jira-security',
    name: 'Jira Software Security',
    category: 'alerts',
    categoryLabel: 'Incident & ChatOps',
    description: 'Automated mitigation tickets & squad sprint sync',
    logo: '/assets/connectors/13.svg',
    status: 'available',
    tags: ['Sprint Sync', 'Mitigation Matrix'],
    details: { 
      target: 'acme.atlassian.net', 
      policyEnforced: false,
      authType: 'Atlassian API Token' 
    }
  }
];

export const ConnectorsPage: React.FC<ConnectorsPageProps> = ({ onOpenSBOMModal }) => {
  const { isLight } = useTheme();
  const [connectors, setConnectors] = useState<ConnectorItem[]>(INITIAL_CONNECTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'scm' | 'registry' | 'ci' | 'alerts'>('all');
  
  // Dynamic action states
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessId, setSyncSuccessId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  
  // Modals
  const [connectingConnector, setConnectingConnector] = useState<ConnectorItem | null>(null);
  const [selectedConfigConnector, setSelectedConfigConnector] = useState<ConnectorItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Connect wizard form fields
  const [wizardEndpoint, setWizardEndpoint] = useState('');
  const [wizardAuthToken, setWizardAuthToken] = useState('');
  const [wizardScope, setWizardScope] = useState<'all' | 'custom'>('all');
  const [wizardBranch, setWizardBranch] = useState('main, master, production');
  const [wizardAutoPr, setWizardAutoPr] = useState(true);
  const [wizardPolicyGate, setWizardPolicyGate] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Add custom connector fields
  const [newConnectorName, setNewConnectorName] = useState('');
  const [newConnectorCategory, setNewConnectorCategory] = useState<'scm' | 'registry' | 'ci' | 'alerts'>('scm');
  const [newConnectorUrl, setNewConnectorUrl] = useState('');
  const [newConnectorAuth, setNewConnectorAuth] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter connectors
  const filteredConnectors = connectors.filter(c => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const connectedCount = connectors.filter(c => c.status === 'connected').length;

  // Single sync action
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
      showToast('Ecosystem graph resynced.');
      setTimeout(() => setSyncSuccessId(null), 3000);
    }, 1200);
  };

  // Sync all connected connectors
  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      setConnectors(prev => prev.map(item => {
        if (item.status === 'connected') {
          return { ...item, lastSync: 'Just now' };
        }
        return item;
      }));
      showToast('All 6 active connectors resynced (42 repos updated).');
    }, 1600);
  };

  // Disconnect handler
  const handleDisconnect = (id: string, name: string) => {
    setConnectors(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'available',
          lastSync: undefined,
          scope: undefined,
          webhookHealth: undefined
        };
      }
      return item;
    }));
    showToast(`Disconnected ${name}.`);
  };

  // Open the Connect Wizard
  const handleOpenConnectWizard = (item: ConnectorItem) => {
    setConnectingConnector(item);
    setWizardEndpoint(item.details.target || '');
    setWizardAuthToken('');
    setWizardScope('all');
    setWizardBranch('main, master, production');
    setWizardAutoPr(true);
    setWizardPolicyGate(true);
    setConnectionTestResult(null);
  };

  // Test connection simulation in wizard
  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionTestResult({
        success: true,
        message: `Connected to ${wizardEndpoint || 'endpoint'}. 42 repositories discovered.`
      });
    }, 1100);
  };

  // Authorize & finalize connection in wizard
  const handleFinalizeConnection = () => {
    if (!connectingConnector) return;
    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      setConnectors(prev => prev.map(item => {
        if (item.id === connectingConnector.id) {
          return {
            ...item,
            status: 'connected',
            lastSync: 'Just now',
            scope: wizardScope === 'all' ? '42 Repos' : 'Tier-1 Core',
            webhookHealth: '100% Health',
            details: {
              ...item.details,
              target: wizardEndpoint || item.details.target,
              policyEnforced: wizardPolicyGate,
              autoPr: wizardAutoPr
            }
          };
        }
        return item;
      }));

      showToast(`Connected ${connectingConnector.name}!`);
      setConnectingConnector(null);
    }, 1000);
  };

  // Create custom connector handler
  const handleCreateCustomConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnectorName.trim()) return;

    const newId = `custom-${Date.now()}`;
    const categoryLabels = {
      scm: 'Source Control',
      registry: 'Package Registry',
      ci: 'CI / CD Gate',
      alerts: 'Incident & ChatOps'
    };

    const newItem: ConnectorItem = {
      id: newId,
      name: newConnectorName,
      category: newConnectorCategory,
      categoryLabel: categoryLabels[newConnectorCategory],
      description: `Custom ${categoryLabels[newConnectorCategory]} integration`,
      logo: '/assets/connectors/1.png',
      status: 'connected',
      lastSync: 'Just created',
      scope: 'Active Webhook',
      webhookHealth: '100% Health',
      tags: ['Custom Webhook', 'REST API'],
      details: {
        target: newConnectorUrl || 'https://api.internal.corp',
        policyEnforced: true,
        autoPr: false,
        authType: newConnectorAuth || 'Custom Bearer'
      }
    };

    setConnectors(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewConnectorName('');
    setNewConnectorUrl('');
    setNewConnectorAuth('');
    showToast(`Added connector "${newConnectorName}".`);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Top Header Banner - Reduced Text */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ks-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="low" icon={<Link2 className="w-3 h-3" />}>
                CONNECTIVITY ENGINE
              </Badge>
              <span className="text-xs text-slate-500">• 42 Repositories Active</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Connectors & Integrations
            </h1>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 font-sans">
              Continuous lockfile sync, transitive graph mapping, and CI/CD security gates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onOpenSBOMModal && (
              <button
                onClick={onOpenSBOMModal}
                className="btn-3d-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer select-none"
                title="Direct CycloneDX SBOM or Lockfile Upload (F1)"
              >
                <UploadCloud className="w-4 h-4 text-blue-500" />
                <span>Ingest SBOM</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  F1
                </span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-3d-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Connector</span>
            </button>
          </div>
        </div>

        {/* 3D Telemetry Status Ribbon - Streamlined */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="connector-3d-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Active Connectors</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{connectedCount}</span>
              <span className="text-xs text-slate-500 font-mono">/ {connectors.length} configured</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All healthy
              </span>
              <button
                onClick={handleSyncAll}
                disabled={isSyncingAll}
                className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Resync all active connections"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingAll ? 'animate-spin' : ''}`} />
                <span>Sync All</span>
              </button>
            </div>
          </div>

          <div className="connector-3d-card p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Monitored Repos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">42</span>
              <span className="text-xs text-slate-500 font-mono">Production Core</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Next scheduled diff in <strong className="text-slate-700 dark:text-slate-300">12m</strong>
            </div>
          </div>

          <div className="connector-3d-card p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Keystones Mapped</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1,489</span>
              <span className="text-xs text-slate-500 font-mono">transitive nodes</span>
            </div>
            <div className="text-[11px] text-rose-500 font-medium mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> 5 SIFI Escalations
            </div>
          </div>

          <div className="connector-3d-card p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Sync Reliability</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">99.98%</span>
              <span className="text-xs text-slate-500 font-mono">p99 &lt; 140ms</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              0 dropped delivery events
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-0.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl connector-3d-card overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: `All (${connectors.length})` },
              { id: 'scm', label: 'Source Control' },
              { id: 'registry', label: 'Registries' },
              { id: 'ci', label: 'CI / CD' },
              { id: 'alerts', label: 'Alerts' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap select-none ${
                  activeCategory === tab.id
                    ? 'btn-3d-primary text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter connectors..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border ks-border outline-hidden transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 3D Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnectors.map((item) => {
            const isConnected = item.status === 'connected';
            const isSyncing = syncingId === item.id;
            const isSuccess = syncSuccessId === item.id;

            return (
              <div
                key={item.id}
                className="connector-3d-card p-4 flex flex-col justify-between gap-3.5 select-none group"
              >
                <div>
                  {/* Card Header: 3D Logo Tile, Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* 3D Logo Tile */}
                      <div className="connector-3d-tile w-11 h-11 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <img 
                          src={item.logo} 
                          alt={item.name} 
                          className="w-full h-full object-contain" 
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight font-heading">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          {item.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isConnected ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700">
                          Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Concise 1-line Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 font-sans leading-snug">
                    {item.description}
                  </p>

                  {/* Micro-tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {item.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Connected Status Ribbon */}
                  {isConnected && (
                    <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.scope}</span>
                      <span>{item.lastSync}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.webhookHealth}</span>
                    </div>
                  )}
                </div>

                {/* 3D Action Buttons Footer */}
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  {isConnected ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTriggerSync(item.id)}
                          disabled={isSyncing}
                          className="btn-3d-secondary px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                          title="Run immediate lockfile differential scan"
                        >
                          {isSyncing ? (
                            <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                          ) : isSuccess ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{isSyncing ? 'Syncing...' : isSuccess ? 'Synced' : 'Sync'}</span>
                        </button>

                        <button
                          onClick={() => setSelectedConfigConnector(item)}
                          className="btn-3d-secondary p-1.5 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                          title="Configure Connector Parameters"
                        >
                          <Settings className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleDisconnect(item.id, item.name)}
                        className="text-[11px] text-slate-400 hover:text-rose-500 font-medium transition-colors cursor-pointer px-1"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenConnectWizard(item)}
                      className="btn-3d-primary w-full py-1.5 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect Integration</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          CONNECT INTEGRATION SETUP WIZARD MODAL
          ========================================================================= */}
      {connectingConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border ks-border p-6 shadow-2xl flex flex-col gap-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            
            {/* Modal Header with Logo */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl p-2 bg-white dark:bg-slate-800 border ks-border flex items-center justify-center shadow-xs shrink-0">
                  <img src={connectingConnector.logo} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-heading">Connect {connectingConnector.name}</h2>
                  <p className="text-xs text-slate-500">Configure Continuous Graph Ingestion & Safeguards</p>
                </div>
              </div>
              <button
                onClick={() => setConnectingConnector(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              {/* Endpoint URL */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">
                  Service Endpoint or Host URL *
                </label>
                <input
                  type="text"
                  value={wizardEndpoint}
                  onChange={e => setWizardEndpoint(e.target.value)}
                  placeholder="e.g., https://gitlab.internal.corp or api.github.com"
                  className="w-full px-3.5 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Authentication Credentials */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">
                  {connectingConnector.details.authType || 'Personal Access Token / API Key'} *
                </label>
                <input
                  type="password"
                  value={wizardAuthToken}
                  onChange={e => setWizardAuthToken(e.target.value)}
                  placeholder="Enter token or webhook secret (e.g., ghp_xxxxxxxxxxxxxxxxxxxx)"
                  className="w-full px-3.5 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Encrypted at rest with AES-256 GCM. Requires read scope for lockfiles and commit checks.
                </span>
              </div>

              {/* Scope Selection */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1.5">
                  Monitored Ingestion Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWizardScope('all')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardScope === 'all'
                        ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white'
                        : 'ks-border hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-semibold block text-xs">All Repositories (42)</span>
                    <span className="text-[10px] text-slate-500">Comprehensive org-wide topological map</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardScope('custom')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardScope === 'custom'
                        ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white'
                        : 'ks-border hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Tier-1 Sinks Only</span>
                    <span className="text-[10px] text-slate-500">Crown Jewels & payment infrastructure</span>
                  </button>
                </div>
              </div>

              {/* Policy Toggles */}
              <div className="p-3.5 rounded-xl border ks-border bg-slate-50/50 dark:bg-slate-950/40 flex flex-col gap-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white block">Pre-Merge Blast Radius Gates</span>
                    <span className="text-[11px] text-slate-500">Block PRs if transitive reachability to Tier-1 assets spikes.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={wizardPolicyGate}
                    onChange={e => setWizardPolicyGate(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </label>

                <div className="h-px bg-slate-200 dark:bg-slate-800" />

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white block">Automated Coordinated PR Generation</span>
                    <span className="text-[11px] text-slate-500">Dispatch minimum-cut remediations to squad codebases.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={wizardAutoPr}
                    onChange={e => setWizardAutoPr(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Connection Test Result */}
              {connectionTestResult && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{connectionTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t ks-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                icon={<Activity className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />}
              >
                {isTestingConnection ? 'Verifying...' : 'Test Connection'}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConnectingConnector(null)}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFinalizeConnection}
                  disabled={isAuthorizing}
                  icon={isAuthorizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                >
                  {isAuthorizing ? 'Authorizing...' : 'Authorize & Connect'}
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIGURATION & SETTINGS MODAL
          ========================================================================= */}
      {selectedConfigConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border ks-border p-6 shadow-2xl flex flex-col gap-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl p-1.5 bg-white dark:bg-slate-800 border ks-border flex items-center justify-center">
                  <img src={selectedConfigConnector.logo} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-heading">{selectedConfigConnector.name}</h2>
                  <p className="text-xs text-slate-500">Connector Settings & Ingestion Rules</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConfigConnector(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 py-2 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Target Endpoint / Host</label>
                <input
                  type="text"
                  readOnly
                  value={selectedConfigConnector.details.target}
                  className="w-full px-3 py-2 rounded-xl border ks-border font-mono bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border ks-border">
                <div>
                  <span className="font-semibold text-xs block">Automatic Coordinated PR Creation</span>
                  <span className="text-[11px] text-slate-500">Permit Keystone to draft and dispatch multi-repo remediation pull requests.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={selectedConfigConnector.details.autoPr ?? true}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border ks-border">
                <div>
                  <span className="font-semibold text-xs block">Strict Policy Enforcement</span>
                  <span className="text-[11px] text-slate-500">Fail CI checks if a PR elevates systemic fragility score above 75%.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={selectedConfigConnector.details.policyEnforced ?? true}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Active Webhook Secret Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value="whsec_994b210f88a91c32de782f9"
                    readOnly
                    className="flex-1 px-3 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => {
                      navigator.clipboard.writeText('whsec_994b210f88a91c32de782f9');
                      showToast('Copied webhook secret token.');
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t ks-border">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedConfigConnector(null);
                  showToast('Connector settings updated.');
                }}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD CUSTOM CONNECTOR MODAL
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleCreateCustomConnector} className="w-full max-w-md rounded-2xl border ks-border p-6 shadow-2xl flex flex-col gap-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-heading">Add Custom Connector</h2>
                <p className="text-xs text-slate-500">Connect Internal Git, On-Prem Registry, or Webhook</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="font-medium block mb-1">Connector Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Acme Staging Nexus or Internal GitLab Runner"
                  value={newConnectorName}
                  onChange={e => setNewConnectorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border ks-border text-xs bg-slate-50 dark:bg-slate-950 outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-medium block mb-1">Integration Category</label>
                <select
                  value={newConnectorCategory}
                  onChange={e => setNewConnectorCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border ks-border text-xs bg-slate-50 dark:bg-slate-950 outline-hidden focus:border-blue-500"
                >
                  <option value="scm">Source Code Management (SCM / Git)</option>
                  <option value="registry">Package / Container Registry</option>
                  <option value="ci">Continuous Integration (CI/CD Runner)</option>
                  <option value="alerts">Incident Response / Webhook</option>
                </select>
              </div>

              <div>
                <label className="font-medium block mb-1">API Endpoint / Service URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://gitlab.internal.corp/api/v4"
                  value={newConnectorUrl}
                  onChange={e => setNewConnectorUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-medium block mb-1">Authentication Secret or Bearer Token</label>
                <input
                  type="password"
                  placeholder="Optional secret or API token"
                  value={newConnectorAuth}
                  onChange={e => setNewConnectorAuth(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t ks-border">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
              >
                Create Connector
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

