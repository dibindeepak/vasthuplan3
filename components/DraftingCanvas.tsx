'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArchitecturalProject,
  ArchitecturalPlan,
  DrawingElement,
  DrawingPage,
} from '@/lib/types';
import { TitleBlock } from './TitleBlock';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  Compass,
  Trash2,
  Copy,
  RotateCw,
  Move,
  Upload,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Maximize2,
  FileText,
  Sliders,
  Sparkles,
  SlidersHorizontal,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import { generateUniqueId } from '@/lib/utils';
import { BLOCKS_CATALOG, renderBlockSvg } from '@/lib/blocks';

interface DraftingCanvasProps {
  project: ArchitecturalProject;
  activePage: DrawingPage;
  selectedElementId: string | null;
  selectedPlanId: string | null;
  onSelectElement: (id: string | null) => void;
  onSelectPlan: (id: string | null) => void;
  onUpdateElements: (elements: DrawingElement[]) => void;
  onUpdatePlans: (plans: ArchitecturalPlan[]) => void;
  onUpdateActivePage: (updater: (page: DrawingPage) => DrawingPage) => void;
  onUpdateProject: (updater: (prev: ArchitecturalProject) => ArchitecturalProject) => void;
  onVerifyEngineer: () => void;
  onAddPlanClick: () => void;
  onOpenEditPlanModal?: (plan: ArchitecturalPlan) => void;
  onOpenEditElementModal?: (el: DrawingElement) => void;
  onOpenEditTitleBlockModal?: (tab?: 'project' | 'company' | 'engineer' | 'area' | 'vasthu') => void;
  onOpenEditSheetModal?: () => void;
  onSave?: () => void;
  isCalibrating?: boolean;
  onCalibrationComplete?: (distanceMeters: number, pixelDist: number) => void;
}

