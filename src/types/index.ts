export type UserType = 'donor' | 'receiver' | null;

export type ReceiverType = 'ngo' | 'orphanage' | 'shelter';

export interface DonationListing {
  id: string;
  donorId: string;
  foodName: string;
  quantity: string;
  photo: string;
  scheduledTime: string;
  contactPhone: string;
  address: string;
  createdAt: string;
  status: 'available' | 'accepted' | 'completed';
  acceptedBy?: string;
}

export interface ReceiverProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: ReceiverType;
  registeredName: string;
  registeredAddress: string;
  estimatedBeneficiaries: number;
  websiteOrIgLink?: string;
  documents: ReceiverDocuments;
  location?: {
    lat: number;
    lng: number;
  };
  verified: boolean;
}

export interface ReceiverDocuments {
  registrationCertificate?: string;
  panCard?: string;
  form12a?: string;
  certificate80G?: string;
  auditedFinancialReport?: string;
  financialStatement?: string;
  localGovtRegistration?: string;
}

export interface DonorProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export type AppScreen = 
  | 'intro'
  | 'user-selection'
  | 'donor-dashboard'
  | 'donor-add-listing'
  | 'receiver-register'
  | 'receiver-otp'
  | 'receiver-application'
  | 'receiver-dashboard'
  | 'receiver-listing-detail'
  | 'receiver-tracking'
  | 'admin-panel';
