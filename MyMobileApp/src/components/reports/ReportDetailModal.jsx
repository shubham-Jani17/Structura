import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Share,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DocumentPreviewModal from './DocumentPreviewModal';

export default function ReportDetailModal({
  visible,
  report,
  onClose,
  onEditDraft,
  onDeleteDraft,
}) {
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);

  if (!report) return null;

  const isDraft = report.isDraft || (report.status || '').toLowerCase() === 'draft';
  const isReviewed =
    (report.status || '').toLowerCase() === 'reviewed' ||
    (report.status || '').toLowerCase() === 'approved';
  const isPending = (report.status || '').toLowerCase().includes('pending');

  const tasks = report.tasks || [];
  const images = report.images || [];
  const documents = report.documents || [];
  const summary = report.taskSummary || {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
  };

  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');

  const formattedCreated = report.createdAt
    ? new Date(report.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : `${report.reportDate} • Verified Shift`;

  const handleShareReport = async () => {
    try {
      await Share.share({
        title: `Site Report ${report.id}`,
        message: `Structura MAD Site Report [${report.id}] for ${report.siteName} (${report.siteLocation}). Status: ${report.status}. Progress: ${report.completionPercentage}%. Reported by ${report.submittedBy}.`,
      });
    } catch (err) {
      Alert.alert('Share Failed', err.message || 'Unable to share report details.');
    }
  };

  const handleSharePhoto = async (photo) => {
    try {
      await Share.share({
        title: photo.title || 'Site Photograph',
        message: `Structura Field Photo: ${photo.title} (${photo.format || 'JPG'}) attached to Report ${report.id}.`,
      });
    } catch (err) {
      Alert.alert('Share Failed', err.message || 'Unable to share photograph.');
    }
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
          {/* Top Bar: Back & ID & Status */}
          <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100">
            <View className="flex-row items-center flex-1 mr-2">
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mr-2.5"
                accessibilityLabel="Back to Report Vault"
              >
                <Feather name="arrow-left" size={16} color="#172B4D" />
              </TouchableOpacity>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-sm font-black text-[#172B4D]">
                    {report.id}
                  </Text>
                  <View
                    className={`px-2 py-0.5 rounded-full border ml-2 ${
                      isDraft
                        ? 'bg-violet-50 border-violet-200'
                        : isReviewed
                        ? 'bg-emerald-50 border-emerald-200'
                        : isPending
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <Text
                      className={`text-[9px] font-bold ${
                        isDraft
                          ? 'text-violet-700'
                          : isReviewed
                          ? 'text-emerald-700'
                          : isPending
                          ? 'text-amber-800'
                          : 'text-blue-700'
                      }`}
                    >
                      {report.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Logged: {formattedCreated}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleShareReport}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center mr-2"
              >
                <Feather name="share-2" size={14} color="#172B4D" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <Feather name="x" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Body Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="my-3"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Draft Notice or Verified Read-Only Seal */}
            {isDraft ? (
              <View className="bg-violet-50 border border-violet-200 rounded-2xl p-3 mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-2">
                  <Feather name="edit-3" size={14} color="#7C3AED" />
                  <Text className="text-xs text-violet-900 font-bold ml-2 flex-1">
                    Editable Draft Report • Not yet submitted
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    if (onEditDraft) onEditDraft(report);
                  }}
                  className="bg-violet-600 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[10px] font-bold text-white">
                    Edit Now
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="lock" size={12} color="#059669" />
                  <Text className="text-[11px] text-slate-600 font-semibold ml-2">
                    Official Site Record • Signed & Locked (Read-Only)
                  </Text>
                </View>
                <View className="bg-emerald-100 px-2 py-0.5 rounded">
                  <Text className="text-[9px] font-black text-emerald-800">
                    VERIFIED
                  </Text>
                </View>
              </View>
            )}

            {/* SITE & PROJECT INFORMATION */}
            <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Site & Project Information
              </Text>
              <Text className="text-base font-black text-[#172B4D] mb-1">
                {report.siteName}
              </Text>

              <View className="flex-row items-center mb-3">
                <Feather name="map-pin" size={13} color="#F97316" />
                <Text className="text-xs text-slate-600 font-semibold ml-1.5 flex-1">
                  {report.siteLocation}
                </Text>
              </View>

              <View className="pt-2.5 border-t border-slate-200 space-y-1.5">
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Report Date:</Text>
                  <Text className="text-[11px] font-bold text-[#172B4D]">{report.reportDate}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Submitted By:</Text>
                  <Text className="text-[11px] font-bold text-[#172B4D]">{report.submittedBy}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[11px] text-slate-500 font-medium">Work Shift:</Text>
                  <Text className="text-[11px] font-bold text-slate-800">{report.workShift}</Text>
                </View>
              </View>
            </View>

            {/* WORK PROGRESS & TASK BREAKDOWN */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-bold text-[#172B4D]">
                  Task Completion Percentage
                </Text>
                <Text className="text-sm font-black text-orange-600">
                  {report.completionPercentage}%
                </Text>
              </View>

              {/* Visual Progress Bar */}
              <View className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <View
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${report.completionPercentage}%` }}
                />
              </View>

              {/* Task Breakdown Stats */}
              <View className="flex-row justify-between bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3">
                <View className="items-center flex-1">
                  <Text className="text-xs font-black text-[#172B4D]">{summary.total}</Text>
                  <Text className="text-[9px] font-semibold text-slate-500">Total Tasks</Text>
                </View>
                <View className="w-[1px] h-5 bg-slate-200" />
                <View className="items-center flex-1">
                  <Text className="text-xs font-black text-emerald-600">{summary.completed}</Text>
                  <Text className="text-[9px] font-semibold text-emerald-700">Completed</Text>
                </View>
                <View className="w-[1px] h-5 bg-slate-200" />
                <View className="items-center flex-1">
                  <Text className="text-xs font-black text-amber-600">{summary.inProgress}</Text>
                  <Text className="text-[9px] font-semibold text-amber-700">In Progress</Text>
                </View>
                <View className="w-[1px] h-5 bg-slate-200" />
                <View className="items-center flex-1">
                  <Text className="text-xs font-black text-slate-600">{summary.pending}</Text>
                  <Text className="text-[9px] font-semibold text-slate-500">Pending</Text>
                </View>
              </View>

              {/* Categorized Task Breakdown */}
              <View className="space-y-3">
                {/* Completed Tasks */}
                {completedTasks.length > 0 ? (
                  <View>
                    <Text className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
                      Completed Tasks ({completedTasks.length})
                    </Text>
                    {completedTasks.map((t) => (
                      <View
                        key={t.id}
                        className="flex-row items-center p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 mb-1"
                      >
                        <View className="w-5 h-5 rounded-md bg-emerald-100 items-center justify-center mr-2">
                          <Feather name="check" size={11} color="#059669" />
                        </View>
                        <Text className="text-xs font-semibold text-emerald-950 flex-1">
                          {t.title}
                        </Text>
                        <Text className="text-[10px] font-bold text-emerald-700">100%</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Work In Progress Tasks */}
                {inProgressTasks.length > 0 ? (
                  <View>
                    <Text className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                      Work In Progress ({inProgressTasks.length})
                    </Text>
                    {inProgressTasks.map((t) => (
                      <View
                        key={t.id}
                        className="flex-row items-center p-2 rounded-xl bg-amber-50/60 border border-amber-100 mb-1"
                      >
                        <View className="w-5 h-5 rounded-md bg-amber-100 items-center justify-center mr-2">
                          <Feather name="clock" size={11} color="#D97706" />
                        </View>
                        <Text className="text-xs font-semibold text-amber-950 flex-1">
                          {t.title}
                        </Text>
                        <Text className="text-[10px] font-bold text-amber-800">{t.progress || 50}%</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Pending Tasks */}
                {pendingTasks.length > 0 ? (
                  <View>
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Pending Tasks ({pendingTasks.length})
                    </Text>
                    {pendingTasks.map((t) => (
                      <View
                        key={t.id}
                        className="flex-row items-center p-2 rounded-xl bg-slate-50 border border-slate-200 mb-1"
                      >
                        <View className="w-5 h-5 rounded-md bg-slate-200 items-center justify-center mr-2">
                          <Feather name="circle" size={11} color="#64748B" />
                        </View>
                        <Text className="text-xs font-medium text-slate-700 flex-1">
                          {t.title}
                        </Text>
                        <Text className="text-[10px] font-semibold text-slate-400">0%</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>

            {/* SITE CHALLENGES & REMARKS */}
            <View className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 mb-4">
              <View className="flex-row items-center mb-1.5">
                <Feather name="alert-triangle" size={14} color="#D97706" />
                <Text className="text-xs font-bold text-amber-900 ml-1.5">
                  Challenges or Site Issues
                </Text>
              </View>
              <Text className="text-xs text-amber-950 font-medium leading-relaxed">
                {report.challenges || 'No operational impediments encountered.'}
              </Text>
            </View>

            <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
              <View className="flex-row items-center mb-1.5">
                <Feather name="info" size={14} color="#475569" />
                <Text className="text-xs font-bold text-[#172B4D] ml-1.5">
                  Supervisory Remarks & Instructions
                </Text>
              </View>
              <Text className="text-xs text-slate-700 font-medium leading-relaxed">
                {report.remarks || 'No additional remarks provided.'}
              </Text>
            </View>

            {/* ATTACHED PHOTOGRAPHS */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Feather name="camera" size={14} color="#F97316" />
                  <Text className="text-xs font-bold text-[#172B4D] ml-1.5">
                    Attached Site Photographs ({images.length})
                  </Text>
                </View>
                <Text className="text-[10px] text-slate-400 font-semibold">
                  Tap to expand
                </Text>
              </View>

              {images.length === 0 ? (
                <View className="bg-slate-50 rounded-xl p-4 items-center">
                  <Feather name="image" size={20} color="#CBD5E1" />
                  <Text className="text-xs text-slate-400 font-medium mt-1">
                    No photographs attached to this report.
                  </Text>
                </View>
              ) : (
                <View className="space-y-3">
                  {images.map((img) => (
                    <TouchableOpacity
                      key={img.id}
                      onPress={() => setSelectedPhotoPreview(img)}
                      activeOpacity={0.9}
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-2.5 mb-2.5"
                    >
                      <Image
                        source={{ uri: img.uri }}
                        className="w-full h-36 rounded-xl bg-slate-200 mb-2"
                        resizeMode="cover"
                      />
                      <Text className="text-xs font-black text-[#172B4D]">
                        {img.title}
                      </Text>
                      {img.description ? (
                        <Text className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {img.description}
                        </Text>
                      ) : null}
                      <View className="flex-row items-center justify-between mt-2 pt-1.5 border-t border-slate-200">
                        <View className="bg-orange-100 px-2 py-0.5 rounded">
                          <Text className="text-[9px] font-bold text-orange-700 uppercase">
                            {img.format || 'JPG'}
                          </Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 font-semibold">
                          {img.sizeFormatted || '1.8 MB'} • Tap to enlarge
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* ATTACHED SUPPORTING DOCUMENTS */}
            <View className="bg-white rounded-2xl p-4 border border-slate-200 mb-2">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Feather name="file-text" size={14} color="#2563EB" />
                  <Text className="text-xs font-bold text-[#172B4D] ml-1.5">
                    Supporting Documents ({documents.length})
                  </Text>
                </View>
              </View>

              {documents.length === 0 ? (
                <View className="bg-slate-50 rounded-xl p-4 items-center">
                  <Feather name="file" size={20} color="#CBD5E1" />
                  <Text className="text-xs text-slate-400 font-medium mt-1">
                    No documents attached to this report.
                  </Text>
                </View>
              ) : (
                <View className="space-y-2.5">
                  {documents.map((doc) => (
                    <View
                      key={doc.id}
                      className="p-3 mb-2 rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center mr-2">
                            <Feather name="file-text" size={15} color="#2563EB" />
                          </View>
                          <View className="flex-1">
                            <Text numberOfLines={1} className="text-xs font-bold text-[#172B4D]">
                              {doc.fileName}
                            </Text>
                            <Text className="text-[10px] text-slate-500 font-medium">
                              {doc.description || 'Verified site attachment'}
                            </Text>
                          </View>
                        </View>

                        <View className="items-end">
                          <View className="bg-blue-100 px-2 py-0.5 rounded mb-0.5">
                            <Text className="text-[9px] font-bold text-blue-700 uppercase">
                              {doc.extension}
                            </Text>
                          </View>
                          <Text className="text-[10px] text-slate-500 font-medium">
                            {doc.sizeFormatted}
                          </Text>
                        </View>
                      </View>

                      {/* Document Actions Row */}
                      <View className="flex-row items-center pt-2 border-t border-slate-200">
                        <TouchableOpacity
                          onPress={() => setSelectedDocPreview(doc)}
                          className="flex-1 bg-white border border-slate-200 py-1.5 rounded-xl flex-row items-center justify-center mr-2"
                        >
                          <Feather name="eye" size={12} color="#172B4D" />
                          <Text className="text-[11px] font-bold text-[#172B4D] ml-1">
                            Preview
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              await Share.share({
                                title: doc.fileName,
                                message: `Document: ${doc.fileName} (${doc.sizeFormatted}) attached to Report ${report.id}.`,
                              });
                            } catch (e) {
                              Alert.alert('Share Failed', e.message);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 py-1.5 rounded-xl flex-row items-center justify-center"
                        >
                          <Feather name="share-2" size={12} color="#EA580C" />
                          <Text className="text-[11px] font-bold text-orange-700 ml-1">
                            Share / Export
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Management Actions */}
          <View className="pt-2 border-t border-slate-100">
            {isDraft ? (
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    if (onDeleteDraft) onDeleteDraft(report);
                  }}
                  activeOpacity={0.7}
                  className="flex-1 py-3 rounded-2xl bg-rose-50 border border-rose-200 items-center justify-center mr-2"
                >
                  <Text className="text-rose-700 text-xs font-bold">
                    Delete Draft
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    if (onEditDraft) onEditDraft(report);
                  }}
                  activeOpacity={0.8}
                  className="flex-1 py-3 rounded-2xl bg-violet-600 items-center justify-center"
                >
                  <Text className="text-white text-xs font-bold">
                    Edit Draft Report
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="w-full py-3 rounded-2xl bg-[#172B4D] items-center"
              >
                <Text className="text-white text-xs font-bold">
                  Close Report Inspector
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Document Preview Modal */}
      {selectedDocPreview ? (
        <DocumentPreviewModal
          visible={Boolean(selectedDocPreview)}
          document={selectedDocPreview}
          reportId={report.id}
          siteName={report.siteName}
          onClose={() => setSelectedDocPreview(null)}
        />
      ) : null}

      {/* Full Photo Zoom & Share Preview Modal */}
      {selectedPhotoPreview ? (
        <Modal
          visible={Boolean(selectedPhotoPreview)}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedPhotoPreview(null)}
        >
          <View className="flex-1 bg-black/90 justify-center items-center p-4">
            <View className="absolute top-12 right-6 flex-row items-center space-x-2 z-10">
              <TouchableOpacity
                onPress={() => handleSharePhoto(selectedPhotoPreview)}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-2"
              >
                <Feather name="share-2" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedPhotoPreview(null)}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Image
              source={{ uri: selectedPhotoPreview.uri }}
              className="w-full h-80 rounded-2xl bg-black"
              resizeMode="contain"
            />
            <View className="mt-4 bg-white/10 p-4 rounded-2xl w-full">
              <Text className="text-white text-sm font-bold">
                {selectedPhotoPreview.title}
              </Text>
              <Text className="text-slate-300 text-xs mt-1 leading-relaxed">
                {selectedPhotoPreview.description || 'Inspection photograph verified on-site.'}
              </Text>
              <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-white/10">
                <Text className="text-orange-400 text-[10px] font-bold uppercase">
                  Format: {selectedPhotoPreview.format || 'JPG'}
                </Text>
                <Text className="text-slate-400 text-[10px]">
                  {selectedPhotoPreview.sizeFormatted || '1.8 MB'}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </Modal>
  );
}
