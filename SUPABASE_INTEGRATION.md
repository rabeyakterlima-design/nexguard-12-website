# SUPABASE PRODUCTION DATABASE CONFIGURATION

The production PostgreSQL database for NEXGUARD 12 / SIS CYBER FORTRESS is hosted on Supabase:

- **Project ID**: `mwbyboraywlegsvlmlfa`
- **Region**: South Asia (Mumbai, `ap-south-1`)
- **Connection Host**: `aws-0-ap-south-1.pooler.supabase.com`
- **Database Engine**: PostgreSQL 16
- **Status**: ACTIVE & SEEDED

## Connection Strings
- **Session Pooler (Port 5432)**:
  ```text
  postgresql://postgres.mwbyboraywlegsvlmlfa:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
  ```
- **Transaction Pooler (Port 6543)**:
  ```text
  postgresql://postgres.mwbyboraywlegsvlmlfa:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

## Deployed Schemas & Tables
1. `users` (Sovereign Owner & platform authentication)
2. `devices` (Registered endpoints, Knox status, battery, location)
3. `device_location_reports` (Consented GPS breadcrumbs)
4. `device_security_events` (Hardware tampering & integrity logs)
5. `sessions` (Zero-trust active tokens & remote revocation)
6. `security_alerts` (SOC alerts across 12 modules)
7. `threat_iocs` (Malicious IP/domain/hash threat intelligence)
8. `vault_secrets` (AES-256-GCM encrypted keystore)
9. `forensic_cases` (Digital evidence & SHA-256 seals)
10. `backup_codes` (Emergency offline cryptographic tokens)
11. `audit_logs` (Immutable system trails)
