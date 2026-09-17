import React, { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Bell, 
  Globe, 
  AlertTriangle, 
  Check, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  Save, 
  Trash2, 
  Terminal, 
  Key, 
  Server,
  Zap,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RoleLens, NavView } from '../types';

export const SettingsPage: React.FC = () => {
  const { isLight } = useTheme();
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'notifications' | 'residency' | 'danger'>('general');

  // General state
  const [workspaceName, setWorkspaceName] = useState('Acme Global Core Workspace');
  const [defaultLens, setDefaultLens] = useState<RoleLens>('developer');
  const [defaultView, setDefaultView] = useState<NavView>('ecosystem');
  const [sifiThreshold, setSifiThreshold] = useState<number>(70);
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +05:30)');

  // Security state
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [enforceFido, setEnforceFido] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [ipAllowlist, setIpAllowlist] = useState('198.51.100.0/24\n192.0.2.0/24\n54.216.0.0/16');

  // Notifications state
  const [alertSlack, setAlertSlack] = useState(true);
  const [alertEmail, setAlertEmail] = useState(true);
  const [alertPagerDuty, setAlertPagerDuty] = useState(true);
  const [notifyOnSifi, setNotifyOnSifi] = useState(true);
  const [notifyOnTier1, setNotifyOnTier1] = useState(true);
  const [notifyOnMaintainerAnomaly, setNotifyOnMaintainerAnomaly] = useState(true);
  const [notifyOnCoordinatedPr, setNotifyOnCoordinatedPr] = useState(true);

  // Residency state
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('🇮🇳 India — DPDP / Indian Data Residency');
  const [kmsMode, setKmsMode] = useState<'keystone' | 'customer'>('keystone');
  const [kmsArn, setKmsArn] = useState('arn:aws:kms:ap-south-1:123456789012:key/8f92a10b-4c8e');

  // Danger state
  const [confirmSlugInput, setConfirmSlugInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const jurisdictions = [
    { label: '🇮🇳 India — DPDP / Indian Data Residency', value: '🇮🇳 India — DPDP / Indian Data Residency', region: 'ap-south-1 (Mumbai)' },
    { label: '🇪🇺 EU — GDPR / EU Data Residency', value: '🇪🇺 EU — GDPR / EU Data Residency', region: 'eu-central-1 (Frankfurt)' },
    { label: '🇺🇸 United States — SOC 2 / US Data Residency', value: '🇺🇸 United States — SOC 2 / US Data Residency', region: 'us-east-1 (N. Virginia)' },
    { label: '🇬🇧 UK — UK GDPR', value: '🇬🇧 UK — UK GDPR', region: 'eu-west-2 (London)' },
    { label: '🇨🇦 Canada — Canadian Data Residency', value: '🇨🇦 Canada — Canadian Data Residency', region: 'ca-central-1 (Central)' },
    { label: '🇸🇬 Singapore — PDPA', value: '🇸🇬 Singapore — PDPA', region: 'ap-southeast-1 (Singapore)' },
    { label: '🇦🇺 Australia — Privacy Act', value: '🇦🇺 Australia — Privacy Act', region: 'ap-southeast-2 (Sydney)' },
    { label: '🛡️ US Government — FedRAMP / ITAR', value: '🛡️ US Government — FedRAMP / ITAR', region: 'us-gov-west-1 (AWS GovCloud)' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className={`w-full h-full overflow-y-auto px-6 py-8 select-text ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616] text-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">System & Security Settings</h1>
            <p className="text-sm mt-1.5 max-w-3xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Configure default security lenses, concentration thresholds, authentication enforcement, and data residency.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all shrink-0 cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved' : 'Save All Settings'}</span>
          </button>
        </div>

        {/* Layout: Left Sidebar Tabs + Right Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Navigation Sidebar */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveSection('general')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeSection === 'general'
                  ? isLight ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>General & Defaults</span>
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeSection === 'security'
                  ? isLight ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security & Access (SSO)</span>
            </button>

            <button
              onClick={() => setActiveSection('notifications')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeSection === 'notifications'
                  ? isLight ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alerts & Notifications</span>
            </button>

            <button
              onClick={() => setActiveSection('residency')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeSection === 'residency'
                  ? isLight ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-semibold' : 'bg-slate-800 text-blue-400 font-semibold'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Data Residency & KMS</span>
            </button>

            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveSection('danger')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeSection === 'danger'
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Danger Zone</span>
              </button>
            </div>
          </div>

          {/* Section Panels */}
          <div className="md:col-span-3 flex flex-col gap-6">
            
            {/* GENERAL SECTION */}
            {activeSection === 'general' && (
              <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">General Workspace Configuration</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Control default perspectives and algorithmic thresholds.</p>
                </div>

                <div className="flex flex-col gap-5 text-sm">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Workspace Display Title</label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={e => setWorkspaceName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Role Lens Default */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-2 font-medium">Default Role Lens</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'ciso', title: 'CISO / Executive', desc: 'Financial blast radius, $ exposure, and compliance' },
                        { id: 'developer', title: 'Developer / AppSec', desc: 'Breakages, semver jumps, and PR coordination' },
                        { id: 'maintainer', title: 'Maintainer / SRE', desc: 'Ecosystem health, bus factors, and anomalies' }
                      ].map(lens => (
                        <div
                          key={lens.id}
                          onClick={() => setDefaultLens(lens.id as RoleLens)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            defaultLens === lens.id
                              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-600'
                              : isLight ? 'border-slate-200 hover:border-slate-300 text-slate-700' : 'border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="font-semibold block text-sm">{lens.title}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{lens.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SIFI Threshold Slider */}
                  <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/70 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">Systemic Risk SIFI Threshold</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-sm">{sifiThreshold}% Concentration</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Dependencies reaching more than this percentage of critical assets are designated as systemic risks.
                    </p>
                    <input
                      type="range"
                      min="50"
                      max="90"
                      step="5"
                      value={sifiThreshold}
                      onChange={e => setSifiThreshold(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer mt-1"
                    />
                  </div>

                  {/* Default Entry View */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Default Landing Console View</label>
                    <select
                      value={defaultView}
                      onChange={e => setDefaultView(e.target.value as NavView)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden cursor-pointer text-sm ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                    >
                      <option value="overview">Security Posture Overview</option>
                      <option value="ecosystem">Topology Graph</option>
                      <option value="watchlist">Risk Watchlist</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Reporting Timezone</label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden font-mono text-sm ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY & SSO SECTION */}
            {activeSection === 'security' && (
              <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Authentication & Zero Trust Security</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">SAML 2.0 Identity Provider federation, hardware WebAuthn, and session controls.</p>
                </div>

                <div className="flex flex-col gap-5 text-sm">
                  {/* SAML Provider */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/70 border-slate-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        SAML
                      </div>
                      <div>
                        <span className="font-semibold block text-slate-900 dark:text-white">Okta SSO Integration</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Entity ID: https://iam.acme-corp.com/saml/metadata</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      Connected & Active
                    </span>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Enforce Two-Factor Authentication (2FA)</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Require all developers and security engineers to authenticate with TOTP or FIDO2.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enforce2FA}
                      onChange={e => setEnforce2FA(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* FIDO2 Hardware Key */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Enforce Hardware FIDO2 Security Keys for Admins</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Requires physical security keys for quarantine actions and automated PR dispatch.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enforceFido}
                      onChange={e => setEnforceFido(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  {/* Session Timeout */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Inactivity Session Timeout</label>
                    <select
                      value={sessionTimeout}
                      onChange={e => setSessionTimeout(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden cursor-pointer text-sm ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                    >
                      <option value="15m">15 Minutes (Strict Banking Standard)</option>
                      <option value="30m">30 Minutes (Recommended)</option>
                      <option value="1h">1 Hour</option>
                      <option value="4h">4 Hours</option>
                    </select>
                  </div>

                  {/* IP Allowlist */}
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Corporate IP Allowlist (CIDR Blocks)</label>
                    <textarea
                      rows={3}
                      value={ipAllowlist}
                      onChange={e => setIpAllowlist(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden font-mono text-xs ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                      placeholder="e.g. 198.51.100.0/24"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Traffic originating outside these CIDRs will be denied console access.</span>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeSection === 'notifications' && (
              <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Alert Dispatches & Webhooks</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Route high-priority security notifications to integrated communication channels.</p>
                </div>

                <div className="flex flex-col gap-5 text-sm">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Slack Security Operations Channel</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Post immediate summaries to #keystone-secops</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertSlack}
                      onChange={e => setAlertSlack(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">PagerDuty Incident Escalation</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Trigger P1 alerts when critical service exposure is detected</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertPagerDuty}
                      onChange={e => setAlertPagerDuty(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Daily CISO & Executive Email Digest</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Aggregated macro posture, total SIFI concentration, and severed vectors</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertEmail}
                      onChange={e => setAlertEmail(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-sm font-semibold block mb-3 text-slate-900 dark:text-white">Event Triggers</span>
                    <div className="flex flex-col gap-2.5">
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={notifyOnSifi}
                          onChange={e => setNotifyOnSifi(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span>New systemic risk dependency identified (&gt;70% concentration)</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={notifyOnTier1}
                          onChange={e => setNotifyOnTier1(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span>Propagation path reaches critical service</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={notifyOnMaintainerAnomaly}
                          onChange={e => setNotifyOnMaintainerAnomaly(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span>Maintainer anomaly or rapid account transfer detected</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={notifyOnCoordinatedPr}
                          onChange={e => setNotifyOnCoordinatedPr(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span>Targeted remediation PR generated and ready for review</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DATA RESIDENCY & KMS */}
            {activeSection === 'residency' && (
              <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Data Residency, Sovereignty & KMS</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Enforce legal jurisdiction compliance and hardware cryptographic key custody.</p>
                </div>

                <div className="flex flex-col gap-5 text-sm">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Compliance Jurisdiction</label>
                    <select
                      value={selectedJurisdiction}
                      onChange={e => setSelectedJurisdiction(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden cursor-pointer font-medium text-sm ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                      }`}
                    >
                      {jurisdictions.map(j => (
                        <option key={j.value} value={j.value}>
                          {j.label} ({j.region})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* KMS Options */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-slate-700 dark:text-slate-300 block mb-2 font-medium">Encryption at Rest & Key Management (KMS)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setKmsMode('keystone')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          kmsMode === 'keystone'
                            ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600'
                            : isLight ? 'border-slate-200 hover:border-slate-300' : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold block text-slate-900 dark:text-white text-sm">Keystone Managed KMS</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Automated key rotation with regional hardware security modules (FIPS 140-2 Level 3).</span>
                      </div>

                      <div
                        onClick={() => setKmsMode('customer')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          kmsMode === 'customer'
                            ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600'
                            : isLight ? 'border-slate-200 hover:border-slate-300' : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold block text-slate-900 dark:text-white text-sm">Customer Managed Key (BYOK)</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Bring your own AWS KMS ARN, Google Cloud KMS, or HashiCorp Vault.</span>
                      </div>
                    </div>

                    {kmsMode === 'customer' && (
                      <div className="mt-3.5">
                        <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">AWS KMS Key ARN or Vault Path</label>
                        <input
                          type="text"
                          value={kmsArn}
                          onChange={e => setKmsArn(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DANGER ZONE */}
            {activeSection === 'danger' && (
              <div className="p-6 rounded-xl border border-red-300 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/10 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" /> Danger Zone
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Destructive actions affecting graph states, circuit breakers, and organization data.</p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Sever All Circuit Breakers</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Release all frozen dependency versions back to registry wild.</span>
                    </div>
                    <button
                      onClick={() => alert('All active circuit breakers released.')}
                      className="px-3.5 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Release Pins
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Reset Workspace to Demo Baseline</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Restores snakeyaml hero scenario, clears active simulations, and refreshes mock lockfiles.</span>
                    </div>
                    <button
                      onClick={() => alert('Workspace reset to baseline state.')}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reset Baseline
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-red-300 dark:border-red-900/50 bg-white dark:bg-slate-900/80 flex flex-col gap-3">
                    <div>
                      <span className="font-semibold text-red-600 dark:text-red-400 block">Delete Organization & Erase All Graphs</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Permanently purge all 42 ingested repositories, 1,489 keystones, API keys, and audit logs.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type 'acme-global' to confirm"
                        value={confirmSlugInput}
                        onChange={e => setConfirmSlugInput(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono w-64 outline-hidden"
                      />
                      <button
                        disabled={confirmSlugInput !== 'acme-global'}
                        onClick={() => alert('Organization deleted.')}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold cursor-pointer"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
