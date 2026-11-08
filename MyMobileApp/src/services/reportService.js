/**
 * Structura MAD - Site Report Management Service
 * Authoritative in-memory daily construction report engine providing:
 * - Dynamic task entries
 * - Multiple photograph attachments & previews
 * - Document attachments with strict < 10 MB validation & format checks
 * - Unique report ID generation
 * - Local session state management & report history filtering
 */

export const CONSTRUCTION_PROJECTS = [
  'Skyline Commercial Tower',
  'Apex Metro Hub Phase 2',
  'Harbor View Residences',
  'Industrial Logistics Park',
];

export const WORK_SHIFTS = [
  'Day Shift (08:00 AM – 05:00 PM)',
  'Night Shift (08:00 PM – 05:00 AM)',
  'Extended Overtime Shift',
];

export const REPORT_STATUS_OPTIONS = [
  'All',
  'Submitted',
  'Reviewed',
  'Pending Review',
  'Draft',
];

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB strictly
export const ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// Curated high-res construction site photographs for interactive previews
export const SAMPLE_SITE_PHOTOGRAPHS = [
  {
    id: 'IMG-001',
    title: 'Column Rebar Reinforcement Level 4',
    format: 'JPG',
    sizeFormatted: '2.1 MB',
    uri: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    description: 'Inspection of 16mm Fe500 rebars prior to formwork closure',
  },
  {
    id: 'IMG-002',
    title: 'Concrete Slump & Quality Batching Test',
    format: 'PNG',
    sizeFormatted: '1.8 MB',
    uri: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    description: 'Slump test measurement achieved 115mm conforming to M25 spec',
  },
  {
    id: 'IMG-003',
    title: 'Tower Crane Hoisting & Safety Perimeter',
    format: 'JPG',
    sizeFormatted: '3.4 MB',
    uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    description: 'East wing structural beam placement with crane rigger guidance',
  },
  {
    id: 'IMG-004',
    title: 'Sub-Basement Retaining Wall Waterproofing',
    format: 'JPEG',
    sizeFormatted: '2.7 MB',
    uri: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    description: 'Bituminous membrane application along foundation shear line',
  },
  {
    id: 'IMG-005',
    title: 'Internal Masonry Partition Brickwork',
    format: 'PNG',
    sizeFormatted: '1.5 MB',
    uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: 'Level 2 retail corridor partition laying using red clay bricks',
  },
];

// Pre-seeded initial sample documents
export const SAMPLE_DOCUMENTS = [
  {
    id: 'DOC-001',
    fileName: 'Structural_Inspection_Signoff_L4.pdf',
    extension: 'pdf',
    sizeBytes: 2450000,
    sizeFormatted: '2.4 MB',
    description: 'Certified engineer structural inspection sign-off',
  },
  {
    id: 'DOC-002',
    fileName: 'Concrete_Compressive_Strength_Report.docx',
    extension: 'docx',
    sizeBytes: 1820000,
    sizeFormatted: '1.8 MB',
    description: '7-day cylinder compressive test lab report',
  },
  {
    id: 'DOC-003',
    fileName: 'Site_Safety_Audit_Checklist.pdf',
    extension: 'pdf',
    sizeBytes: 870000,
    sizeFormatted: '870 KB',
    description: 'OSHA compliance daily walkthrough report',
  },
  {
    id: 'DOC-OVERSIZED',
    fileName: 'Geotech_Telemetry_Lidar_HighRes.pdf',
    extension: 'pdf',
    sizeBytes: 14889760, // 14.2 MB (> 10 MB limit)
    sizeFormatted: '14.2 MB',
    description: 'Raw point cloud telemetry scan (> 10 MB limit)',
  },
];

