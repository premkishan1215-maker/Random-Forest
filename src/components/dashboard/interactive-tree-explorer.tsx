
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
import { Trees, GitBranch, Binary } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AudienceData } from '@/lib/types';
import * as React from 'react';
import { Badge } from '../ui/badge';

interface InteractiveTreeExplorerProps {
    treeId: number;
    audienceData: AudienceData;
    initialPrediction: string;
    maxDepth: number;
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
    
    // Ensure the tree doesn't stop at depth 1, force at least one split.
    if (currentDepth >= maxDepth || (currentDepth > 1 && Math.random() < 0.4)) {
        // Leaf node
        return {
            id,
            type: 'leaf',
            value: Math.random() > 0.5 ? audienceData.target.labels[0] : audienceData.target.labels[1],
        };
    }

    // Split node
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

const TreeDiagram = ({ treeData, audienceData }: { treeData: TreeNode; audienceData: AudienceData; }) => {
    const yStep = 90;
    const expansionFactor = 1.8;

    const getDimensions = (node: TreeNode, depth = 0): { width: number; height: number, offsets: number[] } => {
        if (!node.children || node.children.length === 0) {
            return { width: 120, height: yStep, offsets: [60] };
        }
        
        const childDimensions = node.children.map(child => getDimensions(child, depth + 1));
        const width = childDimensions.reduce((sum, dim) => sum + dim.width, 0) + (childDimensions.length - 1) * 20; // Add spacing between children
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

    const renderNode = (node: TreeNode, x: number, y: number, parentX: number | null, parentY: number | null, levelWidth: number): React.ReactNode[] => {
        const elements: React.ReactNode[] = [];

        if (parentX !== null && parentY !== null) {
            elements.push(
                <path
                    key={`line-${node.id}`}
                    d={`M ${parentX} ${parentY + 20} C ${parentX} ${parentY + yStep / 2}, ${x} ${y - yStep / 2}, ${x} ${y - 20}`}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    fill="none"
                />
            );
            const isYes = (x < parentX);
             elements.push(
                <text key={`label-${node.id}`} x={(x + parentX)/2} y={(y+parentY)/2 - 10} fontSize="10" textAnchor="middle" fill="hsl(var(--muted-foreground))">
                    {isYes ? 'Yes' : 'No'}
                </text>
            );
        }

        if (node.type === 'split') {
            elements.push(
                <g key={`g-${node.id}`} transform={`translate(${x}, ${y})`}>
                    <rect x="-60" y="-15" width="120" height="30" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                    <text textAnchor="middle" dy=".3em" fontSize="11" fontWeight="bold">{node.condition}</text>
                </g>
            );

            const childXOffset = levelWidth / expansionFactor / (node.children?.length || 1);

            if(node.children){
                 const leftChildX = x - childXOffset;
                 const rightChildX = x + childXOffset;
                elements.push(...renderNode(node.children[0], leftChildX, y + yStep, x, y, childXOffset * 2));
                elements.push(...renderNode(node.children[1], rightChildX, y + yStep, x, y, childXOffset * 2));
            }
        } else {
            const isPositive = node.value === audienceData.target.labels[0];
            elements.push(
                <g key={`g-${node.id}`} transform={`translate(${x}, ${y})`}>
                    <circle r="20" fill={isPositive ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                    <text textAnchor="middle" dy=".3em" fontSize="10" fill="hsl(var(--primary-foreground))" className="font-bold">{node.value}</text>
                </g>
            );
        }

        return elements;
    };

    return (
        <svg viewBox={`0 -10 ${width} ${height + 20}`} className="w-full h-auto min-h-[300px]">
            {renderNode(treeData, width / 2, 30, null, null, width)}
        </svg>
    );
};


export default function InteractiveTreeExplorer({ treeId, audienceData, initialPrediction, maxDepth }: InteractiveTreeExplorerProps) {
  const [mockTreeData, setMockTreeData] = React.useState<any[]>([]);
  const [diagramData, setDiagramData] = React.useState<TreeNode | null>(null);
  
  const generateDataForTree = React.useCallback(() => {
    // Generate bootstrap sample
    const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const originalData = Array.from({length: 10}).map((_, i) => ({
      id: i + 1,
      feature1: getRandomItem(audienceData.features[0].values || []),
      feature2: getRandomItem(audienceData.features[1].values || []),
      feature3: getRandomItem(audienceData.features[2].values || []),
      target: Math.random() > 0.5 ? audienceData.target.labels[0] : audienceData.target.labels[1]
    }));

    const bootstrapSample = Array.from({ length: originalData.length }).map(() => {
        const randomIndex = Math.floor(Math.random() * originalData.length);
        return originalData[randomIndex];
    });

    setMockTreeData(bootstrapSample);
    
    // Generate tree diagram structure, ensuring it's not too small
    const treeDepth = Math.max(2, maxDepth); // Ensure a minimum depth of 2
    setDiagramData(generateRandomTree(audienceData, treeDepth));

  }, [audienceData, maxDepth]);

  // We only want to generate the tree's internal data when the dialog opens
  // not on every render.
  const handleOpenChange = (open: boolean) => {
    if (open) {
      generateDataForTree();
    }
  };

  React.useEffect(() => {
     generateDataForTree();
  }, [generateDataForTree]);
  
  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" className="h-20 w-full flex flex-col gap-1 items-center justify-center border-2 border-dashed hover:border-primary hover:bg-accent/10 transition-colors duration-200">
            <Trees className="w-8 h-8 text-primary/70" />
            <span className="text-xs text-muted-foreground">Tree {treeId}</span>
            </Button>
            <Badge variant={initialPrediction === audienceData.target.labels[0] ? "default" : "secondary"} className="text-xs">
                {initialPrediction || '...'}
            </Badge>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Decision Tree #{treeId}</DialogTitle>
          <DialogDescription>
            Exploring the decisions made by a single tree in the forest. This tree was trained on a random subset of the data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="lg:col-span-1">
                <Card className="h-full shadow-md">
                    <CardHeader>
                        <CardTitle>Decision Structure</CardTitle>
                        <CardDescription>A visual map of this tree's logic.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex items-center justify-center">
                        {diagramData && <TreeDiagram treeData={diagramData} audienceData={audienceData} />}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="shadow-md h-full">
                    <CardHeader>
                        <CardTitle>Bootstrap Sample</CardTitle>
                        <CardDescription>The data subset this tree was trained on.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="max-h-[50vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sample ID</TableHead>
                                        {audienceData.features.map(f => <TableHead key={f.name}>{f.name}</TableHead>)}
                                        <TableHead>{audienceData.target.name}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTreeData.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.id}</TableCell>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

    
