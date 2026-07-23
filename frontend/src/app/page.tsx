"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchHospitals, fetchKPIs, fetchAgeDistribution, fetchCapacityGap, fetchRegions, fetchHospitalDetails } from '@/lib/api';
import { SlideOverPanel } from '@/components/SlideOverPanel';
import { FloatingFilters } from '@/components/FloatingFilters';
import { FloatingKPIs } from '@/components/FloatingKPIs';
import { Header } from '@/components/Header';
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [filters, setFilters] = useState({ region: "", modality: "", maintenance_status: "", alert_level: "" });
  const [regions, setRegions] = useState<string[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [ageDist, setAgeDist] = useState<any>(null);
  const [capacityGap, setCapacityGap] = useState<any>(null);
  const [waitTrend, setWaitTrend] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions().then(res => setRegions(res.regions));
    fetchAgeDistribution().then(res => setAgeDist(res.buckets));
    fetchCapacityGap().then(res => setCapacityGap(res.hospitals));
  }, []);

  useEffect(() => {
    fetchHospitals(filters).then(res => {
      let data = res.hospitals;
      if (filters.alert_level) {
        data = data.filter((h: any) => h.alert_level === filters.alert_level);
      }
      setFilteredHospitals(data);
    });
    fetchKPIs(filters.region).then(res => setKpis(res));
  }, [filters]);

  useEffect(() => {
    if (selectedId) {
      fetchHospitalDetails(selectedId).then(res => setWaitTrend(res.wait_trend));
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
