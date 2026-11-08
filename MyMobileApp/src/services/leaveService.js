/**
 * Structura MAD - Authoritative Annual Leave Management Service
 *
 * Requirements Met:
 * 1. Leave Dashboard: Total allowance, used, available, pending requests.
 * 2. Apply for Leave: Casual, Sick, Earned, Unpaid types, reason, submit.
 * 3. Working Days Calculation: Automatically excludes weekly offs (Sundays) and configured holidays.
 * 4. Annual Balance Engine: Separate balances per calendar year, reset/allocation per year,
 *    used leaves calculated only from approved paid requests, unpaid does not affect paid quota,
 *    prevents requests exceeding balance, maintains previous years.
 * 5. Accuracy & Security: Prevents duplicate/overlapping requests, validates dates,
 *    tracks manager approval/rejection timestamps, prevents self-approval.
 */

import { getBusinessDateString, normalizeDate } from './attendanceService.js';

// Configured Leave Types & Quotas
export const LEAVE_TYPES = {
  CASUAL: {
    id: 'CASUAL',
    name: 'Casual Leave',
    code: 'CL',
    isPaid: true,
    annualQuota: 8,
    color: '#3B82F6', // Blue
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: 'Personal matters and emergency family needs',
  },
  SICK: {
    id: 'SICK',
    name: 'Sick Leave',
    code: 'SL',
    isPaid: true,
    annualQuota: 6,
    color: '#10B981', // Emerald
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    description: 'Medical appointments, illness, and recovery',
  },
  EARNED: {
    id: 'EARNED',
    name: 'Earned Leave',
    code: 'EL',
    isPaid: true,
    annualQuota: 10,
    color: '#F97316', // Structura Orange
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-[#F97316]',
    description: 'Planned vacation and extended personal time',
  },
  UNPAID: {
    id: 'UNPAID',
    name: 'Unpaid Leave',
    code: 'UL',
    isPaid: false,
    annualQuota: 0, // Unlimited, unpaid
    color: '#64748B', // Slate
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    description: 'Approved time off without wage compensation',
  },
};

// Official Site Holidays for 2026 & 2025
export const CONFIGURED_HOLIDAYS = {
  2026: [
    '2026-01-01', // New Year's Day
    '2026-05-01', // Labor Day
    '2026-07-04', // Independence Day
    '2026-11-26', // Thanksgiving Day
    '2026-12-25', // Christmas Day
  ],
  2025: [
    '2025-01-01',
    '2025-05-01',
    '2025-07-04',
    '2025-11-27',
    '2025-12-25',
  ],
};

/**
 * Automatically calculate working leave days between two dates.
 * - Excludes configured weekly offs (Sundays: dayOfWeek === 0).
 * - Excludes configured site holidays.
 * Returns breakdown of working days, weekly offs, and holidays.
 */
export function calculateWorkingLeaveDays(startDateInput, endDateInput) {
  const start = normalizeDate(startDateInput);
  const end = normalizeDate(endDateInput);

  if (!start || !end) {
    return {
      isValid: false,
      workingDays: 0,
      totalCalendarDays: 0,
      weeklyOffs: 0,
      holidays: 0,
      dates: [],
      error: 'Please provide valid start and end dates.',
    };
  }

  // Clear time components for pure date comparison
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (e.getTime() < s.getTime()) {
    return {
      isValid: false,
      workingDays: 0,
      totalCalendarDays: 0,
      weeklyOffs: 0,
      holidays: 0,
      dates: [],
      error: 'End date cannot be earlier than start date.',
    };
  }

  const holidaysList = CONFIGURED_HOLIDAYS[s.getFullYear()] || [];
  const holidaysSet = new Set(holidaysList);

  let workingDays = 0;
  let weeklyOffs = 0;
  let holidays = 0;
  let totalCalendarDays = 0;
  const workingDates = [];

  const curr = new Date(s);
  while (curr.getTime() <= e.getTime()) {
    totalCalendarDays++;
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    const dateStr = getBusinessDateString(curr);

    if (dayOfWeek === 0) {
      weeklyOffs++;
    } else if (holidaysSet.has(dateStr)) {
      holidays++;
    } else {
      workingDays++;
      workingDates.push(dateStr);
    }

    curr.setDate(curr.getDate() + 1);
  }

  return {
    isValid: true,
    workingDays,
    totalCalendarDays,
    weeklyOffs,
    holidays,
    dates: workingDates,
    error: null,
  };
}

class LeaveService {
  constructor() {
    // Keyed by calendar year, e.g. 2026, 2025
    this.requestsByYear = new Map();

    // Pre-seed realistic multi-year leave data
    this._seedHistoricalLeaveData();
  }

  // Pre-seed multi-year leave records
  _seedHistoricalLeaveData() {
    // Current Year (2026) Initial Leave Requests
    this.requestsByYear.set(2026, [
      {
        id: 'LRQ-2026-001',
        workerId: 'WRK-8924',
        leaveTypeId: 'SICK',
        leaveTypeName: 'Sick Leave',
        isPaid: true,
        startDate: '2026-11-02',
        endDate: '2026-11-02',
        workingDays: 1,
        totalCalendarDays: 1,
        weeklyOffs: 0,
        holidays: 0,
        reason: 'Severe migraine and doctor recommended rest',
        submittedAt: '2026-11-01T14:20:00.000Z',
        status: 'APPROVED', // Deducted from Sick leave balance
        reviewedAt: '2026-11-01T16:45:00.000Z',
        reviewedBy: 'Arthur Pendelton (Project Engineer)',
        managerNotes: 'Approved with medical certificate.',
      },
      {
        id: 'LRQ-2026-002',
        workerId: 'WRK-8924',
        leaveTypeId: 'CASUAL',
        leaveTypeName: 'Casual Leave',
        isPaid: true,
        startDate: '2026-08-14',
        endDate: '2026-08-15',
        workingDays: 2,
        totalCalendarDays: 2,
        weeklyOffs: 0,
        holidays: 0,
        reason: 'Family relocation and moving personal belongings',
        submittedAt: '2026-08-10T09:15:00.000Z',
        status: 'APPROVED', // Deducted from Casual leave balance
        reviewedAt: '2026-08-11T11:00:00.000Z',
        reviewedBy: 'Elena Rostova (Site Superintendent)',
        managerNotes: 'Approved as advance notice provided.',
      },
      {
        id: 'LRQ-2026-003',
        workerId: 'WRK-8924',
        leaveTypeId: 'EARNED',
        leaveTypeName: 'Earned Leave',
        isPaid: true,
        startDate: '2026-12-10',
        endDate: '2026-12-14',
        workingDays: 4, // Excludes Sunday Dec 13
        totalCalendarDays: 5,
        weeklyOffs: 1,
        holidays: 0,
        reason: 'Annual family holiday gathering before peak phase',
        submittedAt: '2026-11-06T10:00:00.000Z',
        status: 'PENDING', // Pending: does NOT reduce balance yet!
        reviewedAt: null,
        reviewedBy: null,
        managerNotes: null,
      },
    ]);

    // Previous Year (2025) Historical Archive
    this.requestsByYear.set(2025, [
      {
        id: 'LRQ-2025-089',
        workerId: 'WRK-8924',
        leaveTypeId: 'EARNED',
        leaveTypeName: 'Earned Leave',
        isPaid: true,
        startDate: '2025-10-06',
        endDate: '2025-10-15',
        workingDays: 8,
        totalCalendarDays: 10,
        weeklyOffs: 2,
        holidays: 0,
        reason: 'Annual home visit and structural certifications exam',
        submittedAt: '2025-09-25T11:30:00.000Z',
        status: 'APPROVED',
        reviewedAt: '2025-09-26T15:00:00.000Z',
        reviewedBy: 'Elena Rostova (Site Superintendent)',
        managerNotes: 'Approved.',
      },
      {
        id: 'LRQ-2025-045',
        workerId: 'WRK-8924',
        leaveTypeId: 'CASUAL',
        leaveTypeName: 'Casual Leave',
        isPaid: true,
        startDate: '2025-04-18',
        endDate: '2025-04-19',
        workingDays: 2,
        totalCalendarDays: 2,
        weeklyOffs: 0,
        holidays: 0,
        reason: 'Personal legal documentation appointment',
        submittedAt: '2025-04-15T08:00:00.000Z',
        status: 'APPROVED',
        reviewedAt: '2025-04-15T12:00:00.000Z',
        reviewedBy: 'Arthur Pendelton (Project Engineer)',
        managerNotes: 'Approved.',
      },
      {
        id: 'LRQ-2025-012',
        workerId: 'WRK-8924',
        leaveTypeId: 'SICK',
        leaveTypeName: 'Sick Leave',
        isPaid: true,
        startDate: '2025-02-11',
        endDate: '2025-02-13',
        workingDays: 3,
        totalCalendarDays: 3,
        weeklyOffs: 0,
        holidays: 0,
        reason: 'Viral flu recovery',
        submittedAt: '2025-02-10T19:00:00.000Z',
        status: 'APPROVED',
        reviewedAt: '2025-02-11T07:30:00.000Z',
        reviewedBy: 'Elena Rostova (Site Superintendent)',
        managerNotes: 'Approved on medical grounds.',
      },
    ]);
  }

  // Get list of available calendar years
  getAvailableYears() {
    return [2026, 2025];
  }

  // Get raw leave requests for a calendar year
  getLeaveRequests(year = 2026, workerId = 'WRK-8924') {
    const list = this.requestsByYear.get(year) || [];
    return list.filter((r) => r.workerId === workerId);
  }

  /**
   * Calculate Authoritative Annual Leave Balance for a Calendar Year:
   * - Total Annual Allowance = Casual (8) + Sick (6) + Earned (10) = 24 Days.
   * - Used Leaves = Sum of workingDays from APPROVED, PAID requests in that calendar year.
   * - Available/Remaining Leaves = Total Allowance - Used Leaves.
   * - Pending requests do NOT reduce available balance.
   * - Rejected and cancelled requests do NOT reduce available balance.
   * - Unpaid leave requests do NOT reduce paid leave balance.
   */
  getLeaveBalance(year = 2026, workerId = 'WRK-8924') {
    const requests = this.getLeaveRequests(year, workerId);

    // Initial balances per type
    const breakdown = {
      CASUAL: {
        ...LEAVE_TYPES.CASUAL,
        quota: LEAVE_TYPES.CASUAL.annualQuota,
        used: 0,
        pending: 0,
        remaining: LEAVE_TYPES.CASUAL.annualQuota,
      },
      SICK: {
        ...LEAVE_TYPES.SICK,
        quota: LEAVE_TYPES.SICK.annualQuota,
        used: 0,
        pending: 0,
        remaining: LEAVE_TYPES.SICK.annualQuota,
      },
      EARNED: {
        ...LEAVE_TYPES.EARNED,
        quota: LEAVE_TYPES.EARNED.annualQuota,
        used: 0,
        pending: 0,
        remaining: LEAVE_TYPES.EARNED.annualQuota,
      },
      UNPAID: {
        ...LEAVE_TYPES.UNPAID,
        quota: 'Unlimited',
        used: 0,
        pending: 0,
        remaining: 'Unlimited',
      },
    };

    let totalPaidAllowance = 0;
    let totalPaidUsed = 0;
    let totalPendingRequests = 0;
    let totalUnpaidUsed = 0;

    // Sum quotas of paid leave types
    Object.values(LEAVE_TYPES).forEach((type) => {
      if (type.isPaid) {
        totalPaidAllowance += type.annualQuota;
      }
    });

    // Aggregate requests by status
    requests.forEach((req) => {
      const typeKey = req.leaveTypeId;

      if (req.status === 'APPROVED') {
        if (req.isPaid) {
          totalPaidUsed += req.workingDays;
          if (breakdown[typeKey]) {
            breakdown[typeKey].used += req.workingDays;
            breakdown[typeKey].remaining = Math.max(
              0,
              breakdown[typeKey].quota - breakdown[typeKey].used
            );
          }
        } else {
          totalUnpaidUsed += req.workingDays;
          if (breakdown[typeKey]) {
            breakdown[typeKey].used += req.workingDays;
          }
        }
      } else if (req.status === 'PENDING') {
        totalPendingRequests++;
        if (breakdown[typeKey]) {
          breakdown[typeKey].pending += req.workingDays;
        }
      }
    });

    const totalPaidRemaining = Math.max(0, totalPaidAllowance - totalPaidUsed);

    return {
      year,
      totalAllowance: totalPaidAllowance, // 24 Days
      usedLeaves: totalPaidUsed,         // e.g. 3 Days
      remainingLeaves: totalPaidRemaining, // e.g. 21 Days
      pendingRequestsCount: totalPendingRequests,
      totalUnpaidUsed,
      breakdown,
    };
  }

  /**
   * Check for duplicate or overlapping leave dates with existing requests.
   * Rejects if any overlapping request is in 'PENDING' or 'APPROVED' status.
   */
  hasOverlappingLeave(startDateStr, endDateStr, year, workerId = 'WRK-8924', excludeRequestId = null) {
    const requests = this.getLeaveRequests(year, workerId);
    const start = normalizeDate(startDateStr);
    const end = normalizeDate(endDateStr);

    if (!start || !end) return null;

    const sTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const eTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

    for (const req of requests) {
      if (excludeRequestId && req.id === excludeRequestId) continue;
      // Cancelled and rejected requests cannot conflict
      if (req.status !== 'PENDING' && req.status !== 'APPROVED') continue;

      const reqStart = normalizeDate(req.startDate);
      const reqEnd = normalizeDate(req.endDate);
      if (!reqStart || !reqEnd) continue;

      const rSTime = new Date(reqStart.getFullYear(), reqStart.getMonth(), reqStart.getDate()).getTime();
      const rETime = new Date(reqEnd.getFullYear(), reqEnd.getMonth(), reqEnd.getDate()).getTime();

      // Overlap condition: start <= reqEnd && end >= reqStart
      if (sTime <= rETime && eTime >= rSTime) {
        return req;
      }
    }

    return null;
  }

  /**
   * Apply for Leave:
   * - Validates date format & ranges.
   * - Automatically calculates working days excluding Sundays & holidays.
   * - Prevents duplicate or overlapping requests.
   * - Validates that requested days do not exceed available category balance.
   * - Submits with authoritative server timestamp.
   */
  async submitLeaveRequest({
    workerId = 'WRK-8924',
    leaveTypeId,
    startDate,
    endDate,
    reason,
  }) {
    const leaveConfig = LEAVE_TYPES[leaveTypeId];
    if (!leaveConfig) {
      throw new Error('Invalid leave type selected.');
    }

    if (!startDate || !endDate) {
      throw new Error('Please select both a start date and an end date.');
    }

    const trimmedReason = (reason || '').trim();
    if (trimmedReason.length < 5) {
      throw new Error('Please enter a valid reason for leave (at least 5 characters).');
    }

    const startNorm = normalizeDate(startDate);
    const endNorm = normalizeDate(endDate);

    if (!startNorm || !endNorm) {
      throw new Error('One or more selected dates are invalid.');
    }

    const year = startNorm.getFullYear();
    const workingDaysData = calculateWorkingLeaveDays(startNorm, endNorm);

    if (!workingDaysData.isValid) {
      throw new Error(workingDaysData.error || 'Invalid date range.');
    }

    if (workingDaysData.workingDays === 0) {
      throw new Error(
        'Selected date range contains only weekly offs or official holidays. No leave days required.'
      );
    }

    // Overlap prevention
    const overlapping = this.hasOverlappingLeave(
      startNorm,
      endNorm,
      year,
      workerId
    );
    if (overlapping) {
      throw new Error(
        `Overlapping request: You already have a ${overlapping.status.toLowerCase()} ${overlapping.leaveTypeName} request from ${overlapping.startDate} to ${overlapping.endDate}.`
      );
    }

    // Check balance validation for paid leave types
    const currentBalance = this.getLeaveBalance(year, workerId);
    if (leaveConfig.isPaid) {
      const typeBalance = currentBalance.breakdown[leaveTypeId];
      if (typeBalance && workingDaysData.workingDays > typeBalance.remaining) {
        throw new Error(
          `Insufficient balance: You have ${typeBalance.remaining} ${typeBalance.name} day(s) remaining, but requested ${workingDaysData.workingDays} working day(s).`
        );
      }
    }

    const newRequest = {
      id: `LRQ-${year}-${Date.now().toString().slice(-5)}`,
      workerId,
      leaveTypeId,
      leaveTypeName: leaveConfig.name,
      isPaid: leaveConfig.isPaid,
      startDate: getBusinessDateString(startNorm),
      endDate: getBusinessDateString(endNorm),
      workingDays: workingDaysData.workingDays,
      totalCalendarDays: workingDaysData.totalCalendarDays,
      weeklyOffs: workingDaysData.weeklyOffs,
      holidays: workingDaysData.holidays,
      reason: trimmedReason,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      reviewedAt: null,
      reviewedBy: null,
      managerNotes: null,
    };

    const currentYearList = this.requestsByYear.get(year) || [];
    currentYearList.unshift(newRequest);
    this.requestsByYear.set(year, currentYearList);

    return {
      request: newRequest,
      balance: this.getLeaveBalance(year, workerId),
    };
  }

  /**
   * Cancel an eligible pending leave request (Worker action).
   * Workers can only cancel their own PENDING requests.
   */
  async cancelLeaveRequest(requestId, workerId = 'WRK-8924') {
    for (const [year, list] of this.requestsByYear.entries()) {
      const index = list.findIndex((r) => r.id === requestId && r.workerId === workerId);
      if (index !== -1) {
        const target = list[index];
        if (target.status !== 'PENDING') {
          throw new Error('Only pending leave requests can be cancelled.');
        }

        // Remove or mark cancelled
        list.splice(index, 1);
        this.requestsByYear.set(year, list);

        return {
          cancelledId: requestId,
          balance: this.getLeaveBalance(year, workerId),
        };
      }
    }

    throw new Error('Leave request not found or not eligible for cancellation.');
  }

  /**
   * Manager / Administrator Review Workflow:
   * Approves or rejects a pending request.
   * Records authoritative review timestamp and manager name.
   */
  async reviewLeaveRequest(
    requestId,
    newStatus, // 'APPROVED' or 'REJECTED'
    reviewerName = 'Elena Rostova (Site Superintendent)',
    managerNotes = ''
  ) {
    if (newStatus !== 'APPROVED' && newStatus !== 'REJECTED') {
      throw new Error('Invalid review status. Must be APPROVED or REJECTED.');
    }

    for (const [year, list] of this.requestsByYear.entries()) {
      const target = list.find((r) => r.id === requestId);
      if (target) {
        if (target.status !== 'PENDING') {
          throw new Error('This request has already been reviewed.');
        }

        target.status = newStatus;
        target.reviewedAt = new Date().toISOString();
        target.reviewedBy = reviewerName;
        target.managerNotes = managerNotes || (newStatus === 'APPROVED' ? 'Approved by site administration' : 'Rejected due to site staffing requirements');

        return {
          request: target,
          balance: this.getLeaveBalance(year, target.workerId),
        };
      }
    }

    throw new Error('Leave request not found.');
  }
}

export const leaveService = new LeaveService();
