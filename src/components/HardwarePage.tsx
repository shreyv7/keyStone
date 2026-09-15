import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  ArrowUpRight,
  Radio,
  Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HardwareNode {
  id: string;
  name: string;
  type: 'Bare Metal Appliance' | 'AWS Outpost' | 'Airgapped DMZ';
  ip: string;
  status: 'online' | 'degraded' | 'offline';
  version: string;
  cpu: number;
  ram: string;
  scansCount: string;
  latency: string;
  queueDepth: number;
  lastHeartbeat: string;
  airgapMode: boolean;
}

const INITIAL_NODES: HardwareNode[] = [
  {
    id: 'node-1',
    name: 'edge-scanner-us-east-1a',
    type: 'Bare Metal Appliance',
    ip: '10.240.12.8',
    status: 'online',
    version: 'v2.4.1 (Latest)',
    cpu: 24,
    ram: '18.2 / 64 GB',
    scansCount: '14,290',
    latency: '12ms',
    queueDepth: 0,
    lastHeartbeat: '3s ago',
    airgapMode: false
  },
  {
    id: 'node-2',
    name: 'edge-scanner-eu-west-1',
    type: 'AWS Outpost',
    ip: '10.192.4.19',
    status: 'online',
    version: 'v2.4.1 (Latest)',
    cpu: 41,
    ram: '32.1 / 64 GB',
    scansCount: '8,740',
    latency: '28ms',
    queueDepth: 1,
    lastHeartbeat: '6s ago',
    airgapMode: false
  },
  {
    id: 'node-3',
    name: 'dmz-airgap-agent-01',
    type: 'Airgapped DMZ',
    ip: '192.168.100.2',
    status: 'degraded',
    version: 'v2.3.9 (Update Available)',
    cpu: 89,
    ram: '58.4 / 64 GB',
    scansCount: '29,100',
    latency: '84ms',
    queueDepth: 14,
    lastHeartbeat: '45s ago',
    airgapMode: true
  }
];

