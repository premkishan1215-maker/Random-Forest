
'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Audience, AudienceData } from '@/lib/types';
import { MOCK_DATA_CHARTS } from '@/lib/data';
import FeatureImportanceChart from './charts/feature-importance-chart';
import ConfusionMatrix from './charts/confusion-matrix';
import { ArrowRight, Box, GitCommit, GitMerge, Spline, Vote, CheckCircle, RefreshCw } from 'lucide-react';
import InteractiveTreeExplorer from './interactive-tree-explorer';

interface AlgorithmVisualizerSectionProps {
    audience: Audience;
    audienceData: AudienceData;
    parameters: {
        n_estimators: number;
        max_depth: number;
        min_samples_split: number;
        min_samples_leaf: number;
    };
}

const AnimatedTree = ({ depth }: { depth: number }) => {
    const renderNode = (level: number, cx: number, cy: number, key:string) => {
        if (level > depth) return null;
        const children = [];
        const nextCy = cy + 60;
        const xOffset = 120 / (level + 1);

        const leftCx = cx - xOffset;
        const rightCx = cx + xOffset;

        if (level < depth) {
            children.push(<line key={`${key}-l-line`} x1={cx} y1={cy} x2={leftCx} y2={nextCy} className="stroke-muted-foreground tree-path" style={{ animationDelay: `${level * 0.2}s` }} />);
            children.push(renderNode(level + 1, leftCx, nextCy, `${key}-l`));
            children.push(<line key={`${key}-r-line`} x1={cx} y1={cy} x2={rightCx} y2={nextCy} className="stroke-muted-foreground tree-path" style={{ animationDelay: `${level * 0.2}s` }} />);
            children.push(renderNode(level + 1, rightCx, nextCy, `${key}-r`));
        }

        const isLeaf = level === depth;

        return (
            <g key={key}>
                {children}
                <circle cx={cx} cy={cy} r={isLeaf ? 8 : 10} className={`tree-node ${isLeaf ? 'fill-primary' : 'fill-accent'}`} style={{ animationDelay: `${level * 0.25}s` }} />
                <text x={cx} y={cy - 15} textAnchor="middle" className="text-xs fill-foreground tree-node" style={{ animationDelay: `${level * 0.25}s` }}>
                    {isLeaf ? 'Leaf' : `Split`}
                </text>
            </g>
        );
    };

    return (
        <svg viewBox="0 0 300 250" className="w-full h-auto">
            {renderNode(1, 150, 20, 'root')}
        </svg>
    );
};

const BootstrapSampler = ({ audienceData }: { audienceData: AudienceData }) => {
    const originalData = React.useMemo(() => Array.from({ length: 5 }, (_, i) => ({
        id: i,
        f1: (Math.random() * 100).toFixed(1),
        f2: (Math.random() * 100).toFixed(1),
        f3: (Math.random() * 100).toFixed(1),
        target: audienceData.target.labels[Math.random() > 0.5 ? 0 : 1]
    })), [audienceData]);

    const [bootstrapSample, setBootstrapSample] = React.useState<typeof originalData>([]);
    const [animationKey, setAnimationKey] = React.useState(0);

    const generateSample = React.useCallback(() => {
        const sample = Array.from({ length: 5 }, () => {
            const randomIndex = Math.floor(Math.random() * originalData.length);
            return { ...originalData[randomIndex], uniqueId: Math.random() };
        });
        setBootstrapSample(sample);
        setAnimationKey(prev => prev + 1);
    }, [originalData]);

    React.useEffect(() => {
        generateSample();
    }, [generateSample]);

    const DataRow = ({ rowData, isHeader = false, isHighlighted = false }: { rowData: any, isHeader?: boolean, isHighlighted?: boolean }) => (
        <div className={`grid grid-cols-4 gap-2 p-2 text-xs rounded-md ${isHeader ? 'font-bold bg-muted' : 'border'} ${isHighlighted ? 'animate-jump-sample' : ''}`}>
            <div>{rowData.f1}</div>
            <div>{rowData.f2}</div>
            <div>{rowData.f3}</div>
            <div>{rowData.target}</div>
        </div>
    );

    const HeaderRow = () => (
         <div className="grid grid-cols-4 gap-2 p-2 text-xs rounded-md font-bold bg-muted">
            <div>{audienceData.features[0].name}</div>
            <div>{audienceData.features[1].name}</div>
            <div>{audienceData.features[2].name}</div>
            <div>{audienceData.target.name}</div>
        </div>
    );

    return (
        <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                    <h4 className="font-semibold text-center mb-2">Original Dataset</h4>
                    <div className="space-y-2 rounded-lg border p-2 bg-secondary/50">
                        <HeaderRow />
                        {originalData.map((row) => (
                            <DataRow key={row.id} rowData={row} />
                        ))}
                    </div>
                </div>
                <div className="relative">
                     <h4 className="font-semibold text-center mb-2">Bootstrap Sample (for 1 Tree)</h4>
                     <div className="space-y-2 rounded-lg border p-2" key={animationKey}>
                        <HeaderRow />
                        {bootstrapSample.map((row, index) => (
                           <DataRow key={row.uniqueId} rowData={row} isHighlighted={true} />
                        ))}
                    </div>
                    <ArrowRight className="absolute top-1/2 left-[-40px] -translate-y-1/2 w-8 h-8 text-primary hidden lg:block" />
                </div>
            </div>
             <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground mb-2">Rows are picked randomly from the original data to create a new dataset. Notice how some rows are duplicated and others are missing.</p>
                <Button onClick={generateSample} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Sample
                </Button>
            </div>
        </div>
    );
};


