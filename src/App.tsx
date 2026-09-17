import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  MOCK_NODES, 
  MOCK_EDGES, 
  MOCK_PROPAGATION_PATHS, 
  MOCK_MITIGATION_CANDIDATES, 
  KEYSTONE_STATS 
} from './data/mockEcosystem';
import { 
  EcosystemNode, 
  PropagationPath, 
  NavView, 
  RoleLens,
  UserProfile 
} from './types';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { EcosystemGraph } from './components/EcosystemGraph';
import { GraphControls } from './components/GraphControls';
import { NodeTooltip } from './components/NodeTooltip';
import { NodeIntelligencePanel } from './components/NodeIntelligencePanel';
import { BlastRadiusHUD } from './components/BlastRadiusHUD';
import { DominatorLeaderboard } from './components/DominatorLeaderboard';
import { PropagationPanel } from './components/PropagationPanel';
import { MitigationPanel } from './components/MitigationPanel';
import { AskKeystone } from './components/AskKeystone';
import { RiskWatchlist } from './components/RiskWatchlist';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ScenariosView } from './components/ScenariosView';
import { CoordinatedPRModal } from './components/CoordinatedPRModal';
import { TopologyLegendModal } from './components/TopologyLegendModal';
import { SBOMUploadModal } from './components/SBOMUploadModal';
import { LandingPage } from './components/LandingPage';
import { AuthOnboardingModal } from './components/AuthOnboardingModal';
import { TimelinePlayer } from './components/TimelinePlayer';
import { ConnectorsPage } from './components/ConnectorsPage';
import { OrganizationPage } from './components/OrganizationPage';
import { SettingsPage } from './components/SettingsPage';
import { ApiKeysPage } from './components/ApiKeysPage';
import { ProfilePage } from './components/ProfilePage';
import { HardwarePage } from './components/HardwarePage';
import { RolloutCockpitView } from './components/RolloutCockpitView';
import { RemediationPage } from './components/RemediationPage';
import { BlastRadiusPage } from './components/BlastRadiusPage';
import { Globe } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export function App() {
  const { isLight } = useTheme();
  // Navigation View
  const [activeView, setActiveView] = useState<NavView>('landing');

  // User Profile & Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Chen',
    email: 'alex.chen@acme-corp.com',
    organization: 'Acme Global Infrastructure',
    roleLens: 'developer',
    region: 'us-east-1',
    scopeCount: 42,
    avatarInitials: 'AC',
    licenseTier: 'Enterprise Active'
  });
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'onboard'>('signin');

  // Role Lens & Time Travel
  const [activeLens, setActiveLens] = useState<RoleLens>('developer');
  const [timeTravelDay, setTimeTravelDay] = useState<number>(0);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Graph Selection & Hover State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('snakeyaml');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  // Graph Visualization Toggles
  const [showStructuralSize, setShowStructuralSize] = useState<boolean>(true);
  const [showBlastRadius, setShowBlastRadius] = useState<boolean>(false);
  const [showPropagation, setShowPropagation] = useState<boolean>(false);
  const [showDominatorMode, setShowDominatorMode] = useState<boolean>(false);
  const [scopeFilter, setScopeFilter] = useState<'all' | 'production' | 'dev'>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'runtime' | 'build'>('all');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Simulation State
  const [simulationPhase, setSimulationPhase] = useState<
    'idle' | 'preparing' | 'simulating' | 'active_compromise' | 'mitigation_computed' | 'mitigation_applied'
  >('idle');
  const [compromisedNodeIds, setCompromisedNodeIds] = useState<Set<string>>(new Set());
  const [severedEdgeIds, setSeveredEdgeIds] = useState<Set<string>>(new Set());
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());

  // Propagation & Mitigation Panels
  const [activePropagationPath, setActivePropagationPath] = useState<PropagationPath | null>(null);
  const [isPropagationPanelOpen, setIsPropagationPanelOpen] = useState<boolean>(false);
  const [isMitigationPanelOpen, setIsMitigationPanelOpen] = useState<boolean>(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'min_cut' | 'low_hanging' | 'crown_jewel'>('min_cut');

  // Modals & Secondary UI
  const [isAskKeystoneOpen, setIsAskKeystoneOpen] = useState<boolean>(false);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState<boolean>(false);
  const [isSBOMModalOpen, setIsSBOMModalOpen] = useState<boolean>(false);
  const [isCircuitBreakerFrozen, setIsCircuitBreakerFrozen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );

  // Resolve selected node object
  const selectedNode = useMemo(
    () => MOCK_NODES.find(n => n.id === selectedNodeId) || null,
    [selectedNodeId]
  );

  // Resolve hovered node object
  const hoveredNode = useMemo(
    () => MOCK_NODES.find(n => n.id === hoveredNodeId) || null,
    [hoveredNodeId]
  );

  // Autocomplete search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_NODES.filter(
      n => n.name.toLowerCase().includes(q) || n.operationalDomain?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  // Pre-calculate top structural risks for Overview dashboard
  const topRisks = useMemo(
    () => [...MOCK_NODES].sort((a, b) => b.systemicScore - a.systemicScore).slice(0, 5),
    []
  );

  // Handle Node Selection
  const handleSelectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setHighlightedNodeIds(new Set([nodeId]));
    }
  }, []);

  // Handle Node Hover
  const handleHoverNode = useCallback(
    (nodeId: string | null, mousePos: { x: number; y: number } | null) => {
      setHoveredNodeId(nodeId);
      setHoveredPosition(mousePos);
    },
    []
  );

  // Start Cinematic Compromise Simulation (Step-by-step reverse ripple)
  const handleStartSimulation = useCallback((targetId: string = 'snakeyaml') => {
    setSimulationPhase('simulating');
    setIsPropagationPanelOpen(false);
    setIsMitigationPanelOpen(false);
    setActivePropagationPath(null);

    // Initial source
    setCompromisedNodeIds(new Set([targetId]));

    // Hop 1: Internal Libs (300ms)
    setTimeout(() => {
      setCompromisedNodeIds(prev => new Set([...prev, 'internal-data-pipeline', 'internal-auth', 'api-core', 'analytics-lib']));
    }, 450);

    // Hop 2: Platform Services (900ms)
    setTimeout(() => {
      setCompromisedNodeIds(prev => new Set([...prev, 'payment-service', 'auth-session-manager', 'checkout-service', 'fraud-detection', 'billing-service']));
    }, 950);

    // Hop 3: Business Applications (1400ms)
    setTimeout(() => {
      setCompromisedNodeIds(prev => new Set([...prev, 'partner-api-gateway', 'storefront-web', 'merchant-portal', 'settlement-engine']));
    }, 1450);

    // Hop 4: Tier-1 Assets (Apex Crown Jewels) (1900ms)
    setTimeout(() => {
      setCompromisedNodeIds(prev => new Set([
        ...prev, 
        'payment-gateway', 
        'auth-iam', 
        'order-processing-core', 
        'realtime-risk-engine', 
        'billing-analytics'
      ]));
      setSimulationPhase('active_compromise');
      setShowBlastRadius(true);
      setShowPropagation(true);
    }, 1950);
  }, []);

  // Compute Minimum-Cut Intervention
  const handleComputeMitigation = useCallback(() => {
    setSimulationPhase('mitigation_computed');
    setIsMitigationPanelOpen(false);
    setIsPropagationPanelOpen(false);
    setSelectedNodeId('snakeyaml');
    setActiveView('mitigation');
  }, []);

  // Apply Simulated Fix
  const handleApplyFix = useCallback(() => {
    setSimulationPhase('mitigation_applied');
    // Sever the edges coming out of snakeyaml
    setSeveredEdgeIds(new Set(['e_sy_data_pipeline', 'e_sy_auth', 'e_sy_api_core', 'e_sy_analytics']));
    // Clear compromise from downstream nodes
    setCompromisedNodeIds(new Set(['snakeyaml']));
    setActivePropagationPath(null);
  }, []);

  // Reset Simulation to Pristine Ecosystem
  const handleResetSimulation = useCallback(() => {
    setSimulationPhase('idle');
    setCompromisedNodeIds(new Set());
    setSeveredEdgeIds(new Set());
    setActivePropagationPath(null);
    setIsPropagationPanelOpen(false);
    setIsMitigationPanelOpen(false);
    setShowBlastRadius(false);
    setShowPropagation(false);
    setHighlightedNodeIds(new Set());
    setSelectedNodeId('snakeyaml');
  }, []);

  // Global Keyboard Shortcuts (Escape to dismiss, ? for legend, 1/2/3 for role lenses)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is actively focused in an input, textarea, or contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (isSBOMModalOpen) {
          setIsSBOMModalOpen(false);
          return;
        }
        if (isPRModalOpen) {
          setIsPRModalOpen(false);
          return;
        }
        if (isAskKeystoneOpen) {
          setIsAskKeystoneOpen(false);
          return;
        }
        if (isLegendOpen) {
          setIsLegendOpen(false);
          return;
        }
        if (isMitigationPanelOpen) {
          setIsMitigationPanelOpen(false);
          return;
        }
        if (isPropagationPanelOpen) {
          setIsPropagationPanelOpen(false);
          return;
        }
        if (selectedNodeId) {
          setSelectedNodeId(null);
          setHighlightedNodeIds(new Set());
          return;
        }
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsLegendOpen(prev => !prev);
      } else if (e.key === '1') {
        setActiveLens('ciso');
      } else if (e.key === '2') {
        setActiveLens('developer');
      } else if (e.key === '3') {
        setActiveLens('maintainer');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSBOMModalOpen,
    isPRModalOpen,
    isAskKeystoneOpen,
    isLegendOpen,
    isMitigationPanelOpen,
    isPropagationPanelOpen,
    selectedNodeId
  ]);

  if (activeView === 'auth') {
    return (
      <AuthOnboardingModal
        initialMode={authInitialMode}
        onComplete={(newProfile) => {
          setUserProfile(newProfile);
          setActiveLens(newProfile.roleLens);
          setActiveView('overview');
        }}
        onCancel={() => setActiveView('landing')}
      />
    );
  }

  if (activeView === 'landing') {
    return (
      <LandingPage
        stats={KEYSTONE_STATS}
        onEnterConsole={() => setActiveView('overview')}
        onLaunchScenario={(id) => {
          setActiveView('ecosystem');
          if (id === 'snakeyaml_hero') {
            handleStartSimulation('snakeyaml');
          } else if (id === 'minimist_pollution') {
            setSelectedNodeId('minimist');
            handleStartSimulation('minimist');
          } else if (id === 'fresh_maintainer_anomaly') {
            setTimeTravelDay(-30);
            setSelectedNodeId('snakeyaml');
          }
        }}
        onOpenAskKeystone={() => setIsAskKeystoneOpen(true)}
        onOpenAuth={(mode) => {
          setAuthInitialMode(mode);
          setActiveView('auth');
        }}
      />
    );
  }

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col transition-colors duration-200 select-none ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#07090e] text-slate-100'
    }`}>
      {/* Top Application Bar */}
      <TopBar
        activeLens={activeLens}
        onChangeLens={setActiveLens}
        timeTravelDay={timeTravelDay}
        onChangeTimeTravel={setTimeTravelDay}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectSearchResult={(id) => {
          setSelectedNodeId(id);
          setHighlightedNodeIds(new Set([id]));
          setSearchQuery('');
          setActiveView('ecosystem');
        }}
        searchResults={searchResults}
        onGoToLanding={() => setActiveView('landing')}
        isCircuitBreakerFrozen={isCircuitBreakerFrozen}
        onToggleCircuitBreaker={() => setIsCircuitBreakerFrozen(prev => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        userProfile={userProfile}
        onSignOut={() => {
          setActiveView('landing');
        }}
        onNavigateProfile={() => setActiveView('profile')}
      />

      {/* Main Workspace Layout (Sidebar + 3D Viewport / Overlays) */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onChangeView={setActiveView}
          stats={KEYSTONE_STATS}
          onOpenAskKeystone={() => setIsAskKeystoneOpen(true)}
          onOpenSBOMModal={() => setIsSBOMModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Center Main Stage */}
        <main className="relative flex-1 w-full h-full overflow-hidden">
          {/* 3D WebGL Ecosystem Graph Stage Wrapper - Dynamically compresses and shifts to left on node selection */}
          <div className={`h-full relative transition-all duration-300 ease-out overflow-hidden ${
            isLight ? 'bg-white' : 'bg-[#07090e]'
          } ${
            selectedNode && activeView === 'ecosystem' && !isMitigationPanelOpen && simulationPhase === 'idle'
              ? 'mr-0 sm:mr-96 lg:mr-[420px]'
              : 'mr-0'
          }`}>
            {/* 3D WebGL Ecosystem Graph */}
            <EcosystemGraph
              nodes={MOCK_NODES}
              edges={MOCK_EDGES}
              selectedNodeId={selectedNodeId}
              hoveredNodeId={hoveredNodeId}
              onSelectNode={handleSelectNode}
              onHoverNode={handleHoverNode}
              showStructuralSize={showStructuralSize}
              simulationPhase={simulationPhase}
              activePropagationPath={activePropagationPath}
              compromisedNodeIds={compromisedNodeIds}
              severedEdgeIds={severedEdgeIds}
              highlightedNodeIds={highlightedNodeIds}
              timeTravelDay={timeTravelDay}
              autoRotate={autoRotate}
              showDominatorMode={showDominatorMode}
              scopeFilter={scopeFilter}
              channelFilter={channelFilter}
              bottomOverlay={
                activeView === 'ecosystem' && !isMitigationPanelOpen ? (
                  <TimelinePlayer
                    timeTravelDay={timeTravelDay}
                    onChangeTimeTravel={setTimeTravelDay}
                  />
                ) : null
              }
            />
            {/* Graph Controls Overlay */}
            {activeView === 'ecosystem' && (
              <GraphControls
                onResetView={() => setSelectedNodeId(null)}
                onFocusKeystone={() => setSelectedNodeId('snakeyaml')}
                showStructuralRisk={showStructuralSize}
                onToggleStructuralRisk={() => setShowStructuralSize(prev => !prev)}
                showBlastRadius={showBlastRadius}
                onToggleBlastRadius={() => setShowBlastRadius(prev => !prev)}
                showPropagation={showPropagation}
                onTogglePropagation={() => setShowPropagation(prev => !prev)}
                showDominatorMode={showDominatorMode}
                onToggleDominatorMode={() => setShowDominatorMode(prev => !prev)}
                scopeFilter={scopeFilter}
                onScopeChange={setScopeFilter}
                channelFilter={channelFilter}
                onChannelChange={setChannelFilter}
                autoRotate={autoRotate}
                onToggleAutoRotate={() => setAutoRotate(prev => !prev)}
                onOpenLegend={() => setIsLegendOpen(true)}
              />
            )}


            {/* Dominator Chokepoints Leaderboard Overlay */}
            {showDominatorMode && activeView === 'ecosystem' && (
              <DominatorLeaderboard
                nodes={MOCK_NODES}
                selectedNodeId={selectedNodeId}
                onSelectNode={handleSelectNode}
                onClose={() => setShowDominatorMode(false)}
                isOverlay={true}
              />
            )}

            {/* Hover Tooltip */}
            {activeView === 'ecosystem' && (
              <NodeTooltip node={hoveredNode} position={hoveredPosition} />
            )}
          </div>

          {/* Right-Side Node Intelligence Panel */}
          {selectedNode && activeView === 'ecosystem' && !isMitigationPanelOpen && simulationPhase === 'idle' && (
            <NodeIntelligencePanel
              node={selectedNode}
              activeLens={activeLens}
              timeTravelDay={timeTravelDay}
              onClose={() => setSelectedNodeId(null)}
              onStartSimulation={handleStartSimulation}
              onFreezeCircuitBreaker={() => setIsCircuitBreakerFrozen(prev => !prev)}
              isCircuitBreakerFrozen={isCircuitBreakerFrozen}
              simulationPhase={simulationPhase}
            />
          )}

          {/* Floating Blast Radius HUD during simulation */}
          {(simulationPhase === 'simulating' || simulationPhase === 'active_compromise') && (
            <BlastRadiusHUD
              affectedServicesCount={21}
              tier1Count={4}
              propagationPathsCount={4}
              financialExposure="$85M / Day"
              isSimulating={simulationPhase === 'simulating'}
              onViewPaths={() => setIsPropagationPanelOpen(true)}
              onComputeMitigation={handleComputeMitigation}
              onResetSimulation={handleResetSimulation}
              canMitigate={simulationPhase === 'active_compromise'}
            />
          )}

          {/* Propagation Pathways Overlay Panel */}
          {isPropagationPanelOpen && (
            <PropagationPanel
              paths={MOCK_PROPAGATION_PATHS}
              activePathId={activePropagationPath?.id || null}
              onSelectPath={setActivePropagationPath}
              onClose={() => setIsPropagationPanelOpen(false)}
              onComputeMitigation={handleComputeMitigation}
            />
          )}

          {/* Minimum-Cut Mitigation Prescription Panel */}
          {isMitigationPanelOpen && (
            <MitigationPanel
              candidates={MOCK_MITIGATION_CANDIDATES}
              selectedStrategy={selectedStrategy}
              activeLens={activeLens}
              onSelectStrategy={setSelectedStrategy}
              onApplyFix={handleApplyFix}
              isApplied={simulationPhase === 'mitigation_applied'}
              onClose={() => setIsMitigationPanelOpen(false)}
              onOpenPRModal={() => setIsPRModalOpen(true)}
              onResetSimulation={handleResetSimulation}
            />
          )}

          {/* Overview Dashboard View Tab */}
          {activeView === 'overview' && (
            <OverviewDashboard
              stats={KEYSTONE_STATS}
              nodes={MOCK_NODES}
              topRisks={topRisks}
              activeLens={activeLens}
              onSelectNode={(id) => {
                setSelectedNodeId(id);
                setActiveView('ecosystem');
              }}
              onGoToEcosystem={() => setActiveView('ecosystem')}
              onLaunchHeroDemo={() => {
                setActiveView('ecosystem');
                handleStartSimulation('snakeyaml');
              }}
              onStartDemoScenario={() => {
                setActiveView('ecosystem');
                handleStartSimulation('snakeyaml');
              }}
              onOpenPRModal={() => setIsPRModalOpen(true)}
              onOpenRiskWatchlist={() => setActiveView('watchlist')}
              onOpenSBOMModal={() => setIsSBOMModalOpen(true)}
            />
          )}

          {/* Risk Watchlist View Tab */}
          {activeView === 'watchlist' && (
            <div className="absolute inset-0 z-20">
              <RiskWatchlist
                nodes={MOCK_NODES}
                onSelectNode={(id) => {
                  setSelectedNodeId(id);
                  setActiveView('ecosystem');
                }}
                onReturnToGraph={() => setActiveView('ecosystem')}
              />
            </div>
          )}

          {/* Scenarios View Tab */}
          {activeView === 'scenarios' && (
            <ScenariosView
              onLaunchScenario={(id) => {
                setActiveView('ecosystem');
                if (id === 'snakeyaml_hero') {
                  handleStartSimulation('snakeyaml');
                } else if (id === 'minimist_pollution') {
                  setSelectedNodeId('minimist');
                  handleStartSimulation('minimist');
                } else if (id === 'fresh_maintainer_anomaly') {
                  setTimeTravelDay(-30);
                  setSelectedNodeId('snakeyaml');
                  setHighlightedNodeIds(new Set(['snakeyaml']));
                } else if (id === 'dep_confusion') {
                  setSelectedNodeId('internal-data-pipeline');
                  setHighlightedNodeIds(new Set(['internal-data-pipeline', 'snakeyaml']));
                }
              }}
              onReturnToGraph={() => setActiveView('ecosystem')}
            />
          )}

          {/* Dedicated Blast Radius Telemetry View Tab */}
          {activeView === 'blast-radius' && (
            <div className="absolute inset-0 z-20">
              <BlastRadiusPage
                onNavigateRemediation={() => setActiveView('mitigation')}
                onReturnToGraph={() => setActiveView('ecosystem')}
                onSelectNode={(id) => {
                  setSelectedNodeId(id);
                  setActiveView('ecosystem');
                }}
              />
            </div>
          )}

          {/* Dedicated Remediation Center View Tab */}
          {activeView === 'mitigation' && (
            <div className="absolute inset-0 z-20">
              <RemediationPage
                candidates={MOCK_MITIGATION_CANDIDATES}
                nodes={MOCK_NODES}
                activeLens={activeLens}
                onOpenPRModal={() => setIsPRModalOpen(true)}
                onOpenSBOMModal={() => setIsSBOMModalOpen(true)}
                onReturnToGraph={() => setActiveView('ecosystem')}
                onApplyFix={() => handleApplyFix()}
                isApplied={simulationPhase === 'mitigation_applied'}
              />
            </div>
          )}

          {/* Evidence-Gated Rollout Cockpit View Tab (F10) */}
          {activeView === 'rollout' && (
            <div className="absolute inset-0 z-20">
              <RolloutCockpitView
                onReturnToGraph={() => setActiveView('ecosystem')}
                onOpenPRModal={() => setIsPRModalOpen(true)}
              />
            </div>
          )}

          {/* Connectors & Ecosystem Ingestion */}
          {activeView === 'connectors' && (
            <div className="absolute inset-0 z-20">
              <ConnectorsPage onOpenSBOMModal={() => setIsSBOMModalOpen(true)} />
            </div>
          )}

          {/* Organization & Governance */}
          {activeView === 'organization' && (
            <div className="absolute inset-0 z-20">
              <OrganizationPage userProfile={userProfile} />
            </div>
          )}

          {/* Settings & System Policies */}
          {activeView === 'settings' && (
            <div className="absolute inset-0 z-20">
              <SettingsPage />
            </div>
          )}

          {/* API Keys & Machine Access */}
          {activeView === 'api-keys' && (
            <div className="absolute inset-0 z-20">
              <ApiKeysPage />
            </div>
          )}

          {/* User Profile & Security */}
          {activeView === 'profile' && (
            <div className="absolute inset-0 z-20">
              <ProfilePage
                userProfile={userProfile}
                onUpdateProfile={setUserProfile}
                onSignOut={() => setActiveView('landing')}
              />
            </div>
          )}

          {/* Hardware & Scanner Agents */}
          {activeView === 'hardware' && (
            <div className="absolute inset-0 z-20">
              <HardwarePage />
            </div>
          )}
        </main>
      </div>

      {/* Natural-Language Ask Keystone NLQ Dialog */}
      <AskKeystone
        isOpen={isAskKeystoneOpen}
        onClose={() => setIsAskKeystoneOpen(false)}
        onHighlightNodes={(nodeIds) => {
          setHighlightedNodeIds(new Set(nodeIds));
          if (nodeIds.length > 0) {
            setSelectedNodeId(nodeIds[0]);
          }
        }}
      />

      {/* Coordinated Multi-Repo PR Modal */}
      <CoordinatedPRModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        targetPackage="internal-data-pipeline"
        fromVersion="2.4.0"
        toVersion="2.5.0"
        affectedRepos={7}
        circuitBreakerFrozen={isCircuitBreakerFrozen}
        onToggleCircuitBreaker={() => setIsCircuitBreakerFrozen(prev => !prev)}
      />

      {/* 3D Topology Legend Modal */}
      <TopologyLegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />

      {/* SBOM / Lockfile Ingestion Modal */}
      <SBOMUploadModal
        isOpen={isSBOMModalOpen}
        onClose={() => setIsSBOMModalOpen(false)}
        onIngestSuccess={() => {
          setActiveView('ecosystem');
          setSelectedNodeId('snakeyaml');
          setHighlightedNodeIds(new Set(['snakeyaml']));
        }}
      />
    </div>
  );
}

export default App;
