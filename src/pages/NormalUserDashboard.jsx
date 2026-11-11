import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Lock,
  Globe,
  Wifi,
  Cloud,
  Crosshair,
  AlertTriangle,
  Fingerprint,
  MailCheck,
  Activity,
  ArrowRight,
  Shield,
  RefreshCw,
} from 'lucide-react';

export default function NormalUserDashboard({ onSelectModule }) {
  const { currentUser } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('All Systems Secure • No threats detected');

  const handleScan = () => {
    setScanning(true);
    setScanMessage('Scanning network, permissions, and threat feeds...');
    setTimeout(() => {
      setScanning(false);
      setScanMessage('Scan Complete: All 12 Modules Healthy • Posture 98% Excellent');
    }, 1800);
  };

  const modules = [
    { id: 'identity-guardian', name: '01. Identity Guardian', desc: 'Secure Login, MFA & Passkey', icon: ShieldCheck, status: 'Active', color: 'text-nexcyan' },
    { id: 'phishing-shield', name: '02. Phishing Shield', desc: 'URL Scanner & Scam Detection', icon: MailCheck, status: 'Protected', color: 'text-nexblue' },
    { id: 'endpoint-guardian', name: '03. Endpoint Guardian', desc: 'Device Security & App Control', icon: Smartphone, status: 'Enforced', color: 'text-nexgreen' },
    { id: 'network-sentinel', name: '04. Network Sentinel', desc: 'Wi-Fi Security & Risk Analysis', icon: Wifi, status: 'Safe', color: 'text-nexcyan' },
    { id: 'vault-guardian', name: '05. Vault Guardian', desc: 'Encrypted Password, Notes & Files', icon: Lock, status: 'Locked (Zero-Knowledge)', color: 'text-nexpurple' },
    { id: 'ransomware-guardian', name: '06. Ransomware Guardian', desc: 'Backup & Recovery Readiness', icon: AlertTriangle, status: 'Monitoring', color: 'text-nexdanger' },
    { id: 'webshield', name: '07. WebShield', desc: 'Web Security & Safe Browsing', icon: Globe, status: 'Shielded', color: 'text-nexblue' },
    { id: 'digital-forensics', name: '08. Digital Forensics', desc: 'Incident Evidence & Case Management', icon: Fingerprint, status: 'Tamper-Evident', color: 'text-nexcyan' },
    { id: 'access-guardian', name: '09. Access Guardian', desc: 'MFA, Sessions & Permissions', icon: Shield, status: 'Zero-Trust', color: 'text-nexpurple' },
    { id: 'threat-intelligence', name: '10. Threat Intelligence', desc: 'Threat Feeds & IOC Management', icon: Crosshair, status: 'Synchronized', color: 'text-nexgreen' },
    { id: 'cloud-backup-guardian', name: '11. Cloud Backup Guardian', desc: 'Encrypted Backup & Restore', icon: Cloud, status: 'Encrypted', color: 'text-nexblue' },
    { id: 'cyber-soc', name: '12. Cyber SOC', desc: 'Unified Monitoring & Incident Response', icon: Activity, status: 'Live 24/7', color: 'text-nexcyan' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* User Welcome & Top Security Gauge */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-nexcyan/20 text-nexcyan border border-nexcyan/30">
                END-USER PROTECTION SHIELD
              </span>
              <span className="text-xs font-mono text-nexmuted">NEXGUARD 12 Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-2">
              Welcome back, {currentUser?.fullName || 'Cyber Defender'}
            </h1>
            <p className="text-xs text-nexmuted mt-1 max-w-xl">
              Your device, biometric credentials, passwords, and internet traffic are guarded in real-time by 12 interconnected cybersecurity shields.
            </p>

            {/* Quick Status Pill */}
            <div className="mt-4 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nexgreen/10 border border-nexgreen/30 text-xs font-mono text-nexgreen">
                <CheckCircle className="w-4 h-4" />
                <span>{scanMessage}</span>
              </div>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="px-3 py-1.5 rounded-full bg-nexblue hover:bg-nexblue/80 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
                {scanning ? 'Auditing...' : 'Run Quick Audit'}
              </button>
            </div>
          </div>

          {/* Radial Score Gauge (Matching Official Image: 98% Excellent) */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full border-4 border-nexgreen/40 flex items-center justify-center shadow-glow-green">
              <div className="w-28 h-28 rounded-full bg-[#071329] border border-nexgreen/60 flex flex-col items-center justify-center text-center p-2">
                <span className="text-[10px] font-mono text-nexmuted uppercase tracking-wider">Security Score</span>
                <span className="text-3xl font-black text-white font-mono leading-tight">98%</span>
                <span className="text-[10px] font-bold text-nexgreen flex items-center gap-0.5">
                  ✓ Excellent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Cybersecurity Modules Grid (Matching Overview Center Grid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-nexcyan" /> 12 Enterprise Protection Modules
            </h2>
            <p className="text-xs text-nexmuted font-mono">
              Click any module to launch its interactive scanner and controls
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => onSelectModule && onSelectModule(m.id)}
                className="p-4 rounded-xl glass-panel glass-panel-hover cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-nexbg border border-nexblue/30 group-hover:border-nexcyan transition-colors">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-nexbg/80 border border-nexblue/20 text-nexcyan">
                      {m.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3 group-hover:text-nexcyan transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-xs text-nexmuted mt-1 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-nexblue/10 flex items-center justify-between text-xs font-mono text-nexmuted group-hover:text-nexcyan transition-colors">
                  <span>Open Shield</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Devices for User */}
      <div className="p-5 rounded-xl glass-panel">
        <div className="flex items-center justify-between pb-3 border-b border-nexblue/20">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-nexcyan" /> My Registered Devices (1/5 Active)
          </span>
          <span className="text-xs font-mono text-nexgreen">Pro Cyber Subscription</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-nexbg/80 border border-nexgreen/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-nexgreen/20 text-nexgreen">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Samsung Galaxy S24 Ultra</p>
                <p className="text-[11px] font-mono text-nexmuted">Android 15 • Knox Hardware Attested • Online</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-nexgreen/20 text-nexgreen border border-nexgreen/30">
              Compliant
            </span>
          </div>

          <div className="p-3 rounded-lg bg-nexbg/40 border border-dashed border-nexblue/30 flex items-center justify-center text-xs font-mono text-nexmuted cursor-pointer hover:border-nexcyan hover:text-nexcyan transition-colors">
            + Register Android or Desktop Endpoint
          </div>
        </div>
      </div>
    </div>
  );
}
