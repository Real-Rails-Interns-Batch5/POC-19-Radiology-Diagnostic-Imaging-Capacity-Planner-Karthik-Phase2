"use client";

import React, { useState } from 'react';
import { Info, Briefcase } from 'lucide-react';
import { MetadataModal } from './MetadataModal';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-3 left-4 right-4 z-[50] flex items-center justify-between pointer-events-none">
        {/* Top-Left Enterprise Branding & Title */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1B22]/80 backdrop-blur-md border border-[rgba(56,189,248,0.2)] text-slate-300 text-[11px] font-medium tracking-widest uppercase shadow-lg hover:border-[rgba(56,189,248,0.4)] transition-all">
            <Briefcase className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-slate-200">Infocreon Internship</span>
          </div>
          <span className="text-slate-600/60 font-light text-xs">|</span>
          <h1 className="text-xs font-semibold tracking-widest text-slate-400/80 uppercase drop-shadow-md">
            Radiology Capacity Planner
          </h1>
        </div>

        {/* Right Info Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full bg-[#0D1B22]/80 hover:bg-[#1A3342] backdrop-blur-md border border-[#1A3342] text-slate-300 hover:text-white transition-all pointer-events-auto shadow-lg"
          aria-label="System Info"
        >
          <Info size={18} />
        </button>
      </header>

      <MetadataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

