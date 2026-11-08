import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddInventoryModal({ visible, onClose, onAddInventory }) {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Structural Steel');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Units');

  const categories = [
    'Structural Steel',
    'Cement & Aggregates',
    'Lumber & Formwork',
    'Electrical & Cables',
    'Plumbing & Pipes',
  ];

  const handleSubmit = () => {
    if (!itemName.trim() || !quantity) return;

    const qtyNumber = parseInt(quantity, 10) || 100;

    const newItem = {
      id: `inv_${Date.now()}`,
      name: itemName.trim(),
      category,
      quantity: qtyNumber,
      unit,
      status: 'Available',
    };

    onAddInventory(newItem);
    setItemName('');
    setQuantity('');
    onClose();
  };

  const handleOpenInventory = () => {
    onClose();
    router.push('/(tabs)/inventory');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[85%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 items-center justify-center mr-2">
                  <Feather name="package" size={17} color="#D97706" />
                </View>
                <Text className="text-base font-bold text-[#172B4D]">
                  Add Inventory & Materials
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <Feather name="x" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Item Name */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1">
                  Material / Item Name *
                </Text>
                <TextInput
                  value={itemName}
                  onChangeText={setItemName}
                  placeholder="e.g. Grade 60 16mm Rebar"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                />
              </View>

              {/* Category Pills */}
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </Text>
                <View className="flex-row flex-wrap">
                  {categories.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        activeOpacity={0.7}
                        className={`mr-2 mb-2 px-3 py-1.5 rounded-lg border ${
                          isSelected
                            ? 'bg-[#172B4D] border-[#172B4D]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-[11px] font-semibold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Quantity & Unit Row */}
              <View className="flex-row justify-between mb-4">
                <View className="w-[58%]">
                  <Text className="text-xs font-semibold text-slate-700 mb-1">
                    Delivered Quantity *
                  </Text>
                  <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="e.g. 250"
                    keyboardType="numeric"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                  />
                </View>
                <View className="w-[38%]">
                  <Text className="text-xs font-semibold text-slate-700 mb-1">
                    Unit
                  </Text>
                  <TextInput
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="e.g. Tons / Bags"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#172B4D] font-medium"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                className="w-full bg-[#172B4D] rounded-xl py-3.5 items-center justify-center mb-2.5 shadow-sm"
              >
                <Text className="text-xs font-bold text-white uppercase tracking-wider">
                  Check-in Material to Yard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenInventory}
                activeOpacity={0.7}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 items-center justify-center"
              >
                <Text className="text-xs font-semibold text-[#172B4D]">
                  Open Full Inventory Screen
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
