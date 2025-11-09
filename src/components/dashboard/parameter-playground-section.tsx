
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import type { AudienceData } from '@/lib/types';
import { PARAMETER_ICONS } from '@/lib/data';

interface ParameterPlaygroundSectionProps {
  audienceData: AudienceData;
  parameters: { [key: string]: number };
  setParameters: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

export default function ParameterPlaygroundSection({
  audienceData,
  parameters,
  setParameters,
}: ParameterPlaygroundSectionProps) {

    const handleSliderChange = (name: string, value: number[]) => {
        setParameters(prev => ({...prev, [name]: value[0]}));
    };

    const paramConfig = {
        n_estimators: { min: 1, max: 20, step: 1 },
        max_depth: { min: 1, max: 10, step: 1 },
        min_samples_split: { min: 2, max: 10, step: 1 },
        min_samples_leaf: { min: 1, max: 10, step: 1 },
    };

    const relevantParams = {
        max_depth: audienceData.parameterLabels.max_depth,
    };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Parameter Playground</CardTitle>
        <CardDescription>Adjust the settings to see how a tree changes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {Object.entries(relevantParams).map(([key, label]) => {
           const Icon = PARAMETER_ICONS[key as keyof typeof PARAMETER_ICONS] || (() => null);
           const config = paramConfig[key as keyof typeof paramConfig];

           if (!config) return null;
          
           return (
            <div key={key} className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor={key} className="flex items-center gap-2 text-base">
                  <Icon className="w-4 h-4 text-primary" />
                  <span><code className="text-sm font-code bg-muted px-1 py-0.5 rounded-sm">{key}</code> [{label}]</span>
                </Label>
                <Badge variant="secondary" className="text-sm">{parameters[key]}</Badge>
              </div>
              <Slider
                id={key}
                min={config.min}
                max={config.max}
                step={config.step}
                value={[parameters[key]]}
                onValueChange={(value) => handleSliderChange(key, value)}
              />
            </div>
           )
        })}
      </CardContent>
    </Card>
  );
}
