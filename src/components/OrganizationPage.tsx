import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  FileText, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  ExternalLink,
  ChevronRight,
  Clock,
  UserPlus,
  Sliders,
  Sparkles,
  Lock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UserProfile } from '../types';

interface OrganizationPageProps {
  userProfile?: UserProfile;
}

interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Security Engineer' | 'Developer' | 'Auditor';
  twoFactor: boolean;
  lastActive: string;
  avatarInitials: string;
}

const INITIAL_MEMBERS: OrgMember[] = [
  { id: '1', name: 'Alex Chen', email: 'alex.chen@acme-corp.com', role: 'Owner', twoFactor: true, lastActive: 'Active Now', avatarInitials: 'AC' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@acme-corp.com', role: 'Admin', twoFactor: true, lastActive: '2 hours ago', avatarInitials: 'SJ' },
  { id: '3', name: 'Devika Nair', email: 'devika.n@acme-corp.com', role: 'Security Engineer', twoFactor: true, lastActive: 'Yesterday', avatarInitials: 'DN' },
  { id: '4', name: 'Marcus Vance', email: 'm.vance@acme-corp.com', role: 'Developer', twoFactor: true, lastActive: '3 days ago', avatarInitials: 'MV' },
  { id: '5', name: 'Emily Zhang', email: 'emily.z@acme-corp.com', role: 'Developer', twoFactor: true, lastActive: '5 days ago', avatarInitials: 'EZ' }
];

const AUDIT_LOGS = [
  { id: 'log-1', action: 'Coordinated PR #1042 dispatched to 7 repositories', actor: 'Marcus Vance', role: 'Developer', ip: '192.0.2.45', time: '12 mins ago', type: 'mitigation' },
  { id: 'log-2', action: 'Circuit Breaker engaged on @internal/auth:v2.4.0', actor: 'Alex Chen', role: 'Owner', ip: '198.51.100.12', time: '45 mins ago', type: 'policy' },
  { id: 'log-3', action: 'API Key CI_SCANNER_PROD rotated', actor: 'Devika Nair', role: 'Security Engineer', ip: '203.0.113.88', time: '2 hours ago', type: 'auth' },
  { id: 'log-4', action: 'Ingested CycloneDX 1.5 SBOM for repo: payment-gateway', actor: 'GitHub App Webhook', role: 'Integration', ip: '140.82.112.4', time: '4 hours ago', type: 'ingest' },
  { id: 'log-5', action: 'SAML SSO configuration verified (Okta identity)', actor: 'Sarah Jenkins', role: 'Admin', ip: '198.51.100.4', time: '1 day ago', type: 'auth' },
  { id: 'log-6', action: 'Systemic risk alert escalated to PagerDuty (#keystone-p1)', actor: 'Keystone Engine', role: 'System', ip: 'internal-daemon', time: '2 days ago', type: 'policy' },
  { id: 'log-7', action: 'Scanner Edge Node edge-scanner-eu-west-1 provisioned', actor: 'Marcus Vance', role: 'Developer', ip: '54.216.12.90', time: '3 days ago', type: 'hardware' },
  { id: 'log-8', action: 'Organization invitation accepted by Emily Zhang', actor: 'Emily Zhang', role: 'Developer', ip: '198.51.100.33', time: '5 days ago', type: 'auth' }
];

export const OrganizationPage: React.FC<OrganizationPageProps> = ({ userProfile }) => {
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'members' | 'roles' | 'audit'>('profile');

  // Org state
  const [orgName, setOrgName] = useState('Acme Global Infrastructure');
  const [orgSlug, setOrgSlug] = useState('acme-global');
  const [contactEmail, setContactEmail] = useState('sec-ops@acme-corp.com');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Members state
  const [members, setMembers] = useState<OrgMember[]>(INITIAL_MEMBERS);
  const [memberSearch, setMemberSearch] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Security Engineer' | 'Developer' | 'Auditor'>('Security Engineer');

  // Audit state
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<'all' | 'mitigation' | 'policy' | 'auth' | 'ingest'>('all');

  const orgUuid = 'org_live_8f92a10b4c8e771d93ac';

  const handleCopySlug = () => {
    navigator.clipboard.writeText(orgUuid);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: OrgMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split('@')[0].replace('.', ' '),
      email: inviteEmail,
      role: inviteRole,
      twoFactor: false,
      lastActive: 'Invited (Pending)',
      avatarInitials: inviteEmail.slice(0, 2).toUpperCase()
    };

    setMembers(prev => [newMember, ...prev]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredAuditLogs = AUDIT_LOGS.filter(l => {
    const matchesType = auditFilter === 'all' || l.type === auditFilter;
    const matchesSearch = l.action.toLowerCase().includes(auditSearch.toLowerCase()) || 
                          l.actor.toLowerCase().includes(auditSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className={`w-full h-full overflow-y-auto px-6 py-8 select-text ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#06080d] text-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                ORGANIZATION WORKSPACE
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">• Enterprise Governance</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Organization & Governance</h1>
            <p className="text-sm mt-1.5 max-w-3xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage organization identity, team roles & permissions, and enterprise audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
              Tier: <strong className="text-blue-600 dark:text-blue-400 font-semibold">Enterprise Active</strong>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? isLight ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'bg-slate-800 text-blue-400 font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profile & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'members'
                ? isLight ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'bg-slate-800 text-blue-400 font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'roles'
                ? isLight ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'bg-slate-800 text-blue-400 font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Roles & RBAC</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? isLight ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'bg-slate-800 text-blue-400 font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* TAB 1: PROFILE & IDENTITY */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Organization Profile</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Primary identifier and tenant configuration for supply-chain isolation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Organization Slug (URL Identifier)</label>
                  <input
                    type="text"
                    value={orgSlug}
                    onChange={e => setOrgSlug(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden font-mono text-sm ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Primary Security Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Enterprise SSO Domain</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="acme-corp.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SAML Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Org UUID & Key */}
              <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold block text-slate-900 dark:text-white">Organization UUID & API Identity</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Used by CLI tools and Edge Scanner Nodes to authenticate multi-repo ingestion.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySlug}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
                <code className="text-xs font-mono text-blue-600 dark:text-blue-400 break-all font-semibold">{orgUuid}</code>
              </div>

              {/* Data Residency & Sovereignty */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Active Sovereign Data Residency</span>
                <div className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇮🇳</span>
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">India — DPDP / Indian Data Residency</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">All dependency graphs, lockfiles, and blast-radius vectors are encrypted within ap-south-1.</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    Compliant & Verified
                  </span>
                </div>
              </div>

              {/* Save Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                {savedSuccess ? (
                  <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Organization preferences saved successfully.
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Changes apply across all workspace members.</span>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs cursor-pointer transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: MEMBERS */}
        {activeTab === 'members' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search members by name, email, or role..."
                  className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border outline-hidden ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500'
                  }`}
                />
              </div>

              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs cursor-pointer transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Workspace Member</span>
              </button>
            </div>

            {/* Members Table */}
            <div className={`rounded-xl border overflow-hidden ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <table className="w-full text-left text-sm">
                <thead className={`border-b font-medium uppercase tracking-wider text-xs ${
                  isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">2FA Status</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {member.avatarInitials}
                          </div>
                          <div>
                            <span className="font-semibold block text-slate-900 dark:text-white text-sm">{member.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${
                          member.role === 'Owner'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {member.twoFactor ? (
                          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> FIDO2 Active
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-xs font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                        {member.lastActive}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {member.role !== 'Owner' ? (
                          <button
                            onClick={() => setMembers(prev => prev.filter(m => m.id !== member.id))}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">Immutable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROLES & RBAC MATRIX */}
        {activeTab === 'roles' && (
          <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Role-Based Access Control (RBAC)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Permissions matrix governing graph simulation, mitigation execution, and secrets management.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`border-b font-semibold uppercase tracking-wider text-xs ${
                  isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Capability / Scope</th>
                    <th className="py-3 px-3 text-center">Owner</th>
                    <th className="py-3 px-3 text-center">Admin</th>
                    <th className="py-3 px-3 text-center">SecEng</th>
                    <th className="py-3 px-3 text-center">Developer</th>
                    <th className="py-3 px-3 text-center">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {[
                    { name: 'View 3D Topology & SIFI Centrality Scores', roles: [true, true, true, true, true] },
                    { name: 'Run Blast Radius & Propagation Simulations', roles: [true, true, true, true, false] },
                    { name: 'Engage Circuit Breaker / Freeze Dependencies', roles: [true, true, true, false, false] },
                    { name: 'Dispatch Coordinated Multi-Repo PRs', roles: [true, true, true, true, false] },
                    { name: 'Manage Connectors & SCM Integrations', roles: [true, true, false, false, false] },
                    { name: 'Provision & Rotate Platform API Keys', roles: [true, true, true, false, false] },
                    { name: 'Deploy Scanner Hardware / Edge Agents', roles: [true, true, true, false, false] },
                    { name: 'Export SOC2 / DPDP Forensic Audit Logs', roles: [true, true, true, false, true] },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">{row.name}</td>
                      {row.roles.map((hasAccess, rIdx) => (
                        <td key={rIdx} className="py-3.5 px-3 text-center">
                          {hasAccess ? (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto" />
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 font-mono">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={e => setAuditSearch(e.target.value)}
                    placeholder="Search audit trail..."
                    className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border outline-hidden ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500'
                    }`}
                  />
                </div>

                <select
                  value={auditFilter}
                  onChange={e => setAuditFilter(e.target.value as any)}
                  className={`px-3 py-2 text-sm rounded-lg border outline-hidden cursor-pointer ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
                  }`}
                >
                  <option value="all">All Events</option>
                  <option value="mitigation">Mitigations</option>
                  <option value="policy">Policy & Circuit Breakers</option>
                  <option value="auth">Auth & SSO</option>
                  <option value="ingest">Ingestion</option>
                </select>
              </div>

              <button
                onClick={() => alert('Exporting encrypted audit log JSON bundle (SHA256-signed)...')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Export Audit Log</span>
              </button>
            </div>

            <div className={`rounded-xl border overflow-hidden ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block text-slate-900 dark:text-white">{log.action}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Actor: <strong className="text-slate-700 dark:text-slate-300 font-medium">{log.actor}</strong> ({log.role})</span>
                          <span>•</span>
                          <span className="font-mono">IP: {log.ip}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleInviteSubmit} className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl flex flex-col gap-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Invite Member to Organization</h2>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="engineer@acme-corp.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as any)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                >
                  <option value="Security Engineer">Security Engineer (Simulation & Mitigation)</option>
                  <option value="Developer">Developer (PR review & ingestion)</option>
                  <option value="Admin">Admin (Full configuration)</option>
                  <option value="Auditor">Auditor (Read-only forensics)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
