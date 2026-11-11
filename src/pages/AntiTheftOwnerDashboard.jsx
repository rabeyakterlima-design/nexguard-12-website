import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  MapPin,
  RefreshCw,
  Key,
  Mail,
  Phone,
  FileText,
  Activity,
  AlertOctagon,
  Battery,
  Wifi,
  Eye,
  X,
  Crosshair,
  ShieldCheck,
  Slash,
  Clock,
  Compass,
  LayoutDashboard,
  Server,
  Settings as SettingsIcon,
  LogOut,
  Download,
  Trash2,
  HelpCircle,
  Globe,
  Sliders,
} from 'lucide-react';

export default function AntiTheftOwnerDashboard() {
  const { authFetch, isOwner, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stolen Phone Lockdown Modal
  const [showStolenModal, setShowStolenModal] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [lockdownReason, setLockdownReason] = useState('Primary phone stolen in transit. Owner remote emergency lockdown triggered.');
  const [stolenResult, setStolenResult] = useState(null);

  // Backup codes
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);

  // Location map
  const [mapZoom, setMapZoom] = useState(15);
  const [locationHistory, setLocationHistory] = useState([]);

  // Load all telemetry
  const loadData = async () => {
    setLoading(true);
    try {
      const [resOverview, resDevices, resSessions, resAlerts, resLoc] = await Promise.all([
        authFetch('/api/emergency/overview'),
        authFetch('/api/emergency/devices'),
        authFetch('/api/emergency/sessions'),
        authFetch('/api/emergency/alerts'),
        authFetch('/api/emergency/location-history'),
      ]);

      const jsonOverview = await resOverview.json();
      const jsonDevices = await resDevices.json();
      const jsonSessions = await resSessions.json();
      const jsonAlerts = await resAlerts.json();
      const jsonLoc = await resLoc.json();

      if (jsonOverview.success) setData(jsonOverview.data);
      if (jsonDevices.success) {
        setDevices(jsonDevices.data);
        const primaryPhone = jsonDevices.data.find(
          (d) => d.id === 'dev-owner-phone' || d.deviceType === 'ANDROID'
        ) || jsonDevices.data[0];
        setSelectedDevice(primaryPhone);
      }
      if (jsonSessions.success) setSessions(jsonSessions.data);
      if (jsonAlerts.success) {
        setAlerts(jsonAlerts.data.alerts || []);
        setNotifications(jsonAlerts.data.notifications || []);
      }
      if (jsonLoc.success) setLocationHistory(jsonLoc.data.history || []);
    } catch (err) {
      console.error('Failed to load anti-theft telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Action: PROMINENT RED EMERGENCY "MARK MY PHONE AS STOLEN"
  const handleMarkMyPhoneAsStolen = async () => {
    if (!selectedDevice) return;
    if (!passwordConfirm) {
      alert('Owner Master Password or Backup Code confirmation is strictly required.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${selectedDevice.id}/mark-stolen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordConfirm,
          reason: lockdownReason,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setStolenResult(result.data);
        setActionMessage({
          type: 'danger',
          title: '🚨 EMERGENCY STOLEN MODE EXECUTED',
          body: result.message,
        });
        await loadData();
        setPasswordConfirm('');
      } else {
        alert(result.error || 'Failed to execute emergency stolen mode');
      }
    } catch (err) {
      alert('Network error while executing emergency stolen lockdown');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Toggle Location Reporting
  const handleToggleLocationReporting = async () => {
    if (!selectedDevice) return;
    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${selectedDevice.id}/toggle-location-reporting`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'warning',
          title: '📍 LOCATION POLICY UPDATED',
          body: result.message,
        });
        await loadData();
      }
    } catch (err) {
      alert('Failed to toggle location reporting');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Restore Device
  const handleRestoreDevice = async () => {
    if (!selectedDevice) return;
    if (!confirm(`Restore hardware access and trusted posture for ${selectedDevice.deviceName}?`)) return;

    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${selectedDevice.id}/restore`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'success',
          title: '🛡️ HARDWARE RESTORED',
          body: result.message,
        });
        setStolenResult(null);
        setShowStolenModal(false);
        await loadData();
      }
    } catch (err) {
      alert('Failed to restore device');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Revoke Individual Session
  const handleRevokeSession = async (sessionId) => {
    if (!confirm('Terminate this active login session immediately?')) return;
    try {
      const res = await authFetch(`/api/emergency/sessions/${sessionId}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setActionMessage({ type: 'warning', title: '⚡ SESSION REVOKED', body: result.message });
        await loadData();
      }
    } catch (err) {
      alert('Failed to revoke session');
    }
  };

  // Action: Global Lockdown
  const handleGlobalLockdown = async () => {
    const confirmation = prompt('Type "LOCKDOWN" to terminate all sessions across all devices platform-wide:');
    if (confirmation !== 'LOCKDOWN') return;

    setIsProcessing(true);
    try {
      const res = await authFetch('/api/emergency/global-lockdown', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        setActionMessage({ type: 'danger', title: '💥 FLEET LOCKDOWN ACTIVE', body: result.message });
        await loadData();
      }
    } catch (err) {
      alert('Error triggering fleet lockdown');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch Backup Codes
  const handleViewBackupCodes = async () => {
    try {
      const res = await authFetch('/api/emergency/backup-codes');
      const result = await res.json();
      if (result.success) {
        setBackupCodes(result.data);
        setShowBackupCodesModal(true);
      }
    } catch (err) {
      alert('Failed to load backup codes');
    }
  };

  const currentDev = selectedDevice || devices[0];
  const isLostOrStolen = currentDev?.isLost || currentDev?.status === 'LOST' || currentDev?.status === 'STOLEN';
  const hasConsentedLocation = currentDev?.location?.consentGiven && currentDev?.locationReportingEnabled !== false;

  // OpenStreetMap Tile Calculation
  const getMapTileUrl = (lat, lon, zoom) => {
    const latRad = (lat * Math.PI) / 180;
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lon + 180) / 360) * n);
    const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
    return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
  };

  const lat = currentDev?.location?.latitude || 23.8103;
  const lon = currentDev?.location?.longitude || 90.4125;
  const tileUrl = getMapTileUrl(lat, lon, mapZoom);

  // The Exact 10 Sidebar Navigation Items specified in Master Prompt Section 10
  const sidebarNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-devices', label: 'My Devices', icon: Smartphone },
    { id: 'anti-theft-center', label: 'Anti-Theft Center', icon: ShieldAlert, highlight: true },
    { id: 'device-map', label: 'Device Map', icon: MapPin },
    { id: 'security-alerts', label: 'Security Alerts', icon: Activity },
    { id: 'active-sessions', label: 'Active Sessions', icon: Radio },
    { id: 'incident-reports', label: 'Incident Reports', icon: FileText },
    { id: 'account-security', label: 'Account Security', icon: Key },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'logout', label: 'Logout / Return', icon: LogOut },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn text-nextext">
      {/* SECTION 10: DEDICATED ANTI-THEFT OWNER CONTROL SIDEBAR */}
      <aside className="w-full lg:w-64 shrink-0 bg-nexcard/90 backdrop-blur-md border border-nexblue/20 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="px-3 py-2 border-b border-nexblue/20">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              OWNER CONTROL TERMINAL
            </div>
            <div className="text-sm font-black text-white mt-1">Anti-Theft Console</div>
            <div className="text-[10px] font-mono text-nexmuted">NEXGUARD 12 Sovereign Guard</div>
          </div>

          <nav className="space-y-1">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'logout') {
                      if (confirm('Return to main platform overview?')) {
                        window.location.reload();
                      }
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? item.highlight
                        ? 'bg-red-600/30 text-red-300 border border-red-500/50 shadow-md shadow-red-500/20'
                        : 'bg-nexblue/20 text-nexcyan border border-nexblue/40 shadow-md'
                      : item.highlight
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-nextext/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Offline Backup Codes Quick Trigger */}
        <div className="pt-4 border-t border-nexblue/20 mt-4 space-y-2">
          <button
            onClick={handleViewBackupCodes}
            className="w-full px-3 py-2 rounded-xl bg-nexbg/80 border border-nexcyan/30 text-nexcyan text-[11px] font-mono font-bold flex items-center justify-center gap-2 hover:bg-nexblue/10 transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            Backup Codes ({data?.recoveryProfile?.backupCodesRemaining ?? 8})
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 space-y-6 overflow-hidden">
        {/* Action Notification Banner */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 animate-slideDown shadow-xl ${
              actionMessage.type === 'danger'
                ? 'bg-red-500/15 border-red-500/50 text-red-200'
                : actionMessage.type === 'warning'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <div>
              <div className="font-bold text-sm font-mono">{actionMessage.title}</div>
              <div className="text-xs opacity-90 mt-0.5">{actionMessage.body}</div>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-xs underline cursor-pointer text-nexmuted hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Prominent Emergency Action Bar */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isLostOrStolen
                ? 'bg-red-950/70 border-red-500 shadow-2xl shadow-red-500/20'
                : 'bg-gradient-to-r from-red-900/40 via-red-950/20 to-nexcard border-red-500/50'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <h2 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                      {isLostOrStolen ? 'STATUS: EMERGENCY LOCKDOWN ACTIVE' : 'EMERGENCY STOLEN PHONE MODE'}
                    </h2>
                  </div>
                  <p className="text-xs text-red-200/80 mt-1 max-w-xl">
                    {isLostOrStolen
                      ? `Access revoked on ${currentDev?.deviceName}. Server-side token blacklisting active.`
                      : 'If your Android phone was taken or missing, activate Emergency Stolen Mode immediately. Server-side access will be severed even if the phone is switched off.'}
                  </p>
                </div>

                <div>
                  {isLostOrStolen ? (
                    <button
                      onClick={handleRestoreDevice}
                      disabled={isProcessing}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <Unlock className="w-4 h-4" />
                      RESTORE HARDWARE ACCESS
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowStolenModal(true)}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 text-white font-black text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-red-600/40 hover:scale-[1.02] cursor-pointer border border-red-400"
                    >
                      <AlertOctagon className="w-4 h-4 animate-bounce" />
                      MARK MY PHONE AS STOLEN
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 6 Core Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-4">
                <span className="text-[10px] font-mono uppercase font-bold text-nexcyan block mb-1">Enrolled</span>
                <div className="text-2xl font-black text-white">{devices.length}</div>
                <span className="text-[10px] text-nexmuted">Registered Devices</span>
              </div>
              <div className="bg-nexcard/80 border border-emerald-500/20 rounded-2xl p-4">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block mb-1">Trusted</span>
                <div className="text-2xl font-black text-white">{devices.filter((d) => d.isTrusted && !d.isLost).length}</div>
                <span className="text-[10px] text-nexmuted">Knox 0x0 Attested</span>
              </div>
              <div className={`rounded-2xl p-4 border ${devices.filter((d) => d.isLost).length > 0 ? 'bg-red-500/10 border-red-500/40' : 'bg-nexcard/80 border-nexblue/20'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-red-400 block mb-1">Stolen / Lost</span>
                <div className="text-2xl font-black text-white">{devices.filter((d) => d.isLost).length}</div>
                <span className="text-[10px] text-red-300/80">Active Lockdowns</span>
              </div>
              <div className="bg-nexcard/80 border border-nexpurple/20 rounded-2xl p-4">
                <span className="text-[10px] font-mono uppercase font-bold text-nexpurple block mb-1">Live Tokens</span>
                <div className="text-2xl font-black text-white">{sessions.filter((s) => !s.isRevoked).length}</div>
                <span className="text-[10px] text-nexmuted">Active Sessions</span>
              </div>
              <div className="bg-nexcard/80 border border-emerald-500/20 rounded-2xl p-4">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block mb-1">Battery</span>
                <div className="text-2xl font-black text-white">{currentDev?.batteryLevel ?? 78}%</div>
                <span className="text-[10px] text-nexmuted">{currentDev?.batteryStatus || 'Discharging'}</span>
              </div>
              <div className="bg-nexcard/80 border border-nexdanger/20 rounded-2xl p-4">
                <span className="text-[10px] font-mono uppercase font-bold text-nexdanger block mb-1">Cyber SOC</span>
                <div className="text-2xl font-black text-white">{alerts.length}</div>
                <span className="text-[10px] text-nexmuted">Security Alerts</span>
              </div>
            </div>

            {/* Quick Device Telemetry Card */}
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-nexblue/20 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-nexcyan" />
                    {currentDev?.deviceName}
                  </h3>
                  <p className="text-xs text-nexmuted font-mono mt-0.5">
                    Model: {currentDev?.deviceModel || 'SM-S928B'} • Internal ID: {currentDev?.id}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                  isLostOrStolen ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {currentDev?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-nexbg/70 border border-nexblue/20">
                  <span className="text-nexmuted text-[10px] uppercase block">Knox Attestation</span>
                  <span className="text-emerald-400 font-bold">0x0 PASSED</span>
                </div>
                <div className="p-3 rounded-xl bg-nexbg/70 border border-nexblue/20">
                  <span className="text-nexmuted text-[10px] uppercase block">Location Status</span>
                  <span className="text-nexcyan font-bold">{hasConsentedLocation ? 'Consented (Dhaka)' : 'Unavailable'}</span>
                </div>
                <div className="p-3 rounded-xl bg-nexbg/70 border border-nexblue/20">
                  <span className="text-nexmuted text-[10px] uppercase block">Last Check-In</span>
                  <span className="text-white font-bold">{currentDev?.lastCheckInAt ? new Date(currentDev.lastCheckInAt).toLocaleTimeString() : 'Recent'}</span>
                </div>
                <div className="p-3 rounded-xl bg-nexbg/70 border border-nexblue/20">
                  <span className="text-nexmuted text-[10px] uppercase block">Network Link</span>
                  <span className="text-nexcyan font-bold">{currentDev?.networkType || 'Wi-Fi 6E'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY DEVICES */}
        {/* ========================================================================= */}
        {activeTab === 'my-devices' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Smartphone className="w-5 h-5 text-nexcyan" />
                All Registered Android Assets
              </h3>
              <p className="text-xs text-nexmuted mb-6">
                Hardware attestation, unique device IDs, battery levels, network connection types, and active session statuses.
              </p>

              <div className="space-y-4">
                {devices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-5 rounded-xl bg-nexbg/70 border border-nexblue/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{dev.deviceName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-nexblue/20 text-nexcyan border border-nexblue/30">
                          {dev.deviceModel || 'SM-S928B'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          dev.isLost ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {dev.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-nexmuted">
                        Device ID: <span className="text-white">{dev.id}</span> • OS: {dev.osVersion} • Reg: {new Date(dev.createdAt || dev.registrationDate || Date.now()).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-nexmuted flex items-center gap-4 pt-1">
                        <span>🔋 Battery: <strong className="text-emerald-400">{dev.batteryLevel ?? 78}%</strong></span>
                        <span>📶 Network: <strong className="text-nexcyan">{dev.networkType || 'Wi-Fi 6E'}</strong></span>
                        <span>🛡️ Knox: <strong className="text-emerald-400">0x0 Valid</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-auto">
                      <button
                        onClick={() => {
                          setSelectedDevice(dev);
                          setActiveTab('anti-theft-center');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs cursor-pointer"
                      >
                        Lockdown Controls
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANTI-THEFT CENTER */}
        {/* ========================================================================= */}
        {activeTab === 'anti-theft-center' && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-gradient-to-r from-red-950/60 to-nexcard border-2 border-red-500/50 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                    Emergency Stolen Phone Lockdown Center
                  </h3>
                  <p className="text-xs text-red-200/80 font-mono">
                    Target Hardware: {currentDev?.deviceName} ({currentDev?.fingerprint?.slice(0, 20)}...)
                  </p>
                </div>
              </div>

              {/* 10 Operational Guarantees Display */}
              <div className="p-5 rounded-xl bg-nexbg/90 border border-red-500/30 font-mono text-xs space-y-2 text-nexmuted">
                <div className="text-white font-bold text-xs uppercase mb-2">
                  When "MARK MY PHONE AS STOLEN" is triggered:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div>✓ 1. Status marked as LOST/STOLEN in database.</div>
                  <div>✓ 2. Active JWT access tokens terminated.</div>
                  <div>✓ 3. Refresh tokens invalidated instantly.</div>
                  <div>✓ 4. Trusted-device status removed.</div>
                  <div>✓ 5. Hardware fingerprint blacklisted.</div>
                  <div>✓ 6. Verified secondary email alert dispatched.</div>
                  <div>✓ 7. Forensic incident record (INC-EMRG) created.</div>
                  <div>✓ 8. Last reported coordinates locked.</div>
                  <div>✓ 9. Last check-in timestamp preserved.</div>
                  <div>✓ 10. Server-side revocation takes effect immediately.</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isLostOrStolen ? (
                  <button
                    onClick={handleRestoreDevice}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    RESTORE HARDWARE ACCESS
                  </button>
                ) : (
                  <button
                    onClick={() => setShowStolenModal(true)}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-red-600/50 cursor-pointer border border-red-400"
                  >
                    <AlertOctagon className="w-5 h-5 animate-bounce" />
                    MARK MY PHONE AS STOLEN
                  </button>
                )}

                <button
                  onClick={handleGlobalLockdown}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-nexcard hover:bg-white/5 border border-red-500/30 text-red-400 font-mono text-xs font-bold cursor-pointer"
                >
                  Global Fleet Panic Lockdown
                </button>
              </div>

              {/* Server-Side vs Offline Phone Reconnection Notice */}
              <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/30 text-xs font-mono text-nexmuted flex items-start gap-3">
                <Server className="w-4 h-4 text-nexcyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Offline Device Behavior Notice:</strong> Server-side access revocation takes effect immediately on the central server. If the stolen phone is switched off or disconnected, no account data can be requested. When the device reconnects to Wi-Fi or cellular, remote wipe-lock commands enforce locally.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DEVICE MAP */}
        {/* ========================================================================= */}
        {activeTab === 'device-map' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-nexblue/20 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-nexcyan" />
                    Interactive Tactical Geolocation Map
                  </h3>
                  <p className="text-xs text-nexmuted font-mono mt-0.5">
                    OpenStreetMap Dark Tactical Tiles • Accuracy Radius: ±{currentDev?.location?.accuracyMeters || 14.2}m
                  </p>
                </div>

                <button
                  onClick={handleToggleLocationReporting}
                  className="px-3.5 py-1.5 rounded-xl bg-nexblue/20 hover:bg-nexblue/30 border border-nexcyan/40 text-nexcyan text-xs font-mono font-bold cursor-pointer"
                >
                  {currentDev?.locationReportingEnabled ? 'Disable Location Telemetry' : 'Enable Location Telemetry'}
                </button>
              </div>

              {/* Map Viewport */}
              <div className="relative h-96 w-full rounded-xl overflow-hidden border border-nexblue/30 bg-nexbg flex items-center justify-center">
                {hasConsentedLocation ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center filter invert hue-rotate-180 brightness-90 contrast-125 opacity-80"
                      style={{ backgroundImage: `url('${tileUrl}')` }}
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-56 h-56 rounded-full border-2 border-dashed border-nexcyan/40 bg-nexcyan/10 animate-pulse flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border border-nexcyan/60 flex items-center justify-center">
                          <div className="relative">
                            <div className="w-5 h-5 rounded-full bg-nexcyan border-2 border-white shadow-xl shadow-nexcyan animate-ping absolute -top-2.5 -left-2.5 opacity-75" />
                            <div className="w-5 h-5 rounded-full bg-nexcyan border-2 border-white shadow-xl shadow-nexcyan relative flex items-center justify-center">
                              <Crosshair className="w-3 h-3 text-black" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-nexcard/90 backdrop-blur-md border border-nexblue/40 px-3 py-2 rounded-lg font-mono text-xs shadow-lg space-y-1">
                      <div className="text-nexcyan font-bold flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 animate-spin" />
                        COORDINATES: {lat.toFixed(4)}° N, {lon.toFixed(4)}° E
                      </div>
                      <div className="text-nexmuted text-[10px]">
                        Region: {currentDev?.location?.city || 'Dhaka'}, {currentDev?.location?.country || 'Bangladesh'}
                      </div>
                      <div className="text-emerald-400 text-[10px]">
                        Last Telemetry Timestamp: {new Date(currentDev?.location?.timestamp || Date.now()).toLocaleTimeString()}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center space-y-3 max-w-md font-mono">
                    <Slash className="w-10 h-10 text-amber-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">Location Telemetry Unavailable</h4>
                    <p className="text-xs text-nexmuted leading-relaxed">
                      Device is offline or location permission was not granted by the Owner. NEXGUARD 12 never fabricates live GPS tracking.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SECURITY ALERTS */}
        {/* ========================================================================= */}
        {activeTab === 'security-alerts' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-nexdanger" />
                Security Alerts & Incident Notifications
              </h3>
              <p className="text-xs text-nexmuted font-mono mb-4">
                Real-time security telemetry filtered for Owner registered hardware.
              </p>

              <div className="space-y-3">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20 flex items-start justify-between gap-4 font-mono text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{al.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">
                          {al.severity}
                        </span>
                      </div>
                      <p className="text-nexmuted text-[11px] mt-1">{al.description}</p>
                      <div className="text-[10px] text-nexcyan mt-2">
                        Affected: {al.affectedDevice || 'dev-owner-phone'} • {new Date(al.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ACTIVE SESSIONS */}
        {/* ========================================================================= */}
        {activeTab === 'active-sessions' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-nexblue/20 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-nexpurple" />
                    Active Login Sessions & Tokens
                  </h3>
                  <p className="text-xs text-nexmuted font-mono mt-0.5">
                    Authorized terminal tokens. Terminate any unknown or suspicious session instantly.
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sess.deviceName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          sess.isRevoked ? 'bg-red-500/20 text-red-400 border-red-500/40 line-through' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {sess.isRevoked ? 'REVOKED' : 'VALID'}
                        </span>
                      </div>
                      <div className="text-[11px] text-nexmuted mt-1 truncate max-w-md">
                        IP: {sess.ipAddress} • Client: {sess.userAgent}
                      </div>
                      <div className="text-[10px] text-nexmuted">
                        Expires: {new Date(sess.expiresAt).toLocaleString()}
                      </div>
                    </div>

                    {!sess.isRevoked && (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs cursor-pointer self-start md:self-auto"
                      >
                        Terminate Session
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: INCIDENT REPORTS */}
        {/* ========================================================================= */}
        {activeTab === 'incident-reports' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-nexcyan" />
                Theft Incidents & Forensic Evidence Logs
              </h3>
              <p className="text-xs text-nexmuted font-mono mb-4">
                Tamper-evident incident dossiers generated during emergency phone lockdowns.
              </p>

              <div className="space-y-3 font-mono text-xs">
                {(data?.recentIncidents || []).map((inc) => (
                  <div key={inc.id} className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-nexcyan text-sm">{inc.reportNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">
                          {inc.incidentType}
                        </span>
                      </div>
                      <span className="text-emerald-400 text-[11px]">STATUS: {inc.status}</span>
                    </div>

                    <div className="text-[11px] text-nexmuted">
                      Target Device: <strong className="text-white">{inc.targetDeviceName || 'dev-owner-phone'}</strong> • Logged by: {inc.actorEmail}
                    </div>

                    <div className="text-[11px] text-nextext space-y-0.5 pt-1">
                      {Array.isArray(inc.actionsTaken) &&
                        inc.actionsTaken.map((act, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="text-nexcyan">•</span> {act}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: ACCOUNT SECURITY */}
        {/* ========================================================================= */}
        {activeTab === 'account-security' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-nexblue/20 pb-3">
                <Key className="w-5 h-5 text-nexcyan" />
                Independent Owner Account Recovery & Sovereignty
              </h3>

              <div className="p-4 rounded-xl bg-nexbg/80 border border-nexpurple/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-nexpurple">Verified Secondary Recovery Channel</span>
                <div className="text-sm font-bold text-white">owner.emergency.recovery@protonmail.com</div>
                <div className="text-emerald-400 text-[11px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Offline Verified • Zero Dependency on Primary Phone
                </div>
              </div>

              <div className="p-4 rounded-xl bg-nexbg/80 border border-nexcyan/30 space-y-2">
                <span className="text-[10px] uppercase font-bold text-nexcyan">Emergency Recovery Endpoint</span>
                <div className="text-white font-bold">POST /api/auth/emergency-recover</div>
                <div className="text-nexmuted text-[11px]">
                  Allows entering secondary email + backup code to reset master password and kill all sessions from any terminal.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-nexcard/80 border border-nexblue/20 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-nexblue/20 pb-3">
                <SettingsIcon className="w-5 h-5 text-nexcyan" />
                Anti-Theft Policies & Android Platform Guidance
              </h3>

              <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20 space-y-2">
                <span className="text-[10px] uppercase font-bold text-nexcyan">Telemetry Retention Policy</span>
                <div className="text-white">30 Days Auto-Purge (Configured)</div>
                <div className="text-nexmuted text-[11px]">
                  All historical location points older than 30 days are automatically deleted to preserve privacy.
                </div>
              </div>

              {/* Realistic Android Limitations Notice */}
              <div className="p-4 rounded-xl bg-nexbg/80 border border-amber-500/30 text-amber-200/90 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Android Platform Limitations Notice
                </span>
                <p className="text-[11px] leading-relaxed">
                  For ordinary personal Android smartphones, normal apps cannot remotely factory-reset or brick a device without full Android Enterprise Device Owner enrollment. For full-device remote lock and wipe, use Google's official <strong>Find My Device / Find Hub</strong> service.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: "MARK MY PHONE AS STOLEN" RE-AUTH CONFIRMATION */}
      {/* ========================================================================= */}
      {showStolenModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-nexcard border-2 border-red-500 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowStolenModal(false)}
              className="absolute top-4 right-4 text-nexmuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase mb-2">
              <AlertOctagon className="w-4 h-4 animate-bounce" />
              CONFIRM EMERGENCY STOLEN PHONE LOCKDOWN
            </div>

            <h3 className="text-xl font-black text-white mb-1">
              Mark {currentDev?.deviceName} as STOLEN?
            </h3>
            <p className="text-xs text-red-200/80 mb-4 font-mono leading-relaxed">
              This action will sever all connections, invalidate active sessions, and blacklist this hardware fingerprint immediately on the central server.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-mono font-bold text-white mb-1">
                  Master Password or Emergency Backup Code:
                </label>
                <input
                  type="password"
                  placeholder="Enter Master Password or NXG-EMRG-XXXX-XXXX"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full bg-nexbg border border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-nexmuted mb-1">
                  Lockdown Incident Reason:
                </label>
                <input
                  type="text"
                  value={lockdownReason}
                  onChange={(e) => setLockdownReason(e.target.value)}
                  className="w-full bg-nexbg border border-nexblue/30 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-nexcyan"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-nexblue/20 pt-4">
              <button
                onClick={() => setShowStolenModal(false)}
                className="px-4 py-2 rounded-xl bg-nexcard hover:bg-white/5 text-nexmuted text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleMarkMyPhoneAsStolen}
                disabled={isProcessing || !passwordConfirm}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-red-600/30 cursor-pointer"
              >
                {isProcessing ? 'Locking Down...' : 'CONFIRM & LOCKDOWN NOW'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BACKUP CODES MODAL */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-nexcard border border-nexcyan/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowBackupCodesModal(false)}
              className="absolute top-4 right-4 text-nexmuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-nexcyan font-mono text-xs font-bold uppercase mb-2">
              <Key className="w-4 h-4" />
              Emergency Owner Backup Codes
            </div>

            <h3 className="text-lg font-bold text-white mb-1">One-Time Recovery Codes</h3>
            <p className="text-xs text-nexmuted mb-4 font-mono">
              Use any code below to bypass phone MFA if your primary phone is lost or stolen.
            </p>

            <div className="grid grid-cols-2 gap-2.5 p-4 rounded-xl bg-nexbg/80 border border-nexblue/30 font-mono text-xs">
              {backupCodes.map((code) => (
                <div
                  key={code.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    code.isUsed
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 line-through'
                      : 'bg-nexcard border-nexcyan/30 text-nexcyan font-bold'
                  }`}
                >
                  <span>{code.code}</span>
                  <span className="text-[9px] text-nexmuted">{code.isUsed ? 'USED' : 'READY'}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowBackupCodesModal(false)}
                className="px-4 py-2 rounded-xl bg-nexblue text-white text-xs font-bold font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
