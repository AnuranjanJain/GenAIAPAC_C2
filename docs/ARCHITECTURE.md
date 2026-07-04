# CivicMind AI Architecture

## Runtime Shape

CivicMind AI is currently a Vite + React + TypeScript web prototype. It runs fully locally and simulates Google Cloud services through typed adapter interfaces.

## Data Flow

1. Seed civic data is loaded from `src/data/demoData.ts`.
2. Analytics functions in `src/domain/analytics.ts` calculate ward risk, summary metrics, category counts, and trends.
3. The mock agent in `src/domain/agents.ts` orchestrates analyst, anomaly, RAG, recommendation, and report steps.
4. React views render dashboard, risk map, action queue, report, and agent console.

## Future Cloud Flow

```text
Cloud Storage / APIs / sensors
  -> Cloud Functions or Cloud Run jobs
  -> BigQuery feature tables
  -> ADK + Gemini agent service on Cloud Run
  -> RAG over SOPs and policy documents
  -> React UI and Looker dashboard
  -> human approval and action tracking
```

## Adapter Replacement Plan

- Replace `LocalBigQueryAnalyticsAdapter` with a backend API that runs BigQuery queries.
- Replace `LocalGeminiAgentAdapter` with an ADK/Gemini Cloud Run endpoint.
- Replace `LocalRagKnowledgeAdapter` with Vertex AI Vector Search or RAG Engine retrieval.
- Keep the UI contracts stable so dashboard and agent components do not need to know whether data is local or cloud-backed.

## Responsible AI Defaults

- AI recommendations are advisory, not automatic civic actions.
- The UI shows citations and confidence.
- PII is not required in the seeded dataset.
- Human approval remains visible in the action workflow.
