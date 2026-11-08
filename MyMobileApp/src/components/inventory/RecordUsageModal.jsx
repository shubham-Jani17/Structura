import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CONSTRUCTION_PROJECTS } from '../../services/inventoryService';

export default function RecordUsageModal({
  visible,
  onClose,
  onSubmit,
  items = [],
  preselectedItem = null,
}) {
  const [userSelectedItemId, setUserSelectedItemId] = useState(null);
  const [userSelectedProject, setUserSelectedProject] = useState(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Derive active item from user selection or preselected prop
  const currentItem = useMemo(() => {
    if (userSelectedItemId) {
      const found = items.find((i) => i.id === userSelectedItemId);
      if (found) return found;
    }
    if (preselectedItem) {
      return preselectedItem;
    }
    return items.find((i) => i.availableQuantity > 0) || items[0] || null;
  }, [userSelectedItemId, preselectedItem, items]);

  const selectedProject =
    userSelectedProject || currentItem?.project || CONSTRUCTION_PROJECTS[0];

  const parsedQty = parseFloat(quantityInput) || 0;
  const availableQty = currentItem?.availableQuantity || 0;
  const remainingPreview = Math.max(0, parseFloat((availableQty - parsedQty).toFixed(2)));
  const exceedsStock = parsedQty > availableQty;
  const isInvalidQty = parsedQty <= 0;

  const handleSelectMaterial = (item) => {
    setUserSelectedItemId(item.id);
    if (item.project) {
      setUserSelectedProject(item.project);
    }
    setIsPickerOpen(false);
    setErrorMessage('');
  };

  const handleDismiss = () => {
    setUserSelectedItemId(null);
    setUserSelectedProject(null);
    setQuantityInput('');
    setPurpose('');
    setErrorMessage('');
    setIsPickerOpen(false);
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!currentItem) {
      setErrorMessage('Please select a material.');
      return;
    }

    if (isInvalidQty) {
      setErrorMessage('Please enter a valid positive quantity.');
      return;
    }

    if (exceedsStock) {
      setErrorMessage(
        `Usage exceeds stock! Only ${availableQty} ${currentItem.unit} available.`
      );
      return;
    }

    const trimmedPurpose = purpose.trim();
    if (trimmedPurpose.length < 3) {
      setErrorMessage('Please specify the usage purpose or location.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        itemId: currentItem.id,
        quantity: parsedQty,
        project: selectedProject,
        purpose: trimmedPurpose,
      });
      handleDismiss();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to record usage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleDismiss}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={handleDismiss}>
        <Pressable
          className="bg-white rounded-t-3xl pt-5 pb-8 px-5 border-t border-slate-200 max-h-[90%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 items-center justify-center mr-2.5">
                <Feather name="minus-circle" size={16} color="#F97316" />
              </View>
              <View>
                <Text className="text-sm font-bold text-[#172B4D]">
                  Record Material Usage
                </Text>
                <Text className="text-[10px] text-slate-400 font-medium">
                  Authoritative Stock Deduction
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleDismiss}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Error Message */}
            {Boolean(errorMessage) && (
              <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3.5 flex-row items-start">
                <Feather name="alert-circle" size={15} color="#EF4444" style={{ marginTop: 2 }} />
                <Text className="text-xs text-red-700 font-medium ml-2 flex-1">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* 1. Material Selector */}
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Select Material
            </Text>
            <TouchableOpacity
              onPress={() => setIsPickerOpen(!isPickerOpen)}
              activeOpacity={0.7}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex-row items-center justify-between mb-2"
            >
              <View className="flex-1 mr-2">
                <Text className="text-xs font-bold text-[#172B4D]" numberOfLines={1}>
                  {currentItem?.name || 'Choose material...'}
                </Text>
                <Text className="text-[10px] text-slate-400 font-medium">
                  {currentItem ? `${currentItem.category} • ${currentItem.id}` : ''}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-slate-200/70 px-2 py-0.5 rounded mr-2">
                  <Text className="text-[10px] font-bold text-slate-700">
                    {availableQty} {currentItem?.unit}
                  </Text>
                </View>
                <Feather name={isPickerOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
              </View>
            </TouchableOpacity>

            {/* Material Dropdown List (Collapsible) */}
            {isPickerOpen && (
              <View className="bg-white border border-slate-200 rounded-xl mb-3 max-h-48 overflow-hidden">
                <ScrollView nestedScrollEnabled>
                  {items.map((it) => {
                    const isSelected = it.id === currentItem?.id;
                    const isOutOfStock = it.availableQuantity <= 0;
                    return (
                      <TouchableOpacity
                        key={it.id}
                        onPress={() => handleSelectMaterial(it)}
                        activeOpacity={0.7}
                        className={`p-2.5 border-b border-slate-100 flex-row items-center justify-between ${
                          isSelected ? 'bg-orange-50/60' : ''
                        }`}
                      >
                        <View className="flex-1 mr-2">
                          <Text
                            className={`text-xs ${
                              isSelected ? 'font-bold text-[#F97316]' : 'font-medium text-[#172B4D]'
                            }`}
                            numberOfLines={1}
                          >
                            {it.name}
                          </Text>
                          <Text className="text-[9px] text-slate-400 font-normal">
                            {it.category}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text
                            className={`text-[10px] font-bold ${
                              isOutOfStock ? 'text-red-500' : 'text-slate-700'
                            }`}
                          >
                            {it.availableQuantity} {it.unit}
                          </Text>
                          {isOutOfStock && (
                            <Text className="text-[8px] text-red-400 font-semibold">
                              Out of Stock
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* 2. Quantity Input & Unit */}
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Quantity Used ({currentItem?.unit || 'Units'})
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-row items-center justify-between mb-3">
              <TextInput
                value={quantityInput}
                onChangeText={(txt) => {
                  setQuantityInput(txt);
                  setErrorMessage('');
                }}
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                className="flex-1 text-base font-black text-[#172B4D] p-0"
              />
              <View className="bg-slate-200/80 px-2 py-1 rounded-md">
                <Text className="text-[11px] font-bold text-slate-700">
                  {currentItem?.unit || 'Units'}
                </Text>
              </View>
            </View>

            {/* Live Stock Deduction Calculation Preview */}
            {currentItem && (
              <View
                className={`rounded-xl p-3 border mb-3.5 ${
                  exceedsStock
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase">
                    Stock Calculation Preview
                  </Text>
                  <Text
                    className={`text-[10px] font-black ${
                      exceedsStock ? 'text-red-600' : 'text-blue-700'
                    }`}
                  >
                    {exceedsStock ? 'Deficit Exceeded' : 'Remaining Balance'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between pt-1 border-t border-slate-200/50">
                  <Text className="text-xs font-semibold text-slate-600">
                    Current: <Text className="font-bold text-[#172B4D]">{availableQty}</Text>
                  </Text>
                  <Text className="text-xs font-bold text-slate-400">
                    - {parsedQty || 0}
                  </Text>
                  <Text
                    className={`text-sm font-black ${
                      exceedsStock ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    = {remainingPreview} {currentItem.unit}
                  </Text>
                </View>

                {exceedsStock && (
                  <Text className="text-[10px] text-red-600 font-bold mt-1">
                    ⚠️ Cannot record consumption greater than available stock!
                  </Text>
                )}
              </View>
            )}

            {/* 3. Project / Construction Site Selector */}
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Project / Construction Site
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {CONSTRUCTION_PROJECTS.map((proj) => {
                const isSelected = selectedProject === proj;
                return (
                  <TouchableOpacity
                    key={proj}
                    onPress={() => setUserSelectedProject(proj)}
                    activeOpacity={0.7}
                    className={`mr-1.5 px-3 py-2 rounded-xl border ${
                      isSelected
                        ? 'bg-[#172B4D] border-[#172B4D]'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      {proj}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 4. Usage Purpose / Description */}
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Usage Purpose / Specific Location
            </Text>
            <TextInput
              value={purpose}
              onChangeText={(txt) => {
                setPurpose(txt);
                setErrorMessage('');
              }}
              placeholder="e.g. Sub-basement shear wall pouring, Level 4 slab reinforcement..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#172B4D] mb-4 min-h-[58px]"
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || exceedsStock || isInvalidQty || !currentItem}
              activeOpacity={0.8}
              className={`w-full rounded-xl py-3.5 items-center justify-center shadow-sm ${
                isSubmitting || exceedsStock || isInvalidQty || !currentItem
                  ? 'bg-slate-300'
                  : 'bg-[#F97316]'
              }`}
              accessibilityRole="button"
              accessibilityLabel="Submit Material Usage"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View className="flex-row items-center">
                  <Feather name="check-circle" size={16} color="#FFFFFF" />
                  <Text className="text-xs font-black text-white uppercase tracking-wider ml-2">
                    Submit Usage Record
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
