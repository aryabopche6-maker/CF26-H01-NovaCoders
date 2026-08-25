# FederateHealth — Federated Healthcare Analytics & Clinical Query Platform

> **Hackathon Prototype** — Uses synthetic healthcare data and simulated local hospital databases. Raw patient-level data is **never** centralized or exposed to the central platform.

---

## 🏛️ Architecture & System Overview

FederateHealth enables cross-institution clinical analytics across distributed hospital nodes without moving or centralizing raw electronic health records (EHR).

```
Researcher Prompt / Query
        │
        ▼
Natural Language / Structured Logical Query
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                 1. QUERY FIREWALL 🛡️                    │
│  - Authorization & Scope Verification                   │
│  - Specificity & Re-identification Risk Analysis        │
│  - Risk Classification: LOW | MEDIUM | HIGH | CRITICAL  │
│  - Decision: ALLOW | REQUIRE_APPROVAL | BLOCK           │
└─────────────────────────────────────────────────────────┘
        │ (If Allowed / Approved)
        ▼
┌─────────────────────────────────────────────────────────┐
│     2. DIFFERENTIAL PRIVACY & EPSILON BUDGET ENGINE 🧮  │
│  - Laplace Noise Injection for Aggregate Counts         │
│  - Prototype Privacy Budget (ε = 10.0 initial, Δε = 0.5)│
│  - Minimum Cohort Suppression (k = 10)                  │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│         3. RISK-BASED APPROVAL WORKFLOW 📋              │
│  - LOW RISK        → Auto-Approved                       │
│  - MEDIUM RISK     → Requires Institution Admin Approval│
│  - HIGH/CRITICAL   → Requires Platform Admin Approval   │
│  - Anti-Self Approval Enforcement (Backend 403)         │
└─────────────────────────────────────────────────────────┘
        │ (If Approved / Auto-Approved)
        ▼
┌─────────────────────────────────────────────────────────┐
│     4. INSTITUTION PARTICIPATION CONTROL 🏢             │
│  - Check Status: ACTIVE | PAUSED | SUSPENDED            │
│  - PAUSED/SUSPENDED nodes skipped automatically         │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│         5. DYNAMIC SCHEMA TRANSLATION 🔄                │
│  - Canonical Logical Schema Mapping (patient_age, etc.) │
│  - Per-Institution Field Translation & Confidence %     │
│  - Safety Guard: Skip/Warn Unmapped Fields              │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│               FEDERATED LOCAL EXECUTION                 │
│  - Hospital A (MySQL) | Hospital B (PgSQL) | Hosp C ... │
│  - Aggregate COUNT Computation                          │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│ 6. PARTIAL RESULT INTELLIGENCE + CONFIDENCE ENGINE      │
│  - Node Participation Breakdown (Active/Paused/Offline) │
│  - Explainable Trust/Confidence Score (0-100)           │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│        7. MERKLE AUDIT LEDGER & PROVENANCE ⛓️            │
│  - Tamper-Evident Merkle Tree Root Hash Chain           │
│  - Complete Audit Trail Log                             │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│               8. CLINICAL QUERY PASSPORT 🛂             │
│  - Query-Result Trust Certificate                       │
│  - Verifications (Auth, Privacy, Integrity, Merkle)     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features & Core Innovations

1. **🛡️ Query Firewall**: Pre-execution privacy classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). Re-identification risk detection for narrow age/demographic + rare condition criteria. Enforced on the backend (HTTP 403 on block).
2. **📋 Risk-Based Approval Workflow**: Multi-tier routing (`LOW` auto-approved, `MEDIUM` to Institution Admin, `HIGH`/`CRITICAL` to Platform Admin). Enforces anti-self-approval rule (requester cannot approve own query).
3. **🏢 Institution Federation Participation Control**: Institution Admins manage hospital status (`ACTIVE`, `PAUSED`, `SUSPENDED`). Paused/Suspended hospitals are automatically skipped during query execution and reflected in partial results.
4. **🔄 Dynamic Schema Translation**: Canonical fields (`patient_age`, `condition`, `treatment`) translated to local column names (e.g. `patients.patient_age`, `clinical_cohort.age_years`, `patient_master.patient_age`). Unmapped fields are safely skipped (`⚠ QUERY CANNOT BE SENT TO HOSPITAL D`).
5. **🧮 Differential Privacy & Epsilon Budget**: Enforces $k=10$ minimum cohort suppression. Injects Laplace noise into aggregate counts. Tracks prototype researcher privacy budget ($\epsilon = 10.0$ initial, $\Delta\epsilon = 0.5$ per query) and blocks queries when budget is depleted.
6. **📊 Partial Result + Confidence Engine**: Computes an explainable score (0–100) based on Authorization (20), Privacy (20), Coverage (30), Freshness (15), Schema (10), and Provenance (5). Shows `⚠ PARTIAL RESULT` whenever nodes fail or are paused.
7. **⛓️ Merkle Audit Ledger**: Hashes audit events into a tamper-evident Merkle tree hash chain for cryptographic audit log integrity.
8. **🛂 Clinical Query Passport**: Generates a downloadable Query-Result Trust Certificate with trust metrics, verification checklist, Merkle root, and execution metadata.

---

## 👥 User Roles & RBAC Matrix

| Role | Permissions |
|---|---|
| **`PLATFORM_ADMIN`** | Platform management, high/critical query approvals, federation security overview, audit logs. |
| **`INSTITUTION_ADMIN`** | Hospital participation toggle (ACTIVE/PAUSED/SUSPENDED), medium-risk approvals, schema mapping. |
| **`RESEARCHER`** | Create & run clinical queries, view query history, view Clinical Query Passport, track privacy budget ($\epsilon$). Cannot approve own queries. |
| **`AUDITOR`** | Read-only access to audit logs, cryptographic provenance, query lifecycles, and compliance reports. |

---

## 🛠️ Setup & Execution Instructions

### Prerequisites
- Docker Desktop
- Java 21 JDK
- Maven 3.9+
- Node.js 18+

### 1. Start Database Containers
```bash
cd backend
docker-compose up -d
```

### 2. Build & Run Spring Boot Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/federate-health-backend-1.0.0.jar
```
*Backend runs on `http://localhost:8080`*

