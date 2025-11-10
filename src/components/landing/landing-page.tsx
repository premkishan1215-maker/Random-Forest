
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trees, ArrowRight, Tractor, Stethoscope, GraduationCap, GitMerge, AlertTriangle, Lightbulb } from 'lucide-react';
import * as React from 'react';
import type { Audience } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '../ui/separator';

const audienceOptions: { value: Audience; label: string; icon: React.ElementType }[] = [
  { value: 'Farmer', label: 'Farmer', icon: Tractor },
  { value: 'Doctor', label: 'Doctor', icon: Stethoscope },
  { value: 'Student', label: 'Student', icon: GraduationCap },
];

interface LandingPageProps {
  onGetStarted: () => void;
  audience: Audience;
  onAudienceChange: (audience: Audience) => void;
}

export default function LandingPage({ onGetStarted, audience, onAudienceChange }: LandingPageProps) {

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
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-4 w-full">
                      <span className="text-md font-medium text-muted-foreground whitespace-nowrap">Choose Your Audience:</span>
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
                    <Button size="lg" onClick={onGetStarted} className="w-full">
                      Explore the Algorithm <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 opacity-0 text-left" style={{ animation: 'fadeInUp 0.5s ease-out 0.9s forwards' }}>
          <Card className="shadow-lg">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
                  <Trees className="w-7 h-7 text-primary"/>
                  Random Forest
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Random Forest is a method that uses many decision trees together to make better and more correct predictions.
                  Each tree gives its own answer, and the final result is decided by majority vote — like taking the opinion of many people instead of just one.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
                  <GitMerge className="w-7 h-7 text-accent" />
                  Decision Tree
                </h2>
                <p className="mt-2 text-muted-foreground">
                  A Decision Tree is like a flowchart that helps make decisions step by step.
                  Each question (node) divides the data into smaller parts until it reaches an answer at the end (leaf).
                </p>
                <Card className="mt-4 bg-muted/50">
                  <CardContent className="p-4">
                    <p className="font-semibold">Example:</p>
                    <p className="font-code mt-2 text-sm">
                      Is blood sugar &gt; 140?<br/>
                      If <span className="text-green-600 font-bold">yes</span> → Diabetes<br/>
                      If <span className="text-red-600 font-bold">no</span> → No Diabetes
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3 text-destructive">
                      <AlertTriangle className="w-6 h-6" />
                      Limitations of a Decision Tree
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Can make mistakes easily (overfitting)</li>
                      <li>Changes if data changes a little (unstable)</li>
                      <li>May not give correct results for all cases (less accurate)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                   <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3 text-primary">
                      <Lightbulb className="w-6 h-6" />
                      Why We Need Random Forest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>It gives more accurate results</li>
                      <li>It is more stable and less affected by small changes</li>
                      <li>It avoids mistakes made by a single tree</li>
                      <li>It combines many trees to make a better final decision</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
