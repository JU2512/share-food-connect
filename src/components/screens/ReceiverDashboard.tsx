import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, MapPin, Clock, Phone, Check, X, Navigation, Bell, Map, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation, calculateDistance } from '@/hooks/useGeolocation';
import DonationMap from '@/components/DonationMap';
import { DonationListing } from '@/types';

const DISTANCE_OPTIONS = [
  { value: '5', label: 'Within 5 km' },
  { value: '10', label: 'Within 10 km' },
  { value: '25', label: 'Within 25 km' },
  { value: '50', label: 'Within 50 km' },
  { value: 'all', label: 'All distances' },
];

const ReceiverDashboard: React.FC = () => {
  const { donations, setCurrentScreen, setUserType, setSelectedListing } = useApp();
  const { toast } = useToast();
  const { latitude, longitude, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  
  const [showLocationDialog, setShowLocationDialog] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [declinedIds, setDeclinedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [maxDistance, setMaxDistance] = useState<string>('all');
  const [mapboxToken, setMapboxToken] = useState<string>('');

  // Request location when dialog is confirmed
  const handleEnableLocation = () => {
    requestLocation();
    setLocationEnabled(true);
    setShowLocationDialog(false);
  };

  // Update location state when geolocation succeeds/fails
  useEffect(() => {
    if (latitude && longitude) {
      toast({
        title: "Location Enabled",
        description: "Showing donations near you",
      });
    } else if (geoError && locationEnabled) {
      toast({
        title: "Location Error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [latitude, longitude, geoError, locationEnabled]);

  // Calculate distances and filter donations
  const donationsWithDistance = useMemo(() => {
    const available = donations.filter(
      (d) => d.status === 'available' && !declinedIds.has(d.id)
    );

    if (!latitude || !longitude) {
      return available.map(d => ({ ...d, distance: undefined }));
    }

    return available.map(d => ({
      ...d,
      distance: calculateDistance(latitude, longitude, d.latitude, d.longitude),
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [donations, declinedIds, latitude, longitude]);

  // Filter by max distance
  const filteredDonations = useMemo(() => {
    if (maxDistance === 'all') return donationsWithDistance;
    const maxDist = parseFloat(maxDistance);
    return donationsWithDistance.filter(d => !d.distance || d.distance <= maxDist);
  }, [donationsWithDistance, maxDistance]);

  const handleDecline = (id: string) => {
    setDeclinedIds((prev) => new Set(prev).add(id));
    toast({
      title: "Listing Declined",
      description: "This listing has been removed from your view",
    });
  };

  const handleAccept = (donation: DonationListing) => {
    setSelectedListing(donation);
    setCurrentScreen('receiver-listing-detail');
  };

  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

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
            <Button onClick={handleEnableLocation} size="lg" disabled={geoLoading}>
              {geoLoading ? 'Getting Location...' : 'Enable Location'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowLocationDialog(false);
                setLocationEnabled(true);
                toast({
                  title: "Location Skipped",
                  description: "You can still browse all donations",
                });
              }}
            >
              Skip for now
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
                {userLocation ? 'Near your location' : 'All locations'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </div>

        {/* View Toggle & Filter */}
        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4 mr-1" />
              Map
            </Button>
          </div>

          {userLocation && (
            <Select value={maxDistance} onValueChange={setMaxDistance}>
              <SelectTrigger className="w-[140px] h-8">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISTANCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </motion.header>

      {/* Content */}
      <main className="p-4 pb-8">
        {viewMode === 'map' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[calc(100vh-200px)] min-h-[400px]"
          >
            <DonationMap
              donations={filteredDonations}
              userLocation={userLocation}
              onSelectDonation={handleAccept}
              mapboxToken={mapboxToken}
              onTokenChange={setMapboxToken}
            />
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredDonations.map((donation, index) => (
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className="px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {donation.scheduledTime}
                      </div>
                    </div>
                    {donation.distance !== undefined && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {donation.distance.toFixed(1)} km
                      </div>
                    )}
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

            {filteredDonations.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">No donations available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {maxDistance !== 'all' 
                    ? 'Try increasing your distance filter'
                    : 'Check back later for new listings'}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReceiverDashboard;
