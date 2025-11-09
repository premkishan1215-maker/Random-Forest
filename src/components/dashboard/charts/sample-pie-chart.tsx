
'use client';

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SamplePieChartProps {
    data: any[];
}

export default function SamplePieChart({ data }: SamplePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <p className="font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          stroke="hsl(var(--border))"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Legend iconSize={12} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
