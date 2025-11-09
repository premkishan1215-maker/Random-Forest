
'use client';

import * as React from 'react';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DatasetStorySection from '@/components/dashboard/dataset-story-section';
import AlgorithmVisualizerSection from '@/components/dashboard/algorithm-visualizer-section';
import ParameterPlaygroundSection from '@/components/dashboard/parameter-playground-section';
import LearningSummarySection from '@/components/dashboard/learning-summary-section';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [audience, setAudience] = React.useState<Audience>('Farmer');
  const [key, setKey] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const audienceData = AUDIENCE_DATA[audience];

  const handleAudienceChange = (newAudience: Audience) => {
    setAudience(newAudience);
    setKey(prevKey => prevKey + 1); // Re-mount components to reset animations and state
  };

  const [parameters, setParameters] = React.useState({
    n_estimators: 10,
    max_depth: 5,
    min_samples_split: 2,
    min_samples_leaf: 1,
  });

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader
        audience={audience}
        onAudienceChange={handleAudienceChange}
      />
      <main key={key} className="flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-12">
            <DatasetStorySection audienceData={audienceData} audience={audience} />
          </div>

          <div className="xl:col-span-8">
             <AlgorithmVisualizerSection audience={audience} audienceData={audienceData} parameters={parameters} />
          </div>
          
          <div className="xl:col-span-4">
            <div className="flex flex-col gap-6">
               <ParameterPlaygroundSection audienceData={audienceData} parameters={parameters} setParameters={setParameters} />
               <LearningSummarySection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
