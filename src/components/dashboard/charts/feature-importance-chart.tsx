
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import GraphExplanation from '../graph-explanation';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';

interface FeatureImportanceChartProps {
    data: any[];
    audience: Audience;
}

export default function FeatureImportanceChart({ 
    data, 
    audience
}: FeatureImportanceChartProps) {

  const audienceData = AUDIENCE_DATA[audience];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Which features the model relies on most.</CardDescription>
          </div>
          <GraphExplanation 
            graphType="Bar Chart"
            dataset={audienceData.datasetLabel}
            algorithmConcept="Feature Importance"
            audience={audience}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} width={120} tick={{fontSize: 12}}/>
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Feature
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.feature}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                             Importance
                          </span>
                          <span className="font-bold">
                            {(payload[0].value as number).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
