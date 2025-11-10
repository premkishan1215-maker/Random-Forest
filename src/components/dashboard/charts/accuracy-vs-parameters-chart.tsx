
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
            <CardTitle>Accuracy vs. Number of Estimators</CardTitle>
            <CardDescription>How accuracy changes as we add more trees (<code className="text-xs">n_estimators</code>).</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="parameterValue"
              label={{ value: 'Number of Estimators', position: 'insideBottom', offset: -5 }} 
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
                      <p className="font-bold">{`# of Estimators: ${label}`}</p>
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
