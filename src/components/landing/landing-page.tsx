
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trees, ArrowRight, TreeDeciduous, Users, Vote, Database, Tractor, Stethoscope, GraduationCap } from 'lucide-react';
import * as React from 'react';
import type { Audience, AudienceData } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const audienceOptions: { value: Audience; label: string; icon: React.ElementType }[] = [
  { value: 'Farmer', label: 'Farmer', icon: Tractor },
  { value: 'Doctor', label: 'Doctor', icon: Stethoscope },
  { value: 'Student', label: 'Student', icon: GraduationCap },
];

const AnimatedIcon = ({ icon: Icon, delay, text }: { icon: React.ElementType, delay: number, text: string }) => (
  <div
    className="flex flex-col items-center gap-2 opacity-0"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s forwards` }}
  >
    <Icon className="w-12 h-12 text-primary" />
    <span className="text-sm font-semibold text-center">{text}</span>
  </div>
);

interface LandingPageProps {
  onGetStarted: () => void;
  audience: Audience;
  onAudienceChange: (audience: Audience) => void;
  isDataGenerated: boolean;
  onGenerateData: () => void;
  audienceData: AudienceData;
}

export default function LandingPage({ onGetStarted, audience, onAudienceChange, isDataGenerated, onGenerateData, audienceData }: LandingPageProps) {
  
  const [overviewData, setOverviewData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (isDataGenerated) {
        const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
        const generatedData = Array.from({length: 15}).map((_, i) => ({
          id: i + 1,
          feature1: getRandomItem(audienceData.features[0].values || []),
          feature2: getRandomItem(audienceData.features[1].values || []),
          feature3: getRandomItem(audienceData.features[2].values || []),
          target: Math.random() > 0.5 ? audienceData.target.labels[0] : audienceData.target.labels[1]
        }));
        setOverviewData(generatedData);
    }
  }, [isDataGenerated, audienceData]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 text-center overflow-hidden">
       <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
      `}</style>

      <div className="max-w-4xl w-full">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-4 md:p-8">
            <div className="flex justify-center mb-6 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s forwards' }}>
              <Trees className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.3s forwards' }}>
              Welcome to Forest Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.5s forwards' }}>
              Ever wondered how many small decisions can lead to one great one? Let's explore the Random Forest algorithm in a simple, visual way.
            </p>

            <div className="opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.7s forwards' }}>
              <Card className="shadow-lg max-w-lg mx-auto">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-4 mb-6 w-full">
                    <span className="text-md font-medium text-muted-foreground">Choose Your Audience:</span>
                    <Select
                      value={audience}
                      onValueChange={(value: Audience) => onAudienceChange(value)}
                    >
                      <SelectTrigger className="w-full font-semibold">
                        <SelectValue placeholder="Choose Audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!isDataGenerated ? (
                    <>
                      <Database className="w-12 h-12 mb-4 text-primary/80" />
                      <h2 className="text-xl font-headline font-bold mb-2">Generate Your Dataset</h2>
                      <p className="text-muted-foreground mb-6 max-w-md text-sm">
                        To begin, generate a synthetic dataset tailored for the <strong className="text-primary">{audience}</strong> audience.
                      </p>
                      <Button size="lg" onClick={onGenerateData}>
                        Generate Dataset <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </>
                  ) : (
                    <div className="w-full">
                      <h3 className="font-bold mb-4">Generated Sample Data for {audience}</h3>
                      <div className="max-h-60 overflow-y-auto border rounded-md">
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
                      </div>
                       <Button size="lg" onClick={onGetStarted} className="mt-6">
                          Explore the Algorithm <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
