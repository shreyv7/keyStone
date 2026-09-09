import { EcosystemNode, EcosystemEdge, PropagationPath, MitigationCandidate, KeystoneStats } from '../types';

export const KEYSTONE_STATS: KeystoneStats = {
  repositories: 42,
  criticalDependencies: 7,
  tier1Assets: 12,
  activeStructuralRisks: 5,
  sifiConcentrationRatio: 81 // 81% in top 5
};

export const MOCK_NODES: EcosystemNode[] = [
  // ==========================================
  // LAYER 1: FOUNDATIONAL OPEN SOURCE PACKAGES
  // ==========================================
  {
    id: 'snakeyaml',
    name: 'snakeyaml',
    version: '1.33',
    category: 'keystone',
    layer: 1,
    position: [0, -32, 0],
    structuralRisk: 'critical',
    reversePageRank: 0.98,
    reversePageRankPercentile: 98,
    betweennessPercentile: 99,
    articulationPoint: true,
    maintainers: 1,
    weeklyDownloads: '48M',
    dependents: 21,
    tier1Reach: 4,
    conventionalScore: 48,
    conventionalSeverity: 'MODERATE',
    systemicScore: 84,
    summary: 'Systemic chokepoint. Sits at an articulation cut-vertex dominating data parsing across multiple mission-critical service pipelines.',
    stealthSignals: ['NEW_DEPENDENCY_IN_PATCH', 'FRESH_MAINTAINER'],
    operationalDomain: 'Data Serialization & Parsing',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 38,
      centralityReason: 'In top 0.5% of dependency paths (Betweenness & Reverse PageRank)',
      fragilityPts: 22,
      fragilityReason: '48M weekly downloads / 1 unfunded maintainer (Bus Factor 1)',
      assetExposurePts: 16,
      assetExposureReason: 'Direct transitive path to 4 Tier-1 services (Payment, Auth, Checkout, Fraud)',
      exploitationPts: 8,
      exploitationReason: 'Known deserialization gadget chain vector (CVE-2022-1471)',
      totalScore: 84
    }
  },
  {
    id: 'minimist',
    name: 'minimist',
    version: '0.0.8',
    category: 'open-source',
    layer: 1,
    position: [-18, -30, -12],
    structuralRisk: 'high',
    reversePageRank: 0.94,
    reversePageRankPercentile: 94,
    betweennessPercentile: 92,
    articulationPoint: false,
    maintainers: 1,
    weeklyDownloads: '62M',
    dependents: 14,
    tier1Reach: 2,
    conventionalScore: 56,
    conventionalSeverity: 'MODERATE',
    systemicScore: 78,
    summary: 'High-centrality argument parsing library with prototype pollution exposure.',
    operationalDomain: 'CLI Argument Parsing',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 32,
      centralityReason: 'In top 2% of dependency traversal paths',
      fragilityPts: 24,
      fragilityReason: 'Single inactive author with over 60M weekly downloads',
      assetExposurePts: 12,
      assetExposureReason: 'Touches 2 Tier-1 mission-critical gateways',
      exploitationPts: 10,
      exploitationReason: 'Prototype pollution vector (CVE-2020-7598)',
      totalScore: 78
    }
  },
  {
    id: 'lodash',
    name: 'lodash',
    version: '4.17.21',
    category: 'open-source',
    layer: 1,
    position: [18, -29, 14],
    structuralRisk: 'medium',
    reversePageRank: 0.88,
    reversePageRankPercentile: 88,
    betweennessPercentile: 85,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: '85M',
    dependents: 28,
    tier1Reach: 3,
    conventionalScore: 42,
    conventionalSeverity: 'LOW',
    systemicScore: 61,
    summary: 'Ubiquitous utility library with wide distribution but multiple redundant fallbacks.',
    operationalDomain: 'Core Utility',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 26,
      centralityReason: 'High breadth across multi-tenant applications',
      fragilityPts: 14,
      fragilityReason: 'Active multi-maintainer committee',
      assetExposurePts: 15,
      assetExposureReason: 'Reached by 3 Tier-1 application trees',
      exploitationPts: 6,
      exploitationReason: 'Prototype injection patched in minor release',
      totalScore: 61
    }
  },
  {
    id: 'protobuf-lite',
    name: 'protobuf-lite',
    version: '3.19.4',
    category: 'open-source',
    layer: 1,
    position: [-10, -33, 16],
    structuralRisk: 'medium',
    reversePageRank: 0.81,
    reversePageRankPercentile: 81,
    betweennessPercentile: 79,
    articulationPoint: false,
    maintainers: 6,
    weeklyDownloads: '19M',
    dependents: 9,
    tier1Reach: 2,
    conventionalScore: 35,
    conventionalSeverity: 'LOW',
    systemicScore: 54,
    summary: 'Binary serialization framework used in low-latency RPC channels.',
    operationalDomain: 'Protobuf Wire Format',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 22,
      centralityReason: 'Shared serialization format across telemetry and data brokers',
      fragilityPts: 8,
      fragilityReason: 'Institutional stewardship (Open Source consortium)',
      assetExposurePts: 18,
      assetExposureReason: 'Direct pipeline connection to streaming analytics',
      exploitationPts: 6,
      exploitationReason: 'Buffer overrun edge cases in untrusted streams',
      totalScore: 54
    }
  },
  {
    id: 'semver',
    name: 'semver',
    version: '7.3.5',
    category: 'open-source',
    layer: 1,
    position: [24, -31, -8],
    structuralRisk: 'low',
    reversePageRank: 0.72,
    reversePageRankPercentile: 72,
    betweennessPercentile: 65,
    articulationPoint: false,
    maintainers: 4,
    weeklyDownloads: '98M',
    dependents: 18,
    tier1Reach: 1,
    conventionalScore: 28,
    conventionalSeverity: 'LOW',
    systemicScore: 42,
    summary: 'Standard SemVer parser used across build chains and runtime config loaders.',
    operationalDomain: 'Version Resolution',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 18,
      centralityReason: 'Broad adoption across build scripts and runtime validation',
      fragilityPts: 10,
      fragilityReason: 'Well maintained with active test suites',
      assetExposurePts: 10,
      assetExposureReason: 'Isolated to configuration loaders',
      exploitationPts: 4,
      exploitationReason: 'ReDoS vulnerabilities mitigated in modern Node runtimes',
      totalScore: 42
    }
  },
  {
    id: 'ws-util',
    name: 'ws-util',
    version: '2.1.0',
    category: 'open-source',
    layer: 1,
    position: [-26, -28, 4],
    structuralRisk: 'medium',
    reversePageRank: 0.76,
    reversePageRankPercentile: 76,
    betweennessPercentile: 71,
    articulationPoint: false,
    maintainers: 2,
    weeklyDownloads: '12M',
    dependents: 8,
    tier1Reach: 2,
    conventionalScore: 50,
    conventionalSeverity: 'MODERATE',
    systemicScore: 59,
    summary: 'WebSocket frame utility layer handling socket multiplexing.',
    operationalDomain: 'Real-time Transport',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 24,
      centralityReason: 'Used in live event streaming infrastructure',
      fragilityPts: 18,
      fragilityReason: 'Small maintainer footprint',
      assetExposurePts: 12,
      assetExposureReason: 'Reaches live checkout and notification feeds',
      exploitationPts: 5,
      exploitationReason: 'Connection exhaust exhaustion vector',
      totalScore: 59
    }
  },
  {
    id: 'debug',
    name: 'debug',
    version: '4.3.4',
    category: 'open-source',
    layer: 1,
    position: [8, -34, -22],
    structuralRisk: 'low',
    reversePageRank: 0.65,
    reversePageRankPercentile: 65,
    betweennessPercentile: 58,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: '140M',
    dependents: 32,
    tier1Reach: 1,
    conventionalScore: 20,
    conventionalSeverity: 'LOW',
    systemicScore: 36,
    summary: 'Lightweight logging toggle library. Widely transitive, low risk.',
    operationalDomain: 'Diagnostics',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 15,
      centralityReason: 'Transitive in almost every node library',
      fragilityPts: 8,
      fragilityReason: 'Stable API without active churn',
      assetExposurePts: 8,
      assetExposureReason: 'Non-executable on security critical execution paths',
      exploitationPts: 5,
      exploitationReason: 'ReDoS formatting vector in regex wrapper',
      totalScore: 36
    }
  },

  // ==========================================
  // LAYER 2: SHARED INTERNAL LIBRARIES
  // ==========================================
  {
    id: 'internal-data-pipeline',
    name: 'internal-data-pipeline',
    version: '2.4.0',
    category: 'internal-lib',
    layer: 2,
    position: [-4, -14, -6],
    structuralRisk: 'high',
    reversePageRank: 0.95,
    reversePageRankPercentile: 96,
    betweennessPercentile: 97,
    articulationPoint: true,
    maintainers: 2,
    weeklyDownloads: 'Internal',
    dependents: 16,
    tier1Reach: 4,
    conventionalScore: 30,
    conventionalSeverity: 'LOW',
    systemicScore: 76,
    summary: 'Enterprise data ingestion pipe. Bridges snakeyaml to core transactional engines. Target node for minimum-cut intervention.',
    operationalDomain: 'Core Ingestion Infrastructure',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 34,
      centralityReason: 'Single dominant bridge connecting parse tier to platform services',
      fragilityPts: 16,
      fragilityReason: 'Internal library maintained by small platform core team',
      assetExposurePts: 22,
      assetExposureReason: 'Passes payload data directly to Payment and Order processing',
      exploitationPts: 4,
      exploitationReason: 'No native CVEs; susceptible to upstream unmarshaling payload',
      totalScore: 76
    }
  },
  {
    id: 'internal-auth',
    name: 'internal-auth',
    version: '3.1.2',
    category: 'internal-lib',
    layer: 2,
    position: [12, -15, 6],
    structuralRisk: 'high',
    reversePageRank: 0.92,
    reversePageRankPercentile: 93,
    betweennessPercentile: 94,
    articulationPoint: true,
    maintainers: 3,
    weeklyDownloads: 'Internal',
    dependents: 15,
    tier1Reach: 3,
    conventionalScore: 38,
    conventionalSeverity: 'LOW',
    systemicScore: 74,
    summary: 'Organizational JWT, session token validation and IAM policy evaluation.',
    operationalDomain: 'Identity and Access Management',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 32,
      centralityReason: 'Required auth filter for all inbound gateway requests',
      fragilityPts: 14,
      fragilityReason: 'Dedicated enterprise IAM squad',
      assetExposurePts: 24,
      assetExposureReason: 'Direct root access to Auth/IAM Tier-1 cluster',
      exploitationPts: 4,
      exploitationReason: 'Config unmarshaling vulnerability via snakeyaml parser',
      totalScore: 74
    }
  },
  {
    id: 'api-core',
    name: 'api-core',
    version: '1.9.0',
    category: 'internal-lib',
    layer: 2,
    position: [-16, -16, 12],
    structuralRisk: 'medium',
    reversePageRank: 0.86,
    reversePageRankPercentile: 87,
    betweennessPercentile: 88,
    articulationPoint: false,
    maintainers: 4,
    weeklyDownloads: 'Internal',
    dependents: 12,
    tier1Reach: 2,
    conventionalScore: 25,
    conventionalSeverity: 'LOW',
    systemicScore: 62,
    summary: 'Standardized RPC wrapper and request routing abstractions.',
    operationalDomain: 'RPC & Routing Middleware',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 28,
      centralityReason: 'Shared across merchant portal and checkout endpoints',
      fragilityPts: 12,
      fragilityReason: 'Standard framework library',
      assetExposurePts: 18,
      assetExposureReason: 'Routes traffic into Order Processing Core',
      exploitationPts: 4,
      exploitationReason: 'Header sanitization propagation risk',
      totalScore: 62
    }
  },
  {
    id: 'analytics-lib',
    name: 'analytics-lib',
    version: '4.0.1',
    category: 'internal-lib',
    layer: 2,
    position: [20, -13, -14],
    structuralRisk: 'medium',
    reversePageRank: 0.82,
    reversePageRankPercentile: 83,
    betweennessPercentile: 82,
    articulationPoint: false,
    maintainers: 2,
    weeklyDownloads: 'Internal',
    dependents: 10,
    tier1Reach: 2,
    conventionalScore: 22,
    conventionalSeverity: 'LOW',
    systemicScore: 58,
    summary: 'Event normalization and ingestion stream adapter.',
    operationalDomain: 'Telemetry & Behavioral Feeds',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 24,
      centralityReason: 'Taps every business transaction for behavioral fraud feeds',
      fragilityPts: 14,
      fragilityReason: 'Maintained by data engineering',
      assetExposurePts: 16,
      assetExposureReason: 'Direct event streaming into Realtime Risk Engine',
      exploitationPts: 4,
      exploitationReason: 'Downstream unpickling vector',
      totalScore: 58
    }
  },
  {
    id: 'telemetry-sdk',
    name: 'telemetry-sdk',
    version: '1.2.4',
    category: 'internal-lib',
    layer: 2,
    position: [0, -17, 18],
    structuralRisk: 'low',
    reversePageRank: 0.70,
    reversePageRankPercentile: 70,
    betweennessPercentile: 68,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: 'Internal',
    dependents: 11,
    tier1Reach: 1,
    conventionalScore: 18,
    conventionalSeverity: 'LOW',
    systemicScore: 40,
    summary: 'OpenTelemetry collector export shim for microservices metrics.',
    operationalDomain: 'Observability',
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 16,
      centralityReason: 'Broad presence on internal service runtimes',
      fragilityPts: 10,
      fragilityReason: 'Active SRE guild maintenance',
      assetExposurePts: 10,
      assetExposureReason: 'Isolated out-of-band monitoring channels',
      exploitationPts: 4,
      exploitationReason: 'Log injection sanitization issues',
      totalScore: 40
    }
  },

  // ==========================================
  // LAYER 3: PLATFORM SERVICES
  // ==========================================
  {
    id: 'payment-service',
    name: 'Payment Service',
    version: '3.4.1',
    category: 'service',
    layer: 3,
    position: [-14, 2, -8],
    structuralRisk: 'critical',
    reversePageRank: 0.96,
    reversePageRankPercentile: 97,
    betweennessPercentile: 95,
    articulationPoint: true,
    maintainers: 5,
    weeklyDownloads: 'Internal',
    dependents: 8,
    tier1Reach: 2,
    conventionalScore: 20,
    conventionalSeverity: 'LOW',
    systemicScore: 82,
    summary: 'Core payment transaction processor handling credit and debit orchestrations.',
    operationalDomain: 'Financial Processing',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 36,
      centralityReason: 'Direct gateway to Payment Gateway Tier-1 crown jewel',
      fragilityPts: 12,
      fragilityReason: 'Dedicated Payments Core Engineering squad',
      assetExposurePts: 30,
      assetExposureReason: 'PCI-DSS Tier-1 high regulatory surface area',
      exploitationPts: 4,
      exploitationReason: 'Vulnerable to transitive payload deserialization',
      totalScore: 82
    }
  },
  {
    id: 'auth-session-manager',
    name: 'auth-session-manager',
    version: '2.0.4',
    category: 'service',
    layer: 3,
    position: [15, 3, 8],
    structuralRisk: 'high',
    reversePageRank: 0.91,
    reversePageRankPercentile: 92,
    betweennessPercentile: 90,
    articulationPoint: false,
    maintainers: 4,
    weeklyDownloads: 'Internal',
    dependents: 7,
    tier1Reach: 2,
    conventionalScore: 22,
    conventionalSeverity: 'LOW',
    systemicScore: 72,
    summary: 'Central session revocation, credential broker and OAuth authority.',
    operationalDomain: 'Identity Security',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 30,
      centralityReason: 'Authorizes sessions across consumer and merchant endpoints',
      fragilityPts: 12,
      fragilityReason: 'Core Security Engineering stewardship',
      assetExposurePts: 26,
      assetExposureReason: 'Directly unpins Auth/IAM Tier-1 master key services',
      exploitationPts: 4,
      exploitationReason: 'Session state tamper vulnerability via deserializer',
      totalScore: 72
    }
  },
  {
    id: 'checkout-service',
    name: 'Checkout Service',
    version: '4.8.0',
    category: 'service',
    layer: 3,
    position: [-22, 1, 14],
    structuralRisk: 'high',
    reversePageRank: 0.89,
    reversePageRankPercentile: 89,
    betweennessPercentile: 86,
    articulationPoint: false,
    maintainers: 6,
    weeklyDownloads: 'Internal',
    dependents: 6,
    tier1Reach: 2,
    conventionalScore: 24,
    conventionalSeverity: 'LOW',
    systemicScore: 68,
    summary: 'Orchestrates basket validation, discounts, taxes, and checkout flows.',
    operationalDomain: 'E-Commerce Transactions',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 28,
      centralityReason: 'Central consumer revenue pipeline node',
      fragilityPts: 10,
      fragilityReason: 'E-Commerce platform squad',
      assetExposurePts: 26,
      assetExposureReason: 'Direct line to Order Processing Core',
      exploitationPts: 4,
      exploitationReason: 'Payload tampering during checkout finalize',
      totalScore: 68
    }
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Detection',
    version: '2.1.9',
    category: 'service',
    layer: 3,
    position: [24, 2, -12],
    structuralRisk: 'high',
    reversePageRank: 0.87,
    reversePageRankPercentile: 88,
    betweennessPercentile: 84,
    articulationPoint: false,
    maintainers: 4,
    weeklyDownloads: 'Internal',
    dependents: 5,
    tier1Reach: 1,
    conventionalScore: 26,
    conventionalSeverity: 'LOW',
    systemicScore: 66,
    summary: 'Real-time velocity checks and anomalous payment transaction scoring.',
    operationalDomain: 'Risk Analysis',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 26,
      centralityReason: 'Inspects all inbound authorizations',
      fragilityPts: 12,
      fragilityReason: 'Machine Learning Risk team',
      assetExposurePts: 24,
      assetExposureReason: 'Protects Realtime Risk Engine from poison payloads',
      exploitationPts: 4,
      exploitationReason: 'Model feature poisoning via corrupted YAML rule defs',
      totalScore: 66
    }
  },
  {
    id: 'billing-service',
    name: 'Billing Service',
    version: '1.7.3',
    category: 'service',
    layer: 3,
    position: [2, 4, -20],
    structuralRisk: 'medium',
    reversePageRank: 0.78,
    reversePageRankPercentile: 78,
    betweennessPercentile: 74,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: 'Internal',
    dependents: 4,
    tier1Reach: 0,
    conventionalScore: 20,
    conventionalSeverity: 'LOW',
    systemicScore: 52,
    summary: 'Invoicing, recurring subscriptions, and merchant ledger calculations.',
    operationalDomain: 'Billing & Accounting',
    tier: 2,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 20,
      centralityReason: 'Recurring revenue ledger processor',
      fragilityPts: 10,
      fragilityReason: 'Finance Tech Team',
      assetExposurePts: 18,
      assetExposureReason: 'Direct line into Billing Analytics Tier-2 data lake',
      exploitationPts: 4,
      exploitationReason: 'Invoice generation payload vulnerability',
      totalScore: 52
    }
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    version: '3.0.0',
    category: 'service',
    layer: 3,
    position: [-4, 0, 24],
    structuralRisk: 'low',
    reversePageRank: 0.62,
    reversePageRankPercentile: 62,
    betweennessPercentile: 60,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: 'Internal',
    dependents: 5,
    tier1Reach: 0,
    conventionalScore: 18,
    conventionalSeverity: 'LOW',
    systemicScore: 38,
    summary: 'Push notification, SMS, and transactional email dispatcher.',
    operationalDomain: 'Customer Comms',
    tier: 3,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 16,
      centralityReason: 'Fan-out messaging service',
      fragilityPts: 10,
      fragilityReason: 'Comms Platform Team',
      assetExposurePts: 8,
      assetExposureReason: 'Non-critical messaging consumer',
      exploitationPts: 4,
      exploitationReason: 'Template injection vectors',
      totalScore: 38
    }
  },

  // ==========================================
  // LAYER 4: BUSINESS APPLICATIONS
  // ==========================================
  {
    id: 'storefront-web',
    name: 'Storefront Web',
    version: '12.4.0',
    category: 'application',
    layer: 4,
    position: [-28, 18, 10],
    structuralRisk: 'medium',
    reversePageRank: 0.74,
    reversePageRankPercentile: 74,
    betweennessPercentile: 70,
    articulationPoint: false,
    maintainers: 12,
    weeklyDownloads: 'Public App',
    dependents: 2,
    tier1Reach: 2,
    conventionalScore: 15,
    conventionalSeverity: 'LOW',
    systemicScore: 55,
    summary: 'Customer-facing web application serving global e-commerce consumers.',
    operationalDomain: 'Frontend Digital Commerce',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 22,
      centralityReason: 'High customer exposure entry portal',
      fragilityPts: 8,
      fragilityReason: 'Full product engineering fleet',
      assetExposurePts: 22,
      assetExposureReason: 'Direct customer transaction funnel',
      exploitationPts: 3,
      exploitationReason: 'Client session hijacking surface',
      totalScore: 55
    }
  },
  {
    id: 'partner-api-gateway',
    name: 'Partner API Gateway',
    version: '5.1.0',
    category: 'application',
    layer: 4,
    position: [-16, 20, -16],
    structuralRisk: 'high',
    reversePageRank: 0.88,
    reversePageRankPercentile: 89,
    betweennessPercentile: 85,
    articulationPoint: false,
    maintainers: 6,
    weeklyDownloads: 'B2B Portal',
    dependents: 3,
    tier1Reach: 3,
    conventionalScore: 28,
    conventionalSeverity: 'LOW',
    systemicScore: 69,
    summary: 'B2B integration portal for enterprise partners and merchant aggregators.',
    operationalDomain: 'External B2B Integrations',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 28,
      centralityReason: 'Ingress point for third-party merchant API traffic',
      fragilityPts: 10,
      fragilityReason: 'Partner integrations engineering team',
      assetExposurePts: 28,
      assetExposureReason: 'Direct route into Payment Gateway and Auth',
      exploitationPts: 3,
      exploitationReason: 'Partner token forgery vector',
      totalScore: 69
    }
  },
  {
    id: 'merchant-portal',
    name: 'Merchant Portal',
    version: '4.2.1',
    category: 'application',
    layer: 4,
    position: [20, 19, 16],
    structuralRisk: 'medium',
    reversePageRank: 0.77,
    reversePageRankPercentile: 77,
    betweennessPercentile: 72,
    articulationPoint: false,
    maintainers: 8,
    weeklyDownloads: 'Internal / B2B',
    dependents: 2,
    tier1Reach: 2,
    conventionalScore: 20,
    conventionalSeverity: 'LOW',
    systemicScore: 56,
    summary: 'Administrative portal for merchants to manage orders, inventory, and payouts.',
    operationalDomain: 'Merchant Operations',
    tier: 2,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 22,
      centralityReason: 'Admin dashboard with access to banking settlement config',
      fragilityPts: 10,
      fragilityReason: 'Merchant experience engineering team',
      assetExposurePts: 20,
      assetExposureReason: 'Controls payout ledger parameters',
      exploitationPts: 4,
      exploitationReason: 'Privilege escalation vulnerability',
      totalScore: 56
    }
  },
  {
    id: 'settlement-engine',
    name: 'Settlement Engine',
    version: '2.8.0',
    category: 'application',
    layer: 4,
    position: [8, 22, -22],
    structuralRisk: 'medium',
    reversePageRank: 0.83,
    reversePageRankPercentile: 84,
    betweennessPercentile: 81,
    articulationPoint: false,
    maintainers: 4,
    weeklyDownloads: 'Internal Batch',
    dependents: 2,
    tier1Reach: 1,
    conventionalScore: 22,
    conventionalSeverity: 'LOW',
    systemicScore: 60,
    summary: 'Automated nightly bank clearing and ACH settlement batch processor.',
    operationalDomain: 'Banking Settlement',
    tier: 2,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 24,
      centralityReason: 'Batch financial transactions orchestrator',
      fragilityPts: 12,
      fragilityReason: 'Banking Settlement squad',
      assetExposurePts: 20,
      assetExposureReason: 'Direct interface with banking clearing network',
      exploitationPts: 4,
      exploitationReason: 'Batch instruction injection vector',
      totalScore: 60
    }
  },
  {
    id: 'reporting-app',
    name: 'Reporting App',
    version: '3.1.0',
    category: 'application',
    layer: 4,
    position: [0, 18, 26],
    structuralRisk: 'low',
    reversePageRank: 0.54,
    reversePageRankPercentile: 54,
    betweennessPercentile: 50,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: 'Internal',
    dependents: 1,
    tier1Reach: 0,
    conventionalScore: 16,
    conventionalSeverity: 'LOW',
    systemicScore: 32,
    summary: 'Internal operational dashboards and daily KPI reporting views.',
    operationalDomain: 'Business Intelligence',
    tier: 3,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 14,
      centralityReason: 'End-leaf analytical presentation app',
      fragilityPts: 8,
      fragilityReason: 'Internal BI analysts',
      assetExposurePts: 6,
      assetExposureReason: 'Feeds read-only Reporting Dashboard',
      exploitationPts: 4,
      exploitationReason: 'CSV formula injection vulnerability',
      totalScore: 32
    }
  },

  // ==========================================
  // LAYER 5: TIER-1 ASSETS & MISSION CRITICAL SINK NODES
  // ==========================================
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    version: 'PROD-v8',
    category: 'tier1-asset',
    layer: 5,
    position: [-20, 36, -10],
    structuralRisk: 'critical',
    reversePageRank: 0.99,
    reversePageRankPercentile: 99,
    betweennessPercentile: 98,
    articulationPoint: false,
    maintainers: 10,
    weeklyDownloads: 'Core Production',
    dependents: 0,
    tier1Reach: 0,
    conventionalScore: 10,
    conventionalSeverity: 'LOW',
    systemicScore: 92,
    summary: 'TIER-1 CROWN JEWEL: Primary payment settlement gateway connecting VISA/Mastercard payment rails. W=10.0 Financial Asset.',
    operationalDomain: 'Tier-1 Regulated Core',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 40,
      centralityReason: 'Regulated apex sink for corporate payment revenue',
      fragilityPts: 6,
      fragilityReason: 'Full PCI-DSS compliance engineering fleet',
      assetExposurePts: 42,
      assetExposureReason: 'Direct financial exposure: $85M daily payment volume',
      exploitationPts: 4,
      exploitationReason: 'Supply-chain compromise leads to card skimming / tampering',
      totalScore: 92
    }
  },
  {
    id: 'auth-iam',
    name: 'Auth / IAM',
    version: 'PROD-v5',
    category: 'tier1-asset',
    layer: 5,
    position: [18, 37, 10],
    structuralRisk: 'critical',
    reversePageRank: 0.98,
    reversePageRankPercentile: 98,
    betweennessPercentile: 97,
    articulationPoint: false,
    maintainers: 8,
    weeklyDownloads: 'Core Production',
    dependents: 0,
    tier1Reach: 0,
    conventionalScore: 10,
    conventionalSeverity: 'LOW',
    systemicScore: 90,
    summary: 'TIER-1 CROWN JEWEL: Master identity broker holding master cryptographic keys and enterprise SSO federation. W=10.0 Financial Asset.',
    operationalDomain: 'Tier-1 Identity Core',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 38,
      centralityReason: 'Root of trust for all organizational credentials and tokens',
      fragilityPts: 8,
      fragilityReason: 'CISO Office and Identity Security team',
      assetExposurePts: 40,
      assetExposureReason: 'Direct access to all internal customer accounts and API keys',
      exploitationPts: 4,
      exploitationReason: 'Token forgery and backdoor credential generation',
      totalScore: 90
    }
  },
  {
    id: 'order-processing-core',
    name: 'Order Processing Core',
    version: 'PROD-v7',
    category: 'tier1-asset',
    layer: 5,
    position: [-30, 34, 16],
    structuralRisk: 'high',
    reversePageRank: 0.94,
    reversePageRankPercentile: 95,
    betweennessPercentile: 94,
    articulationPoint: false,
    maintainers: 8,
    weeklyDownloads: 'Core Production',
    dependents: 0,
    tier1Reach: 0,
    conventionalScore: 12,
    conventionalSeverity: 'LOW',
    systemicScore: 86,
    summary: 'TIER-1 CROWN JEWEL: High-throughput transaction ledger for global product orders and inventory allocation. W=10.0 Financial Asset.',
    operationalDomain: 'Tier-1 Commerce Core',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 36,
      centralityReason: 'All commerce revenue streams terminate here',
      fragilityPts: 8,
      fragilityReason: 'E-Commerce Infrastructure team',
      assetExposurePts: 38,
      assetExposureReason: 'Direct customer transaction flow and inventory locking',
      exploitationPts: 4,
      exploitationReason: 'Order manipulation and fraudulent voucher redemption',
      totalScore: 86
    }
  },
  {
    id: 'realtime-risk-engine',
    name: 'Realtime Risk Engine',
    version: 'PROD-v4',
    category: 'tier1-asset',
    layer: 5,
    position: [26, 35, -14],
    structuralRisk: 'high',
    reversePageRank: 0.93,
    reversePageRankPercentile: 94,
    betweennessPercentile: 93,
    articulationPoint: false,
    maintainers: 7,
    weeklyDownloads: 'Core Production',
    dependents: 0,
    tier1Reach: 0,
    conventionalScore: 14,
    conventionalSeverity: 'LOW',
    systemicScore: 85,
    summary: 'TIER-1 CROWN JEWEL: Evaluates financial fraud score and sanctions screening on every single wire transfer. W=10.0 Financial Asset.',
    operationalDomain: 'Tier-1 Fraud Prevention',
    tier: 1,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 34,
      centralityReason: 'Final defensive barrier against automated fraud syndicates',
      fragilityPts: 10,
      fragilityReason: 'Risk Modeling & Anti-Financial Crime squad',
      assetExposurePts: 37,
      assetExposureReason: 'Protects enterprise balance sheet from chargeback cascades',
      exploitationPts: 4,
      exploitationReason: 'Adversarial evasion through YAML rule poisoning',
      totalScore: 85
    }
  },
  {
    id: 'billing-analytics',
    name: 'Billing Analytics',
    version: 'PROD-v3',
    category: 'service',
    layer: 5,
    position: [6, 33, -26],
    structuralRisk: 'medium',
    reversePageRank: 0.78,
    reversePageRankPercentile: 78,
    betweennessPercentile: 75,
    articulationPoint: false,
    maintainers: 4,
    weeklyDownloads: 'Internal Lake',
    dependents: 0,
    tier1Reach: 0,
    conventionalScore: 18,
    conventionalSeverity: 'LOW',
    systemicScore: 64,
    summary: 'TIER-2 ASSET: Ingestion and aggregate billing reporting data warehouse. W=5.0 Asset.',
    operationalDomain: 'Finance Data Warehouse',
    tier: 2,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 24,
      centralityReason: 'Consolidates merchant payout statements',
      fragilityPts: 10,
      fragilityReason: 'Data platform engineers',
      assetExposurePts: 26,
      assetExposureReason: 'Sensitive financial telemetry and tax statements',
      exploitationPts: 4,
      exploitationReason: 'Exfiltration of corporate revenue numbers',
      totalScore: 64
    }
  },
  {
    id: 'reporting-dashboard',
    name: 'Reporting Dashboard',
    version: 'PROD-v2',
    category: 'service',
    layer: 5,
    position: [-2, 31, 30],
    structuralRisk: 'low',
    reversePageRank: 0.52,
    reversePageRankPercentile: 52,
    betweennessPercentile: 48,
    articulationPoint: false,
    maintainers: 3,
    weeklyDownloads: 'Internal Portal',
    dependents: 0,
    tier1Reach: 0,
    conventionalScore: 15,
    conventionalSeverity: 'LOW',
    systemicScore: 35,
    summary: 'TIER-3 ASSET: Operational health metrics viewer for customer support. W=1.0 Asset.',
    operationalDomain: 'Internal Support',
    tier: 3,
    waterfallReceipt: {
      baseRisk: 0,
      centralityPts: 15,
      centralityReason: 'Read-only downstream metric consumer',
      fragilityPts: 8,
      fragilityReason: 'Support tool team',
      assetExposurePts: 8,
      assetExposureReason: 'Low sensitivity aggregated stats',
      exploitationPts: 4,
      exploitationReason: 'Minimal exploit impact',
      totalScore: 35
    }
  }
];

