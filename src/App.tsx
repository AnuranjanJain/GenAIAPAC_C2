import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cloud,
  Database,
  FileText,
  Gauge,
  HelpCircle,
  Map,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { demoDataset } from "./data/demoData";
import { calculateCivicSummary, calculateWardRisks, trendSeries } from "./domain/analytics";
import { runCivicAgent, type AgentResponse } from "./domain/agents";
import type { CivicAction, Severity, WardRisk } from "./domain/civic";

type ViewKey = "dashboard" | "risk" | "actions" | "reports" | "faq";

const severityLabel: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical"
};

const severityClass: Record<Severity, string> = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical"
};

const navItems: Array<{ key: ViewKey; label: string; icon: typeof Gauge }> = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  { key: "risk", label: "Risk Map", icon: Map },
  { key: "actions", label: "Actions", icon: ClipboardList },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "faq", label: "FAQ", icon: HelpCircle }
];

const serviceStack = [
  { label: "Cloud Storage", icon: Cloud, detail: "Raw data lake" },
  { label: "BigQuery", icon: Database, detail: "Decision warehouse" },
  { label: "Gemini + ADK", icon: Bot, detail: "Agent reasoning" },
  { label: "Cloud Run", icon: RadioTower, detail: "App deployment" },
  { label: "Looker", icon: BarChart3, detail: "Ops dashboard" },
  { label: "IAM + Logs", icon: ShieldCheck, detail: "Governance" }
];

const askTemplate = "Which ward needs urgent attention today?";

const faqItems = [
  {
    question: "What is this prototype?",
    answer: "CivicMind AI is a demo smart-community command center. It shows how city teams could combine complaints, traffic, waste, utilities, environment data, policy documents, and an AI agent into one decision workflow."
  },
  {
    question: "How do I use it?",
    answer: "Start on Dashboard to see the main priority, open Risk Map for ward-level evidence, review Actions for recommended interventions, open Reports for a shareable brief, and ask the right-side agent a civic operations question."
  },
  {
    question: "What changed in this UI?",
    answer: "The first page was simplified into one clear priority story, a compact KPI strip, a readable trend, and a decision brief. Detailed explanations moved into dedicated tabs so the first impression stays clean."
  },
  {
    question: "How much data is included?",
    answer: "The local demo uses 30 seeded records across seven civic tables: complaints, traffic events, waste collection, utilities, environment metrics, recommended actions, and policy documents."
  },
  {
    question: "Is this using live Google Cloud right now?",
    answer: "No. The prototype is cloud-ready and runs on local seeded data so the demo works without credentials. The adapter interfaces are ready for BigQuery, Gemini, ADK, RAG, and Cloud Run."
  },
  {
    question: "What makes the AI decision trustworthy?",
    answer: "Every response shows citations, operational evidence, confidence, and human approval state. The agent recommends actions, but civic teams approve execution."
  },
  {
    question: "Why is Ward 11 prioritized?",
    answer: "Ward 11 combines heavy rainfall, flood risk, missed waste pickups, overflowing bins, high-severity complaints, and congestion signals."
  }
];

const demoStats = [
  { label: "Citizen complaints", value: demoDataset.citizenComplaints.length },
  { label: "Traffic events", value: demoDataset.trafficEvents.length },
  { label: "Waste records", value: demoDataset.wasteCollection.length },
  { label: "Utility events", value: demoDataset.utilityEvents.length },
  { label: "Environment readings", value: demoDataset.environmentMetrics.length },
  { label: "Actions", value: demoDataset.actions.length },
  { label: "Policy docs", value: demoDataset.documents.length }
];

const totalDemoRecords = demoStats.reduce((sum, item) => sum + item.value, 0);