// Pre-seeded historical site reports
export const INITIAL_REPORTS = [
  {
    id: 'REP-2026-1107-042',
    siteName: 'Skyline Commercial Tower',
    siteLocation: 'East Sector - Level 4 Core Slab',
    reportDate: '2026-11-07',
    submittedBy: 'Marcus Vance (Lead Structural Specialist)',
    workShift: 'Day Shift (08:00 AM – 05:00 PM)',
    tasks: [
      {
        id: 'TSK-1',
        title: 'Level 4 beam grid C4 reinforcement tying',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-2',
        title: 'Slump test & slump cone calibration for M25 batch',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-3',
        title: 'Formwork shuttering oiling along North shear wall',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-4',
        title: 'Core electrical conduit sleeve embeds',
        status: 'IN_PROGRESS',
        progress: 60,
      },
      {
        id: 'TSK-5',
        title: 'Final concrete pump prime and pour inspection',
        status: 'PENDING',
        progress: 0,
      },
    ],
    taskSummary: {
      total: 5,
      completed: 3,
      inProgress: 1,
      pending: 1,
    },
    completionPercentage: 80,
    challenges: 'Tower crane maintenance delayed steel bundle hoisting by 45 minutes during morning setup.',
    remarks: 'Concrete supplier confirmed 3 mixer trucks scheduled for 08:30 AM tomorrow.',
    images: [SAMPLE_SITE_PHOTOGRAPHS[0], SAMPLE_SITE_PHOTOGRAPHS[1], SAMPLE_SITE_PHOTOGRAPHS[2]],
    documents: [SAMPLE_DOCUMENTS[0], SAMPLE_DOCUMENTS[1]],
    status: 'Submitted',
    isDraft: false,
    createdAt: '2026-11-07T16:30:00.000Z',
  },
  {
    id: 'REP-2026-1106-031',
    siteName: 'Apex Metro Hub Phase 2',
    siteLocation: 'North Transit Concourse - Subgrade Footings',
    reportDate: '2026-11-06',
    submittedBy: 'Elena Rostova (Site Superintendent)',
    workShift: 'Day Shift (08:00 AM – 05:00 PM)',
    tasks: [
      {
        id: 'TSK-10',
        title: 'Deep foundation pile cap excavation & dewatering',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-11',
        title: 'Mud mat lean concrete blinding pour',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-12',
        title: 'Placement of drainage sump pumps along sub-station line',
        status: 'IN_PROGRESS',
        progress: 50,
      },
    ],
    taskSummary: {
      total: 3,
      completed: 2,
      inProgress: 1,
      pending: 0,
    },
    completionPercentage: 83,
    challenges: 'High groundwater infiltration required continuous dual auxiliary sump pumping.',
    remarks: 'Municipal dewatering permits inspected and verified on-site.',
    images: [SAMPLE_SITE_PHOTOGRAPHS[3]],
    documents: [SAMPLE_DOCUMENTS[2]],
    status: 'Reviewed',
    isDraft: false,
    createdAt: '2026-11-06T17:15:00.000Z',
  },
  {
    id: 'REP-2026-1105-018',
    siteName: 'Harbor View Residences',
    siteLocation: 'Tower B Podium Deck & Pool Excavation',
    reportDate: '2026-11-05',
    submittedBy: 'Samir Patel (Civil QA Inspector)',
    workShift: 'Day Shift (08:00 AM – 05:00 PM)',
    tasks: [
      {
        id: 'TSK-20',
        title: 'Podium waterproofing primer application (300 sq.m)',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-21',
        title: 'Thermal insulation board placement & anchor pin testing',
        status: 'COMPLETED',
        progress: 100,
      },
    ],
    taskSummary: {
      total: 2,
      completed: 2,
      inProgress: 0,
      pending: 0,
    },
    completionPercentage: 100,
    challenges: 'None. Optimal weather conditions and dry surface moisture readings recorded.',
    remarks: '24-hour flood ponding test commenced at 16:00.',
    images: [SAMPLE_SITE_PHOTOGRAPHS[3], SAMPLE_SITE_PHOTOGRAPHS[4]],
    documents: [SAMPLE_DOCUMENTS[0]],
    status: 'Reviewed',
    isDraft: false,
    createdAt: '2026-11-05T16:45:00.000Z',
  },
  {
    id: 'REP-2026-1104-009',
    siteName: 'Industrial Logistics Park',
    siteLocation: 'Warehouse Zone B - Heavy Duty Slab Grade Pour',
    reportDate: '2026-11-04',
    submittedBy: 'David Kim (Site Safety Lead)',
    workShift: 'Day Shift (08:00 AM – 05:00 PM)',
    tasks: [
      {
        id: 'TSK-30',
        title: 'Laser screed leveling machine calibration',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-31',
        title: 'Polypropylene fiber dispersion in mixer truck',
        status: 'COMPLETED',
        progress: 100,
      },
      {
        id: 'TSK-32',
        title: 'Floor saw cut contraction joint layout',
        status: 'IN_PROGRESS',
        progress: 40,
      },
      {
        id: 'TSK-33',
        title: 'Curing compound acrylic sealant spray',
        status: 'PENDING',
        progress: 0,
      },
    ],
    taskSummary: {
      total: 4,
      completed: 2,
      inProgress: 1,
      pending: 1,
    },
    completionPercentage: 60,
    challenges: 'Surface wind velocity required rapid tarp shielding to avoid premature plastic shrinkage cracks.',
    remarks: 'Compressive test cubes prepared and placed in site curing tank at 14:30.',
    images: [SAMPLE_SITE_PHOTOGRAPHS[1]],
    documents: [SAMPLE_DOCUMENTS[1]],
    status: 'Pending Review',
    isDraft: false,
    createdAt: '2026-11-04T17:00:00.000Z',
  },
  {
    id: 'DRAFT-2026-1108-005',
    siteName: 'Skyline Commercial Tower',
    siteLocation: 'North Elevator Core Shear Wall - Level 5 Rebar Cage',
    reportDate: '2026-11-08',
    submittedBy: 'Marcus Vance (Lead Structural Specialist)',
    workShift: 'Day Shift (08:00 AM – 05:00 PM)',
    tasks: [
      {
        id: 'TSK-D1',
        title: 'Level 5 shear wall vertical starter rebar layout inspection',
        status: 'IN_PROGRESS',
        progress: 50,
      },
      {
        id: 'TSK-D2',
        title: 'Coupler torque verification on 25mm high-yield bars',
        status: 'PENDING',
        progress: 0,
      },
    ],
    taskSummary: {
      total: 2,
      completed: 0,
      inProgress: 1,
      pending: 1,
    },
    completionPercentage: 25,
    challenges: 'Awaiting structural consulting engineer approval on rebar bundle tolerance deviation.',
    remarks: 'Field draft created on site tablet. Verification in progress prior to official submission.',
    images: [SAMPLE_SITE_PHOTOGRAPHS[0]],
    documents: [SAMPLE_DOCUMENTS[2]],
    status: 'Draft',
    isDraft: true,
    createdAt: '2026-11-08T09:30:00.000Z',
  },
];

