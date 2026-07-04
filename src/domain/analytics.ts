import type { CivicSummary, DemoDataset, Severity, WardId, WardRisk } from "./civic";

const severityWeight: Record<Severity, number> = {
  low: 4,
  medium: 10,
  high: 18,
  critical: 28
};

const severityLevel = (score: number): Severity => {
  if (score >= 82) return "critical";
  if (score >= 64) return "high";
  if (score >= 40) return "medium";
  return "low";
};

export const allWards = (dataset: DemoDataset): WardId[] => {
  const wards = new Set<WardId>();
  dataset.citizenComplaints.forEach((item) => wards.add(item.ward));
  dataset.environmentMetrics.forEach((item) => wards.add(item.ward));
  dataset.wasteCollection.forEach((item) => wards.add(item.ward));
  dataset.trafficEvents.forEach((item) => wards.add(item.ward));
  dataset.utilityEvents.forEach((item) => wards.add(item.ward));
  return Array.from(wards).sort((a, b) => Number(a.replace("Ward ", "")) - Number(b.replace("Ward ", "")));
};

export const calculateWardRisks = (dataset: DemoDataset): WardRisk[] => {
  return allWards(dataset)
    .map((ward) => {
      const complaints = dataset.citizenComplaints.filter((item) => item.ward === ward);
      const waste = dataset.wasteCollection.filter((item) => item.ward === ward);
      const traffic = dataset.trafficEvents.filter((item) => item.ward === ward);
      const utilities = dataset.utilityEvents.filter((item) => item.ward === ward);
      const environment = dataset.environmentMetrics.find((item) => item.ward === ward);
      const actions = dataset.actions.filter((item) => item.ward === ward && item.status !== "resolved");

      const complaintScore = complaints.reduce((total, item) => total + severityWeight[item.severity], 0);
      const wasteScore = waste.reduce((total, item) => total + item.missedPickups * 8 + Math.max(0, item.binFillPercent - 70) * 0.7, 0);
      const trafficScore = traffic.reduce((total, item) => total + item.congestionScore * 0.18, 0);
      const utilityScore = utilities.reduce((total, item) => total + item.affectedUsers * 0.025 + item.durationMinutes * 0.08, 0);
      const environmentScore = environment ? environment.floodRisk * 0.32 + Math.max(0, environment.airQualityIndex - 80) * 0.12 + environment.rainfallMm * 0.16 : 0;
      const actionScore = actions.length * 3;

      const riskScore = Math.min(100, Math.round(complaintScore + wasteScore + trafficScore + utilityScore + environmentScore + actionScore));
      const primaryDrivers = [
        complaints.some((item) => item.category === "waste") ? "waste complaints" : null,
        complaints.some((item) => item.category === "waterlogging") ? "waterlogging" : null,
        waste.some((item) => item.binFillPercent >= 90) ? "overflowing bins" : null,
        environment && environment.rainfallMm >= 50 ? "heavy rainfall" : null,
        traffic.some((item) => item.congestionScore >= 65) ? "traffic congestion" : null,
        utilities.some((item) => item.affectedUsers > 250) ? "utility impact" : null
      ].filter(Boolean) as string[];

      return {
        ward,
        riskScore,
        level: severityLevel(riskScore),
        primaryDrivers: primaryDrivers.slice(0, 3),
        openComplaints: complaints.filter((item) => item.status !== "closed").length,
        recommendedActionCount: actions.length
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);
};

export const calculateCivicSummary = (dataset: DemoDataset): CivicSummary => {
  const risks = calculateWardRisks(dataset);
  const openAlerts = dataset.actions.filter((item) => item.status !== "resolved").length + dataset.citizenComplaints.filter((item) => item.status === "open").length;
  const averageResponseHours = dataset.actions.reduce((total, item) => total + item.etaHours, 0) / dataset.actions.length;
  const healthPenalty = risks.reduce((total, item) => total + item.riskScore, 0) / Math.max(1, risks.length) * 0.36 + openAlerts * 0.9;

  return {
    communityHealthScore: Math.max(0, Math.round(100 - healthPenalty)),
    openAlerts,
    averageResponseHours: Number(averageResponseHours.toFixed(1)),
    highRiskWard: risks[0]?.ward ?? "Ward 11",
    complaintDeltaPercent: 42,
    waterloggingDeltaPercent: 31
  };
};

export const categoryCounts = (dataset: DemoDataset) => {
  const counts = new Map<string, number>();
  dataset.citizenComplaints.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
};

export const trendSeries = () => [
  { label: "Mon", complaints: 11, resolved: 8 },
  { label: "Tue", complaints: 14, resolved: 10 },
  { label: "Wed", complaints: 13, resolved: 9 },
  { label: "Thu", complaints: 18, resolved: 12 },
  { label: "Fri", complaints: 25, resolved: 14 },
  { label: "Sat", complaints: 31, resolved: 17 },
  { label: "Today", complaints: 37, resolved: 19 }
];
