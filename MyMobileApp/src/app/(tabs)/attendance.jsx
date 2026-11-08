import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Attendance & Leave Services
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';

// Modular Attendance & Leave Components
import WorkerAttendanceHeader from '../../components/attendance/WorkerAttendanceHeader';
import TodayShiftCard from '../../components/attendance/TodayShiftCard';
import LeaveManagementSection from '../../components/attendance/LeaveManagementSection';
import MonthlyAttendanceReport from '../../components/attendance/MonthlyAttendanceReport';
import AttendanceConfirmationModal from '../../components/attendance/AttendanceConfirmationModal';
import DayDetailsModal from '../../components/attendance/DayDetailsModal';
import ApplyLeaveModal from '../../components/attendance/ApplyLeaveModal';

/**
 * Structura MAD - Complete Worker Attendance & Leave Management System
 *
 * Core Modules:
 * 1. Worker Profile & Live Clock Header
 * 2. Today's Shift & Check-In/Check-Out with Automatic Overtime Tracking
 * 3. Annual Leave Management System:
 *    - 4 Minimal Stat Cards (Allowance, Used, Remaining, Pending)
 *    - Category Breakdown (Casual, Sick, Earned, Unpaid)
 *    - Apply for Leave Modal with auto working-days calculation (excluding Sundays & holidays)
 *    - Leave Request Tracking (Pending, Approved, Rejected)
 *    - Worker Cancellation & Manager Review workflow
 *    - Historical Multi-Year Leave Balances (2026, 2025)
 * 4. Monthly Attendance Reports & Interactive Calendar Grid
 */
