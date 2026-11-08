import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Dashboard Initial Data
import {
  INITIAL_USER,
  INITIAL_STATISTICS,
  INITIAL_PROJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_INVENTORY,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
} from '../../services/dashboardData';

// Dashboard Modular Components
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatisticsCards from '../../components/dashboard/StatisticsCards';
import ProjectOverviewCard from '../../components/dashboard/ProjectOverviewCard';
import AttendanceOverviewCard from '../../components/dashboard/AttendanceOverviewCard';
import InventoryOverviewCard from '../../components/dashboard/InventoryOverviewCard';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentActivities from '../../components/dashboard/RecentActivities';

// Interactive Modals
import AddProjectModal from '../../components/dashboard/AddProjectModal';
import AddWorkerModal from '../../components/dashboard/AddWorkerModal';
import MarkAttendanceModal from '../../components/dashboard/MarkAttendanceModal';
import GenerateReportModal from '../../components/dashboard/GenerateReportModal';
import AddInventoryModal from '../../components/dashboard/AddInventoryModal';
import NotificationsModal from '../../components/dashboard/NotificationsModal';
import ProfileModal from '../../components/dashboard/ProfileModal';
import ProjectDetailsModal from '../../components/dashboard/ProjectDetailsModal';

/**
 * Structura MAD - Site Manager & Construction Dashboard
 *
 * Minimal, premium, and professional construction-management UI:
 * 1. Header (Welcome, user profile, current date, notification icon)
 * 2. Statistics Cards (Total Projects, Active Projects, Total Workers, Pending Tasks)
 * 3. Project Overview (Name, location, status, completion progress bar)
 * 4. Attendance Overview (Present, Absent, On Leave with link to Attendance screen)
 * 5. Inventory Overview (Total items, available stock, low-stock, out-of-stock items)
 * 6. Quick Actions (Add Project, Add Worker, Mark Attendance, Generate Report, Add Inventory Item)
 * 7. Recent Activities (Project updates, attendance records, inventory updates, reports)
 */
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  // State Management
  const [user, setUser] = useState(INITIAL_USER);
  const [statistics, setStatistics] = useState(INITIAL_STATISTICS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(INITIAL_PROJECTS[0]?.id);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals Visibility State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Refresh with fresh state simulation
      setStatistics((prev) => ({ ...prev }));
      setIsRefreshing(false);
    }, 600);
  }, []);

  // Quick Action Handlers
  const handleAddProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setStatistics((prev) => ({
      ...prev,
      totalProjects: prev.totalProjects + 1,
      activeProjects: prev.activeProjects + 1,
    }));
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        category: 'Projects',
        title: 'New Site Project Created',
        description: `${newProject.name} (${newProject.code}) initiated with budget of ${newProject.budget}.`,
        timestamp: 'Just now',
        author: user.name,
        tag: newProject.name,
      },
      ...prev,
    ]);
  };

  const handleAddWorker = (newWorker) => {
    setStatistics((prev) => ({
      ...prev,
      totalWorkers: prev.totalWorkers + 1,
    }));
    setAttendance((prev) => {
      const newTotal = prev.total + 1;
      const newPresent = prev.present + 1;
      const rate = ((newPresent / newTotal) * 100).toFixed(1);
      return {
        ...prev,
        total: newTotal,
        present: newPresent,
        attendanceRate: `${rate}%`,
      };
    });
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        category: 'Attendance',
        title: 'Site Worker Registered',
        description: `${newWorker.name} (${newWorker.trade}) registered and checked in at ${newWorker.assignedSite}.`,
        timestamp: 'Just now',
        author: user.name,
        tag: newWorker.trade,
      },
      ...prev,
    ]);
  };

  const handleConfirmAttendance = (count) => {
    setAttendance((prev) => {
      const newPresent = prev.present + count;
      const rate = ((newPresent / prev.total) * 100).toFixed(1);
      return {
        ...prev,
        present: newPresent,
        attendanceRate: `${rate}%`,
      };
    });
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        category: 'Attendance',
        title: 'Shift Rollcall Updated',
        description: `Verified +${count} additional workers present on site. Total present: ${attendance.present + count}.`,
        timestamp: 'Just now',
        author: user.name,
        tag: 'Rollcall',
      },
      ...prev,
    ]);
  };

  const handleReportGenerated = (newReport) => {
    setActivities((prev) => [newReport, ...prev]);
  };

  const handleAddInventory = (newItem) => {
    setInventory((prev) => ({
      ...prev,
      totalItems: prev.totalItems + newItem.quantity,
      availableStock: prev.availableStock + newItem.quantity,
      lastUpdated: 'Just now',
    }));
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        category: 'Inventory',
        title: 'Stock Added to Yard',
        description: `Received ${newItem.quantity} ${newItem.unit} of ${newItem.name} (${newItem.category}).`,
        timestamp: 'Just now',
        author: user.name,
        tag: newItem.category,
      },
      ...prev,
    ]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUser((prev) => ({ ...prev, notificationsCount: 0 }));
  };

  // Safe vertical padding calculations
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 12 : 16);
  // Bottom padding ensures content clears the bottom navigation bar with comfortable margin
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
            colors={['#172B4D', '#F97316']}
            tintColor="#172B4D"
          />
        }
      >
        {/* 1. Header */}
        <DashboardHeader
          user={user}
          unreadCount={user.notificationsCount}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenProfile={() => setShowProfile(true)}
        />

        {/* 2. Statistics Cards */}
        <StatisticsCards
          statistics={statistics}
          onPressProjects={() => setSelectedProjectForModal(projects[0])}
          onPressActive={() => setSelectedProjectForModal(projects[0])}
          onPressWorkers={() => router.push('/(tabs)/attendance')}
          onPressTasks={() => router.push('/(tabs)/reports')}
        />

        {/* 3. Project Overview */}
        <ProjectOverviewCard
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onViewProjectDetails={(proj) => setSelectedProjectForModal(proj)}
        />

        {/* 4. Attendance Overview */}
        <AttendanceOverviewCard
          attendance={attendance}
          onNavigateToAttendance={() => router.push('/(tabs)/attendance')}
        />

        {/* 5. Inventory Overview */}
        <InventoryOverviewCard
          inventory={inventory}
          onNavigateToInventory={() => router.push('/(tabs)/inventory')}
        />

        {/* 6. Quick Actions */}
        <QuickActions
          onAddProject={() => setShowAddProject(true)}
          onAddWorker={() => setShowAddWorker(true)}
          onMarkAttendance={() => setShowMarkAttendance(true)}
          onGenerateReport={() => setShowGenerateReport(true)}
          onAddInventory={() => setShowAddInventory(true)}
        />

        {/* 7. Recent Activities */}
        <RecentActivities activities={activities} />
      </ScrollView>

      {/* Interactive Modals */}
      <AddProjectModal
        visible={showAddProject}
        onClose={() => setShowAddProject(false)}
        onAddProject={handleAddProject}
      />

      <AddWorkerModal
        visible={showAddWorker}
        onClose={() => setShowAddWorker(false)}
        onAddWorker={handleAddWorker}
        projects={projects}
      />

      <MarkAttendanceModal
        visible={showMarkAttendance}
        onClose={() => setShowMarkAttendance(false)}
        attendance={attendance}
        onConfirmAttendance={handleConfirmAttendance}
      />

      <GenerateReportModal
        visible={showGenerateReport}
        onClose={() => setShowGenerateReport(false)}
        onReportGenerated={handleReportGenerated}
        projects={projects}
      />

      <AddInventoryModal
        visible={showAddInventory}
        onClose={() => setShowAddInventory(false)}
        onAddInventory={handleAddInventory}
      />

      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

      <ProfileModal
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        statistics={statistics}
      />

      <ProjectDetailsModal
        visible={Boolean(selectedProjectForModal)}
        onClose={() => setSelectedProjectForModal(null)}
        project={selectedProjectForModal}
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
