export type NodeCategory = 
  | 'open-source' 
  | 'internal-lib' 
  | 'service' 
  | 'application' 
  | 'tier1-asset' 
  | 'keystone';

export type StructuralRiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface WaterfallReceipt {
  baseRisk: number;
  centralityPts: number;
  centralityReason: string;
  fragilityPts: number;
  fragilityReason: string;
  assetExposurePts: number;
  assetExposureReason: string;
  exploitationPts: number;
  exploitationReason: string;
  totalScore: number;
}

export interface EcosystemNode {
  id: string;
  name: string;
  version: string;
  category: NodeCategory;
  layer: 1 | 2 | 3 | 4 | 5; // 1: Foundation OS, 2: Shared Lib, 3: Platform Svc, 4: Apps, 5: Tier-1 Assets
  position: [number, number, number];
  structuralRisk: StructuralRiskLevel;
  reversePageRank: number; // 0.0 - 1.0
  reversePageRankPercentile: number; // e.g. 98
  betweennessPercentile: number; // e.g. 99
  articulationPoint: boolean;
  maintainers: number;
  weeklyDownloads: string;
  dependents: number;
  tier1Reach: number;
  conventionalScore: number; // OpenSSF / CVSS (e.g. 48/100)
  conventionalSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  systemicScore: number; // KEYSTONE score (e.g. 84/100)
  summary: string;
  stealthSignals?: string[];
  waterfallReceipt: WaterfallReceipt;
  tier?: 1 | 2 | 3;
  operationalDomain?: string;
  // F9 False-Positive Suppression Stack
  reachabilityMultiplier?: 1.0 | 0.5 | 0.1;
  reachabilityStatus?: 'REACHABLE' | 'POTENTIALLY_REACHABLE' | 'UNREACHABLE_DEAD_CODE';
  vexStatus?: 'affected' | 'not_affected' | 'under_investigation';
  vexJustification?: string;
  // F11 Impact Concentration Index
  impactConcentrationRatio?: number;
  impactConcentrationType?: 'systemic_contagion' | 'contained_monolith';
  // F5 Centrality Velocity & Leading Trend Alarms
  centralityVelocity?: number; // e.g. +142 (% growth over last 30d/90d lockfile commits)
  velocityHistory?: number[]; // e.g. [14, 22, 38, 55, 78, 98] historical percentiles over 6 snapshots
  isEscalatingKeystone?: boolean; // true if velocity > 100%
  // F8 SSVC & ORE Attribution
  ssvcVerdict?: 'IMMEDIATE' | 'OUT_OF_CYCLE' | 'SCHEDULED' | 'DEFER';
  oreScore?: number;
  pActiveScore?: number;
  iTechScore?: number;
  // F4 XZ Radar / Support Divergence (PDI)
  openSsfScore?: number;
  humanCommits12m?: number;
  botCommitsFiltered?: number;
  daysSinceRelease?: number;
  pdiScore?: number;
  // F5 Release Anomaly (F4 in spec)
  f4Status?: 'CORRELATED_ANOMALY' | 'ARTIFACT_ANOMALY' | 'CAPABILITY_CHANGE' | 'NONE';
  capabilityDelta?: Array<{ capability: string; description: string }>;
  artifactFiles?: Array<{ file: string; type: string; status: 'CORRESPONDING' | 'UNEXPLAINED' }>;
  // F6 Resolver Permeability Lab
  f6Vector?: { O: string; C: number; E: string; Q: string };
  f6Decision?: string;
  // Dynamic simulation flags
  isCompromised?: boolean;
  isSimulatedSource?: boolean;
  isInterventionTarget?: boolean;
  isInsulated?: boolean;
  activePulse?: boolean;
}

export interface EcosystemEdge {
  id: string;
  source: string; // Upstream dependency
  target: string; // Downstream dependent
  channel: 'runtime' | 'build-time';
  isPermeable: boolean; // loose SemVer vs locked
  weight?: number;
  isPropagationPath?: boolean;
  isSevered?: boolean;
  isHighlighted?: boolean;
  isCutCandidate?: boolean;
}

export interface PropagationPath {
  id: string;
  label: string;
  nodeIds: string[];
  targetAsset: string;
  targetAssetTier: 1 | 2 | 3;
  assetWeight: number;
  description: string;
  channel: 'runtime' | 'build-time';
}

export interface MitigationCandidate {
  strategy: 'min_cut' | 'low_hanging' | 'crown_jewel';
  strategyTitle: string;
  strategyDescription: string;
  targetNodeId: string;
  targetPackage: string;
  currentVersion: string;
  targetVersion: string;
  semverJump: 'patch' | 'minor' | 'major';
  pathsSevered: number;
  totalPaths: number;
  newCves: number;
  breakingChanges: number;
  netSecurityGain: number;
  financialBlastReduction: string;
  engineeringEffort: string;
  impactConcentration: string;
  insulatedAssets: Array<{ name: string; tier: number; weight: number }>;
}

export type RoleLens = 'ciso' | 'developer' | 'maintainer';
export type NavView = 
  | 'landing' 
  | 'overview' 
  | 'ecosystem' 
  | 'watchlist' 
  | 'scenarios' 
  | 'mitigation' 
  | 'rollout'
  | 'auth'
  | 'connectors'
  | 'organization'
  | 'settings'
  | 'api-keys'
  | 'profile'
  | 'hardware';

export interface UserProfile {
  name: string;
  email: string;
  organization: string;
  roleLens: RoleLens;
  region: string;
  scopeCount: number;
  avatarInitials: string;
  licenseTier: string;
}

export interface OnboardingConfig {
  name: string;
  email: string;
  organization: string;
  hostingRegion: string;
  roleLens: RoleLens;
  securityPriorities: string[];
  ingestionSource: 'github_app' | 'gitlab' | 'sbom_upload' | 'demo_playground';
  repositoriesCount: number;
}

export interface KeystoneStats {
  repositories: number;
  criticalDependencies: number;
  tier1Assets: number;
  activeStructuralRisks: number;
  sifiConcentrationRatio: number; // e.g. 81% in top 5
}
