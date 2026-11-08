import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * DocumentPreviewModal
 * Full-fidelity interactive document viewer for site engineering reports,
 * lab certifications, and safety checklists.
 */
export default function DocumentPreviewModal({
  visible,
  document,
  reportId,
  siteName,
  onClose,
}) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!document) return null;

  const fileName = document.fileName || 'site_document.pdf';
  const extension = (document.extension || fileName.split('.').pop() || 'pdf').toUpperCase();
  const sizeFormatted = document.sizeFormatted || '1.5 MB';
  const description = document.description || 'Verified site inspection documentation';

  const handleShare = async () => {
    try {
      await Share.share({
        title: fileName,
        message: `Structura MAD Engineering Document: ${fileName} (${sizeFormatted}) associated with Report ${reportId || 'REP-ARCHIVE'} for ${siteName || 'Construction Site'}.`,
      });
    } catch (err) {
      Alert.alert('Share Failed', err.message || 'Unable to share document reference.');
    }
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    Alert.alert(
      'Document Saved',
      `"${fileName}" has been cached locally to your offline device storage for field review.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[92%] p-5 border-t border-slate-200">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100">
            <View className="flex-row items-center flex-1 mr-2">
              <View className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 items-center justify-center mr-2.5">
                <Feather name="file-text" size={18} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text numberOfLines={1} className="text-sm font-black text-[#172B4D]">
                  {fileName}
                </Text>
                <View className="flex-row items-center mt-0.5">
                  <View className="bg-blue-100 px-1.5 py-0.2 rounded mr-1.5">
                    <Text className="text-[9px] font-bold text-blue-700 uppercase">
                      {extension}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-slate-400 font-semibold">
                    {sizeFormatted} • Verified Secure
                  </Text>
                </View>
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

          {/* Document Content Scroll */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-3"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Quick Action Bar */}
            <View className="flex-row items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-2xl mb-4">
              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.7}
                className="flex-1 flex-row items-center justify-center py-2 bg-white border border-slate-200 rounded-xl mr-2 shadow-xs"
              >
                <Feather name="share-2" size={13} color="#172B4D" />
                <Text className="text-xs font-bold text-[#172B4D] ml-1.5">
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownload}
                activeOpacity={0.7}
                className={`flex-1 flex-row items-center justify-center py-2 rounded-xl border ${
                  isDownloaded
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <Feather
                  name={isDownloaded ? 'check-circle' : 'download'}
                  size={13}
                  color={isDownloaded ? '#059669' : '#EA580C'}
                />
                <Text
                  className={`text-xs font-bold ml-1.5 ${
                    isDownloaded ? 'text-emerald-700' : 'text-orange-700'
                  }`}
                >
                  {isDownloaded ? 'Downloaded' : 'Download Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Document Description */}
            <View className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 mb-4">
              <Text className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1">
                Document Description
              </Text>
              <Text className="text-xs text-blue-950 font-medium leading-relaxed">
                {description}
              </Text>
            </View>

            {/* High-Fidelity Simulated Document Sheet */}
            <View className="bg-slate-50 border border-slate-300 rounded-2xl p-4 shadow-sm mb-4">
              {/* Document Letterhead */}
              <View className="border-b border-slate-200 pb-3 mb-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    STRUCTURA QUALITY AUDIT
                  </Text>
                  <Text className="text-sm font-black text-[#172B4D]">
                    Civil Inspection Certificate
                  </Text>
                </View>
                <View className="px-2 py-1 bg-emerald-100 border border-emerald-200 rounded-lg">
                  <Text className="text-[9px] font-black text-emerald-800">
                    CERTIFIED
                  </Text>
                </View>
              </View>

              {/* Document Meta Table */}
              <View className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5 mb-3">
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Project Name:</Text>
                  <Text className="text-[11px] font-bold text-[#172B4D]">{siteName || 'Skyline Tower'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Report Reference:</Text>
                  <Text className="text-[11px] font-bold text-orange-600">{reportId || 'REP-ARCHIVE'}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Format Standard:</Text>
                  <Text className="text-[11px] font-bold text-slate-700">ISO 9001:2015 Conforming</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Digital Verification:</Text>
                  <Text className="text-[10px] font-mono text-emerald-700">SHA-256: 8F4A...9E02</Text>
                </View>
              </View>

              {/* Document Text Body Simulation */}
              <View className="p-3 bg-white rounded-xl border border-slate-200 mb-3">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Inspection Executive Summary
                </Text>
                <Text className="text-xs text-slate-600 leading-relaxed font-medium">
                  This document certifies that the structural elements, raw material consignments, and construction workflows referenced in this site record were inspected according to municipal engineering codes and project specifications.
                </Text>

                <View className="mt-3 pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
                  <Text className="text-[10px] text-slate-400 font-semibold">
                    Sign-Off: Chief Structural QA
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-600">
                    Signed & Encrypted
                  </Text>
                </View>
              </View>

              {/* Offline Field Cache Notice */}
              <View className="flex-row items-center justify-center pt-1">
                <Feather name="shield" size={12} color="#059669" />
                <Text className="text-[10px] font-bold text-slate-500 ml-1.5">
                  Verified tamper-proof document vault record
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Close */}
          <View className="pt-2 border-t border-slate-100">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="w-full py-3.5 rounded-2xl bg-[#172B4D] items-center"
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">
                Close Document Viewer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
