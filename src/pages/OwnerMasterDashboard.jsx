import React, { useState, useEffect } from 'react';
import ThreatMap from '../components/ThreatMap';
import { api } from '../services/api';
import {
  Users,
  Smartphone,
  ShieldAlert,
  DollarSign,
  Cpu,
  Activity,
  CheckCircle,
  Database,
  Server,
  Cloud,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function OwnerMasterDashboard({ onNavigate }) {
  const [metrics, setMetrics] = useState({
    totalUsers: 12480,
    activeUsers: 8320,
    inactiveUsers: 4160,
    totalAdministrators: 5,
    registeredDevices: 8320,
    onlineDevices: 6940,
    activeModules: 12,
    totalSecurityAlerts: 24,
    criticalIncidents: 1,
    activeSubscriptions: 3410,
    totalRevenue: 4852000,
    backendHealth: 'OPTIMAL',
    databaseHealth: 'CONNECTED',
    apiLatencyMs: 14,
    cloudBackupStatus: 'UP_TO_DATE',
    threatLevel: 'NORMAL',
    chartData: {
      userGrowth: [
        { month: 'Jun', users: 5200, revenue: 1850000 },
        { month: 'Jul', users: 6800, revenue: 2420000 },
        { month: 'Aug', users: 8400, revenue: 3100000 },
        { month: 'Sep', users: 9900, revenue: 3750000 },
        { month: 'Oct', users: 11200, revenue: 4200000 },
        { month: 'Nov', users: 12480, revenue: 4852000 },
      ],
      threatActivity: [
        { time: '00:00', blocked: 42 },
        { time: '04:00', blocked: 89 },
        { time: '08:00', blocked: 145 },
        { time: '12:00', blocked: 210 },
        { time: '16:00', blocked: 178 },
        { time: '20:00', blocked: 95 },
      ],
    },
  });

  useEffect(() => {
    api.getOwnerOverview()
      .then((res) => {
        if (res.data) setMetrics(res.data);
      })
      .catch((err) => console.warn('Using local master metrics:', err));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Master Control Status */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-nexcard via-[#0c1836] to-nexcard border border-nexcyan/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              OWNER SUPER CONTROL CENTER
            </span>
            <span className="text-xs font-mono text-nexcyan">Original Owner Authorized</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">
            NEXGUARD 12 Global Infrastructure & Threat Overview
          </h1>
        </div>

        {/* System Health Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexbg/80 border border-nexgreen/30 text-xs font-mono">
            <Server className="w-3.5 h-3.5 text-nexgreen" />
            <span>API: <b className="text-nexgreen">{metrics.backendHealth}</b> ({metrics.apiLatencyMs}ms)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexbg/80 border border-nexblue/30 text-xs font-mono">
            <Database className="w-3.5 h-3.5 text-nexcyan" />
            <span>DB: <b className="text-nexcyan">{metrics.databaseHealth}</b></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexbg/80 border border-nexpurple/30 text-xs font-mono">
            <Cloud className="w-3.5 h-3.5 text-nexpurple" />
            <span>Cloud Backup: <b className="text-nexpurple">{metrics.cloudBackupStatus}</b></span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Matching Dashboard Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-xl glass-panel glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-nexmuted uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-lg bg-nexblue/20 text-nexcyan">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{metrics.totalUsers.toLocaleString()}</span>
            <span className="text-xs font-mono text-nexgreen flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-nexmuted flex justify-between">
            <span>Active: <b className="text-white">{metrics.activeUsers.toLocaleString()}</b></span>
            <span>Admins: <b className="text-nexcyan">{metrics.totalAdministrators}</b></span>
          </div>
        </div>

        {/* Active Devices */}
        <div className="p-4 rounded-xl glass-panel glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-nexmuted uppercase tracking-wider">Active Devices</span>
            <div className="p-2 rounded-lg bg-nexcyan/20 text-nexcyan">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{metrics.registeredDevices.toLocaleString()}</span>
            <span className="text-xs font-mono text-nexgreen flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8%
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-nexmuted flex justify-between">
            <span>Online Now: <b className="text-nexgreen">{metrics.onlineDevices.toLocaleString()}</b></span>
            <span>Android: <b className="text-white">63%</b></span>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="p-4 rounded-xl glass-panel glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-nexmuted uppercase tracking-wider">Security Alerts</span>
            <div className="p-2 rounded-lg bg-nexdanger/20 text-nexdanger">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{metrics.totalSecurityAlerts}</span>
            <span className="text-xs font-mono text-nexgreen flex items-center font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" /> -20%
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-nexmuted flex justify-between">
            <span>Critical: <b className="text-nexdanger">{metrics.criticalIncidents}</b></span>
            <span>Resolved: <b className="text-nexgreen">21</b></span>
          </div>
        </div>

        {/* Commercial Revenue */}
        <div className="p-4 rounded-xl glass-panel glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-nexmuted uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-lg bg-nexpurple/20 text-nexpurple">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">৳{(metrics.totalRevenue / 1000).toFixed(0)}k</span>
            <span className="text-xs font-mono text-nexgreen flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24%
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-nexmuted flex justify-between">
            <span>Active Subs: <b className="text-white">{metrics.activeSubscriptions.toLocaleString()}</b></span>
            <span>bKash/Nagad</span>
          </div>
        </div>
      </div>

      {/* Threat Map and Threat Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatMap />
        </div>

        {/* Threat Activity Line Visualizer */}
        <div className="p-5 rounded-xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-nexblue/20">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-nexcyan" /> Threat Activity
              </span>
              <span className="text-[10px] font-mono text-nexgreen px-2 py-0.5 rounded bg-nexgreen/10 border border-nexgreen/30">
                Live 24h
              </span>
            </div>
            <p className="text-xs text-nexmuted mt-2">
              Automated heuristics & WAF traffic filtering across all registered endpoints.
            </p>

            {/* Simulated mini SVG chart */}
            <div className="mt-4 h-32 w-full flex items-end gap-2 pt-4">
              {metrics.chartData.threatActivity.map((point, idx) => {
                const heightPercent = Math.min(100, (point.blocked / 220) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[9px] font-mono text-nexcyan opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.blocked}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-nexblue to-nexcyan rounded-t-sm group-hover:from-nexcyan group-hover:to-white transition-all shadow-glow-cyan"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-[9px] font-mono text-nexmuted">{point.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-nexblue/20 flex items-center justify-between text-xs font-mono">
            <span className="text-nexmuted">Total Blocked (24h):</span>
            <span className="font-bold text-nexcyan">1,248 threats</span>
          </div>
        </div>
      </div>

      {/* Module Status & Recent Activities (Matching Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Status Radial Card */}
        <div className="p-5 rounded-xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-nexblue/20">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-nexcyan" /> Module Status
            </span>
            <button
              onClick={() => onNavigate && onNavigate('modules')}
              className="text-[11px] font-mono text-nexcyan hover:underline"
            >
              Configure →
            </button>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative w-36 h-36 rounded-full border-4 border-nexgreen/30 flex items-center justify-center shadow-glow-green">
              <div className="w-28 h-28 rounded-full border border-nexcyan/40 bg-nexbg/80 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono">100%</span>
                <span className="text-[10px] font-mono text-nexgreen uppercase font-bold">Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-nexbg/60 border border-nexgreen/20">
              <p className="text-nexmuted text-[10px]">Active</p>
              <p className="text-lg font-bold text-nexgreen">12</p>
            </div>
            <div className="p-2 rounded bg-nexbg/60 border border-nexblue/20">
              <p className="text-nexmuted text-[10px]">Offline</p>
              <p className="text-lg font-bold text-nexmuted">0</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 p-5 rounded-xl glass-panel">
          <div className="flex items-center justify-between pb-3 border-b border-nexblue/20">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-nexcyan" /> Recent Platform Activities
            </span>
            <span className="text-[10px] font-mono text-nexcyan">Audited Stream</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-lg bg-nexbg/80 border border-nexblue/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-nexcyan"></div>
                <div>
                  <p className="text-xs font-semibold text-white">Authorized Login: Platform Owner</p>
                  <p className="text-[11px] font-mono text-nexmuted">IP 127.0.0.1 • Keystore Hardware Attestation Verified</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-nexmuted">Just now</span>
            </div>

            <div className="p-3 rounded-lg bg-nexbg/80 border border-nexdanger/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-nexdanger animate-ping"></div>
                <div>
                  <p className="text-xs font-semibold text-white">Phishing Threat Intercepted: Phishing Shield</p>
                  <p className="text-[11px] font-mono text-nexmuted">Domain bkash-refund-service.xyz blocked on 3 devices</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-nexmuted">5 min ago</span>
            </div>

            <div className="p-3 rounded-lg bg-nexbg/80 border border-nexgreen/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-nexgreen"></div>
                <div>
                  <p className="text-xs font-semibold text-white">Encrypted Cloud Backup Completed</p>
                  <p className="text-[11px] font-mono text-nexmuted">Incremental Vault Delta SHA-256 verified</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-nexmuted">14 min ago</span>
            </div>

            <div className="p-3 rounded-lg bg-nexbg/80 border border-nexblue/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-nexblue"></div>
                <div>
                  <p className="text-xs font-semibold text-white">Endpoint Compliance Check: Samsung S24 Ultra</p>
                  <p className="text-[11px] font-mono text-nexmuted">Zero root vulnerabilities • Knox hardware passkey valid</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-nexmuted">32 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
