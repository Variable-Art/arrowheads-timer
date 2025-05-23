
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Image, FileVideo, FileAudio } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

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

interface UploadDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CreatedProject;
}

// Define step type
type DeliverableStep = 'type' | 'import' | 'distribution' | 'confirm';

// Define token type
type TokenType = 'nft' | 'fungible';

// Define NFT standard
type NFTStandard = 'erc721' | 'erc1155';

// Distribution form schema
const distributionSchema = z.object({
  minimumBackingUnit: z.string().min(1, "Minimum backing unit is required"),
  deliverablePerUnit: z.string().min(1, "Deliverable amount per unit is required"),
});

// Import form schema for NFT
const nftImportSchema = z.object({
  contractAddress: z.string().min(1, "Contract address is required"),
  tokenIds: z.string().optional(),
  quantity: z.string().optional(),
});

// Import form schema for fungible token
const fungibleImportSchema = z.object({
  contractAddress: z.string().min(1, "Contract address is required"),
});

const UploadDeliverableModal = ({ isOpen, onClose, project }: UploadDeliverableModalProps) => {
  const [currentStep, setCurrentStep] = useState<DeliverableStep>('type');
  const [tokenType, setTokenType] = useState<TokenType | null>(null);
  const [nftStandard, setNftStandard] = useState<NFTStandard | null>(null);
  const [previewData, setPreviewData] = useState<{
    tokenName: string;
    tokenSymbol: string;
    balance: string;
    imageUrl?: string;
  } | null>(null);

  // Mock data for eligible backers
  const eligibleBackers = 15;
  const totalRequired = tokenType === 'nft' ? eligibleBackers : eligibleBackers * 5;

  // Distribution form
  const distributionForm = useForm<z.infer<typeof distributionSchema>>({
    resolver: zodResolver(distributionSchema),
    defaultValues: {
      minimumBackingUnit: "0.01",
      deliverablePerUnit: "5",
    },
  });

  // NFT import form
  const nftImportForm = useForm<z.infer<typeof nftImportSchema>>({
    resolver: zodResolver(nftImportSchema),
    defaultValues: {
      contractAddress: "",
      tokenIds: "",
      quantity: "1",
    },
  });

  // Fungible token import form
  const fungibleImportForm = useForm<z.infer<typeof fungibleImportSchema>>({
    resolver: zodResolver(fungibleImportSchema),
    defaultValues: {
      contractAddress: "",
    },
  });

  // Handling token type selection
  const handleTokenTypeSelect = (type: TokenType) => {
    setTokenType(type);
    setCurrentStep('import');
  };

  // Handling NFT standard selection
  const handleNFTStandardSelect = (standard: NFTStandard) => {
    setNftStandard(standard);
  };

  // Mock import token data
  const handleImportToken = () => {
    if (tokenType === 'nft') {
      const values = nftImportForm.getValues();
      if (!values.contractAddress) return;
      
      // Simulate fetching NFT data
      setPreviewData({
        tokenName: "Arrowheads Collectible",
        tokenSymbol: "ARROW",
        balance: nftStandard === 'erc721' ? '24' : '1000',
        imageUrl: '/lovable-uploads/70a0a04f-7986-4605-8852-902d239bafc3.png'
      });
      
      setCurrentStep('distribution');
    } else {
      const values = fungibleImportForm.getValues();
      if (!values.contractAddress) return;
      
      // Simulate fetching fungible token data
      setPreviewData({
        tokenName: "Arrowhead Token",
        tokenSymbol: "ARWT",
        balance: "10000",
      });
      
      setCurrentStep('distribution');
    }
  };

  // Handle distribution form submission
  const onDistributionSubmit = (data: z.infer<typeof distributionSchema>) => {
    console.log("Distribution data:", data);
    setCurrentStep('confirm');
  };

  // Handle final submission
  const handleFinalize = () => {
    toast({
      title: "Deliverable uploaded successfully",
      description: "Your deliverable has been uploaded and backers can now claim it."
    });
    onClose();
  };

  // Reset state when modal closes
  const handleClose = () => {
    setCurrentStep('type');
    setTokenType(null);
    setNftStandard(null);
    setPreviewData(null);
    onClose();
  };

  // Progress indicator
  const getProgressValue = () => {
    switch (currentStep) {
      case 'type': return 25;
      case 'import': return 50;
      case 'distribution': return 75;
      case 'confirm': return 100;
      default: return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Upload Deliverable for {project.title}</DialogTitle>
          <DialogDescription>
            Provide a deliverable for your backers based on their contribution.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {currentStep === 'type' && 'Step 1: Choose Deliverable Type'}
              {currentStep === 'import' && 'Step 2: Import Deliverable'}
              {currentStep === 'distribution' && 'Step 3: Set Distribution Logic'}
              {currentStep === 'confirm' && 'Step 4: Confirm & Submit'}
            </span>
            <span className="text-sm text-muted-foreground">{getProgressValue()}% Complete</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Step 1: Choose Deliverable Type */}
        {currentStep === 'type' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Choose the type of deliverable you want to provide to your backers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:border-primary ${tokenType === 'nft' ? 'border-primary border-2' : ''}`}
                onClick={() => handleTokenTypeSelect('nft')}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Image className="h-16 w-16 mb-4 text-primary" />
                  <h3 className="text-lg font-medium">NFT</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Non-fungible token (ERC-721 or ERC-1155)
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:border-primary ${tokenType === 'fungible' ? 'border-primary border-2' : ''}`}
                onClick={() => handleTokenTypeSelect('fungible')}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <FileAudio className="h-16 w-16 mb-4 text-primary" />
                  <h3 className="text-lg font-medium">Fungible Token</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Standard token (ERC-20)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Import Deliverable */}
        {currentStep === 'import' && tokenType === 'nft' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Select NFT Standard</h4>
              <RadioGroup 
                defaultValue={nftStandard || "erc721"} 
                className="grid grid-cols-2 gap-4"
                onValueChange={(value) => handleNFTStandardSelect(value as NFTStandard)}
              >
                <div className={`flex items-center space-x-2 border rounded-md p-4 ${nftStandard === 'erc721' ? 'border-primary' : ''}`}>
                  <RadioGroupItem value="erc721" id="erc721" />
                  <label htmlFor="erc721" className="cursor-pointer w-full">
                    <div className="font-medium">ERC-721</div>
                    <div className="text-sm text-muted-foreground">Unique, one-of-a-kind NFTs</div>
                  </label>
                </div>
                <div className={`flex items-center space-x-2 border rounded-md p-4 ${nftStandard === 'erc1155' ? 'border-primary' : ''}`}>
                  <RadioGroupItem value="erc1155" id="erc1155" />
                  <label htmlFor="erc1155" className="cursor-pointer w-full">
                    <div className="font-medium">ERC-1155</div>
                    <div className="text-sm text-muted-foreground">Semi-fungible, multiple editions</div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <Form {...nftImportForm}>
              <form className="space-y-4">
                <FormField
                  control={nftImportForm.control}
                  name="contractAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NFT Contract Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {nftStandard === 'erc721' && (
                  <FormField
                    control={nftImportForm.control}
                    name="tokenIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Token IDs 
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-4 w-4 p-0 ml-1 text-muted-foreground">?</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p className="text-sm">
                                Enter comma-separated token IDs (e.g. 1,2,3) or a range (e.g. 1-100)
                              </p>
                            </PopoverContent>
                          </Popover>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="1,2,3 or 1-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {nftStandard === 'erc1155' && (
                  <FormField
                    control={nftImportForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Available</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep('type')}>Back</Button>
                  <Button type="button" onClick={handleImportToken}>Import NFT</Button>
                </div>
              </form>
            </Form>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an NFT contract yet?
              </p>
              <Button variant="link" className="p-0 h-auto text-sm">
                Deploy a new NFT contract
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'import' && tokenType === 'fungible' && (
          <div className="space-y-6">
            <Form {...fungibleImportForm}>
              <form className="space-y-4">
                <FormField
                  control={fungibleImportForm.control}
                  name="contractAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Contract Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep('type')}>Back</Button>
                  <Button type="button" onClick={handleImportToken}>Approve & Import</Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Step 3: Set Distribution Logic */}
        {currentStep === 'distribution' && previewData && (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Imported Deliverable</h4>
              
              <div className="flex items-center gap-3">
                {previewData.imageUrl && (
                  <img 
                    src={previewData.imageUrl} 
                    alt={previewData.tokenName} 
                    className="w-16 h-16 rounded-md object-cover" 
                  />
                )}
                
                <div>
                  <div className="font-medium">{previewData.tokenName}</div>
                  <div className="text-sm text-muted-foreground">
                    Symbol: {previewData.tokenSymbol}
                  </div>
                  <div className="text-sm">
                    Your Balance: {previewData.balance} {tokenType === 'fungible' ? previewData.tokenSymbol : 'NFTs'}
                  </div>
                </div>
              </div>
            </div>

            <Form {...distributionForm}>
              <form onSubmit={distributionForm.handleSubmit(onDistributionSubmit)} className="space-y-4">
                <FormField
                  control={distributionForm.control}
                  name="minimumBackingUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Minimum Backing Unit (ETH)
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-4 w-4 p-0 ml-1 text-muted-foreground">?</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <p className="text-sm">
                              The smallest amount of ETH that counts as one backing unit. For example, if set to 0.01 ETH, 
                              someone who backed with 0.05 ETH would get 5 units of the deliverable.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0.001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={distributionForm.control}
                  name="deliverablePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Deliverable Amount per Unit
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-4 w-4 p-0 ml-1 text-muted-foreground">?</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <p className="text-sm">
                              How many tokens/NFTs each backing unit will receive. For example, if set to 5,
                              each 0.01 ETH backed will receive 5 tokens.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Distribution Preview</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Eligible Backers:</div>
                    <div className="font-medium">{eligibleBackers}</div>
                    
                    <div>Total {tokenType === 'nft' ? 'NFTs' : 'Tokens'} Required:</div>
                    <div className="font-medium">{totalRequired} {tokenType === 'fungible' ? previewData.tokenSymbol : ''}</div>
                    
                    <div>Creator Balance:</div>
                    <div className={`font-medium ${parseInt(previewData.balance) < totalRequired ? 'text-destructive' : ''}`}>
                      {previewData.balance} {tokenType === 'fungible' ? previewData.tokenSymbol : 'NFTs'}
                      {parseInt(previewData.balance) < totalRequired && (
                        <Badge variant="outline" className="ml-2 text-destructive border-destructive">
                          Insufficient
                        </Badge>
                      )}
                    </div>
                  </div>

                  {parseInt(previewData.balance) < totalRequired && (
                    <p className="text-xs text-destructive mt-2">
                      Warning: Your balance is insufficient to distribute to all backers. Please reduce the deliverable amount per unit or increase your balance.
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep('import')}>
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={parseInt(previewData.balance) < totalRequired}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Step 4: Confirm & Submit */}
        {currentStep === 'confirm' && previewData && (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Review Deliverable</h4>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-1/3 text-sm text-muted-foreground">Deliverable Type:</div>
                  <div className="font-medium">
                    {tokenType === 'nft' ? `NFT (${nftStandard?.toUpperCase()})` : 'Fungible Token (ERC-20)'}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/3 text-sm text-muted-foreground">Token Name:</div>
                  <div className="font-medium">{previewData.tokenName}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/3 text-sm text-muted-foreground">Distribution Formula:</div>
                  <div className="font-medium">
                    Each {distributionForm.getValues().minimumBackingUnit} ETH = {distributionForm.getValues().deliverablePerUnit} {tokenType === 'fungible' ? previewData.tokenSymbol : 'NFT'}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/3 text-sm text-muted-foreground">Eligible Backers:</div>
                  <div className="font-medium">{eligibleBackers}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-1/3 text-sm text-muted-foreground">Required Amount:</div>
                  <div className="font-medium">
                    {totalRequired} {tokenType === 'fungible' ? previewData.tokenSymbol : 'NFTs'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="confirm" className="mt-1" />
              <label htmlFor="confirm" className="text-sm">
                I confirm that this deliverable will be sent to all eligible backers according to the distribution logic above.
              </label>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Once finalized, backers will receive a notification that the deliverable is available for claiming. Any backers who don't claim will receive their deliverable automatically when the project deadline is reached.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('distribution')}>
                Back
              </Button>
              <Button onClick={handleFinalize}>
                Finalize Deliverable
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadDeliverableModal;
