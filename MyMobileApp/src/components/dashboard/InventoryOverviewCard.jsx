import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

/**
 * Section 5: Inventory Overview
 * Displays total items, available stock, low-stock, and out-of-stock items.
 */
export default function InventoryOverviewCard({
  inventory,
  onNavigateToInventory,
}) {
  const {
    totalItems = 0,
    availableStock = 0,
    lowStock = 0,
    outOfStock = 0,
    categoriesCount = 0,
    lastUpdated = 'Recently',
  } = inventory || {};

  const handleNavigate = () => {
    if (onNavigateToInventory) {
      onNavigateToInventory();
    } else {
      router.push('/(tabs)/inventory');
    }
  };

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
          Inventory & Stock
        </Text>
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#F97316] mr-1">
            Manage Stock
          </Text>
          <Feather name="arrow-right" size={13} color="#F97316" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        {/* Header: Title and Categories Info */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center mr-2">
              <Feather name="package" size={15} color="#172B4D" />
            </View>
            <View>
              <Text className="text-xs font-bold text-[#172B4D]">
                Warehouse & Site Stock
              </Text>
              <Text className="text-[11px] text-slate-400 font-medium">
                {categoriesCount} material categories • Updated {lastUpdated}
              </Text>
            </View>
          </View>
        </View>

        {/* 4 Metric Columns in clean grid */}
        <View className="flex-row items-center justify-between py-2.5 bg-slate-50/70 rounded-lg border border-slate-100 px-2.5 mb-3">
          {/* Total Items */}
          <View className="items-center flex-1">
            <Text className="text-base font-black text-[#172B4D]">
              {totalItems}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Total Units
            </Text>
          </View>

          <View className="w-[1px] h-6 bg-slate-200" />

          {/* Available Stock */}
          <View className="items-center flex-1">
            <Text className="text-base font-black text-emerald-700">
              {availableStock}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Available
            </Text>
          </View>

          <View className="w-[1px] h-6 bg-slate-200" />

          {/* Low Stock */}
          <View className="items-center flex-1">
            <Text className="text-base font-black text-amber-600">
              {lowStock}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Low Stock
            </Text>
          </View>

          <View className="w-[1px] h-6 bg-slate-200" />

          {/* Out of Stock */}
          <View className="items-center flex-1">
            <Text className="text-base font-black text-red-600">
              {outOfStock}
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Out of Stock
            </Text>
          </View>
        </View>

        {/* Low Stock Warning Alert if any */}
        {(lowStock > 0 || outOfStock > 0) && (
          <View className="flex-row items-center bg-amber-50/70 border border-amber-200 px-3 py-2 rounded-lg mb-3">
            <Feather name="alert-triangle" size={14} color="#D97706" />
            <Text className="text-[11px] text-amber-800 font-medium ml-2 flex-1">
              {outOfStock > 0
                ? `${outOfStock} items out of stock and ${lowStock} running low.`
                : `${lowStock} items currently below reorder threshold.`}
            </Text>
          </View>
        )}

        {/* Link Button to Inventory Screen */}
        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.7}
          className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-lg flex-row items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="View full inventory screen"
        >
          <Feather name="box" size={14} color="#172B4D" />
          <Text className="text-xs font-bold text-[#172B4D] ml-2">
            Open Materials & Inventory
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
