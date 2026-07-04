import type { CivicDocument, DemoDataset } from "../domain/civic";

export interface RagKnowledgeAdapter {
  search(query: string): Promise<CivicDocument[]>;
}

export class LocalRagKnowledgeAdapter implements RagKnowledgeAdapter {
  constructor(private readonly dataset: DemoDataset) {}

  async search(query: string) {
    const normalized = query.toLowerCase();
    return this.dataset.documents.filter((document) =>
      document.title.toLowerCase().includes(normalized) ||
      document.excerpt.toLowerCase().includes(normalized) ||
      document.tags.some((tag) => normalized.includes(tag.toLowerCase()))
    );
  }
}
