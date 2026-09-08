'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArchitecturalProject,
  DrawingPage,
  ArchitecturalPlan,
  DrawingElement,
  TitleBlockData,
} from '@/lib/types';
import {
  DEFAULT_PROJECT,
  createNewBlankProject,
  createBlankPage,
  SAMPLE_CLINIC_PROJECT,
} from '@/lib/default-project';
import { SideDock } from '@/components/SideDock';
import { DraftingCanvas } from '@/components/DraftingCanvas';
import { DrawingsDashboard } from '@/components/DrawingsDashboard';
import { TitleBlock } from '@/components/TitleBlock';
import { VerificationModal } from '@/components/VerificationModal';
import { CloudShareModal } from '@/components/CloudShareModal';
import {
  EditPlanModal,
  EditElementModal,
  EditTitleBlockModal,
  EditSheetModal,
} from '@/components/AttributeEditModals';
import { exportProjectToPdf, PdfExportProgress } from '@/lib/pdf';
import {
  Download,
  Share2,
  Printer,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  RefreshCw,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  Layout,
  FileDown,
  AlertCircle,
  Trash2,
  Save,
} from 'lucide-react';

const STORAGE_KEY = 'vasthusilpy_projects_v2';

export default function ArchitecturalStudioPage() {
  // Projects State - initialized deterministically to DEFAULT_PROJECT for SSR/Hydration matching
  const [projects, setProjects] = useState<ArchitecturalProject[]>([DEFAULT_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState<string>(DEFAULT_PROJECT.id);
  const isStorageLoadedRef = useRef<boolean>(false);

  // Active Sheet / Page index within active project
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Selections
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // UI Panels
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isSideDockOpen, setIsSideDockOpen] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

  // Calibration tool state
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  // Attribute Editing Modals State (Triggered by double-click or edit buttons)
  const [editingPlan, setEditingPlan] = useState<ArchitecturalPlan | null>(null);
  const [editingElement, setEditingElement] = useState<DrawingElement | null>(null);
  const [editingTitleBlockTab, setEditingTitleBlockTab] = useState<
    'project' | 'company' | 'engineer' | 'area' | 'vasthu' | null
  >(null);
  const [isEditingSheet, setIsEditingSheet] = useState<boolean>(false);

  // Cloud Sync & PDF state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfProgressStatus, setPdfProgressStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
    actionUrl?: string;
  } | null>(null);

  // File input ref for quick add plan
  const quickPlanInputRef = useRef<HTMLInputElement>(null);

  // Check LocalStorage & URL query param for shared project on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as ArchitecturalProject[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
            setActiveProjectId(parsed[0].id);
          }
        }
      } catch {
        // ignore
      }
      isStorageLoadedRef.current = true;
    }, 0);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get('project') || params.get('id');
      if (sharedId) {
        fetch(`/api/projects/${sharedId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.project) {
              setProjects((prev) => {
                const exists = prev.find((p) => p.id === data.project.id);
                if (exists) return prev;
                return [data.project, ...prev];
              });
              setActiveProjectId(data.project.id);
            }
          })
          .catch((e) => console.warn('Could not load remote project:', e));
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Save projects to LocalStorage whenever projects list changes (only after storage was initially loaded)
  useEffect(() => {
    if (!isStorageLoadedRef.current) return;
    if (typeof window !== 'undefined' && projects.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      } catch (err) {
        console.warn('Failed to save projects to storage:', err);
      }
    }
  }, [projects]);

  // Derived current active project & page
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECT;

  // Clamped page index
  const safePageIndex = Math.min(
    Math.max(0, activePageIndex),
    Math.max(0, (activeProject.pages?.length || 1) - 1)
  );

  const activePage: DrawingPage =
    activeProject.pages && activeProject.pages.length > 0
      ? activeProject.pages[safePageIndex] || activeProject.pages[0]
      : {
          id: 'page-fallback-default',
          pageNumber: 1,
          sheetTitle: activeProject.titleBlock?.drawingTitle || 'ARCHITECTURAL DRAWING SHEET',
          sheetNumber: activeProject.titleBlock?.drawingNumber || 'DWG-2026/01',
          paperSize: activeProject.paperSize || 'a3',
          orientation: activeProject.orientation || 'landscape',
          plans: [],
          elements: activeProject.elements || [],
          titleBlock: activeProject.titleBlock,
          viewport: activeProject.viewport,
          margins: activeProject.margins || { top: 12, right: 12, bottom: 12, left: 12 },
          titleBlockPosition: activeProject.titleBlockPosition || 'auto',
        };

  // Helper to update the active project
  const handleUpdateProject = (
    updater: (prev: ArchitecturalProject) => ArchitecturalProject
  ) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === activeProject.id ? updater(proj) : proj))
    );
  };

  // Helper to update the active page within the active project
  const handleUpdateActivePage = (updater: (page: DrawingPage) => DrawingPage) => {
    handleUpdateProject((proj) => {
      const updatedPages = proj.pages.map((pg, idx) =>
        idx === safePageIndex ? updater(pg) : pg
      );
      return {
        ...proj,
        pages: updatedPages,
        updatedAt: new Date().toISOString(),
        titleBlock: idxActivePageMatch(updatedPages, safePageIndex, proj.titleBlock),
      };
    });
  };

  const idxActivePageMatch = (
    pages: DrawingPage[],
    idx: number,
    fallback: ArchitecturalProject['titleBlock']
  ) => {
    return pages[idx]?.titleBlock || fallback;
  };

  // Update plans on active page
  const handleUpdatePlans = (plans: ArchitecturalPlan[]) => {
    handleUpdateActivePage((page) => ({ ...page, plans }));
  };

  // Add plan to active page
  const handleAddPlan = (newPlan: ArchitecturalPlan) => {
    handleUpdateActivePage((page) => ({
      ...page,
      plans: [...page.plans, newPlan],
    }));
  };

  // Delete plan from active page
  const handleDeletePlan = useCallback((planId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        const targetPageIdx = Math.min(
          Math.max(0, activePageIndex),
          Math.max(0, (proj.pages?.length || 1) - 1)
        );
        const updatedPages = proj.pages.map((pg, idx) =>
          idx === targetPageIdx ? { ...pg, plans: pg.plans.filter((p) => p.id !== planId) } : pg
        );
        return { ...proj, pages: updatedPages, updatedAt: new Date().toISOString() };
      })
    );
    setSelectedPlanId((current) => (current === planId ? null : current));
  }, [activeProjectId, activePageIndex]);

  // Update elements on active page
  const handleUpdateElements = (elements: DrawingElement[]) => {
    handleUpdateActivePage((page) => ({ ...page, elements }));
  };

  // Add element to active page
  const handleAddElement = (element: DrawingElement) => {
    handleUpdateActivePage((page) => ({
      ...page,
      elements: [...page.elements, element],
    }));
  };

  // Delete element from active page
  const handleDeleteElement = useCallback((elementId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== activeProjectId) return proj;
        const targetPageIdx = Math.min(
          Math.max(0, activePageIndex),
          Math.max(0, (proj.pages?.length || 1) - 1)
        );
        const updatedPages = proj.pages.map((pg, idx) =>
          idx === targetPageIdx ? { ...pg, elements: pg.elements.filter((el) => el.id !== elementId) } : pg
        );
        return { ...proj, pages: updatedPages, updatedAt: new Date().toISOString() };
      })
    );
    setSelectedElementId((current) => (current === elementId ? null : current));
  }, [activeProjectId, activePageIndex]);

  // Delete Selected Item (Plan or Element)
  const handleDeleteSelectedItem = useCallback(() => {
    if (selectedPlanId) {
      handleDeletePlan(selectedPlanId);
      setToastMessage({ text: 'Selected plan deleted', type: 'info' });
      setTimeout(() => setToastMessage(null), 2500);
    } else if (selectedElementId) {
      handleDeleteElement(selectedElementId);
      setToastMessage({ text: 'Selected element deleted', type: 'info' });
      setTimeout(() => setToastMessage(null), 2500);
    }
  }, [selectedPlanId, selectedElementId, handleDeletePlan, handleDeleteElement]);

  // Multi-Page Management
  const handleAddPage = (
    paperSize: 'a4' | 'a3' = activePage.paperSize || 'a3',
    orientation: 'landscape' | 'portrait' = activePage.orientation || 'landscape'
  ) => {
    const nextNum = activeProject.pages.length + 1;
    const newPage = createBlankPage(
      nextNum,
      paperSize,
      orientation,
      `Sheet ${nextNum} - ${activeProject.name}`,
      `DWG-2026/${String(nextNum).padStart(2, '0')}`
    );

    handleUpdateProject((proj) => ({
      ...proj,
      pages: [...proj.pages, newPage],
    }));
    setActivePageIndex(activeProject.pages.length);
    setToastMessage({
      text: `Added Sheet ${nextNum} (${paperSize.toUpperCase()} ${orientation})`,
      type: 'success',
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDuplicatePage = (pageIndex: number) => {
    const sourcePage = activeProject.pages[pageIndex];
    if (!sourcePage) return;

    const nextNum = activeProject.pages.length + 1;
    const duplicatedPage: DrawingPage = {
      ...sourcePage,
      id: `page-${nextNum}-${Date.now().toString(36)}`,
      pageNumber: nextNum,
      sheetTitle: `${sourcePage.sheetTitle} (Copy)`,
      sheetNumber: `DWG-2026/${String(nextNum).padStart(2, '0')}`,
      plans: sourcePage.plans.map((p) => ({
        ...p,
        id: `plan-copy-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      })),
      elements: sourcePage.elements.map((el) => ({
        ...el,
        id: `elem-copy-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      })),
      titleBlock: {
        ...sourcePage.titleBlock,
        drawingNumber: `DWG-2026/${String(nextNum).padStart(2, '0')}`,
      },
    };

    handleUpdateProject((proj) => ({
      ...proj,
      pages: [...proj.pages, duplicatedPage],
    }));
    setActivePageIndex(activeProject.pages.length);
    setToastMessage({ text: `Duplicated Sheet as Sheet ${nextNum}`, type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeletePage = (pageIndex: number) => {
    if (activeProject.pages.length <= 1) {
      setToastMessage({ text: 'Project must contain at least 1 drawing sheet.', type: 'error' });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    handleUpdateProject((proj) => {
      const nextPages = proj.pages.filter((_, idx) => idx !== pageIndex);
      return { ...proj, pages: nextPages };
    });
    setActivePageIndex((prev) => Math.max(0, prev - 1));
    setToastMessage({ text: 'Drawing sheet deleted', type: 'info' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cloud Save
  const handleSaveToCloud = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: activeProject }),
      });

      const result = await response.json();
      if (result.success) {
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setToastMessage({ text: 'Drawing saved successfully (Ctrl+S)', type: 'success' });
      }
    } catch (error) {
      console.error('Cloud save failed:', error);
      setToastMessage({ text: 'Cloud save sync failed. Saved to local browser cache.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  }, [activeProject]);

  // Keyboard Shortcuts: Ctrl+S to save, Delete / Backspace to delete selected item
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ctrl+S or Cmd+S -> Save drawing
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveToCloud();
        return;
      }

      // Delete or Backspace -> Delete selected plan or element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedPlanId || selectedElementId) {
          e.preventDefault();
          handleDeleteSelectedItem();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedPlanId, selectedElementId, handleSaveToCloud, handleDeleteSelectedItem]);

  // PDF Export Handler with Robust Multi-Page Support & Watermark
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setPdfProgressStatus('Preparing architectural sheets...');

    try {
      const result = await exportProjectToPdf(
        activeProject,
        (progress: PdfExportProgress) => {
          setPdfProgressStatus(progress.status);
        },
        { exportAllPages: true }
      );

      if (result.success) {
        setToastMessage({
          text: `PDF Downloaded: ${result.filename || 'Architectural Drawing'}`,
          type: 'success',
          actionUrl: result.blobUrl,
        });
      } else {
        setToastMessage({
          text: `Download notice: ${result.message}`,
          type: 'error',
        });
      }
    } catch (err) {
      console.error('PDF export error:', err);
      setToastMessage({
        text: 'PDF export encountered an issue. Using direct print fallback.',
        type: 'error',
      });
    } finally {
      setIsExportingPdf(false);
      setPdfProgressStatus(null);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Direct Print Drawing
  const handlePrintDrawing = () => {
    window.print();
  };

  // Quick WhatsApp Share
  const handleWhatsAppShare = () => {
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
      });

    const shareLink =
      typeof window !== 'undefined'
        ? `${window.location.origin}?project=${activeProject.id}`
        : `https://vasthusilpy.arch?project=${activeProject.id}`;

    const firmName =
      activeProject.titleBlock?.firm?.name ||
      activeProject.titleBlock?.company?.name ||
      'Vasthusilpy Architectural Consultants';

    const text = encodeURIComponent(
      `📐 *${activeProject.titleBlock?.drawingTitle || activeProject.name}*\n` +
        `• Drawing No: ${activeProject.titleBlock?.drawingNumber || 'DWG-01'}\n` +
        `• Client: ${activeProject.titleBlock?.client || 'Client'}\n` +
        `• Sheets: ${activeProject.pages.length} (${activePage.paperSize.toUpperCase()} ${activePage.orientation})\n` +
        `• Watermark: Stamped on ${watermarkTimestamp}\n\n` +
        `🔗 View Online Drawing: ${shareLink}\n\n` +
        `Consulting Engineer: ${activeProject.titleBlock?.engineer.name} (${activeProject.titleBlock?.engineer.regNo})\n` +
        `${firmName}`
    );

    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Quick Plan Upload Trigger
  const handleQuickAddPlanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxW = 560;
        const ratio = img.height / img.width;
        const width = Math.min(img.width, maxW);
        const height = Math.round(width * ratio);
        const offset = activePage.plans.length * 30;

        const newPlan: ArchitecturalPlan = {
          id: `plan-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          imageUrl: dataUrl,
          x: 40 + offset,
          y: 40 + offset,
          width,
          height,
          scale: 1.0,
          scaleRatioText: '1:100',
          rotation: 0,
          opacity: 0.95,
          visible: true,
        };

        handleAddPlan(newPlan);
        setSelectedPlanId(newPlan.id);
        setToastMessage({ text: `Added plan: ${newPlan.name}`, type: 'success' });
        setTimeout(() => setToastMessage(null), 3000);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    if (quickPlanInputRef.current) quickPlanInputRef.current.value = '';
  };

  // Public Share URL
  const activeShareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?project=${activeProject.id}`
      : `https://vasthusilpy.arch?project=${activeProject.id}`;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0f1d] text-slate-200 font-sans select-none relative">
      {/* Hidden quick plan upload input */}
      <input
        type="file"
        ref={quickPlanInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleQuickAddPlanFile}
      />

      {/* ATMOSPHERIC FROSTED GLASS BACKGROUND GRADIENT ORBS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-blue-600 rounded-full blur-[140px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full blur-[140px] opacity-15" />
        <div className="absolute top-[35%] right-[25%] w-[35%] h-[35%] bg-indigo-600 rounded-full blur-[160px] opacity-15" />
      </div>

      {/* FLOATING TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-in fade-in slide-in-from-top-2 no-print">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
          {toastMessage.actionUrl && (
            <a
              href={toastMessage.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline text-blue-400 hover:text-blue-300"
            >
              Open File
            </a>
          )}
        </div>
      )}

      {/* 1. TOP GLOBAL NAVIGATION & CONTROL BAR (Frosted Glass Header) */}
      <header className="mx-3 mt-2 mb-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 shadow-2xl flex items-center justify-between shrink-0 no-print z-30">
        {/* Left: Branding, Sidebar Toggle & Dashboard Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSideDockOpen(!isSideDockOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer"
            title={isSideDockOpen ? 'Collapse Tools Dock' : 'Expand Tools Dock'}
          >
            {isSideDockOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          {/* DEDICATED DASHBOARD BUTTON */}
          <button
            type="button"
            onClick={() => setIsDashboardOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-sm"
            title="Open Drawings Dashboard to View, Edit, Delete and Download All Drawings"
          >
            <FolderOpen className="w-4 h-4 text-blue-400" />
            <span>DASHBOARD</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-[9px] font-mono text-white">
              {projects.length}
            </span>
          </button>

          <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />

          {/* Active Drawing Info */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-white uppercase tracking-wider truncate max-w-[200px]">
                {activeProject.titleBlock?.drawingTitle || activeProject.name}
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 uppercase">
                {activePage.paperSize?.toUpperCase() || 'A3'} • {activePage.orientation || 'LANDSCAPE'}
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 flex items-center gap-2">
              <span>{activeProject.titleBlock?.drawingNumber || 'DWG-01'}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync ({lastSavedTime})
              </span>
            </div>
          </div>
        </div>

        {/* Center: Multi-Page Sheet Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2.5 py-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 mr-1 hidden sm:inline">
            SHEET:
          </span>
          <button
            type="button"
            disabled={safePageIndex === 0}
            onClick={() => setActivePageIndex((p) => Math.max(0, p - 1))}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous Sheet"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono font-bold text-xs text-blue-300 px-1.5">
            {safePageIndex + 1} / {activeProject.pages.length}
          </span>

          <button
            type="button"
            disabled={safePageIndex >= activeProject.pages.length - 1}
            onClick={() =>
              setActivePageIndex((p) => Math.min(activeProject.pages.length - 1, p + 1))
            }
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next Sheet"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleAddPage('a3', 'landscape')}
            className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold font-mono transition-colors cursor-pointer"
            title="Add another sheet to this drawing"
          >
            <Plus className="w-3 h-3" />
            <span>Sheet</span>
          </button>

          {/* Quick Page Settings Button */}
          <button
            type="button"
            onClick={() => setIsEditingSheet(true)}
            className="ml-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[10px] font-bold font-mono transition-colors cursor-pointer"
            title="Edit Sheet Size, Margins & Outline"
          >
            Margins
          </button>
        </div>

        {/* Right Toolbar: Delete Selected, Save (Ctrl+S), WhatsApp, Print, Share, Download PDF */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dedicated Delete Selected Item Button */}
          {(selectedPlanId || selectedElementId) && (
            <button
              type="button"
              onClick={handleDeleteSelectedItem}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-md border border-rose-400/30 animate-in fade-in"
              title="Delete currently selected item (Keyboard: Delete or Backspace)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Delete Item (Del)</span>
            </button>
          )}

          {/* Save Drawing (Ctrl+S) Button */}
          <button
            type="button"
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-semibold text-slate-100 transition-all cursor-pointer backdrop-blur-md"
            title="Save Drawing (Ctrl+S)"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin text-blue-400' : 'text-emerald-400'}`} />
            <span className="hidden lg:inline">Save (Ctrl+S)</span>
          </button>

          {/* Quick WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer backdrop-blur-md"
            title="Share via WhatsApp with automatic date & time watermark"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Direct Print Button */}
          <button
            type="button"
            onClick={handlePrintDrawing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-semibold text-slate-100 transition-all cursor-pointer backdrop-blur-md"
            title="Print Drawing directly (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Cloud Share & QR Button */}
          <button
            type="button"
            onClick={() => {
              handleSaveToCloud();
              setIsShareModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-semibold text-slate-100 transition-all cursor-pointer backdrop-blur-md"
            title="Share project with clients via QR code and cloud link"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* PRIMARY PDF EXPORT BUTTON (WORKS FOR MULTI-PAGE & SINGLE PAGE) */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            id="btn-export-pdf-main"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all cursor-pointer disabled:opacity-50"
            title="Download multi-page PDF with title block and live watermark"
          >
            <Download className={`w-3.5 h-3.5 ${isExportingPdf ? 'animate-bounce' : ''}`} />
            <span>
              {isExportingPdf
                ? pdfProgressStatus || 'Exporting PDF...'
                : 'Download PDF'}
            </span>
          </button>
        </div>
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE (SideDock + Drafting Canvas) */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left SideDock: Tools, Plans Manager, Sheets Config, Blocks, Title Block */}
        {isSideDockOpen && (
          <SideDock
            project={activeProject}
            activePageIndex={safePageIndex}
            activePage={activePage}
            selectedPlanId={selectedPlanId}
            selectedElementId={selectedElementId}
            onSelectPlan={setSelectedPlanId}
            onSelectElement={setSelectedElementId}
            onAddPlan={handleAddPlan}
            onUpdatePlans={handleUpdatePlans}
            onDeletePlan={handleDeletePlan}
            onAddElement={handleAddElement}
            onUpdateElements={handleUpdateElements}
            onUpdateActivePage={handleUpdateActivePage}
            onUpdateProject={handleUpdateProject}
            onAddPage={handleAddPage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
            onSwitchPage={(idx) => setActivePageIndex(idx)}
            isCalibrating={isCalibrating}
            setIsCalibrating={setIsCalibrating}
            onOpenEditSheetModal={() => setIsEditingSheet(true)}
            onOpenEditTitleBlockModal={(tab) => setEditingTitleBlockTab(tab || 'project')}
            onOpenEditPlanModal={(plan) => setEditingPlan(plan)}
            onOpenEditElementModal={(el) => setEditingElement(el)}
          />
        )}

        {/* Central Master Architectural Canvas */}
        <DraftingCanvas
          project={activeProject}
          activePage={activePage}
          selectedElementId={selectedElementId}
          selectedPlanId={selectedPlanId}
          onSelectElement={setSelectedElementId}
          onSelectPlan={setSelectedPlanId}
          onUpdateElements={handleUpdateElements}
          onUpdatePlans={handleUpdatePlans}
          onUpdateActivePage={handleUpdateActivePage}
          onUpdateProject={handleUpdateProject}
          onVerifyEngineer={() => setIsVerifyModalOpen(true)}
          onAddPlanClick={() => quickPlanInputRef.current?.click()}
          onOpenEditPlanModal={(plan) => setEditingPlan(plan)}
          onOpenEditElementModal={(el) => setEditingElement(el)}
          onOpenEditTitleBlockModal={(tab) => setEditingTitleBlockTab(tab || 'project')}
          onOpenEditSheetModal={() => setIsEditingSheet(true)}
          onSave={handleSaveToCloud}
          isCalibrating={isCalibrating}
        />
      </div>

      {/* 3. DEDICATED DRAWINGS DASHBOARD (Full-Screen Overlay Hub) */}
      {isDashboardOpen && (
        <DrawingsDashboard
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => {
            setActiveProjectId(id);
            setActivePageIndex(0);
            setIsDashboardOpen(false);
          }}
          onCreateProject={(newProj) => {
            setProjects((prev) => [newProj, ...prev]);
            setActiveProjectId(newProj.id);
            setActivePageIndex(0);
          }}
          onDeleteProject={(id) => {
            if (projects.length <= 1) {
              setToastMessage({ text: 'Cannot delete the only remaining drawing.', type: 'error' });
              return;
            }
            setProjects((prev) => prev.filter((p) => p.id !== id));
            if (activeProjectId === id) {
              const remaining = projects.filter((p) => p.id !== id);
              setActiveProjectId(remaining[0].id);
              setActivePageIndex(0);
            }
          }}
          onDuplicateProject={(id) => {
            const source = projects.find((p) => p.id === id);
            if (!source) return;
            const nextProj: ArchitecturalProject = {
              ...source,
              id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
              name: `${source.name} (Copy)`,
              titleBlock: {
                ...source.titleBlock,
                drawingTitle: `${source.titleBlock.drawingTitle} (COPY)`,
                drawingNumber: `DWG-2026/${String(projects.length + 1).padStart(2, '0')}`,
              },
            };
            setProjects((prev) => [nextProj, ...prev]);
            setActiveProjectId(nextProj.id);
            setActivePageIndex(0);
          }}
          onOpenShareModal={(proj) => {
            setActiveProjectId(proj.id);
            setIsShareModalOpen(true);
          }}
          onCloseDashboard={() => setIsDashboardOpen(false)}
        />
      )}

      {/* 4. ATTRIBUTE EDIT MODALS (Triggered on Double-Click or Toolbar) */}
      {/* Edit Plan Modal */}
      <EditPlanModal
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSave={(updatedPlan) => {
          handleUpdatePlans(
            activePage.plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
          );
          setEditingPlan(null);
          setToastMessage({ text: 'Plan attributes updated', type: 'success' });
          setTimeout(() => setToastMessage(null), 2500);
        }}
        onDelete={(planId) => {
          handleDeletePlan(planId);
          setEditingPlan(null);
          setToastMessage({ text: 'Plan deleted', type: 'info' });
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      {/* Edit Element Modal */}
      <EditElementModal
        element={editingElement}
        onClose={() => setEditingElement(null)}
        onSave={(updatedElement) => {
          handleUpdateElements(
            activePage.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
          );
          setEditingElement(null);
          setToastMessage({ text: 'Element attributes updated', type: 'success' });
          setTimeout(() => setToastMessage(null), 2500);
        }}
        onDelete={(elementId) => {
          handleDeleteElement(elementId);
          setEditingElement(null);
          setToastMessage({ text: 'Element deleted', type: 'info' });
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      {/* Edit Title Block & Company Logo & Engineer Modal */}
      <EditTitleBlockModal
        isOpen={!!editingTitleBlockTab}
        initialTab={editingTitleBlockTab || 'project'}
        data={activePage.titleBlock}
        onClose={() => setEditingTitleBlockTab(null)}
        onSave={(updatedTitleBlock) => {
          handleUpdateActivePage((page) => ({
            ...page,
            titleBlock: updatedTitleBlock,
          }));
          setEditingTitleBlockTab(null);
          setToastMessage({ text: 'Title block & details updated', type: 'success' });
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      {/* Edit Sheet Margins & Outline Modal */}
      <EditSheetModal
        isOpen={isEditingSheet}
        page={activePage}
        onClose={() => setIsEditingSheet(false)}
        onSave={(updatedPage) => {
          handleUpdateActivePage(() => updatedPage);
          setIsEditingSheet(false);
          setToastMessage({ text: 'Sheet size & margins updated', type: 'success' });
          setTimeout(() => setToastMessage(null), 2500);
        }}
      />

      {/* 5. VERIFICATION & SHARE MODALS */}
      <VerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        data={activePage.titleBlock}
      />

      <CloudShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={activeProject}
        shareUrl={activeShareUrl}
        isSaving={isSaving}
        onSaveToCloud={handleSaveToCloud}
      />
    </div>
  );
}
