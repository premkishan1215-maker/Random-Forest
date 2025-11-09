
'use client';
import Image from 'next/image';
import {
  CardContent,
} from '@/components/ui/card';
import type { AudienceData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';


interface DatasetStorySectionProps {
  audienceData: AudienceData;
}

export default function DatasetStorySection({ audienceData }: DatasetStorySectionProps) {
  const sceneImage = PlaceHolderImages.find(img => img.id === audienceData.sceneImageId);

  return (
    <div className="overflow-hidden shadow-lg rounded-lg border bg-card text-card-foreground">
      <div className="relative h-48 w-full md:h-64">
        {sceneImage && (
          <Image
            src={sceneImage.imageUrl}
            alt={sceneImage.description}
            fill
            className="object-cover"
            data-ai-hint={sceneImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-3xl font-headline font-bold text-white">
            The Story: {audienceData.datasetLabel}
          </h2>
        </div>
      </div>
      <CardContent className="p-6">
         <p className="mt-2 max-w-3xl text-base text-foreground/90 font-body">
            {audienceData.story}
          </p>
      </CardContent>
    </div>
  );
}
