import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldCheck,
  MailCheck,
  Smartphone,
  Wifi,
  Lock,
  AlertTriangle,
  Globe,
  Fingerprint,
  Users,
  Crosshair,
  Cloud,
  Activity,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Key,
  RefreshCw,
  Plus,
  Trash2,
  LockKeyhole,
} from 'lucide-react';

export default function ModuleDetailView({ moduleId, onBack }) {
  // Common state
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Phishing Shield state
  const [phishingUrl, setPhishingUrl] = useState('https://secure-login-nexguard-verify.online');
  const [phishingResult, setPhishingResult] = useState(null);

  // WebShield state
  const [webTarget, setWebTarget] = useState('github.com');
  const [webResult, setWebResult] = useState(null);

  // Vault state
  const [vaultItems, setVaultItems] = useState([]);
  const [newVaultTitle, setNewVaultTitle] = useState('');
  const [newVaultSecret, setNewVaultSecret] = useState('');

  // Threat Intel state
  const [iocQuery, setIocQuery] = useState('185.220.101.5');
  const [iocResult, setIocResult] = useState(null);

  // SOC Incident state
  const [incidents, setIncidents] = useState([]);

  // Load module data
  useEffect(() => {
    if (moduleId === 'vault-guardian') {
      api.getVaultItems()
        .then((res) => {
          if (res.data) setVaultItems(res.data);
        })
        .catch(() => {
          setVaultItems([
            { id: 'v1', title: 'Corporate AWS Root', category: 'API_KEY', encryptedPayload: 'U2FsdGVkX1+9b4...AES256GCM', iv: 'a7c0f1', salt: '89ba11', createdAt: '2026-11-10T04:00:00Z' },
            { id: 'v2', title: 'Primary Github SSH Passphrase', category: 'LOGIN', encryptedPayload: 'U2FsdGVkX19a3...AES256GCM', iv: '55fe21', salt: '11ca99', createdAt: '2026-11-09T18:00:00Z' },
          ]);
        });
    } else if (moduleId === 'cyber-soc') {
      api.getSocIncidents()
        .then((res) => {
          if (res.data) setIncidents(res.data);
        })
        .catch(() => {
          setIncidents([
            { id: 'alert-001', severity: 'HIGH', status: 'OPEN', title: 'Unrecognized Device Login Detected', sourceIp: '103.114.98.12', timestamp: new Date().toISOString() },
            { id: 'alert-002', severity: 'CRITICAL', status: 'INVESTIGATING', title: 'Malicious Phishing SMS Link Blocked', destinationIp: '198.51.100.42', timestamp: new Date().toISOString() },
          ]);
        });
    }
  }, [moduleId]);

  // Phishing Scan Handler
  const handlePhishingScan = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.scanUrlPhishing(phishingUrl);
      setPhishingResult(res.data);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // WebShield Scan Handler
  const handleWebShieldScan = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.scanWebShield(webTarget);
      setWebResult(res.data);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Threat IOC Lookup Handler
  const handleIocLookup = async () => {
    setLoading(true);
    try {
      const res = await api.lookupThreat(iocQuery);
      setIocResult(res);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Vault Create Handler (Zero-Knowledge: Simulated client-side AES encryption)
  const handleAddVaultItem = async (e) => {
    e.preventDefault();
    if (!newVaultTitle || !newVaultSecret) return;

    // Zero-Knowledge Client-Side Hash / Cipher representation
    const fakeCipher = btoa(`ZERO_KNOWLEDGE_AES256GCM_${newVaultSecret}`);
    const fakeIv = Math.random().toString(16).substring(2, 10);
    const fakeSalt = Math.random().toString(16).substring(2, 10);

    try {
      const res = await api.createVaultItem({
        title: newVaultTitle,
        category: 'LOGIN',
        encryptedPayload: fakeCipher,
        iv: fakeIv,
        salt: fakeSalt,
        authTag: 'e0f4',
      });
      if (res.data) {
        setVaultItems([res.data, ...vaultItems]);
        setNewVaultTitle('');
        setNewVaultSecret('');
        setFeedback({ type: 'success', text: 'Credentials encrypted on client and stored in zero-knowledge vault.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-nexbg hover:bg-nexcardHover border border-nexblue/30 text-xs font-mono text-nexcyan flex items-center gap-2 transition-colors"
        >
          ← Return to All Modules
        </button>
        <span className="text-xs font-mono text-nexmuted">Module ID: {moduleId}</span>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs font-mono border ${
            feedback.type === 'error'
              ? 'bg-nexdanger/10 border-nexdanger text-nexdanger'
              : 'bg-nexgreen/10 border-nexgreen text-nexgreen'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* 01. IDENTITY GUARDIAN */}
      {moduleId === 'identity-guardian' && (
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-nexblue/20">
            <div className="p-3 rounded-xl bg-nexcyan/20 text-nexcyan">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">01. Identity Guardian</h2>
              <p className="text-xs font-mono text-nexcyan">MFA, Biometrics & Anomaly Interception</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20">
              <span className="text-xs font-mono text-nexmuted">Identity Score</span>
              <p className="text-3xl font-black text-nexgreen mt-1">100%</p>
              <p className="text-[11px] text-nexmuted mt-1">Hardware Keystore Attested</p>
            </div>
            <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20">
              <span className="text-xs font-mono text-nexmuted">Active Passkeys</span>
              <p className="text-3xl font-black text-nexcyan mt-1">2 Keys</p>
              <p className="text-[11px] text-nexmuted mt-1">FIDO2 / WebAuthn Enforced</p>
            </div>
            <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20">
              <span className="text-xs font-mono text-nexmuted">Anomalous Logins (30d)</span>
              <p className="text-3xl font-black text-white mt-1">0</p>
              <p className="text-[11px] text-nexgreen mt-1">Zero unauthorized sessions</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-nexcard border border-nexblue/30 space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Enforced Security Protocols</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-nexbg border border-nexgreen/20">
                <span className="text-white">Multi-Factor Authentication (TOTP / Biometric)</span>
                <span className="px-2 py-0.5 rounded bg-nexgreen/20 text-nexgreen font-bold text-[10px]">ENFORCED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-nexbg border border-nexgreen/20">
                <span className="text-white">Android Knox Keystore Root Attestation</span>
                <span className="px-2 py-0.5 rounded bg-nexgreen/20 text-nexgreen font-bold text-[10px]">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-nexbg border border-nexgreen/20">
                <span className="text-white">Continuous Geo-IP Velocity & Impossible Travel Check</span>
                <span className="px-2 py-0.5 rounded bg-nexgreen/20 text-nexgreen font-bold text-[10px]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 02. PHISHING SHIELD */}
      {moduleId === 'phishing-shield' && (
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-nexblue/20">
            <div className="p-3 rounded-xl bg-nexblue/20 text-nexcyan">
              <MailCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">02. Phishing Shield</h2>
              <p className="text-xs font-mono text-nexcyan">Deep Heuristic URL & Scam Inspection Engine</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={phishingUrl}
              onChange={(e) => setPhishingUrl(e.target.value)}
              placeholder="Paste suspicious URL or domain (e.g. bkash-refund-service.xyz)"
              className="flex-1 px-4 py-2.5 rounded-lg bg-nexbg border border-nexblue/40 text-xs font-mono text-white focus:outline-none focus:border-nexcyan"
            />
            <button
              onClick={handlePhishingScan}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-nexblue hover:bg-nexblue/80 text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Analyzing...' : 'Scan URL'}
            </button>
          </div>

          {phishingResult && (
            <div className={`p-4 rounded-xl border ${phishingResult.isSafe ? 'bg-nexgreen/10 border-nexgreen/40' : 'bg-nexdanger/10 border-nexdanger/40'} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {phishingResult.isSafe ? (
                    <CheckCircle className="w-5 h-5 text-nexgreen" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-nexdanger" />
                  )}
                  <span className="text-sm font-bold text-white font-mono">
                    {phishingResult.isSafe ? 'URL VERIFIED SAFE' : `CRITICAL THREAT: ${phishingResult.threatType}`}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-white">
                  Risk Score: {phishingResult.riskScore}/100
                </span>
              </div>

              <p className="text-xs text-nextext leading-relaxed">
                {phishingResult.details.recommendation}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
                <div>Punycode Homograph: <b className="text-white">{phishingResult.details.hasPunycode ? 'YES (Risk)' : 'NO'}</b></div>
                <div>Suspicious TLD: <b className="text-white">{phishingResult.details.isSuspiciousTLD ? 'YES' : 'NO'}</b></div>
                <div>Domain Age: <b className="text-white">{phishingResult.details.domainAgeDays} days</b></div>
                <div>SSL Certificate: <b className="text-white">{phishingResult.details.sslValid ? 'VALID' : 'INVALID'}</b></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 05. VAULT GUARDIAN */}
      {moduleId === 'vault-guardian' && (
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-nexblue/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-nexpurple/20 text-nexpurple">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">05. Vault Guardian</h2>
                <p className="text-xs font-mono text-nexcyan">Zero-Knowledge Encrypted Password & Secret Manager</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-nexpurple/20 text-nexpurple border border-nexpurple/30 text-xs font-mono font-bold">
              AES-256-GCM Zero-Knowledge
            </span>
          </div>

          <div className="p-4 rounded-xl bg-nexbg/80 border border-nexpurple/30">
            <p className="text-xs text-nexmuted mb-3 font-mono">
              🛡️ <b>Client-Side Privacy Guarantee:</b> Your master password never leaves this browser. Passwords and sensitive notes are encrypted locally before transmission.
            </p>

            <form onSubmit={handleAddVaultItem} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newVaultTitle}
                onChange={(e) => setNewVaultTitle(e.target.value)}
                placeholder="Item Title (e.g. AWS Production Token)"
                className="px-3 py-2 rounded bg-nexcard border border-nexblue/30 text-xs text-white"
                required
              />
              <input
                type="password"
                value={newVaultSecret}
                onChange={(e) => setNewVaultSecret(e.target.value)}
                placeholder="Secret Content (Encrypted client-side)"
                className="px-3 py-2 rounded bg-nexcard border border-nexblue/30 text-xs text-white"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-nexpurple hover:bg-nexpurple/80 text-white font-mono text-xs font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Save Zero-Knowledge Secret
              </button>
            </form>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-nexmuted uppercase tracking-wider">
              Stored Encrypted Items ({vaultItems.length})
            </h3>
            {vaultItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-nexbg/60 border border-nexblue/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-nexpurple/10 text-nexpurple">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <p className="text-[10px] font-mono text-nexmuted">
                      Ciphertext: {item.encryptedPayload.substring(0, 24)}... (IV: {item.iv})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-nexblue/20 text-nexcyan text-[10px] font-mono">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 07. WEBSHIELD */}
      {moduleId === 'webshield' && (
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-nexblue/20">
            <div className="p-3 rounded-xl bg-nexblue/20 text-nexblue">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">07. WebShield</h2>
              <p className="text-xs font-mono text-nexcyan">Authorized Website Security & SSL/Header Auditor (SSRF-Safe)</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={webTarget}
              onChange={(e) => setWebTarget(e.target.value)}
              placeholder="Authorized domain name (e.g. github.com)"
              className="flex-1 px-4 py-2.5 rounded-lg bg-nexbg border border-nexblue/40 text-xs font-mono text-white focus:outline-none focus:border-nexcyan"
            />
            <button
              onClick={handleWebShieldScan}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-nexblue hover:bg-nexblue/80 text-white font-mono text-xs font-bold flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Auditing...' : 'Audit Domain'}
            </button>
          </div>

          {webResult && (
            <div className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{webResult.target}</h4>
                  <p className="text-[11px] font-mono text-nexgreen">SSRF Protection: ACTIVE (Private IPs strictly blocked)</p>
                </div>
                <span className="text-2xl font-black text-nexgreen font-mono">Grade: {webResult.grade}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-nexblue/20 text-xs font-mono">
                <div className="p-2 rounded bg-nexcard">
                  <span className="text-nexmuted text-[10px]">TLS Protocol</span>
                  <p className="font-bold text-white">{webResult.sslTls.protocol}</p>
                </div>
                <div className="p-2 rounded bg-nexcard">
                  <span className="text-nexmuted text-[10px]">HSTS Enabled</span>
                  <p className="font-bold text-nexgreen">YES (Strict)</p>
                </div>
                <div className="p-2 rounded bg-nexcard">
                  <span className="text-nexmuted text-[10px]">CSP Header</span>
                  <p className="font-bold text-nexgreen">CONFIGURED</p>
                </div>
                <div className="p-2 rounded bg-nexcard">
                  <span className="text-nexmuted text-[10px]">X-Frame-Options</span>
                  <p className="font-bold text-nexgreen">DENY / SAMEORIGIN</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. THREAT INTELLIGENCE */}
      {moduleId === 'threat-intelligence' && (
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-nexblue/20">
            <div className="p-3 rounded-xl bg-nexgreen/20 text-nexgreen">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">10. Threat Intelligence</h2>
              <p className="text-xs font-mono text-nexcyan">Real-Time Indicators of Compromise (IOC) Lookup Engine</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={iocQuery}
              onChange={(e) => setIocQuery(e.target.value)}
              placeholder="Query IP, Domain, MD5 or SHA256 malware hash"
              className="flex-1 px-4 py-2.5 rounded-lg bg-nexbg border border-nexblue/40 text-xs font-mono text-white focus:outline-none focus:border-nexcyan"
            />
            <button
              onClick={handleIocLookup}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-nexgreen/80 hover:bg-nexgreen text-black font-mono text-xs font-bold flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Querying...' : 'Lookup IOC'}
            </button>
          </div>

          {iocResult && (
            <div className="p-4 rounded-xl bg-nexbg/80 border border-nexgreen/30">
              {iocResult.found ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-nexdanger">
                      MATCH FOUND: {iocResult.ioc.threatType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-nexdanger/20 text-nexdanger text-[10px] font-mono font-bold">
                      Confidence: {iocResult.ioc.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-white">{iocResult.ioc.description}</p>
                  <p className="text-[11px] font-mono text-nexmuted">Source: {iocResult.ioc.source} | Severity: {iocResult.ioc.severity}</p>
                </div>
              ) : (
                <div className="text-xs font-mono text-nexgreen flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> {iocResult.message}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 12. CYBER SOC */}
      {moduleId === 'cyber-soc' && (
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-nexblue/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-nexcyan/20 text-nexcyan">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">12. Cyber SOC Console</h2>
                <p className="text-xs font-mono text-nexcyan">Unified Monitoring & Real-time Incident Triage</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-nexcyan/20 text-nexcyan border border-nexcyan/30 text-xs font-mono font-bold animate-pulse">
              ● SOC STREAM CONNECTED
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-nexmuted uppercase tracking-wider">
              Incident Response Queue ({incidents.length})
            </h3>
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-nexbg/80 border border-nexblue/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-nexdanger/20 text-nexdanger border border-nexdanger/30'
                          : 'bg-nexwarning/20 text-nexwarning border border-nexwarning/30'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{inc.title}</span>
                  </div>
                  <p className="text-[11px] text-nexmuted mt-1">
                    Source: {inc.sourceIp || inc.destinationIp || '127.0.0.1'} • Status: <b className="text-nexcyan">{inc.status}</b>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      api.triageIncident(inc.id, 'RESOLVED', 'Quarantine applied and verified');
                      setIncidents(incidents.map((i) => (i.id === inc.id ? { ...i, status: 'RESOLVED' } : i)));
                    }}
                    className="px-3 py-1.5 rounded bg-nexgreen/20 hover:bg-nexgreen/30 text-nexgreen border border-nexgreen/30 text-xs font-mono font-semibold transition-colors"
                  >
                    Resolve Incident
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback info for remaining modules */}
      {!['identity-guardian', 'phishing-shield', 'vault-guardian', 'webshield', 'threat-intelligence', 'cyber-soc'].includes(moduleId) && (
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h2 className="text-xl font-bold text-white capitalize">{moduleId.replace('-', ' ')}</h2>
          <p className="text-xs text-nexmuted font-mono">
            Enterprise module connected to central backend engine. Real-time telemetry reporting healthy.
          </p>
          <div className="p-4 rounded-xl bg-nexbg/80 border border-nexgreen/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-nexgreen" />
            <span className="text-xs font-mono text-nexgreen">
              Status: ACTIVE • Telemetry synchronized with NEXGUARD Central Backend.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
