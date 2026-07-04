# CivicMind AI

CivicMind AI is a cloud-ready prototype for the Gen AI Academy APAC problem statement **AI for Better Living and Smarter Communities**. It shows a smart-city decision intelligence platform that combines a WDYD-style civic dashboard with an AiOS-style agent command panel.

The app is demo-ready without Google Cloud credentials. It uses local seeded civic data and deterministic mock agents, while keeping adapter boundaries for BigQuery, Gemini, ADK, RAG, Cloud Run, and Looker.

## Demo Story

Heavy rain causes waste overflow and waterlogging in Ward 11. CivicMind AI:

- ranks Ward 11 as the highest-risk ward
- explains the drivers using complaint, waste, traffic, utility, and rainfall signals
- cites mock BigQuery features and SOP snippets
- recommends extra waste pickup, drain inspection, and citizen advisory
- keeps human approval as the final decision gate

Use this question in the agent panel:

```text
Which ward needs urgent attention today?
```

## Run Locally

```bash
npm install
npm run dev
```

Build and test:

```bash
npm run test
npm run build
```

## Prototype Surfaces

- **Operations Dashboard**: community health, open alerts, response time, high-risk ward, charts, and priority actions.
- **Agent Command Panel**: ADK-style coordinator with analysis steps, citations, confidence, and recommendations.
- **Risk Map**: ward-level heatmap using joined civic signals.
- **Recommendations Queue**: owner, ETA, severity, evidence, and approval state.
- **Reports**: generated daily civic brief for stakeholders.

## Google Cloud Mapping

| Prototype layer | Google Cloud target |
| --- | --- |
| Seeded civic data | Cloud Storage raw data lake |
| Local analytics adapter | BigQuery tables, SQL, feature views |
| Mock agent orchestration | Gemini Enterprise Agent Platform / ADK |
| Local SOP snippets | Vertex AI Vector Search / RAG corpus |
| React web app | Cloud Run hosted frontend/API |
| Dashboard panels | Looker or Looker Studio |
| Mock health boundary | Cloud Run health endpoint |
| Local config | IAM, Secret Manager, Cloud Logging, Monitoring |

## Cloud-Ready Adapter Boundaries

- `src/services/analyticsAdapter.ts`: BigQuery-ready analytics interface.
- `src/services/agentAdapter.ts`: Gemini/ADK-ready question-answer interface.
- `src/services/ragAdapter.ts`: SOP/policy retrieval interface.
- `src/services/cloudRunApiAdapter.ts`: future Cloud Run API boundary.

The first implementation uses local adapters so the demo works offline. The interfaces are intentionally narrow so a later Cloud Run backend can replace the local implementations without redesigning the UI.

## Supporting Submission Artifacts

The workspace also contains the prototype submission deck and PDF under `outputs/`.
