import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Inventory Dashboard Summary
 * Displays 4 minimal stat cards:
 * - Total Items
 * - Available Stock (In Stock)
 * - Low Stock Items
 * - Out of Stock Items
 * Plus an urgent stock replenishment alert and Record Usage CTA.
 */
export default function InventoryDashboard({
  metrics,
  onOpenRecordModal,
  activeStatusFilter,
  onSelectStatusFilter,
}) {
  const {
    totalItems = 0,
    availableCount = 0,
    lowStockCount = 0,
    outOfStockCount = 0,
  } = metrics || {};

  const totalAlertItems = lowStockCount + outOfStockCount;

  return (
    <View className="mb-4">
      {/* 4 Minimal Statistic Cards */}
      <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3">
        <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-slate-100">
          {/* Total Inventory Items */}
          <TouchableOpacity
            onPress={() => onSelectStatusFilter('All')}
            activeOpacity={0.7}
            className={`items-center flex-1 py-1 rounded-xl ${
              activeStatusFilter === 'All' ? 'bg-slate-50 border border-slate-200' : ''
            }`}
          >
            <Text className="text-xl font-black text-[#172B4D]">
              {totalItems}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Total Items
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Available / In Stock */}
          <TouchableOpacity
            onPress={() => onSelectStatusFilter('AVAILABLE')}
            activeOpacity={0.7}
            className={`items-center flex-1 py-1 rounded-xl ${
              activeStatusFilter === 'AVAILABLE' ? 'bg-emerald-50/60 border border-emerald-200' : ''
            }`}
          >
            <Text className="text-xl font-black text-emerald-600">
              {availableCount}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              In Stock
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Low Stock Items */}
          <TouchableOpacity
            onPress={() => onSelectStatusFilter('LOW_STOCK')}
            activeOpacity={0.7}
            className={`items-center flex-1 py-1 rounded-xl ${
              activeStatusFilter === 'LOW_STOCK' ? 'bg-amber-50/60 border border-amber-200' : ''
            }`}
          >
            <View className="flex-row items-center">
              <Text className="text-xl font-black text-amber-600">
                {lowStockCount}
              </Text>
              {lowStockCount > 0 && (
                <View className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1" />
              )}
            </View>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Low Stock
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-8 bg-slate-200" />

          {/* Out of Stock Items */}
          <TouchableOpacity
            onPress={() => onSelectStatusFilter('OUT_OF_STOCK')}
            activeOpacity={0.7}
            className={`items-center flex-1 py-1 rounded-xl ${
              activeStatusFilter === 'OUT_OF_STOCK' ? 'bg-red-50/60 border border-red-200' : ''
            }`}
          >
            <View className="flex-row items-center">
              <Text className="text-xl font-black text-red-600">
                {outOfStockCount}
              </Text>
              {outOfStockCount > 0 && (
                <View className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1" />
              )}
            </View>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5 text-center">
              Out of Stock
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stock Replenishment Notice */}
        {totalAlertItems > 0 ? (
          <View className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <Feather name="alert-triangle" size={13} color="#D97706" />
              <Text className="text-[10px] font-bold text-amber-900 ml-1.5 flex-1" numberOfLines={1}>
                {outOfStockCount > 0 ? `${outOfStockCount} Out of Stock` : ''}
                {outOfStockCount > 0 && lowStockCount > 0 ? ', ' : ''}
                {lowStockCount > 0 ? `${lowStockCount} Low Stock items` : ''} require reordering.
              </Text>
            </View>
            <Text className="text-[9px] font-bold text-amber-700 uppercase">
              Action Req.
            </Text>
          </View>
        ) : (
          <View className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex-row items-center">
            <Feather name="check-circle" size={13} color="#10B981" />
            <Text className="text-[10px] font-bold text-emerald-800 ml-1.5">
              All inventory levels are healthy across project sites.
            </Text>
          </View>
        )}
      </View>

      {/* Record Material Usage Primary Action Button */}
      <TouchableOpacity
        onPress={onOpenRecordModal}
        activeOpacity={0.8}
        className="w-full bg-[#F97316] rounded-xl py-3.5 flex-row items-center justify-center shadow-sm"
        accessibilityRole="button"
        accessibilityLabel="Record Material Usage"
      >
        <Feather name="minus-circle" size={16} color="#FFFFFF" />
        <Text className="text-xs font-black text-white uppercase tracking-wider ml-2">
          Record Material Usage
        </Text>
      </TouchableOpacity>
    </View>
  );
}
