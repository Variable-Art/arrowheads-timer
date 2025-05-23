
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, Users } from 'lucide-react';

interface ProjectExploreCardProps {
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
  onBackProject: (projectId: string) => void;
  onViewProject: (projectId: string) => void;
}

const ProjectExploreCard = ({ project, onBackProject, onViewProject }: ProjectExploreCardProps) => {
  const getStatusBadge = () => {
    switch (project.status) {
      case 'funding':
        return <Badge className="bg-blue-500">Funding Open</Badge>;
      case 'deliverable_available':
        return <Badge className="bg-green-500">Deliverable Available</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-100">Completed</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (project.status) {
      case 'funding':
        return (
          <Button onClick={() => onBackProject(project.id)} className="w-full">
            Back This Project
          </Button>
        );
      case 'deliverable_available':
        return (
          <Button onClick={() => onViewProject(project.id)} className="w-full">
            Receive Deliverable
          </Button>
        );
      case 'completed':
        return (
          <Button variant="outline" onClick={() => onViewProject(project.id)} className="w-full">
            View Project
          </Button>
        );
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full aspect-video object-cover" 
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm capitalize">
            {project.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src={project.creator.avatar} 
            alt={project.creator.name} 
            className="w-5 h-5 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <span className="text-sm text-muted-foreground">{project.creator.name}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        
        {project.status === 'funding' && (
          <div className="space-y-3 mb-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.thresholdPercent}%</span>
              </div>
              <Progress value={Math.min(project.thresholdPercent, 100)} className="w-full" />
              <div className="text-xs text-muted-foreground">
                {project.currentAmount} / {project.threshold} ETH
              </div>
            </div>
            
            {project.daysLeft > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time left</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{project.daysLeft} days</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {project.status !== 'funding' && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-medium">{project.currentAmount} ETH</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Deadline</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
        
        {getActionButton()}
      </div>
    </div>
  );
};

export default ProjectExploreCard;
