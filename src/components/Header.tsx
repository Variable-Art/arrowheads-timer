
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, ArrowUpDown, Compass, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  walletAddress: string;
  arrowBalance: string;
  onCreateProject: () => void;
}

const Header = ({ walletAddress, arrowBalance, onCreateProject }: HeaderProps) => {
  const navigate = useNavigate();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleExplore = () => {
    navigate('/');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleExplore}>
            <ArrowUpDown className="h-6 w-6" />
            <span className="font-bold text-xl">Arrowheads</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" className="gap-2" onClick={handleExplore}>
              <Compass className="h-4 w-4" />
              Explore
            </Button>
            <Button variant="ghost" className="gap-2" onClick={handleDashboard}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={onCreateProject} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Project</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="gap-1 px-3 py-1">
              <span className="text-sm">$arrow</span>
              <span className="font-mono">{arrowBalance}</span>
            </Badge>
            
            <Badge variant="outline" className="gap-1 px-3 py-1">
              <Wallet className="h-3 w-3" />
              <span className="font-mono text-sm">{truncateAddress(walletAddress)}</span>
            </Badge>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
