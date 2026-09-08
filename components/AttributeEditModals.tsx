'use client';

import React, { useState, useRef } from 'react';
import {
  ArchitecturalPlan,
  DrawingElement,
  TitleBlockData,
  DrawingPage,
  SheetMargins,
  AreaStatementRow,
} from '@/lib/types';
import {
  X,
  Check,
  Trash2,
  Upload,
  RefreshCw,
  RotateCw,
  Image as ImageIcon,
  Building,
  UserCheck,
  FileText,
  Sliders,
  Maximize2,
  Compass,
  Layers,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

// =========================================================================
// 1. EDIT PLAN MODAL
// =========================================================================
interface EditPlanModalProps {
  plan: ArchitecturalPlan | null;
  onClose: () => void;
  onSave: (updatedPlan: ArchitecturalPlan) => void;
  onDelete: (planId: string) => void;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({
  plan,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formState, setFormState] = useState<ArchitecturalPlan | null>(plan);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!plan || !formState) return null;

  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const ratio = img.height / img.width;
        const newW = formState.width;
        const newH = Math.round(newW * ratio);
        setFormState((prev) =>
          prev
            ? {
                ...prev,
                imageUrl: dataUrl,
                width: newW,
                height: newH,
              }
            : null
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black font-mono uppercase text-white tracking-wide">
              EDIT PLAN ATTRIBUTES
            </h3>
            <p className="text-xs text-slate-400">
              Double-clicked on Blueprint: <span className="text-blue-300 font-bold">{plan.name}</span>
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageReplace}
        />

        <div className="space-y-3.5 text-xs max-h-[65vh] overflow-y-auto pr-1">
          {/* Plan Name */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Plan Title / Drawing Label
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
              placeholder="e.g. Ground Floor Plan, Elevation, Site Plan"
            />
          </div>

          {/* Scale Presets & Custom */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Scale Ratio
            </label>
            <div className="flex items-center gap-1.5 mb-2">
              {['1:50', '1:100', '1:200', '1:500'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormState({ ...formState, scaleRatioText: preset })}
                  className={`flex-1 py-1 rounded-lg font-mono font-bold text-[11px] border transition-colors ${
                    formState.scaleRatioText === preset
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formState.scaleRatioText || ''}
              onChange={(e) => setFormState({ ...formState, scaleRatioText: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono focus:border-blue-400 outline-none text-xs"
              placeholder="Custom Ratio e.g. 1:150"
            />
          </div>

          {/* Width & Height Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Width (Canvas px)
              </label>
              <input
                type="number"
                value={formState.width}
                onChange={(e) =>
                  setFormState({ ...formState, width: Math.max(50, Number(e.target.value) || 100) })
                }
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Height (Canvas px)
              </label>
              <input
                type="number"
                value={formState.height}
                onChange={(e) =>
                  setFormState({ ...formState, height: Math.max(50, Number(e.target.value) || 100) })
                }
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono focus:border-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Scale Multiplier */}
          <div>
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              <span>Zoom Scale Multiplier</span>
              <span className="text-blue-400">{(formState.scale || 1).toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.05"
              value={formState.scale || 1}
              onChange={(e) => setFormState({ ...formState, scale: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              <span>Rotation Angle</span>
              <span className="text-blue-400">{formState.rotation}°</span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setFormState({ ...formState, rotation: deg })}
                  className={`flex-1 py-1 rounded-lg font-mono font-bold text-[10px] border transition-colors ${
                    formState.rotation === deg
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={formState.rotation}
              onChange={(e) => setFormState({ ...formState, rotation: parseInt(e.target.value) || 0 })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              <span>Opacity</span>
              <span className="text-blue-400">{Math.round((formState.opacity || 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={formState.opacity || 1}
              onChange={(e) => setFormState({ ...formState, opacity: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Replace Image Button */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span>Replace Plan Blueprint / Image</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(formState.id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 hover:text-rose-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Plan</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(formState);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. EDIT DRAWING ELEMENT MODAL (2D Blocks, Annotations, Text, Doors, Furniture)
// =========================================================================
interface EditElementModalProps {
  element: DrawingElement | null;
  onClose: () => void;
  onSave: (updatedElement: DrawingElement) => void;
  onDelete: (elementId: string) => void;
}

export const EditElementModal: React.FC<EditElementModalProps> = ({
  element,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formState, setFormState] = useState<DrawingElement | null>(element);

  if (!element || !formState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100 font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black font-mono uppercase text-white tracking-wide">
              EDIT ELEMENT ATTRIBUTES
            </h3>
            <p className="text-xs text-slate-400">
              Type: <span className="text-indigo-300 font-mono font-bold uppercase">{element.type}</span>
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Label */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Primary Label / Room Name
            </label>
            <input
              type="text"
              value={formState.label || ''}
              onChange={(e) => setFormState({ ...formState, label: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
              placeholder="e.g. LIVING ROOM, D1 (100x210), BEDROOM 1"
            />
          </div>

          {/* Sub-label / Dimension Note */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Sub-Label / Specifications
            </label>
            <input
              type="text"
              value={formState.subLabel || ''}
              onChange={(e) => setFormState({ ...formState, subLabel: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
              placeholder="e.g. 420 x 360 cm, Teak Wood, Double Glazed"
            />
          </div>

          {/* Width & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={formState.width}
                onChange={(e) =>
                  setFormState({ ...formState, width: Math.max(10, Number(e.target.value) || 20) })
                }
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={formState.height}
                onChange={(e) =>
                  setFormState({ ...formState, height: Math.max(10, Number(e.target.value) || 20) })
                }
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-white font-mono focus:border-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              <span>Rotation</span>
              <span className="text-indigo-300">{formState.rotation}°</span>
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setFormState({ ...formState, rotation: deg })}
                  className={`flex-1 py-1 rounded-lg font-mono font-bold text-[10px] border transition-colors ${
                    formState.rotation === deg
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={formState.rotation}
              onChange={(e) => setFormState({ ...formState, rotation: parseInt(e.target.value) || 0 })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(formState.id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 hover:text-rose-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(formState);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. EDIT COMPLETE TITLE BLOCK & ENGINEER / COMPANY DETAILS & LOGO MODAL
// =========================================================================
interface EditTitleBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TitleBlockData;
  onSave: (updatedData: TitleBlockData) => void;
  initialTab?: 'project' | 'company' | 'engineer' | 'area' | 'vasthu';
}

export const EditTitleBlockModal: React.FC<EditTitleBlockModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  initialTab = 'project',
}) => {
  const [activeTab, setActiveTab] = useState<'project' | 'company' | 'engineer' | 'area' | 'vasthu'>(initialTab);
  const [formState, setFormState] = useState<TitleBlockData>(data);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setFormState((prev) => ({
          ...prev,
          firm: {
            ...prev.firm,
            logoUrl: dataUrl,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormState((prev) => ({
      ...prev,
      firm: {
        ...prev.firm,
        logoUrl: undefined,
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 font-sans flex flex-col max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black font-mono uppercase text-white tracking-wide">
              EDIT ARCHITECTURAL TITLE BLOCK & DETAILS
            </h2>
            <p className="text-xs text-slate-400">
              Customize Project metadata, Company logo, Engineer credentials & Vasthu
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/10 pb-2 mb-4 overflow-x-auto text-xs font-mono">
          {[
            { id: 'project', label: 'Drawing & Project' },
            { id: 'company', label: 'Firm & Logo' },
            { id: 'engineer', label: 'Consulting Engineer' },
            { id: 'area', label: 'Area Statement' },
            { id: 'vasthu', label: 'Vasthu Kol' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hidden Logo Input */}
        <input
          type="file"
          ref={logoInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {/* 1. PROJECT & DRAWING TAB */}
          {activeTab === 'project' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Drawing Title
                  </label>
                  <input
                    type="text"
                    value={formState.drawingTitle}
                    onChange={(e) => setFormState({ ...formState, drawingTitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="e.g. RESIDENTIAL BUILDING PLAN"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Drawing Number
                  </label>
                  <input
                    type="text"
                    value={formState.drawingNumber}
                    onChange={(e) => setFormState({ ...formState, drawingNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="e.g. DWG-2026/01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formState.client}
                    onChange={(e) => setFormState({ ...formState, client: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Site Location
                  </label>
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="e.g. Palakkad, Kerala, India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Scale Text
                  </label>
                  <input
                    type="text"
                    value={formState.scale}
                    onChange={(e) => setFormState({ ...formState, scale: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="1 : 100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Revision
                  </label>
                  <input
                    type="text"
                    value={formState.revision}
                    onChange={(e) => setFormState({ ...formState, revision: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="R0"
                  />
                </div>
              </div>

              {/* Title Block Position Arrangement: Automatic vs Manual Right vs Bottom */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase">
                  Title Block Placement (Right Side vs Bottom)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Automatic (Recommended)', desc: 'Right on Landscape, Bottom on Portrait' },
                    { id: 'right', label: 'Right Side (Vertical)', desc: 'Standard AIA Right Column' },
                    { id: 'bottom', label: 'Bottom (Horizontal)', desc: 'Full-width bottom banner' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setFormState({ ...formState, position: pos.id as any })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        (formState.position || 'auto') === pos.id
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-mono font-bold text-[11px] text-white">{pos.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{pos.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. COMPANY & LOGO TAB */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              {/* Logo Upload Section */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  {formState.firm.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formState.firm.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Building className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-mono font-bold text-white text-xs">COMPANY / FIRM LOGO</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload PNG, JPG, or SVG logo to appear on all title blocks and PDF exports.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formState.firm.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                    </button>
                    {formState.firm.logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 text-rose-300 rounded-lg text-[11px] transition-colors cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Firm Name & Subline */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Firm / Architecture Studio Name
                </label>
                <input
                  type="text"
                  value={formState.firm.name}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      firm: { ...formState.firm, name: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Firm Tagline / Specialty
                </label>
                <input
                  type="text"
                  value={formState.firm.subline}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      firm: { ...formState.firm, subline: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Office Address
                </label>
                <input
                  type="text"
                  value={formState.firm.address}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      firm: { ...formState.firm, address: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                />
              </div>

              {/* Firm Phone & WhatsApp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Office Phone
                  </label>
                  <input
                    type="text"
                    value={formState.firm.phone}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        firm: { ...formState.firm, phone: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Office WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formState.firm.whatsapp}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        firm: { ...formState.firm, whatsapp: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. ENGINEER DETAILS TAB */}
          {activeTab === 'engineer' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Engineer Name
                  </label>
                  <input
                    type="text"
                    value={formState.engineer.name}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        engineer: { ...formState.engineer, name: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    License / Badge Status
                  </label>
                  <input
                    type="text"
                    value={formState.engineer.badge}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        engineer: { ...formState.engineer, badge: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="LSGD REGISTERED"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Professional Title & Qualifications
                </label>
                <input
                  type="text"
                  value={formState.engineer.title}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      engineer: { ...formState.engineer, title: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Registration Number / COA / LSGD License
                </label>
                <input
                  type="text"
                  value={formState.engineer.regNo}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      engineer: { ...formState.engineer, regNo: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Direct Phone (Free Public Contact)
                  </label>
                  <input
                    type="text"
                    value={formState.engineer.phone}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        engineer: { ...formState.engineer, phone: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formState.engineer.whatsapp}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        engineer: { ...formState.engineer, whatsapp: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. AREA STATEMENT TAB */}
          {activeTab === 'area' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-mono font-bold">Floor-wise Area Breakdown (Sq.M)</span>
                <button
                  type="button"
                  onClick={() => {
                    const newRow: AreaStatementRow = {
                      id: `row-${Date.now()}`,
                      floor: `Floor ${formState.areaStatement.length + 1}`,
                      proposedBuiltup: 0,
                      proposedFloor: 0,
                      existingBuiltup: 0,
                      existingFloor: 0,
                    };
                    setFormState({
                      ...formState,
                      areaStatement: [...formState.areaStatement, newRow],
                    });
                  }}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold font-mono transition-colors"
                >
                  + Add Floor
                </button>
              </div>

              <div className="border border-white/15 rounded-xl overflow-hidden">
                <table className="w-full text-[11px] font-mono text-left">
                  <thead className="bg-white/10 text-slate-300 border-b border-white/15 text-[10px]">
                    <tr>
                      <th className="p-2">Floor Name</th>
                      <th className="p-2 text-center">Proposed Built-up</th>
                      <th className="p-2 text-center">Proposed Floor</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {formState.areaStatement.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.floor}
                            onChange={(e) => {
                              const updated = [...formState.areaStatement];
                              updated[idx] = { ...row, floor: e.target.value };
                              setFormState({ ...formState, areaStatement: updated });
                            }}
                            className="bg-transparent border-b border-white/20 w-full px-1 py-0.5 text-white outline-none"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            step="0.1"
                            value={row.proposedBuiltup}
                            onChange={(e) => {
                              const updated = [...formState.areaStatement];
                              updated[idx] = { ...row, proposedBuiltup: parseFloat(e.target.value) || 0 };
                              setFormState({ ...formState, areaStatement: updated });
                            }}
                            className="bg-transparent border-b border-white/20 w-20 text-center px-1 py-0.5 text-white outline-none"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            step="0.1"
                            value={row.proposedFloor}
                            onChange={(e) => {
                              const updated = [...formState.areaStatement];
                              updated[idx] = { ...row, proposedFloor: parseFloat(e.target.value) || 0 };
                              setFormState({ ...formState, areaStatement: updated });
                            }}
                            className="bg-transparent border-b border-white/20 w-20 text-center px-1 py-0.5 text-white outline-none"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setFormState({
                                ...formState,
                                areaStatement: formState.areaStatement.filter((r) => r.id !== row.id),
                              });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. VASTHU KOL TAB */}
          {activeTab === 'vasthu' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Perimeter Kol (കോൽ)
                  </label>
                  <input
                    type="number"
                    value={formState.vasthuKol.perimeterKol}
                    onChange={(e) => {
                      const kol = parseInt(e.target.value) || 0;
                      const meters = kol * 0.72 + (formState.vasthuKol.perimeterViral || 0) * 0.03;
                      setFormState({
                        ...formState,
                        vasthuKol: {
                          ...formState.vasthuKol,
                          perimeterKol: kol,
                          meters: Number(meters.toFixed(2)),
                        },
                      });
                    }}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Perimeter Viral (വിരൽ)
                  </label>
                  <input
                    type="number"
                    value={formState.vasthuKol.perimeterViral}
                    onChange={(e) => {
                      const viral = parseInt(e.target.value) || 0;
                      const meters = (formState.vasthuKol.perimeterKol || 0) * 0.72 + viral * 0.03;
                      setFormState({
                        ...formState,
                        vasthuKol: {
                          ...formState.vasthuKol,
                          perimeterViral: viral,
                          meters: Number(meters.toFixed(2)),
                        },
                      });
                    }}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Calculated Meters (മീറ്റർ)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.vasthuKol.meters}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        vasthuKol: {
                          ...formState.vasthuKol,
                          meters: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                    Vasthu Status
                  </label>
                  <input
                    type="text"
                    value={formState.vasthuKol.status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        vasthuKol: {
                          ...formState.vasthuKol,
                          status: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
                    placeholder="Uttamam (ഉത്തമം)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(formState);
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Title Block & Attributes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. EDIT SHEET & MARGINS MODAL (Paper Size, Orientation, Margins, Outline)
// =========================================================================
interface EditSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: DrawingPage;
  onSave: (updatedPage: DrawingPage) => void;
}

export const EditSheetModal: React.FC<EditSheetModalProps> = ({
  isOpen,
  onClose,
  page,
  onSave,
}) => {
  const [formState, setFormState] = useState<DrawingPage>(page);

  if (!isOpen) return null;

  const currentMargins: SheetMargins = formState.margins || {
    top: 12,
    right: 12,
    bottom: 12,
    left: 24,
  };

  const setMargins = (margins: SheetMargins) => {
    setFormState({ ...formState, margins });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black font-mono uppercase text-white tracking-wide">
              SHEET SPECIFICATION & MARGIN SETTINGS
            </h2>
            <p className="text-xs text-slate-400">
              Set standard architectural size, page margins and outline
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Sheet Title & Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Sheet Title
              </label>
              <input
                type="text"
                value={formState.sheetTitle}
                onChange={(e) => setFormState({ ...formState, sheetTitle: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                Sheet Number
              </label>
              <input
                type="text"
                value={formState.sheetNumber}
                onChange={(e) => setFormState({ ...formState, sheetNumber: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Paper Size: A3 vs A4 */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Standard Paper Size (ISO)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormState({ ...formState, paperSize: 'a3' })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  formState.paperSize === 'a3'
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="font-mono font-bold text-xs text-white">A3 Standard</div>
                <div className="text-[10px] text-slate-400">420 × 297 mm (Master)</div>
              </button>
              <button
                type="button"
                onClick={() => setFormState({ ...formState, paperSize: 'a4' })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  formState.paperSize === 'a4'
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="font-mono font-bold text-xs text-white">A4 Standard</div>
                <div className="text-[10px] text-slate-400">297 × 210 mm (Compact)</div>
              </button>
            </div>
          </div>

          {/* Orientation: Landscape vs Portrait */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
              Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormState({ ...formState, orientation: 'landscape' })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  formState.orientation === 'landscape'
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="font-mono font-bold text-xs text-white">Landscape</div>
                <div className="text-[10px] text-slate-400">Title Block on Right</div>
              </button>
              <button
                type="button"
                onClick={() => setFormState({ ...formState, orientation: 'portrait' })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  formState.orientation === 'portrait'
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className="font-mono font-bold text-xs text-white">Portrait</div>
                <div className="text-[10px] text-slate-400">Title Block at Bottom</div>
              </button>
            </div>
          </div>

          {/* MARGIN SETTINGS & PRESETS */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                PAGE MARGINS (BEFORE OUTLINE BORDER)
              </span>
              <span className="text-[9px] font-mono text-blue-400">
                Left {currentMargins.left} • Top {currentMargins.top} • Right {currentMargins.right} • Bottom {currentMargins.bottom} px
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setMargins({ top: 12, right: 12, bottom: 12, left: 24 })}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-center"
              >
                Standard Arch (24/12)
              </button>
              <button
                type="button"
                onClick={() => setMargins({ top: 12, right: 12, bottom: 12, left: 12 })}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-center"
              >
                Uniform (12px)
              </button>
              <button
                type="button"
                onClick={() => setMargins({ top: 6, right: 6, bottom: 6, left: 6 })}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-center"
              >
                Narrow (6px)
              </button>
            </div>

            {/* Individual Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                  <span>Left Margin (Filing):</span>
                  <span className="text-white font-bold">{currentMargins.left}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={currentMargins.left}
                  onChange={(e) =>
                    setMargins({ ...currentMargins, left: parseInt(e.target.value) || 0 })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                  <span>Right Margin:</span>
                  <span className="text-white font-bold">{currentMargins.right}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={currentMargins.right}
                  onChange={(e) =>
                    setMargins({ ...currentMargins, right: parseInt(e.target.value) || 0 })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                  <span>Top Margin:</span>
                  <span className="text-white font-bold">{currentMargins.top}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={currentMargins.top}
                  onChange={(e) =>
                    setMargins({ ...currentMargins, top: parseInt(e.target.value) || 0 })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                  <span>Bottom Margin:</span>
                  <span className="text-white font-bold">{currentMargins.bottom}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={currentMargins.bottom}
                  onChange={(e) =>
                    setMargins({ ...currentMargins, bottom: parseInt(e.target.value) || 0 })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(formState);
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Sheet Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
