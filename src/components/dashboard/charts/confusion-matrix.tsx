
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ConfusionMatrix() {
  const matrix = [
    { actual: 'Positive', predicted: 'Positive', value: 180, isCorrect: true },
    { actual: 'Positive', predicted: 'Negative', value: 20, isCorrect: false },
    { actual: 'Negative', predicted: 'Positive', value: 30, isCorrect: false },
    { actual: 'Negative', predicted: 'Negative', value: 270, isCorrect: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confusion Matrix</CardTitle>
        <CardDescription>How well the model's predictions match reality.</CardDescription>
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
                    <TableHead><Badge variant="secondary">Positive</Badge></TableHead>
                    <TableHead><Badge variant="secondary">Negative</Badge></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableHead className="text-center"><div className="-rotate-90 "><Badge variant="secondary">Positive</Badge></div></TableHead>
                        <TableCell className="text-center text-lg font-bold bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400">180</TableCell>
                        <TableCell className="text-center text-lg font-bold bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400">20</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-center"><div className="-rotate-90"><Badge variant="secondary">Negative</Badge></div></TableHead>
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
