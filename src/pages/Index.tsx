
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectModal from '@/components/CreateProjectModal';
import ProjectActionsModal from '@/components/ProjectActionsModal';
import ExtensionRequestModal from '@/components/ExtensionRequestModal';

// Define interfaces for the backing system
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

// Mock data for backed projects
const backedProjects: BackedProject[] = [
  {
    id: '1',
    title: 'Digital Art Collection Genesis',
    creator: {
      name: '@luisotravez',
      avatar: '/lovable-uploads/f405cf6d-7332-4b46-b1a3-e3aa781f5aa1.png'
    },
    image: '/lovable-uploads/70a0a04f-7986-4605-8852-902d239bafc3.png',
    deliveryDate: '2025-02-15',
    amountBacked: '0.05',
    totalRaised: '2.3',
    threshold: '1.0',
    thresholdMet: true,
    status: 'locked',
    hasDeliverable: true
  },
  {
    id: '2',
    title: 'Interactive Story Platform',
    creator: {
      name: '@naaate',
      avatar: '/lovable-uploads/df0a3d71-8a2f-4a46-9ee5-81628460b3e5.png'
    },
    image: '/lovable-uploads/d6392a33-25c4-4ee2-a4ce-95adbbbeec3f.png',
    deliveryDate: '2025-03-01',
    amountBacked: '0.02',
    totalRaised: '0.8',
    threshold: '2.0',
    thresholdMet: false,
    status: 'refundable',
    hasDeliverable: false
  }
];

// Mock data for created projects
const createdProjects: CreatedProject[] = [
  {
    id: '3',
    title: 'Experimental Music NFTs',
    image: '/lovable-uploads/874f36d7-1c89-41ae-8126-297a249355ac.png',
    ethRaised: '1.8',
    threshold: '1.5',
    thresholdPercent: 120,
    deliveryDate: '2025-02-20',
    phase: 'threshold_met',
    hasDeliverable: false
  }
];

const Index = () => {
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [actionsModal, setActionsModal] = useState<{
    isOpen: boolean;
    project: BackedProject | null;
  }>({
    isOpen: false,
    project: null
  });
  const [extensionModal, setExtensionModal] = useState<{
    isOpen: boolean;
    project: CreatedProject | null;
  }>({
    isOpen: false,
    project: null
  });
  
  // Demo wallet details
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const arrowBalance = '245.8';
  
  const handleCreateProject = () => {
    setCreateProjectModal(true);
  };
  
  const handleProjectActions = (project: BackedProject) => {
    setActionsModal({ isOpen: true, project });
  };
  
  const handleGiveFullAmount = (projectId: string) => {
    toast({
      title: "Full Amount Released",
      description: "39% ETH sent to creator, 30% $arrow vesting initiated.",
    });
    setActionsModal({ isOpen: false, project: null });
  };
  
  const handleReceiveDeliverable = (projectId: string) => {
    toast({
      title: "Deliverable Received",
      description: "Project marked as fulfilled, creator has been paid.",
    });
    setActionsModal({ isOpen: false, project: null });
  };
  
  const handleRequestPartialRefund = (projectId: string) => {
    toast({
      title: "Partial Refund Requested",
      description: "40% ETH refund initiated, 30% $arrow vesting started.",
    });
    setActionsModal({ isOpen: false, project: null });
  };
  
  const handleVoteOnExtension = (projectId: string, vote: 'approve' | 'decline') => {
    toast({
      title: `Extension ${vote === 'approve' ? 'Approved' : 'Declined'}`,
      description: `Your vote has been recorded for the extension request.`,
    });
  };
  
  const handleUploadDeliverable = (projectId: string) => {
    toast({
      title: "Deliverable Upload",
      description: "Upload functionality would open here.",
    });
  };
  
  const handleRequestExtension = (project: CreatedProject) => {
    setExtensionModal({ isOpen: true, project });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        walletAddress={walletAddress} 
        arrowBalance={arrowBalance} 
        onCreateProject={handleCreateProject} 
      />
      
      <main className="flex-1 container max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Backing Dashboard</h1>
          <p className="text-muted-foreground">
            Fund creative projects with built-in accountability and flexible delivery options
          </p>
        </div>

        <Tabs defaultValue="backed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backed">Projects I Backed</TabsTrigger>
            <TabsTrigger value="created">My Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="backed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Projects I Backed</h2>
              <span className="text-sm text-muted-foreground">{backedProjects.length} projects</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backedProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  type="backed"
                  onProjectActions={() => handleProjectActions(project)}
                  onVoteExtension={(vote) => handleVoteOnExtension(project.id, vote)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="created" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <span className="text-sm text-muted-foreground">{createdProjects.length} projects</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  type="created"
                  onUploadDeliverable={() => handleUploadDeliverable(project.id)}
                  onRequestExtension={() => handleRequestExtension(project)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <CreateProjectModal 
        isOpen={createProjectModal}
        onClose={() => setCreateProjectModal(false)}
      />

      {actionsModal.project && (
        <ProjectActionsModal
          isOpen={actionsModal.isOpen}
          onClose={() => setActionsModal({ isOpen: false, project: null })}
          project={actionsModal.project}
          onGiveFullAmount={handleGiveFullAmount}
          onReceiveDeliverable={handleReceiveDeliverable}
          onRequestPartialRefund={handleRequestPartialRefund}
        />
      )}

      {extensionModal.project && (
        <ExtensionRequestModal
          isOpen={extensionModal.isOpen}
          onClose={() => setExtensionModal({ isOpen: false, project: null })}
          project={extensionModal.project}
        />
      )}
    </div>
  );
};

export default Index;
