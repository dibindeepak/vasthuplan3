'use client';

import React, { useState } from 'react';
import { ArchitecturalProject } from '@/lib/types';
import { createNewBlankProject, SAMPLE_CLINIC_PROJECT } from '@/lib/default-project';
import { exportProjectToPdf } from '@/lib/pdf';
import {
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Download,
  Share2,
  ExternalLink,
  Edit3,
  Layers,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Sparkles,
  X,
  Compass,
  MessageCircle,
} from 'lucide-react';

interface DrawingsDashboardProps {
  projects: ArchitecturalProject[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (project: ArchitecturalProject) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onOpenShareModal: (project: ArchitecturalProject) => void;
  onCloseDashboard: () => void;
}

export const DrawingsDashboard: React.FC<DrawingsDashboardProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onOpenShareModal,
  onCloseDashboard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'a3' | 'a4'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [downloadingProjectId, setDownloadingProjectId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('New Architectural Drawing');
  const [newClient, setNewClient] = useState('Client Name');
  const [newLocation, setNewLocation] = useState('Kerala, India');
  const [newSize, setNewSize] = useState<'a4' | 'a3'>('a3');
  const [newOrientation, setNewOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [newDwgNum, setNewDwgNum] = useState(`DWG-2026/${String(projects.length + 1).padStart(2, '0')}`);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (p.titleBlock?.drawingTitle || p.name || '').toLowerCase().includes(q);
    const clientMatch = (p.titleBlock?.client || '').toLowerCase().includes(q);
    const dwgMatch = (p.titleBlock?.drawingNumber || '').toLowerCase().includes(q);
    const locMatch = (p.titleBlock?.location || '').toLowerCase().includes(q);
    const textMatch = titleMatch || clientMatch || dwgMatch || locMatch;

    const currentPaper = p.paperSize || p.pages?.[0]?.paperSize || 'a3';
    const sizeMatch = sizeFilter === 'all' || currentPaper === sizeFilter;

    return textMatch && sizeMatch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj = createNewBlankProject(newTitle, newSize, newOrientation, newDwgNum);
    if (newProj.titleBlock) {
      newProj.titleBlock.client = newClient;
      newProj.titleBlock.location = newLocation;
      newProj.titleBlock.drawingTitle = newTitle.toUpperCase();
    }
    onCreateProject(newProj);
    setIsCreateModalOpen(false);
    onCloseDashboard();
  };

  const handleDownloadPdf = async (project: ArchitecturalProject) => {
    setDownloadingProjectId(project.id);
    setDownloadProgress('Preparing PDF...');

    try {
      const result = await exportProjectToPdf(project, (p) => {
        setDownloadProgress(p.status);
      });

      if (result.success) {
        setNotification(`PDF downloaded: ${result.filename || 'Drawing Sheet'}`);
      } else {
        setNotification(`Download notice: ${result.message}`);
      }
    } catch (err) {
      console.error('Download error:', err);
      setNotification('PDF generation encountered an issue. Try again or print sheet.');
    } finally {
      setDownloadingProjectId(null);
      setDownloadProgress(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleLoadSample = () => {
    onCreateProject(SAMPLE_CLINIC_PROJECT);
    setNotification('Loaded sample Clinic & Lab project with multiple sheets!');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleWhatsAppShare = (proj: ArchitecturalProject) => {
    const now = new Date();
    const watermarkTimestamp =
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
      });

    const shareLink =
      typeof window !== 'undefined'
        ? `${window.location.origin}?project=${proj.id}`
        : `https://vasthusilpy.arch?project=${proj.id}`;

    const firmName =
      proj.titleBlock?.company?.name ||
      proj.titleBlock?.firm?.name ||
      'Vasthusilpy Architectural Consultants';

    const text = encodeURIComponent(
      `📐 *${proj.titleBlock?.drawingTitle || proj.name}*\n` +
        `• Drawing No: ${proj.titleBlock?.drawingNumber || 'DWG-01'}\n` +
        `• Client: ${proj.titleBlock?.client || 'Client'}\n` +
        `• Sheets: ${proj.pages?.length || 1} (${(proj.paperSize || 'a3').toUpperCase()} ${proj.orientation || 'landscape'})\n` +
        `• Watermark: Stamped on ${watermarkTimestamp}\n\n` +
        `🔗 View Online Drawing: ${shareLink}\n\n` +
        `Consulting Engineer: ${proj.titleBlock?.engineer?.name || 'Architect'} (${proj.titleBlock?.engineer?.regNo || ''})\n` +
        `${firmName}`
    );

    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1329]/90 backdrop-blur-2xl text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-blue-400/40 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* DASHBOARD TOP BAR */}
      <header className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-sm font-mono shadow-lg shadow-blue-600/30 border border-white/20">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wider uppercase font-mono text-white">
                ARCHITECTURAL DRAWINGS DASHBOARD
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px] text-blue-300 uppercase tracking-widest font-mono font-bold">
                {projects.length} Saved {projects.length === 1 ? 'Drawing' : 'Drawings'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Vasthusilpy Architectural Studio • Manage, edit, view, delete, share, and export multi-page PDFs
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Load pre-populated multi-page architectural clinic & lab drawing"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Load Sample Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Blank Drawing</span>
          </button>

          <div className="w-px h-6 bg-white/15 mx-1" />

          <button
            type="button"
            onClick={onCloseDashboard}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Studio Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SEARCH, FILTER & STATS BAR */}
      <div className="px-6 py-3 border-b border-white/5 bg-black/20 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drawings by title, drawing no, client, location..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1">Paper Size:</span>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5">
            {(['all', 'a3', 'a4'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSizeFilter(sz)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  sizeFilter === sz
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DRAWINGS GRID REPOSITORY */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">No Drawings Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? 'No architectural drawings match your search query. Try clearing filters.'
                : 'Create your first blank architectural sheet or load a sample plan to begin drafting.'}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              + Create Blank Drawing Sheet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              const pageCount = proj.pages?.length || 1;
              const currentPaper = proj.paperSize || proj.pages?.[0]?.paperSize || 'a3';
              const currentOrientation = proj.orientation || proj.pages?.[0]?.orientation || 'landscape';
              const planCount = proj.pages?.reduce((sum, p) => sum + (p.plans?.length || 0), 0) ?? 0;
              const isDownloading = downloadingProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col bg-white/5 backdrop-blur-xl ${
                    isActive
                      ? 'border-blue-500/70 shadow-2xl shadow-blue-500/15'
                      : 'border-white/10 hover:border-white/25 hover:shadow-xl'
                  }`}
                >
                  {/* Card Top Banner / Drawing Sheet Header */}
                  <div className="p-4 border-b border-white/10 bg-black/20 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-mono font-bold text-blue-300">
                          {proj.titleBlock?.drawingNumber || 'DWG-2026/01'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Rev: {proj.titleBlock?.revision || 'R0'}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 font-mono">
                            ACTIVE IN STUDIO
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-black text-white font-mono uppercase line-clamp-1">
                        {proj.titleBlock?.drawingTitle || proj.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9.5px] font-mono font-bold text-slate-300 uppercase">
                        {currentPaper} • {currentOrientation === 'landscape' ? 'Land.' : 'Port.'}
                      </span>
                    </div>
                  </div>

                  {/* Card Middle: Metadata & Project Attributes */}
                  <div className="p-4 flex-1 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">Client: <strong className="text-white">{proj.titleBlock?.client || 'N/A'}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate text-[11px] text-slate-400">
                        {proj.titleBlock?.location || 'Kerala, India'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-white/10 text-[10.5px] font-mono text-slate-400">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>{pageCount} {pageCount === 1 ? 'Sheet' : 'Sheets'} (Multi-Page)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{planCount} {planCount === 1 ? 'Plan' : 'Plans'}</span>
                      </div>
                    </div>

                    {proj.titleBlock?.vasthuKol && (
                      <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 flex items-center justify-between font-mono">
                        <span>Vasthu Kol:</span>
                        <span className="font-bold">{proj.titleBlock.vasthuKol.status || 'Uttamam'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Action Toolbar */}
                  <div className="p-3 border-t border-white/10 bg-white/5 flex items-center justify-between gap-1.5">
                    {/* Primary: Open & Edit in Studio */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProject(proj.id);
                        onCloseDashboard();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 border border-blue-400/30 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isActive ? 'Continue Editing' : 'Open in Studio'}</span>
                    </button>

                    {/* Download PDF Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(proj)}
                      disabled={isDownloading}
                      className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                      title="Download full multi-page PDF"
                    >
                      <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-blue-400' : ''}`} />
                    </button>

                    {/* Share & QR Code */}
                    <button
                      type="button"
                      onClick={() => onOpenShareModal(proj)}
                      className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer"
                      title="Share cloud link & QR code"
                    >
                      <Share2 className="w-4 h-4 text-blue-400" />
                    </button>

                    {/* Direct WhatsApp Share */}
                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(proj)}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                      title="Share Drawing via WhatsApp with timestamp watermark"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => onDuplicateProject(proj.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-slate-200 hover:text-white transition-all cursor-pointer"
                      title="Duplicate project sheet"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete drawing "${proj.titleBlock?.drawingTitle || proj.name}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                        title="Delete drawing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NEW BLANK DRAWING MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-200 font-sans">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white font-mono uppercase">
                  CREATE NEW BLANK DRAWING
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Starts with zero plans on the sheet so you can draft or attach cleanly
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  DRAWING TITLE
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. PROPOSED RESIDENTIAL BUILDING"
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-white font-bold uppercase focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    DRAWING NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={newDwgNum}
                    onChange={(e) => setNewDwgNum(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2 font-mono text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    CLIENT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  LOCATION
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Palakkad, Kerala"
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Paper Size & Orientation Selectors */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5">
                    PAPER SIZE
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewSize('a3')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newSize === 'a3'
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      A3 (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewSize('a4')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newSize === 'a4'
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      A4 (Compact)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5">
                    ORIENTATION
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewOrientation('landscape')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newOrientation === 'landscape'
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Landscape
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewOrientation('portrait')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newOrientation === 'portrait'
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Portrait
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all cursor-pointer"
                >
                  Create & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
