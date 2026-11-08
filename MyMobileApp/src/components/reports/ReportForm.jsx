import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  CONSTRUCTION_PROJECTS,
  WORK_SHIFTS,
  reportService,
} from '../../services/reportService';
import ImagePickerModal from './ImagePickerModal';
import DocumentPickerModal from './DocumentPickerModal';

const QUICK_TASK_SUGGESTIONS = [
  'Column rebar tying & spacing inspection',
  'Concrete slump & compressive cube sampling',
  'Formwork shuttering oiling & plumb line check',
  'Core electrical conduit sleeves placement',
  'Subgrade waterproofing membrane application',
];

export default function ReportForm({ onSubmitReport, onCancel, onSaveDraft }) {
  // Site Details State
  const [siteName, setSiteName] = useState(CONSTRUCTION_PROJECTS[0]);
  const [siteLocation, setSiteLocation] = useState('Level 4 Core Shear Wall - Grid C');
  const [reportDate, setReportDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [submittedBy, setSubmittedBy] = useState('Marcus Vance (Lead Structural Specialist)');
  const [workShift, setWorkShift] = useState(WORK_SHIFTS[0]);

  // Dynamic Tasks State
  const [tasks, setTasks] = useState([
    {
      id: 'TSK-INIT-1',
      title: 'Column rebar tying & spacing inspection',
      status: 'COMPLETED',
      progress: 100,
    },
    {
      id: 'TSK-INIT-2',
      title: 'Concrete slump & compressive cube sampling',
      status: 'COMPLETED',
      progress: 100,
    },
    {
      id: 'TSK-INIT-3',
      title: 'Core electrical conduit sleeves placement',
      status: 'IN_PROGRESS',
      progress: 50,
    },
    {
      id: 'TSK-INIT-4',
      title: 'Final concrete pump prime and pour inspection',
      status: 'PENDING',
      progress: 0,
    },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Site Issues & Remarks State
  const [challenges, setChallenges] = useState(
    'Tower crane maintenance delayed steel bundle hoisting by 40 minutes during morning shift setup.'
  );
  const [remarks, setRemarks] = useState(
    'Ready-mix concrete supplier confirmed 4 transit mixers scheduled for tomorrow 08:30 AM.'
  );

  // Attachments State
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedDocuments, setAttachedDocuments] = useState([]);

  // Modals State
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isDocPickerOpen, setIsDocPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamic Task Calculations
  const taskMetrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const pending = tasks.filter((t) => t.status === 'PENDING').length;

    let points = 0;
    tasks.forEach((t) => {
      if (t.status === 'COMPLETED') points += 100;
      else if (t.status === 'IN_PROGRESS') points += 50;
    });

    const percentage = total > 0 ? Math.round(points / total) : 0;

    return { total, completed, inProgress, pending, percentage };
  }, [tasks]);

  // Task Handlers
  const handleAddTask = (titleToAdd) => {
    const title = (titleToAdd || newTaskInput).trim();
    if (!title) return;

    const newTask = {
      id: `TSK-${Date.now()}`,
      title,
      status: 'IN_PROGRESS',
      progress: 50,
    };
    setTasks([...tasks, newTask]);
    setNewTaskInput('');
    setErrorMessage('');
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              progress: newStatus === 'COMPLETED' ? 100 : newStatus === 'IN_PROGRESS' ? 50 : 0,
            }
          : t
      )
    );
  };

  const handleRemoveTask = (taskId) => {
    if (tasks.length <= 1) {
      setErrorMessage('A site report must include at least one task entry.');
      return;
    }
    setTasks(tasks.filter((t) => t.id !== taskId));
    setErrorMessage('');
  };

  // Attachment Handlers
  const handleAddImages = (newImages) => {
    // Avoid duplicate IDs
    const existingIds = new Set(attachedImages.map((img) => img.id));
    const toAdd = newImages.filter((img) => !existingIds.has(img.id));
    setAttachedImages([...attachedImages, ...toAdd]);
  };

  const handleRemoveImage = (imageId) => {
    setAttachedImages(attachedImages.filter((img) => img.id !== imageId));
  };

  const handleAddDocuments = (newDocs) => {
    const existingIds = new Set(attachedDocuments.map((doc) => doc.id));
    const toAdd = newDocs.filter((doc) => !existingIds.has(doc.id));
    setAttachedDocuments([...attachedDocuments, ...toAdd]);
  };

  const handleRemoveDocument = (docId) => {
    setAttachedDocuments(attachedDocuments.filter((doc) => doc.id !== docId));
  };

  // Submission Handler
  const handleSubmit = async () => {
    setErrorMessage('');

    if (!siteLocation.trim()) {
      setErrorMessage('Please specify the site location or sector.');
      return;
    }

    if (!submittedBy.trim()) {
      setErrorMessage('Please enter the reporter/supervisor name.');
      return;
    }

    if (tasks.length === 0) {
      setErrorMessage('Please add at least one work progress task.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitReport({
        siteName,
        siteLocation,
        reportDate,
        submittedBy,
        workShift,
        tasks,
        challenges,
        remarks,
        images: attachedImages,
        documents: attachedDocuments,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit site report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const payload = {
        siteName,
        siteLocation: siteLocation.trim(),
        reportDate,
        submittedBy: submittedBy.trim(),
        workShift,
        tasks,
        challenges: challenges.trim(),
        remarks: remarks.trim(),
        images: attachedImages,
        documents: attachedDocuments,
      };

      if (onSaveDraft) {
        await onSaveDraft(payload);
      } else {
        await reportService.saveDraft(payload);
      }
      if (onCancel) onCancel();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save draft report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="w-full">
      {/* Error Message */}
      {errorMessage ? (
        <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-4 flex-row items-center">
          <Feather name="alert-circle" size={18} color="#E11D48" />
          <Text className="text-xs font-semibold text-rose-700 ml-2.5 flex-1 leading-snug">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      {/* SECTION 1: SITE DETAILS */}
      <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
        <View className="flex-row items-center mb-4">
          <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center mr-2.5">
            <Feather name="map-pin" size={16} color="#F97316" />
          </View>
          <View>
            <Text className="text-sm font-black text-[#172B4D]">
              1. Site & Project Details
            </Text>
            <Text className="text-[11px] text-slate-400 font-medium">
              Location, reporting date, and assigned supervisor
            </Text>
          </View>
        </View>

        {/* Project Selector */}
        <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Project Name
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3.5">
          {CONSTRUCTION_PROJECTS.map((proj) => (
            <TouchableOpacity
              key={proj}
              onPress={() => setSiteName(proj)}
              className={`px-3 py-2 rounded-xl border mr-2 ${
                siteName === proj
                  ? 'bg-orange-500 border-orange-500'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  siteName === proj ? 'text-white' : 'text-slate-700'
                }`}
              >
                {proj}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Site Location */}
        <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Site Location / Work Zone
        </Text>
        <TextInput
          value={siteLocation}
          onChangeText={setSiteLocation}
          placeholder="e.g. Level 4 East Wing Core Slab"
          placeholderTextColor="#94A3B8"
          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold mb-3.5"
        />

        {/* Date & Shift Row */}
        <View className="flex-row mb-3.5">
          <View className="flex-1 mr-2">
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Report Date
            </Text>
            <TextInput
              value={reportDate}
              onChangeText={setReportDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold"
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Submitted By
            </Text>
            <TextInput
              value={submittedBy}
              onChangeText={setSubmittedBy}
              placeholder="Supervisor Name"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#172B4D] font-semibold"
            />
          </View>
        </View>

        {/* Shift Selection */}
        <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Work Shift
        </Text>
        <View className="space-y-1.5">
          {WORK_SHIFTS.map((shift) => (
            <TouchableOpacity
              key={shift}
              onPress={() => setWorkShift(shift)}
              activeOpacity={0.7}
              className={`p-2.5 mb-1.5 rounded-xl border flex-row items-center justify-between ${
                workShift === shift
                  ? 'bg-orange-50 border-orange-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  workShift === shift ? 'text-orange-950 font-bold' : 'text-slate-600'
                }`}
              >
                {shift}
              </Text>
              {workShift === shift ? (
                <Feather name="check-circle" size={15} color="#F97316" />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SECTION 2: WORK PROGRESS & DYNAMIC TASKS */}
      <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center mr-2.5">
              <Feather name="check-square" size={16} color="#059669" />
            </View>
            <View>
              <Text className="text-sm font-black text-[#172B4D]">
                2. Work Progress & Dynamic Tasks
              </Text>
              <Text className="text-[11px] text-slate-400 font-medium">
                Live task metrics and dynamic task entries
              </Text>
            </View>
          </View>
        </View>

        {/* Live Progress Summary Metrics */}
        <View className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-bold text-[#172B4D]">
              Overall Task Completion
            </Text>
            <Text className="text-sm font-black text-orange-600">
              {taskMetrics.percentage}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3">
            <View
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${taskMetrics.percentage}%` }}
            />
          </View>

          {/* 4 Stat Badges */}
          <View className="flex-row justify-between pt-2 border-t border-slate-200">
            <View className="items-center flex-1">
              <Text className="text-sm font-black text-[#172B4D]">
                {taskMetrics.total}
              </Text>
              <Text className="text-[10px] font-semibold text-slate-500">
                Total Tasks
              </Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200" />
            <View className="items-center flex-1">
              <Text className="text-sm font-black text-emerald-600">
                {taskMetrics.completed}
              </Text>
              <Text className="text-[10px] font-semibold text-emerald-700">
                Completed
              </Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200" />
            <View className="items-center flex-1">
              <Text className="text-sm font-black text-amber-600">
                {taskMetrics.inProgress}
              </Text>
              <Text className="text-[10px] font-semibold text-amber-700">
                In Progress
              </Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200" />
            <View className="items-center flex-1">
              <Text className="text-sm font-black text-slate-600">
                {taskMetrics.pending}
              </Text>
              <Text className="text-[10px] font-semibold text-slate-500">
                Pending
              </Text>
            </View>
          </View>
        </View>

        {/* Task Entries List */}
        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Task Entries ({tasks.length})
        </Text>

        {tasks.map((task, idx) => (
          <View
            key={task.id}
            className="p-3 mb-2 rounded-2xl border border-slate-200 bg-white"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <View className="w-5 h-5 rounded-full bg-slate-100 items-center justify-center mr-2">
                  <Text className="text-[10px] font-bold text-slate-600">
                    {idx + 1}
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  className="text-xs font-bold text-[#172B4D] flex-1"
                >
                  {task.title}
                </Text>
              </View>

              {/* Remove Task Button */}
              <TouchableOpacity
                onPress={() => handleRemoveTask(task.id)}
                className="w-7 h-7 rounded-lg bg-rose-50 items-center justify-center"
              >
                <Feather name="trash-2" size={13} color="#E11D48" />
              </TouchableOpacity>
            </View>

            {/* Status Selectors */}
            <View className="flex-row space-x-2 pt-1 border-t border-slate-100">
              <TouchableOpacity
                onPress={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                className={`flex-1 py-1.5 rounded-lg border items-center mr-1 ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    task.status === 'COMPLETED' ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  Completed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                className={`flex-1 py-1.5 rounded-lg border items-center mr-1 ${
                  task.status === 'IN_PROGRESS'
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    task.status === 'IN_PROGRESS' ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  In Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleUpdateTaskStatus(task.id, 'PENDING')}
                className={`flex-1 py-1.5 rounded-lg border items-center ${
                  task.status === 'PENDING'
                    ? 'bg-slate-600 border-slate-600'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    task.status === 'PENDING' ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  Pending
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add New Task Form */}
        <View className="mt-2 pt-3 border-t border-slate-100">
          <View className="flex-row items-center">
            <TextInput
              value={newTaskInput}
              onChangeText={setNewTaskInput}
              placeholder="Enter new site task description..."
              placeholderTextColor="#94A3B8"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#172B4D] font-medium mr-2"
            />
            <TouchableOpacity
              onPress={() => handleAddTask()}
              className="bg-[#172B4D] px-3.5 py-2 rounded-xl items-center justify-center flex-row"
            >
              <Feather name="plus" size={14} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {/* Quick suggestions */}
          <Text className="text-[10px] font-bold text-slate-400 mt-2.5 mb-1.5">
            Quick Add Task Suggestions:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_TASK_SUGGESTIONS.map((sugg) => (
              <TouchableOpacity
                key={sugg}
                onPress={() => handleAddTask(sugg)}
                className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg mr-2"
              >
                <Text className="text-[10px] font-medium text-slate-700">
                  + {sugg}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* SECTION 3: SITE CHALLENGES & REMARKS */}
      <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 items-center justify-center mr-2.5">
            <Feather name="alert-triangle" size={16} color="#D97706" />
          </View>
          <View>
            <Text className="text-sm font-black text-[#172B4D]">
              3. Site Challenges & Remarks
            </Text>
            <Text className="text-[11px] text-slate-400 font-medium">
              Equipment roadblocks, safety issues & shift handovers
            </Text>
          </View>
        </View>

        {/* Challenges or Site Issues */}
        <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Challenges or Site Issues
        </Text>
        <TextInput
          value={challenges}
          onChangeText={setChallenges}
          placeholder="Describe any delays, material shortages, or safety concerns..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#172B4D] font-medium mb-3.5 leading-relaxed"
        />

        {/* Additional Remarks */}
        <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Additional Remarks & Observations
        </Text>
        <TextInput
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Supervisory remarks, handover instructions for next shift..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#172B4D] font-medium leading-relaxed"
        />
      </View>

      {/* SECTION 4: MULTIPLE IMAGE ATTACHMENTS */}
      <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center mr-2.5">
              <Feather name="image" size={16} color="#F97316" />
            </View>
            <View>
              <Text className="text-sm font-black text-[#172B4D]">
                4. Field Photographs ({attachedImages.length})
              </Text>
              <Text className="text-[11px] text-slate-400 font-medium">
                JPG, JPEG, PNG field evidence with live previews
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsImagePickerOpen(true)}
            className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl flex-row items-center"
          >
            <Feather name="camera" size={13} color="#F97316" />
            <Text className="text-[11px] font-bold text-orange-600 ml-1.5">
              + Add Photos
            </Text>
          </TouchableOpacity>
        </View>

        {attachedImages.length === 0 ? (
          <TouchableOpacity
            onPress={() => setIsImagePickerOpen(true)}
            activeOpacity={0.7}
            className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 items-center justify-center"
          >
            <View className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center mb-2">
              <Feather name="upload-cloud" size={18} color="#94A3B8" />
            </View>
            <Text className="text-xs font-bold text-slate-700">
              No field photographs attached yet
            </Text>
            <Text className="text-[11px] text-slate-400 text-center font-medium mt-0.5">
              Tap here or use {'"+ Add Photos"'} to attach visual site evidence
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {attachedImages.map((img) => (
              <View
                key={img.id}
                className="w-[48.5%] bg-slate-50 rounded-2xl border border-slate-200 p-2 mb-2.5"
              >
                <View className="relative">
                  <Image
                    source={{ uri: img.uri }}
                    className="w-full h-24 rounded-xl bg-slate-200"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(img.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 items-center justify-center"
                  >
                    <Feather name="x" size={13} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-[11px] font-bold text-[#172B4D] mt-1.5"
                >
                  {img.title}
                </Text>
                <View className="flex-row items-center justify-between mt-0.5">
                  <Text className="text-[9px] font-bold text-orange-600 uppercase">
                    {img.format}
                  </Text>
                  <Text className="text-[9px] text-slate-400 font-medium">
                    {img.sizeFormatted}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* SECTION 5: DOCUMENT ATTACHMENTS (STRICT < 10 MB) */}
      <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center mr-2.5">
              <Feather name="file-text" size={16} color="#2563EB" />
            </View>
            <View>
              <Text className="text-sm font-black text-[#172B4D]">
                5. Document Attachments ({attachedDocuments.length})
              </Text>
              <Text className="text-[11px] text-slate-400 font-medium">
                Strict &lt; 10 MB limit • PDF, DOC, DOCX, TXT, RTF
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsDocPickerOpen(true)}
            className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl flex-row items-center"
          >
            <Feather name="paperclip" size={13} color="#2563EB" />
            <Text className="text-[11px] font-bold text-blue-600 ml-1.5">
              + Attach Doc
            </Text>
          </TouchableOpacity>
        </View>

        {attachedDocuments.length === 0 ? (
          <TouchableOpacity
            onPress={() => setIsDocPickerOpen(true)}
            activeOpacity={0.7}
            className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 items-center justify-center"
          >
            <View className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center mb-2">
              <Feather name="file-plus" size={18} color="#94A3B8" />
            </View>
            <Text className="text-xs font-bold text-slate-700">
              No document files attached
            </Text>
            <Text className="text-[11px] text-slate-400 text-center font-medium mt-0.5">
              Attach engineer sign-offs, lab test slips, or safety compliance forms
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="space-y-2">
            {attachedDocuments.map((doc) => (
              <View
                key={doc.id}
                className="flex-row items-center justify-between p-3 mb-2 rounded-2xl border border-slate-200 bg-slate-50"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 items-center justify-center mr-2.5">
                    <Feather name="file-text" size={16} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-xs font-bold text-[#172B4D]"
                    >
                      {doc.fileName}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <View className="bg-slate-200 px-1.5 py-0.5 rounded mr-2">
                        <Text className="text-[9px] font-bold text-slate-700 uppercase">
                          {doc.extension}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-slate-500 font-medium">
                        {doc.sizeFormatted}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Remove Document Button */}
                <TouchableOpacity
                  onPress={() => handleRemoveDocument(doc.id)}
                  className="w-7 h-7 rounded-lg bg-rose-50 items-center justify-center"
                >
                  <Feather name="x" size={14} color="#E11D48" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* SUBMISSION & DRAFT BUTTONS */}
      <View className="space-y-2.5">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
          className="bg-orange-500 py-4 rounded-2xl items-center flex-row justify-center shadow-md shadow-orange-300 mb-2"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
          ) : (
            <Feather name="send" size={17} color="#FFFFFF" className="mr-2" />
          )}
          <Text className="text-white text-sm font-black tracking-wide ml-2">
            {isSubmitting ? 'Submitting Report...' : 'Submit Site Report'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveAsDraft}
          disabled={isSubmitting}
          activeOpacity={0.7}
          className="bg-slate-100 border border-slate-300 py-3 rounded-2xl items-center flex-row justify-center mb-1"
        >
          <Feather name="save" size={15} color="#475569" className="mr-2" />
          <Text className="text-slate-700 text-xs font-bold">
            Save as Field Draft
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODALS */}
      <ImagePickerModal
        visible={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onAttachImages={handleAddImages}
        existingImages={attachedImages}
      />

      <DocumentPickerModal
        visible={isDocPickerOpen}
        onClose={() => setIsDocPickerOpen(false)}
        onAttachDocuments={handleAddDocuments}
        existingDocuments={attachedDocuments}
      />
    </View>
  );
}
