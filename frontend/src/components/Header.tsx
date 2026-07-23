"use client";

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { MetadataModal } from './MetadataModal';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-[48px] z-[50] flex items-center justify-between px-6 bg-transparent pointer-events-none">
        <h1 className="text-xs font-semibold tracking-widest text-slate-400/80 uppercase drop-shadow-md pointer-events-auto">
          Radiology Capacity Planner
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full bg-[#0D1B22]/80 hover:bg-[#1A3342] backdrop-blur-md border border-[#1A3342] text-slate-300 hover:text-white transition-all pointer-events-auto shadow-lg"
          aria-label="System Info"
        >
          <Info size={20} />
        </button>
      </header>

      <MetadataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
