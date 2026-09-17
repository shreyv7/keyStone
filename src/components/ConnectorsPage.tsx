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
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { PageHeader } from './ui/PageHeader';
import { MetricStrip } from './ui/MetricStrip';

export interface ConnectorsPageProps {
  onOpenSBOMModal?: () => void;
}

export interface CredentialField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'url' | 'select';
  defaultValue?: string;
  options?: string[];
  helperText?: string;
  required?: boolean;
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
  fields: CredentialField[];
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
    fields: [
      {
        id: 'endpoint',
        label: 'GitHub API / Enterprise Host URL',
        placeholder: 'https://api.github.com',
        type: 'url',
        defaultValue: 'https://api.github.com',
        required: true,
        helperText: 'For GitHub Enterprise Server, enter your on-premise URL (e.g., https://github.corp.internal/api/v3).'
      },
      {
        id: 'org',
        label: 'Organization / Owner Slug',
        placeholder: 'acme-corp',
        type: 'text',
        defaultValue: 'acme-corp',
        required: true
      },
      {
        id: 'authMethod',
        label: 'Authentication Method',
        placeholder: '',
        type: 'select',
        options: ['Personal Access Token (PAT)', 'GitHub App Installation (Private Key)'],
        defaultValue: 'Personal Access Token (PAT)'
      },
      {
        id: 'token',
        label: 'GitHub Personal Access Token (PAT)',
        placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: "Requires 'repo', 'read:org', and 'workflow' OAuth scopes."
      },
      {
        id: 'webhookSecret',
        label: 'Webhook HMAC Secret Token',
        placeholder: 'whsec_xxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        helperText: 'Used to cryptographically verify incoming pull request and push webhook events.'
      }
    ],
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
    fields: [
      {
        id: 'endpoint',
        label: 'GitLab Host URL',
        placeholder: 'https://gitlab.com',
        type: 'url',
        defaultValue: 'https://gitlab.com',
        required: true,
        helperText: 'For self-hosted GitLab, enter your instance host (e.g. https://gitlab.internal.acme.com).'
      },
      {
        id: 'groupPath',
        label: 'Group / Project Namespace Path',
        placeholder: 'engineering/core-services',
        type: 'text',
        required: true,
        helperText: 'Root group to recursively extract lockfiles and dependency trees from.'
      },
      {
        id: 'token',
        label: 'GitLab Personal / Project Access Token',
        placeholder: 'glpat-xxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: "Requires 'api', 'read_repository', and 'read_api' scopes."
      },
      {
        id: 'webhookSecret',
        label: 'GitLab Webhook Secret Token',
        placeholder: 'Enter secret token',
        type: 'password'
      }
    ],
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
    fields: [
      {
        id: 'endpoint',
        label: 'Bitbucket Server URL',
        placeholder: 'https://bitbucket.acme.net:7999',
        type: 'url',
        defaultValue: 'https://bitbucket.acme.net:7999',
        required: true
      },
      {
        id: 'projectKey',
        label: 'Project Key',
        placeholder: 'ACME',
        type: 'text',
        required: true
      },
      {
        id: 'username',
        label: 'Service Account Username',
        placeholder: 'svc-keystone-scanner',
        type: 'text',
        required: true
      },
      {
        id: 'appPassword',
        label: 'Bitbucket App Password / HTTP Access Token',
        placeholder: 'ATBBxxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: "Requires 'Repositories (Read/Write)' and 'Pull Requests (Read/Write)' permissions."
      }
    ],
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
    fields: [
      {
        id: 'orgUrl',
        label: 'Azure DevOps Organization URL',
        placeholder: 'https://dev.azure.com/acme-infra',
        type: 'url',
        defaultValue: 'https://dev.azure.com/acme-infra',
        required: true
      },
      {
        id: 'project',
        label: 'Project Name',
        placeholder: 'CoreInfrastructure',
        type: 'text',
        required: true
      },
      {
        id: 'pat',
        label: 'Personal Access Token (PAT)',
        placeholder: 'Enter Azure DevOps PAT',
        type: 'password',
        required: true,
        helperText: "Requires 'Code (Read & Status)', 'Build (Read & Execute)', and 'Service Connections' scopes."
      }
    ],
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
    fields: [
      {
        id: 'registryUrl',
        label: 'npm Registry URL / Mirror Endpoint',
        placeholder: 'https://registry.npmjs.org',
        type: 'url',
        defaultValue: 'https://registry.npmjs.org',
        required: true
      },
      {
        id: 'scope',
        label: 'Private Scope Prefix',
        placeholder: '@acme',
        type: 'text',
        defaultValue: '@acme',
        helperText: 'Packages matching this scope will trigger namespace confusion & squatting shields.'
      },
      {
        id: 'authToken',
        label: 'npm Automation / Read Token (_authToken)',
        placeholder: 'npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: 'Read-only automation token for querying package metadata and maintainer publish signatures.'
      }
    ],
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
    fields: [
      {
        id: 'nexusUrl',
        label: 'Nexus Repository Manager URL',
        placeholder: 'https://nexus.corp.acme.com/repository/maven-public',
        type: 'url',
        defaultValue: 'https://nexus.corp.acme.com/repository/maven-public',
        required: true
      },
      {
        id: 'repoName',
        label: 'Repository Name / Group ID',
        placeholder: 'maven-releases',
        type: 'text',
        defaultValue: 'maven-releases'
      },
      {
        id: 'username',
        label: 'Service Account Username',
        placeholder: 'nexus-reader',
        type: 'text',
        required: true
      },
      {
        id: 'userToken',
        label: 'Nexus Password / User Token',
        placeholder: 'Enter user token',
        type: 'password',
        required: true
      }
    ],
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
    fields: [
      {
        id: 'indexUrl',
        label: 'PyPI Simple Index URL',
        placeholder: 'https://pypi.org/simple',
        type: 'url',
        defaultValue: 'https://pypi.org/simple',
        required: true,
        helperText: 'For Artifactory, use https://artifactory.corp/api/pypi/pypi-local/simple.'
      },
      {
        id: 'apiToken',
        label: 'PyPI API Token',
        placeholder: 'pypi-AgEIcHlwaS5vcmc...',
        type: 'password',
        required: true,
        helperText: 'Global or project-scoped PyPI authentication token.'
      }
    ],
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
    fields: [
      {
        id: 'harborUrl',
        label: 'Harbor Registry Host URL',
        placeholder: 'https://harbor.cloud.acme.internal',
        type: 'url',
        defaultValue: 'https://harbor.cloud.acme.internal',
        required: true
      },
      {
        id: 'robotName',
        label: 'Harbor Robot Account Name',
        placeholder: 'robot$keystone-scanner',
        type: 'text',
        required: true
      },
      {
        id: 'robotSecret',
        label: 'Robot Account Secret Token',
        placeholder: 'Enter robot secret',
        type: 'password',
        required: true,
        helperText: "Requires 'repository:pull' and 'artifact:read' permissions to extract image layers."
      }
    ],
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
    fields: [
      {
        id: 'workflowPath',
        label: 'Keystone Guard Workflow Path',
        placeholder: '.github/workflows/keystone-guard.yml',
        type: 'text',
        defaultValue: '.github/workflows/keystone-guard.yml',
        required: true
      },
      {
        id: 'secretName',
        label: 'GitHub Actions Secret Name for Keystone API Key',
        placeholder: 'KEYSTONE_API_KEY',
        type: 'text',
        defaultValue: 'KEYSTONE_API_KEY'
      },
      {
        id: 'enforcementMode',
        label: 'Build Gate Enforcement Policy',
        placeholder: '',
        type: 'select',
        options: ['Block merge when dependency impact surges', 'Post PR comment and SARIF report only', 'Recommend a protected dependency update'],
        defaultValue: 'Block merge when dependency impact surges'
      }
    ],
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
    fields: [
      {
        id: 'jenkinsUrl',
        label: 'Jenkins Controller URL',
        placeholder: 'https://jenkins.internal.acme.com:8443',
        type: 'url',
        defaultValue: 'https://jenkins.internal.acme.com:8443',
        required: true
      },
      {
        id: 'userId',
        label: 'Jenkins Username',
        placeholder: 'keystone-ci',
        type: 'text',
        required: true
      },
      {
        id: 'apiToken',
        label: 'Jenkins User API Token',
        placeholder: '11xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: 'Found in Jenkins user profile -> Configure -> API Token.'
      },
      {
        id: 'jobPattern',
        label: 'Monitored Pipeline Job Pattern',
        placeholder: 'Deployments/*, Release/*',
        type: 'text',
        defaultValue: 'Deployments/*'
      }
    ],
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
    fields: [
      {
        id: 'workspaceUrl',
        label: 'Slack Workspace Domain',
        placeholder: 'acmecorp.slack.com',
        type: 'text',
        defaultValue: 'acmecorp.slack.com',
        required: true
      },
      {
        id: 'botToken',
        label: 'Bot User OAuth Token',
        placeholder: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: "Requires 'chat:write', 'channels:read', and 'incoming-webhook' bot permissions."
      },
      {
        id: 'defaultChannel',
        label: 'Default Alert Channel',
        placeholder: '#keystone-secops',
        type: 'text',
        defaultValue: '#keystone-secops',
        required: true
      }
    ],
    details: { 
      target: 'Slack Workspace: AcmeCorp Infrastructure', 
      policyEnforced: true,
      authType: 'OAuth Bot Token',
      monitoredCount: 2
    }
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty Risk Escalation',
    category: 'alerts',
    categoryLabel: 'Incident & ChatOps',
    description: 'Escalate on-call alerts for critical sink paths',
    logo: '/assets/connectors/12.png',
    status: 'connected',
    lastSync: 'Active Hook',
    scope: 'P1-Supply-Chain',
    webhookHealth: 'Zero Lag',
    tags: ['P1 Escalation', 'On-Call Page'],
    fields: [
      {
        id: 'routingKey',
        label: 'Events API v2 Integration Routing Key',
        placeholder: '32-character hexadecimal key (e.g. 0123456789abcdef0123456789abcdef)',
        type: 'password',
        required: true,
        helperText: 'Found in PagerDuty Service -> Integrations -> Events API v2.'
      },
      {
        id: 'serviceId',
        label: 'PagerDuty Service ID',
        placeholder: 'PD-SERVICE-KEYSTONE-P1',
        type: 'text',
        defaultValue: 'PD-SERVICE-KEYSTONE-P1'
      },
      {
        id: 'urgency',
        label: 'Trigger Incident Urgency',
        placeholder: '',
        type: 'select',
        options: ['High (Immediate SMS & Phone Page)', 'Dynamic based on Crown Jewel blast radius', 'Low (Email only)'],
        defaultValue: 'High (Immediate SMS & Phone Page)'
      }
    ],
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
    fields: [
      {
        id: 'siteUrl',
        label: 'Atlassian Jira Site URL',
        placeholder: 'https://acme.atlassian.net',
        type: 'url',
        defaultValue: 'https://acme.atlassian.net',
        required: true
      },
      {
        id: 'userEmail',
        label: 'Atlassian Service Account Email',
        placeholder: 'secops@acme.com',
        type: 'text',
        required: true
      },
      {
        id: 'apiToken',
        label: 'Atlassian API Token',
        placeholder: 'ATATT3xFfGF0xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'password',
        required: true,
        helperText: 'Created from id.atlassian.com/manage-profile/security/api-tokens.'
      },
      {
        id: 'projectKey',
        label: 'Target Jira Project Key',
        placeholder: 'SEC',
        type: 'text',
        defaultValue: 'SEC',
        required: true
      },
      {
        id: 'issueType',
        label: 'Default Issue Type',
        placeholder: '',
        type: 'select',
        options: ['Vulnerability', 'Security Task', 'Bug', 'Epic'],
        defaultValue: 'Vulnerability'
      }
    ],
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

  // Dynamic connect wizard state
  const [wizardFormData, setWizardFormData] = useState<Record<string, string>>({});
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [wizardScope, setWizardScope] = useState<'all' | 'custom'>('all');
  const [wizardBranch, setWizardBranch] = useState('main, master, production');
  const [wizardAutoPr, setWizardAutoPr] = useState(true);
  const [wizardPolicyGate, setWizardPolicyGate] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Toggle password visibility
  const toggleShowPassword = (fieldId: string) => {
    setShowPasswordMap(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  // Handle dynamic field changes
  const handleFieldChange = (fieldId: string, value: string) => {
    setWizardFormData(prev => ({ ...prev, [fieldId]: value }));
    if (connectionTestResult) setConnectionTestResult(null);
  };

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

  // Open the Connect Wizard with connector-specific fields
  const handleOpenConnectWizard = (item: ConnectorItem) => {
    setConnectingConnector(item);
    const initialVals: Record<string, string> = {};
    if (item.fields) {
      item.fields.forEach(field => {
        initialVals[field.id] = field.defaultValue || '';
      });
    }
    setWizardFormData(initialVals);
    setShowPasswordMap({});
    setWizardScope('all');
    setWizardBranch('main, master, production');
    setWizardAutoPr(true);
    setWizardPolicyGate(true);
    setConnectionTestResult(null);
  };

  // Test connection simulation using specific credentials
  const handleTestConnection = () => {
    if (!connectingConnector) return;

    // Validate required fields
    const missingFields = connectingConnector.fields?.filter(f => f.required && !wizardFormData[f.id]?.trim());
    if (missingFields && missingFields.length > 0) {
      setConnectionTestResult({
        success: false,
        message: `Please fill in required field: ${missingFields[0].label}`
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionTestResult(null);

    setTimeout(() => {
      setIsTestingConnection(false);

      // Authentic handshake feedback message per connector
      let feedback = `Successfully authenticated with ${connectingConnector.name}.`;
      const id = connectingConnector.id;

      if (id === 'github-app') {
        const org = wizardFormData.org || 'acme-corp';
        feedback = `Connected to ${wizardFormData.endpoint || 'api.github.com'}. Verified org "${org}" with OAuth permissions (repo, read:org). 42 repositories discovered.`;
      } else if (id === 'gitlab') {
        feedback = `Connected to ${wizardFormData.endpoint || 'gitlab.com'}. Namespace "${wizardFormData.groupPath || 'engineering'}" resolved with 28 project repositories.`;
      } else if (id === 'bitbucket') {
        feedback = `Connected to ${wizardFormData.endpoint}. User "${wizardFormData.username}" authenticated for project "${wizardFormData.projectKey}". 16 repos indexed.`;
      } else if (id === 'azure-devops') {
        feedback = `Connected to ${wizardFormData.orgUrl}. Project "${wizardFormData.project}" pipeline service hooks active.`;
      } else if (id === 'npm-registry') {
        feedback = `Registry mirror at ${wizardFormData.registryUrl} active. Scope "${wizardFormData.scope}" audit feed synchronized.`;
      } else if (id === 'maven-central') {
        feedback = `Nexus Repository Manager at ${wizardFormData.nexusUrl} verified. Read permissions confirmed for "${wizardFormData.repoName}".`;
      } else if (id === 'pypi-artifactory') {
        feedback = `PyPI Simple index responding at ${wizardFormData.indexUrl}. API Token authorized for package dependency inspection.`;
      } else if (id === 'oci-harbor') {
        feedback = `Harbor OCI Registry at ${wizardFormData.harborUrl} verified. Robot account "${wizardFormData.robotName}" layer pull authorized.`;
      } else if (id === 'github-actions') {
        feedback = `Workflow file validated at ${wizardFormData.workflowPath}. Keystone API Key secret "${wizardFormData.secretName}" acknowledged.`;
      } else if (id === 'jenkins-plugin') {
        feedback = `Jenkins Controller responding at ${wizardFormData.jenkinsUrl}. User token authenticated for jobs "${wizardFormData.jobPattern}".`;
      } else if (id === 'slack-alerts') {
        feedback = `Slack Bot OAuth validated for ${wizardFormData.workspaceUrl}. Alert dispatcher test ping acknowledged in ${wizardFormData.defaultChannel}.`;
      } else if (id === 'pagerduty') {
        feedback = `PagerDuty Events API v2 routing key verified for Service "${wizardFormData.serviceId}". Heartbeat test confirmed.`;
      } else if (id === 'jira-security') {
        feedback = `Atlassian Jira API authorized for ${wizardFormData.siteUrl}. Project key "${wizardFormData.projectKey}" confirmed with "${wizardFormData.issueType}" issue type.`;
      }

      setConnectionTestResult({
        success: true,
        message: feedback
      });
    }, 1000);
  };

  // Authorize & finalize connection in wizard
  const handleFinalizeConnection = () => {
    if (!connectingConnector) return;

    // Validate required fields before finalizing
    const missingFields = connectingConnector.fields?.filter(f => f.required && !wizardFormData[f.id]?.trim());
    if (missingFields && missingFields.length > 0) {
      setConnectionTestResult({
        success: false,
        message: `Please fill in required field: ${missingFields[0].label}`
      });
      return;
    }

    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      setConnectors(prev => prev.map(item => {
        if (item.id === connectingConnector.id) {
          const targetUrl = wizardFormData.endpoint || 
                            wizardFormData.orgUrl || 
                            wizardFormData.registryUrl || 
                            wizardFormData.nexusUrl || 
                            wizardFormData.indexUrl || 
                            wizardFormData.harborUrl || 
                            wizardFormData.jenkinsUrl || 
                            wizardFormData.workspaceUrl || 
                            wizardFormData.siteUrl || 
                            item.details.target;

          return {
            ...item,
            status: 'connected',
            lastSync: 'Just now',
            scope: item.scope || (wizardScope === 'all' ? '42 repositories' : 'Critical services'),
            webhookHealth: '100% Health',
            details: {
              ...item.details,
              target: targetUrl,
              policyEnforced: wizardPolicyGate,
              autoPr: wizardAutoPr
            }
          };
        }
        return item;
      }));

      showToast(`Connected ${connectingConnector.name}!`);
      setConnectingConnector(null);
    }, 900);
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
      fields: [
        {
          id: 'endpoint',
          label: 'Service Endpoint or Host URL',
          placeholder: 'https://api.internal.corp',
          type: 'url',
          defaultValue: newConnectorUrl || 'https://api.internal.corp',
          required: true
        },
        {
          id: 'authToken',
          label: 'Authentication Secret / Bearer Token',
          placeholder: 'Enter token or secret',
          type: 'password',
          defaultValue: newConnectorAuth,
          required: false
        }
      ],
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
    <div className="w-full h-full overflow-y-auto px-4 py-5 sm:px-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}

        <PageHeader
          title="Connectors"
          description="Manage the sources Keystone monitors and quickly resolve connections that need attention."
          primaryAction={
            <button onClick={() => setIsAddModalOpen(true)} className="ks-btn ks-btn-primary ks-btn-md">
              <Plus className="w-4 h-4" />
              <span>Add connector</span>
            </button>
          }
          secondaryActions={onOpenSBOMModal ? (
              <button
                onClick={onOpenSBOMModal}
                className="ks-btn ks-btn-secondary ks-btn-md"
                title="Connect Repository / Import Dependencies"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Import data</span>
              </button>
            ) : undefined}
        />

        <MetricStrip items={[
          { label: 'Connected sources', value: `${connectedCount} of ${connectors.length}`, detail: 'All connected sources are healthy', tone: 'healthy' },
          { label: 'Repositories monitored', value: '42', detail: 'Production scope', tone: 'info' },
          { label: 'Next sync', value: '12 minutes', detail: 'No failed deliveries', tone: 'neutral' },
        ]} />

        <div className="flex justify-end">
          <button onClick={handleSyncAll} disabled={isSyncingAll} className="ks-btn ks-btn-ghost ks-btn-sm">
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing sources...' : 'Sync all sources'}</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-0.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 overflow-x-auto w-full sm:w-auto">
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
                    ? 'bg-[#2f2fe4] text-white'
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

        {/* 3D Connectors Grid - items-start preserves sibling stability */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {filteredConnectors.map((item) => {
            const isConnected = item.status === 'connected';
            const isSyncing = syncingId === item.id;
            const isSuccess = syncSuccessId === item.id;

            return (
              <div
                key={item.id}
                className="connector-3d-card p-4 flex flex-col justify-between gap-3 select-none group"
              >
                <div>
                  {/* Card Header: 3D Logo Tile, Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* 3D Logo Tile */}
                      <div className="connector-3d-tile w-11 h-11 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
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

                  {/* Stable Resting Telemetry Line (Zero layout shift) */}
                  <div className="flex items-center justify-between text-[11px] font-mono mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 text-slate-500 dark:text-slate-400">
                    <span className="truncate font-medium text-[10px]">
                      {isConnected ? item.scope : `${item.fields?.length || 3} parameters`}
                    </span>
                    <span className="text-[10px] text-blue-500 font-sans font-semibold flex items-center gap-0.5 shrink-0 ml-2 group-hover:text-blue-400 transition-colors">
                      {isConnected ? (
                        <span className="text-emerald-500 font-mono font-semibold">{item.webhookHealth}</span>
                      ) : (
                        <><span>Details</span><ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" /></>
                      )}
                    </span>
                  </div>

                  {/* Fluid Hardware-Accelerated Drawer (Buttery 60fps hover reveal) */}
                  <div className="connector-expand-drawer">
                    <div className="connector-expand-inner">
                      <div className="pt-2.5 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 ease-out delay-75 border-t border-slate-200/40 dark:border-slate-800/60 mt-1">
                        {/* Concise Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-snug">
                          {item.description}
                        </p>

                        {/* Micro-tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Telemetry / Target specs */}
                        <div className="px-2 py-1 rounded-md bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                          <span className="truncate">Target: {item.details.target}</span>
                          <span className="text-blue-500 font-medium shrink-0 ml-1">
                            {isConnected ? item.lastSync : 'Ready to link'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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
          CONNECT INTEGRATION SETUP WIZARD MODAL - DYNAMIC CREDENTIAL FIELDS
          ========================================================================= */}
      {connectingConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] rounded-2xl border ks-border shadow-2xl flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden">
            
            {/* Modal Header with 3D Tile */}
            <div className="p-6 pb-4 flex items-start justify-between border-b ks-border shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="connector-3d-tile w-12 h-12 p-2 flex items-center justify-center shrink-0">
                  <img src={connectingConnector.logo} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-heading">{connectingConnector.name}</h2>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold">
                      {connectingConnector.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Configure authentic credentials & telemetry pipeline</p>
                </div>
              </div>
              <button
                onClick={() => setConnectingConnector(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              
              {/* Dynamic Credential Fields */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between pb-1 border-b ks-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Required Credentials & API Parameters
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    AES-256 GCM Encrypted
                  </span>
                </div>

                {connectingConnector.fields && connectingConnector.fields.length > 0 ? (
                  connectingConnector.fields.map(field => {
                    const isPassword = field.type === 'password';
                    const showPass = showPasswordMap[field.id];
                    const inputType = isPassword ? (showPass ? 'text' : 'password') : (field.type === 'url' ? 'url' : 'text');

                    return (
                      <div key={field.id} className="flex flex-col gap-1">
                        <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                          <span>
                            {field.label} {field.required && <span className="text-rose-500">*</span>}
                          </span>
                        </label>

                        {field.type === 'select' ? (
                          <select
                            value={wizardFormData[field.id] ?? (field.defaultValue || '')}
                            onChange={e => handleFieldChange(field.id, e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border ks-border font-sans text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-hidden focus:border-blue-500"
                          >
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <input
                              type={inputType}
                              value={wizardFormData[field.id] ?? ''}
                              onChange={e => handleFieldChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className={`w-full px-3.5 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-hidden focus:border-blue-500 ${isPassword ? 'pr-10' : ''}`}
                            />
                            {isPassword && (
                              <button
                                type="button"
                                onClick={() => toggleShowPassword(field.id)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                title={showPass ? 'Hide secret' : 'Show secret'}
                              >
                                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        )}

                        {field.helperText && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            {field.helperText}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">
                      Endpoint / Host URL *
                    </label>
                    <input
                      type="text"
                      value={wizardFormData['endpoint'] || ''}
                      onChange={e => handleFieldChange('endpoint', e.target.value)}
                      placeholder="https://api.service.internal"
                      className="w-full px-3.5 py-2 rounded-xl border ks-border font-mono text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-hidden focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Scope Selection */}
              <div className="pt-2 border-t ks-border">
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1.5">
                  Topological Ingestion Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWizardScope('all')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardScope === 'all'
                        ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white ring-1 ring-blue-500'
                        : 'ks-border hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Org-Wide Full Mesh</span>
                    <span className="text-[10px] text-slate-500">Continuous scans of all discovered assets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardScope('custom')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      wizardScope === 'custom'
                        ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white ring-1 ring-blue-500'
                        : 'ks-border hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Critical services only</span>
                    <span className="text-[10px] text-slate-500">Restricted to Crown Jewels & sensitive sinks</span>
                  </button>
                </div>
              </div>

              {/* Policy Toggles */}
              <div className="p-3.5 rounded-xl border ks-border bg-slate-50/50 dark:bg-slate-950/40 flex flex-col gap-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white block">Pre-Merge Blast Radius Gates</span>
                    <span className="text-[11px] text-slate-500">Enforce gating checks if reachability to critical sinks elevates.</span>
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
                <div className={`p-3 rounded-xl flex items-start gap-2 text-xs animate-in fade-in ${
                  connectionTestResult.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400'
                }`}>
                  {connectionTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{connectionTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Modal Footer with 3D Buttons */}
            <div className="p-4 px-6 border-t ks-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="btn-3d-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Activity className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin text-blue-500' : 'text-slate-500'}`} />
                <span>{isTestingConnection ? 'Verifying...' : 'Test Connection'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConnectingConnector(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleFinalizeConnection}
                  disabled={isAuthorizing}
                  className="btn-3d-primary px-4 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {isAuthorizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Authorize & Connect</span>
                    </>
                  )}
                </button>
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
