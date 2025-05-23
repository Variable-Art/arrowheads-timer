import React, { useState } from 'react';
import Header from '@/components/Header';
import ProjectActionsModal from '@/components/ProjectActionsModal';
import ProjectCard from '@/components/ProjectCard';
import ExtensionRequestModal from '@/components/ExtensionRequestModal';
import CreateProjectModal from '@/components/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, DollarSign } from 'lucide-react';

// Sample backed projects data
const backedProjects = [
  {
    id: '1',
    title: 'Build a Solar Music Box',
    creator: {
      name: '@stellabeam',
      avatar: '/lovable-uploads/f405cf6d-7332-4b46-b1a3-e3aa781f5aa1.png'
    },
    image: '/lovable-uploads/70a0a04f-7986-4605-8852-902d239bafc3.png',
    deliveryDate: '2025-04-03', // Updated to future date (70 days from now approximately)
    amountBacked: '0.03',
    totalRaised: '0.72',
    threshold: '1.0',
    thresholdMet: false,
    status: 'refundable' as const,
    hasDeliverable: false
  },
  {
    id: '2',
    title: 'Crypto Cookbook Vol. 1',
    creator: {
      name: '@web3chef',
      avatar: '/lovable-uploads/df0a3d71-8a2f-4a46-9ee5-81628460b3e5.png'
    },
    image: '/lovable-uploads/d6392a33-25c4-4ee2-a4ce-95adbbbeec3f.png',
    deliveryDate: '2025-03-15',
    amountBacked: '0.05',
    totalRaised: '2.1',
    threshold: '1.5',
    thresholdMet: true,
    status: 'delivered' as const,
    hasDeliverable: true
  }
];

// Sample created projects data
const createdProjects = [
  {
    id: 'created-1',
    title: 'Digital Art Genesis Collection',
    image: '/lovable-uploads/70a0a04f-7986-4605-8852-902d239bafc3.png',
    ethRaised: '2.4',
    threshold: '2.0',
    thresholdPercent: 120,
    deliveryDate: '2025-03-01',
    phase: 'threshold_met' as const,
    hasDeliverable: false
  }
];

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState<typeof backedProjects[0] | null>(null);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [selectedCreatedProject, setSelectedCreatedProject] = useState<typeof createdProjects[0] | null>(null);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  // Demo wallet details
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const arrowBalance = '245.8';

  const handleCreateProject = () => {
    setCreateProjectModalOpen(true);
  };

  const handleProjectActions = (project: typeof backedProjects[0]) => {
    setSelectedProject(project);
    setActionsModalOpen(true);
  };

  const handleGiveFullAmount = (projectId: string) => {
    console.log('Give full amount to project:', projectId);
    setActionsModalOpen(false);
  };

  const handleReceiveDeliverable = (projectId: string) => {
    console.log('Receive deliverable for project:', projectId);
    setActionsModalOpen(false);
  };

  const handleRequestPartialRefund = (projectId: string) => {
    console.log('Request partial refund for project:', projectId);
    setActionsModalOpen(false);
  };

  const handleVoteExtension = (vote: 'approve' | 'decline') => {
    console.log('Vote extension:', vote);
  };

  const handleRequestExtension = () => {
    console.log('Request extension clicked');
    // Find the first project that can request an extension
    const projectToExtend = createdProjects.find(p => 
      p.phase === 'threshold_met' && !p.hasDeliverable
    );
    
    if (projectToExtend) {
      setSelectedCreatedProject(projectToExtend);
      setExtensionModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        walletAddress={walletAddress} 
        arrowBalance={arrowBalance} 
        onCreateProject={handleCreateProject} 
      />
      
      <main className="flex-1 container max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your backed projects and track deliverables
          </p>
        </div>

        {/* My Projects Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Projects ({createdProjects.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                type="created"
                onVoteExtension={handleVoteExtension}
                onRequestExtension={handleRequestExtension}
              />
            ))}
          </div>
        </div>

        {/* Backed Projects Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Backed Projects ({backedProjects.length})</h2>
        </div>

        <div className="space-y-4">
          {backedProjects.map(project => {
            const daysLeft = Math.ceil((new Date(project.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const thresholdPercent = Math.round((parseFloat(project.totalRaised) / parseFloat(project.threshold)) * 100);
            
            return (
              <div key={project.id} className="rounded-lg border p-6 bg-card">
                <div className="flex gap-6">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-24 h-24 rounded-md object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <Badge variant={project.status === 'delivered' ? 'default' : 'outline'}>
                          {project.status === 'delivered' ? 'Deliverable Available' : 
                           project.status === 'refundable' ? 'Refundable' : 'Locked'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <img 
                          src={project.creator.avatar} 
                          alt={project.creator.name} 
                          className="w-4 h-4 rounded-full"
                        />
                        <span>by {project.creator.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Backed: {project.amountBacked} ETH</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {daysLeft > 0 ? `${daysLeft} days` : 'Passed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Progress: {thresholdPercent}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Funding Progress</span>
                        <span>{project.totalRaised} / {project.threshold} ETH</span>
                      </div>
                      <Progress value={Math.min(thresholdPercent, 100)} className="w-full" />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => handleProjectActions(project)}>
                        Manage Backing
                      </Button>
                      {project.hasDeliverable && (
                        <Button variant="outline" onClick={() => handleReceiveDeliverable(project.id)}>
                          Receive Deliverable
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {backedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You haven't backed any projects yet.</p>
          </div>
        )}
      </main>

      {selectedProject && (
        <ProjectActionsModal
          isOpen={actionsModalOpen}
          onClose={() => {
            setActionsModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          onGiveFullAmount={handleGiveFullAmount}
          onReceiveDeliverable={handleReceiveDeliverable}
          onRequestPartialRefund={handleRequestPartialRefund}
        />
      )}

      {selectedCreatedProject && (
        <ExtensionRequestModal
          isOpen={extensionModalOpen}
          onClose={() => {
            setExtensionModalOpen(false);
            setSelectedCreatedProject(null);
          }}
          project={selectedCreatedProject}
        />
      )}

      <CreateProjectModal
        isOpen={createProjectModalOpen}
        onClose={() => setCreateProjectModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