export const MOCK_EDGES: EcosystemEdge[] = [
  // =======================================================
  // EDGES FROM KEYSTONE: snakeyaml -> Internal Libraries
  // (The critical propagation channels)
  // =======================================================
  {
    id: 'e_sy_data_pipeline',
    source: 'snakeyaml',
    target: 'internal-data-pipeline',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true,
    isCutCandidate: true
  },
  {
    id: 'e_sy_auth',
    source: 'snakeyaml',
    target: 'internal-auth',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true,
    isCutCandidate: true
  },
  {
    id: 'e_sy_api_core',
    source: 'snakeyaml',
    target: 'api-core',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true,
    isCutCandidate: true
  },
  {
    id: 'e_sy_analytics',
    source: 'snakeyaml',
    target: 'analytics-lib',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true,
    isCutCandidate: true
  },
  {
    id: 'e_sy_telemetry',
    source: 'snakeyaml',
    target: 'telemetry-sdk',
    channel: 'build-time',
    isPermeable: false
  },

  // Other Layer 1 -> Layer 2 edges (providing natural graph texture)
  {
    id: 'e_mini_data_pipe',
    source: 'minimist',
    target: 'internal-data-pipeline',
    channel: 'runtime',
    isPermeable: false
  },
  {
    id: 'e_mini_api_core',
    source: 'minimist',
    target: 'api-core',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_lodash_auth',
    source: 'lodash',
    target: 'internal-auth',
    channel: 'runtime',
    isPermeable: false
  },
  {
    id: 'e_lodash_data_pipeline',
    source: 'lodash',
    target: 'internal-data-pipeline',
    channel: 'runtime',
    isPermeable: false
  },
  {
    id: 'e_proto_analytics',
    source: 'protobuf-lite',
    target: 'analytics-lib',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_proto_telemetry',
    source: 'protobuf-lite',
    target: 'telemetry-sdk',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_semver_api_core',
    source: 'semver',
    target: 'api-core',
    channel: 'build-time',
    isPermeable: false
  },
  {
    id: 'e_ws_analytics',
    source: 'ws-util',
    target: 'analytics-lib',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_debug_auth',
    source: 'debug',
    target: 'internal-auth',
    channel: 'build-time',
    isPermeable: false
  },
  {
    id: 'e_debug_telemetry',
    source: 'debug',
    target: 'telemetry-sdk',
    channel: 'runtime',
    isPermeable: false
  },

  // =======================================================
  // LAYER 2 -> LAYER 3: Internal Libs -> Platform Services
  // =======================================================
  {
    id: 'e_data_pipe_payment_svc',
    source: 'internal-data-pipeline',
    target: 'payment-service',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_data_pipe_billing_svc',
    source: 'internal-data-pipeline',
    target: 'billing-service',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_auth_session_mgr',
    source: 'internal-auth',
    target: 'auth-session-manager',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_auth_payment_svc',
    source: 'internal-auth',
    target: 'payment-service',
    channel: 'runtime',
    isPermeable: false
  },
  {
    id: 'e_api_core_checkout_svc',
    source: 'api-core',
    target: 'checkout-service',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_api_core_payment_svc',
    source: 'api-core',
    target: 'payment-service',
    channel: 'runtime',
    isPermeable: false
  },
  {
    id: 'e_analytics_fraud_svc',
    source: 'analytics-lib',
    target: 'fraud-detection',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_telemetry_notification_svc',
    source: 'telemetry-sdk',
    target: 'notification-service',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_telemetry_billing_svc',
    source: 'telemetry-sdk',
    target: 'billing-service',
    channel: 'runtime',
    isPermeable: false
  },

  // =======================================================
  // LAYER 3 -> LAYER 4: Services -> Applications
  // =======================================================
  {
    id: 'e_payment_svc_partner_api',
    source: 'payment-service',
    target: 'partner-api-gateway',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_payment_svc_settlement',
    source: 'payment-service',
    target: 'settlement-engine',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_auth_session_storefront',
    source: 'auth-session-manager',
    target: 'storefront-web',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_auth_session_merchant',
    source: 'auth-session-manager',
    target: 'merchant-portal',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_checkout_svc_storefront',
    source: 'checkout-service',
    target: 'storefront-web',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_fraud_merchant_portal',
    source: 'fraud-detection',
    target: 'merchant-portal',
    channel: 'runtime',
    isPermeable: true
  },
  {
    id: 'e_billing_settlement_engine',
    source: 'billing-service',
    target: 'settlement-engine',
    channel: 'runtime',
    isPermeable: false
  },
  {
    id: 'e_notification_reporting',
    source: 'notification-service',
    target: 'reporting-app',
    channel: 'runtime',
    isPermeable: true
  },

  // =======================================================
  // LAYER 4 -> LAYER 5: Applications / Svc -> Tier-1 Assets
  // =======================================================
  {
    id: 'e_partner_payment_gw',
    source: 'partner-api-gateway',
    target: 'payment-gateway',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_payment_svc_payment_gw_direct',
    source: 'payment-service',
    target: 'payment-gateway',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_auth_mgr_auth_iam_direct',
    source: 'auth-session-manager',
    target: 'auth-iam',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_storefront_order_core',
    source: 'storefront-web',
    target: 'order-processing-core',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_checkout_order_core_direct',
    source: 'checkout-service',
    target: 'order-processing-core',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_fraud_realtime_risk_direct',
    source: 'fraud-detection',
    target: 'realtime-risk-engine',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_settlement_billing_analytics',
    source: 'settlement-engine',
    target: 'billing-analytics',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  },
  {
    id: 'e_reporting_app_dashboard',
    source: 'reporting-app',
    target: 'reporting-dashboard',
    channel: 'runtime',
    isPermeable: true,
    isPropagationPath: true
  }
];

