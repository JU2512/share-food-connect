import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserType, AppScreen, DonationListing, ReceiverProfile } from '@/types';

interface AppContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  donations: DonationListing[];
  addDonation: (donation: DonationListing) => void;
  updateDonationStatus: (id: string, status: DonationListing['status'], acceptedBy?: string) => void;
  receiverProfile: Partial<ReceiverProfile> | null;
  setReceiverProfile: (profile: Partial<ReceiverProfile> | null) => void;
  selectedListing: DonationListing | null;
  setSelectedListing: (listing: DonationListing | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample donation data with coordinates (Bangalore area)
const sampleDonations: DonationListing[] = [
  {
    id: '1',
    donorId: 'donor1',
    foodName: 'Fresh Vegetables',
    quantity: '10 kg',
    photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    scheduledTime: 'Today, 6:00 PM',
    contactPhone: '+91 98765 43210',
    address: '123 Green Street, Koramangala, Bangalore',
    latitude: 12.9352,
    longitude: 77.6245,
    createdAt: new Date().toISOString(),
    status: 'available',
  },
  {
    id: '2',
    donorId: 'donor2',
    foodName: 'Cooked Rice & Dal',
    quantity: '50 servings',
    photo: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    scheduledTime: 'Today, 8:00 PM',
    contactPhone: '+91 98765 43211',
    address: '456 Main Road, Indiranagar, Bangalore',
    latitude: 12.9784,
    longitude: 77.6408,
    createdAt: new Date().toISOString(),
    status: 'available',
  },
  {
    id: '3',
    donorId: 'donor3',
    foodName: 'Fresh Bread & Pastries',
    quantity: '30 pieces',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    scheduledTime: 'Tomorrow, 10:00 AM',
    contactPhone: '+91 98765 43212',
    address: '789 Baker Lane, Whitefield, Bangalore',
    latitude: 12.9698,
    longitude: 77.7500,
    createdAt: new Date().toISOString(),
    status: 'available',
  },
  {
    id: '4',
    donorId: 'donor4',
    foodName: 'Fruit Basket',
    quantity: '20 kg',
    photo: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
    scheduledTime: 'Today, 5:00 PM',
    contactPhone: '+91 98765 43213',
    address: '22 MG Road, Bangalore',
    latitude: 12.9757,
    longitude: 77.6069,
    createdAt: new Date().toISOString(),
    status: 'available',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('intro');
  const [donations, setDonations] = useState<DonationListing[]>(sampleDonations);
  const [receiverProfile, setReceiverProfile] = useState<Partial<ReceiverProfile> | null>(null);
  const [selectedListing, setSelectedListing] = useState<DonationListing | null>(null);

  const addDonation = (donation: DonationListing) => {
    setDonations((prev) => [donation, ...prev]);
  };

  const updateDonationStatus = (id: string, status: DonationListing['status'], acceptedBy?: string) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, acceptedBy } : d))
    );
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        currentScreen,
        setCurrentScreen,
        donations,
        addDonation,
        updateDonationStatus,
        receiverProfile,
        setReceiverProfile,
        selectedListing,
        setSelectedListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
