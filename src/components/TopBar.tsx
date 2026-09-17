import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Sun,
  Moon,
  CheckCheck,
  Zap,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Check,
  LogOut,
  Menu,
  Lock
} from 'lucide-react';
import { RoleLens, UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SecurityAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  nodeId: string;
  isRead: boolean;
}

const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'alert-1',
    severity: 'CRITICAL',
    title: 'Dependency impact increased',
    description: 'snakeyaml@1.33 now affects substantially more services across 42 monitored repositories.',
    timestamp: '12m ago',
    nodeId: 'snakeyaml',
    isRead: false
  },
  {
    id: 'alert-2',
    severity: 'HIGH',
    title: 'Package impersonation blocked',
    description: 'A public upload attempted to use an internal package name. Private registry protection stopped it.',
    timestamp: '42m ago',
    nodeId: 'internal-data-pipeline',
    isRead: false
  },
  {
    id: 'alert-3',
    severity: 'MEDIUM',
    title: 'High-impact dependency found',
    description: 'A minimist failure could isolate the payment gateway from the billing service group.',
    timestamp: '2h ago',
    nodeId: 'minimist',
    isRead: false
  },
  {
    id: 'alert-4',
    severity: 'INFO',
    title: 'Non-exploitable finding resolved',
    description: 'Maintainer evidence confirms the affected lodash code is not reachable in production.',
    timestamp: '1d ago',
    nodeId: 'lodash',
    isRead: true
  }
];

interface TopBarProps {
  onGoToLanding?: () => void;
  activeLens: RoleLens;
  onChangeLens: (lens: RoleLens) => void;
  timeTravelDay?: number;
  onChangeTimeTravel?: (day: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSearchResult: (nodeId: string) => void;
  searchResults: Array<{ id: string; name: string; version: string; structuralRisk: string }>;
  isCircuitBreakerFrozen?: boolean;
  onToggleCircuitBreaker?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  userProfile?: UserProfile;
  onSignOut?: () => void;
  onNavigateProfile?: () => void;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Chen',
  email: 'sec-ops@acme-corp.com',
  organization: 'Acme Global Infrastructure',
  roleLens: 'developer',
  region: 'us-east-1',
  scopeCount: 42,
  avatarInitials: 'AC',
  licenseTier: 'Enterprise Active'
};

export const TopBar: React.FC<TopBarProps> = ({
  onGoToLanding,
  activeLens,
  onChangeLens,
  timeTravelDay,
  onChangeTimeTravel,
  searchQuery,
  onSearchChange,
  onSelectSearchResult,
  searchResults,
  isCircuitBreakerFrozen = false,
  onToggleCircuitBreaker,
  isSidebarCollapsed = false,
  onToggleSidebar,
  userProfile = DEFAULT_USER_PROFILE,
  onSignOut,
  onNavigateProfile
}) => {
  const { toggleTheme, isLight } = useTheme();
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [alertFilter, setAlertFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const filteredAlerts = alerts.filter(a => {
    if (alertFilter === 'unread') return !a.isRead;
    if (alertFilter === 'critical') return a.severity === 'CRITICAL';
    return true;
  });

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const handleInspectAlert = (nodeId: string, alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? ({ ...a, isRead: true }) : a));
    setIsAlertsOpen(false);
    onSelectSearchResult(nodeId);
  };

