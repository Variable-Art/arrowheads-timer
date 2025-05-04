
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface NFTPreviewProps {
  title: string;
  description: string;
  image: string;
  price: string;
  timeLeft: string;
}

const NFTPreview = ({ title, description, image, price, timeLeft }: NFTPreviewProps) => {
  return (
    <div className="nft-card rounded-lg overflow-hidden bg-card text-card-foreground">
      <div className="relative">
        <img 
          src={image || '/placeholder.svg'} 
          alt={title} 
          className="w-full aspect-square object-cover blueprint-bg" 
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-secondary hover:bg-secondary/90">Buy Now</Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title || 'Project Title'}</h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
          <div className="font-medium">{price}</div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeLeft}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTPreview;
