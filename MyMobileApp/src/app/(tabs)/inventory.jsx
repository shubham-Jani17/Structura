import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Inventory Service & Core Logic
import { inventoryService, getStockStatus } from '../../services/inventoryService';

// Modular Inventory Components
import InventoryDashboard from '../../components/inventory/InventoryDashboard';
import InventoryFilterBar from '../../components/inventory/InventoryFilterBar';
import InventoryItemCard from '../../components/inventory/InventoryItemCard';
import RecordUsageModal from '../../components/inventory/RecordUsageModal';
import InventoryDetailModal from '../../components/inventory/InventoryDetailModal';
import InventoryHistorySection from '../../components/inventory/InventoryHistorySection';

/**
 * Structura MAD - Construction Inventory Tracking & Stock Management Screen
 *
 * Requirements Met:
 * 1. Inventory Dashboard: Total items, in stock, low stock, out of stock cards.
 * 2. Inventory Registry List: Material name, category, available quantity, unit,
 *    minimum stock level, status badge, location, project, capacity bar.
 * 3. Search & Filters: Real-time search, category scroll chips, stock status filter.
 * 4. Record Material Usage: Interactive usage deduction form with stock validation,
 *    instant automatic stock subtraction, transaction logging, and success confirmation.
 * 5. Remaining Stock Tracking: Formula Available = Opening + Received - Used.
 * 6. Material Deep-Dive Modal: 4-balance formula, threshold alert, material history.
 * 7. Transaction Audit History: Full log of material consumption by workers and projects.
 * 8. Responsive Design & Safe Area Spacing: Clean white/navy construction theme.
 */
