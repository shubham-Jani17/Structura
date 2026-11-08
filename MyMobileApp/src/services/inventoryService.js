/**
 * Structura MAD - Construction Inventory & Stock Management Engine
 * Authoritative in-memory inventory service providing material tracking,
 * stock deduction calculations, low-stock alerts, and transaction history.
 */

export const INVENTORY_CATEGORIES = [
  'All',
  'Cement & Binders',
  'Structural Steel',
  'Aggregates & Sand',
  'Masonry & Bricks',
  'Concrete & Mortar',
  'Finishes & Chemical',
  'Plumbing & Drainage',
  'Safety & Equipment',
];

export const CONSTRUCTION_PROJECTS = [
  'Skyline Commercial Tower',
  'Apex Metro Hub Phase 2',
  'Harbor View Residences',
  'Industrial Logistics Park',
];

export const INITIAL_INVENTORY_ITEMS = [
  {
    id: 'MAT-001',
    name: 'Portland Cement (Type I)',
    category: 'Cement & Binders',
    unit: 'Bags (50kg)',
    openingQuantity: 500,
    receivedQuantity: 100,
    usedQuantity: 150,
    availableQuantity: 450, // 500 + 100 - 150 = 450
    minStockLevel: 100,
    project: 'Skyline Commercial Tower',
    location: 'Central Batching Yard - Shed A',
    lastUpdated: '2026-11-08T09:30:00.000Z',
    supplier: 'UltraCem Building Materials Corp.',
    unitPrice: 12.5,
  },
  {
    id: 'MAT-002',
    name: 'TMT Steel Rebars (16mm Fe500)',
    category: 'Structural Steel',
    unit: 'Tons',
    openingQuantity: 15.0,
    receivedQuantity: 5.0,
    usedQuantity: 16.8,
    availableQuantity: 3.2, // 15 + 5 - 16.8 = 3.2 (<= 8.0 minStockLevel -> Low Stock!)
    minStockLevel: 8.0,
    project: 'Skyline Commercial Tower',
    location: 'North Rebar Fabrication Bay',
    lastUpdated: '2026-11-08T11:15:00.000Z',
    supplier: 'Apex Steel Industries Ltd.',
    unitPrice: 840.0,
  },
  {
    id: 'MAT-003',
    name: 'River Sand (Coarse Grade)',
    category: 'Aggregates & Sand',
    unit: 'm³',
    openingQuantity: 120,
    receivedQuantity: 40,
    usedQuantity: 75,
    availableQuantity: 85, // 120 + 40 - 75 = 85
    minStockLevel: 30,
    project: 'Skyline Commercial Tower',
    location: 'Raw Material Bunkers - Bay 3',
    lastUpdated: '2026-11-07T16:45:00.000Z',
    supplier: 'Valley Aggregates Quarry',
    unitPrice: 38.0,
  },
  {
    id: 'MAT-004',
    name: 'Red Clay Solid Bricks (Standard)',
    category: 'Masonry & Bricks',
    unit: 'Pieces',
    openingQuantity: 20000,
    receivedQuantity: 5000,
    usedQuantity: 13000,
    availableQuantity: 12000, // 20000 + 5000 - 13000 = 12000
    minStockLevel: 2500,
    project: 'Apex Metro Hub Phase 2',
    location: 'East Perimeter Storage Yard',
    lastUpdated: '2026-11-06T14:20:00.000Z',
    supplier: 'TerraCraft Clay Works',
    unitPrice: 0.85,
  },
  {
    id: 'MAT-005',
    name: 'Ready-Mix Concrete M25',
    category: 'Concrete & Mortar',
    unit: 'm³',
    openingQuantity: 60,
    receivedQuantity: 20,
    usedQuantity: 80,
    availableQuantity: 0, // 60 + 20 - 80 = 0 (Out of Stock!)
    minStockLevel: 15,
    project: 'Skyline Commercial Tower',
    location: 'Pour Site - Sub-Basement 2',
    lastUpdated: '2026-11-08T08:00:00.000Z',
    supplier: 'QuickMix Ready-Mix Logistics',
    unitPrice: 110.0,
  },
  {
    id: 'MAT-006',
    name: 'Bituminous Waterproofing Primer',
    category: 'Finishes & Chemical',
    unit: 'Buckets (20L)',
    openingQuantity: 40,
    receivedQuantity: 10,
    usedQuantity: 32,
    availableQuantity: 18, // 40 + 10 - 32 = 18 (<= 25 minStockLevel -> Low Stock!)
    minStockLevel: 25,
    project: 'Harbor View Residences',
    location: 'Chemical Storage Container B',
    lastUpdated: '2026-11-07T10:10:00.000Z',
    supplier: 'SealPro Building Chemistry',
    unitPrice: 65.0,
  },
  {
    id: 'MAT-007',
    name: 'Structural Formwork Timber (2x4)',
    category: 'Cement & Binders',
    unit: 'Pieces',
    openingQuantity: 500,
    receivedQuantity: 100,
    usedQuantity: 260,
    availableQuantity: 340,
    minStockLevel: 80,
    project: 'Skyline Commercial Tower',
    location: 'Carpentry Workshop Yard',
    lastUpdated: '2026-11-05T15:30:00.000Z',
    supplier: 'Northwest Timber Guild',
    unitPrice: 7.2,
  },
  {
    id: 'MAT-008',
    name: 'Heavy-Duty PVC Drainage Pipes (110mm)',
    category: 'Plumbing & Drainage',
    unit: 'Meters',
    openingQuantity: 300,
    receivedQuantity: 50,
    usedQuantity: 170,
    availableQuantity: 180,
    minStockLevel: 50,
    project: 'Apex Metro Hub Phase 2',
    location: 'Plumbing Supply Depot',
    lastUpdated: '2026-11-04T12:00:00.000Z',
    supplier: 'AquaFlow Piping Systems',
    unitPrice: 14.0,
  },
  {
    id: 'MAT-009',
    name: 'High-Tensile Galvanized Binding Wire',
    category: 'Structural Steel',
    unit: 'kg',
    openingQuantity: 150,
    receivedQuantity: 50,
    usedQuantity: 155,
    availableQuantity: 45, // 150 + 50 - 155 = 45 (<= 50 minStockLevel -> Low Stock!)
    minStockLevel: 50,
    project: 'Skyline Commercial Tower',
    location: 'North Rebar Fabrication Bay',
    lastUpdated: '2026-11-08T07:45:00.000Z',
    supplier: 'Apex Steel Industries Ltd.',
    unitPrice: 3.5,
  },
  {
    id: 'MAT-010',
    name: 'ANSI Heavy-Duty Hard Hats & PPE Sets',
    category: 'Safety & Equipment',
    unit: 'Sets',
    openingQuantity: 100,
    receivedQuantity: 20,
    usedQuantity: 55,
    availableQuantity: 65,
    minStockLevel: 20,
    project: 'Skyline Commercial Tower',
    location: 'Safety Officer Headquarters',
    lastUpdated: '2026-11-03T09:00:00.000Z',
    supplier: 'SafeGuard PPE Direct',
    unitPrice: 32.0,
  },
];

