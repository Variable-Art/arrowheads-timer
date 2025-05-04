
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Check, Info, Share, Upload, ExternalLink, CircleCheck } from 'lucide-react';
import NFTPreview from './NFTPreview';

interface SubmitDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitDraftModal = ({ isOpen, onClose }: SubmitDraftModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    artwork: null as File | null,
    artworkPreview: '',
    mintDuration: 7,
    mintPrice: '0.005',
    projectToken: '$arrow',
    attestation: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            artwork: file,
            artworkPreview: event.target.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, attestation: checked }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.shortDescription || !formData.artwork)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!formData.attestation) {
      toast({
        title: "Attestation Required",
        description: "Please confirm that you are the creator of this work.",
        variant: "destructive"
      });
      return;
    }

    // Here you would handle the actual submission logic
    toast({
      title: "Rough Draft Mint Live!",
      description: "Your creative project is now available for minting.",
    });
    
    // Reset form and close modal
    setStep(4);
  };

  const handleClose = () => {
    // Reset form state if closed
    setStep(1);
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      artwork: null,
      artworkPreview: '',
      mintDuration: 7,
      mintPrice: '0.005',
      projectToken: '$arrow',
      attestation: false,
    });
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      artwork: null,
      artworkPreview: '',
      mintDuration: 7,
      mintPrice: '0.005',
      projectToken: '$arrow',
      attestation: false,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 overflow-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <SheetTitle>
              {step === 4 ? "Mint Live!" : `Submit Rough Draft (${step}/3)`}
            </SheetTitle>
            <SheetDescription>
              {step === 1 && "Got an idea? Mint your first draft and rally backers."}
              {step === 2 && "Set how your project will be funded and shared."}
              {step === 3 && "Review your project before launching it."}
              {step === 4 && "Your creative project is now ready for backers!"}
            </SheetDescription>
          </SheetHeader>

          {/* Form Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Step 1: Project Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Your creative project title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">
                    Short Description <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formData.shortDescription.length}/280 chars)
                    </span>
                  </Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    placeholder="A concise description of your project"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength={280}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription">
                    Full Description
                    <span className="text-xs text-muted-foreground ml-2">
                      (optional, {formData.fullDescription.length}/1000 chars)
                    </span>
                  </Label>
                  <Textarea
                    id="fullDescription"
                    name="fullDescription"
                    placeholder="Share more details about your creative vision"
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    maxLength={1000}
                    className="resize-none h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Artwork <span className="text-destructive">*</span>
                  </Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    {formData.artworkPreview ? (
                      <div className="w-full space-y-4">
                        <img 
                          src={formData.artworkPreview} 
                          alt="Preview" 
                          className="w-full max-h-[300px] object-contain"
                        />
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setFormData(prev => ({ ...prev, artwork: null, artworkPreview: '' }))}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Supported formats: JPG, PNG, SVG
                        </p>
                        <Input
                          id="artwork"
                          type="file"
                          accept=".jpg,.jpeg,.png,.svg"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('artwork')?.click()}
                        >
                          Select File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Mint Setup */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="font-medium mb-2 flex items-center">
                    Edition Type
                    <span className="ml-auto text-sm text-muted-foreground">Timed Open Edition</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All backers can mint during the set time period
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mintDuration" className="flex items-center">
                    Mint Duration 
                    <span className="ml-auto text-sm text-muted-foreground">7 days</span>
                  </Label>
                  <div className="pt-2">
                    <input
                      type="range"
                      id="mintDuration"
                      name="mintDuration"
                      min="1"
                      max="14"
                      value={formData.mintDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, mintDuration: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 day</span>
                      <span>7 days</span>
                      <span>14 days</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mintPrice" className="flex items-center">
                    Price per Mint 
                    <button className="ml-1" title="Funds are split with 33% as ETH, 33% as $arrow, and 34% for you on upgrade">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </Label>
                  <div className="flex">
                    <Input
                      id="mintPrice"
                      name="mintPrice"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={formData.mintPrice}
                      onChange={handleInputChange}
                    />
                    <div className="bg-muted px-3 flex items-center ml-2 rounded-md">
                      <span>ETH</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="mb-2 block">Funds Split Breakdown</Label>
                  <div className="bg-muted/50 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Locked ETH (33%)</span>
                      <span className="font-medium">{(parseFloat(formData.mintPrice) * 0.33).toFixed(3)} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Swapped to $arrow (33%)</span>
                      <span className="font-medium">{(parseFloat(formData.mintPrice) * 0.33).toFixed(3)} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">To artist on upgrade (34%)</span>
                      <span className="font-medium">{(parseFloat(formData.mintPrice) * 0.34).toFixed(3)} ETH</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 mt-2">
                      <div className="flex h-full rounded-full overflow-hidden">
                        <div className="bg-blue-500 w-1/3"></div>
                        <div className="bg-green-500 w-1/3"></div>
                        <div className="bg-purple-500 w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectToken" className="flex items-center">
                    Project Token 
                    <button className="ml-1" title="The token used for this project's ecosystem">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </Label>
                  <Input
                    id="projectToken"
                    value="$arrow"
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default token for all projects (customizable in forked versions)
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Review & Attest */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-lg font-medium mb-2">Review Your Rough Draft NFT</div>
                
                <div className="border rounded-lg overflow-hidden">
                  <NFTPreview
                    title={formData.title}
                    description={formData.shortDescription}
                    image={formData.artworkPreview}
                    price={`${formData.mintPrice} ETH`}
                    timeLeft={`${formData.mintDuration} days`}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="font-medium">Mint Details</div>
                    <div className="bg-muted/50 rounded-md p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span>Timed Open Edition</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span>{formData.mintDuration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span>{formData.mintPrice} ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="attestation" 
                      checked={formData.attestation}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="attestation" className="text-sm">
                      I attest that I am the creator of this work
                    </Label>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    An EAS attestation will be generated from your wallet + submitted metadata.
                    <button className="ml-1 underline" title="Learn more about attestations">
                      Learn more
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="flex flex-col items-center py-6">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-6">
                  <CircleCheck className="h-12 w-12 text-green-600 dark:text-green-500" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Rough Draft Mint Live!</h3>
                <p className="text-muted-foreground text-center mb-8">
                  Your creative project is now available for backers to mint.
                </p>

                <div className="w-full max-w-md space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => window.open('#', '_blank')}>
                    View Mint Page
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="w-full">
                    Share on Farcaster
                    <Share className="ml-2 h-4 w-4" />
                  </Button>

                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={() => {
                      resetForm();
                      handleClose();
                    }}
                  >
                    Back to Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={resetForm}
                  >
                    Submit Another
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step < 4 && (
            <div className="p-6 border-t flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit + Start Mint
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SubmitDraftModal;
