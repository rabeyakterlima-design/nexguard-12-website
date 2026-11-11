# NEXGUARD 12 / SIS CYBER FORTRESS — WEB & APP DATABASE INTEGRATION ARCHITECTURE

## Executive Overview
The **NEXGUARD 12** ecosystem connects the **Android Mobile App** and the **Owner Web Dashboard** through a centralized, high-speed **Neon Serverless PostgreSQL Database** powered by a unified **NestJS Backend API**.

```
+-----------------------------+                  +-----------------------------+
|    ANDROID MOBILE APP       |                  |     OWNER WEB DASHBOARD     |
|   (Samsung Galaxy A15 5G)   |                  |    (Chrome / Vercel SPA)    |
+-----------------------------+                  +-----------------------------+
              |                                                 |
              | 1. Reports Hardware Telemetry                   | 2. Queries Live Posture
              |    (Battery, Knox, GPS, Alerts)                 |    (98% Score, Active Threats)
              v                                                 v
+-------------------------------------------------------------------------------+
|                    CENTRAL NESTJS BACKEND API (:5000)                         |
|             (Controllers: Auth, Emergency, CyberModules, SOC, Owner)           |
+-------------------------------------------------------------------------------+
                                      |
                                      | Prisma ORM (Pooled & Direct Connection)
                                      v
+-------------------------------------------------------------------------------+
|                 NEON SERVERLESS POSTGRESQL PRODUCTION DATABASE                |
|        Host: ep-quiet-wildflower-b3xsesir.c-4.ap-southeast-1.aws.neon.tech    |
|                                                                               |
|  - users                     -> Sovereign Owner Credentials & Passkeys        |
|  - devices                   -> Device ID, Model, Knox (0x0), Battery, State  |
|  - device_location_reports   -> Real-time Consented GPS Coordinates           |
|  - device_security_events    -> Hardware Attestation & Tamper Logs            |
|  - sessions                  -> Zero-Trust Active Tokens & Revocation         |
|  - security_alerts           -> 12 Cyber Modules Threat Interceptions         |
|  - threat_iocs               -> Phishing Domains & Malicious IPs              |
|  - vault_secrets             -> AES-256-GCM Encrypted Keystore                |
|  - audit_logs                -> Immutable Forensics Audit Trail               |
+-------------------------------------------------------------------------------+
```

---

## Real-Time Data Flow Scenarios

### Scenario A: Android Telemetry Sync -> Database -> Web Dashboard
1. The **Android App** reads device hardware via Android APIs (`BatteryManager`, `ConnectivityManager`, Knox attestation).
2. The app issues `POST /api/emergency/devices/sync` to the central backend.
3. The backend saves the record directly into the `devices` table in **Neon PostgreSQL**.
4. The **Web Dashboard** fetches `GET /api/emergency/devices` and displays the device's live battery, Knox status, and coordinates on the interactive threat map.

### Scenario B: Emergency Anti-Theft Lockdown from Web Dashboard
1. The Owner opens the **Owner Web Dashboard** from any browser.
2. The Owner clicks **"MARK MY PHONE AS STOLEN"** / **"REVOKE ALL SESSIONS"**.
3. The Web Dashboard issues `POST /api/emergency/devices/:id/mark-stolen`.
4. The backend updates the device in **Neon PostgreSQL**:
   - `status = "STOLEN"`
   - `isLocked = true`
   - An immutable record is created in `audit_logs` (`EMERGENCY_DEVICE_MARKED_STOLEN`).
5. When the **Android App** syncs or checks in:
   - It receives `isStolenOrLocked = true`.
   - The app immediately purges local auth tokens, locks down the local encrypted keystore, and displays the emergency lockdown lockout screen.

---

## Verified Endpoints & Database Schemas
| Action | Endpoint | Database Table Affected |
| :--- | :--- | :--- |
| **Device Registration & Telemetry** | `POST /api/emergency/devices/sync` | `devices`, `device_location_reports` |
| **Get All Registered Devices** | `GET /api/emergency/devices` | `devices` |
| **Mark Device as Stolen** | `POST /api/emergency/devices/:id/mark-stolen` | `devices`, `audit_logs` |
| **Revoke Active Sessions** | `POST /api/emergency/devices/:id/revoke-sessions` | `sessions`, `audit_logs` |
| **Restore Device to Compliant** | `POST /api/emergency/devices/:id/restore` | `devices`, `audit_logs` |
| **Toggle Location Tracking** | `POST /api/emergency/devices/:id/toggle-location-reporting` | `devices` |
| **SOC Threat Alerts** | `GET /api/emergency/alerts` | `security_alerts` |