export const DraftingCanvas: React.FC<DraftingCanvasProps> = ({
  project,
  activePage,
  selectedElementId,
  selectedPlanId,
  onSelectElement,
  onSelectPlan,
  onUpdateElements,
  onUpdatePlans,
  onUpdateActivePage,
  onUpdateProject,
  onVerifyEngineer,
  onAddPlanClick,
  onOpenEditPlanModal,
  onOpenEditElementModal,
  onOpenEditTitleBlockModal,
  onOpenEditSheetModal,
  onSave,
  isCalibrating = false,
  onCalibrationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Zoom and Pan
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Dragging state for elements and plans
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [draggingPlanId, setDraggingPlanId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Calibration 2-point state
  const [calibrationPoints, setCalibrationPoints] = useState<{ x: number; y: number }[]>([]);

  // Keyboard Shortcuts: Ctrl+S to save, Delete/Backspace to delete selected item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
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
        onSave?.();
        return;
      }

      // Delete or Backspace -> Delete selected plan or element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedPlanId) {
          e.preventDefault();
          onUpdatePlans(activePage.plans.filter((p) => p.id !== selectedPlanId));
          onSelectPlan(null);
        } else if (selectedElementId) {
          e.preventDefault();
          onUpdateElements(activePage.elements.filter((el) => el.id !== selectedElementId));
          onSelectElement(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanId, selectedElementId, activePage, onSave, onUpdatePlans, onUpdateElements, onSelectPlan, onSelectElement]);

  // Paper & Orientation configuration from active page
  const paperSize = activePage.paperSize || project.paperSize || 'a3';
  const orientation = activePage.orientation || project.orientation || 'landscape';

  // Sheet Margins (in pixels, ~1mm = ~3.8px on standard architectural scale)
  const margins = activePage.margins || project.margins || {
    top: 12,
    right: 12,
    bottom: 12,
    left: 12,
  };

  // Title Block Position: auto / right / bottom
  const titleBlockPosition = activePage.titleBlockPosition || project.titleBlockPosition || 'auto';
  const effectivePosition: 'right' | 'bottom' =
    titleBlockPosition === 'right' || titleBlockPosition === 'bottom'
      ? titleBlockPosition
      : orientation === 'portrait'
      ? 'bottom'
      : 'right';

  // Sheet Dimensions (in canvas pixels)
  let sheetWidth = 1260;
  let sheetHeight = 890;

  if (paperSize === 'a4') {
    if (orientation === 'landscape') {
      sheetWidth = 1040;
      sheetHeight = 735;
    } else {
      sheetWidth = 735;
      sheetHeight = 1040;
    }
  } else {
    // A3
    if (orientation === 'landscape') {
      sheetWidth = 1260;
      sheetHeight = 890;
    } else {
      sheetWidth = 890;
      sheetHeight = 1260;
    }
  }

  // Handle Zoom
  const handleZoomIn = () => setZoom((z) => Math.min(2.5, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))));
  const handleResetView = () => {
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((z) => Math.max(0.3, Math.min(2.5, Number((z + delta).toFixed(2)))));
    }
  };

  // Plan Drag Start
  const handlePlanMouseDown = (e: React.MouseEvent, plan: ArchitecturalPlan) => {
    e.stopPropagation();
    onSelectPlan(plan.id);
    onSelectElement(null);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    setDraggingPlanId(plan.id);
    setDragOffset({ x: clickX - plan.x, y: clickY - plan.y });
  };

  // Element Drag Start
  const handleElementMouseDown = (e: React.MouseEvent, el: DrawingElement) => {
    e.stopPropagation();
    onSelectElement(el.id);
    onSelectPlan(null);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    setDraggingElementId(el.id);
    setDragOffset({ x: clickX - el.x, y: clickY - el.y });
  };

  // Background Canvas Click / Mouse Down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey || e.shiftKey) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (isCalibrating) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      const nextPts = [...calibrationPoints, { x, y }];
      setCalibrationPoints(nextPts);

      if (nextPts.length === 2) {
        const dx = nextPts[1].x - nextPts[0].x;
        const dy = nextPts[1].y - nextPts[0].y;
        const pixelDist = Math.sqrt(dx * dx + dy * dy);
        const enteredDist = window.prompt(
          'Enter known real-world dimension between these two points in METERS (e.g. 14.40):',
          '14.40'
        );
        if (enteredDist && !isNaN(parseFloat(enteredDist)) && onCalibrationComplete) {
          onCalibrationComplete(parseFloat(enteredDist), pixelDist);
        }
        setCalibrationPoints([]);
      }
      return;
    }

    // Deselect if clicking on empty canvas paper
    onSelectElement(null);
    onSelectPlan(null);
  };

  // Mouse Move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Dragging a Plan
    if (draggingPlanId) {
      const rawX = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
      const rawY = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;

      const snap = activePage.viewport.gridSnap;
      const gSize = activePage.viewport.gridSize || 10;
      const finalX = snap ? Math.round(rawX / gSize) * gSize : Math.round(rawX);
      const finalY = snap ? Math.round(rawY / gSize) * gSize : Math.round(rawY);

      onUpdatePlans(
        activePage.plans.map((p) => (p.id === draggingPlanId ? { ...p, x: finalX, y: finalY } : p))
      );
      return;
    }

    // Dragging an Element
    if (draggingElementId) {
      const rawX = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
      const rawY = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;

      const snap = activePage.viewport.gridSnap;
      const gSize = activePage.viewport.gridSize || 10;
      const finalX = snap ? Math.round(rawX / gSize) * gSize : Math.round(rawX);
      const finalY = snap ? Math.round(rawY / gSize) * gSize : Math.round(rawY);

      onUpdateElements(
        activePage.elements.map((el) =>
          el.id === draggingElementId ? { ...el, x: finalX, y: finalY } : el
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingPlanId(null);
    setDraggingElementId(null);
  };

  // Plan actions
  const handleDeletePlan = (planId: string) => {
    onUpdatePlans(activePage.plans.filter((p) => p.id !== planId));
    if (selectedPlanId === planId) onSelectPlan(null);
  };

  const handleDuplicatePlan = (plan: ArchitecturalPlan) => {
    const newPlan: ArchitecturalPlan = {
      ...plan,
      id: generateUniqueId('plan'),
      name: `${plan.name} (Copy)`,
      x: plan.x + 35,
      y: plan.y + 35,
    };
    onUpdatePlans([...activePage.plans, newPlan]);
    onSelectPlan(newPlan.id);
  };

  // Replace Plan Image Handler
  const handleReplacePlanImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPlanId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        onUpdatePlans(
          activePage.plans.map((p) => {
            if (p.id !== selectedPlanId) return p;
            const ratio = img.height / img.width;
            return {
              ...p,
              imageUrl: dataUrl,
              height: Math.round(p.width * ratio),
            };
          })
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
  };

  // Element actions
  const handleDeleteElement = (elId: string) => {
    onUpdateElements(activePage.elements.filter((el) => el.id !== elId));
    if (selectedElementId === elId) onSelectElement(null);
  };

  const handleRotateElement = (elId: string, deltaAngle: number = 45) => {
    onUpdateElements(
      activePage.elements.map((el) =>
        el.id === elId ? { ...el, rotation: (el.rotation + deltaAngle) % 360 } : el
      )
    );
  };

  const selectedPlan = activePage.plans.find((p) => p.id === selectedPlanId);
  const selectedElement = activePage.elements.find((el) => el.id === selectedElementId);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative flex-1 h-full w-full overflow-hidden bg-[#0c1322] select-none cursor-default flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      {/* Hidden file input for replacing plan blueprint image */}
      <input
        type="file"
        ref={replaceFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleReplacePlanImage}
      />

      {/* ========================================================= */}
      {/* TOP FLOATING ARCHITECTURAL CANVAS HUD TOOLBAR             */}
      {/* ========================================================= */}
      <div className="canvas-hud absolute top-4 left-6 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-2xl text-xs text-slate-300">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono text-[11px] font-bold px-1.5 min-w-12 text-center text-blue-300">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="px-2 py-1 hover:bg-white/10 rounded-lg text-[10px] font-mono font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Pan & Zoom"
          >
            100% Fit
          </button>
        </div>

        {/* Paper & Margins Quick Info / Edit Button */}
        <button
          type="button"
          onClick={onOpenEditSheetModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Click to modify Page Margins and Outline settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Margins: {margins.top}T / {margins.right}R / {margins.bottom}B / {margins.left}L mm
          </span>
        </button>

        {/* Title Block Position Quick Switcher */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
          <button
            type="button"
            onClick={() =>
              onUpdateActivePage((p) => ({
                ...p,
                titleBlockPosition: effectivePosition === 'right' ? 'bottom' : 'right',
              }))
            }
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-400/30 text-[10px] font-mono font-bold transition-all cursor-pointer"
            title="Toggle Title Block position between Right Side and Bottom"
          >
            <span>Title Block: {effectivePosition.toUpperCase()}</span>
          </button>
        </div>

        {/* Dedicated Delete Button for Selected Plan or Element */}
        {(selectedPlanId || selectedElementId) && (
          <button
            type="button"
            onClick={() => {
              if (selectedPlanId) handleDeletePlan(selectedPlanId);
              if (selectedElementId) handleDeleteElement(selectedElementId);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-[10px] transition-all cursor-pointer shadow-md border border-rose-400/30 animate-in fade-in"
            title="Delete currently selected item (or press Delete / Backspace key)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected (Del)</span>
          </button>
        )}
      </div>

      {/* Floating Selected Plan Quick Toolbar */}
      {selectedPlan && (
        <div className="canvas-hud absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-blue-500/40 rounded-xl p-2 shadow-2xl text-xs text-slate-200 animate-in fade-in">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/15">
            <span className="font-mono font-bold text-white text-[11px] uppercase">
              {selectedPlan.name}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-mono">
              {selectedPlan.scaleRatioText || '1:100'}
            </span>
          </div>

          {/* Edit Attributes Button */}
          <button
            type="button"
            onClick={() => onOpenEditPlanModal?.(selectedPlan)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] transition-all cursor-pointer"
            title="Edit all plan attributes"
          >
            <Edit3 className="w-3 h-3 text-blue-400" />
            <span>Edit</span>
          </button>

          {/* Replace Plan Image Button */}
          <button
            type="button"
            onClick={() => replaceFileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all cursor-pointer shadow-xs"
            title="Replace blueprint image"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Replace</span>
          </button>

          {/* Duplicate Plan */}
          <button
            type="button"
            onClick={() => handleDuplicatePlan(selectedPlan)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Duplicate plan"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete Plan */}
          <button
            type="button"
            onClick={() => handleDeletePlan(selectedPlan.id)}
            className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Delete this plan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2-POINT CALIBRATION NOTICE */}
      {isCalibrating && (
        <div className="canvas-hud absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-amber-300">
          <span>Click Point 1 and Point 2 on known wall / grid line to calibrate scale</span>
          <span className="font-mono bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
            {calibrationPoints.length}/2 Points Selected
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* THE MASTER PRINTABLE SHEET (STANDARD SIZE + MARGINS)       */}
      {/* ========================================================= */}
      <div
        id="aia-master-printable-sheet"
        className="relative bg-white shadow-2xl select-none print-only-sheet transition-all"
        style={{
          width: `${sheetWidth}px`,
          height: `${sheetHeight}px`,
          padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
        onDoubleClick={(e) => {
          // If double clicked directly on the margin padding or background
          if ((e.target as HTMLElement).id === 'aia-master-printable-sheet') {
            onOpenEditSheetModal?.();
          }
        }}
      >
        {/* ========================================================= */}
        {/* ARCHITECTURAL OUTLINE BORDER (AFTER MARGINS)              */}
        {/* ========================================================= */}
        <div
          id="aia-sheet-outline"
          className={`w-full h-full border-2 border-slate-950 relative overflow-hidden bg-white flex ${
            effectivePosition === 'bottom' ? 'flex-col' : 'flex-row'
          }`}
          style={{ minWidth: 0, minHeight: 0 }}
        >
          {/* DRAWING WORKSPACE (ARCHITECTURAL DRAFTING CANVAS) */}
          <div
            id="aia-drawing-workspace"
            onDoubleClick={(e) => {
              // If double clicked directly on workspace canvas background
              if ((e.target as HTMLElement).id === 'aia-drawing-workspace') {
                onOpenEditSheetModal?.();
              }
            }}
            className="relative flex-1 bg-white overflow-hidden"
            style={{ minWidth: 0, minHeight: 0 }}
          >
            {/* Subtle Drafting Grid Lines */}
            {activePage.viewport.showGrid && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id={`canvas-grid-${activePage.id}`}
                    width={activePage.viewport.gridSize || 20}
                    height={activePage.viewport.gridSize || 20}
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d={`M ${activePage.viewport.gridSize || 20} 0 L 0 0 0 ${activePage.viewport.gridSize || 20}`}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="0.75"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#canvas-grid-${activePage.id})`} />
              </svg>
            )}

            {/* EMPTY STATE NOTICE: WHEN ZERO PLANS ARE ON THE SHEET */}
            {activePage.plans.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-8">
                <div className="pointer-events-auto max-w-md p-6 rounded-2xl bg-slate-50/90 border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-mono font-black text-sm uppercase text-slate-900 tracking-wider">
                    BLANK DRAWING CANVAS ({paperSize.toUpperCase()} {orientation.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    No plans are loaded on this sheet. Click below to add floor plans, elevations, or blueprints to this page.
                  </p>

                  <button
                    type="button"
                    onClick={onAddPlanClick}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Plan to Sheet</span>
                  </button>
                </div>
              </div>
            )}

            {/* RENDER ALL PLANS ON THIS PAGE */}
            {activePage.plans.map((plan) => {
              if (!plan.visible) return null;
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  onMouseDown={(e) => handlePlanMouseDown(e, plan)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onOpenEditPlanModal?.(plan);
                  }}
                  title="Double-click to edit plan attributes, scale, or replace image"
                  className={`absolute cursor-move group transition-shadow ${
                    isSelected
                      ? 'ring-2 ring-blue-600 shadow-xl'
                      : 'hover:ring-1 hover:ring-slate-400'
                  }`}
                  style={{
                    left: `${plan.x}px`,
                    top: `${plan.y}px`,
                    width: `${plan.width * plan.scale}px`,
                    height: `${plan.height * plan.scale}px`,
                    transform: `rotate(${plan.rotation}deg)`,
                    opacity: plan.opacity,
                  }}
                >
                  {/* Plan Blueprint Image */}
                  {plan.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={plan.imageUrl}
                      alt={plan.name}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full border-2 border-slate-700 bg-slate-50/50 flex flex-col items-center justify-center p-4">
                      <span className="font-mono font-bold text-xs uppercase text-slate-700">
                        {plan.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">
                        SCALE {plan.scaleRatioText || '1:100'}
                      </span>
                      <span className="text-[9px] text-blue-600 font-mono mt-0.5">
                        Double click to edit or replace image
                      </span>
                    </div>
                  )}

                  {/* Plan Title & Scale Badge Underneath / On Plan */}
                  <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-between text-[10px] font-mono font-bold text-slate-800 bg-white/90 px-2 py-0.5 border border-slate-300 rounded shadow-xs">
                    <span className="uppercase truncate">{plan.name}</span>
                    <span className="text-blue-700 font-semibold shrink-0">
                      {plan.scaleRatioText || '1:100'}
                    </span>
                  </div>

                  {/* Selection Bounding Indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-blue-600 text-white p-1 rounded-full shadow-md pointer-events-none">
                      <Move className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* RENDER DRAWING ELEMENTS (2D Blocks, annotations, doors, furniture) */}
            {activePage.elements.map((el) => {
              const isSelected = selectedElementId === el.id;
              const blockDef = el.blockId
                ? BLOCKS_CATALOG.find((b) => b.id === el.blockId)
                : null;

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onOpenEditElementModal?.(el);
                  }}
                  title="Double-click to edit element attributes, dimensions, and text"
                  className={`absolute cursor-move select-none group ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-1 z-30' : 'hover:ring-1 hover:ring-slate-400 z-10'
                  }`}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: `rotate(${el.rotation}deg)`,
                  }}
                >
                  {/* SVG Render for standard 2D Blocks */}
                  {blockDef ? (
                    renderBlockSvg(blockDef.id, el.width, el.height, el.label, el.subLabel)
                  ) : el.type === 'text' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-1 bg-white/80 border border-slate-400 rounded-sm">
                      <span className="font-mono font-bold text-xs uppercase text-slate-900 leading-tight">
                        {el.label || 'ROOM'}
                      </span>
                      {el.subLabel && (
                        <span className="text-[9px] font-mono text-slate-600 mt-0.5">
                          {el.subLabel}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full border border-slate-500 bg-white/70 flex items-center justify-center text-[10px] font-mono">
                      {el.label || el.type}
                    </div>
                  )}

                  {/* In-Canvas Action Floating Menu when Element is Selected */}
                  {isSelected && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-md px-1.5 py-0.5 flex items-center gap-1 shadow-lg z-40 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditElementModal?.(el);
                        }}
                        className="p-1 hover:bg-slate-700 rounded text-blue-300 hover:text-white"
                        title="Edit element attributes"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotateElement(el.id, 45);
                        }}
                        className="p-1 hover:bg-slate-700 rounded text-slate-200"
                        title="Rotate 45°"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(el.id);
                        }}
                        className="p-1 hover:bg-red-600 rounded text-red-400 hover:text-white"
                        title="Delete Element"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* NORTH ARROW EMBEDDED IN SHEET CORNER */}
            <div
              className="absolute top-4 right-4 z-10 flex flex-col items-center pointer-events-none"
              style={{ transform: `rotate(${activePage.viewport.northDegree}deg)` }}
            >
              <svg viewBox="0 0 40 60" className="w-8 h-12 text-slate-900" fill="none">
                <polygon points="20,2 32,45 20,38" fill="#ef4444" />
                <polygon points="20,2 8,45 20,38" fill="#1e293b" />
                <text x="20" y="58" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="monospace">
                  N
                </text>
              </svg>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TITLE BLOCK COMPONENT (ARRANGED ON RIGHT OR BOTTOM)       */}
          {/* ========================================================= */}
          <TitleBlock
            data={activePage.titleBlock}
            orientation={orientation}
            position={effectivePosition}
            onVerifyEngineer={onVerifyEngineer}
            onEditTitleBlock={onOpenEditTitleBlockModal}
            onTogglePosition={(pos) => {
              onUpdateActivePage((p) => ({ ...p, titleBlockPosition: pos }));
            }}
          />
        </div>
      </div>
    </div>
  );
};
