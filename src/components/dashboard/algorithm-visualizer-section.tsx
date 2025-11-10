
'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Audience, AudienceData } from '@/lib/types';
import FeatureImportanceChart from './charts/feature-importance-chart';
import ConfusionMatrix from './charts/confusion-matrix';
import { ArrowRight, Box, GitMerge, Spline, Vote, CheckCircle, ListTree, Target, RefreshCw } from 'lucide-react';
import InteractiveTreeExplorer from './interactive-tree-explorer';
import ParameterPlaygroundSection from './parameter-playground-section';
import SampleBarChart from './charts/sample-bar-chart';
import AccuracyVsParametersChart from './charts/accuracy-vs-parameters-chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


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
    onGenerateData: () => void;
    generatedData: any[];
}

type TreeNode = {
    id: string;
    type: 'split' | 'leaf';
    condition?: string;
    value?: string;
    children?: TreeNode[];
};

const generateRandomTree = (audienceData: AudienceData, maxDepth = 3, currentDepth = 1): TreeNode => {
    const id = `${currentDepth}-${Math.random()}`;
    
    if (currentDepth >= maxDepth || (currentDepth > 1 && Math.random() < 0.4)) {
        return {
            id,
            type: 'leaf',
            value: Math.random() > 0.5 ? audienceData.target.labels[0] : audienceData.target.labels[1],
        };
    }

    const featureIndex = Math.floor(Math.random() * audienceData.features.length);
    const feature = audienceData.features[featureIndex];
    const valueIndex = Math.floor(Math.random() * (feature.values?.length || 1));
    const value = feature.values?.[valueIndex] || 'Value';

    return {
        id,
        type: 'split',
        condition: `${feature.name} = ${value}`,
        children: [
            generateRandomTree(audienceData, maxDepth, currentDepth + 1),
            generateRandomTree(audienceData, maxDepth, currentDepth + 1),
        ],
    };
};

const AnimatedTree = ({ treeData, audienceData }: { treeData: TreeNode; audienceData: AudienceData; }) => {
    const yStep = 90;
    const expansionFactor = 1.8;

    const getDimensions = (node: TreeNode, depth = 0): { width: number; height: number, offsets: number[] } => {
        if (!node.children || node.children.length === 0) {
            return { width: 120, height: yStep, offsets: [60] };
        }
        
        const childDimensions = node.children.map(child => getDimensions(child, depth + 1));
        const width = childDimensions.reduce((sum, dim) => sum + dim.width, 0) + (childDimensions.length - 1) * 20;
        const height = yStep + Math.max(...childDimensions.map(dim => dim.height));
        
        let currentX = 0;
        const offsets = childDimensions.flatMap((dim, i) => {
            const childOffsets = dim.offsets.map(offset => currentX + offset);
            currentX += dim.width + 20;
            return childOffsets;
        });

        return { width, height, offsets };
    };

    const { width, height } = getDimensions(treeData);

    const renderNode = (node: TreeNode, x: number, y: number, parentX: number | null, parentY: number | null, levelWidth: number, level: number): React.ReactNode[] => {
        const elements: React.ReactNode[] = [];

        if (parentX !== null && parentY !== null) {
            elements.push(
                <path
                    key={`line-${node.id}`}
                    d={`M ${parentX} ${parentY + 15} C ${parentX} ${parentY + yStep / 2}, ${x} ${y - yStep / 2}, ${x} ${y - 20}`}
                    className="tree-path stroke-border"
                    strokeWidth="2"
                    fill="none"
                    style={{ animationDelay: `${level * 0.2}s` }}
                />
            );
            const isYes = (x < parentX);
             elements.push(
                <text key={`label-${node.id}`} x={(x + parentX)/2} y={(y+parentY)/2 - 5} fontSize="10" textAnchor="middle" className="tree-node fill-muted-foreground" style={{ animationDelay: `${level * 0.25}s` }}>
                    {isYes ? 'Yes' : 'No'}
                </text>
            );
        }

        if (node.type === 'split') {
            elements.push(
                <g key={`g-${node.id}`} transform={`translate(${x}, ${y})`} className="tree-node" style={{ animationDelay: `${level * 0.25}s` }}>
                    <rect x="-60" y="-15" width="120" height="30" rx="4" className="fill-card stroke-border" />
                    <text textAnchor="middle" dy=".3em" fontSize="11" fontWeight="bold" className="fill-foreground">{node.condition}</text>
                </g>
            );

            const childXOffset = levelWidth / expansionFactor / (node.children?.length || 1);

            if(node.children){
                 const leftChildX = x - childXOffset;
                 const rightChildX = x + childXOffset;
                elements.push(...renderNode(node.children[0], leftChildX, y + yStep, x, y, childXOffset * 2, level + 1));
                elements.push(...renderNode(node.children[1], rightChildX, y + yStep, x, y, childXOffset * 2, level + 1));
            }
        } else {
            const isPositive = node.value === audienceData.target.labels[0];
            elements.push(
                <g key={`g-${node.id}`} transform={`translate(${x}, ${y})`} className="tree-node" style={{ animationDelay: `${level * 0.25}s` }}>
                    <circle r="20" className={isPositive ? 'fill-primary' : 'fill-destructive'} />
                    <text textAnchor="middle" dy=".3em" fontSize="10" className="font-bold fill-primary-foreground">{node.value}</text>
                </g>
            );
        }

        return elements;
    };

    return (
        <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-auto min-h-[500px]">
            {renderNode(treeData, width / 2, 30, null, null, width, 0)}
        </svg>
    );
};


