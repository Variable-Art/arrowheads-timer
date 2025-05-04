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
    image: '/lovable-uploads/eecb6082-c29e-4237-9dbe-e943b0d5932f.png', 
    status: 'upgradeable',
    finalImage: '/lovable-uploads/89dd6577-6c99-403d-8ae7-aa5acbfb47d8.png', 
    description: 'A beacon of hope in a desolate landscape, guiding survivors to sanctuary.',
    editionSize: '10 of 50',
    timeRemaining: '14 days left to upgrade',
    author: {
      name: '@luisotravez',
      avatar: '/lovable-uploads/ed7ee5a8-d648-4cc1-b401-78aa68ea6ca2.png'
    }
  },
  {
    id: '2',
    title: 'Luminary - Flight',
    image: '/lovable-uploads/ac69cc71-c556-488e-8c98-10b37539364e.png', 
    status: 'held',
    description: 'A young hero escapes through neon-lit alleys with his robot companion.',
    author: {
      name: '@naaate',
      avatar: '/lovable-uploads/930aac06-5943-4156-9b4c-9a836db0fa10.png'
    }
  },
  {
    id: '3',
    title: 'Light Underground',
    image: '/lovable-uploads/7b4a4e74-8465-4df3-aca9-c8564bc18365.png', 
    status: 'held',
    description: 'Rays of hope penetrate the darkness, illuminating forgotten paths and awakening dormant life.',
    author: {
      name: '@naaate',
      avatar: '/lovable-uploads/930aac06-5943-4156-9b4c-9a836db0fa10.png'
    }
  },
];

const exploreDrafts: NFT[] = [
  {
    id: '4',
    title: 'Eva Fenwild',
    image: '/lovable-uploads/ca19cae3-7b6c-4a25-9aab-edbadc9b8999.png',
    description: 'Fae Touched Wanderer who can attune to emotions, transforming fear into concealing mist, joy into luminous guide butterflies, and grief into arrows that never miss but leave no wound.',
    price: '0.006 ETH',
    timeLeft: '4 days left',
    status: 'buyable',
    author: {
      name: '@jacque',
      avatar: '/lovable-uploads/c0d2e345-3ba2-4a62-9466-4e0ff099cf23.png'
    }
  },
  {
    id: '5', 
    title: 'Pip Shadowgleam',
    image: '/lovable-uploads/d69ddbff-7c2b-4aa6-abe5-4a70e6b4c74d.png',
    description: 'Celestial Scout raised by star-watching fae who creates starlight trails, turns armor into mirrors reflecting harmful magic, and shrouds in cosmic dust for stealth.',
    price: '0.007 ETH',
    timeLeft: '5 days left',
    status: 'buyable',
    author: {
      name: '@jacque',
      avatar: '/lovable-uploads/c0d2e345-3ba2-4a62-9466-4e0ff099cf23.png'
    }
  },
  {
    id: '6',
    title: "Ether's Ray",
    image: '/lovable-uploads/933ff4a3-8575-42d1-b3d6-cd639ab587b3.png',
    description: 'Solar Archer from Sylvanis Astra, a twilight forest between dimensions where the Ether Veil binds all living things in luminous harmony.',
    price: '0.008 ETH',
    timeLeft: '6 days left',
    status: 'buyable',
    author: {
      name: '@garance',
      avatar: '/lovable-uploads/16434874-4a5a-4b99-b598-5ab133463f41.png'
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
