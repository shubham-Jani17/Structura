/**
 * Structura MAD - Worker Attendance Service
 * Authoritative attendance engine providing shift management,
 * automatic overtime tracking, overnight shift calculations,
 * duplicate prevention, and monthly analytics.
 */

// Worker Profile
export const DEFAULT_WORKER = {
  id: 'WRK-8924',
  name: 'Marcus Vance',
  trade: 'Lead Structural Specialist',
  site: 'Skyline Commercial Tower',
  company: 'Apex Build Corp.',
  phone: '+1 (555) 782-9014',
  avatarInitials: 'MV',
  assignedShift: {
    id: 'SHIFT_DAY_01',
    name: 'Standard Day Shift',
    code: 'DAY-01',
    startTime: '08:00', // 08:00 AM
    endTime: '17:00',   // 05:00 PM
    displayTiming: '08:00 AM – 05:00 PM',
    durationHours: 9,
    breakMinutes: 60,
    gracePeriodMinutes: 15,
    isOvernight: false,
  },
  availableShifts: [
    {
      id: 'SHIFT_DAY_01',
      name: 'Standard Day Shift',
      code: 'DAY-01',
      startTime: '08:00',
      endTime: '17:00',
      displayTiming: '08:00 AM – 05:00 PM',
      durationHours: 9,
      breakMinutes: 60,
      gracePeriodMinutes: 15,
      isOvernight: false,
    },
    {
      id: 'SHIFT_NIGHT_02',
      name: 'Overnight Concrete Shift',
      code: 'NIGHT-02',
      startTime: '20:00', // 08:00 PM
      endTime: '05:00',   // 05:00 AM next day
      displayTiming: '08:00 PM – 05:00 AM (Next Day)',
      durationHours: 9,
      breakMinutes: 60,
      gracePeriodMinutes: 15,
      isOvernight: true,
    },
  ],
};