export default function AlgorithmVisualizerSection({ audience, audienceData, parameters, setParameters, onGenerateData, generatedData }: AlgorithmVisualizerSectionProps) {
    const [activeTab, setActiveTab] = React.useState("stage1");
    const [forestPredictions, setForestPredictions] = React.useState<string[]>([]);
    
    React.useEffect(() => {
        const [label1, label2] = audienceData.target.labels;
        const newPredictions = Array.from({ length: parameters.n_estimators }).map(() => (Math.random() > 0.5 ? label1 : label2));
        setForestPredictions(newPredictions);
    }, [audience, parameters.n_estimators, audienceData.target.labels]);


    const { votingData, featureImportanceData, accuracyData, animatedTreeData } = React.useMemo(() => {
        const votes: Record<string, number> = forestPredictions.reduce((acc, pred) => {
            if (!acc[pred]) {
                acc[pred] = 0;
            }
            acc[pred] += 1;
            return acc;
        }, {});

        const finalPrediction = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b, '');
        
        const votingChartData = Object.entries(votes).map(([name, value]) => ({ name, value }));

        const featImportance = audienceData.features.map(f => ({
            feature: f.name,
            importance: Math.random()
        }));

        const accData = Array.from({length: 10}).map((_, i) => {
            const n_estimators = i + 1;
            const baseAccuracy = 0.70;
            const improvement = (1 - Math.exp(-n_estimators / 3)) * 0.25;
            const noise = (Math.random() - 0.5) * 0.02;
            const accuracy = Math.min(0.98, baseAccuracy + improvement + noise);
            return {
                parameterValue: n_estimators,
                accuracy: parseFloat(accuracy.toFixed(3))
            };
        });

        const treeForAnimation = generateRandomTree(audienceData, parameters.max_depth);

        return { 
            votingData: { chartData: votingChartData, finalPrediction },
            featureImportanceData: featImportance,
            accuracyData: accData,
            animatedTreeData: treeForAnimation
        };

    }, [audienceData, forestPredictions, parameters.max_depth]);

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

                    <div className="mt-4 p-4 border rounded-md min-h-[600px]">
                        <TabsContent value="stage1">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle>Stage 1: Understanding the Data</CardTitle>
                                <CardDescription>First, we get to know our data, just like a {audience.toLowerCase()} studies the {audience === 'Farmer' ? 'land' : audience === 'Doctor' ? 'patient chart' : 'textbook'}.</CardDescription>
                            </CardHeader>
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md flex items-center gap-2"><Target className="w-5 h-5 text-primary"/> Prediction Goal (Target Feature)</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm">Our goal is to predict the <strong className="text-primary">{audienceData.target.name}</strong>, which can be <Badge variant="secondary">{audienceData.target.labels[0]}</Badge> or <Badge variant="secondary">{audienceData.target.labels[1]}</Badge>.</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md flex items-center gap-2"><ListTree className="w-5 h-5 text-primary"/> Key Factors (Input Features)</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
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
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Sample Data for {audienceData.datasetLabel}</CardTitle>
                                            <Button variant="outline" size="sm" onClick={onGenerateData}>
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Generate New Sample
                                            </Button>
                                        </div>
                                        <CardDescription>A random sample from the generated dataset.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="max-h-96 overflow-y-auto border rounded-md">
                                            <Table>
                                            <TableHeader>
                                                <TableRow>
                                                {audienceData.features.map(f => <TableHead key={f.name}>{f.name}</TableHead>)}
                                                <TableHead>{audienceData.target.name}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {generatedData.slice(0, 10).map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{row.feature1}</TableCell>
                                                    <TableCell>{row.feature2}</TableCell>
                                                    <TableCell>{row.feature3}</TableCell>
                                                    <TableCell>{row.target}</TableCell>
                                                </TableRow>
                                                ))}
                                            </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage2">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle>Stage 2: Building a Decision Tree</CardTitle>
                                <CardDescription>{audienceData.metaphors.tree}</CardDescription>
                            </CardHeader>
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <ParameterPlaygroundSection
                                        relevantParams={['max_depth']}
                                        audienceData={audienceData}
                                        parameters={parameters}
                                        setParameters={setParameters}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="p-6 text-center border rounded-md min-h-[550px] flex items-center justify-center overflow-x-auto bg-card/50">
                                        <AnimatedTree key={parameters.max_depth} treeData={animatedTreeData} audienceData={audienceData} />
                                    </div>
                                    <p className="text-center text-sm mt-4 text-muted-foreground">
                                        A single tree grows by splitting data on different rules. The <code className="text-xs">max_depth</code> controls how many questions it can ask before making a decision.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage3">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <CardHeader className="p-0">
                                        <CardTitle>Stage 3: Forest Formation</CardTitle>
                                        <CardDescription>{audienceData.metaphors.forest}</CardDescription>
                                    </CardHeader>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {forestPredictions.map((prediction, i) => (
                                                <InteractiveTreeExplorer key={i} treeId={i+1} audienceData={audienceData} initialPrediction={prediction} maxDepth={parameters.max_depth}/>
                                            ))}
                                        </div>
                                        <p className="text-center text-sm mt-8 text-muted-foreground">Multiple trees are built to form a "forest". Click a tree to explore it.</p>
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Vote Count</CardTitle>
                                        <CardDescription>Each bar shows the number of trees that voted for a specific outcome.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SampleBarChart data={votingData.chartData} />
                                    </CardContent>
                                </Card>
                                <div className="text-center mt-6">
                                    <p className="text-muted-foreground">The forest predicts...</p>
                                    <Badge className="text-xl font-bold py-2 px-4 mt-2 bg-primary text-primary-foreground">
                                        {votingData.finalPrediction}
                                    </Badge>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="stage5">
                            <CardHeader className="p-0">
                                <CardTitle>Stage 5: Model Evaluation</CardTitle>
                                <CardDescription>{audienceData.metaphors.evaluation}</CardDescription>
                            </CardHeader>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                                <ConfusionMatrix audience={audience}/>
                                <FeatureImportanceChart data={featureImportanceData} audience={audience} />
                                <div className="lg:col-span-2">
                                     <AccuracyVsParametersChart data={accuracyData} audience={audience} />
                                </div>
                            </div>
                        </TabsContent>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div>
                        {activeTab === 'stage5' && (
                            <Button 
                                variant="outline"
                                onClick={() => window.open('https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html', '_blank')}
                            >
                                Know More
                            </Button>
                        )}
                        </div>
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
const stages = [
    { id: 'stage1', name: 'Data Understanding', icon: Box },
    { id: 'stage2', name: 'Building Trees', icon: Spline },
    { id: 'stage3', name: 'Forest Formation', icon: GitMerge },
    { id: 'stage4', name: 'Voting', icon: Vote },
    { id: 'stage5', name: 'Evaluation', icon: CheckCircle },
  ];
  

    

    