export const INITIAL_TRANSACTION_HISTORY = [
  {
    id: 'TXN-9021',
    materialId: 'MAT-001',
    materialName: 'Portland Cement (Type I)',
    type: 'USED',
    quantity: 40,
    unit: 'Bags (50kg)',
    project: 'Skyline Commercial Tower',
    workerId: 'WRK-8924',
    workerName: 'Marcus Vance',
    purpose: 'Level 4 Column core concrete casting',
    remainingStockAfter: 450,
    timestamp: '2026-11-08T09:30:00.000Z',
  },
  {
    id: 'TXN-9020',
    materialId: 'MAT-002',
    materialName: 'TMT Steel Rebars (16mm Fe500)',
    type: 'USED',
    quantity: 2.5,
    unit: 'Tons',
    project: 'Skyline Commercial Tower',
    workerId: 'WRK-8924',
    workerName: 'Marcus Vance',
    purpose: 'East shear wall reinforcement tying',
    remainingStockAfter: 3.2,
    timestamp: '2026-11-08T11:15:00.000Z',
  },
  {
    id: 'TXN-9019',
    materialId: 'MAT-005',
    materialName: 'Ready-Mix Concrete M25',
    type: 'USED',
    quantity: 20,
    unit: 'm³',
    project: 'Skyline Commercial Tower',
    workerId: 'WRK-7102',
    workerName: 'Dave Kowalski',
    purpose: 'Sub-Basement 2 final retaining wall pour',
    remainingStockAfter: 0,
    timestamp: '2026-11-08T08:00:00.000Z',
  },
  {
    id: 'TXN-9018',
    materialId: 'MAT-003',
    materialName: 'River Sand (Coarse Grade)',
    type: 'USED',
    quantity: 15,
    unit: 'm³',
    project: 'Skyline Commercial Tower',
    workerId: 'WRK-8924',
    workerName: 'Marcus Vance',
    purpose: 'Mortar bed preparation for external perimeter',
    remainingStockAfter: 85,
    timestamp: '2026-11-07T16:45:00.000Z',
  },
  {
    id: 'TXN-9017',
    materialId: 'MAT-006',
    materialName: 'Bituminous Waterproofing Primer',
    type: 'USED',
    quantity: 8,
    unit: 'Buckets (20L)',
    project: 'Harbor View Residences',
    workerId: 'WRK-6430',
    workerName: 'Elena Rostova',
    purpose: 'Podium deck waterproofing underlayment',
    remainingStockAfter: 18,
    timestamp: '2026-11-07T10:10:00.000Z',
  },
  {
    id: 'TXN-9016',
    materialId: 'MAT-004',
    materialName: 'Red Clay Solid Bricks (Standard)',
    type: 'USED',
    quantity: 2500,
    unit: 'Pieces',
    project: 'Apex Metro Hub Phase 2',
    workerId: 'WRK-5521',
    workerName: 'Samir Patel',
    purpose: 'Internal partition masonry Ground Floor Retail',
    remainingStockAfter: 12000,
    timestamp: '2026-11-06T14:20:00.000Z',
  },
];

