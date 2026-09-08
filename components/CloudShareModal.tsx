'use client';

import React, { useState, useEffect } from 'react';
import { ArchitecturalProject } from '@/lib/types';
import { generateQrDataUrl } from '@/lib/qr';
import {
  Share2,
  Copy,
  Check,
  X,
  QrCode,
  Smartphone,
  Laptop,
  Cloud,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  Clock,
} from 'lucide-react';

interface CloudShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ArchitecturalProject;
  shareUrl: string;
  isSaving: boolean;
  onSaveToCloud: () => Promise<void>;
}

export const CloudShareModal: React.FC<CloudShareModalProps> = ({
  isOpen,
  onClose,
  project,
  shareUrl,
  isSaving,
  onSaveToCloud,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [shareTimestamp] = useState(() => {
    const now = new Date();
    return (
      now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' ' +
      now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
  });

  useEffect(() => {
    if (shareUrl) {
      generateQrDataUrl(shareUrl).then((url) => setQrUrl(url));
    }
  }, [shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // WhatsApp Share Message with Automatic Date & Time Watermark
  const handleWhatsAppShare = () => {
    const title = project.titleBlock?.drawingTitle || project.name || 'Architectural Drawing';
    const dwgNo = project.titleBlock?.drawingNumber || 'DWG-2026/01';
    const client = project.titleBlock?.client || 'Client';
    const location = project.titleBlock?.location || 'Kerala';
    const scale = project.titleBlock?.scale || '1:100';
    const engineer = project.titleBlock?.engineer?.name || 'Er. Deepak C';

    const message =
      `📐 *VASTHUSILPY ARCHITECTURAL STUDIO*\n` +
      `📄 *Drawing:* ${title} (${dwgNo})\n` +
      `👤 *Client:* ${client}\n` +
      `📍 *Location:* ${location}\n` +
      `📏 *Scale:* ${scale} | *Paper:* ${(project.paperSize || 'A3').toUpperCase()}\n` +
      `🕒 *Watermark Stamp:* ${shareTimestamp}\n` +
      `👨‍💼 *Consulting Engineer:* ${engineer}\n\n` +
      `🔗 *Direct Client Access / PDF Download:* \n${shareUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Native Web Share API if supported
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.titleBlock?.drawingTitle || 'Architectural Drawing',
          text: `Vasthusilpy Architectural Drawing - ${project.titleBlock?.drawingTitle} (Stamped: ${shareTimestamp})`,
          url: shareUrl,
        });
      } catch (e) {
        // user cancelled or share failed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100 font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Cloud className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide font-mono uppercase">
              SHARE ARCHITECTURAL DRAWING
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              WhatsApp share • QR Code • Direct PDF access
            </p>
          </div>
        </div>

        {/* Automatic Timestamp / Watermark Notice */}
        <div className="p-2.5 bg-blue-500/10 border border-blue-400/20 rounded-xl mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-blue-300 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>WATERMARK: {shareTimestamp}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            Auto-Stamped
          </span>
        </div>

        {/* QR Code Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center mb-4 backdrop-blur-md">
          <div className="w-40 h-40 bg-white border-2 border-white/20 rounded-xl p-2 shadow-lg mb-2.5 flex items-center justify-center">
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt="QR Code for project sharing"
                className="w-full h-full object-contain"
              />
            ) : (
              <QrCode className="w-14 h-14 text-slate-400 animate-pulse" />
            )}
          </div>

          <div className="font-bold text-xs text-white font-mono">
            SCAN TO OPEN ON MOBILE / TABLET
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
            Direct client download with automatic verification stamp.
          </p>
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 border border-emerald-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-100" />
            <span>Share via WhatsApp</span>
          </button>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 border border-blue-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Share Link Input Field */}
        <div className="space-y-1 mb-4">
          <label className="text-[10px] font-mono font-bold text-slate-400 block">
            PUBLIC SHAREABLE URL
          </label>
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full border border-white/15 bg-white/5 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 select-all focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Sync Status / Close */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onSaveToCloud}
            disabled={isSaving}
            className="text-[11px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Syncing...' : 'Sync Cloud Now'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
