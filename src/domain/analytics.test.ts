import { describe, expect, it } from "vitest";
import { demoDataset } from "../data/demoData";
import { calculateCivicSummary, calculateWardRisks } from "./analytics";

describe("civic analytics", () => {
  it("ranks Ward 11 as the highest risk demo scenario", () => {
    const risks = calculateWardRisks(demoDataset);

    expect(risks[0].ward).toBe("Ward 11");
    expect(risks[0].riskScore).toBeGreaterThan(80);
    expect(risks[0].primaryDrivers).toContain("waterlogging");
  });

  it("calculates dashboard summary totals from seeded data", () => {
    const summary = calculateCivicSummary(demoDataset);

    expect(summary.highRiskWard).toBe("Ward 11");
    expect(summary.openAlerts).toBeGreaterThan(0);
    expect(summary.communityHealthScore).toBeGreaterThan(0);
  });
});