export const HardwarePage: React.FC = () => {
  const { isLight } = useTheme();
  const [nodes, setNodes] = useState<HardwareNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<HardwareNode | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerType, setRegisterType] = useState<'docker' | 'helm' | 'baremetal'>('docker');
  const [newNodeName, setNewNodeName] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const onlineCount = nodes.filter(n => n.status === 'online').length;
  const degradedCount = nodes.filter(n => n.status === 'degraded').length;

  const handleDrainNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'degraded', queueDepth: 0 } : n));
    if (selectedNode?.id === id) {
      setSelectedNode(prev => prev ? { ...prev, status: 'degraded', queueDepth: 0 } : null);
    }
  };

  const handleRestartAgent = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'online', cpu: 18, lastHeartbeat: 'Just now' } : n));
    if (selectedNode?.id === id) {
      setSelectedNode(prev => prev ? { ...prev, status: 'online', cpu: 18, lastHeartbeat: 'Just now' } : null);
    }
  };

  return (
    <div className={`w-full h-full overflow-y-auto px-6 py-8 select-text ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616] text-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                EDGE INFRASTRUCTURE
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">• On-Premise & Airgapped Scanner Nodes</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hardware & Scanner Agents</h1>
            <p className="text-sm mt-1.5 max-w-3xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Deploy dedicated Keystone edge nodes into your private VPC, Kubernetes clusters, or isolated air-gapped data centers.
              Private nodes decompile lockfiles and evaluate blast-radius reachability locally without shipping code to the cloud.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Edge Node</span>
          </button>
        </div>

        {/* Status Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Node Status</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{onlineCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ {nodes.length} Online</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              {degradedCount > 0 ? `${degradedCount} Node Degraded (Queue backlog)` : 'All nodes operational'}
            </span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Aggregate Ingestion Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">420</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">SBOMs / hr</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">52,130 lifetime scans</span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Private Mesh</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">mTLS 1.3</span>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> End-to-end encrypted
            </span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Processing Latency</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">18ms</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">p99</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Sub-second graph sync</span>
          </div>
        </div>

        {/* Nodes Table */}
        <div className={`rounded-xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Registered Scanner Appliances</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">3 Assigned Nodes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`border-b font-medium uppercase tracking-wider text-xs ${
                isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}>
                <tr>
                  <th className="py-3 px-4">Node Name / Host</th>
                  <th className="py-3 px-4">Deployment Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">CPU / RAM</th>
                  <th className="py-3 px-4">Queue Depth</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {nodes.map(node => (
                  <tr 
                    key={node.id} 
                    onClick={() => setSelectedNode(node)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold block font-mono text-sm text-slate-900 dark:text-white">{node.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">IP: {node.ip} • {node.version}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {node.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {node.status === 'online' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          Degraded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="text-slate-900 dark:text-slate-200 font-medium block">
                        {node.cpu}% CPU
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 block text-xs">{node.ram}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                      {node.queueDepth > 0 ? (
                        <span className="font-medium text-slate-900 dark:text-slate-200">{node.queueDepth} SBOMs queued</span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">0 queued</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 text-xs">
                      {node.latency}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(node);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                      >
                        Diagnostics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Node Diagnostics Drawer */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col gap-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold font-mono text-slate-900 dark:text-white">{selectedNode.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedNode.type} • {selectedNode.ip}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm pt-1">
              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="text-xs text-slate-500 dark:text-slate-400">Node State</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">{selectedNode.status}</span>
              </div>
              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="text-xs text-slate-500 dark:text-slate-400">Heartbeat</span>
                <span className="font-mono text-xs font-medium text-slate-900 dark:text-slate-200">{selectedNode.lastHeartbeat}</span>
              </div>
              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="text-xs text-slate-500 dark:text-slate-400">CPU Load</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">{selectedNode.cpu}%</span>
              </div>
              <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="text-xs text-slate-500 dark:text-slate-400">Memory Allocation</span>
                <span className="font-mono text-xs font-medium text-slate-900 dark:text-slate-200">{selectedNode.ram}</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border font-mono text-xs leading-relaxed ${
              isLight ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-black/90 text-slate-200 border-slate-800'
            }`}>
              <div className="text-slate-500 mb-1"># Diagnostics Log Stream</div>
              <div>[INFO] mTLS handshake established with Keystone Core (ap-south-1)</div>
              <div>[INFO] Ingesting CycloneDX v1.5 from /var/run/keystone/sockets/ingest.sock</div>
              <div>[OK] Reachability matrix computed in 14.2ms</div>
              {selectedNode.status === 'degraded' && (
                <div className="text-slate-400">[WARN] High CPU load: 14 lockfiles pending Dijkstra resolution</div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleDrainNode(selectedNode.id)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                Drain Traffic
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestartAgent(selectedNode.id)}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Restart Agent
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Scanner Node Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl flex flex-col gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Deploy Keystone Scanner Agent</h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className={`flex items-center gap-1 p-1 rounded-lg border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <button
                  onClick={() => setRegisterType('docker')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    registerType === 'docker' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Docker
                </button>
                <button
                  onClick={() => setRegisterType('helm')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    registerType === 'helm' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Kubernetes (Helm)
                </button>
                <button
                  onClick={() => setRegisterType('baremetal')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    registerType === 'baremetal' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Bare-Metal Systemd
                </button>
              </div>

              <div className={`p-4 rounded-xl border font-mono text-xs relative leading-relaxed overflow-x-auto ${
                isLight ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-black text-slate-200 border-slate-800'
              }`}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`docker run -d --restart=always --name keystone-edge -e ORG_KEY=org_live_8f92a10b4c8e771d93ac -e PROVISION_TOKEN=tok_edge_994b210f88a9 keystonesecurity/agent:latest`);
                    setCopiedSnippet(true);
                    setTimeout(() => setCopiedSnippet(false), 2000);
                  }}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Copy Command"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {registerType === 'docker' && (
                  <pre>
{`docker run -d --restart=always \\
  --name keystone-edge \\
  -e ORG_KEY=org_live_8f92a10b4c8e771d93ac \\
  -e PROVISION_TOKEN=tok_edge_994b210f88a9 \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  keystonesecurity/agent:latest`}
                  </pre>
                )}

                {registerType === 'helm' && (
                  <pre>
{`helm repo add keystone https://charts.keystonesecurity.io
helm install keystone-scanner keystone/edge-agent \\
  --set orgKey="org_live_8f92a10b4c8e771d93ac" \\
  --set token="tok_edge_994b210f88a9" \\
  --set replicas=2`}
                  </pre>
                )}

                {registerType === 'baremetal' && (
                  <pre>
{`curl -sSL https://get.keystonesecurity.io/agent | \\
  sudo bash -s -- \\
  --org-key org_live_8f92a10b4c8e771d93ac \\
  --token tok_edge_994b210f88a9`}
                  </pre>
                )}
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>Once launched, the edge node performs a mutual TLS handshake with Keystone Core and appears in this console within 10 seconds.</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
