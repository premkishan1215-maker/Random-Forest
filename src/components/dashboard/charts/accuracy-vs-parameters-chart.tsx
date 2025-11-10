
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import GraphExplanation from '../graph-explanation';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';

interface AccuracyVsParametersChartProps {
    data: any[];
    audience: Audience;
}

export default function AccuracyVsParametersChart({ 
    data, 
    audience
}: AccuracyVsParametersChartProps) {

  const audienceData = AUDIENCE_DATA[audience];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Accuracy vs. Model Complexity</CardTitle>
            <CardDescription>How accuracy changes as we tweak <code className="text-xs">max_depth</code>.</CardDescription>
          </div>
          <GraphExplanation 
            graphType="Line Chart"
            dataset={audienceData.datasetLabel}
            algorithmConcept="Model Tuning and Overfitting"
            audience={audience}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="parameterValue"
              label={{ value: 'Max Depth', position: 'insideBottom', offset: -5 }} 
              />
            <YAxis 
                label={{ value: 'Accuracy', angle: -90, position: 'insideLeft' }}
                domain={[0.6, 1]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <p className="font-bold">{`Max Depth: ${label}`}</p>
                      <p className="text-sm text-primary">{`Accuracy: ${(payload[0].value as number * 100).toFixed(1)}%`}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }}/>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
