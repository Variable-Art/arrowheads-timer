
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Upload, Users, Calendar, CheckCircle } from 'lucide-react';
import UploadDeliverableModal from './UploadDeliverableModal';

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

interface ProjectCardProps {
  project: BackedProject | CreatedProject;
  type: 'backed' | 'created';
  onProjectActions?: () => void;
  onVoteExtension?: (vote: 'approve' | 'decline') => void;
  onRequestExtension?: () => void;
}

const ProjectCard = ({
  project,
  type,
  onProjectActions,
  onVoteExtension,
  onRequestExtension,
}: ProjectCardProps) => {
  const [uploadDeliverableModalOpen, setUploadDeliverableModalOpen] = useState(false);
  
  const isBackedProject = (p: BackedProject | CreatedProject): p is BackedProject => {
    return 'creator' in p;
  };

  const isCreatedProject = (p: BackedProject | CreatedProject): p is CreatedProject => {
    return 'ethRaised' in p;
  };

  const getDaysUntilDeadline = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (project: BackedProject | CreatedProject) => {
    if (type === 'backed' && isBackedProject(project)) {
      switch (project.status) {
        case 'refundable':
          return <Badge variant="outline" className="bg-blue-50 text-blue-700">Refundable Anytime</Badge>;
        case 'locked':
          return <Badge variant="outline" className="bg-orange-50 text-orange-700">Locked, Partial Refund Available</Badge>;
        case 'delivered':
          return <Badge className="bg-green-500">Delivered</Badge>;
        case 'deadline_passed':
          return <Badge variant="outline" className="bg-red-50 text-red-700">Deadline Passed</Badge>;
      }
    } else if (type === 'created' && isCreatedProject(project)) {
      switch (project.phase) {
        case 'funding':
          return <Badge variant="outline" className="bg-blue-50 text-blue-700">Funding Phase</Badge>;
        case 'threshold_met':
          return <Badge className="bg-green-500">Threshold Met</Badge>;
        case 'delivered':
          return <Badge className="bg-purple-500">Delivered</Badge>;
        case 'extension_requested':
          return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Extension Requested</Badge>;
      }
    }
  };

  const handleUploadDeliverable = () => {
    setUploadDeliverableModalOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border overflow-hidden bg-card text-card-foreground shadow-sm">
        <div className="relative">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full aspect-video object-cover" 
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(project)}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
          
          {type === 'backed' && isBackedProject(project) && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={project.creator.avatar} 
                  alt={project.creator.name} 
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <span className="text-sm text-muted-foreground">by {project.creator.name}</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Date</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(project.deliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days Left</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{getDaysUntilDeadline(project.deliveryDate)} days</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount Backed</span>
                  <span className="font-medium">{project.amountBacked} ETH</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Raised</span>
                  <span className="font-medium">{project.totalRaised} ETH</span>
                </div>
              </div>
              
              {project.extensionRequested && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-xs text-yellow-800 mb-2">Extension requested by creator</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onVoteExtension?.('approve')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onVoteExtension?.('decline')}>
                      Decline
                    </Button>
                  </div>
                </div>
              )}
              
              <Button className="w-full" onClick={onProjectActions}>
                View Options
              </Button>
            </>
          )}
          
          {type === 'created' && isCreatedProject(project) && (
            <>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ETH Raised</span>
                  <span className="font-medium">{project.ethRaised} ETH</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Threshold Progress</span>
                    <span className="font-medium">{project.thresholdPercent}%</span>
                  </div>
                  <Progress value={Math.min(project.thresholdPercent, 100)} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    {project.ethRaised} / {project.threshold} ETH
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Date</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(project.deliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {project.extensionVotes && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-xs text-yellow-800 mb-2">Extension Vote Status</p>
                  <div className="text-xs text-muted-foreground">
                    Approve: {project.extensionVotes.approve} | Decline: {project.extensionVotes.decline}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {!project.hasDeliverable && project.phase === 'threshold_met' && (
                  <Button className="w-full" onClick={handleUploadDeliverable}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Deliverable
                  </Button>
                )}
                
                {project.hasDeliverable && (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Deliverable Uploaded
                  </Button>
                )}
                
                {getDaysUntilDeadline(project.deliveryDate) <= 7 && !project.extensionVotes && (
                  <Button variant="outline" className="w-full" onClick={onRequestExtension}>
                    <Users className="mr-2 h-4 w-4" />
                    Request Extension
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Upload Deliverable Modal */}
      {type === 'created' && isCreatedProject(project) && (
        <UploadDeliverableModal 
          isOpen={uploadDeliverableModalOpen}
          onClose={() => setUploadDeliverableModalOpen(false)}
          project={project}
        />
      )}
    </>
  );
};

export default ProjectCard;
