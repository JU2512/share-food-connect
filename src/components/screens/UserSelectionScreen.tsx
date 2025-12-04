import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { HandHeart, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserSelectionScreen: React.FC = () => {
  const { setUserType, setCurrentScreen } = useApp();

  const handleDonorSelect = () => {
    setUserType('donor');
    setCurrentScreen('donor-dashboard');
  };

  const handleReceiverSelect = () => {
    setUserType('receiver');
    setCurrentScreen('receiver-register');
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('intro')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Who are you?</h1>
          <p className="text-muted-foreground">Select your role to continue</p>
        </motion.div>

        <div className="w-full max-w-md space-y-4">
          {/* Donor Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleDonorSelect}
              className="w-full bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-left border-2 border-transparent hover:border-secondary group"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center shadow-orange-glow group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">I'm a Donor</h2>
                  <p className="text-muted-foreground text-sm">
                    Share your surplus food with those in need
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-warm-orange-light text-secondary font-medium">
                  Restaurant
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-warm-orange-light text-secondary font-medium">
                  Household
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-warm-orange-light text-secondary font-medium">
                  Caterer
                </span>
              </div>
            </button>
          </motion.div>

          {/* Receiver Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={handleReceiverSelect}
              className="w-full bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-left border-2 border-transparent hover:border-primary group"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <HandHeart className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">I'm a Receiver</h2>
                  <p className="text-muted-foreground text-sm">
                    Receive food donations for your organization
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-forest-light text-primary font-medium">
                  NGO
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-forest-light text-primary font-medium">
                  Orphanage
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-forest-light text-primary font-medium">
                  Shelter
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionScreen;
