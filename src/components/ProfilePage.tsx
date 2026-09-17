import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Key, 
  Laptop, 
  Smartphone, 
  Check, 
  CheckCircle2, 
  Save, 
  Plus, 
  Trash2, 
  Sliders, 
  Clock, 
  Lock, 
  LogOut,
  SmartphoneNfc
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UserProfile, RoleLens } from '../types';
import { PageHeader } from './ui/PageHeader';
import { Disclosure } from './ui/Disclosure';

interface ProfilePageProps {
  userProfile: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onSignOut?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onUpdateProfile,
  onSignOut
}) => {
  const { isLight } = useTheme();

  const [name, setName] = useState(userProfile?.name || 'Alex Chen');
  const [email, setEmail] = useState(userProfile?.email || 'alex.chen@acme-corp.com');
  const [title, setTitle] = useState('Principal Security Architect');
  const [roleLens, setRoleLens] = useState<RoleLens>(userProfile?.roleLens || 'developer');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +05:30)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active sessions mock
  const [sessions, setSessions] = useState([
    { id: '1', device: 'MacBook Pro 16" (macOS Sequoia)', location: 'Mumbai, IN', ip: '198.51.100.12', current: true, time: 'Active Now', icon: 'laptop' },
    { id: '2', device: 'Linux DevStation (Ubuntu 24.04 LTS)', location: 'Bengaluru, IN', ip: '192.0.2.45', current: false, time: '2 hours ago', icon: 'server' },
    { id: '3', device: 'iPhone 16 Pro (Keystone Mobile)', location: 'Mumbai, IN', ip: '198.51.100.88', current: false, time: 'Yesterday', icon: 'mobile' }
  ]);

  // Personal Tokens
  const [tokens, setTokens] = useState([
    { id: 'pat-1', name: 'CLI_TERMINAL_MAC', prefix: 'pat_live_7a1...99e', expires: 'In 60 days', created: 'Aug 20, 2026' },
    { id: 'pat-2', name: 'VSCODE_KEYSTONE_LSP', prefix: 'pat_live_14c...b21', expires: 'In 320 days', created: 'Jan 10, 2026' }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        name,
        email,
        roleLens
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleRevokeToken = (id: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className={`w-full h-full overflow-y-auto px-4 py-5 sm:px-6 select-text ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616] text-slate-100'
    }`}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        <PageHeader
          title={name}
          description={`${title} · ${userProfile?.organization || 'Acme Global Infrastructure'}`}
          eyebrow="Profile and security"
          primaryAction={
          <button
            onClick={handleSave}
            className="ks-btn ks-btn-primary ks-btn-md"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved' : 'Save profile'}</span>
          </button>
          }
        />

        {/* Form Grid */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Identity Information */}
          <div className="connector-3d-card p-6 flex flex-col gap-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Identity & Account</span>
            </h3>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Corporate Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Job Role / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Organization Scope</label>
                <input
                  type="text"
                  readOnly
                  value={userProfile?.organization || 'Acme Global Infrastructure'}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Preferences & Role Lens */}
          <div className="connector-3d-card p-6 flex flex-col gap-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Perspective Preferences</span>
            </h3>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Preferred Role Lens</label>
                <select
                  value={roleLens}
                  onChange={e => setRoleLens(e.target.value as RoleLens)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden cursor-pointer text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                  }`}
                >
                  <option value="developer">AppSec (fix coordination and compatibility)</option>
                  <option value="ciso">CISO / Executive (Business exposure and concentration)</option>
                  <option value="maintainer">Engineering (maintenance health and changes)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-medium">Preferred Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border outline-hidden font-mono text-sm ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-blue-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                  }`}
                />
              </div>

              <div className={`p-4 rounded-xl border mt-2 flex flex-col gap-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
              }`}>
                <span className="font-semibold text-xs text-slate-900 dark:text-white block">Monitored Portfolio</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">42 Repositories • 1,489 Keystones Ingested</span>
              </div>
            </div>
          </div>

        </form>

        <Disclosure title="Authentication methods" summary="Two verified sign-in methods are active">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hardware-backed methods protect sensitive remediation and quarantine actions.</p>
            </div>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> FIDO2 WebAuthn Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <SmartphoneNfc className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white text-sm">YubiKey 5C NFC</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Serial: 14892011 • Registered Jul 2026</span>
                </div>
              </div>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">Primary</span>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-white text-sm">Apple Touch ID (Secure Enclave)</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Hardware biometric authenticator</span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Secondary</span>
            </div>
          </div>
        </Disclosure>

        <Disclosure title="Active sessions" summary={`${sessions.length} devices are signed in`}>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {sessions.map(s => (
              <div key={s.id} className="py-3.5 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{s.device}</span>
                      {s.current && (
                        <span className="px-2 py-0.5 rounded-md text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{s.location} • IP: {s.ip} • {s.time}</span>
                  </div>
                </div>

                {!s.current && (
                  <button
                    onClick={() => handleRevokeSession(s.id)}
                    className="text-xs text-slate-500 hover:text-red-500 font-medium cursor-pointer transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </Disclosure>

        <Disclosure title="Personal access tokens" summary={`${tokens.length} tokens for local developer tools`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => alert('Generating new personal CLI token...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Token</span>
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {tokens.map(t => (
              <div key={t.id} className="py-3.5 flex items-center justify-between gap-3 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold font-mono text-slate-900 dark:text-white text-sm">{t.name}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 text-xs font-semibold">{t.prefix}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Created {t.created} • Expires {t.expires}</span>
                </div>

                <button
                  onClick={() => handleRevokeToken(t.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Revoke Token"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Disclosure>

        {/* Sign out */}
        {onSignOut && (
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
