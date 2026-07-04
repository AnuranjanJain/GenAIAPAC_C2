export type WardId = "Ward 7" | "Ward 8" | "Ward 9" | "Ward 11" | "Ward 14" | "Ward 18";

export type Severity = "low" | "medium" | "high" | "critical";

export type ActionStatus = "recommended" | "approved" | "in_progress" | "resolved";

export type ComplaintCategory =
  | "waste"
  | "waterlogging"
  | "traffic"
  | "utility"
  | "safety"
  | "environment";

export interface CitizenComplaint {
  id: string;
  ward: WardId;
  category: ComplaintCategory;
  text: string;
  severity: Severity;
  createdAt: string;
  status: "open" | "assigned" | "closed";
}

export interface TrafficEvent {
  id: string;
  ward: WardId;
  congestionScore: number;
  incidentType: string;
  timestamp: string;
  source: string;
}

export interface WasteCollection {
  id: string;
  ward: WardId;
  routeId: string;
  missedPickups: number;
  binFillPercent: number;
  timestamp: string;
}

export interface UtilityEvent {
  id: string;
  ward: WardId;
  outageType: "water" | "power" | "streetlight";
  durationMinutes: number;
  affectedUsers: number;
  timestamp: string;
}

export interface EnvironmentMetric {
  id: string;
  ward: WardId;
  airQualityIndex: number;
  rainfallMm: number;
  floodRisk: number;
  timestamp: string;
}

export interface CivicAction {
  id: string;
  ward: WardId;
  title: string;
  owner: string;
  severity: Severity;
  etaHours: number;
  expectedImpact: string;
  evidence: string[];
  status: ActionStatus;
}

export interface CivicDocument {
  id: string;
  title: string;
  type: "SOP" | "policy" | "historical_report";
  excerpt: string;
  tags: string[];
}

export interface WardRisk {
  ward: WardId;
  riskScore: number;
  level: Severity;
  primaryDrivers: string[];
  openComplaints: number;
  recommendedActionCount: number;
}

export interface CivicSummary {
  communityHealthScore: number;
  openAlerts: number;
  averageResponseHours: number;
  highRiskWard: WardId;
  complaintDeltaPercent: number;
  waterloggingDeltaPercent: number;
}

export interface DemoDataset {
  citizenComplaints: CitizenComplaint[];
  trafficEvents: TrafficEvent[];
  wasteCollection: WasteCollection[];
  utilityEvents: UtilityEvent[];
  environmentMetrics: EnvironmentMetric[];
  actions: CivicAction[];
  documents: CivicDocument[];
}