export const MOCK_PROPAGATION_PATHS: PropagationPath[] = [
  {
    id: 'path_01',
    label: 'PATH 01: Payment Gateway Exposure',
    nodeIds: ['snakeyaml', 'internal-data-pipeline', 'payment-service', 'partner-api-gateway', 'payment-gateway'],
    targetAsset: 'Payment Gateway',
    targetAssetTier: 1,
    assetWeight: 10.0,
    channel: 'runtime',
    description: 'snakeyaml unmarshaling flaw propagates through internal-data-pipeline into Payment Service and compromises the regulated Payment Gateway rail.'
  },
  {
    id: 'path_02',
    label: 'PATH 02: Auth / IAM Root Identity Compromise',
    nodeIds: ['snakeyaml', 'internal-auth', 'auth-session-manager', 'auth-iam'],
    targetAsset: 'Auth / IAM',
    targetAssetTier: 1,
    assetWeight: 10.0,
    channel: 'runtime',
    description: 'Corrupted YAML configuration deserialized in internal-auth grants unauthorized session token forging in Auth / IAM master authority.'
  },
  {
    id: 'path_03',
    label: 'PATH 03: Order Processing Ledger Hijack',
    nodeIds: ['snakeyaml', 'api-core', 'checkout-service', 'storefront-web', 'order-processing-core'],
    targetAsset: 'Order Processing Core',
    targetAssetTier: 1,
    assetWeight: 10.0,
    channel: 'runtime',
    description: 'Remote code execution in api-core RPC handler allows payload spoofing directly into the Order Processing Core transaction ledger.'
  },
  {
    id: 'path_04',
    label: 'PATH 04: Realtime Fraud Detection Blindspot',
    nodeIds: ['snakeyaml', 'analytics-lib', 'fraud-detection', 'realtime-risk-engine'],
    targetAsset: 'Realtime Risk Engine',
    targetAssetTier: 1,
    assetWeight: 10.0,
    channel: 'runtime',
    description: 'Anomalous event payload disables heuristics in Fraud Detection, blinding the Realtime Risk Engine to financial wire-fraud syndicates.'
  }
];

