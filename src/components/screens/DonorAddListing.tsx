import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Camera, Clock, MapPin, Phone, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const DonorAddListing: React.FC = () => {
  const { setCurrentScreen, addDonation } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    scheduledTime: '',
    contactPhone: '',
    address: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.foodName || !formData.quantity || !formData.scheduledTime || !formData.contactPhone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newDonation = {
      id: Date.now().toString(),
      donorId: 'current-donor',
      ...formData,
      photo: photoPreview || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      latitude: 12.9716 + (Math.random() - 0.5) * 0.1, // Random location near Bangalore
      longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
      createdAt: new Date().toISOString(),
      status: 'available' as const,
    };

    addDonation(newDonation);
    
    toast({
      title: "Donation Posted!",
      description: "Your food donation is now visible to receivers",
    });
    
    setCurrentScreen('donor-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
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
            onClick={() => setCurrentScreen('donor-dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Add Donation</h1>
            <p className="text-sm text-muted-foreground">Share your food with others</p>
          </div>
        </div>
      </motion.header>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="p-4 space-y-6"
      >
        {/* Photo Upload */}
        <div className="space-y-2">
          <Label>Food Photo</Label>
          <motion.label
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="block w-full aspect-video bg-card rounded-2xl border-2 border-dashed border-border hover:border-primary cursor-pointer overflow-hidden transition-colors"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="w-10 h-10 mb-2" />
                <p className="font-medium">Tap to add photo</p>
                <p className="text-sm">Show what you're donating</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </motion.label>
        </div>

        {/* Food Name */}
        <div className="space-y-2">
          <Label htmlFor="foodName">
            <span className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Food Item Name
            </span>
          </Label>
          <Input
            id="foodName"
            placeholder="e.g., Fresh vegetables, Cooked rice"
            value={formData.foodName}
            onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            placeholder="e.g., 10 kg, 50 servings"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Scheduled Time */}
        <div className="space-y-2">
          <Label htmlFor="scheduledTime">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Available Until
            </span>
          </Label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label htmlFor="contactPhone">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Number
            </span>
          </Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            className="h-12"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Pickup Address
            </span>
          </Label>
          <Textarea
            id="address"
            placeholder="Full address for pickup"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Button type="submit" size="xl" className="w-full">
            Post Donation
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default DonorAddListing;
