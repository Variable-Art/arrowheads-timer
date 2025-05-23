
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowRight } from 'lucide-react';

interface FeaturedProjectProps {
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

const FeaturedProject = ({ project, onBackProject, onViewProject }: FeaturedProjectProps) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 border">
      <div className="grid lg:grid-cols-2 gap-6 p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">Featured</Badge>
              <Badge variant="outline" className="capitalize">{project.category}</Badge>
            </div>
            <h2 className="text-3xl font-bold">{project.title}</h2>
            <div className="flex items-center gap-2">
              <img 
                src={project.creator.avatar} 
                alt={project.creator.name} 
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <span className="text-muted-foreground">by {project.creator.name}</span>
            </div>
            <p className="text-muted-foreground text-lg">{project.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Funding Progress</span>
                <span className="font-semibold">{project.thresholdPercent}%</span>
              </div>
              <Progress value={Math.min(project.thresholdPercent, 100)} className="h-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.currentAmount} ETH raised</span>
                <span>Goal: {project.threshold} ETH</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{project.daysLeft} days left</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button size="lg" onClick={() => onBackProject(project.id)}>
              Back This Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => onViewProject(project.id)}>
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProject;
