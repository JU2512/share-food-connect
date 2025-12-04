import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, MapPin, Clock, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ReceiverListingDetail: React.FC = () => {
  const { selectedListing, setCurrentScreen, updateDonationStatus } = useApp();
  const { toast } = useToast();

  if (!selectedListing) {
    setCurrentScreen('receiver-dashboard');
    return null;
  }

  const handleConfirmPickup = () => {
    updateDonationStatus(selectedListing.id, 'accepted', 'current-receiver');
    
    toast({
      title: "Pickup Confirmed!",
      description: "The donor has been notified. Track your pickup status.",
    });
    
    setCurrentScreen('receiver-tracking');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-64"
      >
        <img
          src={selectedListing.photo}
          alt={selectedListing.foodName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentScreen('receiver-dashboard')}
          className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm hover:bg-card"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 -mt-8 relative z-10 pb-8"
      >
        <div className="bg-card rounded-2xl shadow-card p-5 space-y-5">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedListing.foodName}</h1>
            <p className="text-lg text-muted-foreground">{selectedListing.quantity}</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-xl">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Available Until</p>
                <p className="text-sm text-muted-foreground">{selectedListing.scheduledTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-xl">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Pickup Location</p>
                <p className="text-sm text-muted-foreground">{selectedListing.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-xl">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Contact Number</p>
                <p className="text-sm text-muted-foreground">{selectedListing.contactPhone}</p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-warm-orange-light rounded-xl border border-secondary/20">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Important:</span> Please arrive on time for pickup. 
              The donor will be notified once you confirm.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleConfirmPickup}
            size="xl"
            className="w-full"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm Pickup
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceiverListingDetail;
