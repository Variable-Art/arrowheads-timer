import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import NFTCard from '@/components/NFTCard';
import UpgradeModal from '@/components/UpgradeModal';

// Define interfaces for our NFT types
interface BaseNFT {
  id: string;
  title: string;
  image: string;
  status: 'upgradeable' | 'held' | 'buyable';
  author?: {
    name: string;
    avatar: string;
  };
}

interface UpgradeableNFT extends BaseNFT {
  status: 'upgradeable';
  finalImage: string;
  description: string;
  editionSize: string;
  timeRemaining: string;
}

interface HeldNFT extends BaseNFT {
  status: 'held';
  description?: string;
}

interface BuyableNFT extends BaseNFT {
  status: 'buyable';
  description: string;
  price: string;
  timeLeft: string;
}

type NFT = UpgradeableNFT | HeldNFT | BuyableNFT;

// Mock data for the app
const myNfts: NFT[] = [
  {
    id: '1',
    title: 'The Lumen Directive',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    status: 'upgradeable',
    finalImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    description: 'A beacon of hope in a desolate landscape, guiding survivors to sanctuary.',
    editionSize: '10 of 50',
    timeRemaining: '14 days left to upgrade',
    author: {
      name: '@luisotravez',
      avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    }
  },
  {
    id: '2',
    title: 'Luminary - Flight',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    status: 'held',
    description: 'A young hero escapes through neon-lit alleys with his robot companion.',
    author: {
      name: '@naaate',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    }
  },
  {
    id: '3',
    title: 'Light Underground',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    status: 'held',
    description: 'Rays of hope penetrate the darkness, illuminating forgotten paths and awakening dormant life.',
    author: {
      name: '@naaate',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    }
  },
];

const exploreDrafts: NFT[] = [
  {
    id: '4',
    title: 'Eva Fenwild',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    description: 'Fae Touched Wanderer who can attune to emotions, transforming fear into concealing mist, joy into luminous guide butterflies, and grief into arrows that never miss but leave no wound.',
    price: '0.006 ETH',
    timeLeft: '4 days left',
    status: 'buyable',
    author: {
      name: '@jacque',
      avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    }
  },
  {
    id: '5',
    title: 'Pip Shadowgleam',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    description: 'Celestial Scout raised by star-watching fae who creates starlight trails, turns armor into mirrors reflecting harmful magic, and shrouds in cosmic dust for stealth.',
    price: '0.007 ETH',
    timeLeft: '5 days left',
    status: 'buyable',
    author: {
      name: '@jacque',
      avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
    }
  },
  {
    id: '6',
    title: "Ether's Ray",
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    description: 'Solar Archer from Sylvanis Astra, a twilight forest between dimensions where the Ether Veil binds all living things in luminous harmony.',
    price: '0.008 ETH',
    timeLeft: '6 days left',
    status: 'buyable',
    author: {
      name: '@garance',
      avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    }
  },
];

const Index = () => {
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean;
    nft: UpgradeableNFT;
  }>({
    isOpen: false,
    nft: myNfts.find(nft => nft.status === 'upgradeable') as UpgradeableNFT,
  });
  
  // Demo wallet details
  const walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
  const arrowBalance = '245.8';
  
  const handleUpgrade = (nft: NFT) => {
    if (nft.status === 'upgradeable') {
      setUpgradeModal({ isOpen: true, nft });
    }
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
    <div className="min-h-screen bg-background flex flex-col">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      {upgradeModal.nft && (
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
          nft={upgradeModal.nft}
          onUpgrade={handleConfirmUpgrade}
        />
      )}
    </div>
  );
};

export default Index;