export const MOCK_MITIGATION_CANDIDATES: MitigationCandidate[] = [
  {
    strategy: 'min_cut',
    strategyTitle: 'Strategy 1: Architectural Chokepoint (Min-Cut)',
    strategyDescription: 'Maximizes systemic portfolio-wide path severance across all repositories simultaneously with the fewest global interventions.',
    targetNodeId: 'internal-data-pipeline',
    targetPackage: 'internal-data-pipeline',
    currentVersion: '2.4.0',
    targetVersion: '2.5.0',
    semverJump: 'patch',
    pathsSevered: 4,
    totalPaths: 4,
    newCves: 0,
    breakingChanges: 0,
    netSecurityGain: 4,
    financialBlastReduction: '94.2%',
    engineeringEffort: '1 Coordinated Pull Request (Zero API breakage)',
    impactConcentration: 'Systemic Cross-Portfolio Insulated',
    insulatedAssets: [
      { name: 'Payment Gateway', tier: 1, weight: 10.0 },
      { name: 'Auth / IAM', tier: 1, weight: 10.0 },
      { name: 'Order Processing Core', tier: 1, weight: 10.0 },
      { name: 'Realtime Risk Engine', tier: 1, weight: 10.0 }
    ]
  },
  {
    strategy: 'low_hanging',
    strategyTitle: 'Strategy 2: Low-Hanging Fruit (Zero Friction Fast Patch)',
    strategyDescription: 'Filters exclusively for zero-breaking-change SemVer patch upgrades that developers can auto-merge in 5 minutes with zero testing friction.',
    targetNodeId: 'internal-data-pipeline',
    targetPackage: 'internal-data-pipeline',
    currentVersion: '2.4.0',
    targetVersion: '2.4.1',
    semverJump: 'patch',
    pathsSevered: 3,
    totalPaths: 4,
    newCves: 0,
    breakingChanges: 0,
    netSecurityGain: 3,
    financialBlastReduction: '78.5%',
    engineeringEffort: 'Fast Automated Merge',
    impactConcentration: 'Partial Cross-Repository Insulation',
    insulatedAssets: [
      { name: 'Payment Gateway', tier: 1, weight: 10.0 },
      { name: 'Auth / IAM', tier: 1, weight: 10.0 },
      { name: 'Billing Analytics', tier: 2, weight: 5.0 }
    ]
  },
  {
    strategy: 'crown_jewel',
    strategyTitle: 'Strategy 3: Crown Jewel Shield (Targeted Asset Defense)',
    strategyDescription: 'Focuses the cut algorithm strictly on severing paths that reach Tier-1 Mission-Critical assets (Payment Gateway, Auth/IAM).',
    targetNodeId: 'payment-service',
    targetPackage: 'Payment Service',
    currentVersion: '3.4.1',
    targetVersion: '3.5.0',
    semverJump: 'minor',
    pathsSevered: 2,
    totalPaths: 4,
    newCves: 0,
    breakingChanges: 0,
    netSecurityGain: 2,
    financialBlastReduction: '86.0%',
    engineeringEffort: 'Targeted Payments Release',
    impactConcentration: 'PCI-DSS Tier-1 Perimeter Locked',
    insulatedAssets: [
      { name: 'Payment Gateway', tier: 1, weight: 10.0 },
      { name: 'Auth / IAM', tier: 1, weight: 10.0 }
    ]
  }
];

