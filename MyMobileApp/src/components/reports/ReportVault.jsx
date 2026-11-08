import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  CONSTRUCTION_PROJECTS,
  REPORT_STATUS_OPTIONS,
} from '../../services/reportService';

/**
 * ReportVault
 * Central Document Vault & Site Audit Management interface.
 * Allows site engineers and supervisors to search, filter, sort, preview,
 * inspect, and manage construction reports and their technical attachments.
 */
export default function ReportVault({
  reports = [],
  isLoading = false,
  error = null,
  onRetry,
  onInspectReport,
  onOpenNewReport,
  onNavigateBack,
  onEditDraft,
  onDeleteDraft,
  navigation,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST' | 'OLDEST'

  // Extract unique report dates
  const availableDates = useMemo(() => {
    const dates = new Set();
    reports.forEach((r) => {
      if (r.reportDate) dates.add(r.reportDate);
    });
    return Array.from(dates).sort().reverse();
  }, [reports]);

  // Status statistics for vault summary
  const stats = useMemo(() => {
    const total = reports.length;
    let reviewed = 0;
    let pending = 0;
    let submitted = 0;
    let drafts = 0;

    reports.forEach((r) => {
      const s = (r.status || '').toLowerCase();
      if (s === 'reviewed' || s === 'approved') reviewed++;
      else if (s.includes('pending')) pending++;
      else if (s === 'draft' || r.isDraft) drafts++;
      else submitted++;
    });

    return { total, reviewed, pending, submitted, drafts };
  }, [reports]);

  // Filtered and sorted reports collection
  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = reports.filter((rep) => {
      // 1. Project filter
      if (selectedProject !== 'All' && rep.siteName !== selectedProject) {
        return false;
      }

      // 2. Status filter
      if (selectedStatus !== 'All') {
        const s = (rep.status || '').toLowerCase();
        const target = selectedStatus.toLowerCase();
        if (target === 'pending review') {
          if (!s.includes('pending')) return false;
        } else if (target === 'reviewed') {
          if (!s.includes('reviewed') && !s.includes('approved')) return false;
        } else if (target === 'submitted') {
          if (s !== 'submitted') return false;
        } else if (target === 'draft') {
          if (s !== 'draft' && !rep.isDraft) return false;
        } else if (s !== target) {
          return false;
        }
      }

      // 3. Date filter
      if (selectedDate !== 'All' && rep.reportDate !== selectedDate) {
        return false;
      }

      // 4. Search query (ID, Site Name, Location, Reporter)
      if (query) {
        const idMatch = rep.id.toLowerCase().includes(query);
        const siteMatch = rep.siteName.toLowerCase().includes(query);
        const locMatch = (rep.siteLocation || '').toLowerCase().includes(query);
        const authorMatch = (rep.submittedBy || '').toLowerCase().includes(query);
        if (!idMatch && !siteMatch && !locMatch && !authorMatch) {
          return false;
        }
      }

      return true;
    });

    // Sorting: Newest vs Oldest
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.reportDate).getTime();
      const dateB = new Date(b.createdAt || b.reportDate).getTime();
      return sortBy === 'OLDEST' ? dateA - dateB : dateB - dateA;
    });
  }, [reports, searchQuery, selectedProject, selectedStatus, selectedDate, sortBy]);

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else if (onOpenNewReport) {
      onOpenNewReport();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProject('All');
    setSelectedStatus('All');
    setSelectedDate('All');
    setSortBy('NEWEST');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedProject !== 'All' ||
    selectedStatus !== 'All' ||
    selectedDate !== 'All' ||
    sortBy !== 'NEWEST';

  return (
    <View className="w-full">
      {/* Top Bar: Back Action & New Report Shortcut */}
      <View className="flex-row items-center justify-between mb-3 px-0.5">
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="flex-row items-center bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl"
        >
          <Feather name="arrow-left" size={14} color="#172B4D" />
          <Text className="text-xs font-bold text-[#172B4D] ml-1.5">
            Back to New Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenNewReport}
          activeOpacity={0.7}
          className="flex-row items-center bg-orange-500 py-1.5 px-3 rounded-xl shadow-xs"
        >
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-xs font-bold text-white ml-1">
            Submit Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vault Title & Live Stat Badges */}
      <View className="bg-slate-50 border border-slate-200 rounded-3xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-[#172B4D] items-center justify-center mr-2.5">
              <Feather name="archive" size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-base font-black text-[#172B4D]">
                Report Vault
              </Text>
              <Text className="text-[10px] text-slate-400 font-semibold">
                Central Site Audits & Technical Documentation
              </Text>
            </View>
          </View>

          <View className="bg-[#172B4D] px-2.5 py-1 rounded-full">
            <Text className="text-[10px] font-black text-white">
              {stats.total} Total
            </Text>
          </View>
        </View>

        {/* Quick Filter Counts */}
        <View className="flex-row items-center justify-between pt-2.5 border-t border-slate-200/80">
          <TouchableOpacity
            onPress={() => setSelectedStatus('Reviewed')}
            className="flex-row items-center"
          >
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            <Text className="text-[11px] font-bold text-slate-600">
              {stats.reviewed} Reviewed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedStatus('Pending Review')}
            className="flex-row items-center"
          >
            <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            <Text className="text-[11px] font-bold text-slate-600">
              {stats.pending} Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedStatus('Submitted')}
            className="flex-row items-center"
          >
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
            <Text className="text-[11px] font-bold text-slate-600">
              {stats.submitted} Submitted
            </Text>
          </TouchableOpacity>

          {stats.drafts > 0 ? (
            <TouchableOpacity
              onPress={() => setSelectedStatus('Draft')}
              className="flex-row items-center"
            >
              <View className="w-2 h-2 rounded-full bg-violet-500 mr-1.5" />
              <Text className="text-[11px] font-bold text-violet-700">
                {stats.drafts} Drafts
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 1. Search Bar */}
      <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center mb-3">
        <Feather name="search" size={16} color="#94A3B8" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by Report ID, project, site location, or reporter..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-2.5 text-xs text-[#172B4D] font-medium"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={15} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 2. Status Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2.5 max-h-9"
      >
        {REPORT_STATUS_OPTIONS.map((st) => {
          const isSelected = selectedStatus === st;
          return (
            <TouchableOpacity
              key={st}
              onPress={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl border mr-2 items-center justify-center ${
                isSelected
                  ? 'bg-[#172B4D] border-[#172B4D]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-white' : 'text-slate-600'
                }`}
              >
                {st}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Project Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2.5 max-h-9"
      >
        <TouchableOpacity
          onPress={() => setSelectedProject('All')}
          className={`px-3 py-1.5 rounded-xl border mr-2 items-center justify-center ${
            selectedProject === 'All'
              ? 'bg-orange-500 border-orange-500'
              : 'bg-white border-slate-200'
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              selectedProject === 'All' ? 'text-white' : 'text-slate-600'
            }`}
          >
            All Projects
          </Text>
        </TouchableOpacity>

        {CONSTRUCTION_PROJECTS.map((proj) => {
          const isSelected = selectedProject === proj;
          return (
            <TouchableOpacity
              key={proj}
              onPress={() => setSelectedProject(proj)}
              className={`px-3 py-1.5 rounded-xl border mr-2 items-center justify-center ${
                isSelected
                  ? 'bg-orange-500 border-orange-500'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-white' : 'text-slate-600'
                }`}
              >
                {proj}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. Date & Sort By Controls Row */}
      <View className="flex-row items-center justify-between mb-3 px-0.5">
        {/* Sort By Toggle */}
        <View className="flex-row items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <TouchableOpacity
            onPress={() => setSortBy('NEWEST')}
            className={`px-2.5 py-1 rounded-lg ${
              sortBy === 'NEWEST' ? 'bg-white shadow-xs' : ''
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                sortBy === 'NEWEST' ? 'text-[#172B4D]' : 'text-slate-500'
              }`}
            >
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortBy('OLDEST')}
            className={`px-2.5 py-1 rounded-lg ${
              sortBy === 'OLDEST' ? 'bg-white shadow-xs' : ''
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                sortBy === 'OLDEST' ? 'text-[#172B4D]' : 'text-slate-500'
              }`}
            >
              Oldest
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Selector or Reset Button */}
        {hasActiveFilters ? (
          <TouchableOpacity
            onPress={handleResetFilters}
            className="flex-row items-center"
          >
            <Feather name="rotate-ccw" size={11} color="#EA580C" />
            <Text className="text-[11px] font-bold text-orange-600 ml-1">
              Reset Filters
            </Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-[11px] font-bold text-slate-400">
            Showing {filteredReports.length} {filteredReports.length === 1 ? 'record' : 'records'}
          </Text>
        )}
      </View>

      {/* Date Filter Chips (if more than 1 date exists) */}
      {availableDates.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3 max-h-8"
        >
          <TouchableOpacity
            onPress={() => setSelectedDate('All')}
            className={`px-2.5 py-1 rounded-lg border mr-2 items-center justify-center ${
              selectedDate === 'All'
                ? 'bg-slate-700 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-[10px] font-bold ${
                selectedDate === 'All' ? 'text-white' : 'text-slate-500'
              }`}
            >
              All Dates
            </Text>
          </TouchableOpacity>

          {availableDates.map((dt) => (
            <TouchableOpacity
              key={dt}
              onPress={() => setSelectedDate(dt)}
              className={`px-2.5 py-1 rounded-lg border mr-2 items-center justify-center ${
                selectedDate === dt
                  ? 'bg-orange-600 border-orange-600'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  selectedDate === dt ? 'text-white' : 'text-slate-500'
                }`}
              >
                {dt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      {/* Reports Card List */}
      <View className="w-full">
        {isLoading ? (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-8 items-center justify-center mt-1">
            <ActivityIndicator size="small" color="#172B4D" className="mb-3" />
            <Text className="text-xs font-bold text-slate-700">
              Loading Report Vault...
            </Text>
            <Text className="text-[11px] text-slate-400 mt-1">
              Synchronizing verified construction field records
            </Text>
          </View>
        ) : error ? (
          <View className="bg-rose-50 border border-rose-200 rounded-3xl p-6 items-center justify-center mt-1">
            <Feather name="alert-triangle" size={24} color="#E11D48" className="mb-2" />
            <Text className="text-sm font-bold text-rose-800 mb-1">
              Unable to load reports
            </Text>
            <Text className="text-xs text-rose-600 text-center mb-3">
              {error}
            </Text>
            {onRetry ? (
              <TouchableOpacity
                onPress={onRetry}
                className="bg-rose-600 px-4 py-2 rounded-xl flex-row items-center"
              >
                <Feather name="refresh-cw" size={13} color="#FFFFFF" />
                <Text className="text-white text-xs font-bold ml-1.5">
                  Retry
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : reports.length === 0 ? (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-8 items-center justify-center mt-1">
            <View className="w-12 h-12 rounded-2xl bg-white border border-slate-200 items-center justify-center mb-3">
              <Feather name="archive" size={22} color="#94A3B8" />
            </View>
            <Text className="text-sm font-bold text-[#172B4D] mb-1">
              No reports available yet
            </Text>
            <Text className="text-xs text-slate-500 text-center font-medium max-w-[240px] leading-relaxed mb-4">
              Start documenting your site operations by submitting your first daily construction report.
            </Text>
            <TouchableOpacity
              onPress={onOpenNewReport}
              className="bg-orange-500 px-4 py-2.5 rounded-xl flex-row items-center shadow-xs"
            >
              <Feather name="plus-circle" size={15} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold ml-1.5">
                Create First Report
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredReports.length === 0 ? (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-8 items-center justify-center mt-1">
            <View className="w-12 h-12 rounded-2xl bg-white border border-slate-200 items-center justify-center mb-3">
              <Feather name="file-text" size={22} color="#94A3B8" />
            </View>
            <Text className="text-sm font-bold text-[#172B4D] mb-1">
              No matching site reports found
            </Text>
            <Text className="text-xs text-slate-500 text-center font-medium max-w-[240px] leading-relaxed mb-4">
              Try adjusting your search criteria, project filters, or reset active filters.
            </Text>
            <TouchableOpacity
              onPress={handleResetFilters}
              className="bg-[#172B4D] px-4 py-2.5 rounded-xl flex-row items-center shadow-xs"
            >
              <Feather name="rotate-ccw" size={14} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold ml-1.5">
                Reset Filters
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredReports.map((report) => {
            const isDraft =
              report.isDraft || (report.status || '').toLowerCase() === 'draft';
            const isReviewed =
              (report.status || '').toLowerCase() === 'reviewed' ||
              (report.status || '').toLowerCase() === 'approved';
            const isPending = (report.status || '').toLowerCase().includes('pending');

            const photosCount = report.images?.length || 0;
            const docsCount = report.documents?.length || 0;
            const tasksSummary = report.taskSummary || {
              total: report.tasks?.length || 0,
              completed:
                report.tasks?.filter((t) => t.status === 'COMPLETED').length || 0,
              inProgress:
                report.tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0,
              pending:
                report.tasks?.filter((t) => t.status === 'PENDING').length || 0,
            };

            return (
              <TouchableOpacity
                key={report.id}
                onPress={() => onInspectReport(report)}
                activeOpacity={0.8}
                className="bg-white rounded-3xl p-4.5 border border-slate-200 shadow-sm mb-3.5"
              >
                {/* Header: ID, Date, and Status Badge */}
                <View className="flex-row items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
                  <View className="flex-row items-center flex-1 mr-2">
                    <View
                      className={`w-8 h-8 rounded-xl items-center justify-center mr-2 ${
                        isDraft
                          ? 'bg-violet-100'
                          : isReviewed
                          ? 'bg-emerald-100'
                          : isPending
                          ? 'bg-amber-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <Feather
                        name={isDraft ? 'edit-2' : 'file-text'}
                        size={15}
                        color={
                          isDraft
                            ? '#7C3AED'
                            : isReviewed
                            ? '#059669'
                            : isPending
                            ? '#D97706'
                            : '#2563EB'
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-black text-[#172B4D]">
                        {report.id}
                      </Text>
                      <Text className="text-[10px] text-slate-400 font-medium">
                        {report.reportDate}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`px-2.5 py-1 rounded-full border flex-row items-center ${
                      isDraft
                        ? 'bg-violet-50 border-violet-200'
                        : isReviewed
                        ? 'bg-emerald-50 border-emerald-200'
                        : isPending
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <View
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        isDraft
                          ? 'bg-violet-500'
                          : isReviewed
                          ? 'bg-emerald-500'
                          : isPending
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <Text
                      className={`text-[10px] font-bold ${
                        isDraft
                          ? 'text-violet-700'
                          : isReviewed
                          ? 'text-emerald-700'
                          : isPending
                          ? 'text-amber-800'
                          : 'text-blue-700'
                      }`}
                    >
                      {report.status}
                    </Text>
                  </View>
                </View>

                {/* Project / Site Name */}
                <Text className="text-base font-black text-[#172B4D] mb-1">
                  {report.siteName}
                </Text>

                {/* Site Location */}
                <View className="flex-row items-center mb-2.5">
                  <Feather name="map-pin" size={12} color="#F97316" />
                  <Text
                    numberOfLines={1}
                    className="text-xs text-slate-500 font-medium ml-1.5 flex-1"
                  >
                    {report.siteLocation}
                  </Text>
                </View>

                {/* Reporter Metadata */}
                <View className="flex-row items-center bg-slate-50 rounded-xl px-2.5 py-1.5 mb-3">
                  <Feather name="user" size={12} color="#64748B" />
                  <Text
                    numberOfLines={1}
                    className="text-[11px] text-slate-600 font-semibold ml-1.5 flex-1"
                  >
                    {report.submittedBy}
                  </Text>
                </View>

                {/* Task Completion Bar */}
                <View className="mb-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-[11px] font-bold text-slate-500">
                      Task Progress
                    </Text>
                    <Text className="text-xs font-black text-orange-600">
                      {report.completionPercentage}%
                    </Text>
                  </View>
                  <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${report.completionPercentage}%` }}
                    />
                  </View>
                </View>

                {/* Tasks & Attachments Counts Footer */}
                <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
                  {/* Task summary */}
                  <View className="flex-row items-center">
                    <View className="bg-slate-100 px-2 py-0.5 rounded-md mr-1.5">
                      <Text className="text-[10px] font-bold text-slate-700">
                        {tasksSummary.completed}/{tasksSummary.total} Done
                      </Text>
                    </View>
                    {tasksSummary.inProgress > 0 ? (
                      <View className="bg-amber-100 px-2 py-0.5 rounded-md">
                        <Text className="text-[10px] font-bold text-amber-800">
                          {tasksSummary.inProgress} Active
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Photographs & Documents Badges */}
                  <View className="flex-row items-center space-x-1.5">
                    {photosCount > 0 ? (
                      <View className="flex-row items-center bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md mr-1.5">
                        <Feather name="camera" size={10} color="#F97316" />
                        <Text className="text-[10px] font-bold text-orange-700 ml-1">
                          {photosCount}
                        </Text>
                      </View>
                    ) : null}

                    {docsCount > 0 ? (
                      <View className="flex-row items-center bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mr-1.5">
                        <Feather name="file" size={10} color="#2563EB" />
                        <Text className="text-[10px] font-bold text-blue-700 ml-1">
                          {docsCount}
                        </Text>
                      </View>
                    ) : null}

                    <Feather name="chevron-right" size={16} color="#94A3B8" />
                  </View>
                </View>

                {/* Draft Quick Action Buttons */}
                {isDraft ? (
                  <View className="flex-row items-center pt-2.5 mt-2.5 border-t border-slate-100">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        if (onDeleteDraft) onDeleteDraft(report);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 mr-2 flex-row items-center"
                    >
                      <Feather name="trash-2" size={11} color="#E11D48" />
                      <Text className="text-[10px] font-bold text-rose-700 ml-1">
                        Delete
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        if (onEditDraft) onEditDraft(report);
                      }}
                      className="flex-1 py-1 rounded-lg bg-violet-600 flex-row items-center justify-center shadow-xs"
                    >
                      <Feather name="edit-3" size={11} color="#FFFFFF" />
                      <Text className="text-[10px] font-bold text-white ml-1">
                        Edit Draft Report
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}
