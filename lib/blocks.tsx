import React from 'react';

export interface BlockDefinition {
  id: string;
  name: string;
  category: 'door' | 'window' | 'furniture' | 'plant' | 'car' | 'card';
  width: number; // in canvas units
  height: number;
  label?: string;
  subLabel?: string;
  description: string;
}

export const BLOCKS_CATALOG: BlockDefinition[] = [
  // DOORS
  {
    id: 'door-single-swing',
    name: 'Single Swing Door (90°)',
    category: 'door',
    width: 60,
    height: 60,
    label: 'D1 900x2100',
    description: 'Standard 900mm interior door with 90 degree opening arc'
  },
  {
    id: 'door-double-swing',
    name: 'Double Swing Door',
    category: 'door',
    width: 100,
    height: 60,
    label: 'D2 1500x2100',
    description: 'Double leaf entrance door with mirrored swing arcs'
  },
  {
    id: 'door-sliding-2p',
    name: 'Sliding Glass Door',
    category: 'door',
    width: 90,
    height: 24,
    label: 'SD 1800x2100',
    description: 'Two-track sliding patio door with bypass arrows'
  },
  {
    id: 'door-pocket',
    name: 'Pocket Sliding Door',
    category: 'door',
    width: 70,
    height: 20,
    label: 'PD 800x2100',
    description: 'In-wall concealed sliding pocket door'
  },

  // WINDOWS
  {
    id: 'window-standard',
    name: 'Standard Window (1.2m)',
    category: 'window',
    width: 80,
    height: 18,
    label: 'W1 1200x1400',
    description: 'Double glazed casement window with exterior sill'
  },
  {
    id: 'window-large',
    name: 'Wide Window (2.0m)',
    category: 'window',
    width: 120,
    height: 18,
    label: 'W2 2000x1400',
    description: 'Three-lite wide living room window'
  },
  {
    id: 'window-bay',
    name: 'Bay / Projection Window',
    category: 'window',
    width: 100,
    height: 40,
    label: 'BW 1800x1500',
    description: 'Projecting 45-degree architectural bay window'
  },
  {
    id: 'window-ventilator',
    name: 'High Ventilator',
    category: 'window',
    width: 50,
    height: 16,
    label: 'V1 600x600',
    description: 'Toilet / bathroom louvered ventilator'
  },

  // FURNITURE
  {
    id: 'furniture-bed-king',
    name: 'King Size Bed',
    category: 'furniture',
    width: 110,
    height: 120,
    label: 'King Bed 2.0x1.8m',
    description: 'Master bedroom king bed with dual nightstands & pillows'
  },
  {
    id: 'furniture-bed-queen',
    name: 'Queen Size Bed',
    category: 'furniture',
    width: 90,
    height: 110,
    label: 'Queen Bed 1.8x1.5m',
    description: 'Bedroom queen bed with cushioned headboard'
  },
  {
    id: 'furniture-sofa-3',
    name: '3-Seater Living Sofa',
    category: 'furniture',
    width: 130,
    height: 55,
    label: 'Sofa 2.2x0.9m',
    description: 'Living room triple-cushion couch with armrests'
  },
  {
    id: 'furniture-sofa-l',
    name: 'L-Shaped Sectional',
    category: 'furniture',
    width: 130,
    height: 110,
    label: 'Sectional Sofa',
    description: 'L-shaped corner lounge suite'
  },
  {
    id: 'furniture-dining-6',
    name: 'Dining Table (6 Seats)',
    category: 'furniture',
    width: 110,
    height: 75,
    label: 'Dining 6-Pax',
    description: 'Rectangular dining table with 6 aligned dining chairs'
  },
  {
    id: 'furniture-desk-office',
    name: 'Executive Workstation',
    category: 'furniture',
    width: 80,
    height: 55,
    label: 'Desk & Chair',
    description: 'Office desk with laptop and swivel ergonomic chair'
  },
  {
    id: 'furniture-wardrobe',
    name: 'Built-in Wardrobe',
    category: 'furniture',
    width: 100,
    height: 40,
    label: 'Wardrobe 1.8x0.6m',
    description: 'Deep storage wardrobe with interior clothing rail hatching'
  },

  // PLANTS & LANDSCAPING
  {
    id: 'plant-tree-architectural',
    name: 'Canopy Shade Tree',
    category: 'plant',
    width: 90,
    height: 90,
    label: 'Tree R=1.5m',
    description: 'Architectural landscape canopy tree top-view'
  },
  {
    id: 'plant-indoor-ficus',
    name: 'Indoor Potted Ficus',
    category: 'plant',
    width: 45,
    height: 45,
    label: 'Planter',
    description: 'Decorative circular potted indoor greenery'
  },
  {
    id: 'plant-hedge-box',
    name: 'Hedge / Planter Box',
    category: 'plant',
    width: 90,
    height: 30,
    label: 'Planter Bed',
    description: 'Balcony or terrace linear landscape planter'
  },
  {
    id: 'plant-shrub-group',
    name: 'Landscape Shrub Cluster',
    category: 'plant',
    width: 65,
    height: 55,
    label: 'Shrub',
    description: 'Cluster of outdoor decorative garden shrubs'
  },

  // VEHICLES / CARS
  {
    id: 'car-sedan',
    name: 'Sedan Car (Top View)',
    category: 'car',
    width: 130,
    height: 60,
    label: 'Sedan 4.5x1.8m',
    description: 'Architectural top-view executive sedan vehicle'
  },
  {
    id: 'car-suv',
    name: 'SUV / 4x4 (Top View)',
    category: 'car',
    width: 140,
    height: 65,
    label: 'SUV 4.8x1.9m',
    description: 'Large SUV / crossover parking silhouette'
  },
  {
    id: 'car-compact',
    name: 'Compact Hatchback',
    category: 'car',
    width: 110,
    height: 55,
    label: 'Hatchback 3.8x1.7m',
    description: 'Compact city vehicle for car porch'
  },
  {
    id: 'car-scooter',
    name: 'Two-Wheeler / Scooter',
    category: 'car',
    width: 55,
    height: 25,
    label: 'Scooter 1.9x0.7m',
    description: 'Two-wheeler scooter / motorcycle block'
  },

  // CARDS / TITLE STAMPS / ANNOTATIONS
  {
    id: 'card-stamp-approved',
    name: 'APPROVED FOR CONSTRUCTION Stamp',
    category: 'card',
    width: 140,
    height: 55,
    label: 'APPROVED FOR CONSTRUCTION',
    subLabel: 'Lic. Deepak .C • Vasthusilpy',
    description: 'Official engineer approval stamp box'
  },
  {
    id: 'card-stamp-vasthu',
    name: 'VASTHU VERIFIED (വാസ്തു ഉത്തമം)',
    category: 'card',
    width: 130,
    height: 50,
    label: 'VASTHU VERIFIED (ഉത്തമം)',
    subLabel: 'Ayadi Shadvarga Tested',
    description: 'Traditional Vasthu compliance certification stamp'
  },
  {
    id: 'card-room-tag',
    name: 'Architectural Room Tag Card',
    category: 'card',
    width: 120,
    height: 48,
    label: 'BEDROOM 03',
    subLabel: '3.80 x 4.00 M • 15.20 SQ.M',
    description: '2D Room dimension and finishing card'
  },
  {
    id: 'card-stamp-revision',
    name: 'Revision Delta Stamp',
    category: 'card',
    width: 110,
    height: 40,
    label: 'REV: R0 - TENDER ISSUE',
    subLabel: 'Date: 07-09-2026',
    description: 'Architectural revision index stamp'
  }
];

