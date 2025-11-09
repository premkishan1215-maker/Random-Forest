import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tractor, Stethoscope, GraduationCap, Leaf } from 'lucide-react';
import type { Audience } from '@/lib/types';

interface DashboardHeaderProps {
  audience: Audience;
  onAudienceChange: (audience: Audience) => void;
}

const audienceOptions: { value: Audience; label: string; icon: React.ElementType }[] = [
  { value: 'Farmer', label: 'Farmer', icon: Tractor },
  { value: 'Doctor', label: 'Doctor', icon: Stethoscope },
  { value: 'Student', label: 'Student', icon: GraduationCap },
];

export default function DashboardHeader({
  audience,
  onAudienceChange,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Forest Insights
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Choose Audience:</span>
          <Select
            value={audience}
            onValueChange={(value: Audience) => onAudienceChange(value)}
          >
            <SelectTrigger className="w-[180px] font-semibold">
              <SelectValue placeholder="Choose Audience" />
            </SelectTrigger>
            <SelectContent>
              {audienceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
