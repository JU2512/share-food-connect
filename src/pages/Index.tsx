import React from 'react';
import { useApp, AppProvider } from '@/context/AppContext';
import IntroScreen from '@/components/screens/IntroScreen';
import UserSelectionScreen from '@/components/screens/UserSelectionScreen';
import DonorDashboard from '@/components/screens/DonorDashboard';
import DonorAddListing from '@/components/screens/DonorAddListing';
import ReceiverRegister from '@/components/screens/ReceiverRegister';
import ReceiverOTP from '@/components/screens/ReceiverOTP';
import ReceiverApplication from '@/components/screens/ReceiverApplication';
import ReceiverDashboard from '@/components/screens/ReceiverDashboard';
import ReceiverListingDetail from '@/components/screens/ReceiverListingDetail';
import ReceiverTracking from '@/components/screens/ReceiverTracking';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'intro':
        return <IntroScreen />;
      case 'user-selection':
        return <UserSelectionScreen />;
      case 'donor-dashboard':
        return <DonorDashboard />;
      case 'donor-add-listing':
        return <DonorAddListing />;
      case 'receiver-register':
        return <ReceiverRegister />;
      case 'receiver-otp':
        return <ReceiverOTP />;
      case 'receiver-application':
        return <ReceiverApplication />;
      case 'receiver-dashboard':
        return <ReceiverDashboard />;
      case 'receiver-listing-detail':
        return <ReceiverListingDetail />;
      case 'receiver-tracking':
        return <ReceiverTracking />;
      default:
        return <IntroScreen />;
    }
  };

  return <>{renderScreen()}</>;
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <AppContent />
      </div>
    </AppProvider>
  );
};

export default Index;