### 3. Build & Run React Frontend
```bash
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Seed User Login Credentials

| Role | Email | Password |
|---|---|---|
| **Platform Admin** | `admin@federatehealth.com` | `admin123` |
| `RESEARCHER` | `researcher@federatehealth.com` | `research123` |
| `INSTITUTION_ADMIN` | `instadmin@hospital-a.com` | `instadmin123` |
| `AUDITOR` | `auditor@federatehealth.com` | `auditor123` |

---

## 📡 REST API Reference

- `POST /api/auth/login` — Authenticate & obtain JWT
- `POST /api/queries/execute` — Submit & execute federated query (Firewall + Privacy Budget applied)
- `GET /api/queries/history` — Fetch user query execution history
- `GET /api/queries/{id}` — Fetch detailed query telemetry
- `GET /api/institutions` — List all participating hospital nodes
- `PUT /api/institutions/{id}/participation` — Update hospital participation status (`ACTIVE`, `PAUSED`, `SUSPENDED`)
- `GET /api/approvals` — Get pending approval requests for user role
- `POST /api/approvals/{id}/process` — Approve or reject pending query
- `GET /api/audit-logs` — Fetch Merkle-verified audit events
- `GET /api/schema-mappings` — View canonical schema translation matrix

---

## 🎬 Hackathon Demo Scenarios

1. **Scenario 1: Safe Query (LOW Risk)**: "How many diabetes patients are above 50?" → Firewall ALLOWs → Auto-approved → Executed across 3 nodes → Passport generated.
2. **Scenario 2: Medium-Risk Approval Workflow**: "Female hypertension patients on statins aged 45-65" → Firewall flags MEDIUM risk → Approval queue -> Institution Admin approves -> Executed.
3. **Scenario 3: Critical Specificity Block**: "Find patients aged 87 with rare ALS diagnosis in specific village" → Firewall detects re-identification risk → Query BLOCKED with 🚨 alert.
4. **Scenario 4: Paused Institution & Partial Result**: Toggle Hospital B to `PAUSED` → Run query → Hospital B skipped → Coverage 66% → `⚠ PARTIAL RESULT` banner shown.
