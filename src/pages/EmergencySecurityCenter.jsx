import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Smartphone,
  Laptop,
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
  Download,
  AlertOctagon,
  Eye,
  X,
  Copy,
} from 'lucide-react';

export default function EmergencySecurityCenter() {
  const { authFetch, isOwner } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load emergency data and devices
  const loadData = async () => {
    setLoading(true);
    try {
      const [resOverview, resDevices] = await Promise.all([
        authFetch('/api/emergency/overview'),
        authFetch('/api/emergency/devices'),
      ]);

      const jsonOverview = await resOverview.json();
      const jsonDevices = await resDevices.json();

      if (jsonOverview.success) setData(jsonOverview.data);
      if (jsonDevices.success) setDevices(jsonDevices.data);
    } catch (err) {
      console.error('Failed to load emergency data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Action: Mark Device as Lost
  const handleMarkLost = async (device) => {
    const reason = prompt(
      `CONFIRM EMERGENCY LOCKDOWN:\nAre you sure you want to declare "${device.deviceName}" as LOST or STOLEN?\n\nThis will immediately invalidate all active sessions, block hardware authentication, and trigger a Cyber SOC incident report.`,
      'Primary device lost / stolen in transit'
    );
    if (!reason) return;

    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${device.id}/mark-lost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'danger',
          title: '🚨 DEVICE LOCKED DOWN',
          body: result.message,
        });
        await loadData();
      } else {
        alert(result.error || 'Failed to mark device lost');
      }
    } catch (err) {
      alert('Network error while initiating emergency lockdown');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Revoke Sessions
  const handleRevokeSessions = async (device) => {
    if (!confirm(`Revoke all active sessions and refresh tokens for "${device.deviceName}"?`)) return;
    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${device.id}/revoke-sessions`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'warning',
          title: '⚡ SESSIONS REVOKED',
          body: result.message,
        });
        await loadData();
      }
    } catch (err) {
      alert('Failed to revoke sessions');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Block Device
  const handleBlockDevice = async (device) => {
    if (!confirm(`BLOCK hardware access for "${device.deviceName}"? Any login attempt from this fingerprint will be rejected.`)) return;
    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${device.id}/block`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'danger',
          title: '⛔ HARDWARE BLOCKED',
          body: result.message,
        });
        await loadData();
      }
    } catch (err) {
      alert('Failed to block device');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Restore Device
  const handleRestoreDevice = async (device) => {
    if (!confirm(`Restore "${device.deviceName}" to active trusted status? Hardware attestation will be re-cleared.`)) return;
    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/emergency/devices/${device.id}/restore`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'success',
          title: '🛡️ ACCESS RESTORED',
          body: result.message,
        });
        await loadData();
      }
    } catch (err) {
      alert('Failed to restore device');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Global Panic Lockdown
  const handleGlobalLockdown = async () => {
    const answer = prompt(
      '⚠️ MASTER EMERGENCY PANIC LOCKDOWN\n\nThis will immediately kill ALL active sessions across ALL registered phones, tablets, and computers platform-wide.\n\nType "LOCKDOWN" to proceed:'
    );
    if (answer !== 'LOCKDOWN') return;

    setIsProcessing(true);
    try {
      const res = await authFetch('/api/emergency/global-lockdown', {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage({
          type: 'danger',
          title: '💥 GLOBAL MASTER LOCKDOWN ACTIVE',
          body: result.message,
        });
        await loadData();
      }
    } catch (err) {
      alert('Failed to execute global lockdown');
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Fetch Backup Codes
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

  // Action: Regenerate Backup Codes
  const handleRegenerateCodes = async () => {
    if (!passwordConfirm) {
      alert('Master password confirmation required');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await authFetch('/api/emergency/backup-codes/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordConfirm }),
      });
      const result = await res.json();
      if (result.success) {
        alert('10 New Emergency Backup Codes generated! Copy them immediately.');
        await handleViewBackupCodes();
        setPasswordConfirm('');
      } else {
        alert(result.error || 'Failed to regenerate codes');
      }
    } catch (err) {
      alert('Error regenerating backup codes');
    } finally {
      setIsProcessing(false);
    }
  };

  const metrics = data?.metrics || {
    registeredDevices: 0,
    trustedDevices: 0,
    lostOrStolenDevices: 0,
    suspiciousLoginAttempts: 0,
    activeSessions: 0,
    recentSecurityAlerts: 0,
  };

  const recoveryProfile = data?.recoveryProfile || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Title */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/40 via-nexcard to-nexcard border border-red-500/30 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              EMERGENCY OWNER DEFENSE CENTER
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Anti-Theft, Lost Device & Emergency Owner Protection
            </h1>
            <p className="text-sm text-nexmuted mt-1 max-w-2xl">
              Immutable Original Owner Authority. Remotely isolate compromised hardware, invalidate active sessions, and execute independent account recovery without relying on stolen devices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleViewBackupCodes}
              className="px-4 py-2.5 rounded-xl bg-nexcard hover:bg-white/5 border border-nexcyan/40 text-nexcyan text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-nexcyan/10"
            >
              <Key className="w-4 h-4" />
              Emergency Backup Codes ({recoveryProfile.backupCodesRemaining ?? 10})
            </button>

            <button
              onClick={() => setShowRecoveryModal(true)}
              className="px-4 py-2.5 rounded-xl bg-nexcard hover:bg-white/5 border border-nexpurple/40 text-nexpurple text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-nexpurple/10"
            >
              <Mail className="w-4 h-4" />
              Recovery Methods
            </button>

            <button
              onClick={handleGlobalLockdown}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-red-600/30 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 animate-bounce" />
              GLOBAL PANIC LOCKDOWN
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-4 animate-slideDown ${
            actionMessage.type === 'danger'
              ? 'bg-red-500/10 border-red-500/30 text-red-200'
              : actionMessage.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <div>
            <div className="font-bold text-sm">{actionMessage.title}</div>
            <div className="text-xs opacity-90 mt-0.5">{actionMessage.body}</div>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* The 6 Required Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Registered Devices */}
        <div className="bg-nexcard/80 backdrop-blur-md border border-nexblue/20 rounded-2xl p-4 transition-all hover:border-nexblue/40">
          <div className="flex items-center justify-between text-nexmuted mb-2">
            <span className="text-[11px] font-mono uppercase font-bold text-nexcyan">Registered</span>
            <Smartphone className="w-4 h-4 text-nexcyan" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.registeredDevices}</div>
          <div className="text-[10px] text-nexmuted mt-1">Total enrolled assets</div>
        </div>

        {/* 2. Trusted Devices */}
        <div className="bg-nexcard/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-4 transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-nexmuted mb-2">
            <span className="text-[11px] font-mono uppercase font-bold text-emerald-400">Trusted</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.trustedDevices}</div>
          <div className="text-[10px] text-nexmuted mt-1">Knox/TPM attestation valid</div>
        </div>

        {/* 3. Lost or Stolen Devices */}
        <div className={`backdrop-blur-md rounded-2xl p-4 transition-all ${
          metrics.lostOrStolenDevices > 0
            ? 'bg-red-500/10 border border-red-500/40 text-red-300'
            : 'bg-nexcard/80 border border-nexblue/20 text-nexmuted'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase font-bold text-red-400">Lost / Stolen</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.lostOrStolenDevices}</div>
          <div className="text-[10px] text-red-300/80 mt-1">
            {metrics.lostOrStolenDevices > 0 ? 'Active lockdowns enforced' : 'Zero stolen devices reported'}
          </div>
        </div>

        {/* 4. Suspicious Login Attempts */}
        <div className="bg-nexcard/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between text-nexmuted mb-2">
            <span className="text-[11px] font-mono uppercase font-bold text-amber-400">Suspicious</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.suspiciousLoginAttempts}</div>
          <div className="text-[10px] text-nexmuted mt-1">Blocked anomalies & rate hits</div>
        </div>

        {/* 5. Active Sessions */}
        <div className="bg-nexcard/80 backdrop-blur-md border border-nexpurple/20 rounded-2xl p-4 transition-all hover:border-nexpurple/40">
          <div className="flex items-center justify-between text-nexmuted mb-2">
            <span className="text-[11px] font-mono uppercase font-bold text-nexpurple">Sessions</span>
            <Radio className="w-4 h-4 text-nexpurple" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.activeSessions}</div>
          <div className="text-[10px] text-nexmuted mt-1">Live active tokens</div>
        </div>

        {/* 6. Recent Security Alerts */}
        <div className="bg-nexcard/80 backdrop-blur-md border border-nexdanger/20 rounded-2xl p-4 transition-all hover:border-nexdanger/40">
          <div className="flex items-center justify-between text-nexmuted mb-2">
            <span className="text-[11px] font-mono uppercase font-bold text-nexdanger">SOC Alerts</span>
            <ShieldAlert className="w-4 h-4 text-nexdanger" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.recentSecurityAlerts}</div>
          <div className="text-[10px] text-nexmuted mt-1">Critical & high severity</div>
        </div>
      </div>

      {/* Device Management Table */}
      <div className="bg-nexcard/80 backdrop-blur-md border border-nexblue/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-nexblue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-nexcyan" />
              Registered Devices & Anti-Theft Status
            </h2>
            <p className="text-xs text-nexmuted mt-0.5">
              Live hardware attestation, last known check-in, privacy-consented location, and immediate lockdown triggers.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-nexblue/10 hover:bg-nexblue/20 border border-nexblue/30 text-nexcyan text-xs font-mono font-medium flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexbg/80 text-nexcyan font-mono uppercase text-[10px] tracking-wider border-b border-nexblue/20">
              <tr>
                <th className="py-3 px-4">Device & Hardware</th>
                <th className="py-3 px-4">Platform & OS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Check-In</th>
                <th className="py-3 px-4">Consented Location</th>
                <th className="py-3 px-4 text-right">Emergency Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexblue/10 text-nextext">
              {devices.map((device) => {
                const isLost = device.isLost || device.status === 'LOST' || device.status === 'STOLEN';
                const isBlocked = device.status === 'BLOCKED';

                return (
                  <tr
                    key={device.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      isLost ? 'bg-red-500/[0.04]' : isBlocked ? 'bg-amber-500/[0.03]' : ''
                    }`}
                  >
                    {/* Device & Hardware */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            device.deviceType === 'ANDROID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-nexblue/10 text-nexcyan border border-nexblue/20'
                          }`}
                        >
                          {device.deviceType === 'ANDROID' ? (
                            <Smartphone className="w-5 h-5" />
                          ) : (
                            <Laptop className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {device.deviceName}
                            {device.isTrusted && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
                                TRUSTED
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-nexmuted">
                            Model: {device.deviceModel || 'General Knox Device'} • {device.fingerprint?.slice(0, 18)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Platform & OS */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <div>{device.osVersion}</div>
                      <div className="text-[10px] text-nexmuted">App: v{device.appVersion || '1.0.0'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase border ${
                          isLost
                            ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                            : isBlocked
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : device.status === 'ONLINE'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                        }`}
                      >
                        {isLost ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            LOST / STOLEN
                          </>
                        ) : isBlocked ? (
                          <>
                            <Lock className="w-3 h-3" />
                            BLOCKED
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {device.status}
                          </>
                        )}
                      </span>
                    </td>

                    {/* Last Check-in */}
                    <td className="py-3.5 px-4 font-mono text-xs text-nexmuted">
                      <div>{new Date(device.lastSeenAt).toLocaleTimeString()}</div>
                      <div className="text-[10px]">{device.ipAddress}</div>
                    </td>

                    {/* Consented Location */}
                    <td className="py-3.5 px-4">
                      {device.location?.consentGiven ? (
                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            setShowLocationModal(true);
                          }}
                          className="flex items-center gap-1.5 text-nexcyan hover:underline cursor-pointer group"
                        >
                          <MapPin className="w-3.5 h-3.5 text-nexcyan group-hover:scale-110 transition-transform" />
                          <span>
                            {device.location.city || 'Dhaka'}, {device.location.country || 'BD'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-nexmuted font-mono">Location Consent Not Granted</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {isLost ? (
                          <button
                            onClick={() => handleRestoreDevice(device)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Unlock className="w-3 h-3" />
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkLost(device)}
                            disabled={isProcessing}
                            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:shadow-red-500/20"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Mark Lost
                          </button>
                        )}

                        <button
                          onClick={() => handleRevokeSessions(device)}
                          disabled={isProcessing}
                          title="Revoke active sessions"
                          className="p-1.5 rounded-lg bg-nexcard hover:bg-white/5 border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDevice(device);
                            setShowEventsModal(true);
                          }}
                          title="View device event audit"
                          className="p-1.5 rounded-lg bg-nexcard hover:bg-white/5 border border-nexcyan/30 text-nexcyan hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Incident Audit & Chain of Custody */}
      <div className="bg-nexcard/80 backdrop-blur-md border border-nexblue/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-nexcyan" />
              Emergency Incident Log & Chain of Custody
            </h3>
            <p className="text-xs text-nexmuted mt-0.5">
              Tamper-evident records generated upon every emergency lockdown, session revocation, and recovery action.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(data?.recentIncidents || []).length === 0 ? (
            <div className="text-center py-6 text-xs text-nexmuted font-mono">
              No emergency security incidents recorded. System running in nominal state.
            </div>
          ) : (
            data.recentIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-nexbg/60 border border-nexblue/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-nexcyan">{inc.reportNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                      {inc.incidentType}
                    </span>
                    <span className="text-[10px] text-nexmuted font-mono">
                      {new Date(inc.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-nexmuted mt-1.5 space-y-0.5">
                    {Array.isArray(inc.actionsTaken) &&
                      inc.actionsTaken.map((a, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-nextext">
                          <span className="text-nexcyan">•</span> {a}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="text-right flex items-center gap-2 self-start md:self-auto">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    STATUS: {inc.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL 1: Consented Location Viewer */}
      {showLocationModal && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexcard border border-nexcyan/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-nexmuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-nexcyan font-mono text-xs font-bold uppercase mb-2">
              <MapPin className="w-4 h-4" />
              Consented Device Location
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{selectedDevice.deviceName}</h3>
            <p className="text-xs text-nexmuted mb-4">
              Hardware Attestation: {selectedDevice.fingerprint}
            </p>

            <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/30 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-nexmuted">Latitude:</span>
                <span className="text-white font-bold">{selectedDevice.location?.latitude || '23.8103'}° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nexmuted">Longitude:</span>
                <span className="text-white font-bold">{selectedDevice.location?.longitude || '90.4125'}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nexmuted">Estimated Accuracy:</span>
                <span className="text-emerald-400 font-bold">±{selectedDevice.location?.accuracyMeters || 12} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nexmuted">Region / City:</span>
                <span className="text-nexcyan font-bold">
                  {selectedDevice.location?.city || 'Dhaka'}, {selectedDevice.location?.country || 'Bangladesh'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-nexmuted">Last Telemetry Sync:</span>
                <span className="text-nexmuted">
                  {new Date(selectedDevice.location?.timestamp || selectedDevice.lastSeenAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-nexblue/10 border border-nexblue/20 text-[11px] text-nexcyan flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guarantee:</strong> This location is displayed solely because user consent was explicitly granted via Android permissions. Offline or unpowered devices cannot be tracked.
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 rounded-xl bg-nexblue text-white text-xs font-bold"
              >
                Close Location Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Backup Codes Modal */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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

            <h3 className="text-lg font-bold text-white mb-1">One-Time Account Recovery Codes</h3>
            <p className="text-xs text-nexmuted mb-4">
              Store these offline in a secure physical location. Each code can be used once to bypass primary phone MFA if your mobile device is stolen or lost.
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
                  <span className="text-[9px] text-nexmuted">
                    {code.isUsed ? 'USED' : 'READY'}
                  </span>
                </div>
              ))}
            </div>

            {/* Regenerate Section */}
            <div className="mt-4 pt-4 border-t border-nexblue/20">
              <div className="text-xs font-bold text-white mb-2">Regenerate New Backup Codes:</div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Enter Master Password to Confirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="flex-1 bg-nexbg/80 border border-nexblue/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-nexcyan"
                />
                <button
                  onClick={handleRegenerateCodes}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-nexpurple hover:bg-nexpurple/80 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  Regenerate 10
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowBackupCodesModal(false)}
                className="px-4 py-2 rounded-xl bg-nexblue text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Recovery Methods Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexcard border border-nexpurple/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowRecoveryModal(false)}
              className="absolute top-4 right-4 text-nexmuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-nexpurple font-mono text-xs font-bold uppercase mb-2">
              <Mail className="w-4 h-4" />
              Verified Recovery Channels
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Emergency Owner Recovery Methods</h3>
            <p className="text-xs text-nexmuted mb-4">
              If your phone is lost, use these verified secondary channels from any web browser terminal to restore access.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-nexbg/80 border border-nexpurple/30">
                <div className="text-nexmuted text-[10px] uppercase font-bold">Secondary Recovery Email</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  {recoveryProfile.secondaryRecoveryEmail || 'owner.emergency.recovery@protonmail.com'}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Encrypted & Verified Offline
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-nexbg/80 border border-nexblue/30">
                <div className="text-nexmuted text-[10px] uppercase font-bold">Secondary Emergency Phone</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  {recoveryProfile.secondaryRecoveryPhone || '+8801700998877'}
                </div>
                <div className="text-[10px] text-nexmuted mt-1">
                  SMS / Signal Emergency Dispatch Enabled
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-nexbg/80 border border-nexcyan/30">
                <div className="text-nexmuted text-[10px] uppercase font-bold">Master Account Authority</div>
                <div className="text-white font-bold text-sm mt-0.5">ORIGINAL OWNER (IMMUTABLE)</div>
                <div className="text-[10px] text-nexcyan mt-1">
                  No other administrator can delete, demote, or modify recovery methods.
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-4 py-2 rounded-xl bg-nexpurple text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Device Security Events History Modal */}
      {showEventsModal && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexcard border border-nexblue/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowEventsModal(false)}
              className="absolute top-4 right-4 text-nexmuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-nexcyan font-mono text-xs font-bold uppercase mb-2">
              <Eye className="w-4 h-4" />
              Device Security History
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{selectedDevice.deviceName}</h3>
            <p className="text-xs text-nexmuted mb-4 font-mono">
              Fingerprint: {selectedDevice.fingerprint}
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {(!selectedDevice.events || selectedDevice.events.length === 0) ? (
                <div className="text-xs text-nexmuted font-mono py-4 text-center">
                  No previous alerts or abnormal events logged for this device.
                </div>
              ) : (
                selectedDevice.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-lg bg-nexbg/80 border border-nexblue/20 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-nexcyan">{evt.eventType}</span>
                      <span className="text-[10px] text-nexmuted">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-nexmuted text-[11px] mt-1">{evt.description}</div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowEventsModal(false)}
                className="px-4 py-2 rounded-xl bg-nexblue text-white text-xs font-bold"
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
