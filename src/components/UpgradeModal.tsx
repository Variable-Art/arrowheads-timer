
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    id: string;
    title: string;
    image: string;
    finalImage: string;
    description: string;
    editionSize: string;
    timeRemaining: string;
    author?: {
      name: string;
      avatar: string;
    };
  };
  onUpgrade: () => void;
}

const UpgradeModal = ({ isOpen, onClose, nft, onUpgrade }: UpgradeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Final NFT</DialogTitle>
          <DialogDescription>
            Burn your Rough Draft NFT to mint a Final NFT version
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {/* Before/After comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="aspect-square w-full rounded-md border overflow-hidden">
                <img 
                  src={nft.image} 
                  alt="Current NFT" 
                  className="w-full h-full object-cover blueprint-bg opacity-70"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">Current: Rough Draft</p>
            </div>
            <div className="space-y-2">
              <div className="aspect-square w-full rounded-md border overflow-hidden">
                <img 
                  src={nft.finalImage} 
                  alt="Final NFT" 
                  className="w-full h-full object-cover blueprint-bg"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">After: Final NFT</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {nft.title}
              {nft.author && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>by</span>
                  <div className="flex items-center">
                    <img 
                      src={nft.author.avatar} 
                      alt={nft.author.name} 
                      className="w-4 h-4 rounded-full mr-1" 
                    />
                    <span>{nft.author.name}</span>
                  </div>
                </div>
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{nft.description}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">Edition: {nft.editionSize}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> 
              {nft.timeRemaining}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onUpgrade} className="gap-2">
            <span className="inline-block relative w-4 h-4">
              <span className="absolute inset-0 animate-ping opacity-75 bg-primary rounded-full"></span>
              <span className="relative rounded-full bg-primary inline-flex h-4 w-4"></span>
            </span>
            Burn + Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