export function renderBlockSvg(blockId: string, width: number, height: number, label?: string, subLabel?: string) {
  const strokeColor = '#1e293b';
  const fillColor = '#ffffff';

  switch (blockId) {
    // DOOR: SINGLE SWING
    case 'door-single-swing': {
      const r = Math.min(width, height) - 6;
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
          {/* Wall / Frame jambs */}
          <rect x="2" y="2" width="8" height="12" fill="#0f172a" />
          <rect x="90" y="2" width="8" height="12" fill="#0f172a" />
          {/* Swing arc */}
          <path
            d="M 10,14 A 80,80 0 0,1 90,94"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Door leaf */}
          <line x1="10" y1="14" x2="90" y2="14" stroke={strokeColor} strokeWidth="4" />
          {/* Door stop & hinge */}
          <circle cx="10" cy="14" r="3" fill="#0284c7" />
          {label && (
            <text x="50" y="55" fontSize="10" textAnchor="middle" fill="#475569" fontWeight="600">
              {label}
            </text>
          )}
        </svg>
      );
    }

    // DOOR: DOUBLE SWING
    case 'door-double-swing': {
      return (
        <svg viewBox="0 0 160 100" width="100%" height="100%" className="overflow-visible">
          <rect x="2" y="2" width="8" height="12" fill="#0f172a" />
          <rect x="150" y="2" width="8" height="12" fill="#0f172a" />
          {/* Left arc */}
          <path d="M 10,14 A 70,70 0 0,1 80,84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Right arc */}
          <path d="M 150,14 A 70,70 0 0,0 80,84" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Leaves */}
          <line x1="10" y1="14" x2="80" y2="14" stroke={strokeColor} strokeWidth="3.5" />
          <line x1="150" y1="14" x2="80" y2="14" stroke={strokeColor} strokeWidth="3.5" />
          <circle cx="10" cy="14" r="3" fill="#0284c7" />
          <circle cx="150" cy="14" r="3" fill="#0284c7" />
          {label && <text x="80" y="50" fontSize="10" textAnchor="middle" fill="#475569" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // DOOR: SLIDING GLASS
    case 'door-sliding-2p': {
      return (
        <svg viewBox="0 0 150 40" width="100%" height="100%" className="overflow-visible">
          <rect x="0" y="6" width="150" height="28" fill="#f8fafc" stroke={strokeColor} strokeWidth="2" />
          <line x1="5" y1="14" x2="80" y2="14" stroke="#0284c7" strokeWidth="4" />
          <line x1="70" y1="26" x2="145" y2="26" stroke="#0284c7" strokeWidth="4" />
          {/* Arrow */}
          <path d="M 40,20 L 55,20 M 50,17 L 55,20 L 50,23" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 110,20 L 95,20 M 100,17 L 95,20 L 100,23" fill="none" stroke="#64748b" strokeWidth="1.5" />
          {label && <text x="75" y="38" fontSize="8" textAnchor="middle" fill="#475569" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // DOOR: POCKET
    case 'door-pocket': {
      return (
        <svg viewBox="0 0 120 36" width="100%" height="100%">
          <rect x="2" y="4" width="55" height="28" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="2" y1="4" x2="57" y2="32" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="2" y1="32" x2="57" y2="4" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="58" y="8" width="58" height="20" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M 95,18 L 80,18 M 85,14 L 80,18 L 85,22" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          {label && <text x="60" y="34" fontSize="8" textAnchor="middle" fill="#475569">{label}</text>}
        </svg>
      );
    }

    // WINDOW: STANDARD
    case 'window-standard': {
      return (
        <svg viewBox="0 0 120 30" width="100%" height="100%">
          {/* Exterior wall line */}
          <rect x="0" y="4" width="120" height="22" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          {/* Glass lines */}
          <line x1="0" y1="12" x2="120" y2="12" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="0" y1="18" x2="120" y2="18" stroke="#0284c7" strokeWidth="1.5" />
          {/* Mullion */}
          <line x1="60" y1="4" x2="60" y2="26" stroke={strokeColor} strokeWidth="2" />
          {label && <text x="60" y="24" fontSize="8" textAnchor="middle" fill="#0f172a" fontWeight="700">{label}</text>}
        </svg>
      );
    }

    // WINDOW: LARGE
    case 'window-large': {
      return (
        <svg viewBox="0 0 180 30" width="100%" height="100%">
          <rect x="0" y="4" width="180" height="22" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <line x1="0" y1="11" x2="180" y2="11" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="0" y1="19" x2="180" y2="19" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="60" y1="4" x2="60" y2="26" stroke={strokeColor} strokeWidth="2" />
          <line x1="120" y1="4" x2="120" y2="26" stroke={strokeColor} strokeWidth="2" />
          {label && <text x="90" y="24" fontSize="9" textAnchor="middle" fill="#0f172a" fontWeight="700">{label}</text>}
        </svg>
      );
    }

    // WINDOW: BAY
    case 'window-bay': {
      return (
        <svg viewBox="0 0 140 60" width="100%" height="100%">
          <polygon points="10,10 40,50 100,50 130,10" fill="#f8fafc" stroke={strokeColor} strokeWidth="2" />
          <line x1="40" y1="50" x2="100" y2="50" stroke="#0284c7" strokeWidth="2" />
          <line x1="10" y1="10" x2="40" y2="50" stroke="#0284c7" strokeWidth="2" />
          <line x1="100" y1="50" x2="130" y2="10" stroke="#0284c7" strokeWidth="2" />
          {label && <text x="70" y="35" fontSize="9" textAnchor="middle" fill="#475569" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // WINDOW: VENTILATOR
    case 'window-ventilator': {
      return (
        <svg viewBox="0 0 80 26" width="100%" height="100%">
          <rect x="0" y="2" width="80" height="22" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <line x1="10" y1="8" x2="70" y2="8" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="10" y1="14" x2="70" y2="14" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="10" y1="20" x2="70" y2="20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
          {label && <text x="40" y="16" fontSize="7" textAnchor="middle" fill="#0f172a" fontWeight="bold">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: KING BED
    case 'furniture-bed-king': {
      return (
        <svg viewBox="0 0 140 150" width="100%" height="100%">
          {/* Headboard */}
          <rect x="15" y="8" width="110" height="14" rx="2" fill="#334155" stroke={strokeColor} strokeWidth="1.5" />
          {/* Side Nightstands */}
          <rect x="0" y="12" width="14" height="22" rx="2" fill="#e2e8f0" stroke={strokeColor} strokeWidth="1" />
          <circle cx="7" cy="23" r="2" fill="#64748b" />
          <rect x="126" y="12" width="14" height="22" rx="2" fill="#e2e8f0" stroke={strokeColor} strokeWidth="1" />
          <circle cx="133" cy="23" r="2" fill="#64748b" />
          {/* Mattress */}
          <rect x="18" y="24" width="104" height="116" rx="6" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          {/* Pillows */}
          <rect x="25" y="30" width="40" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="75" y="30" width="40" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Duvet fold */}
          <path d="M 20,68 C 50,76 90,76 120,68 L 120,138 C 120,140 118,140 114,140 L 26,140 C 22,140 20,140 20,138 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="20" y1="68" x2="120" y2="68" stroke="#94a3b8" strokeWidth="1.5" />
          {label && <text x="70" y="110" fontSize="9" textAnchor="middle" fill="#475569" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: QUEEN BED
    case 'furniture-bed-queen': {
      return (
        <svg viewBox="0 0 120 140" width="100%" height="100%">
          <rect x="10" y="6" width="100" height="12" rx="2" fill="#475569" stroke={strokeColor} strokeWidth="1.5" />
          <rect x="14" y="20" width="92" height="112" rx="5" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <rect x="20" y="26" width="36" height="22" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="64" y="26" width="36" height="22" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 16,62 C 45,68 75,68 104,62 L 104,130 L 16,130 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          {label && <text x="60" y="100" fontSize="8" textAnchor="middle" fill="#475569" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: SOFA 3-SEATER
    case 'furniture-sofa-3': {
      return (
        <svg viewBox="0 0 160 70" width="100%" height="100%">
          {/* Main frame */}
          <rect x="6" y="6" width="148" height="58" rx="6" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          {/* Backrest */}
          <rect x="8" y="8" width="144" height="18" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          {/* Left / Right Armrests */}
          <rect x="8" y="26" width="16" height="36" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          <rect x="136" y="26" width="16" height="36" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          {/* 3 Cushions */}
          <rect x="26" y="28" width="34" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="63" y="28" width="34" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="100" y="28" width="34" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          {label && <text x="80" y="48" fontSize="8" textAnchor="middle" fill="#475569" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: L-SHAPED SECTIONAL
    case 'furniture-sofa-l': {
      return (
        <svg viewBox="0 0 140 140" width="100%" height="100%">
          <path d="M 10,10 L 130,10 L 130,55 L 60,55 L 60,130 L 10,130 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          {/* Backrests */}
          <path d="M 12,12 L 128,12 L 128,26 L 26,26 L 26,128 L 12,128 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          {/* Cushions */}
          <rect x="28" y="28" width="30" height="24" rx="2" fill="#ffffff" stroke="#cbd5e1" />
          <rect x="61" y="28" width="32" height="24" rx="2" fill="#ffffff" stroke="#cbd5e1" />
          <rect x="95" y="28" width="32" height="24" rx="2" fill="#ffffff" stroke="#cbd5e1" />
          <rect x="28" y="56" width="30" height="34" rx="2" fill="#ffffff" stroke="#cbd5e1" />
          <rect x="28" y="93" width="30" height="34" rx="2" fill="#ffffff" stroke="#cbd5e1" />
          {label && <text x="80" y="90" fontSize="8" textAnchor="middle" fill="#475569">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: DINING TABLE 6-PAX
    case 'furniture-dining-6': {
      return (
        <svg viewBox="0 0 140 100" width="100%" height="100%">
          {/* Chairs Top */}
          <rect x="25" y="2" width="22" height="12" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          <rect x="59" y="2" width="22" height="12" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          <rect x="93" y="2" width="22" height="12" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          {/* Chairs Bottom */}
          <rect x="25" y="86" width="22" height="12" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          <rect x="59" y="86" width="22" height="12" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          <rect x="93" y="86" width="22" height="12" rx="3" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
          {/* Table */}
          <rect x="15" y="18" width="110" height="64" rx="6" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <line x1="20" y1="23" x2="120" y2="23" stroke="#e2e8f0" strokeWidth="1" />
          {label && <text x="70" y="55" fontSize="9" textAnchor="middle" fill="#334155" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: DESK & CHAIR
    case 'furniture-desk-office': {
      return (
        <svg viewBox="0 0 100 80" width="100%" height="100%">
          {/* Desk */}
          <rect x="10" y="10" width="80" height="40" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          {/* Laptop */}
          <rect x="38" y="20" width="24" height="16" rx="2" fill="#334155" />
          <rect x="42" y="23" width="16" height="10" rx="1" fill="#38bdf8" />
          {/* Office Swivel Chair */}
          <circle cx="50" cy="65" r="12" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
          <path d="M 40,65 C 40,58 60,58 60,65" fill="none" stroke="#334155" strokeWidth="3" />
          {label && <text x="50" y="44" fontSize="7" textAnchor="middle" fill="#64748b">{label}</text>}
        </svg>
      );
    }

    // FURNITURE: WARDROBE
    case 'furniture-wardrobe': {
      return (
        <svg viewBox="0 0 130 50" width="100%" height="100%">
          <rect x="4" y="4" width="122" height="42" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <line x1="4" y1="4" x2="126" y2="46" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="4" y1="46" x2="126" y2="4" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="65" y1="4" x2="65" y2="46" stroke={strokeColor} strokeWidth="1.5" />
          {/* Handles */}
          <line x1="60" y1="22" x2="60" y2="28" stroke="#0284c7" strokeWidth="2.5" />
          <line x1="70" y1="22" x2="70" y2="28" stroke="#0284c7" strokeWidth="2.5" />
          {label && <text x="65" y="42" fontSize="7" textAnchor="middle" fill="#334155" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // PLANT: CANOPY TREE
    case 'plant-tree-architectural': {
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {/* Foliage outline */}
          <circle cx="50" cy="50" r="44" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          {/* Organic lobes */}
          <path
            d="M 50,8 A 42,42 0 0,1 88,32 A 42,42 0 0,1 86,70 A 42,42 0 0,1 50,92 A 42,42 0 0,1 14,70 A 42,42 0 0,1 12,32 A 42,42 0 0,1 50,8 Z"
            fill="#dcfce7"
            stroke="#15803d"
            strokeWidth="1.5"
          />
          {/* Radial branch lines */}
          <line x1="50" y1="50" x2="50" y2="16" stroke="#15803d" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="78" y2="28" stroke="#15803d" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="78" y2="72" stroke="#15803d" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="50" y2="84" stroke="#15803d" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="22" y2="72" stroke="#15803d" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="22" y2="28" stroke="#15803d" strokeWidth="1.5" />
          {/* Trunk center */}
          <circle cx="50" cy="50" r="5" fill="#14532d" />
          {label && <text x="50" y="65" fontSize="7" textAnchor="middle" fill="#14532d" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // PLANT: INDOOR FICUS
    case 'plant-indoor-ficus': {
      return (
        <svg viewBox="0 0 60 60" width="100%" height="100%">
          <circle cx="30" cy="30" r="26" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
          <circle cx="30" cy="30" r="14" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
          <circle cx="30" cy="30" r="4" fill="#15803d" />
          <path d="M 30,30 Q 38,12 44,18 Q 36,26 30,30" fill="#22c55e" opacity="0.8" />
          <path d="M 30,30 Q 18,12 14,20 Q 24,26 30,30" fill="#22c55e" opacity="0.8" />
          <path d="M 30,30 Q 48,34 46,44 Q 38,38 30,30" fill="#22c55e" opacity="0.8" />
          <path d="M 30,30 Q 12,38 18,46 Q 26,38 30,30" fill="#22c55e" opacity="0.8" />
          {label && <text x="30" y="56" fontSize="6" textAnchor="middle" fill="#166534" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // PLANT: HEDGE BOX
    case 'plant-hedge-box': {
      return (
        <svg viewBox="0 0 120 40" width="100%" height="100%">
          <rect x="2" y="2" width="116" height="36" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          <circle cx="20" cy="20" r="10" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
          <circle cx="45" cy="20" r="12" fill="#86efac" stroke="#15803d" strokeWidth="1" />
          <circle cx="75" cy="20" r="11" fill="#bbf7d0" stroke="#15803d" strokeWidth="1" />
          <circle cx="100" cy="20" r="10" fill="#86efac" stroke="#15803d" strokeWidth="1" />
          {label && <text x="60" y="36" fontSize="7" textAnchor="middle" fill="#14532d" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // PLANT: SHRUB GROUP
    case 'plant-shrub-group': {
      return (
        <svg viewBox="0 0 90 80" width="100%" height="100%">
          <circle cx="35" cy="40" r="24" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
          <circle cx="60" cy="35" r="20" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" />
          <circle cx="48" cy="55" r="18" fill="#86efac" stroke="#15803d" strokeWidth="1.5" />
          <circle cx="35" cy="40" r="3" fill="#166534" />
          <circle cx="60" cy="35" r="2.5" fill="#166534" />
          <circle cx="48" cy="55" r="2.5" fill="#166534" />
          {label && <text x="45" y="76" fontSize="7" textAnchor="middle" fill="#14532d">{label}</text>}
        </svg>
      );
    }

    // VEHICLE: SEDAN
    case 'car-sedan': {
      return (
        <svg viewBox="0 0 170 80" width="100%" height="100%">
          {/* Wheels */}
          <rect x="25" y="4" width="22" height="6" rx="2" fill="#0f172a" />
          <rect x="123" y="4" width="22" height="6" rx="2" fill="#0f172a" />
          <rect x="25" y="70" width="22" height="6" rx="2" fill="#0f172a" />
          <rect x="123" y="70" width="22" height="6" rx="2" fill="#0f172a" />
          {/* Side mirrors */}
          <polygon points="50,8 55,2 62,8" fill="#334155" />
          <polygon points="50,72 55,78 62,72" fill="#334155" />
          {/* Car body */}
          <rect x="8" y="10" width="154" height="60" rx="18" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          {/* Hood crease */}
          <line x1="28" y1="18" x2="16" y2="40" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="28" y1="62" x2="16" y2="40" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Windshield */}
          <path d="M 46,14 L 60,20 L 60,60 L 46,66 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          {/* Roof */}
          <rect x="60" y="18" width="62" height="44" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Rear Glass */}
          <path d="M 122,20 L 134,16 L 134,64 L 122,60 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          {/* Headlights */}
          <polygon points="10,18 16,14 16,22" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <polygon points="10,62 16,58 16,66" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          {/* Taillights */}
          <rect x="156" y="18" width="4" height="12" fill="#ef4444" />
          <rect x="156" y="50" width="4" height="12" fill="#ef4444" />
          {label && <text x="91" y="44" fontSize="9" textAnchor="middle" fill="#0f172a" fontWeight="700">{label}</text>}
        </svg>
      );
    }

    // VEHICLE: SUV
    case 'car-suv': {
      return (
        <svg viewBox="0 0 180 84" width="100%" height="100%">
          {/* Big Tires */}
          <rect x="26" y="3" width="26" height="8" rx="2" fill="#0f172a" />
          <rect x="130" y="3" width="26" height="8" rx="2" fill="#0f172a" />
          <rect x="26" y="73" width="26" height="8" rx="2" fill="#0f172a" />
          <rect x="130" y="73" width="26" height="8" rx="2" fill="#0f172a" />
          {/* Body */}
          <rect x="8" y="10" width="164" height="64" rx="14" fill="#ffffff" stroke={strokeColor} strokeWidth="2.5" />
          {/* Sunroof / Roof Rails */}
          <line x1="60" y1="16" x2="140" y2="16" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" />
          <line x1="60" y1="68" x2="140" y2="68" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" />
          {/* Windshield */}
          <path d="M 44,16 L 60,22 L 60,62 L 44,68 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          {/* Rear Window */}
          <path d="M 145,20 L 158,16 L 158,68 L 145,64 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          {/* Sunroof */}
          <rect x="75" y="26" width="38" height="32" rx="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
          {label && <text x="100" y="55" fontSize="9" textAnchor="middle" fill="#0f172a" fontWeight="700">{label}</text>}
        </svg>
      );
    }

    // VEHICLE: COMPACT
    case 'car-compact': {
      return (
        <svg viewBox="0 0 140 70" width="100%" height="100%">
          <rect x="20" y="4" width="18" height="6" rx="2" fill="#0f172a" />
          <rect x="102" y="4" width="18" height="6" rx="2" fill="#0f172a" />
          <rect x="20" y="60" width="18" height="6" rx="2" fill="#0f172a" />
          <rect x="102" y="60" width="18" height="6" rx="2" fill="#0f172a" />
          <rect x="8" y="10" width="124" height="50" rx="14" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <path d="M 38,14 L 50,18 L 50,52 L 38,56 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="50" y="18" width="50" height="34" rx="3" fill="#f8fafc" stroke="#94a3b8" />
          <path d="M 100,18 L 112,16 L 112,54 L 100,52 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          {label && <text x="75" y="38" fontSize="8" textAnchor="middle" fill="#334155" fontWeight="600">{label}</text>}
        </svg>
      );
    }

    // VEHICLE: SCOOTER
    case 'car-scooter': {
      return (
        <svg viewBox="0 0 80 34" width="100%" height="100%">
          <rect x="6" y="14" width="14" height="6" rx="2" fill="#0f172a" />
          <rect x="60" y="14" width="14" height="6" rx="2" fill="#0f172a" />
          <rect x="18" y="10" width="44" height="14" rx="6" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <line x1="26" y1="4" x2="26" y2="30" stroke="#334155" strokeWidth="3" />
          <rect x="36" y="11" width="22" height="12" rx="3" fill="#334155" />
          {label && <text x="45" y="32" fontSize="6" textAnchor="middle" fill="#475569">{label}</text>}
        </svg>
      );
    }

    // CARD / STAMP: APPROVED
    case 'card-stamp-approved': {
      return (
        <svg viewBox="0 0 160 65" width="100%" height="100%">
          <rect x="2" y="2" width="156" height="61" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" />
          <rect x="5" y="5" width="150" height="55" fill="none" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 2" />
          <text x="80" y="22" fontSize="10" textAnchor="middle" fill="#15803d" fontWeight="900" letterSpacing="1">
            APPROVED FOR CONSTRUCTION
          </text>
          <line x1="15" y1="28" x2="145" y2="28" stroke="#16a34a" strokeWidth="1" />
          <text x="80" y="42" fontSize="8" textAnchor="middle" fill="#166534" fontWeight="600">
            {subLabel || 'Lic. Deepak .C • Vasthusilpy'}
          </text>
          <text x="80" y="54" fontSize="7" textAnchor="middle" fill="#15803d">
            LSGD REG: E-2050/08/14087/KKD/318
          </text>
        </svg>
      );
    }

    // CARD / STAMP: VASTHU VERIFIED
    case 'card-stamp-vasthu': {
      return (
        <svg viewBox="0 0 150 60" width="100%" height="100%">
          <rect x="2" y="2" width="146" height="56" rx="4" fill="#fffbeb" stroke="#d97706" strokeWidth="2" />
          <polygon points="16,28 24,14 32,28 24,42" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="24" cy="28" r="3" fill="#b45309" />
          <text x="84" y="24" fontSize="10" textAnchor="middle" fill="#b45309" fontWeight="800">
            VASTHU VERIFIED
          </text>
          <text x="84" y="38" fontSize="8" textAnchor="middle" fill="#92400e" fontWeight="bold">
            ഉത്തമം (UTTAMAM)
          </text>
          <text x="84" y="50" fontSize="7" textAnchor="middle" fill="#78350f">
            Ayadi Shadvarga Tested
          </text>
        </svg>
      );
    }

    // CARD / ROOM TAG
    case 'card-room-tag': {
      return (
        <svg viewBox="0 0 140 55" width="100%" height="100%">
          <rect x="2" y="2" width="136" height="51" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="2" y="2" width="136" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <text x="70" y="16" fontSize="10" textAnchor="middle" fill="#0f172a" fontWeight="800">
            {label || 'ROOM NAME'}
          </text>
          <text x="70" y="36" fontSize="9" textAnchor="middle" fill="#334155" fontWeight="600">
            {subLabel || '3.80 x 4.00 M'}
          </text>
          <text x="70" y="47" fontSize="7" textAnchor="middle" fill="#64748b">
            BUILT-UP AREA: 15.20 SQ.M
          </text>
        </svg>
      );
    }

    // CARD / STAMP: REVISION
    case 'card-stamp-revision': {
      return (
        <svg viewBox="0 0 130 45" width="100%" height="100%">
          <rect x="2" y="2" width="126" height="41" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" />
          <polygon points="14,22 8,30 20,30" fill="#dc2626" />
          <text x="14" y="28" fontSize="7" textAnchor="middle" fill="#ffffff" fontWeight="bold">!</text>
          <text x="70" y="18" fontSize="9" textAnchor="middle" fill="#991b1b" fontWeight="800">
            {label || 'REVISION: R0'}
          </text>
          <text x="70" y="34" fontSize="8" textAnchor="middle" fill="#475569">
            {subLabel || 'Date: 07-09-2026'}
          </text>
        </svg>
      );
    }

    default:
      return (
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="4" y="4" width="92" height="92" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
          <text x="50" y="55" fontSize="10" textAnchor="middle" fill="#475569">{label || 'BLOCK'}</text>
        </svg>
      );
  }
}
