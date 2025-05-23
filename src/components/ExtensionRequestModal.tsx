
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface CreatedProject {
  id: string;
  title: string;
  image: string;
  ethRaised: string;
  threshold: string;
  thresholdPercent: number;
  deliveryDate: string;
  phase: 'funding' | 'threshold_met' | 'delivered' | 'extension_requested';
  hasDeliverable: boolean;
  extensionVotes?: {
    approve: number;
    decline: number;
    total: number;
  };
}

interface ExtensionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CreatedProject;
}

const ExtensionRequestModal = ({ isOpen, onClose, project }: ExtensionRequestModalProps) => {
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!newDeadline || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please set a new deadline and provide a reason for the extension.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Extension Request Sent",
      description: "All backers have been notified and can now vote on your extension request.",
    });
    
    setNewDeadline(undefined);
    setReason('');
    onClose();
  };

  const handleClose = () => {
    setNewDeadline(undefined);
    setReason('');
    onClose();
  };

  const originalDeadline = new Date(project.deliveryDate);
  const daysUntilOriginal = Math.ceil((originalDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Extension</DialogTitle>
          <DialogDescription>
            Request more time for your project delivery. Backers will vote on whether to approve.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project Info */}
          <div className="flex gap-4 p-4 bg-muted/50 rounded-md">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-12 h-12 rounded-md object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{project.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{Math.round(parseFloat(project.ethRaised) / 0.01)} backers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{daysUntilOriginal > 0 ? `${daysUntilOriginal} days left` : 'Deadline passed'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Deadline */}
          <div className="space-y-2">
            <Label>Current Deadline</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              {format(originalDeadline, "PPPP")}
            </div>
          </div>

          {/* New Deadline */}
          <div className="space-y-2">
            <Label>
              New Proposed Deadline <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newDeadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDeadline ? format(newDeadline, "PPP") : "Pick a new date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newDeadline}
                  onSelect={setNewDeadline}
                  disabled={(date) => date <= originalDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Must be after the current deadline
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Extension <span className="text-destructive">*</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({reason.length}/500 chars)
              </span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain why you need more time and what you're working on..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              className="resize-none h-24"
            />
          </div>

          {/* Extension Info */}
          <div className="p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">How Extensions Work</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All backers will be notified of your request</li>
              <li>• Each backer can vote to approve or decline</li>
              <li>• Only backers who approve are bound to the new deadline</li>
              <li>• Declining backers can choose partial refund options</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Send Extension Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionRequestModal;
