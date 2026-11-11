import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth, ROLES } from '../context/AuthContext';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Power,
  Key,
  Lock,
  AlertCircle,
  CheckCircle,
  Users,
} from 'lucide-react';

export default function AdminManagementView() {
  const { isOwner } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New admin form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(ROLES.SECURITY_ADMIN);

  const loadAdmins = () => {
    setLoading(true);
    api.getAdmins()
      .then((res) => {
        if (res.data) setAdmins(res.data);
      })
      .catch((err) => {
        console.warn('Using local admins fallback:', err);
        setAdmins([
          { id: 'nexguard-owner-001', email: 'owner@nexguard.cyber', fullName: 'NexGuard Platform Owner', role: 'OWNER', isOwner: true, status: 'ACTIVE', securityScore: 100 },
          { id: 'admin-super-001', email: 'superadmin@nexguard.cyber', fullName: 'Sarah Connor', role: 'SUPER_ADMIN', isOwner: false, status: 'ACTIVE', securityScore: 96 },
          { id: 'admin-sec-002', email: 'security@nexguard.cyber', fullName: 'Alex Vance', role: 'SECURITY_ADMIN', isOwner: false, status: 'ACTIVE', securityScore: 94 },
          { id: 'admin-mod-003', email: 'moduleadmin@nexguard.cyber', fullName: 'David Lightman', role: 'MODULE_ADMIN', isOwner: false, status: 'ACTIVE', securityScore: 92 },
          { id: 'admin-aud-004', email: 'auditor@nexguard.cyber', fullName: 'Elliot Alderson', role: 'AUDITOR', isOwner: false, status: 'ACTIVE', securityScore: 99 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.createAdmin({ email, password, fullName, role });
      if (res.data) {
        setAdmins([...admins, res.data]);
        setShowCreateModal(false);
        setEmail('');
        setPassword('');
        setFullName('');
        setFeedback({ type: 'success', text: `Administrator ${email} successfully created.` });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    if (admin.isOwner) {
      setFeedback({ type: 'error', text: 'IMMUTABLE OWNER RULE: Original Owner cannot be suspended.' });
      return;
    }
    try {
      const res = await api.toggleAdminStatus(admin.id);
      if (res.data) {
        setAdmins(admins.map((a) => (a.id === admin.id ? res.data : a)));
        setFeedback({ type: 'success', text: `Status updated for ${admin.email}` });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleRemoveAdmin = async (admin) => {
    if (admin.isOwner) {
      setFeedback({ type: 'error', text: 'CRITICAL ACCESS VIOLATION: Original Owner cannot be removed.' });
      return;
    }
    if (!confirm(`Are you sure you want to remove administrator ${admin.email}?`)) return;

    try {
      await api.removeAdmin(admin.id);
      setAdmins(admins.filter((a) => a.id !== admin.id));
      setFeedback({ type: 'success', text: `Administrator ${admin.email} deleted.` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-nexblue/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              PRIVILEGED ACCESS GOVERNANCE
            </span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">
            Platform Administrators & Role Delegation
          </h1>
          <p className="text-xs text-nexmuted">
            The Original Owner exercises master authority over all Super, Security, Module, and Audit administrators.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-nexblue hover:bg-nexblue/80 text-white font-mono text-xs font-bold flex items-center gap-2 transition-colors shadow-glow-blue"
          >
            <UserPlus className="w-4 h-4" /> Create Administrator
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs font-mono border flex items-center gap-2 ${
            feedback.type === 'error'
              ? 'bg-nexdanger/10 border-nexdanger text-nexdanger'
              : 'bg-nexgreen/10 border-nexgreen text-nexgreen'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Admins Table */}
      <div className="p-5 rounded-xl glass-panel overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-nexblue/20 text-nexmuted uppercase tracking-wider text-[11px]">
              <th className="pb-3">Administrator</th>
              <th className="pb-3">Role Hierarchy</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Security Score</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nexblue/10">
            {admins.map((adm) => (
              <tr key={adm.id} className="hover:bg-nexcardHover/50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-nexblue/20 flex items-center justify-center font-bold text-nexcyan text-xs">
                      {adm.fullName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white flex items-center gap-1">
                        {adm.fullName}
                        {adm.isOwner && <span className="text-amber-400 font-bold">👑 (Original Owner)</span>}
                      </p>
                      <p className="text-[10px] text-nexmuted">{adm.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      adm.isOwner
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : adm.role === 'SUPER_ADMIN'
                        ? 'bg-nexblue/20 text-nexcyan border border-nexblue/40'
                        : adm.role === 'SECURITY_ADMIN'
                        ? 'bg-nexdanger/20 text-nexdanger border border-nexdanger/40'
                        : adm.role === 'MODULE_ADMIN'
                        ? 'bg-nexcyan/20 text-nexcyan border border-nexcyan/40'
                        : 'bg-nexpurple/20 text-nexpurple border border-nexpurple/40'
                    }`}
                  >
                    {adm.role}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      adm.status === 'ACTIVE' ? 'text-nexgreen' : 'text-nexdanger'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'ACTIVE' ? 'bg-nexgreen' : 'bg-nexdanger'}`}></span>
                    {adm.status}
                  </span>
                </td>
                <td className="py-3">
                  <span className="text-nexgreen font-bold">{adm.securityScore || 95}%</span>
                </td>
                <td className="py-3 text-right">
                  {adm.isOwner ? (
                    <span className="text-[10px] font-mono text-amber-400 italic">Protected Master</span>
                  ) : isOwner ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(adm)}
                        className={`p-1.5 rounded hover:bg-nexbg border text-xs ${
                          adm.status === 'ACTIVE' ? 'border-nexwarning/40 text-nexwarning' : 'border-nexgreen/40 text-nexgreen'
                        }`}
                        title={adm.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveAdmin(adm)}
                        className="p-1.5 rounded hover:bg-nexbg border border-nexdanger/40 text-nexdanger"
                        title="Remove Administrator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-nexmuted">Owner Restricted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl glass-dropdown border border-nexblue/40 space-y-4">
            <h3 className="text-base font-bold text-white font-mono uppercase">
              Create New Administrator
            </h3>
            <p className="text-xs text-nexmuted">
              Assign role and privileges. The Owner retains permanent oversight.
            </p>

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-nexmuted uppercase">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-nexbg border border-nexblue/30 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-nexmuted uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-nexbg border border-nexblue/30 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-nexmuted uppercase">Temporary Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-nexbg border border-nexblue/30 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-nexmuted uppercase">Role Delegation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-nexbg border border-nexblue/30 text-xs text-white font-mono"
                >
                  <option value={ROLES.SUPER_ADMIN}>Super Admin (User & Module Ops)</option>
                  <option value={ROLES.SECURITY_ADMIN}>Security Admin (Alerts & SOC)</option>
                  <option value={ROLES.MODULE_ADMIN}>Module Admin (Config & Settings)</option>
                  <option value={ROLES.AUDITOR}>Auditor (Read-Only Logs)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-nexbg border border-nexblue/30 text-xs font-mono text-nexmuted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded bg-nexblue hover:bg-nexblue/80 text-white font-mono text-xs font-bold"
                >
                  {loading ? 'Creating...' : 'Grant Privileges'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