/**
 * Format bytes to readable string (e.g. 2.4 MB or 850 KB)
 */
export function formatBytes(bytes) {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Validate document attachment:
 * - Checks file extension against accepted list (PDF, DOC, DOCX, TXT, RTF)
 * - Checks file size strictly < 10 MB
 */
export function validateDocumentFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  const fileName = file.fileName || file.name || 'document.pdf';
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported file format (.${extension}). Only PDF, DOC, DOCX, TXT, and RTF documents are accepted.`,
    };
  }

  const sizeBytes = file.sizeBytes ?? file.size ?? 0;
  if (sizeBytes >= MAX_DOCUMENT_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 10 MB limit. Selected file "${fileName}" is ${formatBytes(sizeBytes)}.`,
    };
  }

  return {
    isValid: true,
    error: null,
    validatedFile: {
      id: file.id || `DOC-${Date.now().toString().slice(-4)}`,
      fileName,
      extension,
      sizeBytes,
      sizeFormatted: formatBytes(sizeBytes),
      description: file.description || '',
    },
  };
}

/**
 * Validate image attachment:
 * - Checks image extension (JPG, JPEG, PNG, WEBP)
 */
export function validateImageFile(image) {
  if (!image) {
    return { isValid: false, error: 'No image provided.' };
  }

  const title = image.title || image.fileName || 'site_photo.jpg';
  const extension = (image.format || title.split('.').pop())?.toLowerCase() || 'jpg';

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported image format (.${extension}). Only JPG, JPEG, and PNG images are accepted.`,
    };
  }

  return {
    isValid: true,
    error: null,
    validatedImage: {
      id: image.id || `IMG-${Date.now().toString().slice(-4)}`,
      title,
      format: extension.toUpperCase(),
      sizeFormatted: image.sizeFormatted || '1.8 MB',
      uri: image.uri || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
      description: image.description || '',
    },
  };
}

class ReportService {
  constructor() {
    this.reports = INITIAL_REPORTS.map((r) => ({ ...r }));
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.reports);
      } catch (err) {
        console.error('Report subscriber error:', err);
      }
    }
  }

  // Get reports with optional search, project, date, and status filters and sorting
  getReports(filters = {}) {
    const {
      search = '',
      project = 'All',
      date = 'All',
      status = 'All',
      sortBy = 'NEWEST', // 'NEWEST' | 'OLDEST'
    } = filters;
    const searchLower = search.trim().toLowerCase();

    const filtered = this.reports.filter((rep) => {
      // Project filter
      if (project !== 'All' && rep.siteName !== project) {
        return false;
      }

      // Date filter
      if (date !== 'All' && rep.reportDate !== date) {
        return false;
      }

      // Status filter
      if (status !== 'All') {
        const repStatus = (rep.status || '').toLowerCase();
        const targetStatus = status.toLowerCase();
        if (targetStatus === 'pending review') {
          if (!repStatus.includes('pending')) return false;
        } else if (targetStatus === 'reviewed') {
          if (!repStatus.includes('reviewed') && !repStatus.includes('approved')) return false;
        } else if (targetStatus === 'submitted') {
          if (repStatus !== 'submitted') return false;
        } else if (targetStatus === 'draft') {
          if (repStatus !== 'draft' && !rep.isDraft) return false;
        } else if (repStatus !== targetStatus) {
          return false;
        }
      }

      // Search query (siteName, id, location, submittedBy)
      if (searchLower) {
        const matchesId = rep.id.toLowerCase().includes(searchLower);
        const matchesSite = rep.siteName.toLowerCase().includes(searchLower);
        const matchesLoc = (rep.siteLocation || '').toLowerCase().includes(searchLower);
        const matchesAuthor = (rep.submittedBy || '').toLowerCase().includes(searchLower);
        if (!matchesId && !matchesSite && !matchesLoc && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });

    // Sort by Newest or Oldest
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.reportDate).getTime();
      const dateB = new Date(b.createdAt || b.reportDate).getTime();
      return sortBy === 'OLDEST' ? dateA - dateB : dateB - dateA;
    });
  }

  // Get report by ID
  getReportById(reportId) {
    return this.reports.find((r) => r.id === reportId) || null;
  }

  /**
   * Submit Site Report:
   * Validates required site details and tasks.
   * Calculates overall task summary and completion percentage.
   * Generates unique report ID.
   * Stores report in session state.
   */
  async submitReport({
    siteName,
    siteLocation,
    reportDate,
    submittedBy,
    workShift,
    tasks = [],
    challenges = '',
    remarks = '',
    images = [],
    documents = [],
  }) {
    // 1. Validation
    if (!siteName || !siteName.trim()) {
      throw new Error('Please select a project/site name.');
    }

    if (!siteLocation || siteLocation.trim().length < 3) {
      throw new Error('Please enter a specific site location (e.g. Level 4 East Wing).');
    }

    if (!tasks || tasks.length === 0) {
      throw new Error('Please add at least one work progress task entry.');
    }

    const emptyTask = tasks.find((t) => !t.title || !t.title.trim());
    if (emptyTask) {
      throw new Error('All task entries must have a descriptive title.');
    }

    // 2. Compute Task Summary & Completion %
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;

    // Calculate percentage: Completed is 100%, In Progress is 50%, Pending is 0%
    const totalProgressPoints = tasks.reduce((acc, t) => {
      if (t.status === 'COMPLETED') return acc + 100;
      if (t.status === 'IN_PROGRESS') return acc + (t.progress || 50);
      return acc;
    }, 0);

    const overallPercentage = Math.round(totalProgressPoints / totalTasks);

    // 3. Generate Unique Report ID
    const today = new Date();
    const dateSlug = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const uniqueReportId = `REP-${dateSlug}-${randomSuffix}`;

    const newReport = {
      id: uniqueReportId,
      siteName: siteName.trim(),
      siteLocation: siteLocation.trim(),
      reportDate: reportDate || today.toISOString().split('T')[0],
      submittedBy: submittedBy || 'Marcus Vance (Lead Structural Specialist)',
      workShift: workShift || WORK_SHIFTS[0],
      tasks: tasks.map((t, idx) => ({
        id: t.id || `TSK-${Date.now()}-${idx}`,
        title: t.title.trim(),
        status: t.status || 'COMPLETED',
        progress: t.status === 'COMPLETED' ? 100 : t.status === 'IN_PROGRESS' ? (t.progress || 50) : 0,
      })),
      taskSummary: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
      },
      completionPercentage: overallPercentage,
      challenges: (challenges || '').trim() || 'No operational impediments encountered.',
      remarks: (remarks || '').trim() || 'Site work executed in conformance with structural specifications.',
      images: [...images],
      documents: [...documents],
      status: 'Submitted',
      isDraft: false,
      createdAt: new Date().toISOString(),
    };

    this.reports.unshift(newReport);
    this.notify();
    return newReport;
  }

  /**
   * Save draft report for later completion
   */
  async saveDraft({
    siteName,
    siteLocation,
    reportDate,
    submittedBy,
    workShift,
    tasks = [],
    challenges = '',
    remarks = '',
    images = [],
    documents = [],
  }) {
    const today = new Date();
    const dateSlug = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const draftId = `DRAFT-${dateSlug}-${randomSuffix}`;

    const totalTasks = tasks.length || 0;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;

    const totalProgressPoints = tasks.reduce((acc, t) => {
      if (t.status === 'COMPLETED') return acc + 100;
      if (t.status === 'IN_PROGRESS') return acc + (t.progress || 50);
      return acc;
    }, 0);
    const overallPercentage = totalTasks > 0 ? Math.round(totalProgressPoints / totalTasks) : 0;

    const newDraft = {
      id: draftId,
      siteName: (siteName || CONSTRUCTION_PROJECTS[0]).trim(),
      siteLocation: (siteLocation || 'Unassigned Field Sector').trim(),
      reportDate: reportDate || today.toISOString().split('T')[0],
      submittedBy: submittedBy || 'Marcus Vance (Lead Structural Specialist)',
      workShift: workShift || WORK_SHIFTS[0],
      tasks: (tasks || []).map((t, idx) => ({
        id: t.id || `TSK-${Date.now()}-${idx}`,
        title: (t.title || 'Draft task').trim(),
        status: t.status || 'IN_PROGRESS',
        progress: t.status === 'COMPLETED' ? 100 : t.status === 'IN_PROGRESS' ? (t.progress || 50) : 0,
      })),
      taskSummary: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
      },
      completionPercentage: overallPercentage,
      challenges: (challenges || '').trim() || 'Draft notes: verification in progress.',
      remarks: (remarks || '').trim() || 'Work in progress draft.',
      images: [...images],
      documents: [...documents],
      status: 'Draft',
      isDraft: true,
      createdAt: new Date().toISOString(),
    };

    this.reports.unshift(newDraft);
    this.notify();
    return newDraft;
  }

  /**
   * Update an existing report (permitted only for draft reports)
   */
  async updateReport(reportId, updatedData) {
    const index = this.reports.findIndex((r) => r.id === reportId);
    if (index === -1) {
      throw new Error(`Report ${reportId} not found.`);
    }

    const current = this.reports[index];
    if (!current.isDraft && current.status !== 'Draft') {
      throw new Error('Only draft reports can be modified. Official submitted reports are read-only.');
    }

    const tasks = updatedData.tasks || current.tasks || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;

    const totalProgressPoints = tasks.reduce((acc, t) => {
      if (t.status === 'COMPLETED') return acc + 100;
      if (t.status === 'IN_PROGRESS') return acc + (t.progress || 50);
      return acc;
    }, 0);
    const overallPercentage = totalTasks > 0 ? Math.round(totalProgressPoints / totalTasks) : 0;

    let finalId = current.id;
    let finalStatus = updatedData.status || current.status;
    let isDraft = current.isDraft;

    // Converting draft to official submission
    if (updatedData.submitAsOfficial) {
      const today = new Date();
      const dateSlug = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      finalId = `REP-${dateSlug}-${randomSuffix}`;
      finalStatus = 'Submitted';
      isDraft = false;
    }

    const updated = {
      ...current,
      ...updatedData,
      id: finalId,
      status: finalStatus,
      isDraft,
      tasks: tasks.map((t, idx) => ({
        id: t.id || `TSK-${Date.now()}-${idx}`,
        title: (t.title || '').trim(),
        status: t.status || 'COMPLETED',
        progress: t.status === 'COMPLETED' ? 100 : t.status === 'IN_PROGRESS' ? (t.progress || 50) : 0,
      })),
      taskSummary: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
      },
      completionPercentage: overallPercentage,
      updatedAt: new Date().toISOString(),
    };

    this.reports[index] = updated;
    this.notify();
    return updated;
  }

  /**
   * Delete an eligible draft report
   */
  deleteReport(reportId) {
    const index = this.reports.findIndex((r) => r.id === reportId);
    if (index === -1) {
      throw new Error(`Report ${reportId} not found.`);
    }

    const report = this.reports[index];
    if (!report.isDraft && report.status !== 'Draft') {
      throw new Error('Only draft reports can be deleted. Official submitted reports are archived permanently.');
    }

    this.reports.splice(index, 1);
    this.notify();
    return { success: true };
  }

  getProjects() {
    return CONSTRUCTION_PROJECTS;
  }

  getWorkShifts() {
    return WORK_SHIFTS;
  }

  getSamplePhotos() {
    return SAMPLE_SITE_PHOTOGRAPHS;
  }

  getSampleDocuments() {
    return SAMPLE_DOCUMENTS;
  }
}

export const reportService = new ReportService();
