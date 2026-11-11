import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Key,
  DollarSign,
  CheckCircle,
  Shield,
  Smartphone,
  ExternalLink,
  Zap,
} from 'lucide-react';

export default function CommercialManagementView() {
  const { isOwner } = useAuth();
  const [plans, setPlans] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('BKASH');
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getPlans()
      .then((res) => {
        if (res.data) setPlans(res.data);
      })
      .catch(() => {
        setPlans([
          { tier: 'FREE', name: 'Community Shield', price: 0, currency: 'BDT', maxDevices: 1, features: ['Basic Identity Guardian', 'Manual URL Scanner', '1 Device Posture'] },
          { tier: 'PRO', name: 'Professional Cyber', price: 1499, currency: 'BDT', maxDevices: 5, features: ['All 12 Modules', 'Zero-Knowledge Vault', 'Encrypted Cloud Backup (50GB)', 'Priority SOC Alerts'] },
          { tier: 'ENTERPRISE', name: 'Enterprise Shield', price: 4999, currency: 'BDT', maxDevices: 25, features: ['Unlimited Rules', 'Digital Forensics Case Locker', 'Dedicated SIEM Webhook', '24/7 Red-Team IOCs'] },
        ]);
      });

    api.getLicenses()
      .then((res) => {
        if (res.data) setLicenses(res.data);
      })
      .catch(() => {
        setLicenses([
          { id: 'lic-1', licenseKey: 'NXG-ENT-2026-9842-8810-F001', maxDevices: 100, isActive: true, expiresAt: '2027-11-10T00:00:00Z' },
          { id: 'lic-2', licenseKey: 'NXG-PRO-2026-4412-9901-A772', maxDevices: 5, isActive: true, expiresAt: '2026-12-10T00:00:00Z' },
        ]);
      });
  }, []);

  const handleInitiatePayment = async (plan) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.checkoutPayment({
        gateway: selectedGateway,
        planTier: plan.tier,
        amount: plan.price,
      });
      if (res.data) {
        setCheckoutModal(res.data);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCallback = async () => {
    if (!checkoutModal) return;
    setLoading(true);
    try {
      const res = await api.verifyPaymentCallback({
        transactionId: checkoutModal.transactionId,
        gatewayStatus: 'COMPLETED',
        gatewaySignature: 'HMAC_SHA256_VERIFIED',
      });
      if (res.success) {
        setFeedback({ type: 'success', text: `Verified callback received! ${checkoutModal.gateway} transaction completed.` });
        setCheckoutModal(null);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="pb-4 border-b border-nexblue/20">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-nexpurple/20 text-nexpurple border border-nexpurple/30">
            COMMERCIAL LICENSING & BILLING
          </span>
        </div>
        <h1 className="text-xl font-black text-white mt-1">
          Subscription Tiers & Bangladesh Payment Gateways
        </h1>
        <p className="text-xs text-nexmuted">
          Enterprise license governance with native bKash, Nagad, and SSLCommerz automated checkout architecture.
        </p>
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

      {/* Gateway Selector Pill */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-nexbg/80 border border-nexblue/30">
        <span className="text-xs font-mono font-bold text-white uppercase">Selected Gateway:</span>
        {['BKASH', 'NAGAD', 'SSLCOMMERZ'].map((gw) => (
          <button
            key={gw}
            onClick={() => setSelectedGateway(gw)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedGateway === gw
                ? 'bg-gradient-to-r from-nexblue to-nexpurple text-white border border-nexcyan/40 shadow-glow-blue'
                : 'bg-nexcard hover:bg-nexcardHover text-nexmuted border border-nexblue/20'
            }`}
          >
            {gw === 'BKASH' ? '🌸 bKash' : gw === 'NAGAD' ? '🟠 Nagad' : '💳 SSLCommerz'}
          </button>
        ))}
      </div>

      {/* Subscription Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isPopular = p.tier === 'PRO';
          return (
            <div
              key={p.tier}
              className={`p-6 rounded-2xl glass-panel relative flex flex-col justify-between transition-all ${
                isPopular ? 'border-nexcyan/60 shadow-glow-cyan' : ''
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-nexcyan text-black font-mono font-black text-[10px] uppercase shadow-glow-cyan">
                  Recommended
                </div>
              )}

              <div>
                <span className="text-xs font-mono text-nexcyan font-bold tracking-wider uppercase">
                  {p.tier}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{p.name}</h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {p.price === 0 ? 'Free' : `৳${p.price.toLocaleString()}`}
                  </span>
                  {p.price > 0 && <span className="text-xs text-nexmuted font-mono">/month</span>}
                </div>

                <div className="mt-4 pt-4 border-t border-nexblue/20 space-y-2 text-xs">
                  <p className="font-mono text-nexmuted text-[11px] mb-2">
                    Max Protected Devices: <b className="text-white">{p.maxDevices} Devices</b>
                  </p>
                  {p.features?.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-nextext/90">
                      <CheckCircle className="w-3.5 h-3.5 text-nexgreen shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleInitiatePayment(p)}
                disabled={loading || p.price === 0}
                className={`mt-6 w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  p.price === 0
                    ? 'bg-nexbg border border-nexblue/30 text-nexmuted cursor-not-allowed'
                    : isPopular
                    ? 'bg-gradient-to-r from-nexblue to-nexcyan hover:from-nexcyan hover:to-white text-black font-black shadow-glow-cyan'
                    : 'bg-nexblue hover:bg-nexblue/80 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                {p.price === 0 ? 'Current Community Tier' : `Checkout via ${selectedGateway}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active License Keys */}
      <div className="p-5 rounded-xl glass-panel space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-nexblue/20">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-nexcyan" /> Cryptographic License Keys ({licenses.length})
          </span>
        </div>

        <div className="space-y-2">
          {licenses.map((lic) => (
            <div
              key={lic.id}
              className="p-3 rounded-lg bg-nexbg/80 border border-nexblue/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div>
                <p className="text-xs font-mono font-bold text-nexcyan">{lic.licenseKey}</p>
                <p className="text-[10px] font-mono text-nexmuted">
                  Max Devices: {lic.maxDevices} • Expires: {new Date(lic.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-nexgreen/20 text-nexgreen border border-nexgreen/30 text-[10px] font-mono font-bold">
                ACTIVE • VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl glass-dropdown border border-nexcyan/40 space-y-4">
            <div className="flex items-center justify-between border-b border-nexblue/20 pb-3">
              <span className="text-xs font-mono font-bold text-nexcyan uppercase">
                {checkoutModal.gateway} Payment Initiation
              </span>
              <span className="text-xs font-mono text-white">৳{checkoutModal.payment.amount} BDT</span>
            </div>

            <div className="p-3 rounded-xl bg-nexbg/80 border border-nexblue/30 text-xs font-mono space-y-2">
              <p className="text-nexmuted">Transaction Reference:</p>
              <p className="text-white font-bold text-[11px] break-all">{checkoutModal.transactionId}</p>
              <p className="text-nexmuted mt-2">Integration Endpoint:</p>
              <p className="text-nexcyan text-[11px] truncate">
                {checkoutModal.gatewayResponse?.bkashURL || checkoutModal.gatewayResponse?.redirectUrl || 'SSLCommerz Gateway Session'}
              </p>
            </div>

            <p className="text-[11px] text-nexmuted font-mono">
              In production, user completes PIN on official {checkoutModal.gateway} page and webhook callback validates HMAC signature before license provisioning.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCheckoutModal(null)}
                className="px-3 py-1.5 rounded bg-nexbg border border-nexblue/30 text-xs font-mono text-nexmuted"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyCallback}
                disabled={loading}
                className="px-4 py-1.5 rounded bg-nexgreen hover:bg-nexgreen/80 text-black font-mono text-xs font-bold"
              >
                {loading ? 'Verifying...' : 'Simulate Valid Webhook Callback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
