import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getStockStatus, inventoryService } from '../../services/inventoryService';

export default function InventoryDetailModal({
  visible,
  onClose,
  item,
  onRecordUsage,
}) {
  if (!item) return null;

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
    supplier,
    unitPrice,
    lastUpdated,
  } = item;

  const statusConfig = getStockStatus(availableQuantity, minStockLevel);
  const isOutOfStock = statusConfig.status === 'OUT_OF_STOCK';
  const isLowStock = statusConfig.status === 'LOW_STOCK';
  const history = inventoryService.getItemHistory(id);

  const formattedUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[90%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <View className="flex-1 mr-2">
              <View className="flex-row items-center mb-0.5">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
                  {id}
                </Text>
                <View className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  <Text className="text-[9px] font-bold text-slate-600">
                    {category}
                  </Text>
                </View>
              </View>
              <Text className="text-base font-bold text-[#172B4D]" numberOfLines={1}>
                {name}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stock Status Badge Banner */}
            <View
              className={`p-3 rounded-xl border flex-row items-center justify-between mb-3.5 ${statusConfig.badgeBg} ${statusConfig.badgeBorder}`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View className={`w-2.5 h-2.5 rounded-full mr-2 ${statusConfig.dotColor}`} />
                <View className="flex-1">
                  <Text className={`text-xs font-black ${statusConfig.badgeText}`}>
                    {statusConfig.label}
                  </Text>
                  <Text className="text-[10px] text-slate-500 font-medium">
                    {isOutOfStock
                      ? 'Stock depleted. Issue replenishment PO immediately.'
                      : isLowStock
                      ? `Stock is below safety threshold (${minStockLevel} ${unit}).`
                      : 'Stock level is healthy and operating within threshold.'}
                  </Text>
                </View>
              </View>

              <Text className={`text-base font-black ${statusConfig.badgeText}`}>
                {availableQuantity} <Text className="text-[11px] font-medium">{unit}</Text>
              </Text>
            </View>

            {/* 4-Card Balance Formula Breakdown */}
            <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3.5">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Remaining Stock Formula
                </Text>
                <Text className="text-[9px] text-slate-400 font-medium">
                  Available = Opening + Received - Used
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                {/* Opening */}
                <View className="items-center flex-1">
                  <Text className="text-xs font-bold text-slate-700">
                    {openingQuantity}
                  </Text>
                  <Text className="text-[9px] text-slate-400 font-medium mt-0.5">
                    Opening
                  </Text>
                </View>

                <Text className="text-slate-300 font-bold">+</Text>

                {/* Received */}
                <View className="items-center flex-1">
                  <Text className="text-xs font-bold text-emerald-700">
                    {receivedQuantity}
                  </Text>
                  <Text className="text-[9px] text-slate-400 font-medium mt-0.5">
                    Received
                  </Text>
                </View>

                <Text className="text-slate-300 font-bold">-</Text>

                {/* Used */}
                <View className="items-center flex-1">
                  <Text className="text-xs font-bold text-red-600">
                    {usedQuantity}
                  </Text>
                  <Text className="text-[9px] text-slate-400 font-medium mt-0.5">
                    Used
                  </Text>
                </View>

                <Text className="text-slate-300 font-bold">=</Text>

                {/* Available */}
                <View className="items-center flex-1">
                  <Text className="text-sm font-black text-[#172B4D]">
                    {availableQuantity}
                  </Text>
                  <Text className="text-[9px] text-slate-500 font-bold mt-0.5">
                    Available
                  </Text>
                </View>
              </View>
            </View>

            {/* Material Attributes Grid */}
            <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3.5">
              <View className="flex-row items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                <Text className="text-xs font-semibold text-slate-500">Project / Site:</Text>
                <Text className="text-xs font-bold text-[#172B4D]">{project}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                <Text className="text-xs font-semibold text-slate-500">Yard Location:</Text>
                <Text className="text-xs font-semibold text-[#172B4D]">{location || 'Standard Depot'}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                <Text className="text-xs font-semibold text-slate-500">Min. Safety Stock:</Text>
                <Text className="text-xs font-bold text-[#172B4D]">{minStockLevel} {unit}</Text>
              </View>
              {Boolean(supplier) && (
                <View className="flex-row items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                  <Text className="text-xs font-semibold text-slate-500">Supplier Vendor:</Text>
                  <Text className="text-xs font-semibold text-[#172B4D]">{supplier}</Text>
                </View>
              )}
              {Boolean(unitPrice) && (
                <View className="flex-row items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                  <Text className="text-xs font-semibold text-slate-500">Unit Price:</Text>
                  <Text className="text-xs font-bold text-[#172B4D]">${unitPrice.toFixed(2)} / {unit}</Text>
                </View>
              )}
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold text-slate-500">Last Stock Update:</Text>
                <Text className="text-[10px] text-slate-400 font-medium">{formattedUpdated}</Text>
              </View>
            </View>

            {/* Material-Specific Recent Transactions */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Material Usage History
                </Text>
                <Text className="text-[10px] text-slate-400 font-medium">
                  {history.length} {history.length === 1 ? 'Record' : 'Records'}
                </Text>
              </View>

              {history.length === 0 ? (
                <View className="py-4 items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
                  <Text className="text-xs text-slate-400 font-medium">
                    No consumption logged for this material yet.
                  </Text>
                </View>
              ) : (
                history.map((txn) => (
                  <View
                    key={txn.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-2"
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center">
                        <View className="bg-red-100 px-1.5 py-0.2 rounded mr-1.5">
                          <Text className="text-[9px] font-bold text-red-700">USED</Text>
                        </View>
                        <Text className="text-xs font-bold text-[#172B4D]">
                          - {txn.quantity} {txn.unit}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-slate-400">
                        {new Date(txn.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-slate-600 italic mb-1" numberOfLines={2}>
                      {`"${txn.purpose}"`}
                    </Text>
                    <View className="flex-row items-center justify-between pt-1 border-t border-slate-200/50">
                      <Text className="text-[9px] text-slate-400">By: {txn.workerName}</Text>
                      <Text className="text-[9px] font-bold text-slate-600">
                        Balance after: {txn.remainingStockAfter} {txn.unit}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Quick Record Usage Action Button */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                onRecordUsage(item);
              }}
              disabled={isOutOfStock}
              activeOpacity={0.8}
              className={`w-full rounded-xl py-3.5 items-center justify-center shadow-sm ${
                isOutOfStock ? 'bg-slate-300' : 'bg-[#F97316]'
              }`}
            >
              <View className="flex-row items-center">
                <Feather name="minus-circle" size={16} color="#FFFFFF" />
                <Text className="text-xs font-black text-white uppercase tracking-wider ml-2">
                  {isOutOfStock ? 'Material Out of Stock' : 'Record Material Usage'}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
