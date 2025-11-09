
'use client';

import * as React from 'react';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DatasetStorySection from '@/components/dashboard/dataset-story-section';
import AlgorithmVisualizerSection from '@/components/dashboard/algorithm-visualizer-section';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    return <LandingPage onGetStarted={() => setShowDashboard(true)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader
        audience={audience}
        onAudienceChange={handleAudienceChange}
      />
      <main key={key} className="flex-grow p-4 md:p-8">
        {!isDataGenerated ? (
           <Card className="shadow-lg animate-fade-in">
              <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                <Database className="w-16 h-16 mb-4 text-primary/80" />
                <h2 className="text-2xl font-headline font-bold mb-2">Generate Your Dataset</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  To begin your journey into the Random Forest algorithm, first generate a synthetic dataset tailored for the <strong className="text-primary">{audience}</strong> audience.
                </p>
                <Button size="lg" onClick={handleGenerateData}>
                  Generate Dataset <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
        ) : (
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
        )}
      </main>
    </div>
  );
}
