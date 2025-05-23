import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ProjectExploreCard from '@/components/ProjectExploreCard';
import ProjectFilters from '@/components/ProjectFilters';
import FeaturedProject from '@/components/FeaturedProject';
import CreateProjectModal from '@/components/CreateProjectModal';

// Sample project data for exploration
const sampleProjects = [
  {
    id: '1',
    title: 'Build a Solar Music Box',
    creator: {
      name: '@stellabeam',
      avatar: '/lovable-uploads/f405cf6d-7332-4b46-b1a3-e3aa781f5aa1.png'
    },
    description: 'A poetic little invention for cloudy days.',
    image: '/lovable-uploads/70a0a04f-7986-4605-8852-902d239bafc3.png',
    status: 'funding' as const,
    currentAmount: '0.72',
    threshold: '1.0',
    thresholdPercent: 72,
    deadline: '2025-02-28',
    daysLeft: 3,
    category: 'experimental'
  },
  {
    id: '2',
    title: 'Crypto Cookbook Vol. 1',
    creator: {
      name: '@web3chef',
      avatar: '/lovable-uploads/df0a3d71-8a2f-4a46-9ee5-81628460b3e5.png'
    },
    description: 'A digital zine of onchain recipes.',
    image: '/lovable-uploads/d6392a33-25c4-4ee2-a4ce-95adbbbeec3f.png',
    status: 'deliverable_available' as const,
    currentAmount: '2.1',
    threshold: '1.5',
    thresholdPercent: 140,
    deadline: '2025-03-15',
    daysLeft: 18,
    category: 'comics'
  },
  {
    id: '3',
    title: 'Experimental Music NFTs',
    creator: {
      name: '@soundwave',
      avatar: '/lovable-uploads/f405cf6d-7332-4b46-b1a3-e3aa781f5aa1.png'
    },
    description: 'Generative audio experiences on chain.',
    image: '/lovable-uploads/874f36d7-1c89-41ae-8126-297a249355ac.png',
    status: 'completed' as const,
    currentAmount: '3.2',
    threshold: '2.0',
    thresholdPercent: 160,
    deadline: '2025-01-20',
    daysLeft: 0,
    category: 'music'
  }
];

const featuredProject = {
  id: 'featured',
  title: 'Digital Art Collection Genesis',
  creator: {
    name: '@luisotravez',
    avatar: '/lovable-uploads/f405cf6d-7332-4b46-b1a3-e3aa781f5aa1.png'
  },
  description: 'An innovative collection exploring the intersection of traditional art and blockchain technology.',
  image: '/lovable-uploads/70a0a04f-7986-4605-8852-902d239bafc3.png',
  status: 'funding' as const,
  currentAmount: '4.2',
  threshold: '5.0',
  thresholdPercent: 84,
  deadline: '2025-03-01',
  daysLeft: 8,
  category: 'art'
};

const Index = () => {
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Demo wallet details
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const arrowBalance = '245.8';
  
  const handleCreateProject = () => {
    setCreateProjectModal(true);
  };

  const handleBackProject = (projectId: string) => {
    toast({
      title: "Project Backed!",
      description: "You've successfully backed this project.",
    });
  };

  const handleViewProject = (projectId: string) => {
    console.log('Viewing project:', projectId);
  };

  const handleFiltersChange = (sort: string, filter: string, search: string) => {
    setSortBy(sort);
    setFilterBy(filter);
    setSearchQuery(search);
    
    let filtered = [...sampleProjects];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.creator.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(project => project.status === filter);
    }
    
    // Apply sorting
    switch (sort) {
      case 'ending_soon':
        filtered.sort((a, b) => a.daysLeft - b.daysLeft);
        break;
      case 'most_funded':
        filtered.sort((a, b) => parseFloat(b.currentAmount) - parseFloat(a.currentAmount));
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }
    
    setFilteredProjects(filtered);
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
          <h1 className="text-4xl font-bold mb-2">Explore Projects</h1>
          <p className="text-muted-foreground text-lg">
            Discover and back creative projects with built-in accountability
          </p>
        </div>

        {/* Featured Project */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Project</h2>
          <FeaturedProject 
            project={featuredProject}
            onBackProject={handleBackProject}
            onViewProject={handleViewProject}
          />
        </div>

        {/* Filters and Search */}
        <ProjectFilters onFiltersChange={handleFiltersChange} />

        {/* Projects Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Projects</h2>
            <span className="text-sm text-muted-foreground">
              {filteredProjects.length} projects found
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectExploreCard
              key={project.id}
              project={project}
              onBackProject={handleBackProject}
              onViewProject={handleViewProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        )}
      </main>
      
      <CreateProjectModal 
        isOpen={createProjectModal}
        onClose={() => setCreateProjectModal(false)}
      />
    </div>
  );
};

export default Index;
