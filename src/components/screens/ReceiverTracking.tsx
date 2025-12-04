import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, Truck, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ReceiverTracking: React.FC = () => {
  const { selectedListing, setCurrentScreen, updateDonationStatus } = useApp();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);

  const steps = [
    { id: 0, label: 'Accepted', icon: Check },
    { id: 1, label: 'On the Way', icon: Truck },
    { id: 2, label: 'Picked Up', icon: Package },
  ];

  // Simulate tracking progress
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 3000);
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
      toast({
        title: "Pickup Complete!",
        description: "Food has been successfully picked up",
      });
      setTimeout(() => setShowReviewDialog(true), 1000);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleReviewSubmit = () => {
    if (selectedListing) {
      updateDonationStatus(selectedListing.id, 'completed');
    }
    
    toast({
      title: "Thank You!",
      description: "Your review helps us improve our service",
    });
    
    setShowReviewDialog(false);
    setCurrentScreen('receiver-dashboard');
  };

  if (!selectedListing) {
    setCurrentScreen('receiver-dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">Rate Your Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground">
              How was your experience with this donation pickup?
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= rating
                        ? 'fill-secondary text-secondary'
                        : 'text-border'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            <Button
              onClick={handleReviewSubmit}
              size="lg"
              className="w-full"
              disabled={rating === 0}
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card shadow-card sticky top-0 z-10"
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('receiver-dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Track Pickup</h1>
            <p className="text-sm text-muted-foreground">{selectedListing.foodName}</p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card p-6"
        >
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-border rounded-full">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Steps */}
            <div className="flex justify-between relative z-10">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: index <= currentStep ? 1 : 0.8,
                      backgroundColor: index <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                  >
                    <step.icon
                      className={`w-6 h-6 ${
                        index <= currentStep ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                  </motion.div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-accent rounded-xl text-center"
          >
            <p className="text-foreground font-medium">
              {currentStep === 0 && 'Your request has been accepted. Preparing for pickup...'}
              {currentStep === 1 && 'Someone is on the way to pick up the food!'}
              {currentStep === 2 && 'Pickup complete! Thank you for using FoodShare.'}
            </p>
          </motion.div>
        </motion.div>

        {/* Donation Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden"
        >
          <img
            src={selectedListing.photo}
            alt={selectedListing.foodName}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-foreground">{selectedListing.foodName}</h3>
            <p className="text-muted-foreground">{selectedListing.quantity}</p>
            <p className="text-sm text-muted-foreground mt-2">{selectedListing.address}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiverTracking;
