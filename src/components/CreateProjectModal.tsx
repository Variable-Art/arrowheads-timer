
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
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Check, CalendarIcon, Upload, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    coverImage: null as File | null,
    coverImagePreview: '',
    threshold: '1.0',
    deliveryDate: undefined as Date | undefined,
    fundingIncrements: '0.001',
    placeholderDeliverable: null as File | null,
    uploadNow: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'placeholderDeliverable') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (field === 'coverImage') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({
              ...prev,
              coverImage: file,
              coverImagePreview: event.target.result as string
            }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({ ...prev, placeholderDeliverable: file }));
      }
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.pitch || !formData.coverImage)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 2 && (!formData.threshold || !formData.deliveryDate)) {
      toast({
        title: "Missing Information",
        description: "Please set threshold and delivery date before continuing.",
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
    toast({
      title: "Project Created!",
      description: "Your project is now live and accepting backers.",
    });
    
    // Reset form and close modal
    setStep(1);
    setFormData({
      title: '',
      pitch: '',
      coverImage: null,
      coverImagePreview: '',
      threshold: '1.0',
      deliveryDate: undefined,
      fundingIncrements: '0.001',
      placeholderDeliverable: null,
      uploadNow: false,
    });
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      title: '',
      pitch: '',
      coverImage: null,
      coverImagePreview: '',
      threshold: '1.0',
      deliveryDate: undefined,
      fundingIncrements: '0.001',
      placeholderDeliverable: null,
      uploadNow: false,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 overflow-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Create New Project ({step}/3)</SheetTitle>
            <SheetDescription>
              {step === 1 && "Set up your project basics and visual identity."}
              {step === 2 && "Configure funding parameters and delivery timeline."}
              {step === 3 && "Review your project before launching it live."}
            </SheetDescription>
          </SheetHeader>

          {/* Form Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Step 1: Basic Info */}
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
                  <Label htmlFor="pitch">
                    Short Pitch <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formData.pitch.length}/500 chars)
                    </span>
                  </Label>
                  <Textarea
                    id="pitch"
                    name="pitch"
                    placeholder="Describe your project and what backers will receive"
                    value={formData.pitch}
                    onChange={handleInputChange}
                    maxLength={500}
                    className="resize-none h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Cover Image/Icon <span className="text-destructive">*</span>
                  </Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    {formData.coverImagePreview ? (
                      <div className="w-full space-y-4">
                        <img 
                          src={formData.coverImagePreview} 
                          alt="Preview" 
                          className="w-full max-h-[200px] object-cover rounded"
                        />
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: '' }))}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload cover image or icon
                        </p>
                        <Input
                          id="coverImage"
                          type="file"
                          accept=".jpg,.jpeg,.png,.svg"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'coverImage')}
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('coverImage')?.click()}
                        >
                          Select File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Funding Setup */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="threshold" className="flex items-center">
                    Minimum Threshold <span className="text-destructive ml-1">*</span>
                    <button className="ml-1" title="Minimum ETH needed to activate the project">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </Label>
                  <div className="flex">
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      placeholder="1.0"
                    />
                    <div className="bg-muted px-3 flex items-center ml-2 rounded-md">
                      <span>ETH</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    Delivery Deadline <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.deliveryDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingIncrements" className="flex items-center">
                    Funding Increments
                    <button className="ml-1" title="Minimum amount backers can contribute">
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </Label>
                  <div className="flex">
                    <Input
                      id="fundingIncrements"
                      name="fundingIncrements"
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={formData.fundingIncrements}
                      onChange={handleInputChange}
                      placeholder="0.001"
                    />
                    <div className="bg-muted px-3 flex items-center ml-2 rounded-md">
                      <span>ETH</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Label className="mb-2 block">Funding Distribution</Label>
                  <div className="bg-muted/50 rounded-md p-4 space-y-3">
                    <div className="text-sm font-medium mb-2">Before Threshold:</div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Full refunds available</span>
                      <span className="font-medium">100%</span>
                    </div>
                    
                    <div className="text-sm font-medium mb-2 mt-4">After Threshold:</div>
                    <div className="flex items-center justify-between text-sm">
                      <span>ETH to creator immediately</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>ETH swapped to $arrow, held</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>ETH held for backer choice</span>
                      <span className="font-medium">40%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-lg font-medium mb-4">Review Your Project</div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={formData.coverImagePreview || '/placeholder.svg'} 
                      alt="Project preview" 
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        Funding Phase
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{formData.title || 'Project Title'}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{formData.pitch}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Threshold</span>
                        <span className="font-medium">{formData.threshold} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Date</span>
                        <span className="font-medium">
                          {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Contribution</span>
                        <span className="font-medium">{formData.fundingIncrements} ETH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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
                Launch Project
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateProjectModal;
