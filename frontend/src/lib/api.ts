// API_BASE is intentionally empty — all calls use relative /api/* paths.
// The /api route handler proxies them to the configured backend at runtime.
// This avoids the build-time vs runtime problem with NEXT_PUBLIC_* variables on Render.
const API_BASE = "";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    let message = `API request failed (${res.status})`;
    try {
      const text = await res.text();
      if (text) {
        const payload = JSON.parse(text);
        if (typeof payload?.detail === "string") {
          message = payload.detail;
        } else if (typeof payload?.message === "string") {
          message = payload.message;
        }
      }
    } catch {
      // Keep the status-based message when the upstream error is not JSON.
    }
    throw new ApiError(res.status, message);
  }

  try {
    return await res.json() as Promise<T>;
  } catch {
    throw new ApiError(502, "Received an invalid response from the API");
  }
}

export interface Hospital {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  mri_count: number;
  ct_count: number;
  population_served: number;
  daily_scan_volume: number;
  avg_wait_time_days: number;
  daily_utilization_pct: number;
  maintenance_status: string;
  equipment_age_years: number;
  equipment_type: string;
  capacity_gap_index: number;
  scanners_per_100k: number;
  alert_level: string;
  replacement_priority: string;
}

export interface KPISummary {
  total_mri_scanners: number;
  total_ct_scanners: number;
  avg_utilization_pct: number;
  avg_wait_time_days: number;
  avg_capacity_gap_index: number;
  equipment_older_than_10yr: number;
  daily_imaging_volume: number;
  data_source: string;
}

export async function fetchHospitals(filters: any = {}) {
  const params = new URLSearchParams();
  if (filters.region) params.append("region", filters.region);
  if (filters.modality) params.append("modality", filters.modality);
  if (filters.maintenance_status) params.append("maintenance_status", filters.maintenance_status);
  
  return fetchJson<any>(`${API_BASE}/api/hospitals?${params.toString()}`);
}

export async function fetchHospitalDetails(id: string) {
  return fetchJson<any>(`${API_BASE}/api/hospitals/${id}`);
}

export async function fetchKPIs(region?: string) {
  const url = region ? `${API_BASE}/api/kpis?region=${region}` : `${API_BASE}/api/kpis`;
  return fetchJson<any>(url);
}

export async function fetchAgeDistribution() {
  return fetchJson<any>(`${API_BASE}/api/equipment/age-distribution`);
}

export async function fetchCapacityGap() {
  return fetchJson<any>(`${API_BASE}/api/equipment/capacity-gap`);
}

export async function fetchRegions() {
  return fetchJson<any>(`${API_BASE}/api/regions`);
}
