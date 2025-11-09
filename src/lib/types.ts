
import type { LucideIcon } from 'lucide-react';

export type Audience = 'Farmer' | 'Doctor' | 'Student';

export type AudienceData = {
  story: string;
  sceneImageId: string;
  dataUnderstandingImageId: string;
  datasetLabel: string;
  datasetSummaryIcon: LucideIcon;
  target: {
    name: string;
    labels: string[];
  };
  features: {
    name: string;
    unit: string;
  }[];
  parameterLabels: {
    n_estimators: string;
    max_depth: string;
    min_samples_split: string;
    min_samples_leaf: string;
  };
  metaphors: {
    main: string;
    sampling: string;
    tree: string;
    forest: string;
    voting: string;
    evaluation: string;
  };
};
