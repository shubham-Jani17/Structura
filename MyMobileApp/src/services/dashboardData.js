/**
 * Structura MAD - Construction Management Dashboard Data Service
 * Comprehensive mock data store and state helpers for multi-site operations.
 */

export const INITIAL_USER = {
  id: 'usr_001',
  name: 'Alex Mercer',
  role: 'Lead Project Manager',
  company: 'Apex Build Corp.',
  email: 'alex.mercer@apexbuild.com',
  phone: '+1 (555) 349-8201',
  avatarInitials: 'AM',
  notificationsCount: 3,
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Concrete Pour Approved',
    message: 'Engineering inspection cleared Level 14 concrete pour for Skyline Tower.',
    time: '15m ago',
    unread: true,
    type: 'project',
  },
  {
    id: 'notif_2',
    title: 'Low Stock Alert',
    message: 'Grade 60 Structural Rebar is below threshold (45 units remaining).',
    time: '42m ago',
    unread: true,
    type: 'inventory',
  },
  {
    id: 'notif_3',
    title: 'Safety Briefing Logged',
    message: 'Morning toolbox safety talk logged for East Sector (48 attendees).',
    time: '2h ago',
    unread: true,
    type: 'attendance',
  },
];

export const INITIAL_STATISTICS = {
  totalProjects: 12,
  activeProjects: 8,
  totalWorkers: 142,
  pendingTasks: 19,
};

export const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Skyline Commercial Tower',
    code: 'ST-2026',
    location: 'Downtown Financial District, Sector 4',
    status: 'In Progress',
    progress: 74,
    targetDate: 'Dec 15, 2026',
    startDate: 'Jan 10, 2026',
    budget: '$18.4M',
    leadContractor: 'Apex Build Corp.',
    activePhase: 'Level 18 Curtain Wall Installation',
  },
  {
    id: 'proj_2',
    name: 'Metro Transit Interchange',
    code: 'MT-4091',
    location: 'North Concourse, Terminal Station',
    status: 'Ahead of Schedule',
    progress: 88,
    targetDate: 'Oct 30, 2026',
    startDate: 'Mar 01, 2025',
    budget: '$34.2M',
    leadContractor: 'Structura Infrastructure',
    activePhase: 'Track Electrification & Signaling',
  },
  {
    id: 'proj_3',
    name: 'Oakridge Residential Plaza',
    code: 'OR-1088',
    location: 'West Valley Suburb, Block C',
    status: 'On Track',
    progress: 42,
    targetDate: 'May 20, 2027',
    startDate: 'Jul 15, 2026',
    budget: '$12.0M',
    leadContractor: 'Oakridge Ventures',
    activePhase: 'Basement Foundation & Pile Driving',
  },
];

export const INITIAL_ATTENDANCE = {
  present: 118,
  absent: 14,
  onLeave: 10,
  total: 142,
  shift: 'Day Shift (07:00 AM – 04:00 PM)',
  attendanceRate: '83.1%',
};

export const INITIAL_INVENTORY = {
  totalItems: 1280,
  availableStock: 980,
  lowStock: 12,
  outOfStock: 3,
  categoriesCount: 18,
  lastUpdated: 'Today, 11:30 AM',
};

export const INITIAL_ACTIVITIES = [
  {
    id: 'act_1',
    category: 'Projects',
    title: 'Curtain Wall Milestone Cleared',
    description: 'Level 16 glass facade installation completed and inspected on Skyline Tower.',
    timestamp: '15m ago',
    author: 'Marcus Vance (Site Lead)',
    tag: 'Skyline Tower',
  },
  {
    id: 'act_2',
    category: 'Attendance',
    title: 'Morning Shift Check-in Finalized',
    description: '118 workers verified present across East and West wings.',
    timestamp: '1h ago',
    author: 'Elena Rostova (HR Lead)',
    tag: 'Daily Rollcall',
  },
  {
    id: 'act_3',
    category: 'Inventory',
    title: 'Material Delivery Logged',
    description: '450 bags of Grade 53 Portland Cement checked into Warehouse Yard B.',
    timestamp: '2h ago',
    author: 'David Kim (Storekeeper)',
    tag: 'Yard B Stock',
  },
  {
    id: 'act_4',
    category: 'Reports',
    title: 'Weekly Quality Audit Generated',
    description: 'Structural concrete test reports for Columns C1-C8 exported to PDF.',
    timestamp: '3h ago',
    author: 'Alex Mercer (Lead PM)',
    tag: 'QA Audit',
  },
  {
    id: 'act_5',
    category: 'Projects',
    title: 'Electrical Conduit Routing Started',
    description: 'Subcontractor team began Level 12 wiring layout for Metro Interchange.',
    timestamp: '5h ago',
    author: 'Samir Patel (Electrical Lead)',
    tag: 'Metro Interchange',
  },
];
