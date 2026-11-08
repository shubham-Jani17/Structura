import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  SAMPLE_SITE_PHOTOGRAPHS,
  validateImageFile,
} from '../../services/reportService';

/**
 * ImagePickerModal
 * Allows selecting and attaching multiple site photographs with preview and format verification.
 */
export default function ImagePickerModal({
  visible,
  onClose,
  onAttachImages,
  existingImages = [],
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customFormat, setCustomFormat] = useState('JPG');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSelect = (photo) => {
    setErrorMessage('');
    if (selectedIds.includes(photo.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== photo.id));
    } else {
      setSelectedIds([...selectedIds, photo.id]);
    }
  };

  const handleAttachExisting = () => {
    if (selectedIds.length === 0) {
      setErrorMessage('Please select at least one photograph to attach.');
      return;
    }

    const selectedPhotos = SAMPLE_SITE_PHOTOGRAPHS.filter((p) =>
      selectedIds.includes(p.id)
    );

    // Validate each image
    const validatedList = [];
    for (const photo of selectedPhotos) {
      const res = validateImageFile(photo);
      if (res.isValid) {
        validatedList.push(res.validatedImage);
      }
    }

    onAttachImages(validatedList);
    setSelectedIds([]);
    setErrorMessage('');
    onClose();
  };

  const handleAddCustomPhoto = () => {
    setErrorMessage('');
    const trimmedTitle = customTitle.trim();
    if (!trimmedTitle) {
      setErrorMessage('Please enter a photo caption or title.');
      return;
    }

    const customObj = {
      id: `IMG-CUSTOM-${Date.now().toString().slice(-4)}`,
      title: trimmedTitle,
      format: customFormat,
      sizeFormatted: '1.9 MB',
      uri: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
      description: 'Captured on-site via field mobile terminal',
    };

    const res = validateImageFile(customObj);
    if (!res.isValid) {
      setErrorMessage(res.error);
      return;
    }

    onAttachImages([res.validatedImage]);
    setCustomTitle('');
    setShowCustomForm(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[88%] p-5 border-t border-slate-200">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-slate-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 items-center justify-center mr-3">
                <Feather name="camera" size={20} color="#F97316" />
              </View>
              <View>
                <Text className="text-base font-black text-[#172B4D]">
                  Attach Site Photographs
                </Text>
                <Text className="text-xs text-slate-500 font-medium">
                  Select field photos to document site progress
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Feather name="x" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 my-3 flex-row items-center">
              <Feather name="alert-circle" size={16} color="#E11D48" />
              <Text className="text-xs text-rose-700 font-semibold ml-2 flex-1">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Form switch or Gallery */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-3"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Format Info Pill */}
            <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <Feather name="info" size={14} color="#64748B" />
                <Text className="text-[11px] text-slate-600 font-medium ml-2">
                  Supported: JPG, JPEG, PNG • Multi-photo selection
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCustomForm(!showCustomForm)}
                className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
              >
                <Text className="text-[11px] font-bold text-orange-600">
                  {showCustomForm ? 'View Gallery' : '+ Custom Entry'}
                </Text>
              </TouchableOpacity>
            </View>

            {showCustomForm ? (
              <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
                <Text className="text-xs font-bold text-[#172B4D] mb-2">
                  Add Custom Photo Entry
                </Text>
                <TextInput
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="e.g. Shear Wall Rebar Spacing - Grid B4"
                  placeholderTextColor="#94A3B8"
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-medium mb-3"
                />

                <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Format
                </Text>
                <View className="flex-row space-x-2 mb-4">
                  {['JPG', 'JPEG', 'PNG'].map((fmt) => (
                    <TouchableOpacity
                      key={fmt}
                      onPress={() => setCustomFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg border mr-2 ${
                        customFormat === fmt
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          customFormat === fmt ? 'text-white' : 'text-slate-600'
                        }`}
                      >
                        {fmt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleAddCustomPhoto}
                  className="bg-[#172B4D] py-2.5 rounded-xl items-center"
                >
                  <Text className="text-white text-xs font-bold">
                    Add Photo Attachment
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Photo List */}
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Available Site Photographs ({SAMPLE_SITE_PHOTOGRAPHS.length})
            </Text>

            {SAMPLE_SITE_PHOTOGRAPHS.map((photo) => {
              const isSelected = selectedIds.includes(photo.id);
              const isAlreadyAttached = existingImages.some(
                (img) => img.id === photo.id || img.title === photo.title
              );

              return (
                <TouchableOpacity
                  key={photo.id}
                  onPress={() => toggleSelect(photo)}
                  disabled={isAlreadyAttached}
                  activeOpacity={0.7}
                  className={`flex-row items-center p-3 mb-2.5 rounded-2xl border ${
                    isAlreadyAttached
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : isSelected
                      ? 'bg-orange-50/60 border-orange-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Photo Preview Thumbnail */}
                  <Image
                    source={{ uri: photo.uri }}
                    className="w-16 h-16 rounded-xl bg-slate-200 mr-3"
                    resizeMode="cover"
                  />

                  {/* Details */}
                  <View className="flex-1 mr-2">
                    <Text
                      numberOfLines={1}
                      className="text-xs font-black text-[#172B4D]"
                    >
                      {photo.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className="text-[11px] text-slate-500 font-medium mt-0.5"
                    >
                      {photo.description}
                    </Text>
                    <View className="flex-row items-center mt-1.5 space-x-2">
                      <View className="bg-slate-100 px-2 py-0.5 rounded-md mr-2">
                        <Text className="text-[10px] font-bold text-slate-600">
                          {photo.format}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-slate-400 font-medium">
                        {photo.sizeFormatted}
                      </Text>
                    </View>
                  </View>

                  {/* Select Checkbox */}
                  <View
                    className={`w-6 h-6 rounded-lg items-center justify-center border ${
                      isAlreadyAttached
                        ? 'bg-emerald-100 border-emerald-300'
                        : isSelected
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isAlreadyAttached ? (
                      <Feather name="check" size={14} color="#059669" />
                    ) : isSelected ? (
                      <Feather name="check" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Action Footer */}
          <View className="pt-3 border-t border-slate-100 flex-row space-x-3">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 items-center mr-2"
            >
              <Text className="text-xs font-bold text-slate-600">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAttachExisting}
              activeOpacity={0.7}
              className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                selectedIds.length > 0 ? 'bg-orange-500' : 'bg-slate-300'
              }`}
            >
              <Feather name="check-circle" size={15} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white ml-2">
                Attach {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
