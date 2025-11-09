
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trees } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AudienceData } from '@/lib/types';
import * as React from 'react';

interface InteractiveTreeExplorerProps {
    treeId: number;
    audienceData: AudienceData;
}

export default function InteractiveTreeExplorer({ treeId, audienceData }: InteractiveTreeExplorerProps) {
  const [mockTreeData, setMockTreeData] = React.useState<any[]>([]);

  const generateMockData = () => {
    // Full "original" dataset
    const originalData = Array.from({length: 10}).map((_, i) => ({
      id: i + 1,
      feature1: (Math.random() * 100).toFixed(1),
      feature2: (Math.random() * 100).toFixed(1),
      feature3: (Math.random() * 100).toFixed(1),
      target: Math.random() > 0.5 ? audienceData.target.labels[0] : audienceData.target.labels[1]
    }));

    // Create a bootstrap sample by sampling with replacement
    const bootstrapSample = Array.from({ length: originalData.length }).map(() => {
        const randomIndex = Math.floor(Math.random() * originalData.length);
        return originalData[randomIndex];
    });

    setMockTreeData(bootstrapSample);
  };
  
  return (
    <Dialog onOpenChange={(open) => open && generateMockData()}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-20 w-full flex flex-col gap-1 items-center justify-center border-2 border-dashed hover:border-primary hover:bg-accent/10 transition-colors duration-200">
          <Trees className="w-8 h-8 text-primary/70" />
          <span className="text-xs text-muted-foreground">Tree {treeId}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Decision Tree #{treeId}</DialogTitle>
          <DialogDescription>
            Exploring the decisions made by a single tree in the forest. This tree was trained on a random subset of the data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="lg:col-span-3">
                <Card className="h-full shadow-md">
                    <CardHeader>
                        <CardTitle>Decision Structure</CardTitle>
                        <CardDescription>A visual map of this tree's logic.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex items-center justify-center">
                        <svg viewBox="0 0 200 160" className="w-full h-auto">
                            <g>
                                {/* Lines */}
                                <path d="M 100 25 V 55" stroke="hsl(var(--border))" strokeWidth="2" />
                                <path d="M 100 75 L 50 105" stroke="hsl(var(--border))" strokeWidth="2" />
                                <path d="M 100 75 L 150 105" stroke="hsl(var(--border))" strokeWidth="2" />
                                <path d="M 50 125 L 25 145" stroke="hsl(var(--border))" strokeWidth="2" />
                                <path d="M 50 125 L 75 145" stroke="hsl(var(--border))" strokeWidth="2" />

                                {/* Nodes */}
                                <g transform="translate(100, 20)">
                                    <circle r="15" fill="hsl(var(--accent))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9" fill="hsl(var(--accent-foreground))" className="font-bold">Root</text>
                                </g>
                                <g transform="translate(100, 65)">
                                    <rect x="-40" y="-10" width="80" height="20" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9">{audienceData.features[0].name.split(' ')[0]} {'>'} 0.5</text>
                                </g>
                                
                                <g transform="translate(50, 115)">
                                    <rect x="-40" y="-10" width="80" height="20" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9">{audienceData.features[1].name.split(' ')[0]} {'<='} 10</text>
                                </g>

                                <g transform="translate(150, 115)">
                                    <circle r="15" fill="hsl(var(--primary))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9" fill="hsl(var(--primary-foreground))" className="font-bold">Leaf</text>
                                </g>

                                <g transform="translate(25, 150)">
                                    <circle r="15" fill="hsl(var(--primary))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9" fill="hsl(var(--primary-foreground))" className="font-bold">Leaf</text>
                                </g>
                                
                                <g transform="translate(75, 150)">
                                    <circle r="15" fill="hsl(var(--destructive))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9" fill="hsl(var(--primary-foreground))" className="font-bold">Leaf</text>
                                </g>
                            </g>
                        </svg>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="shadow-md h-full">
                    <CardHeader>
                        <CardTitle>Bootstrap Sample</CardTitle>
                        <CardDescription>The data subset this tree was trained on.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sample ID</TableHead>
                                    {audienceData.features.slice(0, 2).map(f => <TableHead key={f.name}>{f.name}</TableHead>)}
                                    <TableHead>{audienceData.target.name}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockTreeData.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.feature1}</TableCell>
                                    <TableCell>{row.feature2}</TableCell>
                                    <TableCell>{row.target}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
