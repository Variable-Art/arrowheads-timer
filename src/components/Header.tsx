
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  walletAddress: string;
  arrowBalance: string;
  onSubmitDraft: () => void;
}

const Header = ({ walletAddress, arrowBalance, onSubmitDraft }: HeaderProps) => {
  // Truncate wallet address for display
  const truncatedAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

  return (
    <header className="w-full py-4 px-6 border-b flex items-center justify-between bg-background sticky top-0 z-10">
      <div className="flex items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <ArrowheadLogo />
          </div>
          <h1 className="text-xl font-bold">Arrowheads</h1>
        </div>
      </div>

      {/* Right side - wallet & submit button */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="hidden sm:flex items-center gap-2 text-sm rounded-full bg-muted py-1.5 px-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-soft"></div>
          <span className="font-medium">{truncatedAddress}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 bg-muted rounded-full py-1.5 px-3">
          <span className="text-sm font-medium">{arrowBalance}</span>
          <span className="text-sm text-muted-foreground">$arrow</span>
        </div>
        
        <Button onClick={onSubmitDraft} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Submit</span>
          <span className="sm:hidden">+</span>
        </Button>
      </div>
    </header>
  );
};

// Simple arrow logo component
const ArrowheadLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M5 9l7-7 7 7m0 0v8m0-8H5v8l7 7 7-7v-8z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default Header;
