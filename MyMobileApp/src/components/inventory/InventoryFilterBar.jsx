import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { INVENTORY_CATEGORIES } from '../../services/inventoryService';

export default function InventoryFilterBar({
  searchQuery,
  onChangeSearch,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedProject,
  onSelectProject,
  projects = [],
}) {
  const statusOptions = [
    { id: 'All', label: 'All Items' },
    { id: 'AVAILABLE', label: 'In Stock' },
    { id: 'LOW_STOCK', label: 'Low Stock' },
    { id: 'OUT_OF_STOCK', label: 'Out of Stock' },
  ];

  return (
    <View className="mb-3.5">
      {/* Search Input */}
      <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-row items-center mb-2.5">
        <Feather name="search" size={15} color="#94A3B8" />
        <TextInput
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholder="Search materials, codes, location, supplier..."
          placeholderTextColor="#94A3B8"
          className="flex-1 text-xs text-[#172B4D] ml-2 p-0"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity
            onPress={() => onChangeSearch('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={14} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
        className="mb-2"
      >
        {INVENTORY_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
              className={`mr-1.5 px-3 py-1.5 rounded-lg border ${
                isSelected
                  ? 'bg-[#172B4D] border-[#172B4D]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-[11px] font-bold ${
                  isSelected ? 'text-white' : 'text-slate-600'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Status Filter Chips Row */}
      <View className="flex-row items-center justify-between">
        {statusOptions.map((st) => {
          const isSelected = selectedStatus === st.id;
          return (
            <TouchableOpacity
              key={st.id}
              onPress={() => onSelectStatus(st.id)}
              activeOpacity={0.7}
              className={`flex-1 py-1 rounded-lg border mr-1 last:mr-0 items-center justify-center ${
                isSelected
                  ? 'bg-slate-900 border-slate-900'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  isSelected ? 'text-white' : 'text-slate-500'
                }`}
              >
                {st.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
