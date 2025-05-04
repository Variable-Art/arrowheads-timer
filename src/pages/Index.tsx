
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import NFTCard from '@/components/NFTCard';
import UpgradeModal from '@/components/UpgradeModal';

// Mock data for the app
const myNfts = [
  {
    id: '1',
    title: 'Build a Solar Music Box',
    image: '/placeholder.svg',
    status: 'upgradeable' as const,
    finalImage: '/placeholder.svg',
    description: 'A music box powered by solar energy, playing tunes based on light intensity.',
    editionSize: '10 of 50',
    timeRemaining: '14 days left to upgrade',
  },
  {
    id: '2',
    title: 'AR Sketchbook',
    image: '/placeholder.svg',
    status: 'held' as const,
  },
  {
    id: '3',
    title: 'Modular Synth Kit',
    image: '/placeholder.svg',
    status: 'held' as const,
  },
];

const exploreDrafts = [
  {
    id: '4',
    title: 'Garden Sensor Network',
    image: '/placeholder.svg',
    description: 'IoT network monitoring soil conditions and plant health with offline-first approach.',
    price: '0.005 ETH',
    timeLeft: '3 days left',
    status: 'buyable' as const,
  },
  {
    id: '5', 
    title: 'Reactive Light Installation',
    image: '/placeholder.svg',
    description: 'Interactive light installation that responds to movement and sound in the environment.',
    price: '0.007 ETH',
    timeLeft: '5 days left',
    status: 'buyable' as const,
  },
];

const Index = () => {
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    nft: myNfts[0],
  });
  
  // Demo wallet details
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const arrowBalance = '245.8';
  
  const handleUpgrade = (nft: typeof myNfts[0]) => {
    setUpgradeModal({ isOpen: true, nft });
  };
  
  const handleConfirmUpgrade = () => {
    toast({
      title: "NFT Upgraded!",
      description: "Your Rough Draft has been upgraded to a Final NFT.",
    });
    setUpgradeModal({ ...upgradeModal, isOpen: false });
  };
  
  const handleRedeem = (nftId: string) => {
    toast({
      title: "Redemption Initiated",
      description: "Your NFT will be redeemed for ETH + $arrow tokens.",
    });
  };
  
  const handleMint = (nftId: string) => {
    toast({
      title: "Minting Initiated",
      description: "Transaction sent to mint this Rough Draft NFT.",
    });
  };
  
  const handleSubmitDraft = () => {
    toast({
      title: "Coming Soon",
      description: "The submission form will be available in the next release.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        walletAddress={walletAddress} 
        arrowBalance={arrowBalance} 
        onSubmitDraft={handleSubmitDraft} 
      />
      
      <main className="flex-1 container max-w-6xl mx-auto p-6">
        <div className="grid gap-10">
          {/* My Rough Drafts Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">My Rough Drafts</h2>
              <span className="text-sm text-muted-foreground">{myNfts.length} NFTs</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNfts.map(nft => (
                <NFTCard
                  key={nft.id}
                  {...nft}
                  onUpgrade={() => handleUpgrade(nft)}
                  onRedeem={() => handleRedeem(nft.id)}
                />
              ))}
            </div>
          </section>
          
          {/* Explore Drafts Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Explore Rough Drafts</h2>
              <span className="text-sm text-muted-foreground">New projects to back</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exploreDrafts.map(nft => (
                <NFTCard
                  key={nft.id}
                  {...nft}
                  onMint={() => handleMint(nft.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
        nft={upgradeModal.nft}
        onUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
};

export default Index;
