# SMART RELIEF — Disaster Intelligence & Smart Relocation Command Center

> **SIH 2026 Problem Statement ID: 26191**  
> **Title**: *"Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations"*  
> **Organization**: Ministry of Home Affairs  
> **Department**: National Disaster Response Force (NDRF), DM Division  
> **Category**: Software • **Theme**: Disaster Management

---

## 1. Project Overview & Mission

**SMART RELIEF** is an intelligent disaster-management platform that identifies hazard-based red zones, assesses vulnerable habitations, prioritizes immediate relocation, evaluates the carrying capacity of safe locations, and recommends suitable relocation destinations through an integrated GIS and AI-driven command center.

The application adheres strictly to the operational workflow:
$$\text{DETECT} \longrightarrow \text{ASSESS} \longrightarrow \text{PRIORITIZE} \longrightarrow \text{FIND SAFE LOCATION} \longrightarrow \text{OPTIMIZE RELOCATION} \longrightarrow \text{MONITOR}$$

---

## 2. Key Features

- **Disaster Intelligence Command Center (`/dashboard`)**:
  - 6 Key mission metrics: High-Risk Habitations (128), Population at Risk (48,620), Immediate Relocation Cases (37), Safe Capacity (62,400), Available Safe Sites (84), Active Alerts (16).
  - Hazard distribution donut chart & relocation priority bar chart.
  - Critical Habitations triage table and real-time incident feeds.
  - End-to-end system architecture pipeline visual.
- **Interactive GIS Risk Map (`/dashboard/map`)**:
  - Leaflet-powered GIS engine with WGS 84 / EPSG:4326 projection.
  - Multi-layer toggle: 🔴 Red Zones, 🟠 High Risk, 🟡 Medium Risk, 🟢 Safe, 🏘 Habitations, 🏠 Candidate Safe Relocation Sites, 🌊 Rivers, 🛣 Arterial Roads, 🏥 Hospitals, 🏫 Schools.
  - Search and filter by hazard tier, population range, and relocation priority.
  - Interactive map markers with immediate deep-link navigation.
- **Vulnerable Habitations Registry & Dossier (`/dashboard/habitations` & `[id]`)**:
  - Searchable, sortable, paginated registry of habitations with status badges.
  - Detailed dossier with flood analysis (7 features), landslide analysis (8 features), multi-factor vulnerability radar chart, relocation urgency score (94/100).
  - **AI Relocation Recommendation Engine**: Evaluates candidate safe sites, carrying capacity buffers, healthcare proximity, road connectivity, and provides an explainable **"WHY THIS LOCATION?"** checklist.
- **Safe Relocation Sites & Carrying Capacity (`/dashboard/safe-sites` & `/dashboard/capacity`)**:
  - Full inventory of low-hazard relocation sites with capacity meters and infrastructure readiness matrix (water, road, hospital, school, power).
  - Regional carrying capacity assessment (62,400 total, 18,240 occupied, 44,160 available) broken down across 5 hilly districts.
- **Relocation Management (`/dashboard/relocation`)**:
  - Operational lifecycle tracking: Pending $\rightarrow$ Approved $\rightarrow$ In Progress $\rightarrow$ Completed.
  - Interactive status dispatch modal for field incident commanders.
- **Authority Action Center (`/dashboard/actions`)**:
  - Action-first triage answering: *"What operational decisions must authorities execute first?"* (Immediate Action, High Priority, Active Monitoring).
- **Incident Alerts (`/dashboard/alerts`)**:
  - Real-time operational incident feed categorized by severity and trigger classification.
- **Analytics (`/dashboard/analytics`)**:
  - Multi-hazard time-series trends (flood vs landslide risk curves against rainfall intensity) and population risk curves.
- **Global Search (`⌘K`)**:
  - Instant multi-entity lookup across habitations, safe sites, and relocation cases.

---

## 3. Technology Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom disaster-command color tokens
- **GIS Mapping**: Leaflet & React-Leaflet (Dynamic client-side rendering)
- **Data Visualization**: Recharts
- **State & Server Fetching**: TanStack React Query (`@tanstack/react-query`)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Backend API**: FastAPI, Scikit-learn, Joblib, Pandas

---

## 4. Dual Operation Modes: DEMO vs LIVE

To ensure 100% offline resilience during hackathon judging and live demonstrations:
- **`NEXT_PUBLIC_USE_MOCK_DATA=true` (Default)**:
  - Uses high-fidelity synthetic telemetry in `lib/mock/` with 25+ realistic Karnataka Western Ghats habitations (HAB-1021 Village A, etc.) and 18+ safe sites (SAFE-204 Safe Zone B).
  - Topbar clearly renders `● DEMO DATA` to maintain complete technical transparency.
- **`NEXT_PUBLIC_USE_MOCK_DATA=false`**:
  - Directly dispatches live HTTP queries to the FastAPI backend at `NEXT_PUBLIC_API_URL`.
  - Topbar indicates `● LIVE BACKEND`.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js 18+ or 20+
- Python 3.10+ (for backend)

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Run Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup (Optional for Live API Mode)
```bash
cd backend

# Run existing verified ML model tests
python3 -m pytest tests/test_hazard.py

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 6. Authentication Architecture

For demonstration ease, mock authentication is fully implemented and abstracted in `lib/auth/`:
- **Default Officer**: Capt. A. K. Verma (`command.officer@ndrf.gov.in`) — Disaster Management Officer
- **Field Commander**: Dr. Meenakshi Rao (`field.incident@dm.karnataka.gov.in`) — Incident Commander
- 1-Click quick sign-in buttons are provided on `/login`.
- All `/dashboard/*` routes are protected with route guards.

---

## 7. Folder Architecture

```text
frontend/
├── app/
│   ├── login/page.tsx               # Command center sign-in
│   ├── dashboard/
│   │   ├── layout.tsx               # Protected dashboard shell
│   │   ├── page.tsx                 # Command center overview
│   │   ├── map/page.tsx             # Interactive Leaflet GIS map
│   │   ├── habitations/page.tsx     # Vulnerable habitations registry
│   │   ├── habitations/[id]/page.tsx# Habitation dossier & AI recommendation
│   │   ├── safe-sites/page.tsx      # Safe sites directory
│   │   ├── safe-sites/[id]/page.tsx # Safe site detail & capacity meter
│   │   ├── relocation/page.tsx      # Relocation operations management
│   │   ├── capacity/page.tsx        # Carrying capacity assessment
│   │   ├── analytics/page.tsx       # Disaster analytics & risk trends
│   │   ├── alerts/page.tsx          # Real-time operational incident feed
│   │   ├── actions/page.tsx         # Authority Action Center
│   │   └── settings/page.tsx        # System preferences & API switcher
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/                      # Topbar, Sidebar, MobileNav, GlobalSearch
│   ├── dashboard/                   # Stat cards, charts, critical table, pipeline
│   ├── map/                         # Dynamic Leaflet wrapper, markers, legend
│   └── shared/                      # Status badges, skeletons, demo indicator
├── lib/
│   ├── api/                         # Centralized fetch client, adapters, services
│   ├── auth/                        # Auth context, session management, types
│   ├── constants/                   # Centralized hazard levels, navigation config
│   ├── mock/                        # High-fidelity synthetic datasets
│   └── utils/                       # Formatting, tailwind merger
├── hooks/                           # TanStack Query custom hooks
├── types/                           # Strict TypeScript interfaces
├── .env.local.example
└── README.md
```
