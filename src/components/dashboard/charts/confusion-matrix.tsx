
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import GraphExplanation from '../graph-explanation';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';

interface ConfusionMatrixProps {
  audience: Audience;
}

export default function ConfusionMatrix({ audience }: ConfusionMatrixProps) {
  const audienceData = AUDIENCE_DATA[audience];
  const [label1, label2] = audienceData.target.labels;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Confusion Matrix</CardTitle>
                <CardDescription>How well the model's predictions match reality.</CardDescription>
            </div>
            <GraphExplanation 
                graphType="Confusion Matrix"
                dataset={audienceData.datasetLabel}
                algorithmConcept="Model Prediction Accuracy"
                audience={audience}
            />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead></TableHead>
                    <TableHead colSpan={2} className="text-center border-b">Predicted</TableHead>
                    </TableRow>
                    <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead><Badge variant="secondary">{label1}</Badge></TableHead>
                    <TableHead><Badge variant="secondary">{label2}</Badge></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableHead className="text-center"><div className="-rotate-90 "><Badge variant="secondary">{label1}</Badge></div></TableHead>
                        <TableCell className="text-center text-lg font-bold bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400">180</TableCell>
                        <TableCell className="text-center text-lg font-bold bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400">20</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-center"><div className="-rotate-90"><Badge variant="secondary">{label2}</Badge></div></TableHead>
                        <TableCell className="text-center text-lg font-bold bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400">30</TableCell>
                        <TableCell className="text-center text-lg font-bold bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400">270</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="absolute top-[55%] left-0 -translate-y-1/2 -rotate-90 origin-top-left ml-2">
                <p className="font-semibold text-sm text-muted-foreground tracking-wider">Actual</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
