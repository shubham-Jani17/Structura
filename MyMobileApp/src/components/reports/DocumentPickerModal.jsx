import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  SAMPLE_DOCUMENTS,
  validateDocumentFile,
  ALLOWED_DOCUMENT_EXTENSIONS,
  MAX_DOCUMENT_SIZE_BYTES,
  formatBytes,
} from '../../services/reportService';

/**
 * DocumentPickerModal
 * Attaches site documents with STRICT < 10 MB file size limit and format validation.
 */
export default function DocumentPickerModal({
  visible,
  onClose,
  onAttachDocuments,
  existingDocuments = [],
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [customFileName, setCustomFileName] = useState('');
  const [customExt, setCustomExt] = useState('pdf');
  const [customSizeMb, setCustomSizeMb] = useState('2.5');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSelectDoc = (doc) => {
    setErrorMessage('');

    // Pre-validate file size and format
    const validation = validateDocumentFile(doc);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    if (selectedIds.includes(doc.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== doc.id));
    } else {
      setSelectedIds([...selectedIds, doc.id]);
    }
  };

  const handleAttachSelected = () => {
    if (selectedIds.length === 0) {
      setErrorMessage('Please select at least one document to attach.');
      return;
    }

    const selectedDocs = SAMPLE_DOCUMENTS.filter((d) =>
      selectedIds.includes(d.id)
    );

    const validatedList = [];
    for (const doc of selectedDocs) {
      const res = validateDocumentFile(doc);
      if (!res.isValid) {
        setErrorMessage(res.error);
        return;
      }
      validatedList.push(res.validatedFile);
    }

    onAttachDocuments(validatedList);
    setSelectedIds([]);
    setErrorMessage('');
    onClose();
  };

  const handleAddCustomDocument = () => {
    setErrorMessage('');
    const trimmed = customFileName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a document file name.');
      return;
    }

    const sizeInMb = parseFloat(customSizeMb);
    if (isNaN(sizeInMb) || sizeInMb <= 0) {
      setErrorMessage('Please enter a valid document size in MB.');
      return;
    }

    const calculatedBytes = Math.round(sizeInMb * 1024 * 1024);
    const completeName = trimmed.toLowerCase().endsWith(`.${customExt}`)
      ? trimmed
      : `${trimmed}.${customExt}`;

    const customDoc = {
      id: `DOC-CUSTOM-${Date.now().toString().slice(-4)}`,
      fileName: completeName,
      extension: customExt,
      sizeBytes: calculatedBytes,
      sizeFormatted: `${sizeInMb.toFixed(1)} MB`,
      description: 'Attached via Structura Mobile field uploader',
    };

    const res = validateDocumentFile(customDoc);
    if (!res.isValid) {
      setErrorMessage(res.error);
      return;
    }

    onAttachDocuments([res.validatedFile]);
    setCustomFileName('');
    setCustomSizeMb('2.5');
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
              <View className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center mr-3">
                <Feather name="file-text" size={20} color="#2563EB" />
              </View>
              <View>
                <Text className="text-base font-black text-[#172B4D]">
                  Attach Documents & Audits
                </Text>
                <Text className="text-xs text-slate-500 font-medium">
                  Site engineering specs, lab test results & checklists
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

          {/* Strict Size Limit Warning Banner */}
          <View className="bg-amber-50 border border-amber-200 rounded-xl p-3 my-3 flex-row items-start">
            <Feather
              name="alert-triangle"
              size={16}
              color="#D97706"
              style={{ marginTop: 1 }}
            />
            <View className="ml-2 flex-1">
              <Text className="text-xs font-bold text-amber-900">
                Strict Limit: &lt; 10 MB per document
              </Text>
              <Text className="text-[11px] text-amber-800 font-medium mt-0.5 leading-snug">
                Accepted formats: PDF, DOC, DOCX, TXT, RTF. Files of 10 MB or
                more are strictly rejected.
              </Text>
            </View>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-3 flex-row items-start">
              <Feather
                name="alert-circle"
                size={16}
                color="#E11D48"
                style={{ marginTop: 1 }}
              />
              <Text className="text-xs text-rose-700 font-semibold ml-2 flex-1 leading-snug">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Scrollable Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-2"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Custom Entry Toggle */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Available Document Files
              </Text>
              <TouchableOpacity
                onPress={() => setShowCustomForm(!showCustomForm)}
                className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg"
              >
                <Text className="text-[11px] font-bold text-blue-600">
                  {showCustomForm ? 'View File Vault' : '+ Custom Document'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Document Entry Form */}
            {showCustomForm ? (
              <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
                <Text className="text-xs font-bold text-[#172B4D] mb-2">
                  Attach Custom File
                </Text>

                <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  File Name
                </Text>
                <TextInput
                  value={customFileName}
                  onChangeText={setCustomFileName}
                  placeholder="e.g. Geotechnical_Soil_Test_Phase1"
                  placeholderTextColor="#94A3B8"
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-medium mb-3"
                />

                <View className="flex-row mb-3">
                  <View className="flex-1 mr-2">
                    <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      File Size (MB)
                    </Text>
                    <TextInput
                      value={customSizeMb}
                      onChangeText={setCustomSizeMb}
                      keyboardType="numeric"
                      placeholder="e.g. 2.5"
                      placeholderTextColor="#94A3B8"
                      className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#172B4D] font-medium"
                    />
                  </View>

                  <View className="flex-1 ml-2">
                    <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Extension
                    </Text>
                    <View className="flex-row flex-wrap">
                      {ALLOWED_DOCUMENT_EXTENSIONS.slice(0, 3).map((ext) => (
                        <TouchableOpacity
                          key={ext}
                          onPress={() => setCustomExt(ext)}
                          className={`px-2 py-1.5 rounded-lg border mr-1.5 mb-1 ${
                            customExt === ext
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-bold uppercase ${
                              customExt === ext ? 'text-white' : 'text-slate-600'
                            }`}
                          >
                            {ext}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleAddCustomDocument}
                  className="bg-[#172B4D] py-2.5 rounded-xl items-center mt-1"
                >
                  <Text className="text-white text-xs font-bold">
                    Validate & Attach File
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Document List */}
            {SAMPLE_DOCUMENTS.map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              const isAlreadyAttached = existingDocuments.some(
                (d) => d.id === doc.id || d.fileName === doc.fileName
              );
              const isExceeding = (doc.sizeBytes || 0) >= MAX_DOCUMENT_SIZE_BYTES;

              return (
                <TouchableOpacity
                  key={doc.id}
                  onPress={() => toggleSelectDoc(doc)}
                  disabled={isAlreadyAttached}
                  activeOpacity={0.7}
                  className={`p-3.5 mb-2.5 rounded-2xl border ${
                    isAlreadyAttached
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : isExceeding
                      ? 'bg-rose-50/40 border-rose-200'
                      : isSelected
                      ? 'bg-blue-50/60 border-blue-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-3">
                      {/* Document Type Icon */}
                      <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                          isExceeding
                            ? 'bg-rose-100 border border-rose-200'
                            : 'bg-blue-50 border border-blue-100'
                        }`}
                      >
                        <Feather
                          name={isExceeding ? 'alert-triangle' : 'file'}
                          size={18}
                          color={isExceeding ? '#E11D48' : '#2563EB'}
                        />
                      </View>

                      {/* File Details */}
                      <View className="flex-1">
                        <Text
                          numberOfLines={1}
                          className="text-xs font-black text-[#172B4D]"
                        >
                          {doc.fileName}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className="text-[11px] text-slate-500 font-medium mt-0.5"
                        >
                          {doc.description}
                        </Text>

                        <View className="flex-row items-center mt-1 space-x-2">
                          <View
                            className={`px-1.5 py-0.5 rounded mr-2 ${
                              isExceeding ? 'bg-rose-100' : 'bg-slate-100'
                            }`}
                          >
                            <Text
                              className={`text-[9px] font-bold uppercase ${
                                isExceeding
                                  ? 'text-rose-700'
                                  : 'text-slate-600'
                              }`}
                            >
                              {doc.extension}
                            </Text>
                          </View>

                          <Text
                            className={`text-[10px] font-semibold ${
                              isExceeding ? 'text-rose-600' : 'text-slate-500'
                            }`}
                          >
                            {doc.sizeFormatted || formatBytes(doc.sizeBytes)}
                          </Text>

                          {isExceeding ? (
                            <View className="bg-rose-100 px-1.5 py-0.5 rounded ml-2">
                              <Text className="text-[9px] font-bold text-rose-700">
                                EXCEEDS 10 MB
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    {/* Checkbox indicator */}
                    <View
                      className={`w-6 h-6 rounded-lg items-center justify-center border ${
                        isAlreadyAttached
                          ? 'bg-emerald-100 border-emerald-300'
                          : isExceeding
                          ? 'bg-rose-100 border-rose-300'
                          : isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isAlreadyAttached ? (
                        <Feather name="check" size={14} color="#059669" />
                      ) : isExceeding ? (
                        <Feather name="x" size={14} color="#E11D48" />
                      ) : isSelected ? (
                        <Feather name="check" size={14} color="#FFFFFF" />
                      ) : null}
                    </View>
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
              onPress={handleAttachSelected}
              activeOpacity={0.7}
              className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                selectedIds.length > 0 ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <Feather name="paperclip" size={15} color="#FFFFFF" />
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
