import { ArchitecturalProject, DrawingPage, SheetMargins, TitleBlockData, ViewportSettings } from './types';

export const DEFAULT_FIRM = {
  name: 'VASTHUSILPY KERALASSERY',
  subline: 'VASTHU & CIVIL ARCHITECTURE',
  address: 'Main Road, Keralassery, Palakkad - 678641, Kerala',
  phone: '7012383137',
  whatsapp: '+91 88482 41463',
};

export const DEFAULT_MARGINS: SheetMargins = {
  top: 12,
  right: 12,
  bottom: 12,
  left: 24, // 24px left margin for binding / punching
};

export const DEFAULT_ENGINEER = {
  name: 'DEEPAK .C',
  title: 'SUPERVISOR-A (Civil) & Vasthu Silpy',
  regNo: 'E-2050/08/14087/KKD/318/2018/CA',
  phone: '7012383137',
  whatsapp: '+91 88482 41463',
  badge: 'LSGD REGISTERED',
};

export function createDefaultTitleBlock(
  drawingNumber = 'DWG-2026/01',
  drawingTitle = 'ARCHITECTURAL DRAWING SHEET',
  client = 'CLIENT NAME',
  location = 'KERALA, INDIA'
): TitleBlockData {
  return {
    firm: { ...DEFAULT_FIRM },
    company: { ...DEFAULT_FIRM },
    engineer: { ...DEFAULT_ENGINEER },
    client,
    location,
    drawingTitle,
    scale: '1 : 100',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
    revision: 'R0',
    drawingNumber,
    sheetStatus: 'SHEET 1 OF 1',
    areaStatement: [
      {
        id: 'row-1',
        floor: 'Ground Floor',
        proposedBuiltup: 0,
        proposedFloor: 0,
        existingBuiltup: 0,
        existingFloor: 0,
      },
    ],
    vasthuKol: {
      perimeterKol: 36,
      perimeterViral: 8,
      meters: 28.8,
      status: 'Uttamam (28.80 m)',
    },
  };
}

export function createDefaultViewport(planTitle = 'PLAN VIEW'): ViewportSettings {
  return {
    planTitle,
    builtUpArea: '0.00 SQ.M',
    ceilingHeight: '3.00 M',
    northDegree: 0,
    widthDimension: '0.00 M',
    heightDimension: '0.00 M',
    showGrid: true,
    gridSnap: true,
    gridSize: 20,
    scaleRatioText: '1 : 100',
  };
}

export function createBlankPage(
  pageNumber: number,
  paperSize: 'a4' | 'a3' = 'a3',
  orientation: 'landscape' | 'portrait' = 'landscape',
  sheetTitle = 'ARCHITECTURAL DRAWING SHEET',
  drawingNumber = `DWG-2026/0${pageNumber}`
): DrawingPage {
  const tb = createDefaultTitleBlock(drawingNumber, sheetTitle);
  tb.sheetStatus = `SHEET ${pageNumber} OF ${pageNumber}`;
  return {
    id: `page-${pageNumber}-${Date.now().toString(36)}`,
    pageNumber,
    sheetTitle,
    sheetNumber: drawingNumber,
    paperSize,
    orientation,
    margins: { ...DEFAULT_MARGINS },
    titleBlockPosition: 'auto',
    plans: [], // NO PLANS ON NEW SHEETS
    elements: [], // NO ELEMENTS ON NEW SHEETS
    titleBlock: tb,
    viewport: createDefaultViewport(sheetTitle),
  };
}

export function createNewBlankProject(
  name = 'Untitled Architectural Drawing',
  paperSize: 'a4' | 'a3' = 'a3',
  orientation: 'landscape' | 'portrait' = 'landscape',
  drawingNumber = 'DWG-2026/01'
): ArchitecturalProject {
  const page1 = createBlankPage(1, paperSize, orientation, 'ARCHITECTURAL DRAWING SHEET', drawingNumber);
  return {
    id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paperSize,
    orientation,
    margins: { ...DEFAULT_MARGINS },
    titleBlockPosition: 'auto',
    activePageIndex: 0,
    pages: [page1],
    titleBlock: page1.titleBlock,
    viewport: page1.viewport,
    underlay: {
      imageUrl: null,
      name: 'Blank Plan',
      opacity: 0.9,
      x: 0,
      y: 0,
      width: 800,
      height: 600,
      scale: 1.0,
      rotation: 0,
      visible: true,
    },
    elements: [],
  };
}

