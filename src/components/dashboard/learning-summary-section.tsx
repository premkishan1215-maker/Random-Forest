'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LearningSummarySection() {
    const celebrationImage = PlaceHolderImages.find(img => img.id === 'celebration-scene');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Learning Summary</CardTitle>
        <CardDescription>Review the final results and key takeaways.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {celebrationImage && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                 <Image
                    src={celebrationImage.imageUrl}
                    alt={celebrationImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={celebrationImage.imageHint}
                />
            </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
            <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-primary">92%</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">F1-Score</p>
                <p className="text-2xl font-bold text-primary">0.91</p>
            </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
                <PartyPopper className="mr-2 h-4 w-4" />
                Show Final Takeaway
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline text-2xl">
                What is a Random Forest?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base font-body pt-2">
                A Random Forest is a group of many small decision trees. Each one sees data differently, but when they vote together, they make smarter, more reliable decisions — just like a team of experts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
