import type { CivicAction, CivicDocument, DemoDataset, WardRisk } from "./civic";
import { calculateCivicSummary, calculateWardRisks } from "./analytics";

export interface AgentStep {
  agent: string;
  status: "complete" | "running" | "queued";
  detail: string;
}

export interface AgentCitation {
  source: string;
  detail: string;
}

export interface AgentResponse {
  question: string;
  answer: string;
  confidence: number;
  steps: AgentStep[];
  citations: AgentCitation[];
  recommendedActions: CivicAction[];
  focusWard: WardRisk;
  generatedAt: string;
}

const findRelevantDocs = (documents: CivicDocument[]) =>
  documents.filter((document) => document.tags.some((tag) => ["waste", "waterlogging", "drain", "Ward 11", "traffic"].includes(tag)));

export const runCivicAgent = (dataset: DemoDataset, question: string): AgentResponse => {
  const risks = calculateWardRisks(dataset);
  const summary = calculateCivicSummary(dataset);
  const focusWard = risks[0];
  const actions = dataset.actions.filter((action) => action.ward === focusWard.ward && action.status !== "resolved");
  const docs = findRelevantDocs(dataset.documents);

  return {
    question,
    answer:
      `${focusWard.ward} needs the most urgent attention today. Risk is ${focusWard.riskScore}/100 because ${focusWard.primaryDrivers.join(", ")} are converging. ` +
      `Waste complaints are up ${summary.complaintDeltaPercent}% and waterlogging signals are up ${summary.waterloggingDeltaPercent}%. ` +
      "Recommended next step: dispatch extra waste pickup, inspect storm drains, and send a citizen advisory before evening traffic.",
    confidence: 0.89,
    focusWard,
    recommendedActions: actions,
    citations: [
      { source: "BigQuery mock: ward_risk_features", detail: `${focusWard.ward} ranked highest with ${focusWard.openComplaints} open complaints and ${focusWard.recommendedActionCount} open actions.` },
      ...docs.slice(0, 3).map((doc) => ({ source: doc.title, detail: doc.excerpt }))
    ],
    steps: [
      { agent: "Coordinator Agent", status: "complete", detail: "Routed request to analytics, anomaly, RAG, and recommendation agents." },
      { agent: "City Analyst Agent", status: "complete", detail: "Queried ward-level complaint, waste, traffic, utility, and rainfall metrics." },
      { agent: "Anomaly Agent", status: "complete", detail: "Detected waste and waterlogging spikes in Ward 11." },
      { agent: "Policy/RAG Agent", status: "complete", detail: "Grounded response in drain, overflow, and citizen advisory SOP snippets." },
      { agent: "Recommendation Agent", status: "complete", detail: "Ranked actions by severity, ETA, affected users, and operational impact." }
    ],
    generatedAt: new Date("2026-07-05T10:45:00+05:30").toISOString()
  };
};
