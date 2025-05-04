
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowUpRight } from 'lucide-react';

interface NFTCardProps {
  id: string;
  title: string;
  image: string;
  description?: string;
  price?: string;
  timeLeft?: string;
  status: 'held' | 'buyable' | 'upgradeable';
  onMint?: () => void;
  onUpgrade?: () => void;
  onRedeem?: () => void;
}

const NFTCard = ({
  id,
  title,
  image,
  description,
  price,
  timeLeft,
  status,
  onMint,
  onUpgrade,
  onRedeem,
}: NFTCardProps) => {
  return (
    <div className="nft-card rounded-lg border overflow-hidden bg-card text-card-foreground shadow-sm">
      <div className="relative">
        <img src={image} alt={title} className="w-full aspect-square object-cover blueprint-bg" />
        {status === 'upgradeable' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary hover:bg-primary/90">Eligible for Upgrade</Badge>
          </div>
        )}
        {status === 'buyable' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-secondary hover:bg-secondary/90">Buy Now</Badge>
          </div>
        )}
        {status === 'held' && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">Held</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}

        {/* Price and Time section for buyable NFTs */}
        {status === 'buyable' && (
          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
            <div className="font-medium">{price}</div>
            {timeLeft && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeLeft}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          {/* Action buttons based on status */}
          {status === 'held' && (
            <>
              <Button variant="outline" className="w-full" onClick={onRedeem}>
                Redeem ETH + $arrow
              </Button>
            </>
          )}

          {status === 'upgradeable' && (
            <>
              <Button className="w-full" onClick={onUpgrade}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Upgrade to Final NFT
              </Button>
              <Button variant="outline" className="w-full" onClick={onRedeem}>
                Redeem ETH + $arrow
              </Button>
            </>
          )}

          {status === 'buyable' && (
            <Button className="w-full" onClick={onMint}>
              Back This Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