// DEFAULT INITIAL PROJECT: STRICTLY BLANK / NO PLANS ON LOAD WITH DETERMINISTIC STATIC IDS
export const DEFAULT_PROJECT_ID = 'default-arch-project-01';
export const DEFAULT_PAGE_ID = 'default-page-01';

const defaultInitialPage: DrawingPage = {
  id: DEFAULT_PAGE_ID,
  pageNumber: 1,
  sheetTitle: 'ARCHITECTURAL DRAWING SHEET',
  sheetNumber: 'DWG-2026/01',
  paperSize: 'a3',
  orientation: 'landscape',
  margins: { ...DEFAULT_MARGINS },
  titleBlockPosition: 'auto',
  plans: [],
  elements: [],
  titleBlock: createDefaultTitleBlock('DWG-2026/01', 'ARCHITECTURAL DRAWING SHEET'),
  viewport: createDefaultViewport('ARCHITECTURAL DRAWING SHEET'),
};

export const DEFAULT_PROJECT: ArchitecturalProject = {
  id: DEFAULT_PROJECT_ID,
  name: 'New Architectural Project',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
  paperSize: 'a3',
  orientation: 'landscape',
  margins: { ...DEFAULT_MARGINS },
  titleBlockPosition: 'auto',
  activePageIndex: 0,
  pages: [defaultInitialPage],
  titleBlock: defaultInitialPage.titleBlock,
  viewport: defaultInitialPage.viewport,
  underlay: {
    imageUrl: null,
    name: 'Blank Plan',
    opacity: 0.9,
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    scale: 1.0,
    rotation: 0,
    visible: true,
  },
  elements: [],
};

