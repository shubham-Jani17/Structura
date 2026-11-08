import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinkingContext, NavigationContext } from '@react-navigation/native';
import { reportService } from '../../services/reportService';
import ReportForm from '../../components/reports/ReportForm';
import ReportVault from '../../components/reports/ReportVault';
import ReportDetailModal from '../../components/reports/ReportDetailModal';
import ReportConfirmationModal from '../../components/reports/ReportConfirmationModal';
import EditDraftModal from '../../components/reports/EditDraftModal';
import DeleteDraftModal from '../../components/reports/DeleteDraftModal';

/**
 * SafeLinkingProvider
 * Shields the Report Vault and Report module from missing LinkingContext exceptions
 * by providing an authoritative fallback linking context if one is not supplied.
 */
function SafeLinkingProvider({ children }) {
  const parentLinking = useContext(LinkingContext);

  const safeLinkingValue = useMemo(() => {
    try {
      if (parentLinking && parentLinking.options) {
        return parentLinking;
      }
    } catch {
      // Default LinkingContext throws when options is accessed
    }

    return {
      options: {
        prefixes: [],
        config: { screens: {} },
      },
    };
  }, [parentLinking]);

  return (
    <LinkingContext.Provider value={safeLinkingValue}>
      {children}
    </LinkingContext.Provider>
  );
}

/**
 * Structura MAD - Site Report Management Screen
 *
 * Full-screen layout matching Dashboard, Attendance, and Inventory:
 * - Direct navigation prop resolution preventing LinkingContext / undefined errors
 * - Single authoritative vertical ScrollView with 16px horizontal margins
 * - Pull-to-refresh synchronization
 * - Sub-tab switching between 'New Site Report' and 'Report Vault'
 * - Clean elevation clear of the fixed bottom navigation bar
 */
