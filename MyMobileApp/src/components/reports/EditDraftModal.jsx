import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WORK_SHIFTS } from '../../services/reportService';

export default function EditDraftModal({
  visible,
  report,
  onSaveDraft,
  onSubmitOfficial,
  onClose,
}) {
  if (!report) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[92%] p-5 border-t border-slate-200">
          <EditDraftForm
            report={report}
            onSaveDraft={onSaveDraft}
            onSubmitOfficial={onSubmitOfficial}
            onClose={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

function EditDraftForm({ report, onSaveDraft, onSubmitOfficial, onClose }) {
  const [siteLocation, setSiteLocation] = useState(report.siteLocation || '');
  const [workShift, setWorkShift] = useState(report.workShift || WORK_SHIFTS[0]);
  const [challenges, setChallenges] = useState(report.challenges || '');
  const [remarks, setRemarks] = useState(report.remarks || '');
  const [tasks, setTasks] = useState(
    () => (report.tasks || []).map((t) => ({ ...t }))
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `TSK-${Date.now()}`,
      title: newTaskTitle.trim(),
      status: 'IN_PROGRESS',
      progress: 50,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setErrorMsg('');
  };

  const handleRemoveTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === 'COMPLETED'
              ? 'PENDING'
              : t.status === 'PENDING'
              ? 'IN_PROGRESS'
              : 'COMPLETED';
          const nextProgress =
            nextStatus === 'COMPLETED' ? 100 : nextStatus === 'IN_PROGRESS' ? 50 : 0;
          return { ...t, status: nextStatus, progress: nextProgress };
        }
        return t;
      })
    );
  };

  const handleSave = async (submitOfficial = false) => {
    setErrorMsg('');
    if (!siteLocation.trim()) {
      setErrorMsg('Please specify the site location.');
      return;
    }
    if (tasks.length === 0) {
      setErrorMsg('Draft must contain at least one task entry.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        siteLocation: siteLocation.trim(),
        workShift,
        challenges: challenges.trim(),
        remarks: remarks.trim(),
        tasks,
        submitAsOfficial: submitOfficial,
      };

      if (submitOfficial) {
        await onSubmitOfficial(report.id, payload);
      } else {
        await onSaveDraft(report.id, payload);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update draft report.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 items-center justify-center mr-2.5">
            <Feather name="edit" size={17} color="#7C3AED" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-black text-[#172B4D]">
              Edit Draft Report
            </Text>
            <Text className="text-[10px] text-violet-700 font-bold">
              {report.id} • Unsubmitted Field Draft
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="my-3"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error message banner */}
        {errorMsg ? (
          <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-3 flex-row items-center">
            <Feather name="alert-circle" size={15} color="#E11D48" />
            <Text className="text-xs text-rose-700 font-bold ml-2 flex-1">
              {errorMsg}
            </Text>
          </View>
        ) : null}

        {/* Project Name (Fixed) */}
        <View className="mb-3.5">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Project / Construction Site
          </Text>
          <View className="bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5">
            <Text className="text-xs font-bold text-slate-700">
              {report.siteName}
            </Text>
          </View>
        </View>

        {/* Site Location */}
        <View className="mb-3.5">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Site Location *
          </Text>
          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
            <Feather name="map-pin" size={14} color="#F97316" />
            <TextInput
              value={siteLocation}
              onChangeText={setSiteLocation}
              placeholder="e.g. North Elevator Core Shear Wall"
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-xs text-[#172B4D] font-semibold"
            />
          </View>
        </View>

        {/* Work Shift Selector */}
        <View className="mb-4">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Work Shift
          </Text>
          <View className="space-y-1.5">
            {WORK_SHIFTS.map((shift) => (
              <TouchableOpacity
                key={shift}
                onPress={() => setWorkShift(shift)}
                activeOpacity={0.7}
                className={`p-2.5 rounded-xl border flex-row items-center justify-between mb-1 ${
                  workShift === shift
                    ? 'bg-violet-50/70 border-violet-400'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    workShift === shift ? 'text-violet-900' : 'text-slate-600'
                  }`}
                >
                  {shift}
                </Text>
                {workShift === shift ? (
                  <Feather name="check-circle" size={14} color="#7C3AED" />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dynamic Tasks Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Work Progress Tasks ({tasks.length})
            </Text>
            <Text className="text-[10px] text-slate-400 font-semibold">
              Tap icon to cycle status
            </Text>
          </View>

          {/* Add task row */}
          <View className="flex-row items-center mb-2.5">
            <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 flex-row items-center mr-2">
              <Feather name="plus-circle" size={14} color="#94A3B8" />
              <TextInput
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="Add work progress item..."
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-2 text-xs text-[#172B4D] font-medium"
              />
            </View>
            <TouchableOpacity
              onPress={handleAddTask}
              className="bg-[#172B4D] px-3.5 py-2.5 rounded-2xl"
            >
              <Text className="text-white text-xs font-bold">Add</Text>
            </TouchableOpacity>
          </View>

          {/* Tasks list */}
          {tasks.map((t) => {
            const isDone = t.status === 'COMPLETED';
            const isProg = t.status === 'IN_PROGRESS';
            return (
              <View
                key={t.id}
                className="flex-row items-center justify-between p-2.5 mb-1.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <TouchableOpacity
                  onPress={() => handleToggleTaskStatus(t.id)}
                  className="flex-row items-center flex-1 mr-2"
                >
                  <View
                    className={`w-5 h-5 rounded-md items-center justify-center mr-2 ${
                      isDone
                        ? 'bg-emerald-100'
                        : isProg
                        ? 'bg-amber-100'
                        : 'bg-slate-200'
                    }`}
                  >
                    <Feather
                      name={isDone ? 'check' : isProg ? 'clock' : 'circle'}
                      size={11}
                      color={isDone ? '#059669' : isProg ? '#D97706' : '#64748B'}
                    />
                  </View>
                  <Text numberOfLines={2} className="text-xs font-semibold text-[#172B4D] flex-1">
                    {t.title}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row items-center">
                  <View
                    className={`px-1.5 py-0.5 rounded mr-2 ${
                      isDone
                        ? 'bg-emerald-100'
                        : isProg
                        ? 'bg-amber-100'
                        : 'bg-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-[9px] font-bold ${
                        isDone
                          ? 'text-emerald-800'
                          : isProg
                          ? 'text-amber-800'
                          : 'text-slate-700'
                      }`}
                    >
                      {t.status}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveTask(t.id)}
                    className="p-1"
                  >
                    <Feather name="trash-2" size={13} color="#E11D48" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Challenges & Remarks */}
        <View className="mb-3.5">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Site Challenges & Impediments
          </Text>
          <TextInput
            value={challenges}
            onChangeText={setChallenges}
            multiline
            numberOfLines={2}
            placeholder="Describe operational delays or obstacles..."
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-[#172B4D] font-medium"
          />
        </View>

        <View className="mb-4">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Supervisory Remarks
          </Text>
          <TextInput
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={2}
            placeholder="Add general instructions or inspection remarks..."
            placeholderTextColor="#94A3B8"
            className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-[#172B4D] font-medium"
          />
        </View>
      </ScrollView>

      {/* Action Buttons Footer */}
      <View className="pt-2 border-t border-slate-100 space-y-2">
        <TouchableOpacity
          onPress={() => handleSave(false)}
          disabled={isSaving}
          activeOpacity={0.8}
          className="w-full py-3 rounded-2xl bg-slate-800 items-center mb-2 flex-row justify-center"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
          ) : (
            <Feather name="save" size={14} color="#FFFFFF" className="mr-2" />
          )}
          <Text className="text-white text-xs font-bold">
            Save Draft Updates
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Submit as Official Report?',
              'Once submitted, this report will receive an official permanent Report ID and will be locked as read-only.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Submit Official',
                  style: 'default',
                  onPress: () => handleSave(true),
                },
              ]
            );
          }}
          disabled={isSaving}
          activeOpacity={0.8}
          className="w-full py-3.5 rounded-2xl bg-orange-500 items-center flex-row justify-center shadow-sm"
        >
          <Feather name="check-circle" size={15} color="#FFFFFF" className="mr-2" />
          <Text className="text-white text-xs font-black uppercase tracking-wider">
            Submit as Official Report
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
