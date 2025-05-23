
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  Gift,
  DollarSign,
  Timer,
  Info,
  Share2,
  Calendar,
  Wallet
} from 'lucide-react';

interface BackingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    creator: {
      name: string;
      avatar: string;
    };
    description: string;
    image: string;
    status: 'funding' | 'deliverable_available' | 'completed';
    currentAmount: string;
    threshold: string;
    thresholdPercent: number;
    deadline: string;
    daysLeft: number;
    category: string;
  };
}

const BackingFlowModal = ({ isOpen, onClose, project }: BackingFlowModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState(0.01);
  
  const incrementOptions = [0.01, 0.02, 0.03, 0.05, 0.10, 0.25, 0.50];
  const units = selectedAmount / 0.01;
  const estimatedTokens = Math.floor(units * 30);
  const estimatedNFTs = Math.floor(units * 1);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBacking = () => {
    toast({
      title: "Project Backed Successfully!",
      description: `You've backed ${project.title} with ${selectedAmount} ETH`,
    });
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Backing Amount</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This project only accepts backings in 0.01 ETH increments
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {incrementOptions.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              onClick={() => setSelectedAmount(amount)}
              className="text-sm"
            >
              {amount} ETH
            </Button>
          ))}
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Backing {selectedAmount} ETH</span>
            <span className="text-muted-foreground">({units} units)</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Estimated: {estimatedTokens} $arrow or {estimatedNFTs} NFT per unit
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Funding Status</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress to threshold</span>
              <span className="font-semibold">{project.thresholdPercent}%</span>
            </div>
            <Progress value={Math.min(project.thresholdPercent, 100)} className="h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{project.currentAmount} ETH raised</span>
              <span>Goal: {project.threshold} ETH</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Time remaining</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{project.daysLeft} days</span>
            </div>
          </div>
          
          <Badge 
            variant={project.thresholdPercent >= 100 ? "default" : "outline"}
            className="w-full justify-center"
          >
            {project.thresholdPercent >= 100 ? "Locked phase active" : "Still refundable"}
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">What Happens with Your Funds</h3>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3">If project reaches threshold:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>30% ETH → Creator immediately</span>
                <span className="font-mono">{(selectedAmount * 0.3).toFixed(3)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>30% ETH → Swapped to $arrow and locked</span>
                <span className="font-mono">{(selectedAmount * 0.3).toFixed(3)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>40% ETH → Held for your decision</span>
                <span className="font-mono">{(selectedAmount * 0.4).toFixed(3)} ETH</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Your options before deadline:</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Give Creator Full Amount</p>
                  <p className="text-sm text-muted-foreground">Unlocks full funds + vested $arrow</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Gift className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Receive Deliverable</p>
                  <p className="text-sm text-muted-foreground">If uploaded by creator</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium">Request Partial Refund</p>
                  <p className="text-sm text-muted-foreground">
                    40% ETH back + 30% $arrow vested over 1 year
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Timer className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Do Nothing</p>
                  <p className="text-sm text-muted-foreground">
                    Auto-receive deliverable, funds flow to creator
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You'll be able to choose what happens with at least some of your funds before the deadline — you're not committing blindly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Confirm Backing</h3>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>ETH to contribute</span>
              <span className="font-semibold">{selectedAmount} ETH</span>
            </div>
            <div className="flex justify-between">
              <span>Units backed</span>
              <span>{units} units</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated deliverable</span>
              <span>{estimatedTokens} $arrow or {estimatedNFTs} NFT</span>
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Your resolution options:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Give creator full amount</li>
                <li>Receive deliverable (if available)</li>
                <li>Request partial refund</li>
                <li>Automatic resolution at deadline</li>
              </ul>
            </div>
          </div>
          
          <Button onClick={handleConfirmBacking} className="w-full" size="lg">
            <Wallet className="mr-2 h-4 w-4" />
            Confirm and Back Project
          </Button>
          
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              Set Reminder
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Share2 className="mr-1 h-3 w-3" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Back This Project</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 4 - {project.title}
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        
        {/* Step content */}
        <div className="py-4">
          {renderCurrentStep()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackingFlowModal;
