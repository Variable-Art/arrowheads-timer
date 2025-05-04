
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Info, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface BackProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: {
    id: string;
    title: string;
    image: string;
    description: string;
    price: string;
    timeLeft: string;
    author?: {
      name: string;
      avatar: string;
    };
  };
}

const BackProjectModal = ({ isOpen, onClose, nft }: BackProjectModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    details: false,
    upgrade: false,
    liquidity: false
  });
  
  const basePrice = parseFloat(nft.price.split(' ')[0]);
  const totalPrice = (basePrice * quantity).toFixed(3);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleConfirm = () => {
    toast({
      title: "Transaction Submitted",
      description: `You are backing ${nft.title} with ${quantity} NFT${quantity > 1 ? 's' : ''}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Back This Project</DialogTitle>
          <DialogDescription>
            Support this creative work as a Rough Draft and gain access to the final NFT.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project preview */}
          <div className="flex gap-4 items-center">
            <img
              src={nft.image}
              alt={nft.title}
              className="w-20 h-20 rounded-md object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div>
              <h3 className="font-medium">{nft.title}</h3>
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <span>{nft.price}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {nft.timeLeft}
                </div>
              </div>
              {nft.author && (
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span>by</span>
                  <div className="flex items-center gap-1">
                    <img
                      src={nft.author.avatar}
                      alt={nft.author.name}
                      className="w-4 h-4 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <span>{nft.author.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Quantity selector */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="text-center"
              />
              
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={handleIncrement}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Price calculations */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Price per NFT</span>
              <span>{nft.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>x {quantity}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{totalPrice} ETH</span>
            </div>
          </div>

          {/* Expandable sections */}
          <div className="space-y-3">
            {/* Project details */}
            <div className="border rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4"
                onClick={() => toggleSection('details')}
              >
                <span className="font-medium">Project Details</span>
                {expanded.details ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {expanded.details && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">
                    {nft.description}
                  </p>
                </div>
              )}
            </div>

            {/* Upgrade process */}
            <div className="border rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4"
                onClick={() => toggleSection('upgrade')}
              >
                <span className="font-medium">Upgrade Process</span>
                {expanded.upgrade ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {expanded.upgrade && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="mt-0.5">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Rough Draft NFT</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive a Rough Draft NFT immediately after minting
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="mt-0.5">
                      <ArrowUpRight className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Final NFT</p>
                      <p className="text-sm text-muted-foreground">
                        When the creator releases the final version, you'll be able to upgrade
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="mt-0.5">
                      <Info className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">If No Final Version</p>
                      <p className="text-sm text-muted-foreground">
                        If no final version is released within 1 year, you can claim 33% of mint funds
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Liquidity */}
            <div className="border rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4"
                onClick={() => toggleSection('liquidity')}
              >
                <span className="font-medium">Liquidity & Refunds</span>
                {expanded.liquidity ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {expanded.liquidity && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="mt-0.5">
                      <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can redeem your NFT at any time for 33% of the mint price in ETH + a proportional amount of $arrow tokens.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="mt-0.5">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Note that redeeming burns your NFT, meaning you'll no longer be eligible for the final version upgrade.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={handleConfirm}>
            Back This Project ({totalPrice} ETH)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackProjectModal;
