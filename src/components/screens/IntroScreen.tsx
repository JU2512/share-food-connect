import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Heart, Users, Utensils, ArrowRight } from 'lucide-react';

const IntroScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Utensils className="w-10 h-10 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">FoodShare</h1>
            <p className="text-muted-foreground text-lg">Connecting hearts through food</p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 p-3 rounded-xl bg-accent/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Reduce Food Waste</p>
                <p className="text-sm text-muted-foreground">Share surplus food with those in need</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-warm-orange-light">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Build Community</p>
                <p className="text-sm text-muted-foreground">Connect with NGOs, shelters & orphanages</p>
              </div>
            </div>
          </motion.div>

          {/* Mission Statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-muted-foreground text-sm leading-relaxed"
          >
            Our mission is to bridge the gap between food donors and receivers, 
            ensuring no meal goes to waste while feeding those who need it most.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 pt-2"
          >
            <Button
              onClick={() => setCurrentScreen('user-selection')}
              className="w-full"
              size="lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setCurrentScreen('user-selection')}
              variant="skip"
              className="w-full"
              size="default"
            >
              Skip Intro
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-muted-foreground text-xs mt-6"
        >
          Together, we can make a difference
        </motion.p>
      </motion.div>
    </div>
  );
};

export default IntroScreen;
