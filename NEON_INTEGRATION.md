# NEON SERVERLESS POSTGRESQL PRODUCTION DATABASE

The enterprise production PostgreSQL database for NEXGUARD 12 / SIS CYBER FORTRESS is powered by **Neon Serverless PostgreSQL**:

- **Project ID**: `shy-king-95419307`
- **Region**: AWS Asia Pacific 1 (Singapore, `ap-southeast-1`)
- **Compute**: Primary (Autoscaling 0.25 to 2 CU)
- **Branch**: `production`
- **Engine**: PostgreSQL 16 (Serverless)
- **Status**: ACTIVE & 100% IN SYNC

## Connection Endpoints
- **Pooled URL (App Runtime / High Concurrency)**:
  ```text
  postgresql://neondb_owner:npg_MaLP0SGr9NyH@ep-quiet-wildflower-b3xsesir-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```
- **Direct / Unpooled URL (Prisma Migrations & Admin)**:
  ```text
  postgresql://neondb_owner:npg_MaLP0SGr9NyH@ep-quiet-wildflower-b3xsesir.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```

## Deployed Schemas & Live Records
- `users`: Sovereign Master Owner (`Rabeya Akter Lima` - `owner@nexguard.cyber`, score: 98%)
- `devices`: `Samsung Galaxy A15 5G (SM-A156E)` - `COMPLIANT`, Knox 0x0 PASSED
- `security_alerts`: Active port scan threat + historical alerts
- `threat_iocs`: Phishing domains & malicious IPs
- `vault_secrets`: AES-256-GCM encrypted keystore
- `audit_logs`: Immutable security event timeline
