import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getStockStatus } from '../../services/inventoryService';

export default function InventoryItemCard({
  item,
  onPress,
  onRecordUsage,
}) {
  const {
    id,
    name,
    category,
    unit,
    availableQuantity = 0,
    minStockLevel = 0,
    openingQuantity = 0,
    receivedQuantity = 0,
    usedQuantity = 0,
    project,
    location,
  } = item;

  const statusConfig = getStockStatus(availableQuantity, minStockLevel);
  const totalCapacity = (openingQuantity || 0) + (receivedQuantity || 0);
  const stockRatio = totalCapacity > 0 ? Math.min(1, availableQuantity / totalCapacity) : 0;
  const stockPercentage = Math.round(stockRatio * 100);

  const isOutOfStock = statusConfig.status === 'OUT_OF_STOCK';
  const isLowStock = statusConfig.status === 'LOW_STOCK';

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3"
    >
      {/* Top Header: Material Name, ID & Status Badge */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center mb-0.5">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1.5">
              {id}
            </Text>
            <View className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              <Text className="text-[9px] font-bold text-slate-600">
                {category}
              </Text>
            </View>
          </View>
          <Text className="text-sm font-bold text-[#172B4D] leading-snug">
            {name}
          </Text>
        </View>

        {/* Stock Status Pill */}
        <View
          className={`flex-row items-center px-2 py-0.5 rounded-full border ${statusConfig.badgeBg} ${statusConfig.badgeBorder}`}
        >
          <View className={`w-1.5 h-1.5 rounded-full mr-1 ${statusConfig.dotColor}`} />
          <Text className={`text-[10px] font-bold ${statusConfig.badgeText}`}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Stock Quantities 3-Column Summary */}
      <View className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 my-1.5 flex-row items-center justify-between">
        {/* Available Stock */}
        <View className="flex-1 mr-1">
          <Text className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">
            Available Stock
          </Text>
          <Text
            className={`text-sm font-black ${
              isOutOfStock
                ? 'text-red-600'
                : isLowStock
                ? 'text-amber-600'
                : 'text-emerald-700'
            }`}
          >
            {availableQuantity} <Text className="text-[10px] font-medium text-slate-500">{unit}</Text>
          </Text>
        </View>

        <View className="w-[1px] h-6 bg-slate-200 mr-2" />

        {/* Min Level Threshold */}
        <View className="flex-1 mr-1">
          <Text className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">
            Min. Level
          </Text>
          <Text className="text-xs font-bold text-slate-700">
            {minStockLevel} <Text className="text-[9px] font-normal text-slate-400">{unit}</Text>
          </Text>
        </View>

        <View className="w-[1px] h-6 bg-slate-200 mr-2" />

        {/* Total Used */}
        <View className="flex-1">
          <Text className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">
            Total Used
          </Text>
          <Text className="text-xs font-bold text-slate-700">
            {usedQuantity} <Text className="text-[9px] font-normal text-slate-400">{unit}</Text>
          </Text>
        </View>
      </View>

      {/* Capacity Progress Bar */}
      <View className="mt-1 mb-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[9px] text-slate-400 font-medium">
            Stock Capacity
          </Text>
          <Text className="text-[9px] font-bold text-slate-500">
            {stockPercentage}% Remaining
          </Text>
        </View>
        <View className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <View
            style={{ width: `${stockPercentage}%` }}
            className={`h-full rounded-full ${
              isOutOfStock
                ? 'bg-red-500'
                : isLowStock
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
          />
        </View>
      </View>

      {/* Location, Project & Quick Usage Button */}
      <View className="pt-2 border-t border-slate-100 flex-row items-center justify-between">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center">
            <Feather name="map-pin" size={11} color="#64748B" />
            <Text className="text-[10px] text-slate-600 font-medium ml-1 flex-1" numberOfLines={1}>
              {project}
            </Text>
          </View>
          {Boolean(location) && (
            <Text className="text-[9px] text-slate-400 font-normal ml-3.5" numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity
          onPress={() => onRecordUsage(item)}
          disabled={isOutOfStock}
          activeOpacity={0.7}
          className={`flex-row items-center px-2.5 py-1.5 rounded-lg border ${
            isOutOfStock
              ? 'bg-slate-100 border-slate-200 opacity-60'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          <Feather
            name="minus-circle"
            size={12}
            color={isOutOfStock ? '#94A3B8' : '#F97316'}
          />
          <Text
            className={`text-[10px] font-bold ml-1 ${
              isOutOfStock ? 'text-slate-400' : 'text-[#F97316]'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Record Usage'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
