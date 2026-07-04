import type { CivicSummary, DemoDataset, WardRisk } from "../domain/civic";
import { calculateCivicSummary, calculateWardRisks, categoryCounts, trendSeries } from "../domain/analytics";

export interface BigQueryAnalyticsAdapter {
  getSummary(): Promise<CivicSummary>;
  getWardRisks(): Promise<WardRisk[]>;
  getComplaintCategories(): Promise<Array<{ category: string; count: number }>>;
  getTrendSeries(): Promise<Array<{ label: string; complaints: number; resolved: number }>>;
}

export class LocalBigQueryAnalyticsAdapter implements BigQueryAnalyticsAdapter {
  constructor(private readonly dataset: DemoDataset) {}

  async getSummary() {
    return calculateCivicSummary(this.dataset);
  }

  async getWardRisks() {
    return calculateWardRisks(this.dataset);
  }

  async getComplaintCategories() {
    return categoryCounts(this.dataset);
  }

  async getTrendSeries() {
    return trendSeries();
  }
}
