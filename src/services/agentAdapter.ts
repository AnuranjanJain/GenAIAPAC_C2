import type { DemoDataset } from "../domain/civic";
import type { AgentResponse } from "../domain/agents";
import { runCivicAgent } from "../domain/agents";

export interface GeminiAgentAdapter {
  ask(question: string): Promise<AgentResponse>;
}

export class LocalGeminiAgentAdapter implements GeminiAgentAdapter {
  constructor(private readonly dataset: DemoDataset) {}

  async ask(question: string) {
    return runCivicAgent(this.dataset, question);
  }
}