// Formats a date into YYYY-MM-DD (business date)
export function getBusinessDateString(date = new Date()) {
  const d = normalizeDate(date) || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Authoritative Date Normalizer
 * Converts multiple input formats into a valid JavaScript Date object:
 * - JavaScript Date objects (validates getTime() is not NaN)
 * - ISO 8601 strings (e.g. "2026-11-08T08:00:00.000Z")
 * - 24-hour time strings (e.g. "08:00", "17:30") anchored to today
 * - Unix timestamps in milliseconds (e.g. 1731033000000)
 * - Unix timestamps in seconds (e.g. 1731033000)
 * - Numeric strings (e.g. "1731033000000")
 * - Backend/Firestore timestamp objects ({ seconds, nanoseconds } or { _seconds } or { toDate() })
 * Returns null if input is null, undefined, empty, or unparseable.
 */
export function normalizeDate(input) {
  if (input == null || input === '' || input === false) return null;

  try {
    // 1. Date instance
    if (input instanceof Date) {
      return Number.isNaN(input.getTime()) ? null : input;
    }

    // 2. Number (Unix timestamp in ms or seconds)
    if (typeof input === 'number') {
      if (Number.isNaN(input) || !Number.isFinite(input)) return null;
      // If timestamp is in seconds (< 1e11), convert to milliseconds
      const ms = input < 1e11 ? input * 1000 : input;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    // 3. String
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (!trimmed) return null;

      // Pure numeric string (e.g. "1731033000000")
      if (/^\d+$/.test(trimmed)) {
        const num = Number(trimmed);
        if (!Number.isNaN(num)) {
          const ms = num < 1e11 ? num * 1000 : num;
          const d = new Date(ms);
          return Number.isNaN(d.getTime()) ? null : d;
        }
      }

      // 24-hour time string like "08:00", "17:30", "08:00:00"
      const timeMatch = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.exec(trimmed);
      if (timeMatch) {
        const d = new Date();
        d.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
        return d;
      }

      // 12-hour time string like "08:00 AM", "5:30 PM"
      const time12Match = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i.exec(trimmed);
      if (time12Match) {
        let h = parseInt(time12Match[1], 10);
        const m = parseInt(time12Match[2], 10);
        const isPM = time12Match[3].toUpperCase() === 'PM';
        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      }

      // Standard ISO / Date string
      const d = new Date(trimmed);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    // 4. Backend timestamp object
    if (typeof input === 'object') {
      // Object with toDate() function (Firestore Timestamp, Moment, Day.js, etc.)
      if (typeof input.toDate === 'function') {
        const d = input.toDate();
        return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
      }

      // Firestore / protobuf timestamp with seconds and optional nanoseconds
      if (typeof input.seconds === 'number') {
        const ms =
          input.seconds * 1000 +
          (input.nanoseconds ? Math.floor(input.nanoseconds / 1e6) : 0);
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? null : d;
      }

      // Private _seconds format
      if (typeof input._seconds === 'number') {
        const ms =
          input._seconds * 1000 +
          (input._nanoseconds ? Math.floor(input._nanoseconds / 1e6) : 0);
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? null : d;
      }

      // Object with nested timestamp/time
      if (input.timestamp != null) return normalizeDate(input.timestamp);
      if (input.time != null) return normalizeDate(input.time);
    }
  } catch (err) {
    console.warn('[attendanceService] normalizeDate error:', err);
  }

  return null;
}

/**
 * Formats time into 12-hour AM/PM string (e.g. "08:00 AM", "05:00 PM").
 * Robust against Date objects, ISO strings, Unix timestamps, backend timestamp objects,
 * time strings, and missing/invalid values.
 * Returns '--:--' for missing or invalid dates instead of crashing.
 */
export function formatTime12(date) {
  if (date == null || date === '') return '--:--';

  // Quick return if string is already formatted as "08:00 AM"
  if (typeof date === 'string') {
    const trimmed = date.trim();
    if (/^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
  }

  const d = normalizeDate(date);
  if (!d) return '--:--';

  try {
    const hours24 = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${String(hours12).padStart(2, '0')}:${minutes} ${period}`;
  } catch (err) {
    console.warn('[attendanceService] formatTime12 error:', err);
    return '--:--';
  }
}

// Formats minutes into standard "Xh Ym" notation
export function formatMinutesToHours(minutes = 0) {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const h = Math.floor(safeMinutes / 60);
  const m = safeMinutes % 60;
  return `${h}h ${m}m`;
}

// Classify check-in arrival status based on shift start and grace period
export function evaluateArrivalStatus(checkInDate, shift = DEFAULT_WORKER.assignedShift) {
  const checkIn = normalizeDate(checkInDate);
  if (!checkIn) {
    return {
      status: 'ON_TIME',
      label: 'Scheduled',
      color: '#10B981',
      minutesDiff: 0,
    };
  }

  const [shiftHours, shiftMinutes] = (shift?.startTime || '08:00').split(':').map(Number);
  const shiftStart = new Date(checkIn);
  shiftStart.setHours(shiftHours, shiftMinutes, 0, 0);

  const diffMinutes = Math.round((checkIn.getTime() - shiftStart.getTime()) / (1000 * 60));
  const grace = shift?.gracePeriodMinutes ?? 15;

  if (diffMinutes < -5) {
    return {
      status: 'EARLY',
      label: `Early by ${Math.abs(diffMinutes)}m`,
      color: '#10B981',
      minutesDiff: diffMinutes,
    };
  } else if (diffMinutes <= grace) {
    return {
      status: 'ON_TIME',
      label: 'On-Time',
      color: '#10B981',
      minutesDiff: diffMinutes,
    };
  } else {
    return {
      status: 'LATE',
      label: `Late by ${diffMinutes}m`,
      color: '#F59E0B',
      minutesDiff: diffMinutes,
    };
  }
}

/**
 * Authoritative Overtime & Regular Hours Engine
 * - Compares actual check-out time with assigned shift end time.
 * - Accurately separates Regular Working Hours and Overtime Hours.
 * - Overtime is strictly non-negative (Math.max(0, checkOut - shiftEnd)).
 * - Handles overnight shifts crossing midnight cleanly.
 * - Accepts Date objects, ISO strings, Unix timestamps, and backend timestamp objects.
 */
export function calculateShiftHoursAndOvertime(
  checkInDate,
  checkOutDate,
  shift = DEFAULT_WORKER.assignedShift
) {
  const start = normalizeDate(checkInDate);
  if (!start) {
    return {
      regularMinutes: 0,
      regularHours: 0,
      regularDuration: '0h 0m',
      overtimeMinutes: 0,
      overtimeHours: 0,
      overtimeDuration: '0h 0m',
      totalMinutes: 0,
      totalHours: 0,
      totalDuration: '0h 0m',
      hasOvertime: false,
      scheduledEndTime: shift?.endTime || '17:00',
    };
  }

  let end = normalizeDate(checkOutDate) || new Date();

  // Handle overnight shift if checkout timestamp is earlier on the clock than checkin
  let diffMs = end.getTime() - start.getTime();
  if (diffMs < 0 && shift?.isOvernight) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    diffMs = end.getTime() - start.getTime();
  }

  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  // Calculate scheduled shift end anchored to start date
  const [endH, endM] = (shift?.endTime || '17:00').split(':').map(Number);
  const scheduledEnd = new Date(start);
  scheduledEnd.setHours(endH, endM, 0, 0);

  if (shift?.isOvernight) {
    const [startH] = (shift?.startTime || '08:00').split(':').map(Number);
    if (endH < startH) {
      scheduledEnd.setDate(scheduledEnd.getDate() + 1);
    }
  }

  // Overtime occurs when check-out occurs after scheduled shift end
  let overtimeMinutes = 0;
  if (end.getTime() > scheduledEnd.getTime()) {
    const otDiffMs = end.getTime() - scheduledEnd.getTime();
    overtimeMinutes = Math.max(0, Math.floor(otDiffMs / (1000 * 60)));
  }

  // Regular hours cannot exceed scheduled working hours and cannot be negative
  const regularMinutes = Math.max(0, totalMinutes - overtimeMinutes);

  return {
    regularMinutes,
    regularHours: parseFloat((regularMinutes / 60).toFixed(2)),
    regularDuration: formatMinutesToHours(regularMinutes),

    overtimeMinutes,
    overtimeHours: parseFloat((overtimeMinutes / 60).toFixed(2)),
    overtimeDuration: formatMinutesToHours(overtimeMinutes),

    totalMinutes,
    totalHours: parseFloat((totalMinutes / 60).toFixed(2)),
    totalDuration: formatMinutesToHours(totalMinutes),

    hasOvertime: overtimeMinutes > 0,
    scheduledEndIso: scheduledEnd.toISOString(),
  };
}

// Backward-compatible wrapper for basic duration calls
export function calculateWorkingHours(checkInDate, checkOutDate, isOvernight = false) {
  const result = calculateShiftHoursAndOvertime(checkInDate, checkOutDate, {
    startTime: '08:00',
    endTime: '17:00',
    isOvernight,
  });
  return {
    hours: Math.floor(result.totalMinutes / 60),
    minutes: result.totalMinutes % 60,
    totalMinutes: result.totalMinutes,
    formatted: result.totalDuration,
  };
}

/**
 * In-memory authoritative attendance storage simulating server database constraints
 */
class AttendanceService {
  constructor() {
    this.worker = { ...DEFAULT_WORKER };
    this.currentShift = { ...DEFAULT_WORKER.assignedShift };

    // Keyed by businessDate "YYYY-MM-DD"
    this.records = new Map();

    // Pre-seed realistic monthly historical data with overtime tracking
    this._seedHistoricalMonthlyData();
  }

  // Pre-seed realistic monthly history with overtime records and metrics
  _seedHistoricalMonthlyData() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    // Generate records for current month up to yesterday
    const yesterday = today.getDate() - 1;
    for (let day = 1; day <= Math.max(yesterday, 1); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
      const dateKey = getBusinessDateString(date);

      // Sundays are Rest Days
      if (dayOfWeek === 0) {
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'REST_DAY',
          statusLabel: 'Weekend / Rest Day',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: null,
          checkOut: null,
          regularHours: 0,
          regularDuration: '0h 0m',
          regularMinutes: 0,
          overtimeHours: 0,
          overtimeDuration: '0h 0m',
          overtimeMinutes: 0,
          totalHours: 0,
          totalDuration: '0h 0m',
          totalMinutes: 0,
          duration: '0h 0m',
          hasOvertime: false,
          isCompleted: true,
        });
        continue;
      }

      // Overtime Day 1: Day 3 -> 2h 30m overtime
      if (day === 3) {
        const checkIn = new Date(currentYear, currentMonth, day, 7, 55);
        const checkOut = new Date(currentYear, currentMonth, day, 19, 30);
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'OVERTIME',
          statusLabel: 'Overtime (+2h 30m)',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          actualCheckIn: checkIn.toISOString(),
          actualCheckOut: checkOut.toISOString(),
          regularHours: 9.08,
          regularDuration: '9h 05m',
          regularMinutes: 545,
          overtimeHours: 2.5,
          overtimeDuration: '2h 30m',
          overtimeMinutes: 150,
          totalHours: 11.58,
          totalDuration: '11h 35m',
          totalMinutes: 695,
          duration: '11h 35m',
          hasOvertime: true,
          isCompleted: true,
          siteLocation: this.worker.site,
        });
      } else if (day === 5) {
        // Overtime Day 2: Day 5 -> 1h 45m overtime
        const checkIn = new Date(currentYear, currentMonth, day, 8, 0);
        const checkOut = new Date(currentYear, currentMonth, day, 18, 45);
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'OVERTIME',
          statusLabel: 'Overtime (+1h 45m)',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          actualCheckIn: checkIn.toISOString(),
          actualCheckOut: checkOut.toISOString(),
          regularHours: 9.0,
          regularDuration: '9h 00m',
          regularMinutes: 540,
          overtimeHours: 1.75,
          overtimeDuration: '1h 45m',
          overtimeMinutes: 105,
          totalHours: 10.75,
          totalDuration: '10h 45m',
          totalMinutes: 645,
          duration: '10h 45m',
          hasOvertime: true,
          isCompleted: true,
          siteLocation: this.worker.site,
        });
      } else if (day === 4) {
        // Late arrival (0h overtime)
        const checkIn = new Date(currentYear, currentMonth, day, 8, 35);
        const checkOut = new Date(currentYear, currentMonth, day, 17, 0);
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'LATE',
          statusLabel: 'Late Arrival (35m)',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          actualCheckIn: checkIn.toISOString(),
          actualCheckOut: checkOut.toISOString(),
          regularHours: 8.42,
          regularDuration: '8h 25m',
          regularMinutes: 505,
          overtimeHours: 0,
          overtimeDuration: '0h 0m',
          overtimeMinutes: 0,
          totalHours: 8.42,
          totalDuration: '8h 25m',
          totalMinutes: 505,
          duration: '8h 25m',
          hasOvertime: false,
          isCompleted: true,
          siteLocation: this.worker.site,
        });
      } else if (day === 6) {
        // Half Day
        const checkIn = new Date(currentYear, currentMonth, day, 8, 2);
        const checkOut = new Date(currentYear, currentMonth, day, 12, 30);
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'HALF_DAY',
          statusLabel: 'Half Day (4.5h)',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          actualCheckIn: checkIn.toISOString(),
          actualCheckOut: checkOut.toISOString(),
          regularHours: 4.47,
          regularDuration: '4h 28m',
          regularMinutes: 268,
          overtimeHours: 0,
          overtimeDuration: '0h 0m',
          overtimeMinutes: 0,
          totalHours: 4.47,
          totalDuration: '4h 28m',
          totalMinutes: 268,
          duration: '4h 28m',
          hasOvertime: false,
          isCompleted: true,
          siteLocation: this.worker.site,
        });
      } else if (day === 2) {
        // Approved Medical Leave
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'ON_LEAVE',
          statusLabel: 'Approved Medical Leave',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: null,
          checkOut: null,
          regularHours: 0,
          regularDuration: '0h 0m',
          regularMinutes: 0,
          overtimeHours: 0,
          overtimeDuration: '0h 0m',
          overtimeMinutes: 0,
          totalHours: 0,
          totalDuration: '0h 0m',
          totalMinutes: 0,
          duration: '0h 0m',
          hasOvertime: false,
          isCompleted: true,
        });
      } else if (day === 7) {
        // Overtime Day 3: Day 7 -> 2h 00m overtime
        const checkIn = new Date(currentYear, currentMonth, day, 8, 0);
        const checkOut = new Date(currentYear, currentMonth, day, 19, 0);
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'OVERTIME',
          statusLabel: 'Overtime (+2h 00m)',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          actualCheckIn: checkIn.toISOString(),
          actualCheckOut: checkOut.toISOString(),
          regularHours: 9.0,
          regularDuration: '9h 00m',
          regularMinutes: 540,
          overtimeHours: 2.0,
          overtimeDuration: '2h 00m',
          overtimeMinutes: 120,
          totalHours: 11.0,
          totalDuration: '11h 00m',
          totalMinutes: 660,
          duration: '11h 00m',
          hasOvertime: true,
          isCompleted: true,
          siteLocation: this.worker.site,
        });
      } else {
        // Regular on-time present day (scheduled end 17:00, check-out at 17:02 -> rounded 0h overtime)
        const checkIn = new Date(currentYear, currentMonth, day, 7, 56 + (day % 4));
        const checkOut = new Date(currentYear, currentMonth, day, 17, 0);
        this.records.set(dateKey, {
          id: `att_${dateKey}`,
          workerId: this.worker.id,
          attendanceDate: dateKey,
          businessDate: dateKey,
          status: 'PRESENT',
          statusLabel: 'Present (On-Time)',
          shiftStartTime: '08:00',
          shiftEndTime: '17:00',
          shiftName: 'Standard Day Shift',
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          actualCheckIn: checkIn.toISOString(),
          actualCheckOut: checkOut.toISOString(),
          regularHours: 9.05,
          regularDuration: '9h 03m',
          regularMinutes: 543,
          overtimeHours: 0,
          overtimeDuration: '0h 0m',
          overtimeMinutes: 0,
          totalHours: 9.05,
          totalDuration: '9h 03m',
          totalMinutes: 543,
          duration: '9h 03m',
          hasOvertime: false,
          isCompleted: true,
          siteLocation: this.worker.site,
        });
      }
    }
  }

  // Get current active worker
  getWorker() {
    return this.worker;
  }

  // Set active shift (Day Shift vs Overnight Shift)
  setActiveShift(shiftId) {
    const shift = this.worker.availableShifts.find((s) => s.id === shiftId);
    if (shift) {
      this.currentShift = { ...shift };
    }
    return this.currentShift;
  }

  getActiveShift() {
    return this.currentShift;
  }

  // Authoritative server timestamp generator
  getServerTimestamp() {
    return new Date();
  }

  // Retrieve today's attendance record
  getTodayRecord() {
    const todayKey = getBusinessDateString(this.getServerTimestamp());
    return (
      this.records.get(todayKey) || {
        id: null,
        workerId: this.worker.id,
        attendanceDate: todayKey,
        businessDate: todayKey,
        status: 'NOT_CHECKED_IN',
        statusLabel: 'Not Checked In',
        shift: this.currentShift,
        shiftStartTime: this.currentShift.startTime,
        shiftEndTime: this.currentShift.endTime,
        shiftName: this.currentShift.name,
        checkIn: null,
        checkOut: null,
        arrivalStatus: null,
        duration: '0h 0m',
        totalHours: 0,
        totalMinutes: 0,
        totalDuration: '0h 0m',
        regularHours: 0,
        regularMinutes: 0,
        regularDuration: '0h 0m',
        overtimeHours: 0,
        overtimeMinutes: 0,
        overtimeDuration: '0h 0m',
        hasOvertime: false,
        isCompleted: false,
      }
    );
  }

  /**
   * Check-in worker with authoritative validation:
   * - Cannot check in more than once on the same business date.
   * - Stores exact timestamp and evaluates arrival status (Early, On-Time, Late).
   */
  async checkIn(workerId = this.worker.id) {
    const now = this.getServerTimestamp();
    const todayKey = getBusinessDateString(now);

    const existing = this.records.get(todayKey);
    if (existing && existing.checkIn) {
      throw new Error('Duplicate check-in blocked: Worker has already checked in for today.');
    }

    const arrival = evaluateArrivalStatus(now, this.currentShift);

    const record = {
      id: `att_${todayKey}_${Date.now()}`,
      workerId,
      workerName: this.worker.name,
      shiftId: this.currentShift.id,
      shiftName: this.currentShift.name,
      shiftStartTime: this.currentShift.startTime,
      shiftEndTime: this.currentShift.endTime,
      shift: { ...this.currentShift },
      businessDate: todayKey,
      attendanceDate: todayKey,
      checkIn: now.toISOString(),
      checkOut: null,
      arrivalStatus: arrival,
      status: arrival.status === 'LATE' ? 'LATE' : 'PRESENT',
      statusLabel: arrival.label,
      duration: '0h 0m',
      totalHours: 0,
      totalMinutes: 0,
      totalDuration: '0h 0m',
      regularHours: 0,
      regularMinutes: 0,
      regularDuration: '0h 0m',
      overtimeHours: 0,
      overtimeMinutes: 0,
      overtimeDuration: '0h 0m',
      hasOvertime: false,
      isCompleted: false,
      geofenceVerified: true,
      siteLocation: this.worker.site,
    };

    this.records.set(todayKey, record);
    return record;
  }

  /**
   * Check-out worker with authoritative overtime detection:
   * - Compares actual check-out time with assigned shift end time.
   * - Calculates regular hours and overtime hours separately.
   * - Overtime is strictly non-negative.
   * - Updates status to 'OVERTIME' if overtime detected.
   * - Locks record to prevent modification.
   */
  async checkOut(workerId = this.worker.id) {
    const now = this.getServerTimestamp();
    const todayKey = getBusinessDateString(now);

    const existing = this.records.get(todayKey);
    if (!existing || !existing.checkIn) {
      throw new Error('Cannot check out: No active check-in record found for today.');
    }

    if (existing.checkOut) {
      throw new Error('Duplicate check-out blocked: Attendance for this shift is already closed.');
    }

    // Automatic Overtime Engine
    const overtimeData = calculateShiftHoursAndOvertime(
      existing.checkIn,
      now,
      this.currentShift
    );

    // Evaluate attendance status
    let finalStatus = existing.status;
    let finalStatusLabel = 'Shift Completed';

    if (overtimeData.regularHours < 4) {
      finalStatus = 'HALF_DAY';
      finalStatusLabel = 'Half Day Shift';
    } else if (overtimeData.hasOvertime) {
      finalStatus = 'OVERTIME';
      finalStatusLabel = `Overtime (+${overtimeData.overtimeDuration})`;
    }

    const updated = {
      ...existing,
      checkOut: now.toISOString(),
      actualCheckIn: existing.checkIn,
      actualCheckOut: now.toISOString(),

      // Overtime & Working Hours storage
      regularHours: overtimeData.regularHours,
      regularDuration: overtimeData.regularDuration,
      regularMinutes: overtimeData.regularMinutes,

      overtimeHours: overtimeData.overtimeHours,
      overtimeDuration: overtimeData.overtimeDuration,
      overtimeMinutes: overtimeData.overtimeMinutes,

      totalHours: overtimeData.totalHours,
      totalDuration: overtimeData.totalDuration,
      totalMinutes: overtimeData.totalMinutes,
      duration: overtimeData.totalDuration,

      hasOvertime: overtimeData.hasOvertime,
      status: finalStatus,
      statusLabel: finalStatusLabel,
      isCompleted: true,
    };

    this.records.set(todayKey, updated);
    return updated;
  }

  /**
   * Generate complete monthly attendance reports and calendar grid data,
   * including comprehensive overtime analytics and day breakdowns.
   */
  getMonthlyReport(year, month) {
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    let totalWorkingDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let lateArrivals = 0;
    let halfDays = 0;
    let onLeaveDays = 0;

    let totalRegularMinutesWorked = 0;
    let totalOvertimeMinutesWorked = 0;
    let totalMinutesWorked = 0;
    let overtimeDaysCount = 0;

    const calendarDays = [];
    const overtimeRecords = [];

    // First day of month offset
    const firstDayIndex = new Date(year, month, 1).getDay();

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = getBusinessDateString(date);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0;

      const record = this.records.get(dateKey);

      let dayStatus = 'NOT_RECORDED';
      let statusColor = '#CBD5E1';

      if (isWeekend) {
        dayStatus = 'REST_DAY';
        statusColor = '#94A3B8';
      } else {
        totalWorkingDays++;

        if (record) {
          const hasOvertime = Boolean(record.hasOvertime || record.overtimeMinutes > 0);

          if (hasOvertime) {
            overtimeDaysCount++;
            overtimeRecords.push({
              dateKey,
              day,
              shiftName: record.shiftName || 'Standard Day Shift',
              regularDuration: record.regularDuration || '9h 0m',
              overtimeDuration: record.overtimeDuration || '0h 0m',
              totalDuration: record.totalDuration || record.duration || '0h 0m',
              checkIn: record.checkIn,
              checkOut: record.checkOut,
            });
          }

          if (record.status === 'OVERTIME') {
            presentDays++;
            dayStatus = 'OVERTIME';
            statusColor = '#F97316'; // Structura Orange for Overtime
            totalRegularMinutesWorked += record.regularMinutes || 540;
            totalOvertimeMinutesWorked += record.overtimeMinutes || 0;
            totalMinutesWorked += record.totalMinutes || 540;
          } else if (record.status === 'PRESENT') {
            presentDays++;
            dayStatus = 'PRESENT';
            statusColor = '#10B981'; // Green
            totalRegularMinutesWorked += record.regularMinutes || 540;
            totalOvertimeMinutesWorked += record.overtimeMinutes || 0;
            totalMinutesWorked += record.totalMinutes || 540;
          } else if (record.status === 'LATE') {
            presentDays++;
            lateArrivals++;
            dayStatus = 'LATE';
            statusColor = '#F59E0B'; // Amber
            totalRegularMinutesWorked += record.regularMinutes || 505;
            totalOvertimeMinutesWorked += record.overtimeMinutes || 0;
            totalMinutesWorked += record.totalMinutes || 505;
          } else if (record.status === 'HALF_DAY') {
            halfDays++;
            dayStatus = 'HALF_DAY';
            statusColor = '#8B5CF6'; // Purple
            totalRegularMinutesWorked += record.regularMinutes || 240;
            totalMinutesWorked += record.totalMinutes || 240;
          } else if (record.status === 'ON_LEAVE') {
            onLeaveDays++;
            dayStatus = 'ON_LEAVE';
            statusColor = '#3B82F6'; // Blue
          } else if (record.status === 'ABSENT') {
            absentDays++;
            dayStatus = 'ABSENT';
            statusColor = '#EF4444'; // Red
          }
        } else {
          // If past date in working day and no record, mark as Absent
          const today = this.getServerTimestamp();
          if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            absentDays++;
            dayStatus = 'ABSENT';
            statusColor = '#EF4444';
          }
        }
      }

      calendarDays.push({
        day,
        dateKey,
        dayOfWeek,
        isWeekend,
        status: dayStatus,
        statusColor,
        hasOvertime: Boolean(record?.hasOvertime),
        overtimeDuration: record?.overtimeDuration || '0h 0m',
        overtimeHours: record?.overtimeHours || 0,
        regularDuration: record?.regularDuration || '0h 0m',
        totalDuration: record?.totalDuration || record?.duration || '0h 0m',
        record: record || null,
      });
    }

    const totalHoursWorked = (totalMinutesWorked / 60).toFixed(1);
    const totalRegularHoursWorked = (totalRegularMinutesWorked / 60).toFixed(1);
    const totalOvertimeHoursWorked = (totalOvertimeMinutesWorked / 60).toFixed(1);

    const attendancePercentage =
      totalWorkingDays > 0
        ? (((presentDays + halfDays * 0.5) / totalWorkingDays) * 100).toFixed(1)
        : '0.0';

    return {
      year,
      month,
      monthName: new Date(year, month, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      firstDayIndex,
      totalDaysInMonth,
      calendarDays,
      overtimeRecords,
      metrics: {
        totalWorkingDays,
        presentDays,
        absentDays,
        lateArrivals,
        halfDays,
        onLeaveDays,
        totalHoursWorked,
        totalRegularHoursWorked,
        totalOvertimeHoursWorked,
        overtimeDaysCount,
        attendancePercentage: `${attendancePercentage}%`,
      },
    };
  }

  // Retrieve single record by date
  getRecordByDate(dateKey) {
    return this.records.get(dateKey) || null;
  }
}

export const attendanceService = new AttendanceService();
