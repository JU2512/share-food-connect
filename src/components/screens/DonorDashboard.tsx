import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Plus, Clock, MapPin, ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DonorDashboard: React.FC = () => {
  const { donations, setCurrentScreen, setUserType } = useApp();

  const donorDonations = donations.filter((d) => d.status !== 'completed');

  return (
    <div className="min-h-screen bg-background">
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
              <h1 className="text-xl font-bold text-foreground">My Donations</h1>
              <p className="text-sm text-muted-foreground">Share food with those in need</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-muted-foreground text-sm">Active Listings</p>
            <p className="text-2xl font-bold text-foreground">{donorDonations.filter((d) => d.status === 'available').length}</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-muted-foreground text-sm">Accepted</p>
            <p className="text-2xl font-bold text-secondary">{donorDonations.filter((d) => d.status === 'accepted').length}</p>
          </div>
        </motion.div>

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Your Listings</h2>
          <span className="text-sm text-muted-foreground">{donorDonations.length} items</span>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="overflow-x-auto pb-4 -mx-4 px-4"
        >
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {/* Add New Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen('donor-add-listing')}
              className="w-64 h-72 bg-card rounded-2xl shadow-card border-2 border-dashed border-border hover:border-secondary flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors mb-4">
                <Plus className="w-7 h-7 text-secondary" />
              </div>
              <p className="font-semibold text-foreground">Add New Listing</p>
              <p className="text-sm text-muted-foreground">Share your food</p>
            </motion.div>

            {/* Existing Listings */}
            {donorDonations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`w-64 bg-card rounded-2xl shadow-card overflow-hidden ${
                  donation.status === 'accepted' ? 'ring-2 ring-secondary' : ''
                }`}
              >
                <div className="relative h-36">
                  <img
                    src={donation.photo}
                    alt={donation.foodName}
                    className="w-full h-full object-cover"
                  />
                  {donation.status === 'accepted' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                      Accepted
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-foreground truncate">{donation.foodName}</h3>
                  <p className="text-sm text-muted-foreground">{donation.quantity}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{donation.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{donation.address}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {donorDonations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No donations yet. Start sharing!</p>
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          onClick={() => setCurrentScreen('donor-add-listing')}
          size="xl"
          variant="secondary"
          className="rounded-full shadow-lg shadow-orange-glow"
        >
          <Plus className="w-6 h-6" />
          Add Donation
        </Button>
      </motion.div>
    </div>
  );
};

export default DonorDashboard;
