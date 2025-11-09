
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FeatureImportanceChartProps {
    data: any[];
    title?: string;
    xAxisKey?: string;
    barKey?: string;
    barSize?: number;
}

export default function FeatureImportanceChart({ 
    data, 
    title = "Feature Importance", 
    xAxisKey = "feature", 
    barKey = "importance",
    barSize = 40
}: FeatureImportanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Which features the model relies on most.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey={xAxisKey} type="category" axisLine={false} tickLine={false} width={80} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {xAxisKey.charAt(0).toUpperCase() + xAxisKey.slice(1)}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload[xAxisKey]}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                             {barKey.charAt(0).toUpperCase() + barKey.slice(1)}
                          </span>
                          <span className="font-bold">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey={barKey} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={barSize} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
