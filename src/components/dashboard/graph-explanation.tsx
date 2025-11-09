
'use client';

import * as React from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { getGraphExplanation } from '@/app/actions';
import type { ExplainGraphWithMetaphorInput, ExplainGraphWithMetaphorOutput } from '@/ai/flows/explain-graphs-with-metaphors';
import { useToast } from '@/hooks/use-toast';

type GraphExplanationProps = ExplainGraphWithMetaphorInput;

export default function GraphExplanation({ graphType, dataset, algorithmConcept, audience }: GraphExplanationProps) {
  const [explanation, setExplanation] = React.useState<ExplainGraphWithMetaphorOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    let isMounted = true;
    async function fetchExplanation() {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getGraphExplanation({ graphType, dataset, algorithmConcept, audience });
        if (!isMounted) return;

        if (result.success && result.data) {
          setExplanation(result.data);
        } else {
          const errorMessage = result.error || 'An unknown error occurred.';
          setError(errorMessage);
          toast({
            title: "AI Explanation Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (e: any) {
        if (!isMounted) return;
        const errorMessage = e.message || 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
            title: "AI Explanation Error",
            description: errorMessage,
            variant: "destructive",
        });
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    }

    fetchExplanation();
    
    return () => {
      isMounted = false;
    };
  }, [graphType, dataset, algorithmConcept, audience, toast]);


  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled className="cursor-wait">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </Button>
    );
  }

  if (error || !explanation) {
    return (
       <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive/80">
                <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Could not load explanation.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4 text-accent" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs" side="top">
          <p className="font-bold text-primary">{explanation.metaphor}</p>
          <p className="text-sm text-muted-foreground mt-1">{explanation.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
