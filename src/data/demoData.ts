import type { DemoDataset } from "../domain/civic";

export const demoDataset: DemoDataset = {
  citizenComplaints: [
    {
      id: "cmp-1001",
      ward: "Ward 11",
      category: "waste",
      text: "Garbage bins have overflowed near the market since yesterday evening.",
      severity: "high",
      createdAt: "2026-07-05T08:20:00+05:30",
      status: "open"
    },
    {
      id: "cmp-1002",
      ward: "Ward 11",
      category: "waterlogging",
      text: "Rainwater is blocking the school road and the drain is clogged.",
      severity: "critical",
      createdAt: "2026-07-05T09:05:00+05:30",
      status: "open"
    },
    {
      id: "cmp-1003",
      ward: "Ward 11",
      category: "waste",
      text: "Collection truck missed the morning pickup on Route W11-A.",
      severity: "high",
      createdAt: "2026-07-05T09:40:00+05:30",
      status: "assigned"
    },
    {
      id: "cmp-1004",
      ward: "Ward 7",
      category: "traffic",
      text: "Signal outage is causing congestion near the bus depot.",
      severity: "medium",
      createdAt: "2026-07-05T10:10:00+05:30",
      status: "open"
    },
    {
      id: "cmp-1005",
      ward: "Ward 14",
      category: "environment",
      text: "Air quality feels poor near the construction zone.",
      severity: "medium",
      createdAt: "2026-07-05T07:55:00+05:30",
      status: "open"
    },
    {
      id: "cmp-1006",
      ward: "Ward 18",
      category: "utility",
      text: "Streetlights are off on the main stretch.",
      severity: "low",
      createdAt: "2026-07-05T06:50:00+05:30",
      status: "assigned"
    },
    {
      id: "cmp-1007",
      ward: "Ward 8",
      category: "safety",
      text: "Tree branch fell after heavy rain and is blocking a lane.",
      severity: "medium",
      createdAt: "2026-07-05T08:10:00+05:30",
      status: "open"
    }
  ],
  trafficEvents: [
    { id: "trf-1", ward: "Ward 11", congestionScore: 72, incidentType: "waterlogged junction", timestamp: "2026-07-05T09:30:00+05:30", source: "traffic sensor" },
    { id: "trf-2", ward: "Ward 7", congestionScore: 68, incidentType: "signal outage", timestamp: "2026-07-05T09:15:00+05:30", source: "traffic control" },
    { id: "trf-3", ward: "Ward 14", congestionScore: 45, incidentType: "construction slowdown", timestamp: "2026-07-05T08:50:00+05:30", source: "field report" },
    { id: "trf-4", ward: "Ward 8", congestionScore: 36, incidentType: "tree obstruction", timestamp: "2026-07-05T08:40:00+05:30", source: "citizen report" }
  ],
  wasteCollection: [
    { id: "wst-1", ward: "Ward 11", routeId: "W11-A", missedPickups: 3, binFillPercent: 94, timestamp: "2026-07-05T09:00:00+05:30" },
    { id: "wst-2", ward: "Ward 7", routeId: "W7-C", missedPickups: 1, binFillPercent: 71, timestamp: "2026-07-05T08:30:00+05:30" },
    { id: "wst-3", ward: "Ward 14", routeId: "W14-B", missedPickups: 0, binFillPercent: 64, timestamp: "2026-07-05T08:00:00+05:30" },
    { id: "wst-4", ward: "Ward 18", routeId: "W18-A", missedPickups: 0, binFillPercent: 52, timestamp: "2026-07-05T07:45:00+05:30" }
  ],
  utilityEvents: [
    { id: "utl-1", ward: "Ward 11", outageType: "water", durationMinutes: 80, affectedUsers: 430, timestamp: "2026-07-05T08:35:00+05:30" },
    { id: "utl-2", ward: "Ward 18", outageType: "streetlight", durationMinutes: 190, affectedUsers: 120, timestamp: "2026-07-05T06:30:00+05:30" },
    { id: "utl-3", ward: "Ward 7", outageType: "power", durationMinutes: 35, affectedUsers: 180, timestamp: "2026-07-05T09:10:00+05:30" }
  ],
  environmentMetrics: [
    { id: "env-1", ward: "Ward 11", airQualityIndex: 92, rainfallMm: 68, floodRisk: 86, timestamp: "2026-07-05T09:00:00+05:30" },
    { id: "env-2", ward: "Ward 7", airQualityIndex: 82, rainfallMm: 31, floodRisk: 46, timestamp: "2026-07-05T09:00:00+05:30" },
    { id: "env-3", ward: "Ward 14", airQualityIndex: 139, rainfallMm: 18, floodRisk: 22, timestamp: "2026-07-05T09:00:00+05:30" },
    { id: "env-4", ward: "Ward 18", airQualityIndex: 73, rainfallMm: 11, floodRisk: 14, timestamp: "2026-07-05T09:00:00+05:30" },
    { id: "env-5", ward: "Ward 8", airQualityIndex: 71, rainfallMm: 42, floodRisk: 38, timestamp: "2026-07-05T09:00:00+05:30" }
  ],
  actions: [
    {
      id: "act-1",
      ward: "Ward 11",
      title: "Dispatch extra waste pickup to Route W11-A",
      owner: "Public Works",
      severity: "critical",
      etaHours: 6,
      expectedImpact: "Reduce overflow complaints and unblock market corridor.",
      evidence: ["Waste bins at 94% fill", "3 missed pickups", "Waste complaints up 42%"],
      status: "recommended"
    },
    {
      id: "act-2",
      ward: "Ward 11",
      title: "Inspect storm drains near school road",
      owner: "Ward Engineer",
      severity: "high",
      etaHours: 8,
      expectedImpact: "Lower flood risk before evening traffic peak.",
      evidence: ["Rainfall 68mm", "Flood risk 86", "Waterlogging complaint marked critical"],
      status: "recommended"
    },
    {
      id: "act-3",
      ward: "Ward 11",
      title: "Issue citizen advisory for alternate route",
      owner: "Communications",
      severity: "medium",
      etaHours: 2,
      expectedImpact: "Reduce congestion near waterlogged junction.",
      evidence: ["Congestion score 72", "School road blocked", "SOP recommends public notice"],
      status: "approved"
    },
    {
      id: "act-4",
      ward: "Ward 7",
      title: "Repair bus depot traffic signal",
      owner: "Traffic Control",
      severity: "medium",
      etaHours: 5,
      expectedImpact: "Normalize bus depot traffic flow.",
      evidence: ["Signal outage", "Congestion score 68"],
      status: "in_progress"
    }
  ],
  documents: [
    {
      id: "doc-1",
      title: "Storm Drain Response SOP",
      type: "SOP",
      excerpt: "If rainfall exceeds 50mm and waterlogging reports are critical, inspect drains within 8 hours and notify ward engineering.",
      tags: ["rainfall", "waterlogging", "drain", "Ward 11"]
    },
    {
      id: "doc-2",
      title: "Waste Overflow Escalation Policy",
      type: "policy",
      excerpt: "Overflowing public bins above 90% fill with two or more missed pickups should trigger extra collection within 6 hours.",
      tags: ["waste", "overflow", "collection"]
    },
    {
      id: "doc-3",
      title: "Citizen Advisory Playbook",
      type: "SOP",
      excerpt: "When public routes are blocked, communications teams should publish alternate routes and expected resolution windows.",
      tags: ["traffic", "advisory", "citizen services"]
    }
  ]
};
