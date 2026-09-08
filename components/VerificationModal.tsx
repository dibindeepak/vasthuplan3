'use client';

import React from 'react';
import { TitleBlockData } from '@/lib/types';
import { ShieldCheck, Phone, MessageSquare, X, CheckCircle2, Building, Award } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TitleBlockData;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 font-sans">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with verification seal */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wide font-mono">
                ENGINEER CREDENTIAL VERIFICATION
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Public verification record for Kerala LSGD Licensed Professional
            </p>
          </div>
        </div>

        {/* Engineer Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-3 backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-mono uppercase text-slate-400">CONSULTING ENGINEER</div>
              <div className="text-lg font-black text-white font-mono">{data.engineer.name}</div>
              <div className="text-xs font-semibold text-slate-300">{data.engineer.title}</div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg tracking-wider font-mono shadow-sm">
              LSGD REG: A
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-white/10 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">REGISTRATION NUMBER</span>
              <span className="font-bold text-slate-100">{data.engineer.regNo}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">VASTHU CERTIFICATION</span>
              <span className="font-bold text-amber-300">Ayadi Shadvarga Specialist</span>
            </div>
          </div>
        </div>

        {/* Architectural Firm Info */}
        <div className="border border-white/10 rounded-xl p-3.5 mb-4 space-y-1.5 text-xs bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 font-bold text-white font-mono">
            <Building className="w-4 h-4 text-blue-400" />
            <span>{data.firm.name}</span>
          </div>
          <div className="text-slate-300 text-[11px] leading-relaxed">
            {data.firm.address}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Drawing Reference: <strong className="text-white">{data.drawingNumber}</strong> • Rev:{' '}
            <strong className="text-blue-400">{data.revision}</strong>
          </div>
        </div>

        {/* Direct Public Contact Actions (No login needed) */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-300 font-mono">
            DIRECT CONTACT OPTIONS (FREE & NO LOGIN REQUIRED)
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${data.engineer.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 border border-rose-400/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call {data.engineer.phone}</span>
            </a>

            <a
              href={`https://wa.me/${data.engineer.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Er.%20Deepak,%20I%20am%20reviewing%20drawing%20${encodeURIComponent(data.drawingNumber)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 border border-emerald-400/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>LSGD Kerala Approved Document</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
