import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { Shield, Bell, ChevronDown, CheckCircle, ShieldAlert, User, LogOut } from 'lucide-react';

export default function Header({ onOpenAntiTheft }) {
  const { currentUser, switchPersona, isOwner } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const personas = [
    { role: ROLES.OWNER, label: '👑 Original Owner (Master Control)', color: 'text-amber-400' },
    { role: ROLES.SUPER_ADMIN, label: '🛡️ Super Admin', color: 'text-nexblue' },
    { role: ROLES.SECURITY_ADMIN, label: '🚨 Security Admin', color: 'text-nexdanger' },
    { role: ROLES.MODULE_ADMIN, label: '⚙️ Module Admin', color: 'text-nexcyan' },
    { role: ROLES.AUDITOR, label: '📋 Auditor (Read-Only)', color: 'text-nexpurple' },
    { role: ROLES.USER, label: '👤 Normal User', color: 'text-nexgreen' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-18 bg-nexcard/85 backdrop-blur-md border-b border-nexblue/20 px-6 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="NEXGUARD 12"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-nexcyan to-nexpurple">
                NEXGUARD 12
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-nexblue/20 text-nexcyan border border-nexcyan/30 rounded-full">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase font-mono text-nexcyan font-semibold">
              Detect • Prevent • Protect
            </p>
          </div>
        </div>

        {/* Global Security Posture Pill */}
        <div className="hidden lg:flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-nexbg/80 border border-nexgreen/30 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-nexgreen animate-pulse"></span>
          <span className="text-nexgreen font-semibold">ALL DEFENSES ACTIVE</span>
          <span className="text-nexmuted">| 12/12 Modules Operational</span>
        </div>
      </div>

      {/* Right Controls: Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Anti-Theft Trigger Button */}
        <button
          onClick={onOpenAntiTheft}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 hover:text-white text-xs font-mono font-bold transition-all shadow-md shadow-red-500/10 cursor-pointer"
          title="Open Dedicated Anti-Theft & Stolen Device Control Center"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">ANTI-THEFT CONSOLE</span>
        </button>

        {/* Role Persona Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexbg hover:bg-nexcardHover border border-nexblue/40 text-xs font-mono transition-all"
            title="Switch Persona to test any of the 6 roles"
          >
            <span className="text-nexmuted">Role:</span>
            <span className="font-bold text-nexcyan uppercase">
              {currentUser?.role === 'OWNER' ? '👑 OWNER' : currentUser?.role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-nexmuted" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl glass-dropdown p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 text-[11px] font-mono uppercase text-nexmuted border-b border-nexblue/20">
                Switch Ecosystem Role
              </div>
              <div className="mt-1 space-y-1">
                {personas.map((p) => (
                  <button
                    key={p.role}
                    onClick={() => {
                      switchPersona(p.role);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser?.role === p.role
                        ? 'bg-nexblue/20 text-white font-bold border border-nexblue/40'
                        : 'text-nextext/80 hover:bg-nexblue/10 hover:text-white'
                    }`}
                  >
                    <span className={p.color}>{p.label}</span>
                    {currentUser?.role === p.role && (
                      <CheckCircle className="w-3.5 h-3.5 text-nexcyan" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg bg-nexbg hover:bg-nexcardHover border border-nexblue/30 text-nextext relative transition-colors"
          >
            <Bell className="w-4 h-4 text-nexcyan" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-nexdanger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl glass-dropdown p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-nexblue/20">
                <span className="text-xs font-bold font-mono text-nexcyan uppercase">Security Notifications</span>
                <span className="text-[10px] text-nexmuted">Real-time</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2 rounded-lg bg-nexbg/80 border border-nexdanger/30 text-xs">
                  <div className="font-semibold text-nexdanger flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Phishing Intercepted
                  </div>
                  <p className="text-[11px] text-nexmuted mt-0.5">
                    Phishing Shield blocked deceptive domain bkash-refund-service.xyz
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-nexbg/80 border border-nexgreen/30 text-xs">
                  <div className="font-semibold text-nexgreen flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Immutable Cloud Backup
                  </div>
                  <p className="text-[11px] text-nexmuted mt-0.5">
                    Encrypted snapshot SHA-256 verified healthy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-nexblue/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nexblue to-nexpurple flex items-center justify-center text-white font-bold text-xs shadow-glow-blue">
            {currentUser?.fullName ? currentUser.fullName[0] : 'O'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              {currentUser?.fullName}
              {isOwner && <span className="text-amber-400 text-xs">★</span>}
            </p>
            <p className="text-[10px] font-mono text-nexmuted">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