export function App() {
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");
  const [question, setQuestion] = useState(askTemplate);
  const [agentResponse, setAgentResponse] = useState<AgentResponse>(() => runCivicAgent(demoDataset, askTemplate));

  const summary = useMemo(() => calculateCivicSummary(demoDataset), []);
  const risks = useMemo(() => calculateWardRisks(demoDataset), []);
  const trends = useMemo(() => trendSeries(), []);
  const highRisk = risks[0];

  const askAgent = () => {
    setAgentResponse(runCivicAgent(demoDataset, question.trim() || askTemplate));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="CivicMind navigation">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>
          <div>
            <strong>CivicMind AI</strong>
            <span>Wizard prototype</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={activeView === item.key ? "nav-item active" : "nav-item"}
                onClick={() => setActiveView(item.key)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="cloud-stack">
          <span className="section-kicker">Cloud-ready stack</span>
          {serviceStack.map((service) => {
            const Icon = service.icon;
            return (
              <div className="stack-row" key={service.label}>
                <Icon size={16} />
                <div>
                  <strong>{service.label}</strong>
                  <span>{service.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="main-stage">
        <header className="hero-section">
          <div className="hero-copy">
            <span className="section-kicker">Gen AI Academy APAC Edition</span>
            <h1>Civic command center for smarter community decisions</h1>
            <p>
              CivicMind AI fuses city signals, policy context, and agentic reasoning
              into one decision cockpit for public teams.
            </p>
            <div className="hero-tags" aria-label="Prototype status">
              <span>Cloud-ready</span>
              <span>Human approved</span>
              <span>Ward 11 demo live</span>
            </div>
          </div>
        </header>

        {activeView === "dashboard" && (
          <DashboardView
            summary={summary}
            risks={risks}
            trends={trends}
          />
        )}
        {activeView === "risk" && <RiskMapView risks={risks} />}
        {activeView === "actions" && <ActionsView actions={demoDataset.actions} />}
        {activeView === "reports" && <ReportsView response={agentResponse} />}
        {activeView === "faq" && <FaqView />}
      </main>

      <AgentPanel
        question={question}
        response={agentResponse}
        focusWard={highRisk}
        totalRecords={totalDemoRecords}
        onQuestionChange={setQuestion}
        onAsk={askAgent}
      />
    </div>
  );
}

function DashboardView({
  summary,
  risks,
  trends
}: {
  summary: ReturnType<typeof calculateCivicSummary>;
  risks: WardRisk[];
  trends: ReturnType<typeof trendSeries>;
}) {
  const focusWard = risks[0];

  return (
    <section className="dashboard-clean" aria-label="Operations dashboard">
      <section className="focus-card">
        <div className="focus-copy">
          <span className="live-pill"><i /> Live civic priority</span>
          <h2>{focusWard.ward} needs coordinated response today</h2>
          <p>
            Waste overflow, waterlogging, and citizen complaints are converging.
            The agent recommends acting before evening traffic compounds impact.
          </p>
        </div>
        <div className="focus-score">
          <span>Risk score</span>
          <strong>{focusWard.riskScore}</strong>
          <small>{focusWard.primaryDrivers.slice(0, 2).join(" + ")}</small>
        </div>
      </section>

      <div className="metric-strip">
        <MetricTile icon={Gauge} label="Health" value={`${summary.communityHealthScore}/100`} tone="green" />
        <MetricTile icon={AlertTriangle} label="Alerts" value={String(summary.openAlerts)} tone="red" />
        <MetricTile icon={Timer} label="Response" value={`${summary.averageResponseHours}h`} tone="blue" />
        <MetricTile icon={Map} label="Focus" value={summary.highRiskWard} tone="yellow" />
      </div>

      <section className="panel signal-panel">
        <PanelHeader icon={Activity} title="City signal trend" detail="A clean read on complaint pressure versus closures." />
        <LineChart data={trends} />
      </section>

      <section className="panel decision-panel">
        <PanelHeader icon={ShieldCheck} title="Decision brief" detail="Explainable, human-approved next steps." />
        <div className="decision-list">
          <EvidenceItem title="Dispatch extra waste pickup" detail="Overflowing bins and missed pickups are above alert threshold." />
          <EvidenceItem title="Inspect storm drains" detail="Rainfall and waterlogging signals point to near-term civic risk." />
          <EvidenceItem title="Issue citizen advisory" detail="Public messaging reduces repeat complaints and unsafe routing." />
        </div>
      </section>
    </section>
  );
}

function RiskMapView({ risks }: { risks: WardRisk[] }) {
  return (
    <section className="view-grid risk-page" aria-label="Ward risk map">
      <section className="panel map-panel">
        <PanelHeader icon={Map} title="Ward risk heatmap" detail="Simulated city grid from BigQuery-ready features." />
        <div className="ward-grid">
          {risks.map((risk) => (
            <button className={`ward-cell ${severityClass[risk.level]}`} key={risk.ward} type="button">
              <span>{risk.ward}</span>
              <strong>{risk.riskScore}</strong>
              <small>{risk.primaryDrivers.join(" + ") || "stable"}</small>
            </button>
          ))}
        </div>
      </section>
      <section className="panel">
        <PanelHeader icon={AlertTriangle} title="Why Ward 11 is hot" detail="Evidence assembled by mock analyst agent." />
        <div className="evidence-list">
          <EvidenceItem title="Waste overflow" detail="Bins at 94% fill with 3 missed pickups." />
          <EvidenceItem title="Waterlogging risk" detail="68mm rainfall and flood risk score of 86." />
          <EvidenceItem title="Citizen impact" detail="Critical school road complaint and market overflow complaint." />
        </div>
      </section>
    </section>
  );
}

function ActionsView({ actions }: { actions: CivicAction[] }) {
  return (
    <section className="view-grid actions-page" aria-label="Recommendations queue">
      {actions.map((action) => (
        <article className="action-card" key={action.id}>
          <div className="action-card-top">
            <span className={`severity-badge ${severityClass[action.severity]}`}>{severityLabel[action.severity]}</span>
            <span>{action.ward}</span>
          </div>
          <h2>{action.title}</h2>
          <p>{action.expectedImpact}</p>
          <div className="action-meta">
            <span>Owner: {action.owner}</span>
            <span>ETA: {action.etaHours}h</span>
            <span>Status: {action.status.replace("_", " ")}</span>
          </div>
          <ul>
            {action.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function ReportsView({ response }: { response: AgentResponse }) {
  return (
    <section className="view-grid report-page" aria-label="Generated daily report">
      <section className="report-document">
        <span className="section-kicker">Daily civic brief</span>
        <h2>Ward 11 requires immediate coordinated response</h2>
        <p>{response.answer}</p>
        <div className="report-columns">
          <div>
            <h3>Recommended action set</h3>
            {response.recommendedActions.map((action) => (
              <p key={action.id}>
                <strong>{action.title}</strong>
                <br />
                {action.owner}, {action.etaHours} hour ETA.
              </p>
            ))}
          </div>
          <div>
            <h3>Grounding sources</h3>
            {response.citations.slice(0, 3).map((citation) => (
              <p key={citation.source}>
                <strong>{citation.source}</strong>
                <br />
                {citation.detail}
              </p>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

function FaqView() {
  return (
    <section className="view-grid faq-page" aria-label="Frequently asked questions">
      <section className="panel faq-hero">
        <span className="section-kicker">Prototype guide</span>
        <h2>Understand the demo in under one minute</h2>
        <p>
          This tab explains what changed, what data is inside, how to use the
          prototype, and how the Google Cloud version would work.
        </p>
      </section>

      <section className="panel data-card">
        <PanelHeader icon={Database} title="Demo data coverage" detail={`${totalDemoRecords} local records across seven civic tables.`} />
        <div className="data-stat-grid">
          {demoStats.map((item) => (
            <div className="data-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel faq-panel">
        <PanelHeader icon={HelpCircle} title="FAQ" detail="Human-readable notes for judges and demo viewers." />
        <div className="faq-list">
          {faqItems.map((item) => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function AgentPanel({
  question,
  response,
  focusWard,
  totalRecords,
  onQuestionChange,
  onAsk
}: {
  question: string;
  response: AgentResponse;
  focusWard: WardRisk;
  totalRecords: number;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
}) {
  return (
    <aside className="agent-panel" aria-label="AI agent command panel">
      <div className="agent-header">
        <div className="agent-avatar">
          <Bot size={22} />
        </div>
        <div>
          <strong>Decision assistant</strong>
          <span>Plain-English civic reasoning</span>
        </div>
      </div>

      <div className="agent-brief">
        <span className="section-kicker">What this panel does</span>
        <p>
          Ask a city operations question. The assistant explains the answer,
          shows evidence, and keeps final decisions human-approved.
        </p>
      </div>

      <div className="agent-focus">
        <span className="section-kicker">Current focus</span>
        <strong>{focusWard.ward}</strong>
        <p>{focusWard.primaryDrivers.join(", ")} detected across civic systems.</p>
      </div>

      <div className="sidebar-data-summary">
        <div>
          <span>Demo data</span>
          <strong>{totalRecords} records</strong>
        </div>
        <div>
          <span>Grounding</span>
          <strong>3 SOP docs</strong>
        </div>
      </div>

      <label className="agent-input">
        <span>Ask a civic operations question</span>
        <textarea value={question} onChange={(event) => onQuestionChange(event.target.value)} rows={3} />
      </label>
      <div className="prompt-chips" aria-label="Example questions">
        {[
          "Why Ward 11?",
          "What should we do first?",
          "Which data supports this?"
        ].map((prompt) => (
          <button key={prompt} type="button" onClick={() => onQuestionChange(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      <button className="primary-action" onClick={onAsk} type="button">
        Run agent analysis
        <ChevronRight size={18} />
      </button>

      <div className="agent-answer">
        <div className="agent-answer-top">
          <span>Confidence {(response.confidence * 100).toFixed(0)}%</span>
          <span>{new Date(response.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <p>{response.answer}</p>
      </div>

      <div className="agent-steps">
        {response.steps.map((step) => (
          <div className="agent-step" key={step.agent}>
            <CheckCircle2 size={16} />
            <div>
              <strong>{step.agent}</strong>
              <span>{step.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="citation-box">
        <span className="section-kicker">Citations</span>
        {response.citations.slice(0, 3).map((citation) => (
          <p key={citation.source}>
            <strong>{citation.source}</strong>
            <br />
            {citation.detail}
          </p>
        ))}
      </div>
    </aside>
  );
}

function MetricTile({ icon: Icon, label, value, tone }: { icon: typeof Gauge; label: string; value: string; tone: string }) {
  return (
    <section className={`metric-tile ${tone}`}>
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </section>
  );
}

function PanelHeader({ icon: Icon, title, detail }: { icon: typeof Gauge; title: string; detail: string }) {
  return (
    <header className="panel-header">
      <div>
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      <p>{detail}</p>
    </header>
  );
}

function LineChart({ data }: { data: ReturnType<typeof trendSeries> }) {
  const max = Math.max(...data.flatMap((item) => [item.complaints, item.resolved]));
  const width = 640;
  const height = 210;
  const points = (key: "complaints" | "resolved") =>
    data
      .map((item, index) => {
        const x = 32 + index * ((width - 64) / (data.length - 1));
        const y = height - 34 - (item[key] / max) * (height - 68);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Complaint and resolution trend">
        <line x1="32" x2={width - 24} y1={height - 34} y2={height - 34} className="axis-line" />
        <polyline points={points("complaints")} className="line complaints" fill="none" />
        <polyline points={points("resolved")} className="line resolved" fill="none" />
        {data.map((item, index) => {
          const x = 32 + index * ((width - 64) / (data.length - 1));
          return (
            <text className="axis-label" x={x} y={height - 10} textAnchor="middle" key={item.label}>
              {item.label}
            </text>
          );
        })}
      </svg>
      <div className="legend">
        <span><i className="legend-dot red" /> Complaints</span>
        <span><i className="legend-dot blue" /> Resolved</span>
      </div>
    </div>
  );
}

function RiskRow({ risk }: { risk: WardRisk }) {
  return (
    <div className="risk-row">
      <div>
        <strong>{risk.ward}</strong>
        <span>{risk.primaryDrivers.join(", ") || "stable"}</span>
      </div>
      <span className={`severity-badge ${severityClass[risk.level]}`}>{risk.riskScore}</span>
    </div>
  );
}

function ActionStrip({ actions }: { actions: CivicAction[] }) {
  return (
    <div className="action-strip">
      {actions.map((action) => (
        <article className="action-mini" key={action.id}>
          <span>{action.owner}</span>
          <strong>{action.title}</strong>
          <small>{action.etaHours}h ETA</small>
        </article>
      ))}
    </div>
  );
}

function EvidenceItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="evidence-item">
      <CheckCircle2 size={18} />
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}