export default function AlgorithmVisualizerSection({ audience, audienceData, parameters }: AlgorithmVisualizerSectionProps) {
    const dataUnderstandingImage = PlaceHolderImages.find(img => img.id === audienceData.dataUnderstandingImageId);
    const [activeTab, setActiveTab] = React.useState("stage1");

    const stages = [
      { id: 'stage1', name: 'Data Understanding', icon: Box },
      { id: 'stage2', name: 'Sampling', icon: GitCommit },
      { id: 'stage3', name: 'Building Trees', icon: Spline },
      { id: 'stage4', name: 'Forest Formation', icon: GitMerge },
      { id: 'stage5', name: 'Voting', icon: Vote },
      { id: 'stage6', name: 'Evaluation', icon: CheckCircle },
    ];
    
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">How a Random Forest Works</CardTitle>
                <CardDescription>A step-by-step visual guide to the algorithm.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
                        {stages.map(stage => (
                             <TabsTrigger key={stage.id} value={stage.id} className="flex-col h-16 gap-1">
                                <stage.icon className="w-5 h-5"/>
                                <span className="text-xs hidden sm:block">{stage.name}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="mt-4 p-4 border rounded-md min-h-[400px]">
                        <TabsContent value="stage1">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 1: Data Understanding</CardTitle>
                                <CardDescription>First, we get to know our data, just like a {audience.toLowerCase()} studies the {audience === 'Farmer' ? 'land' : audience === 'Doctor' ? 'patient chart' : 'textbook'}.</CardDescription>
                            </CardHeader>
                            <div className="flex items-center justify-center p-6 mt-4">
                                {dataUnderstandingImage && <Image src={dataUnderstandingImage.imageUrl} alt={dataUnderstandingImage.description} width={300} height={200} className="rounded-lg shadow-md" data-ai-hint={dataUnderstandingImage.imageHint} />}
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage2">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle>Stage 2: Sampling with Replacement (Bootstrap)</CardTitle>
                                <CardDescription>{audienceData.metaphors.sampling}</CardDescription>
                            </CardHeader>
                            <BootstrapSampler audienceData={audienceData} />
                        </TabsContent>

                        <TabsContent value="stage3">
                             <CardHeader className="p-0">
                                <CardTitle>Stage 3: Building a Decision Tree</CardTitle>
                                <CardDescription>{audienceData.metaphors.tree}</CardDescription>
                            </CardHeader>
                             <div className="p-6 text-center">
                                 <AnimatedTree depth={parameters.max_depth}/>
                                 <p className="text-center text-sm mt-4 text-muted-foreground">A tree grows by splitting data based on feature rules.</p>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage4">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 4: Forest Formation</CardTitle>
                                <CardDescription>{audienceData.metaphors.forest}</CardDescription>
                            </CardHeader>
                            <div className="p-6">
                                <div className="grid grid-cols-5 gap-4">
                                    {Array.from({ length: parameters.n_estimators }).map((_, i) => (
                                        <InteractiveTreeExplorer key={i} treeId={i+1} />
                                    ))}
                                </div>
                                <p className="text-center text-sm mt-4 text-muted-foreground">Multiple trees are built to form a "forest". Click a tree to explore it.</p>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage5">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 5: Voting & Final Decision</CardTitle>
                                <CardDescription>{audienceData.metaphors.voting}</CardDescription>
                            </CardHeader>
                            <div className="p-6">
                                <FeatureImportanceChart data={MOCK_DATA_CHARTS.treePredictions} xAxisKey="Prediction" barKey="votes" title="Each Tree's Vote" />
                                <div className="text-center mt-6">
                                    <p className="text-muted-foreground">The forest predicts...</p>
                                    <Badge className="text-xl font-bold py-2 px-4 mt-2 bg-primary text-primary-foreground">
                                        {audienceData.target.labels[0]}
                                    </Badge>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage6">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 6: Model Evaluation</CardTitle>
                                <CardDescription>{audienceData.metaphors.evaluation}</CardDescription>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <ConfusionMatrix />
                                <FeatureImportanceChart data={MOCK_DATA_CHARTS.featureImportance} />
                            </div>
                        </TabsContent>
                    </div>

                    <div className="flex justify-end mt-4">
                         <Button onClick={() => {
                            const currentIndex = stages.findIndex(s => s.id === activeTab);
                            if (currentIndex < stages.length - 1) {
                                setActiveTab(stages[currentIndex + 1].id);
                            }
                         }} disabled={activeTab === 'stage6'}>
                            Next Stage <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    