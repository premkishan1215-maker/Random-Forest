
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
import FeatureImportanceChart from './charts/feature-importance-chart';
import { MOCK_DATA_CHARTS } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

interface InteractiveTreeExplorerProps {
    treeId: number;
}

export default function InteractiveTreeExplorer({ treeId }: InteractiveTreeExplorerProps) {
  return (
    <Dialog>
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
            Exploring the decisions made by a single tree in the forest.
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
                                    <text textAnchor="middle" dy=".3em" fontSize="9">F1 {'>'} 0.5</text>
                                </g>
                                
                                <g transform="translate(50, 115)">
                                    <rect x="-40" y="-10" width="80" height="20" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                                    <text textAnchor="middle" dy=".3em" fontSize="9">F2 {'<='} 10</text>
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
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>This Tree's Vote</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-around items-center pt-2">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Predicts 'Pass'</p>
                            <p className="text-3xl font-bold text-primary">65%</p>
                        </div>
                        <Separator orientation="vertical" className="h-16" />
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Predicts 'Fail'</p>
                            <p className="text-3xl font-bold text-destructive">35%</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Key Features</CardTitle>
                        <CardDescription>Feature importance for this tree.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FeatureImportanceChart data={MOCK_DATA_CHARTS.featureImportance.slice(0,2)} barSize={20} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
