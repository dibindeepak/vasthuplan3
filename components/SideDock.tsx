'use client';

import React, { useState, useRef } from 'react';
import {
  ArchitecturalProject,
  DrawingPage,
  ArchitecturalPlan,
  DrawingElement,
  AreaStatementRow,
} from '@/lib/types';
import { BLOCKS_CATALOG, BlockDefinition, renderBlockSvg } from '@/lib/blocks';
import { generateUniqueId } from '@/lib/utils';
import {
  Layers,
  FileUp,
  Sliders,
  Maximize,
  Crosshair,
  Type,
  Plus,
  Trash2,
  Settings2,
  TableProperties,
  Box,
  Car,
  Compass,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Layout,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Grid,
  Edit3,
  Building,
  UserCheck,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

interface SideDockProps {
  project: ArchitecturalProject;
  activePageIndex: number;
  activePage: DrawingPage;
  selectedPlanId: string | null;
  selectedElementId: string | null;
  onSelectPlan: (id: string | null) => void;
  onSelectElement: (id: string | null) => void;
  onAddPlan: (plan: ArchitecturalPlan) => void;
  onUpdatePlans: (plans: ArchitecturalPlan[]) => void;
  onDeletePlan: (id: string) => void;
  onAddElement: (element: DrawingElement) => void;
  onUpdateElements: (elements: DrawingElement[]) => void;
  onUpdateActivePage: (updater: (page: DrawingPage) => DrawingPage) => void;
  onUpdateProject: (updater: (prev: ArchitecturalProject) => ArchitecturalProject) => void;
  onAddPage: (paperSize?: 'a4' | 'a3', orientation?: 'landscape' | 'portrait') => void;
  onDuplicatePage: (pageIndex: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onSwitchPage: (index: number) => void;
  isCalibrating: boolean;
  setIsCalibrating: (val: boolean) => void;
  onOpenEditSheetModal?: () => void;
  onOpenEditTitleBlockModal?: (tab?: 'project' | 'company' | 'engineer' | 'area' | 'vasthu') => void;
  onOpenEditPlanModal?: (plan: ArchitecturalPlan) => void;
  onOpenEditElementModal?: (el: DrawingElement) => void;
}

export const SideDock: React.FC<SideDockProps> = ({
  project,
  activePageIndex,
  activePage,
  selectedPlanId,
  selectedElementId,
  onSelectPlan,
  onSelectElement,
  onAddPlan,
  onUpdatePlans,
  onDeletePlan,
  onAddElement,
  onUpdateElements,
  onUpdateActivePage,
  onUpdateProject,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onSwitchPage,
  isCalibrating,
  setIsCalibrating,
  onOpenEditSheetModal,
  onOpenEditTitleBlockModal,
  onOpenEditPlanModal,
  onOpenEditElementModal,
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'blocks' | 'sheets' | 'titleblock' | 'annotations'>('plans');
  const [blockCategory, setBlockCategory] = useState<'door' | 'window' | 'furniture' | 'plant' | 'car' | 'card'>('door');

  const planUploadInputRef = useRef<HTMLInputElement>(null);
  const replacePlanInputRef = useRef<HTMLInputElement>(null);
  const [replacingPlanId, setReplacingPlanId] = useState<string | null>(null);

  // New plan form state
  const [newPlanName, setNewPlanName] = useState('Ground Floor Plan');
  const [newPlanScale, setNewPlanScale] = useState('1:100');

  // Handle uploading a brand new plan to the page
  const handleUploadNewPlan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxW = 560;
        const ratio = img.height / img.width;
        const width = Math.min(img.width, maxW);
        const height = Math.round(width * ratio);

        // Stagger position if multiple plans already exist
        const offset = activePage.plans.length * 35;

        const newPlan: ArchitecturalPlan = {
          id: generateUniqueId('plan'),
          name: newPlanName || file.name.replace(/\.[^/.]+$/, ''),
          imageUrl: dataUrl,
          x: 40 + offset,
          y: 40 + offset,
          width,
          height,
          scale: 1.0,
          scaleRatioText: newPlanScale,
          rotation: 0,
          opacity: 0.95,
          visible: true,
        };

        onAddPlan(newPlan);
        onSelectPlan(newPlan.id);
        // Reset file input
        if (planUploadInputRef.current) planUploadInputRef.current.value = '';
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle replacing an existing plan's image
  const handleReplacePlanImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingPlanId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        onUpdatePlans(
          activePage.plans.map((p) => {
            if (p.id === replacingPlanId) {
              const maxW = 560;
              const ratio = img.height / img.width;
              const width = Math.min(img.width, maxW);
              const height = Math.round(width * ratio);
              return {
                ...p,
                imageUrl: dataUrl,
                width,
                height,
              };
            }
            return p;
          })
        );
        setReplacingPlanId(null);
        if (replacePlanInputRef.current) replacePlanInputRef.current.value = '';
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Insert 2D Block into the active page
  const handleInsertBlock = (block: BlockDefinition) => {
    const newId = generateUniqueId('elem');
    const offset = ((activePage.elements.length + 1) * 25) % 200;
    const newElement: DrawingElement = {
      id: newId,
      type: 'block',
      blockId: block.id,
      x: 120 + offset,
      y: 120 + offset,
      width: block.width,
      height: block.height,
      rotation: 0,
      color: '#0f172a',
      label: block.label,
      subLabel: block.subLabel,
      scale: 1.0,
    };
    onAddElement(newElement);
    onSelectElement(newId);
  };

  // Filter 2D Blocks by selected category
  const filteredBlocks = BLOCKS_CATALOG.filter((b) => b.category === blockCategory);

  // Active selected plan
  const selectedPlan = activePage.plans.find((p) => p.id === selectedPlanId);

  return (
    <aside className="w-80 sm:w-88 md:w-92 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 text-white flex flex-col shrink-0 z-20 shadow-2xl h-full select-none">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={planUploadInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleUploadNewPlan}
      />
      <input
        type="file"
        ref={replacePlanInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleReplacePlanImage}
      />

      {/* DOCK HEADER & TABS NAVIGATION */}
      <div className="p-3 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <span className="font-mono font-black text-xs uppercase tracking-widest text-slate-100">
              DRAFTING STUDIO
            </span>
          </div>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/15 border border-blue-400/25 px-1.5 py-0.5 rounded">
            Sheet {activePageIndex + 1}/{project.pages.length}
          </span>
        </div>

        {/* Tab Buttons Grid */}
        <div className="grid grid-cols-5 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Manage Floor Plans & Blueprints on this Sheet"
          >
            Plans
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blocks')}
            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'blocks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="2D CAD Blocks (Doors, Windows, Furniture)"
          >
            2D Blocks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Sheet Size (A3/A4), Orientation & Multi-Page"
          >
            Sheets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('titleblock')}
            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'titleblock'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Title Block, Vasthu Kol & Area Statement"
          >
            Title
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('annotations')}
            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'annotations'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Text Annotations, Grid & Viewport"
          >
            Annotate
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PLANS MANAGEMENT (Add, Replace, Delete, Edit Multiple Plans)       */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Add Plan to Page Section */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs uppercase text-slate-200">
                + Add Plan to Current Sheet
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activePage.plans.length} plan{activePage.plans.length !== 1 ? 's' : ''} on sheet
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">
                  Plan Name / Label:
                </label>
                <input
                  type="text"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="e.g. Ground Floor Plan, First Floor"
                  className="w-full border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono bg-slate-900 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">
                  Standard Scale Ratio:
                </label>
                <select
                  value={newPlanScale}
                  onChange={(e) => setNewPlanScale(e.target.value)}
                  className="w-full border border-white/15 rounded-lg px-2 py-1.5 text-xs font-mono bg-slate-900 text-white focus:border-blue-400 focus:outline-none"
                >
                  <option value="1:50">1:50 (Detailed Plan)</option>
                  <option value="1:100">1:100 (Standard Floor Plan)</option>
                  <option value="1:200">1:200 (Site & Master Layout)</option>
                  <option value="1:500">1:500 (Territory Layout)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => planUploadInputRef.current?.click()}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload & Add Blueprint</span>
              </button>
            </div>
          </div>

          {/* List of plans currently on this page */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-300">
              <span>PLANS ON THIS SHEET</span>
              <span className="text-slate-400">{activePage.plans.length}</span>
            </div>

            {activePage.plans.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-white/15 text-center bg-white/5">
                <p className="text-xs text-slate-400">
                  No plans on this sheet yet. Click &quot;Upload & Add Blueprint&quot; above to add plans.
                </p>
              </div>
            ) : (
              activePage.plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => onSelectPlan(plan.id)}
                    className={`border rounded-xl p-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdatePlans(
                              activePage.plans.map((p) =>
                                p.id === plan.id ? { ...p, visible: !p.visible } : p
                              )
                            );
                          }}
                          className="text-slate-400 hover:text-white"
                          title={plan.visible ? 'Hide plan' : 'Show plan'}
                        >
                          {plan.visible ? (
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                        <span className="font-mono font-bold text-xs text-slate-100 truncate">
                          {plan.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Replace image button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplacingPlanId(plan.id);
                            replacePlanInputRef.current?.click();
                          }}
                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-blue-300"
                          title="Replace this plan's image"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        {/* Delete plan button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlan(plan.id);
                          }}
                          className="p-1 hover:bg-rose-500/20 rounded text-rose-400 hover:text-rose-300"
                          title="Delete plan from sheet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                      <span>Scale: {plan.scaleRatioText || '1:100'}</span>
                      <span>
                        Size: {Math.round(plan.width * plan.scale)} × {Math.round(plan.height * plan.scale)}px
                      </span>
                    </div>

                    {/* Extended controls if this plan is selected */}
                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                        {/* Edit Plan Name */}
                        <div>
                          <label className="text-[8.5px] font-mono text-slate-400 block mb-0.5">
                            Plan Name:
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              onUpdatePlans(
                                activePage.plans.map((p) =>
                                  p.id === plan.id ? { ...p, name: val } : p
                                )
                              );
                            }}
                            className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                          />
                        </div>

                        {/* Scale Ratio Text */}
                        <div>
                          <label className="text-[8.5px] font-mono text-slate-400 block mb-0.5">
                            Scale Ratio Tag:
                          </label>
                          <select
                            value={plan.scaleRatioText || '1:100'}
                            onChange={(e) => {
                              const val = e.target.value;
                              onUpdatePlans(
                                activePage.plans.map((p) =>
                                  p.id === plan.id ? { ...p, scaleRatioText: val } : p
                                )
                              );
                            }}
                            className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                          >
                            <option value="1:50">1:50</option>
                            <option value="1:100">1:100</option>
                            <option value="1:200">1:200</option>
                            <option value="1:500">1:500</option>
                          </select>
                        </div>

                        {/* Scale Slider */}
                        <div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                            <span>Zoom Scale:</span>
                            <span className="text-blue-300 font-bold">
                              {Math.round(plan.scale * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="2.5"
                            step="0.05"
                            value={plan.scale}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              onUpdatePlans(
                                activePage.plans.map((p) =>
                                  p.id === plan.id ? { ...p, scale: val } : p
                                )
                              );
                            }}
                            className="w-full accent-blue-500"
                          />
                        </div>

                        {/* Opacity Slider */}
                        <div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                            <span>Opacity:</span>
                            <span className="text-blue-300 font-bold">
                              {Math.round(plan.opacity * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={plan.opacity}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              onUpdatePlans(
                                activePage.plans.map((p) =>
                                  p.id === plan.id ? { ...p, opacity: val } : p
                                )
                              );
                            }}
                            className="w-full accent-blue-500"
                          />
                        </div>

                        {/* Rotate Slider */}
                        <div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                            <span>Rotation:</span>
                            <span className="text-blue-300 font-bold">{plan.rotation}°</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={plan.rotation}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              onUpdatePlans(
                                activePage.plans.map((p) =>
                                  p.id === plan.id ? { ...p, rotation: val } : p
                                )
                              );
                            }}
                            className="w-full accent-blue-500"
                          />
                        </div>

                        {/* Direct Edit Attributes & Delete Action Buttons */}
                        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEditPlanModal?.(plan)}
                            className="flex-1 py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Attributes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePlan(plan.id)}
                            className="py-1.5 px-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-400/30 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            title="Delete this plan"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 2D ARCHITECTURAL BLOCKS (Doors, Windows, Furniture, Plants, Cars)  */}
      {/* ========================================================================= */}
      {activeTab === 'blocks' && (
        <div className="flex-1 flex flex-col overflow-hidden p-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 shrink-0">
            {(['door', 'window', 'furniture', 'plant', 'car', 'card'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setBlockCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize whitespace-nowrap cursor-pointer transition-all ${
                  blockCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat === 'card' ? 'Cards/Stamps' : cat === 'car' ? 'Cars / 2D' : `${cat}s`}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 my-2 font-mono">
            Click any 2D block to attach directly to the active plan:
          </div>

          {/* Blocks Grid */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {filteredBlocks.map((block) => (
              <div
                key={block.id}
                onClick={() => handleInsertBlock(block)}
                className="group border border-white/10 hover:border-blue-400/60 rounded-xl p-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all shadow-xs cursor-pointer flex items-center gap-3"
              >
                <div className="w-14 h-14 bg-white/95 border border-white/20 rounded-lg p-1 flex items-center justify-center shrink-0 group-hover:scale-[1.02] transition-transform shadow-xs">
                  {renderBlockSvg(block.id, 50, 50, block.label, block.subLabel)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[11px] text-slate-100 group-hover:text-blue-300 truncate transition-colors">
                    {block.name}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                    {block.description}
                  </div>
                  <div className="text-[8.5px] font-mono font-semibold text-blue-400 mt-1">
                    + Insert on plan
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SHEETS & MULTI-PAGE CONFIG (A4/A3, Landscape/Portrait)             */}
      {/* ========================================================================= */}
      {activeTab === 'sheets' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Current Sheet Paper & Orientation Settings */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-3">
            <span className="font-mono font-bold text-xs uppercase text-slate-200 block">
              SHEET SPECIFICATION ({activePage.sheetTitle || activePage.name || `Sheet ${activePage.pageNumber}`})
            </span>

            {/* Paper Size: A3 vs A4 */}
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1.5">
                Paper Size:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateActivePage((page) => ({ ...page, paperSize: 'a3' }))
                  }
                  className={`py-2 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                    (activePage.paperSize || 'a3') === 'a3'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-md'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>A3 STANDARD</div>
                  <div className="text-[9px] font-normal text-slate-400">420 × 297 mm</div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateActivePage((page) => ({ ...page, paperSize: 'a4' }))
                  }
                  className={`py-2 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                    activePage.paperSize === 'a4'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-md'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>A4 COMPACT</div>
                  <div className="text-[9px] font-normal text-slate-400">297 × 210 mm</div>
                </button>
              </div>
            </div>

            {/* Orientation: Landscape vs Portrait */}
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1.5">
                Sheet Orientation:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateActivePage((page) => ({ ...page, orientation: 'landscape' }))
                  }
                  className={`py-2 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                    (activePage.orientation || 'landscape') === 'landscape'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-md'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Landscape
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateActivePage((page) => ({ ...page, orientation: 'portrait' }))
                  }
                  className={`py-2 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                    activePage.orientation === 'portrait'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-md'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Portrait
                </button>
              </div>
            </div>
          </div>

          {/* PAGE MARGINS & ARCHITECTURAL OUTLINE BORDER SETTINGS */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase text-slate-200 block">
                PAGE MARGINS & OUTLINE
              </span>
              <button
                type="button"
                onClick={onOpenEditSheetModal}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Full Dialog
              </button>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Page margins offset the drawing area. The dark architectural outline is drawn directly after the margin.
            </p>

            {/* Margins 4-way Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Top (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={activePage.margins?.top ?? 12}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { ...(p.margins || { top: 12, right: 12, bottom: 12, left: 12 }), top: val },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Bottom (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={activePage.margins?.bottom ?? 12}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { ...(p.margins || { top: 12, right: 12, bottom: 12, left: 12 }), bottom: val },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Left (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={activePage.margins?.left ?? 12}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { ...(p.margins || { top: 12, right: 12, bottom: 12, left: 12 }), left: val },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Right (mm):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={activePage.margins?.right ?? 12}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { ...(p.margins || { top: 12, right: 12, bottom: 12, left: 12 }), right: val },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
            </div>

            {/* Quick Margin Presets */}
            <div>
              <span className="text-[9px] font-mono text-slate-400 block mb-1">Standard Presets:</span>
              <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { top: 12, right: 12, bottom: 12, left: 12 },
                    }));
                  }}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                >
                  AIA 12mm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { top: 10, right: 10, bottom: 10, left: 10 },
                    }));
                  }}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                >
                  Std 10mm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateActivePage((p) => ({
                      ...p,
                      margins: { top: 6, right: 6, bottom: 6, left: 6 },
                    }));
                  }}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                >
                  Slim 6mm
                </button>
              </div>
            </div>

            {/* Title Block Placement */}
            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-1">
                Title Block Placement:
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['auto', 'right', 'bottom'] as const).map((pos) => {
                  const isSel = (activePage.titleBlockPosition || 'auto') === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => {
                        onUpdateActivePage((p) => ({ ...p, titleBlockPosition: pos }));
                      }}
                      className={`p-1.5 rounded-lg text-[10px] font-mono font-bold capitalize border transition-all cursor-pointer ${
                        isSel
                          ? 'border-blue-500 bg-blue-600/30 text-white shadow-xs'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos === 'auto' ? 'Auto' : pos === 'right' ? 'Right' : 'Bottom'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Multi-Page Sheet Manager */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase text-slate-200">
                MULTI-PAGE SHEETS
              </span>
              <button
                type="button"
                onClick={() => onAddPage('a3', 'landscape')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Sheet</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {project.pages.map((p, idx) => {
                const isCurrent = idx === activePageIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSwitchPage(idx)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-xs truncate">
                        Page {idx + 1}: {p.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">
                        {p.paperSize.toUpperCase()} • {p.orientation} • {p.plans.length} plan{p.plans.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicatePage(idx);
                        }}
                        className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                        title="Duplicate sheet"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {project.pages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePage(idx);
                          }}
                          className="p-1 hover:bg-rose-500/20 rounded text-rose-400 hover:text-rose-300"
                          title="Delete sheet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TITLE BLOCK, VASTHU KOL & AREA STATEMENT TABLE                     */}
      {/* ========================================================================= */}
      {activeTab === 'titleblock' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-2.5">
            <span className="font-mono font-bold text-xs uppercase text-slate-200 block">
              DRAWING TITLE & CLIENT DETAILS
            </span>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">
                Client Name:
              </label>
              <input
                type="text"
                value={activePage.titleBlock.client}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((page) => ({
                    ...page,
                    titleBlock: { ...page.titleBlock, client: val },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">
                Site Location:
              </label>
              <input
                type="text"
                value={activePage.titleBlock.location}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((page) => ({
                    ...page,
                    titleBlock: { ...page.titleBlock, location: val },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">
                Drawing Title:
              </label>
              <input
                type="text"
                value={activePage.titleBlock.drawingTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((page) => ({
                    ...page,
                    titleBlock: { ...page.titleBlock, drawingTitle: val },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">
                  Drawing Number:
                </label>
                <input
                  type="text"
                  value={activePage.titleBlock.drawingNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateActivePage((page) => ({
                      ...page,
                      titleBlock: { ...page.titleBlock, drawingNumber: val },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">
                  Scale Text:
                </label>
                <input
                  type="text"
                  value={activePage.titleBlock.scale}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateActivePage((page) => ({
                      ...page,
                      titleBlock: { ...page.titleBlock, scale: val },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
            </div>
          </div>

          {/* Vasthu Kol Calculator Block */}
          <div className="border border-white/10 rounded-xl p-3 bg-amber-500/10 backdrop-blur-md space-y-2 border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase text-amber-200">
                VASTHU KOL (വാസ്തു അളവ്)
              </span>
              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                {activePage.titleBlock.vasthuKol.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-[9px] text-amber-300 block mb-0.5">Perimeter Kol:</label>
                <input
                  type="number"
                  value={activePage.titleBlock.vasthuKol.perimeterKol}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateActivePage((page) => ({
                      ...page,
                      titleBlock: {
                        ...page.titleBlock,
                        vasthuKol: { ...page.titleBlock.vasthuKol, perimeterKol: val },
                      },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="text-[9px] text-amber-300 block mb-0.5">Perimeter Viral:</label>
                <input
                  type="number"
                  value={activePage.titleBlock.vasthuKol.perimeterViral}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onUpdateActivePage((page) => ({
                      ...page,
                      titleBlock: {
                        ...page.titleBlock,
                        vasthuKol: { ...page.titleBlock.vasthuKol, perimeterViral: val },
                      },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 bg-slate-900 text-white"
                />
              </div>
            </div>
          </div>

          {/* COMPANY / ARCHITECTURAL FIRM & LOGO SETTINGS */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase text-slate-200 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>COMPANY / FIRM & LOGO</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenEditTitleBlockModal?.('company')}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Custom Logo Upload / Preview */}
            {(() => {
              const firmInfo = activePage.titleBlock.company || activePage.titleBlock.firm;
              return (
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/10 space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 block">Firm Logo:</span>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      {firmInfo.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={firmInfo.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold cursor-pointer transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const url = ev.target?.result as string;
                              onUpdateActivePage((p) => ({
                                ...p,
                                titleBlock: {
                                  ...p.titleBlock,
                                  firm: { ...p.titleBlock.firm, logoUrl: url },
                                  company: { ...(p.titleBlock.company || p.titleBlock.firm), logoUrl: url },
                                },
                              }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {firmInfo.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateActivePage((p) => ({
                              ...p,
                              titleBlock: {
                                ...p.titleBlock,
                                firm: { ...p.titleBlock.firm, logoUrl: undefined },
                                company: { ...(p.titleBlock.company || p.titleBlock.firm), logoUrl: undefined },
                              },
                            }))
                          }
                          className="block text-[9px] font-mono text-rose-400 hover:underline cursor-pointer"
                        >
                          Reset to Default Emblem
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Firm Name:</label>
              <input
                type="text"
                value={activePage.titleBlock.company?.name || activePage.titleBlock.firm.name}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((p) => ({
                    ...p,
                    titleBlock: {
                      ...p.titleBlock,
                      firm: { ...p.titleBlock.firm, name: val },
                      company: { ...(p.titleBlock.company || p.titleBlock.firm), name: val },
                    },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Address Line:</label>
              <input
                type="text"
                value={activePage.titleBlock.company?.address || activePage.titleBlock.firm.address}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((p) => ({
                    ...p,
                    titleBlock: {
                      ...p.titleBlock,
                      firm: { ...p.titleBlock.firm, address: val },
                      company: { ...(p.titleBlock.company || p.titleBlock.firm), address: val },
                    },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Phone:</label>
                <input
                  type="text"
                  value={activePage.titleBlock.company?.phone || activePage.titleBlock.firm.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateActivePage((p) => ({
                      ...p,
                      titleBlock: {
                        ...p.titleBlock,
                        firm: { ...p.titleBlock.firm, phone: val },
                        company: { ...(p.titleBlock.company || p.titleBlock.firm), phone: val },
                      },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">WhatsApp:</label>
                <input
                  type="text"
                  value={activePage.titleBlock.company?.whatsapp || activePage.titleBlock.firm.whatsapp}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateActivePage((p) => ({
                      ...p,
                      titleBlock: {
                        ...p.titleBlock,
                        firm: { ...p.titleBlock.firm, whatsapp: val },
                        company: { ...(p.titleBlock.company || p.titleBlock.firm), whatsapp: val },
                      },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
            </div>
          </div>

          {/* CONSULTING ENGINEER / LICENSED ARCHITECT DETAILS */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs uppercase text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CONSULTING ENGINEER</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenEditTitleBlockModal?.('engineer')}
                className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Engineer Name:</label>
              <input
                type="text"
                value={activePage.titleBlock.engineer.name}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((p) => ({
                    ...p,
                    titleBlock: {
                      ...p.titleBlock,
                      engineer: { ...p.titleBlock.engineer, name: val },
                    },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Title / Designation:</label>
                <input
                  type="text"
                  value={activePage.titleBlock.engineer.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateActivePage((p) => ({
                      ...p,
                      titleBlock: {
                        ...p.titleBlock,
                        engineer: { ...p.titleBlock.engineer, title: val },
                      },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Reg. Number:</label>
                <input
                  type="text"
                  value={activePage.titleBlock.engineer.regNo}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateActivePage((p) => ({
                      ...p,
                      titleBlock: {
                        ...p.titleBlock,
                        engineer: { ...p.titleBlock.engineer, regNo: val },
                      },
                    }));
                  }}
                  className="w-full border border-white/15 rounded-lg px-2 py-1 text-xs font-mono bg-slate-900 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-mono text-slate-400 block mb-0.5">Credentials / License Badge:</label>
              <input
                type="text"
                value={activePage.titleBlock.engineer.badge || activePage.titleBlock.engineer.credentialsBadge || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateActivePage((p) => ({
                    ...p,
                    titleBlock: {
                      ...p.titleBlock,
                      engineer: { ...p.titleBlock.engineer, badge: val, credentialsBadge: val },
                    },
                  }));
                }}
                className="w-full border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono bg-slate-900 text-white"
              />
            </div>
          </div>

          {/* Full Title Block Modal Trigger Button */}
          <button
            type="button"
            onClick={() => onOpenEditTitleBlockModal?.('project')}
            className="w-full py-2 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 text-blue-200 border border-blue-400/30 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Open All Title Block Attributes Dialog</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ANNOTATIONS, GRID & VIEWPORT SETTINGS                              */}
      {/* ========================================================================= */}
      {activeTab === 'annotations' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
          {/* Quick Room Label Insertion */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-2">
            <span className="font-mono font-bold text-xs uppercase text-slate-200 block">
              + INSERT ROOM ANNOTATION
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {['LIVING ROOM', 'BEDROOM', 'KITCHEN', 'DINING', 'TOILET', 'SITOUT', 'PORCH', 'BALCONY'].map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => {
                    const newId = generateUniqueId('text');
                    const textEl: DrawingElement = {
                      id: newId,
                      type: 'text',
                      x: 140,
                      y: 140,
                      width: 100,
                      height: 40,
                      rotation: 0,
                      color: '#0f172a',
                      label: room,
                      subLabel: '3.60 × 3.60 m',
                      scale: 1.0,
                    };
                    onAddElement(textEl);
                    onSelectElement(newId);
                  }}
                  className="p-1.5 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/40 rounded-lg text-left text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  + {room}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Toggle */}
          <div className="border border-white/10 rounded-xl p-3 bg-white/5 backdrop-blur-md space-y-2.5">
            <span className="font-mono font-bold text-xs uppercase text-slate-200 block">
              CANVAS GRID & SNAP
            </span>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-mono">Show Drafting Grid:</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateActivePage((page) => ({
                    ...page,
                    viewport: { ...page.viewport, showGrid: !page.viewport.showGrid },
                  }))
                }
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  activePage.viewport.showGrid
                    ? 'border-blue-500 bg-blue-600/30 text-blue-300'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                {activePage.viewport.showGrid ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-mono">Grid Snapping:</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateActivePage((page) => ({
                    ...page,
                    viewport: { ...page.viewport, gridSnap: !page.viewport.gridSnap },
                  }))
                }
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  activePage.viewport.gridSnap
                    ? 'border-blue-500 bg-blue-600/30 text-blue-300'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                {activePage.viewport.gridSnap ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
