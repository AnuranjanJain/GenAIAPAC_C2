# CivicMind AI Architecture

## Submission Artifacts

- Live app: https://anuranjanjain.github.io/GenAIAPAC_C2/
- Demo video: `outputs/demo_video/CivicMind_AI_3min_Demo_Video.mp4`
- Animated preview: `outputs/demo_video/CivicMind_AI_Demo_Animated.gif`
- Submission deck: `outputs/CivicMind_AI_Prototype_Submission_Deck.pptx`
- Submission PDF: `outputs/CivicMind_AI_Prototype_Submission_Deck.pdf`

## Runtime Shape

CivicMind AI is currently a Vite + React + TypeScript web prototype. It runs fully locally and simulates Google Cloud services through typed adapter interfaces.

## Data Flow

1. Seed civic data is loaded from `src/data/demoData.ts`.
2. Analytics functions in `src/domain/analytics.ts` calculate ward risk, summary metrics, category counts, and trends.
3. The mock agent in `src/domain/agents.ts` orchestrates analyst, anomaly, RAG, recommendation, and report steps.
4. React views render dashboard, risk map, action queue, report, and agent console.

## Demo Dataset

The prototype includes 30 seeded local records across seven civic tables:

| Table | Records |
| --- | ---: |
| Citizen complaints | 7 |
| Traffic events | 4 |
| Waste collection | 4 |
| Utility events | 3 |
| Environment metrics | 5 |
| Recommended actions | 4 |
| SOP and policy documents | 3 |

The FAQ tab in the UI explains what the prototype is, how to use it, what changed in the redesign, and how much data is included.

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