export default function ReportsScreen(props) {
  const { navigation, route } = props || {};
  const insets = useSafeAreaInsets();
  const contextNav = useContext(NavigationContext);
  const nav = navigation || contextNav;

  // Active sub-tab: 'NEW' or 'HISTORY' (defaults to route params if specified)
  const [activeTab, setActiveTab] = useState(() => {
    const targetTab = route?.params?.tab || route?.params?.screen;
    return targetTab === 'vault' || targetTab === 'HISTORY' || targetTab === 'history'
      ? 'HISTORY'
      : 'NEW';
  });

  // Synchronize tab state with navigation focus events
  useEffect(() => {
    if (!nav?.addListener) return;
    const unsubscribe = nav.addListener('focus', () => {
      const targetTab = route?.params?.tab || route?.params?.screen;
      if (
        targetTab === 'vault' ||
        targetTab === 'HISTORY' ||
        targetTab === 'history'
      ) {
        setActiveTab('HISTORY');
      } else if (targetTab === 'new' || targetTab === 'NEW') {
        setActiveTab('NEW');
      }
    });
    return unsubscribe;
  }, [nav, route?.params]);

  // Reports collection
  const [reports, setReports] = useState(() => reportService.getReports());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [inspectingReport, setInspectingReport] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [editingDraftReport, setEditingDraftReport] = useState(null);
  const [deletingDraftReport, setDeletingDraftReport] = useState(null);

  // Subscribe to real-time reportService updates
  useEffect(() => {
    const unsubscribe = reportService.subscribe((updatedReports) => {
      setReports([...updatedReports]);
    });
    return unsubscribe;
  }, []);

  // Pull-to-refresh handler (matches Dashboard, Attendance, and Inventory)
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setReports(reportService.getReports());
      setIsRefreshing(false);
    }, 400);
  }, []);

  // Handle report submission
  const handleSubmitReport = async (reportData) => {
    const created = await reportService.submitReport(reportData);
    setReports(reportService.getReports());
    setSubmittedReport(created);
  };

  const handleViewInHistory = () => {
    if (submittedReport) {
      setInspectingReport(submittedReport);
    }
    setSubmittedReport(null);
    setActiveTab('HISTORY');
  };

  // Draft operations
  const handleSaveDraftChanges = async (reportId, updatedData) => {
    await reportService.updateReport(reportId, updatedData);
    setEditingDraftReport(null);
  };

  const handleSubmitDraftAsOfficial = async (reportId, updatedData) => {
    const finalized = await reportService.updateReport(reportId, {
      ...updatedData,
      submitAsOfficial: true,
    });
    setEditingDraftReport(null);
    setSubmittedReport(finalized);
  };

  const handleConfirmDeleteDraft = (reportId) => {
    reportService.deleteReport(reportId);
    setDeletingDraftReport(null);
  };

  // Safe navigation back from Report Vault to Form or previous screen
  const handleNavigateBack = useCallback(() => {
    if (activeTab === 'HISTORY') {
      setActiveTab('NEW');
    } else if (nav?.canGoBack && nav.canGoBack()) {
      nav.goBack();
    } else if (nav?.navigate) {
      nav.navigate('index');
    }
  }, [activeTab, nav]);

  // Safe vertical padding calculations (identical to Dashboard, Attendance, and Inventory)
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 12 : 16);
  // Bottom padding ensures comfortable scrolling clear of the fixed bottom navigation bar
  const bottomInset = Math.max(insets.bottom, 12) + 76;

  return (
    <SafeLinkingProvider>
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
          {/* Screen Header */}
          <View className="mb-3.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Structura Operations
                </Text>
                <Text className="text-xl font-black text-[#172B4D] tracking-tight">
                  Site Report Management
                </Text>
              </View>

              <View className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 items-center justify-center">
                <Feather name="file-text" size={20} color="#F97316" />
              </View>
            </View>
          </View>

          {/* Segmented Sub-Tab Switcher: 'New Site Report' vs 'Report Vault' */}
          <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200">
            <TouchableOpacity
              onPress={() => setActiveTab('NEW')}
              activeOpacity={0.8}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${
                activeTab === 'NEW'
                  ? 'bg-white shadow-sm border border-slate-200'
                  : ''
              }`}
            >
              <Feather
                name="edit-3"
                size={14}
                color={activeTab === 'NEW' ? '#F97316' : '#64748B'}
              />
              <Text
                className={`text-xs font-bold ml-1.5 ${
                  activeTab === 'NEW' ? 'text-[#172B4D]' : 'text-slate-500'
                }`}
              >
                New Site Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('HISTORY')}
              activeOpacity={0.8}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${
                activeTab === 'HISTORY'
                  ? 'bg-white shadow-sm border border-slate-200'
                  : ''
              }`}
            >
              <Feather
                name="archive"
                size={14}
                color={activeTab === 'HISTORY' ? '#2563EB' : '#64748B'}
              />
              <Text
                className={`text-xs font-bold ml-1.5 ${
                  activeTab === 'HISTORY' ? 'text-[#172B4D]' : 'text-slate-500'
                }`}
              >
                Report Vault
              </Text>
              <View
                className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                  activeTab === 'HISTORY' ? 'bg-blue-100' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-[9px] font-bold ${
                    activeTab === 'HISTORY' ? 'text-blue-700' : 'text-slate-600'
                  }`}
                >
                  {reports.length}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sub-Tab Content */}
          {activeTab === 'NEW' ? (
            <ReportForm
              onSubmitReport={handleSubmitReport}
              onSaveDraft={async (draftData) => {
                await reportService.saveDraft(draftData);
                setActiveTab('HISTORY');
              }}
              onCancel={() => setActiveTab('HISTORY')}
            />
          ) : (
            <ReportVault
              reports={reports}
              isLoading={false}
              error={null}
              onRetry={handleRefresh}
              onInspectReport={(rep) => setInspectingReport(rep)}
              onOpenNewReport={() => setActiveTab('NEW')}
              onNavigateBack={handleNavigateBack}
              onEditDraft={(rep) => setEditingDraftReport(rep)}
              onDeleteDraft={(rep) => setDeletingDraftReport(rep)}
              navigation={nav}
            />
          )}
        </ScrollView>

        {/* Interactive Modals */}
        <ReportConfirmationModal
          visible={!!submittedReport}
          report={submittedReport}
          onViewHistory={handleViewInHistory}
          onClose={() => setSubmittedReport(null)}
        />

        <ReportDetailModal
          visible={!!inspectingReport}
          report={inspectingReport}
          onClose={() => setInspectingReport(null)}
          onEditDraft={(rep) => setEditingDraftReport(rep)}
          onDeleteDraft={(rep) => setDeletingDraftReport(rep)}
        />

        <EditDraftModal
          visible={!!editingDraftReport}
          report={editingDraftReport}
          onSaveDraft={handleSaveDraftChanges}
          onSubmitOfficial={handleSubmitDraftAsOfficial}
          onClose={() => setEditingDraftReport(null)}
        />

        <DeleteDraftModal
          visible={!!deletingDraftReport}
          report={deletingDraftReport}
          onConfirmDelete={handleConfirmDeleteDraft}
          onClose={() => setDeletingDraftReport(null)}
        />
      </View>
    </SafeLinkingProvider>
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
