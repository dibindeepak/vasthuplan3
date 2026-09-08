export interface DrawingElement {
  id: string;
  type: 'block' | 'wall' | 'dim' | 'text' | 'revision-cloud' | 'leader';
  blockType?: 'door' | 'window' | 'furniture' | 'plant' | 'car' | 'card';
  blockId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
  subLabel?: string;
  color?: string;
  strokeWidth?: number;
  scale?: number;
  layer?: 'blueprint' | 'walls' | 'openings' | 'furniture' | 'landscape' | 'vehicles' | 'annotations' | 'stamps';
  points?: { x: number; y: number }[];
  attributes?: Record<string, any>;
}

export interface SheetMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface AreaStatementRow {
  id: string;
  floor: string;
  proposedBuiltup: number;
  proposedFloor: number;
  existingBuiltup: number;
  existingFloor: number;
}

export interface TitleBlockData {
  firm: {
    name: string;
    subline: string;
    address: string;
    phone: string;
    whatsapp: string;
    logoUrl?: string;
  };
  company?: {
    name: string;
    subline: string;
    address: string;
    phone: string;
    whatsapp: string;
    logoUrl?: string;
  };
  engineer: {
    name: string;
    title: string;
    regNo: string;
    phone: string;
    whatsapp: string;
    badge: string;
    credentialsBadge?: string;
    email?: string;
  };
  client: string;
  location: string;
  drawingTitle: string;
  scale: string;
  date: string;
  revision: string;
  areaStatement: AreaStatementRow[];
  vasthuKol: {
    perimeterKol: number;
    perimeterViral: number;
    meters: number;
    status: string;
  };
  drawingNumber: string;
  sheetStatus: string;
  position?: 'auto' | 'right' | 'bottom';
}

export interface ViewportSettings {
  planTitle: string;
  builtUpArea: string;
  ceilingHeight: string;
  northDegree: number;
  widthDimension: string;
  heightDimension: string;
  showGrid: boolean;
  gridSnap: boolean;
  gridSize: number;
  scaleRatioText: string;
}

export interface ArchitecturalPlan {
  id: string;
  name: string; // e.g. "Ground Floor Plan", "First Floor Plan", "Elevation", "Site Plan"
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  opacity: number;
  rotation: number;
  visible: boolean;
  scaleRatioText: string;
  builtUpArea?: string;
  calibrationPixelsPerMeter?: number;
}

export interface DrawingPage {
  id: string;
  pageNumber: number;
  sheetTitle: string;
  sheetNumber: string;
  name?: string;
  paperSize: 'a4' | 'a3';
  orientation: 'landscape' | 'portrait';
  margins?: SheetMargins;
  titleBlockPosition?: 'auto' | 'right' | 'bottom';
  plans: ArchitecturalPlan[];
  elements: DrawingElement[];
  titleBlock: TitleBlockData;
  viewport: ViewportSettings;
}

export interface UnderlayPlan {
  imageUrl: string | null;
  name: string;
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  visible: boolean;
  calibrationPixelsPerMeter?: number;
}

export interface ArchitecturalProject {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  paperSize: 'a4' | 'a3';
  orientation: 'landscape' | 'portrait';
  margins?: SheetMargins;
  titleBlockPosition?: 'auto' | 'right' | 'bottom';
  activePageIndex: number;
  pages: DrawingPage[];
  // Compatibility fields pointing to active page
  titleBlock: TitleBlockData;
  viewport: ViewportSettings;
  underlay: UnderlayPlan;
  elements: DrawingElement[];
}

export interface BlockCatalogItem {
  id: string;
  name: string;
  category: 'door' | 'window' | 'furniture' | 'plant' | 'car' | 'card';
  width: number;
  height: number;
  defaultLabel?: string;
  defaultSubLabel?: string;
  thumbnailSvg?: string;
  renderSvg: (width: number, height: number, color?: string, label?: string) => React.ReactNode;
}
