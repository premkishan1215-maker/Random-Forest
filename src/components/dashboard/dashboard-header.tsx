import * as React from 'react';
import { Leaf } from 'lucide-react';
import type { Audience } from '@/lib/types';
import { AUDIENCE_DATA } from '@/lib/data';
import { Badge } from '../ui/badge';

interface DashboardHeaderProps {
  audience: Audience;
}

export default function DashboardHeader({
  audience
}: DashboardHeaderProps) {
    const Icon = AUDIENCE_DATA[audience].datasetSummaryIcon;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Forest Insights
          </h1>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Audience:</span>
            <Badge variant="outline" className="text-base font-semibold py-1 px-3">
                <Icon className="h-4 w-4 mr-2" />
                {audience}
            </Badge>
        </div>
      </div>
    </header>
  );
}
