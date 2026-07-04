export interface CloudRunApiAdapter {
  baseUrl: string;
  health(): Promise<{ status: "ok"; mode: "local" | "cloud" }>;
}

export class LocalCloudRunApiAdapter implements CloudRunApiAdapter {
  baseUrl = import.meta.env.VITE_API_BASE_URL ?? "local://civicmind";

  async health() {
    return { status: "ok" as const, mode: "local" as const };
  }
}
