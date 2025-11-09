
'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Audience, AudienceData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SamplePieChart from './charts/sample-pie-chart';
import SampleBarChart from './charts/sample-bar-chart';
import { MOCK_DATA_CHARTS } from '@/lib/data';
import { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import GraphExplanation from './graph-explanation';


interface DatasetStorySectionProps {
  audienceData: AudienceData;
  audience: Audience;
}

export default function DatasetStorySection({ audienceData, audience }: DatasetStorySectionProps) {
  const sceneImage = PlaceHolderImages.find(img => img.id === audienceData.sceneImageId);

  const [showData, setShowData] = useState(false);

  const handleGenerateData = () => {
    setShowData(true);
  };

  const overviewData = useMemo(() => {
    if (!showData) return [];
    
    return Array.from({length: 3}).map((_, i) => ({
      id: i + 1,
      feature1: (Math.random() * 100).toFixed(1),
      feature2: (Math.random() * 100).toFixed(1),
      feature3: (Math.random() * 100).toFixed(1),
      target: Math.random() > 0.5 ? audienceData.target.labels[0] : audienceData.target.labels[1]
    }));
  }, [showData, audienceData]);

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="relative h-48 w-full md:h-64">
        {sceneImage && (
          <Image
            src={sceneImage.imageUrl}
            alt={sceneImage.description}
            fill
            className="object-cover"
            data-ai-hint={sceneImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-3xl font-headline font-bold text-white">
            The Story: {audienceData.datasetLabel}
          </h2>
          <p className="mt-2 max-w-3xl text-base text-primary-foreground/90 font-body">
            {audienceData.story}
          </p>
        </div>
      </div>
      <CardContent className="p-6">
        {!showData ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
             <audienceData.datasetSummaryIcon className="w-16 h-16 mb-4 text-primary/80" />
            <h3 className="text-xl font-semibold mb-2">Ready to explore the data?</h3>
            <p className="text-muted-foreground mb-4">Generate a synthetic dataset to begin.</p>
            <Button onClick={handleGenerateData}>
              Generate New Data <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Dataset Overview</CardTitle>
                <CardDescription>A small sample of the generated data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {audienceData.features.map(f => <TableHead key={f.name}>{f.name}</TableHead>)}
                      <TableHead>{audienceData.target.name}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overviewData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.feature1}</TableCell>
                        <TableCell>{row.feature2}</TableCell>
                        <TableCell>{row.feature3}</TableCell>
                        <TableCell>{row.target}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle>Target Distribution</CardTitle>
                    <CardDescription>How many samples for each outcome.</CardDescription>
                </div>
                <GraphExplanation
                  graphType="Pie Chart"
                  dataset={audienceData.datasetLabel}
                  algorithmConcept="Target variable distribution"
                  audience={audience}
                />
              </CardHeader>
              <CardContent>
                <SamplePieChart data={MOCK_DATA_CHARTS.targetDistribution} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle>Feature Distribution</CardTitle>
                    <CardDescription>Distribution of the primary feature.</CardDescription>
                </div>
                 <GraphExplanation
                  graphType="Bar Chart"
                  dataset={audienceData.datasetLabel}
                  algorithmConcept="Feature variable distribution"
                  audience={audience}
                />
              </CardHeader>
              <CardContent>
                <SampleBarChart data={MOCK_DATA_CHARTS.featureDistribution} />
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
