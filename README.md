# 🛡️ NEXGUARD 12 — Web Dashboard & Anti-Theft Owner Console

### 12-in-1 AI-Powered Enterprise Cybersecurity Ecosystem
**DETECT. PREVENT. PROTECT.**

Official Web Control Center for the **NEXGUARD 12** Cybersecurity Platform. Provides the **Original Owner** with sovereign, immutable command over all connected Android endpoints, emergency anti-theft lockdowns, 12 cybersecurity shield modules, user roles, billing, and live SOC event streams.

---

## ⚡ Key Highlights

* **👑 Sovereign Owner Control**: Immutable master authority (`owner@nexguard.cyber`) protected against admin demotion, suspension, or deletion.
* **🚨 Anti-Theft Emergency Security Center**:
  - Live hardware telemetry (Knox Attestation, Battery %, Network, OS, Connection Status).
  - One-click **Emergency Remote Lockdown**: Revoke JWT refresh tokens, invalidate sessions, seal zero-knowledge vaults, and trigger Knox hardware locks.
  - Tactical Dark OpenStreetMap device location tracker with accuracy radii and compliance logs.
  - 10 Offline Emergency Recovery Backup Codes (`NXG-EMRG-XXXX-XXXX`).
  - Secondary offline recovery email channel.
* **🛡️ 12 Integrated Security Shield Modules**:
  1. Identity Guardian (MFA, Passkeys, Keystore)
  2. Phishing Shield (URL scanner, Punycode detection)
  3. Endpoint Guardian (Hardware attestation & posture)
  4. Network Sentinel (Wi-Fi security & rogue AP alerts)
  5. Vault Guardian (Zero-knowledge AES-256 encrypted passwords)
  6. Ransomware Guardian (FIM canary & rollback defense)
  7. WebShield (TLS & HTTP security header audit)
  8. Digital Forensics (SHA-256 evidence chain of custody)
  9. Access Guardian (Zero-trust session revocation)
  10. Threat Intelligence (Real-time IOC lookup)
  11. Cloud Backup Guardian (Encrypted snapshot recovery)
  12. Cyber SOC (Real-time incident response & threat map)
* **🎨 Futuristic Cybersecurity UI/UX**:
  - Deep Navy & Onyx palette (`#050B1A`, `#0A1428`)
  - Neon Cyan (`#00E5FF`), Electric Blue (`#087BFF`), Purple gradients (`#873BFF`)
  - Glassmorphic panels, animated security gauges, and responsive mobile-first layouts.

---

## 🛠️ Tech Stack

* **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Styling**: [TailwindCSS 3](https://tailwindcss.com/) with custom Cyberpunk / Enterprise Theme
* **Icons**: [Lucide React](https://lucide.dev/)
* **Mapping**: Tactical OpenStreetMap with dark security invert filters
* **State & Auth**: Context API with seamless offline fallback modes and role-switching preview

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) v18+ 
* npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/rabeyakterlima-design/nexguard-12-website.git
cd nexguard-12-website

# Install dependencies
npm install

# Start the development server
npm run dev
```

The web dashboard will be accessible at `http://localhost:5173`.

### Environment Variables (Optional)

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```
*(If no backend is running, the dashboard automatically operates in resilient offline preview mode).*

---

## 📦 Build for Production

```bash
# Create optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Deployable to [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), [Cloudflare Pages](https://pages.cloudflare.com/), or any static hosting service in seconds.

---

## 📄 License & Ownership
Copyright © 2026 NEXGUARD 12. All rights reserved.  
Confidential and Proprietary to the Original Application Owner.
