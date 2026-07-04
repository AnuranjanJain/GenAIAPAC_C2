import { describe, expect, it } from "vitest";
import { demoDataset } from "../data/demoData";
import { runCivicAgent } from "./agents";

describe("mock Gemini/ADK civic agent", () => {
  it("returns evidence, recommendations, and human-approval aware response", () => {
    const response = runCivicAgent(demoDataset, "Which ward needs urgent attention today?");

    expect(response.focusWard.ward).toBe("Ward 11");
    expect(response.recommendedActions.length).toBeGreaterThanOrEqual(3);
    expect(response.citations.length).toBeGreaterThanOrEqual(3);
    expect(response.answer.toLowerCase()).toContain("recommended");
    expect(response.steps.map((step) => step.agent)).toContain("Policy/RAG Agent");
  });
});