export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();

  // Core Attendance State initialized directly from service
  const [worker] = useState(() => attendanceService.getWorker());
  const [activeShift, setActiveShift] = useState(() => attendanceService.getActiveShift());
  const [todayRecord, setTodayRecord] = useState(() => attendanceService.getTodayRecord());

  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [monthlyReport, setMonthlyReport] = useState(() =>
    attendanceService.getMonthlyReport(new Date().getFullYear(), new Date().getMonth())
  );

  // Leave Management State
  const [selectedLeaveYear, setSelectedLeaveYear] = useState(() => new Date().getFullYear());
  const [leaveBalance, setLeaveBalance] = useState(() =>
    leaveService.getLeaveBalance(new Date().getFullYear(), worker.id)
  );
  const [leaveRequests, setLeaveRequests] = useState(() =>
    leaveService.getLeaveRequests(new Date().getFullYear(), worker.id)
  );
  const [isApplyLeaveModalVisible, setIsApplyLeaveModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals State
  const [confirmationData, setConfirmationData] = useState(null); // { type, record }
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  // Pull-to-refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTodayRecord(attendanceService.getTodayRecord());
      setActiveShift(attendanceService.getActiveShift());
      setMonthlyReport(attendanceService.getMonthlyReport(currentYear, currentMonth));
      setLeaveBalance(leaveService.getLeaveBalance(selectedLeaveYear, worker.id));
      setLeaveRequests(leaveService.getLeaveRequests(selectedLeaveYear, worker.id));
      setIsRefreshing(false);
    }, 600);
  }, [currentYear, currentMonth, selectedLeaveYear, worker.id]);

  // Shift Switcher (allowed before check-in)
  const handleSelectShift = (shiftId) => {
    const updated = attendanceService.setActiveShift(shiftId);
    setActiveShift(updated);
  };

  // Perform Authoritative Check-In
  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const record = await attendanceService.checkIn(worker.id);
      setTodayRecord(record);

      // Refresh monthly analytics to immediately include today's check-in
      const updatedMonth = attendanceService.getMonthlyReport(currentYear, currentMonth);
      setMonthlyReport(updatedMonth);

      // Open confirmation modal
      setConfirmationData({
        type: 'CHECK_IN',
        record,
      });
    } catch (err) {
      Alert.alert('Check-In Blocked', err.message || 'Unable to complete check-in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Perform Authoritative Check-Out with Automatic Overtime
  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const record = await attendanceService.checkOut(worker.id);
      setTodayRecord(record);

      // Refresh monthly analytics
      const updatedMonth = attendanceService.getMonthlyReport(currentYear, currentMonth);
      setMonthlyReport(updatedMonth);

      // Open confirmation modal
      setConfirmationData({
        type: 'CHECK_OUT',
        record,
      });
    } catch (err) {
      Alert.alert('Check-Out Blocked', err.message || 'Unable to complete check-out.');
    } finally {
      setIsLoading(false);
    }
  };

  // Month Navigation
  const handlePrevMonth = () => {
    let nextYear = currentYear;
    let nextMonth = currentMonth - 1;
    if (nextMonth < 0) {
      nextYear -= 1;
      nextMonth = 11;
    }
    setCurrentYear(nextYear);
    setCurrentMonth(nextMonth);
    setMonthlyReport(attendanceService.getMonthlyReport(nextYear, nextMonth));
  };

  const handleNextMonth = () => {
    let nextYear = currentYear;
    let nextMonth = currentMonth + 1;
    if (nextMonth > 11) {
      nextYear += 1;
      nextMonth = 0;
    }
    setCurrentYear(nextYear);
    setCurrentMonth(nextMonth);
    setMonthlyReport(attendanceService.getMonthlyReport(nextYear, nextMonth));
  };

  // Select Calendar Date or Daily Breakdown Item to Inspect Record
  const handleSelectDate = (dateKey, record, dayItem) => {
    const authoritativeRecord =
      record || dayItem?.record || attendanceService.getRecordByDate(dateKey);

    setSelectedDayInfo({
      dateKey,
      record: authoritativeRecord,
      status: dayItem?.status || authoritativeRecord?.status || 'NOT_RECORDED',
      isWeekend: dayItem?.isWeekend,
      statusColor: dayItem?.statusColor || '#F97316',
    });
  };

  // Leave Year Switcher
  const handleSelectLeaveYear = (year) => {
    setSelectedLeaveYear(year);
    setLeaveBalance(leaveService.getLeaveBalance(year, worker.id));
    setLeaveRequests(leaveService.getLeaveRequests(year, worker.id));
  };

  // Submit Leave Request
  const handleSubmitLeave = async (formValues) => {
    try {
      const result = await leaveService.submitLeaveRequest({
        workerId: worker.id,
        ...formValues,
      });

      setLeaveBalance(result.balance);
      setLeaveRequests(leaveService.getLeaveRequests(selectedLeaveYear, worker.id));

      Alert.alert(
        'Leave Request Submitted',
        `Your ${result.request.leaveTypeName} request for ${result.request.workingDays} working day(s) (${result.request.startDate} to ${result.request.endDate}) has been recorded and submitted for manager approval.`
      );
    } catch (err) {
      Alert.alert('Submission Error', err.message || 'Could not submit leave request.');
      throw err;
    }
  };

  // Cancel Pending Leave Request (Worker Action)
  const handleCancelLeave = async (requestId) => {
    try {
      const result = await leaveService.cancelLeaveRequest(requestId, worker.id);
      setLeaveBalance(result.balance);
      setLeaveRequests(leaveService.getLeaveRequests(selectedLeaveYear, worker.id));
      Alert.alert('Request Cancelled', 'Your pending leave request has been removed.');
    } catch (err) {
      Alert.alert('Cancellation Error', err.message || 'Could not cancel leave request.');
    }
  };

  // Safe vertical padding
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 12 : 16);
  // Bottom padding ensures comfortable scrolling clear of the fixed bottom navigation bar
  const bottomInset = Math.max(insets.bottom, 12) + 76;

  return (
    <View style={[styles.rootContainer, { paddingTop: topInset }]} className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#172B4D', '#10B981']}
            tintColor="#172B4D"
          />
        }
      >
        {/* Section 1: Welcome & Worker Profile with Live Clock */}
        <WorkerAttendanceHeader worker={worker} />

        {/* Section 2: Today Shift & Large Check-In / Check-Out Action Button with Overtime */}
        <TodayShiftCard
          record={todayRecord}
          activeShift={activeShift}
          availableShifts={worker.availableShifts}
          onSelectShift={handleSelectShift}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isLoading={isLoading}
        />

        {/* Section 3: Annual Leave Management System */}
        <LeaveManagementSection
          leaveBalance={leaveBalance}
          leaveRequests={leaveRequests}
          selectedYear={selectedLeaveYear}
          availableYears={leaveService.getAvailableYears()}
          onSelectYear={handleSelectLeaveYear}
          onOpenApplyModal={() => setIsApplyLeaveModalVisible(true)}
          onCancelRequest={handleCancelLeave}
        />

        {/* Section 4: Monthly Attendance Reports & Interactive Calendar */}
        <MonthlyAttendanceReport
          monthlyReport={monthlyReport}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDate={handleSelectDate}
        />
      </ScrollView>

      {/* Apply for Leave Modal */}
      <ApplyLeaveModal
        visible={isApplyLeaveModalVisible}
        onClose={() => setIsApplyLeaveModalVisible(false)}
        onSubmit={handleSubmitLeave}
        leaveBalance={leaveBalance}
        currentYear={selectedLeaveYear}
      />

      {/* Check-In / Check-Out Action Confirmation Dialog */}
      <AttendanceConfirmationModal
        visible={Boolean(confirmationData)}
        onClose={() => setConfirmationData(null)}
        type={confirmationData?.type}
        record={confirmationData?.record}
      />

      {/* Historical Calendar Day Inspector Modal */}
      <DayDetailsModal
        visible={Boolean(selectedDayInfo)}
        onClose={() => setSelectedDayInfo(null)}
        dayInfo={selectedDayInfo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