export default function InventoryScreen() {
  const insets = useSafeAreaInsets();

  // Tab View state: 'MATERIALS' or 'HISTORY'
  const [activeTab, setActiveTab] = useState('MATERIALS');

  // Core Inventory State initialized from service
  const [items, setItems] = useState(() => inventoryService.getItems());
  const [metrics, setMetrics] = useState(() => inventoryService.getDashboardMetrics());
  const [transactions, setTransactions] = useState(() => inventoryService.getTransactionHistory());

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');

  // Modals State
  const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
  const [recordPreselectedItem, setRecordPreselectedItem] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered items computed dynamically from state
  const filteredItems = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedProject !== 'All' && item.project !== selectedProject) {
        return false;
      }
      if (selectedStatus !== 'All') {
        const itemStatus = getStockStatus(item.availableQuantity, item.minStockLevel).status;
        if (itemStatus !== selectedStatus) {
          return false;
        }
      }
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
  }, [items, searchQuery, selectedCategory, selectedStatus, selectedProject]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setItems([...inventoryService.getItems()]);
      setMetrics(inventoryService.getDashboardMetrics());
      setTransactions([...inventoryService.getTransactionHistory()]);
      setIsRefreshing(false);
    }, 500);
  }, []);

  // Open Record Usage Modal
  const handleOpenRecordUsage = (item = null) => {
    setRecordPreselectedItem(item);
    setIsRecordModalVisible(true);
  };

  // Submit Material Consumption
  const handleSubmitUsage = async (formValues) => {
    try {
      const result = await inventoryService.recordMaterialUsage({
        ...formValues,
        workerId: 'WRK-8924',
        workerName: 'Marcus Vance',
      });

      // Update state immediately
      setItems([...inventoryService.getItems()]);
      setMetrics(result.metrics);
      setTransactions([...inventoryService.getTransactionHistory()]);

      // If detail modal is open for this item, update it
      if (selectedDetailItem && selectedDetailItem.id === result.item.id) {
        setSelectedDetailItem(result.item);
      }

      Alert.alert(
        'Usage Recorded Successfully',
        `Deducted ${formValues.quantity} ${result.item.unit} of ${result.item.name}. New available balance: ${result.item.availableQuantity} ${result.item.unit}.`
      );
    } catch (err) {
      Alert.alert('Submission Blocked', err.message || 'Unable to record usage.');
      throw err;
    }
  };

  // Safe vertical padding
  const topInset = Math.max(insets.top, Platform.OS === 'ios' ? 12 : 16);
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
        {/* Screen Header */}
        <View className="mb-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Construction Site Inventory
              </Text>
              <Text className="text-xl font-black text-[#172B4D] tracking-tight">
                Materials & Stock Tracking
              </Text>
            </View>

            <View className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              <Text className="text-[10px] font-bold text-slate-700">
                Live Stock Sync
              </Text>
            </View>
          </View>
        </View>

        {/* Section 1: Inventory Dashboard Statistics */}
        <InventoryDashboard
          metrics={metrics}
          onOpenRecordModal={() => handleOpenRecordUsage(null)}
          activeStatusFilter={selectedStatus}
          onSelectStatusFilter={setSelectedStatus}
        />

        {/* Sub-Navigation Tabs: Materials vs Usage History */}
        <View className="flex-row items-center bg-slate-100 p-1 rounded-xl mb-3.5 border border-slate-200">
          <TouchableOpacity
            onPress={() => setActiveTab('MATERIALS')}
            activeOpacity={0.7}
            className={`flex-1 py-2 rounded-lg items-center justify-center ${
              activeTab === 'MATERIALS' ? 'bg-white shadow-xs border border-slate-200' : ''
            }`}
          >
            <View className="flex-row items-center">
              <Feather
                name="package"
                size={13}
                color={activeTab === 'MATERIALS' ? '#172B4D' : '#64748B'}
              />
              <Text
                className={`text-xs font-bold ml-1.5 ${
                  activeTab === 'MATERIALS' ? 'text-[#172B4D]' : 'text-slate-500'
                }`}
              >
                Materials Registry ({items.length})
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('HISTORY')}
            activeOpacity={0.7}
            className={`flex-1 py-2 rounded-lg items-center justify-center ${
              activeTab === 'HISTORY' ? 'bg-white shadow-xs border border-slate-200' : ''
            }`}
          >
            <View className="flex-row items-center">
              <Feather
                name="clock"
                size={13}
                color={activeTab === 'HISTORY' ? '#172B4D' : '#64748B'}
              />
              <Text
                className={`text-xs font-bold ml-1.5 ${
                  activeTab === 'HISTORY' ? 'text-[#172B4D]' : 'text-slate-500'
                }`}
              >
                Usage History ({transactions.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Materials Registry & Stock Management */}
        {activeTab === 'MATERIALS' && (
          <View>
            {/* Search & Category Filter Bar */}
            <InventoryFilterBar
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              projects={inventoryService.getProjects()}
            />

            {/* List Results Count Header */}
            <View className="flex-row items-center justify-between mb-2 px-0.5">
              <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Materials List ({filteredItems.length})
              </Text>
              {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                    setSelectedProject('All');
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-[10px] font-bold text-[#F97316]">
                    Reset Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Empty State */}
            {filteredItems.length === 0 ? (
              <View className="py-10 items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 mt-1">
                <Feather name="package" size={28} color="#94A3B8" />
                <Text className="text-sm font-bold text-slate-700 mt-2">
                  No materials match your filter
                </Text>
                <Text className="text-xs text-slate-400 font-medium text-center max-w-[240px] mt-1">
                  Try adjusting your search query, material category, or stock status filter.
                </Text>
              </View>
            ) : (
              filteredItems.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onPress={setSelectedDetailItem}
                  onRecordUsage={handleOpenRecordUsage}
                />
              ))
            )}
          </View>
        )}

        {/* Tab 2: Stock Usage & Audit History */}
        {activeTab === 'HISTORY' && (
          <InventoryHistorySection
            transactions={transactions}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        )}
      </ScrollView>

      {/* Record Usage Modal */}
      <RecordUsageModal
        visible={isRecordModalVisible}
        onClose={() => {
          setIsRecordModalVisible(false);
          setRecordPreselectedItem(null);
        }}
        onSubmit={handleSubmitUsage}
        items={items}
        preselectedItem={recordPreselectedItem}
      />

      {/* Material Detail Deep-Dive Modal */}
      <InventoryDetailModal
        visible={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
        item={selectedDetailItem}
        onRecordUsage={handleOpenRecordUsage}
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