  return (
    <header className={`h-14 w-full border-b transition-colors duration-150 px-2.5 sm:px-5 flex items-center justify-between z-30 shrink-0 select-none ${
      isLight 
        ? 'bg-white border-slate-200 text-slate-800' 
        : 'bg-[#0a0f1d] border-slate-800 text-slate-100'
    }`}>
      {/* Brand, Sidebar Toggle & Portfolio Meta */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-md border transition-colors ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
            title={isSidebarCollapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Keystone Brand Logo */}
        <div 
          onClick={onGoToLanding}
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity group"
          title="Return to Landing Page"
        >
          <img 
            src="/assets/logo.png" 
            alt="Keystone Logo" 
            className="w-7 h-7 object-contain transition-transform group-hover:scale-105" 
          />
          <span className="font-bold tracking-tight text-base hidden sm:inline text-slate-900 dark:text-white">KEYSTONE</span>
        </div>
        <div className="hidden 2xl:flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-700 shadow-xs' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Scope:</span>
            <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Production Core</span>
            <ChevronDown className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            isLight 
              ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
              : 'bg-blue-950/40 border-blue-900/50 text-blue-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span className="text-xs font-medium">42 Repositories Monitored</span>
          </div>
        </div>

      </div>

      {/* Right Controls: Circuit Breaker, Search, Theme Toggle & Meta */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Persistent Circuit Breaker Status Indicator (P2-5) */}
        {isCircuitBreakerFrozen && (
          <button
            onClick={onToggleCircuitBreaker}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-xs animate-pulse hover:bg-amber-500/25 transition-colors"
            title="CI/CD Intake Quarantine Active: Builds importing vulnerable versions are blocked. Click to unlock."
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline text-[11px]">Dependency quarantined</span>
            <span className="sm:hidden text-[10px]">Quarantined</span>
          </button>
        )}
        {/* Search */}
        <div className="relative w-28 sm:w-48 md:w-64">
          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm transition-all ${
            isLight 
              ? 'bg-white border-slate-300 text-slate-800 focus-within:border-blue-500 shadow-xs' 
              : 'bg-slate-900 border-slate-800 text-slate-200 focus-within:border-blue-500'
          }`}>
            <Search className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`bg-transparent border-none outline-none w-full text-sm ${
                isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-slate-100 placeholder:text-slate-500'
              }`}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchQuery.trim().length > 0 && searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg py-1 z-50 max-h-60 overflow-y-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectSearchResult(item.id)}
                  className={`px-3 py-1.5 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium text-xs">{item.name}</span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>v{item.version}</span>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      item.structuralRisk === 'critical'
                        ? isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/40 text-red-400 border border-red-800/50'
                        : item.structuralRisk === 'high'
                        ? isLight ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                        : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.structuralRisk}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification / Security Telemetry Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsAlertsOpen(prev => !prev);
              setIsUserMenuOpen(false);
            }}
            className={`relative p-1.5 rounded-md border transition-all ${
              isAlertsOpen
                ? isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-800 border-slate-700 text-slate-100'
                : isLight
                ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Security Telemetry & Active Alerts"
            aria-label="Open Security Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout Dropdown */}
          {isAlertsOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsAlertsOpen(false)} 
              />
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                isLight 
                  ? 'bg-white border-slate-200 shadow-slate-900/10' 
                  : 'bg-slate-900/95 border-slate-800 shadow-black/50'
              }`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-3.5 py-2.5 border-b ${
                  isLight ? 'border-slate-100 bg-white' : 'border-slate-800 bg-slate-950/40'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold">Security alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold border border-red-500/20">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 border-b text-[11px] ${
                  isLight ? 'border-slate-100 bg-white' : 'border-slate-800/80 bg-slate-900/50'
                }`}>
                  <button
                    onClick={() => setAlertFilter('all')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      alertFilter === 'all'
                        ? isLight ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 text-slate-100'
                        : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({alerts.length})
                  </button>
                  <button
                    onClick={() => setAlertFilter('unread')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      alertFilter === 'unread'
                        ? isLight ? 'bg-slate-200 text-slate-900' : 'bg-slate-800 text-slate-100'
                        : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setAlertFilter('critical')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      alertFilter === 'critical'
                        ? 'bg-red-500/20 text-red-500 font-semibold'
                        : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Critical ({alerts.filter(a => a.severity === 'CRITICAL').length})
                  </button>
                </div>

                {/* Alerts List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredAlerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      <Check className="w-6 h-6 mx-auto mb-2 text-emerald-500 opacity-80" />
                      No alerts matching this filter.
                    </div>
                  ) : (
                    filteredAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-3 transition-colors ${
                          alert.isRead
                            ? isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                            : isLight ? 'bg-cyan-50/40 hover:bg-cyan-50/70' : 'bg-cyan-950/15 hover:bg-cyan-950/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            {!alert.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                            )}
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                              alert.severity === 'CRITICAL'
                                ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                                : alert.severity === 'HIGH'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                                : alert.severity === 'MEDIUM'
                                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                            }`}>
                              {alert.severity}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs font-semibold mb-0.5 leading-snug">
                          {alert.title}
                        </div>
                        <p className={`text-[11px] leading-relaxed mb-2 ${
                          isLight ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {alert.description}
                        </p>

                        <button
                          onClick={() => handleInspectAlert(alert.nodeId, alert.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          Inspect in Topology
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer status */}
                <div className={`px-3 py-1.5 border-t text-[10px] flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-500" />
                    Monitoring active
                  </span>
                  <span>42 Repos Monitored</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-md border transition-all ${
            isLight
              ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle color theme"
        >
          {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Profile / Organization Scope */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(prev => !prev);
              setIsAlertsOpen(false);
            }}
            className={`flex items-center gap-1.5 p-1 rounded-md border transition-all ${
              isUserMenuOpen
                ? isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800 border-slate-700'
                : isLight ? 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
            }`}
            title="User Account & Organization Scope"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {userProfile?.avatarInitials || 'AC'}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          </button>

          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsUserMenuOpen(false)} 
              />
              <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-2xl z-50 p-3.5 flex flex-col gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                isLight 
                  ? 'bg-white border-slate-200 shadow-slate-900/10' 
                  : 'bg-slate-900/95 border-slate-800 shadow-black/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                    {userProfile?.avatarInitials || 'AC'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">{userProfile?.email || 'sec-ops@acme-corp.com'}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile?.organization || 'Acme Global Infrastructure'}</span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg text-xs flex flex-col gap-1.5 border ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">License Tier</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{userProfile?.licenseTier || 'Enterprise Active'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Monitored Scope</span>
                    <span className="font-mono text-xs">{userProfile?.scopeCount || 42} Repos • 1,489 Keystones</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">PURL Enforcer</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Protected</span>
                  </div>
                </div>

                {/* Role Perspective Switcher */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Perspective Lens</span>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                    {[
                      { id: 'developer', label: 'AppSec' },
                      { id: 'ciso', label: 'Executive' },
                      { id: 'maintainer', label: 'Engineer' },
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onChangeLens(item.id as RoleLens)}
                        className={`py-1 px-1 text-[11px] font-medium rounded-md transition-all text-center ${
                          activeLens === item.id
                            ? 'bg-[#2f2fe4] text-white shadow-xs'
                            : isLight
                              ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onNavigateProfile) {
                        onNavigateProfile();
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                      isLight 
                        ? 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                        : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Profile & Security</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onSignOut) {
                        onSignOut();
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                      isLight 
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
