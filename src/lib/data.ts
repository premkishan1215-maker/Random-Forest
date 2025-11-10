import { Tractor, Stethoscope, GraduationCap, Leaf, Spline, Users, Trees } from 'lucide-react';
import type { Audience, AudienceData } from './types';

export const AUDIENCE_DATA: Record<Audience, AudienceData> = {
  Farmer: {
    story: 'Predict which fields will produce a high yield of crops based on factors like rainfall, soil quality, and fertilizer type. Help the farmer make the best decisions for a bountiful harvest.',
    sceneImageId: 'farmer-scene',
    dataUnderstandingImageId: 'data-understanding-farmer',
    datasetLabel: 'Crop Yield Data',
    datasetSummaryIcon: Tractor,
    target: { name: 'Yield', labels: ['High', 'Low'] },
    features: [
      { name: 'Rainfall', values: ['Low', 'Medium', 'High'] },
      { name: 'Soil Type', values: ['Sandy', 'Clay', 'Loam'] },
      { name: 'Fertilizer', values: ['Type A', 'Type B', 'None'] },
    ],
    parameterLabels: {
      n_estimators: 'Number of Expert Farmers',
      max_depth: 'Depth of Soil Study',
      min_samples_split: 'Minimum Fields to Compare',
      min_samples_leaf: 'Minimum Crops per Group',
    },
    metaphors: {
      main: 'A Random Forest is like a team of experienced farmers. Each one looks at the farm differently, but together they make a wise prediction about the harvest.',
      sampling: 'Each farmer gets a slightly different map of the farm, some fields appearing more than once. This helps them get diverse opinions.',
      tree: 'A single farmer makes decisions based on simple rules, like "if rainfall is high and soil is good, then the yield is likely high."',
      forest: 'All the farmers come together, each with their own decision process, forming a forest of opinions.',
      voting: "The farmers vote on the final prediction. The most common vote becomes the final forecast for the farm's yield.",
      evaluation: "We check how many times the farmers' collective prediction matched the actual harvest to see how reliable they are.",
    },
  },
  Doctor: {
    story: 'Predict which patients might have a specific medical condition based on readings like heart rate, blood pressure, and cholesterol levels. Assist doctors in making faster, more accurate diagnoses.',
    sceneImageId: 'doctor-scene',
    dataUnderstandingImageId: 'data-understanding-doctor',
    datasetLabel: 'Patient Health Records',
    datasetSummaryIcon: Stethoscope,
    target: { name: 'Cancer', labels: ['Positive', 'Negative'] },
    features: [
      { name: 'Family History', values: ['Yes', 'No'] },
      { name: 'Smoker', values: ['Yes', 'No'] },
      { name: 'Activity Level', values: ['Low', 'Moderate', 'High'] },
    ],
    parameterLabels: {
      n_estimators: 'Number of Consulting Doctors',
      max_depth: 'Depth of Diagnosis',
      min_samples_split: 'Minimum Patients to Compare',
      min_samples_leaf: 'Minimum Patients per Group',
    },
    metaphors: {
      main: 'A Random Forest is like a panel of specialist doctors. Each doctor examines the patient data, and their combined opinions lead to a more reliable diagnosis.',
      sampling: 'Each doctor receives a random selection of patient files for review, with some cases duplicated to emphasize their importance.',
      tree: 'A single doctor follows a diagnostic flowchart, asking questions like "if heart rate is high and cholesterol is high, then the risk is high."',
      forest: 'The entire panel of doctors forms a "forest" of diagnostic expertise, each contributing their unique perspective.',
      voting: 'The doctors cast their votes on the diagnosis. The majority opinion determines the final medical assessment.',
      evaluation: 'We evaluate the panel by comparing their consensus diagnosis with the actual patient outcomes to measure their accuracy.',
    },
  },
  Student: {
    story: "Predict a student's final exam result based on their study habits, such as hours studied, practice tests taken, and attendance. Help students understand what behaviors lead to success.",
    sceneImageId: 'student-scene',
    dataUnderstandingImageId: 'data-understanding-student',
    datasetLabel: 'Student Performance Data',
    datasetSummaryIcon: GraduationCap,
    target: { name: 'Result', labels: ['Pass', 'Fail'] },
    features: [
      { name: 'Study Method', values: ['Solo', 'Group', 'Tutor'] },
      { name: 'Attended Review', values: ['Yes', 'No'] },
      { name: 'Completed Homework', values: ['Always', 'Sometimes', 'Never'] },
    ],
    parameterLabels: {
      n_estimators: 'Number of Review Tutors',
      max_depth: 'Depth of Study',
      min_samples_split: 'Minimum Students to Compare',
      min_samples_leaf: 'Minimum Students per Group',
    },
    metaphors: {
      main: 'A Random Forest is like a group of tutors grading an exam. Each tutor has a unique way of looking at a student\'s work, but their combined grade is very accurate.',
      sampling: "Each tutor gets a random stack of assignments to grade. Some assignments might be seen by multiple tutors, giving a balanced view.",
      tree: 'A single tutor uses a simple grading rubric, like "if study hours are high and attendance is good, the student will likely pass."',
      forest: 'All the tutors work together, creating a "forest" of grading knowledge, each with their own set of rules.',
      voting: 'The tutors vote on the final grade. The most frequent grade is chosen as the final result for the student.',
      evaluation: "We check the tutors' collective grade against the actual exam results to see how well they predict student success.",
    },
  },
};

export const PARAMETER_ICONS = {
  n_estimators: Trees,
  max_depth: Spline,
  min_samples_split: Users,
  min_samples_leaf: Leaf,
};

// Mock data for charts
export const MOCK_DATA_CHARTS = {
  targetDistribution: [
    { name: 'Positive', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Negative', value: 300, fill: 'hsl(var(--chart-2))' },
  ],
  featureDistribution: [
    { name: 'Low', value: 278 },
    { name: 'Medium', value: 190 },
    { name: 'High', value: 230 },
    { name: 'Very High', value: 200 },
  ],
  scatterData: Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  })),
  featureImportance: [
    { feature: 'Feature 1', importance: 40, fill: 'hsl(var(--chart-1))' },
    { feature: 'Feature 2', importance: 30, fill: 'hsl(var(--chart-2))' },
    { feature: 'Feature 3', importance: 20, fill: 'hsl(var(--chart-3))' },
    { feature: 'Feature 4', importance: 10, fill: 'hsl(var(--chart-4))' },
  ],
  treePredictions: [
    { name: 'Tree 1', Prediction: 'Pass', votes: 1 },
    { name: 'Tree 2', Prediction: 'Fail', votes: 1 },
    { name: 'Tree 3', Prediction: 'Pass', votes: 1 },
    { name: 'Tree 4', Prediction: 'Pass', votes: 1 },
    { name: 'Tree 5', Prediction: 'Fail', votes: 1 },
    { name: 'Tree 6', Prediction: 'Pass', votes: 1 },
    { name: 'Tree 7', Prediction: 'Pass', votes: 1 },
    { name: 'Tree 8', Prediction: 'Pass', votes: 1 },
    { name: 'Tree 9', Prediction: 'Fail', votes: 1 },
    { name: 'Tree 10', Prediction: 'Pass', votes: 1 },
  ],
};
