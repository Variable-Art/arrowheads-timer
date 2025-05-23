
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
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar, Gift, RotateCcw, DollarSign } from 'lucide-react';

interface BackedProject {
  id: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
  };
  image: string;
  deliveryDate: string;
  amountBacked: string;
  totalRaised: string;
  threshold: string;
  thresholdMet: boolean;
  status: 'refundable' | 'locked' | 'delivered' | 'deadline_passed';
  hasDeliverable: boolean;
  extensionRequested?: boolean;
}

interface ProjectActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BackedProject;
  onGiveFullAmount: (projectId: string) => void;
  onReceiveDeliverable: (projectId: string) => void;
  onRequestPartialRefund: (projectId: string) => void;
}

const ProjectActionsModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onGiveFullAmount,
  onReceiveDeliverable,
  onRequestPartialRefund 
}: ProjectActionsModalProps) => {
  const getDaysUntilDeadline = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(project.deliveryDate);
  const deadlinePassed = daysLeft <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Options</DialogTitle>
          <DialogDescription>
            Choose how you'd like to proceed with your backing
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project Summary */}
          <div className="flex gap-4">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-16 h-16 rounded-md object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{project.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img 
                  src={project.creator.avatar} 
                  alt={project.creator.name} 
                  className="w-4 h-4 rounded-full"
                />
                <span>by {project.creator.name}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{project.amountBacked} ETH backed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Status */}
          <div className="space-y-3">
            <h4 className="font-medium">Current Status</h4>
            <div className="flex items-center gap-2">
              {project.status === 'refundable' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Before Threshold - Full Refund Available
                </Badge>
              )}
              {project.status === 'locked' && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  After Threshold - Locked with Options
                </Badge>
              )}
              {project.status === 'delivered' && (
                <Badge className="bg-green-500">
                  Deliverable Available
                </Badge>
              )}
              {project.status === 'deadline_passed' && (
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  Deadline Passed - Auto-Processing
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Available Actions */}
          <div className="space-y-4">
            <h4 className="font-medium">Available Actions</h4>
            
            {project.status === 'refundable' && (
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800 mb-3">
                  Project hasn't reached its threshold yet. You can get a full refund until it does.
                </p>
                <Button variant="outline" className="w-full" onClick={() => onRequestPartialRefund(project.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Request Full Refund
                </Button>
              </div>
            )}

            {project.status === 'locked' && !deadlinePassed && (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-md">
                  <h5 className="font-medium text-green-800 mb-2">Option 1: Give Full Amount</h5>
                  <p className="text-sm text-green-700 mb-3">
                    • 39% ETH → Creator immediately<br/>
                    • 30% $arrow vests to creator over 1 year<br/>
                    • 1% ETH → Platform fee<br/>
                    • You get access to any future deliverable
                  </p>
                  <Button className="w-full" onClick={() => onGiveFullAmount(project.id)}>
                    <Gift className="mr-2 h-4 w-4" />
                    Give Full Amount
                  </Button>
                </div>

                {project.hasDeliverable && (
                  <div className="p-4 bg-purple-50 rounded-md">
                    <h5 className="font-medium text-purple-800 mb-2">Option 2: Receive Deliverable</h5>
                    <p className="text-sm text-purple-700 mb-3">
                      • Same payout as above<br/>
                      • Receive the deliverable NFT/token<br/>
                      • Mark project as fulfilled
                    </p>
                    <Button className="w-full" onClick={() => onReceiveDeliverable(project.id)}>
                      <Gift className="mr-2 h-4 w-4" />
                      Receive Deliverable
                    </Button>
                  </div>
                )}

                <div className="p-4 bg-orange-50 rounded-md">
                  <h5 className="font-medium text-orange-800 mb-2">Option 3: Partial Refund</h5>
                  <p className="text-sm text-orange-700 mb-3">
                    • Get back 40% ETH immediately<br/>
                    • Receive 30% $arrow vesting over 1 year<br/>
                    • Only available before deadline
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => onRequestPartialRefund(project.id)}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Request Partial Refund
                  </Button>
                </div>
              </div>
            )}

            {(project.status === 'delivered' || deadlinePassed) && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h5 className="font-medium text-gray-800 mb-2">Auto-Processing Complete</h5>
                <p className="text-sm text-gray-700 mb-3">
                  {deadlinePassed 
                    ? "Deadline has passed. Funds have been distributed and deliverable (if available) has been sent."
                    : "Deliverable has been received and project is marked as fulfilled."
                  }
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Clock className="mr-2 h-4 w-4" />
                  Processing Complete
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectActionsModal;