// SAMPLE PROJECT: Available in Dashboard if user wishes to inspect a populated multi-plan demo
export const SAMPLE_CLINIC_PROJECT: ArchitecturalProject = {
  id: 'clinic-lab-sample',
  name: 'Sample: Clinic & Diagnostic Lab Project',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T03:30:00.000Z',
  paperSize: 'a3',
  orientation: 'landscape',
  activePageIndex: 0,
  pages: [
    {
      id: 'page-sample-1',
      pageNumber: 1,
      sheetTitle: 'FIRST FLOOR PLAN',
      sheetNumber: 'DWG-COMM-2026/01',
      paperSize: 'a3',
      orientation: 'landscape',
      plans: [
        {
          id: 'sample-plan-1',
          name: 'First Floor Architectural Plan',
          imageUrl: '',
          x: 40,
          y: 60,
          width: 680,
          height: 520,
          scale: 1.0,
          opacity: 0.95,
          rotation: 0,
          visible: true,
          scaleRatioText: '1 : 100',
          builtUpArea: '108.50 SQ.M',
        },
      ],
      elements: [
        {
          id: 'elem-sample-room1',
          type: 'text',
          x: 180,
          y: 200,
          width: 140,
          height: 40,
          rotation: 0,
          label: 'CONSULTING ROOM 01',
          subLabel: '3.80 x 4.00 M',
          layer: 'annotations',
        },
        {
          id: 'elem-sample-room2',
          type: 'text',
          x: 480,
          y: 200,
          width: 140,
          height: 40,
          rotation: 0,
          label: 'DIAGNOSTIC LAB',
          subLabel: '4.80 x 4.20 M',
          layer: 'annotations',
        },
      ],
      titleBlock: {
        firm: { ...DEFAULT_FIRM },
        engineer: { ...DEFAULT_ENGINEER },
        client: 'DR. ANANTHAKRISHNAN & PARTNERS',
        location: 'Resurvey No: 182/4, Ward 12, Keralassery, Palakkad',
        drawingTitle: 'PROPOSED CLINIC & LAB - FIRST FLOOR PLAN',
        scale: '1 : 100',
        date: '07-09-2026',
        revision: 'R0',
        drawingNumber: 'DWG-COMM-2026/01',
        sheetStatus: 'SHEET 1 OF 2',
        areaStatement: [
          {
            id: 'row-1',
            floor: 'Ground Floor (Pharmacy & OPD)',
            proposedBuiltup: 182.4,
            proposedFloor: 172.5,
            existingBuiltup: 0,
            existingFloor: 0,
          },
          {
            id: 'row-2',
            floor: 'First Floor (Diagnostic Lab & Clinic)',
            proposedBuiltup: 165.8,
            proposedFloor: 156.9,
            existingBuiltup: 0,
            existingFloor: 0,
          },
        ],
        vasthuKol: {
          perimeterKol: 36,
          perimeterViral: 8,
          meters: 28.8,
          status: 'Uttamam (28.80 m)',
        },
      },
      viewport: {
        planTitle: 'FIRST FLOOR PLAN',
        builtUpArea: '108.50 SQ.M (1168 SQ.FT)',
        ceilingHeight: '3.00 M',
        northDegree: 0,
        widthDimension: "14.40 M (47' 3\")",
        heightDimension: "11.50 M (37' 8\")",
        showGrid: true,
        gridSnap: true,
        gridSize: 20,
        scaleRatioText: '1 : 100',
      },
    },
    {
      id: 'page-sample-2',
      pageNumber: 2,
      sheetTitle: 'ELEVATIONS & SITE PLAN',
      sheetNumber: 'DWG-COMM-2026/02',
      paperSize: 'a3',
      orientation: 'landscape',
      plans: [
        {
          id: 'sample-plan-2a',
          name: 'Front Elevation',
          imageUrl: '',
          x: 40,
          y: 80,
          width: 320,
          height: 240,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          visible: true,
          scaleRatioText: '1 : 100',
        },
        {
          id: 'sample-plan-2b',
          name: 'Site Plan & Setbacks',
          imageUrl: '',
          x: 400,
          y: 80,
          width: 320,
          height: 380,
          scale: 1.0,
          opacity: 1.0,
          rotation: 0,
          visible: true,
          scaleRatioText: '1 : 200',
        },
      ],
      elements: [],
      titleBlock: {
        firm: { ...DEFAULT_FIRM },
        engineer: { ...DEFAULT_ENGINEER },
        client: 'DR. ANANTHAKRISHNAN & PARTNERS',
        location: 'Resurvey No: 182/4, Ward 12, Keralassery, Palakkad',
        drawingTitle: 'PROPOSED CLINIC & LAB - ELEVATIONS & SITE PLAN',
        scale: '1 : 100 & 1 : 200',
        date: '07-09-2026',
        revision: 'R0',
        drawingNumber: 'DWG-COMM-2026/02',
        sheetStatus: 'SHEET 2 OF 2',
        areaStatement: [],
        vasthuKol: {
          perimeterKol: 36,
          perimeterViral: 8,
          meters: 28.8,
          status: 'Uttamam (28.80 m)',
        },
      },
      viewport: {
        planTitle: 'ELEVATIONS & SITE PLAN',
        builtUpArea: '108.50 SQ.M',
        ceilingHeight: '3.00 M',
        northDegree: 0,
        widthDimension: '30.00 M',
        heightDimension: '22.00 M',
        showGrid: true,
        gridSnap: true,
        gridSize: 20,
        scaleRatioText: '1 : 100',
      },
    },
  ],
  titleBlock: {
    firm: { ...DEFAULT_FIRM },
    engineer: { ...DEFAULT_ENGINEER },
    client: 'DR. ANANTHAKRISHNAN & PARTNERS',
    location: 'Resurvey No: 182/4, Ward 12, Keralassery, Palakkad',
    drawingTitle: 'PROPOSED CLINIC & LAB - FIRST FLOOR PLAN',
    scale: '1 : 100',
    date: '07-09-2026',
    revision: 'R0',
    drawingNumber: 'DWG-COMM-2026/01',
    sheetStatus: 'SHEET 1 OF 2',
    areaStatement: [],
    vasthuKol: {
      perimeterKol: 36,
      perimeterViral: 8,
      meters: 28.8,
      status: 'Uttamam (28.80 m)',
    },
  },
  viewport: {
    planTitle: 'FIRST FLOOR PLAN',
    builtUpArea: '108.50 SQ.M',
    ceilingHeight: '3.00 M',
    northDegree: 0,
    widthDimension: '14.40 M',
    heightDimension: '11.50 M',
    showGrid: true,
    gridSnap: true,
    gridSize: 20,
    scaleRatioText: '1 : 100',
  },
  underlay: {
    imageUrl: null,
    name: 'Sample Plan',
    opacity: 0.9,
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    scale: 1.0,
    rotation: 0,
    visible: true,
  },
  elements: [],
};
