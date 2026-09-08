'use client';

import React, { useEffect, useState } from 'react';
import { TitleBlockData } from '@/lib/types';
import { generateQrDataUrl } from '@/lib/qr';
import {
  Phone,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Edit3,
  SlidersHorizontal,
  Clock,
  Building,
} from 'lucide-react';

interface TitleBlockProps {
  data: TitleBlockData;
  onUpdate?: (data: TitleBlockData) => void;
  onVerifyEngineer?: () => void;
  onEditTitleBlock?: (tab?: 'project' | 'company' | 'engineer' | 'area' | 'vasthu') => void;
  onTogglePosition?: (pos: 'right' | 'bottom') => void;
  publicShareUrl?: string;
  isPrintMode?: boolean;
  orientation?: 'landscape' | 'portrait';
  position?: 'auto' | 'right' | 'bottom';
}

export const TitleBlock: React.FC<TitleBlockProps> = ({
  data,
  onVerifyEngineer,
  onEditTitleBlock,
  onTogglePosition,
  publicShareUrl = '',
  isPrintMode = false,
  orientation = 'landscape',
  position = 'auto',
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const urlToEncode =
      publicShareUrl ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}?project=${data.drawingNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        : 'https://vasthusilpy-plans.preview.app');

    generateQrDataUrl(urlToEncode).then((url) => {
      if (url) setQrCodeUrl(url);
    });
  }, [publicShareUrl, data.drawingNumber]);

  // Compute effective placement (auto, right, bottom)
  const effectivePosition: 'right' | 'bottom' =
    position === 'right' || position === 'bottom'
      ? position
      : orientation === 'portrait'
      ? 'bottom'
      : 'right';

  // Compute Area Statement totals
  const totalProposedBuiltup =
    data.areaStatement?.reduce((sum, r) => sum + (Number(r.proposedBuiltup) || 0), 0) || 0;
  const totalProposedFloor =
    data.areaStatement?.reduce((sum, r) => sum + (Number(r.proposedFloor) || 0), 0) || 0;
  const totalExistingBuiltup =
    data.areaStatement?.reduce((sum, r) => sum + (Number(r.existingBuiltup) || 0), 0) || 0;
  const totalExistingFloor =
    data.areaStatement?.reduce((sum, r) => sum + (Number(r.existingFloor) || 0), 0) || 0;
  const totalSqFt = Math.round(totalProposedBuiltup * 10.7639);

  // -------------------------------------------------------------
  // HORIZONTAL LAYOUT (PLACED AT SHEET BOTTOM)
  // -------------------------------------------------------------
  if (effectivePosition === 'bottom') {
    return (
      <aside
        id="aia-title-block"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEditTitleBlock?.('project');
        }}
        title="Double-click to edit complete Title Block attributes"
        className="w-full border-t-2 border-slate-900 bg-white text-slate-900 select-none text-[10px] leading-tight font-sans tracking-tight shrink-0 relative group"
      >
        {/* Floating Quick Edit & Position Toggle Buttons */}
        {!isPrintMode && (
          <div className="absolute -top-7 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              type="button"
              onClick={() => onTogglePosition?.('right')}
              className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-mono hover:bg-slate-800 shadow cursor-pointer flex items-center gap-1"
              title="Move Title Block to Right Side"
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              <span>Move to Right</span>
            </button>
            <button
              type="button"
              onClick={() => onEditTitleBlock?.('project')}
              className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-mono hover:bg-blue-500 shadow cursor-pointer flex items-center gap-1"
              title="Edit Details & Logo"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>Edit Attributes</span>
            </button>
          </div>
        )}

        {/* Live Automatic Timestamp Watermark Ribbon */}
        <div className="bg-slate-100 px-3 py-0.5 border-b border-slate-300 flex items-center justify-between text-[8px] font-mono text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-2.5 h-2.5 text-blue-600" />
            <span>
              ARCHITECTURAL RECORD WATERMARK: <strong>{data.date}</strong>
            </span>
          </div>
          <span className="text-slate-400">DOUBLE-CLICK TO EDIT ANY FIELD</span>
        </div>

        <div className="grid grid-cols-12 divide-x divide-slate-900">
          {/* 1. FIRM & LOGO & ENGINEER (Col 1-4) */}
          <div
            className="col-span-4 p-2 flex flex-col justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEditTitleBlock?.('company');
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                {/* Custom Logo or Default Vector Emblem */}
                <div className="w-9 h-9 rounded bg-white flex items-center justify-center shrink-0 border border-slate-300 overflow-hidden shadow-xs">
                  {data.firm.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.firm.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-600 flex items-center justify-center">
                      <svg viewBox="0 0 40 40" className="w-6 h-6 text-white" fill="none">
                        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                        <path d="M 20,6 L 24,18 L 34,20 L 24,24 L 20,34 L 16,24 L 6,20 L 16,18 Z" fill="currentColor" />
                        <circle cx="20" cy="20" r="3" fill="#ef4444" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h1 className="font-extrabold text-[11px] tracking-wider text-slate-950 uppercase font-mono truncate">
                    {data.firm.name}
                  </h1>
                  <p className="text-[8px] font-bold text-red-600 uppercase truncate">
                    {data.firm.subline}
                  </p>
                </div>
              </div>
              <div className="mt-1 text-[8px] text-slate-500 font-mono truncate">
                {data.firm.address}
              </div>
            </div>

            {/* Consulting Engineer */}
            <div
              className="mt-1.5 pt-1.5 border-t border-slate-200"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onEditTitleBlock?.('engineer');
              }}
            >
              <div className="flex items-center justify-between">
                <div className="font-black text-[10.5px] text-slate-950 font-mono">
                  {data.engineer.name}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerifyEngineer?.();
                  }}
                  className="text-[7px] font-bold uppercase px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <ShieldCheck className="w-2 h-2 text-emerald-600" />
                  {data.engineer.badge}
                </button>
              </div>
              <div className="text-[8px] text-slate-600 font-medium truncate">
                {data.engineer.title}
              </div>
              <div className="text-[7.5px] font-mono text-slate-500 truncate">
                {data.engineer.regNo}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[8px] font-mono font-bold text-red-600">
                <span>Ph: {data.engineer.phone}</span>
                <span>|</span>
                <a
                  href={`https://wa.me/${data.engineer.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Er.%20Deepak,%20regarding%20drawing%20${encodeURIComponent(data.drawingNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  WA: {data.engineer.whatsapp}
                </a>
              </div>
            </div>
          </div>

          {/* 2. PROJECT DETAILS & VASTHU (Col 5-7) */}
          <div
            className="col-span-3 p-2 flex flex-col justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEditTitleBlock?.('project');
            }}
          >
            <div className="space-y-0.5">
              <div className="flex items-start gap-1">
                <span className="font-bold text-slate-500 uppercase text-[7.5px] font-mono shrink-0">CLIENT:</span>
                <span className="font-bold text-slate-950 text-[9.5px] truncate">{data.client}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-bold text-slate-500 uppercase text-[7.5px] font-mono shrink-0">LOCATION:</span>
                <span className="text-slate-800 text-[8.5px] truncate">{data.location}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="font-bold text-slate-500 uppercase text-[7.5px] font-mono shrink-0">DRAWING:</span>
                <span className="font-bold text-slate-900 text-[9px] uppercase truncate">{data.drawingTitle}</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5 text-[8px] font-mono">
                <span>SCALE: <strong className="text-slate-950">{data.scale}</strong></span>
                <span>DATE: <strong className="text-slate-950">{data.date}</strong></span>
                <span>REV: <strong className="text-blue-700">{data.revision}</strong></span>
              </div>
            </div>

            {/* Vasthu Kol */}
            <div className="mt-1 p-1 rounded bg-amber-50/50 border border-amber-200 text-[8px] font-mono flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950">VASTHU: </span>
                <span>{data.vasthuKol.perimeterKol} Kol {data.vasthuKol.perimeterViral} Viral ({data.vasthuKol.meters.toFixed(2)}m)</span>
              </div>
              <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded text-[7px]">
                {data.vasthuKol.status}
              </span>
            </div>
          </div>

          {/* 3. AREA STATEMENT TABLE (Col 8-10) */}
          <div
            className="col-span-3 p-1.5 flex flex-col justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEditTitleBlock?.('area');
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-mono font-bold text-[8.5px] text-slate-900 uppercase">
                AREA STATEMENT (വിസ്തീർണ്ണം)
              </span>
              <span className="text-[7.5px] font-mono text-slate-500">sq.m</span>
            </div>
            <div className="border border-slate-300 overflow-hidden text-[7.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 font-mono">
                    <th className="p-0.5 text-left border-r border-slate-200">Floor</th>
                    <th className="p-0.5 text-center border-r border-slate-200">Builtup</th>
                    <th className="p-0.5 text-center">Floor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.areaStatement?.slice(0, 2).map((row) => (
                    <tr key={row.id}>
                      <td className="p-0.5 text-slate-800 truncate border-r border-slate-200 font-mono">{row.floor}</td>
                      <td className="p-0.5 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                        {row.proposedBuiltup ? row.proposedBuiltup.toFixed(1) : '-'}
                      </td>
                      <td className="p-0.5 text-center font-mono text-slate-600">
                        {row.proposedFloor ? row.proposedFloor.toFixed(1) : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold text-slate-950 border-t border-slate-300">
                    <td className="p-0.5 border-r border-slate-200 font-mono">TOTAL</td>
                    <td className="p-0.5 text-center text-blue-700 font-mono border-r border-slate-200">
                      {totalProposedBuiltup.toFixed(1)}
                    </td>
                    <td className="p-0.5 text-center font-mono">{totalProposedFloor.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[7.5px] font-mono text-right text-slate-700 mt-0.5">
              Built-up: <strong>{totalProposedBuiltup.toFixed(1)} m² ({totalSqFt} sq.ft)</strong>
            </div>
          </div>

          {/* 4. QR & DRAWING NO & STATUS (Col 11-12) */}
          <div className="col-span-2 p-1.5 flex flex-col justify-between bg-slate-50/50">
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-10 border border-slate-300 rounded p-0.5 bg-white shrink-0 flex items-center justify-center shadow-xs">
                {qrCodeUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-black text-[7.5px] uppercase font-mono text-slate-950">
                  SCAN FOR PDF
                </div>
                <div className="text-[6.5px] text-slate-500 truncate">Direct Free Access</div>
              </div>
            </div>

            <div className="text-right font-mono border-t border-slate-200 pt-1 mt-1">
              <div className="text-[6.5px] font-bold text-slate-500 uppercase">DRAWING NO.</div>
              <div className="font-black text-[11px] text-slate-950 tracking-tight">{data.drawingNumber}</div>
              <div className="text-[7px] font-black text-blue-700">{data.sheetStatus}</div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // VERTICAL RIGHT-HAND LAYOUT (DEFAULT FOR LANDSCAPE)
  // -------------------------------------------------------------
  return (
    <aside
      id="aia-title-block"
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEditTitleBlock?.('project');
      }}
      title="Double-click to edit complete Title Block attributes"
      className="w-80 min-w-80 border-l-2 border-slate-900 bg-white text-slate-900 flex flex-col justify-between select-none text-[11px] leading-tight font-sans tracking-tight shrink-0 relative group"
    >
      {/* Floating Quick Edit & Position Toggle Buttons */}
      {!isPrintMode && (
        <div className="absolute -top-7 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            type="button"
            onClick={() => onTogglePosition?.('bottom')}
            className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-mono hover:bg-slate-800 shadow cursor-pointer flex items-center gap-1"
            title="Move Title Block to Sheet Bottom"
          >
            <SlidersHorizontal className="w-2.5 h-2.5" />
            <span>Move to Bottom</span>
          </button>
          <button
            type="button"
            onClick={() => onEditTitleBlock?.('project')}
            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-mono hover:bg-blue-500 shadow cursor-pointer flex items-center gap-1"
            title="Edit Details & Logo"
          >
            <Edit3 className="w-2.5 h-2.5" />
            <span>Edit Attributes</span>
          </button>
        </div>
      )}

      {/* Live Automatic Timestamp Watermark Banner */}
      <div className="bg-slate-100 px-3 py-1 border-b border-slate-300 flex items-center justify-between text-[8px] font-mono text-slate-600">
        <div className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-blue-600" />
          <span>STAMPED: <strong>{data.date}</strong></span>
        </div>
        <span className="text-[7.5px] text-slate-400">DOUBLE-CLICK TO EDIT</span>
      </div>

      {/* 1. TOP FIRM BRANDING & LOGO */}
      <div
        className="p-3 border-b-2 border-slate-900 cursor-pointer hover:bg-slate-50/70 transition-colors"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEditTitleBlock?.('company');
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Custom Logo or Default Emblem */}
          <div className="w-11 h-11 rounded border border-slate-300 bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
            {data.firm.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.firm.logoUrl}
                alt="Firm Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-red-600 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-7 h-7 text-white" fill="none">
                  <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                  <path d="M 20,6 L 24,18 L 34,20 L 24,24 L 20,34 L 16,24 L 6,20 L 16,18 Z" fill="currentColor" />
                  <circle cx="20" cy="20" r="3" fill="#ef4444" />
                </svg>
              </div>
            )}
          </div>

          <div className="overflow-hidden flex-1 min-w-0">
            <h1 className="font-extrabold text-[12.5px] tracking-wider text-slate-950 uppercase leading-none font-mono truncate">
              {data.firm.name}
            </h1>
            <p className="text-[9px] font-bold text-red-600 tracking-wider mt-0.5 uppercase truncate">
              {data.firm.subline}
            </p>
          </div>
        </div>

        <div className="mt-2 text-[9px] text-slate-600 leading-normal border-t border-slate-200 pt-1.5 font-mono">
          <div className="truncate">{data.firm.address}</div>
          <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-slate-700">
            <span>Ph: <strong className="text-slate-950">{data.firm.phone}</strong></span>
            <span>|</span>
            <span>WA: <strong className="text-slate-950">{data.firm.whatsapp}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. LICENSED CONSULTING ENGINEER SECTION */}
      <div
        className="p-3 border-b-2 border-slate-900 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEditTitleBlock?.('engineer');
        }}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            LICENSED CONSULTING ENGINEER
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVerifyEngineer?.();
            }}
            title="Click to verify credentials"
            className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            {data.engineer.badge}
          </button>
        </div>

        <div className="font-black text-[14px] text-slate-950 tracking-tight font-mono">
          {data.engineer.name}
        </div>
        <div className="text-[10px] font-semibold text-slate-700 mt-0.5">
          {data.engineer.title}
        </div>
        <div className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">
          {data.engineer.regNo}
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-200">
          <a
            href={`tel:${data.engineer.phone}`}
            className="flex items-center justify-center gap-1 py-1 px-2 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] transition-colors shadow-xs"
          >
            <Phone className="w-3 h-3 text-red-600" />
            <span>{data.engineer.phone}</span>
          </a>

          <a
            href={`https://wa.me/${data.engineer.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Er.%20Deepak,%20regarding%20drawing%20${encodeURIComponent(data.drawingNumber)}%20(${encodeURIComponent(data.drawingTitle)})`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1 px-2 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition-colors shadow-xs"
          >
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* 3. PROJECT ATTRIBUTES GRID */}
      <div
        className="divide-y border-b-2 border-slate-900 cursor-pointer hover:bg-slate-50/40 transition-colors"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEditTitleBlock?.('project');
        }}
      >
        <div className="p-2.5 grid grid-cols-4 gap-1">
          <span className="font-bold text-slate-500 uppercase text-[9px] font-mono col-span-1">CLIENT:</span>
          <span className="font-bold text-slate-950 text-[10.5px] col-span-3 truncate" title={data.client}>
            {data.client}
          </span>
        </div>

        <div className="p-2.5 grid grid-cols-4 gap-1">
          <span className="font-bold text-slate-500 uppercase text-[9px] font-mono col-span-1">LOCATION:</span>
          <span className="font-medium text-slate-800 text-[9.5px] col-span-3 leading-snug truncate" title={data.location}>
            {data.location}
          </span>
        </div>

        <div className="p-2.5 grid grid-cols-4 gap-1">
          <span className="font-bold text-slate-500 uppercase text-[9px] font-mono col-span-1">DRAWING:</span>
          <span className="font-bold text-slate-900 text-[10px] col-span-3 uppercase tracking-tight truncate" title={data.drawingTitle}>
            {data.drawingTitle}
          </span>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-200">
          <div className="p-2 flex items-center justify-between">
            <span className="font-bold text-slate-500 uppercase text-[8.5px] font-mono">SCALE:</span>
            <span className="font-black text-slate-950 text-[10px] font-mono">{data.scale}</span>
          </div>
          <div className="p-2 flex items-center justify-between">
            <span className="font-bold text-slate-500 uppercase text-[8.5px] font-mono">DATE:</span>
            <span className="font-bold text-slate-950 text-[9.5px] font-mono">{data.date}</span>
          </div>
        </div>
      </div>

      {/* 4. AREA STATEMENT TABLE */}
      <div
        className="p-2.5 border-b-2 border-slate-900 bg-white cursor-pointer hover:bg-slate-50/50 transition-colors"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEditTitleBlock?.('area');
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <span className="font-black text-[10px] text-slate-950 uppercase tracking-wider font-mono">
              AREA STATEMENT
            </span>
            <span className="text-[9px] text-slate-500 font-normal">
              (വിസ്തീർണ്ണം)
            </span>
          </div>
          <span className="text-[8px] font-mono text-slate-400">sq.m</span>
        </div>

        <div className="border border-slate-400 overflow-hidden text-[8.5px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 text-slate-700 font-bold">
                <th className="p-1 text-left border-r border-slate-300 font-mono">Floor</th>
                <th className="p-1 text-center border-r border-slate-300 font-mono" colSpan={2}>
                  PROPOSED (sqm)
                </th>
                <th className="p-1 text-center font-mono" colSpan={2}>
                  EXISTING (sqm)
                </th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-300 text-[7.5px] text-slate-500 font-mono">
                <th className="p-0.5 border-r border-slate-300"></th>
                <th className="p-0.5 text-center border-r border-slate-200">Built-up</th>
                <th className="p-0.5 text-center border-r border-slate-300">Floor</th>
                <th className="p-0.5 text-center border-r border-slate-200">Built-up</th>
                <th className="p-0.5 text-center">Floor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.areaStatement?.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="p-1 text-slate-800 font-medium truncate max-w-[80px] border-r border-slate-200" title={row.floor}>
                    {row.floor}
                  </td>
                  <td className="p-1 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                    {row.proposedBuiltup ? row.proposedBuiltup.toFixed(1) : '-'}
                  </td>
                  <td className="p-1 text-center font-mono text-slate-600 border-r border-slate-200">
                    {row.proposedFloor ? row.proposedFloor.toFixed(1) : '-'}
                  </td>
                  <td className="p-1 text-center font-mono text-slate-400 border-r border-slate-200">
                    {row.existingBuiltup ? row.existingBuiltup.toFixed(1) : '-'}
                  </td>
                  <td className="p-1 text-center font-mono text-slate-400">
                    {row.existingFloor ? row.existingFloor.toFixed(1) : '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-extrabold text-slate-950 border-t-2 border-slate-400">
                <td className="p-1 border-r border-slate-300 uppercase font-mono">TOTAL</td>
                <td className="p-1 text-center text-blue-700 font-mono border-r border-slate-200">
                  {totalProposedBuiltup.toFixed(1)}
                </td>
                <td className="p-1 text-center font-mono border-r border-slate-200">
                  {totalProposedFloor.toFixed(1)}
                </td>
                <td className="p-1 text-center font-mono border-r border-slate-200">
                  {totalExistingBuiltup.toFixed(1)}
                </td>
                <td className="p-1 text-center font-mono">
                  {totalExistingFloor.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-1 text-right text-[8.5px] font-bold text-slate-800 font-mono">
          Total Built-up: <strong className="text-slate-950">{totalProposedBuiltup.toFixed(2)} Sq.M ({totalSqFt} Sq.Ft)</strong>
        </div>
      </div>

      {/* 5. VASTHU KOL */}
      <div
        className="p-2.5 border-b-2 border-slate-900 bg-amber-50/30 cursor-pointer hover:bg-amber-50/50 transition-colors"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEditTitleBlock?.('vasthu');
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-[10px] text-slate-950 uppercase tracking-wider font-mono">
              VASTHU KOL
            </span>
            <span className="text-[9px] text-amber-900 font-medium">
              (വാസ്തു അളവ്)
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            {data.vasthuKol.status}
          </span>
        </div>
        <div className="text-[9.5px] font-mono text-slate-700 mt-1 flex items-center justify-between">
          <span>Perimeter: <strong>{data.vasthuKol.perimeterKol} Kol {data.vasthuKol.perimeterViral} Viral</strong></span>
          <span className="text-slate-500 text-[8.5px]">({data.vasthuKol.meters.toFixed(2)} m)</span>
        </div>
      </div>

      {/* 6. QR CODE VERIFICATION */}
      <div className="p-2.5 border-b-2 border-slate-900 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-16 h-16 border border-slate-300 rounded p-0.5 bg-white shrink-0 flex items-center justify-center shadow-xs">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Scan to download PDF drawing and verify credentials"
                className="w-full h-full object-contain"
              />
            ) : (
              <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-black text-[10px] text-slate-950 uppercase tracking-wider font-mono">
              SCAN FOR PLAN PDF
            </div>
            <div className="text-[8.5px] text-slate-600 mt-0.5 leading-tight">
              Direct download • Free access
            </div>
            <div className="text-[8.5px] font-mono font-bold text-red-600 mt-0.5">
              Ph: {data.engineer.phone}
            </div>

            {!isPrintMode && (
              <a
                href={publicShareUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-[8.5px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                <span>OPEN LINK</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 7. DRAWING IDENTIFICATION & SHEET STATUS */}
      <div className="p-3 bg-slate-50 flex items-end justify-between font-mono">
        <div>
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            DRAWING NO.
          </div>
          <div className="font-black text-[13px] text-slate-950 tracking-wider">
            {data.drawingNumber}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            SHEET STATUS
          </div>
          <div className="font-black text-[11px] text-blue-700 tracking-wider">
            {data.sheetStatus}
          </div>
        </div>
      </div>
    </aside>
  );
};
