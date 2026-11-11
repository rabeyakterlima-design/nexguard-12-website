import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Smartphone,
  Cpu,
  Radar,
  Activity,
  AlertTriangle,
  Fingerprint,
  Globe,
  Wifi,
  Lock,
  Cloud,
  Bell,
  FileText,
  CreditCard,
  DollarSign,
  Key,
  Code2,
  Boxes,
  ScrollText,
  HeartPulse,
  Database,
  Archive,
  Settings,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, isOwner } = useAuth();
  const role = currentUser?.role;

  // Complete list of Owner sections with Emergency Center & Anti-Theft
  const ownerNavItems = [
    { id: 'anti-theft', label: '🚨 Anti-Theft Control Center', icon: ShieldAlert },
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'users', label: '2. User Management', icon: Users },
    { id: 'admins', label: '3. Admin Management', icon: ShieldCheck },
    { id: 'devices', label: '4. Anti-Theft & Devices', icon: Smartphone },
    { id: 'modules', label: '5. Security Modules (12)', icon: Cpu },
    { id: 'threat-intel', label: '6. Threat Intelligence', icon: Radar },
    { id: 'soc', label: '7. Cyber SOC', icon: Activity },
    { id: 'incidents', label: '8. Incident Management', icon: AlertTriangle },
    { id: 'forensics', label: '9. Digital Forensics', icon: Fingerprint },
    { id: 'webshield', label: '10. Website Security', icon: Globe },
    { id: 'network', label: '11. Network Security', icon: Wifi },
    { id: 'vault', label: '12. Vault Management', icon: Lock },
    { id: 'cloud-backup', label: '13. Cloud Backup', icon: Cloud },
    { id: 'notifications', label: '14. Notifications', icon: Bell },
    { id: 'reports', label: '15. Reports & Analytics', icon: FileText },
    { id: 'subscriptions', label: '16. Subscriptions', icon: CreditCard },
    { id: 'payments', label: '17. Payment Gateways', icon: DollarSign },
    { id: 'licenses', label: '18. License Keys', icon: Key },
    { id: 'apis', label: '19. API Management', icon: Code2 },
    { id: 'integrations', label: '20. Integrations', icon: Boxes },
    { id: 'audit-logs', label: '21. Audit Logs', icon: ScrollText },
    { id: 'system-health', label: '22. System Health', icon: HeartPulse },
    { id: 'database', label: '23. Database Management', icon: Database },
    { id: 'backup-management', label: '24. Backup Policies', icon: Archive },
    { id: 'settings', label: '25. General Settings', icon: Settings },
    { id: 'owner-profile', label: '26. Owner Master Profile', icon: UserCheck },
  ];

  // User items
  const userNavItems = [
    { id: 'user-home', label: 'User Home Dashboard', icon: LayoutDashboard },
    { id: 'modules', label: '12 Security Modules', icon: Cpu },
    { id: 'devices', label: 'Registered Devices', icon: Smartphone },
    { id: 'vault', label: 'Vault Guardian', icon: Lock },
    { id: 'cloud-backup', label: 'Cloud Backup', icon: Cloud },
    { id: 'subscriptions', label: 'My Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Security Alerts', icon: Bell },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const navItems = role === ROLES.USER ? userNavItems : ownerNavItems;

  return (
    <aside className="w-68 h-[calc(100vh-4.5rem)] sticky top-18 bg-nexcard/90 border-r border-nexblue/20 flex flex-col justify-between overflow-y-auto">
      <div className="p-3">
        <div className="px-3 py-2 text-[10px] font-mono tracking-wider text-nexcyan uppercase font-bold flex items-center justify-between">
          <span>{role === ROLES.USER ? 'USER DASHBOARD' : 'MASTER CONTROL'}</span>
          {isOwner && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] border border-amber-400/30">
              OWNER
            </span>
          )}
        </div>

        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-nexblue/30 to-nexpurple/20 text-nexcyan border border-nexcyan/40 font-bold shadow-glow-cyan/20'
                    : 'text-nextext/70 hover:bg-nexblue/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-nexcyan' : 'text-nexmuted'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-nexblue/20 bg-nexbg/50">
        <div className="px-3 py-2 rounded-lg bg-nexcard border border-nexblue/20">
          <p className="text-[10px] font-mono text-nexmuted uppercase tracking-wider">Engine Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-nexgreen animate-ping"></span>
            <span className="text-xs font-mono font-bold text-white">v1.0.0 Online</span>
          </div>
          <p className="text-[9px] font-mono text-nexmuted mt-1">Central Backend: Connected</p>
        </div>
      </div>
    </aside>
  );
}
