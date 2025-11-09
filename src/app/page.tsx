
'use client';

import * as React from 'react';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DatasetStorySection from '@/components/dashboard/dataset-story-section';
import AlgorithmVisualizerSection from '@/components/dashboard/algorithm-visualizer-section';
import LandingPage from '@/components/landing/landing-page';

export default function Home() {
  const [audience, setAudience] = React.useState<Audience>('Farmer');
  const [key, setKey] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [generatedData, setGeneratedData] = React.useState<any[]>([]);

  React.useEffect(() => {
    setIsClient(true);
    // Generate initial data when component mounts for the first time
    handleGenerateData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const audienceData = AUDIENCE_DATA[audience];

  const handleAudienceChange = (newAudience: Audience) => {
    setAudience(newAudience);
    setGeneratedData([]); // Reset data when audience changes
    setKey(prevKey => prevKey + 1);
    // Regenerate data for the new audience
    handleGenerateData(AUDIENCE_DATA[newAudience]);
  };
  
  const handleGenerateData = (currentAudienceData = audienceData) => {
    const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const data = Array.from({ length: 100 }).map((_, i) => ({
      id: i + 1,
      feature1: getRandomItem(currentAudienceData.features[0].values || []),
      feature2: getRandomItem(currentAudienceData.features[1].values || []),
      feature3: getRandomItem(currentAudienceData.features[2].values || []),
      target: Math.random() > 0.5 ? currentAudienceData.target.labels[0] : currentAudienceData.target.labels[1]
    }));
    setGeneratedData(data);
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

  if (!showDashboard) {
    return (
      <LandingPage
        audience={audience}
        onAudienceChange={handleAudienceChange}
        onGetStarted={() => setShowDashboard(true)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader
        audience={audience}
      />
      <main key={key} className="flex-grow p-4 md:p-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
              <DatasetStorySection audienceData={audienceData} />
            </div>

            <div className="col-span-1">
               <AlgorithmVisualizerSection 
                  audience={audience} 
                  audienceData={audienceData} 
                  parameters={parameters} 
                  setParameters={setParameters}
                  onGenerateData={handleGenerateData}
                  generatedData={generatedData}
               />
            </div>
          </div>
      </main>
    </div>
  );
}
