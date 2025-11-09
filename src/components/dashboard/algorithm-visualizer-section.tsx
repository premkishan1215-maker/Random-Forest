

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
import { ArrowRight, Box, GitMerge, Spline, Vote, CheckCircle, ListTree, Target } from 'lucide-react';
import InteractiveTreeExplorer from './interactive-tree-explorer';
import ParameterPlaygroundSection from './parameter-playground-section';

interface AlgorithmVisualizerSectionProps {
    audience: Audience;
    audienceData: AudienceData;
    parameters: {
        n_estimators: number;
        max_depth: number;
        min_samples_split: number;
        min_samples_leaf: number;
    };
    setParameters: React.Dispatch<React.SetStateAction<{
        n_estimators: number;
        max_depth: number;
        min_samples_split: number;
        min_samples_leaf: number;
    }>>;
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


export default function AlgorithmVisualizerSection({ audience, audienceData, parameters, setParameters }: AlgorithmVisualizerSectionProps) {
    const dataUnderstandingImage = PlaceHolderImages.find(img => img.id === audienceData.dataUnderstandingImageId);
    const [activeTab, setActiveTab] = React.useState("stage1");

    const stages = [
      { id: 'stage1', name: 'Data Understanding', icon: Box },
      { id: 'stage2', name: 'Building Trees', icon: Spline },
      { id: 'stage3', name: 'Forest Formation', icon: GitMerge },
      { id: 'stage4', name: 'Voting', icon: Vote },
      { id: 'stage5', name: 'Evaluation', icon: CheckCircle },
    ];
    
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">How a Random Forest Works</CardTitle>
                <CardDescription>A step-by-step visual guide to the algorithm.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
                        {stages.map(stage => (
                             <TabsTrigger key={stage.id} value={stage.id} className="flex-col h-16 gap-1">
                                <stage.icon className="w-5 h-5"/>
                                <span className="text-xs hidden sm:block">{stage.name}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="mt-4 p-4 border rounded-md min-h-[400px]">
                        <TabsContent value="stage1">
                             <CardHeader className="p-0 mb-4">
                                <CardTitle>Stage 1: Understanding the Data</CardTitle>
                                <CardDescription>First, we get to know our data, just like a {audience.toLowerCase()} studies the {audience === 'Farmer' ? 'land' : audience === 'Doctor' ? 'patient chart' : 'textbook'}.</CardDescription>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-4">
                                    <h3 className="font-semibold text-lg">Dataset: {audienceData.datasetLabel}</h3>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md flex items-center gap-2"><Target className="w-5 h-5 text-primary"/> Prediction Goal (Target Feature)</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span>Our goal is to predict the <strong className="text-primary">{audienceData.target.name}</strong>, which can be</span>
                                                <Badge variant="secondary">{audienceData.target.labels[0]}</Badge>
                                                <span>or</span>
                                                <Badge variant="secondary">{audienceData.target.labels[1]}</Badge>.
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md flex items-center gap-2"><ListTree className="w-5 h-5 text-primary"/> Key Factors (Input Features)</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="list-disc list-inside space-y-1">
                                                {audienceData.features.map(feature => (
                                                    <li key={feature.name}>
                                                        <strong>{feature.name}</strong>
                                                        {feature.unit && <span className="text-muted-foreground text-sm"> (in {feature.unit})</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="flex items-center justify-center">
                                    {dataUnderstandingImage && <Image src={dataUnderstandingImage.imageUrl} alt={dataUnderstandingImage.description} width={300} height={200} className="rounded-lg shadow-md" data-ai-hint={dataUnderstandingImage.imageHint} />}
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <CardHeader className="p-0">
                                        <CardTitle>Stage 2: Building a Decision Tree</CardTitle>
                                        <CardDescription>{audienceData.metaphors.tree}</CardDescription>
                                    </CardHeader>
                                    <div className="p-6 text-center">
                                        <AnimatedTree key={parameters.max_depth} depth={parameters.max_depth}/>
                                        <p className="text-center text-sm mt-4 text-muted-foreground">A tree grows by splitting data based on feature rules.</p>
                                    </div>
                                </div>
                                <div>
                                    <ParameterPlaygroundSection relevantParams={['max_depth']} audienceData={audienceData} parameters={parameters} setParameters={setParameters} />
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <CardHeader className="p-0">
                                        <CardTitle>Stage 3: Forest Formation</CardTitle>
                                        <CardDescription>{audienceData.metaphors.forest}</CardDescription>
                                    </CardHeader>
                                    <div className="p-6">
                                        <div className="grid grid-cols-5 gap-4">
                                            {Array.from({ length: parameters.n_estimators }).map((_, i) => (
                                                <InteractiveTreeExplorer key={i} treeId={i+1} audienceData={audienceData} />
                                            ))}
                                        </div>
                                        <p className="text-center text-sm mt-4 text-muted-foreground">Multiple trees are built to form a "forest". Click a tree to explore it.</p>
                                    </div>
                                </div>
                                <div>
                                    <ParameterPlaygroundSection relevantParams={['n_estimators']} audienceData={audienceData} parameters={parameters} setParameters={setParameters} />
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage4">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 4: Voting & Final Decision</CardTitle>
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
                        
                        <TabsContent value="stage5">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 5: Model Evaluation</CardTitle>
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
                         }} disabled={activeTab === 'stage5'}>
                            Next Stage <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
