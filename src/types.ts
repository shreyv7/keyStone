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
export type NavView = 'overview' | 'ecosystem' | 'watchlist' | 'scenarios' | 'mitigation';

export interface KeystoneStats {
  repositories: number;
  criticalDependencies: number;
  tier1Assets: number;
  activeStructuralRisks: number;
  sifiConcentrationRatio: number; // e.g. 81% in top 5
}
