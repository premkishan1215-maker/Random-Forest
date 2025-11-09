
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
  const [isDataGenerated, setIsDataGenerated] = React.useState(false);
  const [showDashboard, setShowDashboard] = React.useState(false);


  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const audienceData = AUDIENCE_DATA[audience];

  const handleAudienceChange = (newAudience: Audience) => {
    setAudience(newAudience);
    setIsDataGenerated(false); // Reset data generation when audience changes
    setKey(prevKey => prevKey + 1);
  };
  
  const handleGenerateData = () => {
    setIsDataGenerated(true);
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
        isDataGenerated={isDataGenerated}
        onGenerateData={handleGenerateData}
        onGetStarted={() => setShowDashboard(true)}
        audienceData={audienceData}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader
        audience={audience}
        onAudienceChange={handleAudienceChange}
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
               />
            </div>
          </div>
      </main>
    </div>
  );
}
