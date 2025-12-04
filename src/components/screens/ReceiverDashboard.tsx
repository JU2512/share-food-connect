import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, MapPin, Clock, Phone, Check, X, Navigation, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ReceiverDashboard: React.FC = () => {
  const { donations, setCurrentScreen, setUserType, setSelectedListing, updateDonationStatus } = useApp();
  const { toast } = useToast();
  
  const [showLocationDialog, setShowLocationDialog] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [declinedIds, setDeclinedIds] = useState<Set<string>>(new Set());

  const availableDonations = donations.filter(
    (d) => d.status === 'available' && !declinedIds.has(d.id)
  );

  const handleEnableLocation = () => {
    // Simulate location permission
    setLocationEnabled(true);
    setShowLocationDialog(false);
    toast({
      title: "Location Enabled",
      description: "You'll now see donations near you",
    });
  };

  const handleDecline = (id: string) => {
    setDeclinedIds((prev) => new Set(prev).add(id));
    toast({
      title: "Listing Declined",
      description: "This listing has been removed from your view",
    });
  };

  const handleAccept = (donation: typeof donations[0]) => {
    setSelectedListing(donation);
    setCurrentScreen('receiver-listing-detail');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Location Permission Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Navigation className="w-8 h-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-xl">Enable Location</DialogTitle>
            <DialogDescription className="text-center">
              We need your location to show donations available near you. This helps connect you with nearby food donors.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleEnableLocation} size="lg">
              Enable Location
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowLocationDialog(false);
                toast({
                  title: "Location Required",
                  description: "Location access is mandatory to browse donations",
                  variant: "destructive",
                });
              }}
            >
              Not Now
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
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setUserType(null);
                setCurrentScreen('user-selection');
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Available Donations</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Near your location
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </div>
      </motion.header>

      {/* Listings */}
      <main className="p-4 space-y-4 pb-8">
        <AnimatePresence>
          {availableDonations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={donation.photo}
                  alt={donation.foodName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {donation.scheduledTime}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{donation.foodName}</h3>
                  <p className="text-muted-foreground">{donation.quantity}</p>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{donation.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{donation.contactPhone}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="decline"
                    className="flex-1"
                    onClick={() => handleDecline(donation.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                  <Button
                    variant="accept"
                    className="flex-1"
                    onClick={() => handleAccept(donation)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {availableDonations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">No donations available right now</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new listings</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ReceiverDashboard;