export const PRE_SEEDED_QUESTIONS = [
  {
    id: 'q1',
    query: 'Which Tier-1 services are affected if snakeyaml is compromised?',
    shortLabel: 'Which Tier-1 services are affected?'
  },
  {
    id: 'q2',
    query: 'What is the most critical dependency in this ecosystem?',
    shortLabel: 'What is the most critical dependency?'
  },
  {
    id: 'q3',
    query: 'Why is snakeyaml considered a keystone?',
    shortLabel: 'Why is snakeyaml considered a keystone?'
  },
  {
    id: 'q4',
    query: 'Which intervention eliminates the most propagation paths?',
    shortLabel: 'Which intervention eliminates the most paths?'
  }
];

export const DETERMINISTIC_ANSWERS: Record<string, {
  functionCalled: string;
  deterministicFacts: string[];
  narrative: string;
  highlightNodes: string[];
}> = {
  q1: {
    functionCalled: "reverse_bfs('snakeyaml', filter_tier=1)",
    deterministicFacts: [
      "Target Keystone: snakeyaml@1.33 (Cut-Vertex articulation point)",
      "4 Tier-1 services reached via 4 distinct directed DAG paths",
      "Asset 1: Payment Gateway (Tier-1, Weight 10.0, PCI-DSS)",
      "Asset 2: Auth / IAM (Tier-1, Weight 10.0, SSO Master)",
      "Asset 3: Order Processing Core (Tier-1, Weight 10.0, Transaction Ledger)",
      "Asset 4: Realtime Risk Engine (Tier-1, Weight 10.0, Wire Fraud Defense)"
    ],
    narrative: "A simulated compromise of snakeyaml@1.33 cascades across 4 mission-critical Tier-1 services holding over $85M in daily transactions. While conventional tools score snakeyaml as a moderate CVSS 4.8 alert, reverse topological traversal proves it holds an uninsulated structural monopoly over Payment Gateway, Auth/IAM, Order Processing, and Realtime Risk.",
    highlightNodes: ['snakeyaml', 'payment-gateway', 'auth-iam', 'order-processing-core', 'realtime-risk-engine']
  },
  q2: {
    functionCalled: "get_chokepoints(top_n=5, sort='systemic_risk')",
    deterministicFacts: [
      "1. snakeyaml@1.33: Systemic Risk 84/100 (98th %ile Reverse PageRank, Articulation Point = YES, 21 Dependents)",
      "2. internal-auth@3.1.2: Systemic Risk 74/100 (93rd %ile Reverse PageRank, Articulation Point = YES, 15 Dependents)",
      "3. minimist@0.0.8: Systemic Risk 78/100 (94th %ile Reverse PageRank, Articulation Point = NO, 14 Dependents)",
      "4. internal-data-pipeline@2.4.0: Systemic Risk 76/100 (96th %ile Reverse PageRank, Articulation Point = YES, 16 Dependents)",
      "5. lodash@4.17.21: Systemic Risk 61/100 (88th %ile Reverse PageRank, Articulation Point = NO, 28 Dependents)"
    ],
    narrative: "The single most critical dependency in this ecosystem is snakeyaml@1.33. Unlike peripheral packages with high star counts, snakeyaml has a Bus Factor of 1 (single unfunded maintainer) and acts as an articulation cut-vertex whose removal or compromise fragments the core data parsing layer across 42 repositories.",
    highlightNodes: ['snakeyaml']
  },
  q3: {
    functionCalled: "audit_waterfall_receipt('snakeyaml@1.33')",
    deterministicFacts: [
      "Conventional CVSS/OpenSSF: 48/100 (Moderate severity)",
      "Reverse PageRank: 98th percentile (Top 2% of ecosystem importance)",
      "Betweenness Centrality: Top 1% (Dominates 0.5% of shortest paths)",
      "Tarjan Articulation Status: TRUE (Strict cut-vertex)",
      "Fragility Multiplier: 5.2x (48M weekly downloads / 1 maintainer)",
      "Calculated Factor Breakdown: 0 Base + 38 Centrality + 22 Fragility + 16 Asset Exposure + 8 Exploitation = 84 Total"
    ],
    narrative: "snakeyaml is designated a KEYSTONE because of the Popularity Paradox: conventional scanners see an ordinary utility with a moderate advisory score, but graph topology reveals it is a structural keystone. If an attacker injects a malicious payload, there is no redundant path—four separate application clusters simultaneously ingest the payload.",
    highlightNodes: ['snakeyaml', 'internal-data-pipeline', 'internal-auth']
  },
  q4: {
    functionCalled: "compute_min_cut('snakeyaml', weight='semver_friction')",
    deterministicFacts: [
      "Candidate: internal-data-pipeline (v2.4.0 -> v2.5.0)",
      "Cut Algorithm: Flow-Network Minimum Vertex Cut (Edmonds-Karp duality)",
      "Severed Paths: 4 / 4 active propagation chains (100% blast collapse)",
      "SemVer Migration Friction: Patch-level (Effort Cost = 1.0)",
      "Cascade Net Security Gain: +4 paths severed - 0 new CVEs = +4 NET GAIN",
      "Developer Action: 1 coordinated PR vs. 40 fragmented repository fixes"
    ],
    narrative: "The optimal intervention is upgrading internal-data-pipeline from 2.4.0 to 2.5.0. Because this node is the intermediate dominator between snakeyaml and the downstream platform services, severing it completely insulates all 4 Tier-1 assets without requiring breaking API changes or modifying snakeyaml directly in 40 separate repositories.",
    highlightNodes: ['internal-data-pipeline', 'snakeyaml']
  }
};
