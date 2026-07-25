"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchHospitals, fetchKPIs, fetchAgeDistribution, fetchCapacityGap, fetchRegions, fetchHospitalDetails } from '@/lib/api';
import { SlideOverPanel } from '@/components/SlideOverPanel';
import { FloatingFilters } from '@/components/FloatingFilters';
import { FloatingKPIs } from '@/components/FloatingKPIs';
import { Header } from '@/components/Header';
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

export default function Home() {
  const [filters, setFilters] = useState({ region: "", modality: "", maintenance_status: "", alert_level: "" });
  const [regions, setRegions] = useState<string[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [ageDist, setAgeDist] = useState<any>(null);
  const [capacityGap, setCapacityGap] = useState<any>(null);
  const [waitTrend, setWaitTrend] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([fetchRegions(), fetchAgeDistribution(), fetchCapacityGap()])
      .then(([regionsResponse, ageResponse, capacityResponse]) => {
        if (cancelled) return;
        setRegions(toArray<string>(regionsResponse?.regions));
        setAgeDist(toArray<any>(ageResponse?.buckets));
        setCapacityGap(toArray<any>(capacityResponse?.hospitals));
      })
      .catch((requestError: Error) => {
        if (!cancelled) setError(requestError.message || "Unable to load dashboard data.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    void Promise.all([fetchHospitals(filters), fetchKPIs(filters.region)])
      .then(([hospitalResponse, kpiResponse]) => {
        if (cancelled) return;
        let hospitals = toArray<any>(hospitalResponse?.hospitals);
        if (filters.alert_level) {
          hospitals = hospitals.filter((hospital: any) => hospital.alert_level === filters.alert_level);
        }
        setFilteredHospitals(hospitals);
        setKpis(kpiResponse ?? null);
      })
      .catch((requestError: Error) => {
        if (cancelled) return;
        setFilteredHospitals([]);
        setKpis(null);
        setError(requestError.message || "Unable to load dashboard data.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  useEffect(() => {
    if (selectedId) {
      void fetchHospitalDetails(selectedId)
        .then(response => setWaitTrend(toArray<any>(response?.wait_trend)))
        .catch((requestError: Error) => {
          setWaitTrend([]);
          setError(requestError.message || "Unable to load hospital details.");
        });
    } else {
      // Calculate region average when no hospital is selected
      if (filteredHospitals.length > 0) {
        const avgWait = filteredHospitals.reduce((acc, h) => acc + h.avg_wait_time_days, 0) / filteredHospitals.length;
        const months = ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", 
                        "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024"];
        const regionTrend = months.map(month => ({
          month,
          avg_wait_days: Number(avgWait.toFixed(1))
        }));
        setWaitTrend(regionTrend);
      } else {
        setWaitTrend([]);
      }
    }
  }, [selectedId, filteredHospitals]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#06141B]">
      <Header />
      {(isLoading || error) && (
        <div className="fixed top-24 left-1/2 z-50 max-w-md -translate-x-1/2 rounded-lg border border-[#1A3342] bg-[#0D1B22]/95 px-4 py-3 text-sm text-slate-200 shadow-lg">
          {error ? (
            <div>
              <div className="font-medium text-white">Unable to load dashboard</div>
              <div className="mt-1 text-slate-300">{error}</div>
            </div>
          ) : (
            "Loading dashboard data…"
          )}
        </div>
      )}
      {/* Subtle Map Vignette */}
      <div className="absolute inset-0 z-[10] pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(6,20,27,0.75) 100%)' }} />
      
      {/* Map as the full-screen stage */}
      <div className="absolute inset-0 z-0 [&>div]:!h-full [&>div]:!min-h-full [&>div]:!rounded-none [&>div]:!border-none [&>div>div]:!h-full">
        <MapComponent hospitals={filteredHospitals} onSelectHospital={setSelectedId} selectedId={selectedId} />
      </div>

      <FloatingFilters
        hospitals={filteredHospitals}
        regions={regions}
        filters={filters}
        setFilters={setFilters}
      />
      
      <FloatingKPIs kpis={kpis} />

      <SlideOverPanel 
        hospital={filteredHospitals.find(h => h.id === selectedId)} 
        waitTrend={waitTrend} 
        onClose={() => setSelectedId(null)} 
      />
    </main>
  );
}
