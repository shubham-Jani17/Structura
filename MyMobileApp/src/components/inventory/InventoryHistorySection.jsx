import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CONSTRUCTION_PROJECTS } from '../../services/inventoryService';

export default function InventoryHistorySection({
  transactions = [],
  selectedProject = 'All',
  onSelectProject,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = transactions.filter((txn) => {
    if (selectedProject !== 'All' && txn.project !== selectedProject) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchMat = txn.materialName.toLowerCase().includes(q);
      const matchPurpose = txn.purpose.toLowerCase().includes(q);
      const matchWorker = txn.workerName.toLowerCase().includes(q);
      const matchId = txn.id.toLowerCase().includes(q);
      if (!matchMat && !matchPurpose && !matchWorker && !matchId) {
        return false;
      }
    }
    return true;
  });

  const formatTimestamp = (iso) => {
    if (!iso) return '--';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <View className="mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200 items-center justify-center mr-2">
            <Feather name="clock" size={13} color="#172B4D" />
          </View>
          <Text className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
            Stock Usage & Audit History
          </Text>
        </View>
        <Text className="text-[10px] text-slate-400 font-medium">
          {filteredHistory.length} {filteredHistory.length === 1 ? 'Entry' : 'Entries'}
        </Text>
      </View>

      {/* Project Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2"
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {['All', ...CONSTRUCTION_PROJECTS].map((proj) => {
          const isSelected = selectedProject === proj;
          return (
            <TouchableOpacity
              key={proj}
              onPress={() => onSelectProject(proj)}
              activeOpacity={0.7}
              className={`mr-1.5 px-2.5 py-1 rounded-lg border ${
                isSelected
                  ? 'bg-slate-900 border-slate-900'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  isSelected ? 'text-white' : 'text-slate-600'
                }`}
              >
                {proj}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* History Search Bar */}
      <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex-row items-center mb-3">
        <Feather name="search" size={13} color="#94A3B8" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter history by material, worker, purpose..."
          placeholderTextColor="#94A3B8"
          className="flex-1 text-[11px] text-[#172B4D] ml-2 p-0"
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={13} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Transactions List */}
      <View className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
        {filteredHistory.length === 0 ? (
          <View className="py-6 items-center justify-center">
            <Feather name="inbox" size={24} color="#CBD5E1" />
            <Text className="text-xs text-slate-400 font-medium mt-1.5">
              No material usage transactions found.
            </Text>
          </View>
        ) : (
          filteredHistory.map((txn) => (
            <View
              key={txn.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2.5 last:mb-0"
            >
              {/* Header: Type, Material & Timestamp */}
              <View className="flex-row items-start justify-between mb-1.5">
                <View className="flex-1 mr-2">
                  <View className="flex-row items-center mb-0.5">
                    <View className="bg-orange-100 border border-orange-200 px-1.5 py-0.2 rounded mr-1.5">
                      <Text className="text-[9px] font-black text-[#F97316]">
                        {txn.type}
                      </Text>
                    </View>
                    <Text className="text-xs font-bold text-[#172B4D]" numberOfLines={1}>
                      {txn.materialName}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-slate-500 font-medium">
                    {txn.project}
                  </Text>
                </View>

                {/* Used Quantity */}
                <View className="items-end">
                  <Text className="text-xs font-black text-red-600">
                    - {txn.quantity} {txn.unit}
                  </Text>
                  <Text className="text-[9px] text-slate-400 font-medium">
                    {formatTimestamp(txn.timestamp)}
                  </Text>
                </View>
              </View>

              {/* Purpose Callout */}
              <Text className="text-[11px] text-slate-600 italic mb-2" numberOfLines={2}>
                {`"${txn.purpose}"`}
              </Text>

              {/* Footer: Worker Name & Remaining Stock */}
              <View className="pt-1.5 border-t border-slate-200/60 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="user" size={10} color="#64748B" />
                  <Text className="text-[9px] text-slate-500 font-medium ml-1">
                    {txn.workerName} ({txn.workerId})
                  </Text>
                </View>

                <Text className="text-[9px] font-bold text-slate-700">
                  Remaining: <Text className="font-black text-emerald-700">{txn.remainingStockAfter} {txn.unit}</Text>
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