/**
 * Evaluates stock status based on available quantity and minStockLevel:
 * - OUT_OF_STOCK: available === 0
 * - LOW_STOCK: available <= minStockLevel
 * - AVAILABLE: available > minStockLevel
 */
export function getStockStatus(availableQuantity, minStockLevel) {
  if (availableQuantity <= 0) {
    return {
      status: 'OUT_OF_STOCK',
      label: 'Out of Stock',
      badgeBg: 'bg-red-50',
      badgeBorder: 'border-red-200',
      badgeText: 'text-red-700',
      dotColor: 'bg-red-500',
      color: '#EF4444',
    };
  }
  if (availableQuantity <= minStockLevel) {
    return {
      status: 'LOW_STOCK',
      label: 'Low Stock',
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-200',
      badgeText: 'text-amber-700',
      dotColor: 'bg-amber-500',
      color: '#F59E0B',
    };
  }
  return {
    status: 'AVAILABLE',
    label: 'In Stock',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    color: '#10B981',
  };
}

class InventoryService {
  constructor() {
    this.items = INITIAL_INVENTORY_ITEMS.map((item) => ({ ...item }));
    this.transactions = INITIAL_TRANSACTION_HISTORY.map((txn) => ({ ...txn }));
  }

  // Get all items with optional search, category, status, and project filters
  getItems(filters = {}) {
    const { search = '', category = 'All', status = 'All', project = 'All' } = filters;
    const searchLower = search.trim().toLowerCase();

    return this.items.filter((item) => {
      // Category filter
      if (category !== 'All' && item.category !== category) {
        return false;
      }

      // Project filter
      if (project !== 'All' && item.project !== project) {
        return false;
      }

      // Status filter
      if (status !== 'All') {
        const itemStatus = getStockStatus(item.availableQuantity, item.minStockLevel).status;
        if (itemStatus !== status) {
          return false;
        }
      }

      // Search filter (name, id, location, supplier)
      if (searchLower) {
        const matchesName = item.name.toLowerCase().includes(searchLower);
        const matchesId = item.id.toLowerCase().includes(searchLower);
        const matchesLocation = item.location?.toLowerCase().includes(searchLower);
        const matchesCategory = item.category.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesId && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }

  // Get item by ID
  getItemById(itemId) {
    return this.items.find((item) => item.id === itemId) || null;
  }

  /**
   * Calculate summary metrics for the Inventory Dashboard:
   * - Total Inventory Items count
   * - Available Stock items count
   * - Low Stock Items count
   * - Out of Stock Items count
   * - Total Transactions count
   */
  getDashboardMetrics() {
    let availableCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    this.items.forEach((item) => {
      const { status } = getStockStatus(item.availableQuantity, item.minStockLevel);
      if (status === 'OUT_OF_STOCK') {
        outOfStockCount++;
      } else if (status === 'LOW_STOCK') {
        lowStockCount++;
      } else {
        availableCount++;
      }
    });

    return {
      totalItems: this.items.length,
      availableCount,
      lowStockCount,
      outOfStockCount,
      totalTransactions: this.transactions.length,
    };
  }

  /**
   * Record material usage:
   * 1. Validates quantity > 0.
   * 2. Prevents consumption exceeding available stock.
   * 3. Deducts used quantity from availableQuantity:
   *    Available Stock = Opening Stock + Received Stock - Used Stock.
   * 4. Updates usedQuantity and lastUpdated timestamp.
   * 5. Appends record to transaction history.
   */
  async recordMaterialUsage({
    itemId,
    quantity,
    project,
    purpose,
    workerId = 'WRK-8924',
    workerName = 'Marcus Vance',
  }) {
    const item = this.getItemById(itemId);
    if (!item) {
      throw new Error('Selected material not found in inventory registry.');
    }

    const numericQty = parseFloat(quantity);
    if (isNaN(numericQty) || numericQty <= 0) {
      throw new Error('Please enter a valid positive quantity to record usage.');
    }

    // Critical stock constraint: Cannot consume more than available stock
    if (numericQty > item.availableQuantity) {
      throw new Error(
        `Usage exceeds available stock! Only ${item.availableQuantity} ${item.unit} available for ${item.name}.`
      );
    }

    const trimmedPurpose = (purpose || '').trim();
    if (trimmedPurpose.length < 3) {
      throw new Error('Please provide a purpose or description for material usage.');
    }

    // Execute Authoritative Stock Deduction
    const remainingBefore = item.availableQuantity;
    const remainingAfter = parseFloat((remainingBefore - numericQty).toFixed(2));

    item.availableQuantity = remainingAfter;
    item.usedQuantity = parseFloat(((item.usedQuantity || 0) + numericQty).toFixed(2));
    item.lastUpdated = new Date().toISOString();

    if (project) {
      item.project = project;
    }

    // Create Transaction Record
    const transaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      materialId: item.id,
      materialName: item.name,
      type: 'USED',
      quantity: numericQty,
      unit: item.unit,
      project: project || item.project,
      workerId,
      workerName,
      purpose: trimmedPurpose,
      remainingStockAfter: remainingAfter,
      timestamp: new Date().toISOString(),
    };

    this.transactions.unshift(transaction);

    return {
      item: { ...item },
      transaction,
      metrics: this.getDashboardMetrics(),
    };
  }

  // Get transaction history with optional filters
  getTransactionHistory(filters = {}) {
    const { materialId = 'All', project = 'All', search = '' } = filters;
    const searchLower = search.trim().toLowerCase();

    return this.transactions.filter((txn) => {
      if (materialId !== 'All' && txn.materialId !== materialId) {
        return false;
      }
      if (project !== 'All' && txn.project !== project) {
        return false;
      }
      if (searchLower) {
        const matchesMat = txn.materialName.toLowerCase().includes(searchLower);
        const matchesWorker = txn.workerName.toLowerCase().includes(searchLower);
        const matchesPurpose = txn.purpose.toLowerCase().includes(searchLower);
        const matchesId = txn.id.toLowerCase().includes(searchLower);
        if (!matchesMat && !matchesWorker && !matchesPurpose && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }

  // Get item-specific transaction history
  getItemHistory(itemId) {
    return this.transactions.filter((txn) => txn.materialId === itemId);
  }

  getCategories() {
    return INVENTORY_CATEGORIES;
  }

  getProjects() {
    return CONSTRUCTION_PROJECTS;
  }
}

export const inventoryService = new InventoryService();
