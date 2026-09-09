import React, { useState, useMemo, useCallback } from 'react';
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
  RoleLens 
} from './types';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { EcosystemGraph } from './components/EcosystemGraph';
import { GraphControls } from './components/GraphControls';
import { NodeTooltip } from './components/NodeTooltip';
import { NodeIntelligencePanel } from './components/NodeIntelligencePanel';
import { BlastRadiusHUD } from './components/BlastRadiusHUD';
import { PropagationPanel } from './components/PropagationPanel';
import { MitigationPanel } from './components/MitigationPanel';
import { AskKeystone } from './components/AskKeystone';
import { RiskWatchlist } from './components/RiskWatchlist';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ScenariosView } from './components/ScenariosView';
import { CoordinatedPRModal } from './components/CoordinatedPRModal';
import { TopologyLegendModal } from './components/TopologyLegendModal';
import { useTheme } from './context/ThemeContext';

export function App() {
  const { isLight } = useTheme();
  // Navigation View
  const [activeView, setActiveView] = useState<NavView>('ecosystem');

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
  const [isCircuitBreakerFrozen, setIsCircuitBreakerFrozen] = useState<boolean>(false);

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
    setIsMitigationPanelOpen(true);
    setIsPropagationPanelOpen(false);
    // Focus the intervention node
    setSelectedNodeId('internal-data-pipeline');
    setHighlightedNodeIds(new Set(['internal-data-pipeline', 'snakeyaml']));
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

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col transition-colors duration-200 select-none ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#06080d] text-slate-100'
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
          setSearchQuery('');
          setActiveView('ecosystem');
        }}
        searchResults={searchResults}
      />

      {/* Main Workspace Layout (Sidebar + 3D Viewport / Overlays) */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onChangeView={setActiveView}
          stats={KEYSTONE_STATS}
          onOpenAskKeystone={() => setIsAskKeystoneOpen(true)}
        />

        {/* Center Main Stage */}
        <main className="relative flex-1 w-full h-full overflow-hidden">
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
          />

          {/* Graph Controls Overlay */}
          <GraphControls
            onResetView={() => setSelectedNodeId(null)}
            onFocusKeystone={() => setSelectedNodeId('snakeyaml')}
            showStructuralRisk={showStructuralSize}
            onToggleStructuralRisk={() => setShowStructuralSize(prev => !prev)}
            showBlastRadius={showBlastRadius}
            onToggleBlastRadius={() => setShowBlastRadius(prev => !prev)}
            showPropagation={showPropagation}
            onTogglePropagation={() => setShowPropagation(prev => !prev)}
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate(prev => !prev)}
            onOpenLegend={() => setIsLegendOpen(true)}
          />

          {/* Hover Tooltip */}
          <NodeTooltip node={hoveredNode} position={hoveredPosition} />

          {/* Right-Side Node Intelligence Panel */}
          {selectedNode && activeView === 'ecosystem' && !isMitigationPanelOpen && (
            <NodeIntelligencePanel
              node={selectedNode}
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
              onSelectNode={(id) => {
                setSelectedNodeId(id);
                setActiveView('ecosystem');
              }}
              onGoToEcosystem={() => setActiveView('ecosystem')}
              onStartDemoScenario={() => {
                setActiveView('ecosystem');
                handleStartSimulation('snakeyaml');
              }}
            />
          )}

          {/* Risk Watchlist View Tab */}
          {activeView === 'watchlist' && (
            <RiskWatchlist
              nodes={MOCK_NODES}
              onSelectNode={(id) => {
                setSelectedNodeId(id);
                setActiveView('ecosystem');
              }}
              onReturnToGraph={() => setActiveView('ecosystem')}
            />
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
                }
              }}
              onReturnToGraph={() => setActiveView('ecosystem')}
            />
          )}

          {/* Mitigation Standalone View Tab */}
          {activeView === 'mitigation' && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-end">
              <div className="pointer-events-auto">
                <MitigationPanel
                  candidates={MOCK_MITIGATION_CANDIDATES}
                  selectedStrategy={selectedStrategy}
                  onSelectStrategy={setSelectedStrategy}
                  onApplyFix={handleApplyFix}
                  isApplied={simulationPhase === 'mitigation_applied'}
                  onClose={() => setActiveView('ecosystem')}
                  onOpenPRModal={() => setIsPRModalOpen(true)}
                  onResetSimulation={handleResetSimulation}
                />
              </div>
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
    </div>
  );
}

export default App;
