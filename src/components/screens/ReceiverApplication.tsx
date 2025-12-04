import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Building2, FileText, Upload, Check, Globe, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ReceiverType } from '@/types';

const ReceiverApplication: React.FC = () => {
  const { setCurrentScreen, setReceiverProfile, receiverProfile } = useApp();
  const { toast } = useToast();
  
  const [currentTab, setCurrentTab] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    type: '' as ReceiverType | '',
    registeredName: '',
    registeredAddress: '',
    estimatedBeneficiaries: '',
    websiteOrIgLink: '',
  });
  const [documents, setDocuments] = useState<Record<string, string>>({});

  const getRequiredDocuments = () => {
    switch (formData.type) {
      case 'ngo':
        return [
          { key: 'registrationCertificate', label: 'Registration Certificate' },
          { key: 'panCard', label: 'PAN Card' },
          { key: 'form12a', label: 'Form 12A' },
          { key: 'certificate80G', label: '80G Certificate' },
          { key: 'auditedFinancialReport', label: 'Audited Financial Report' },
        ];
      case 'orphanage':
        return [
          { key: 'registrationCertificate', label: 'Registration Certificate (Child Welfare Dept)' },
          { key: 'panCard', label: 'PAN Card' },
          { key: 'auditedFinancialReport', label: 'Audited Financial Report' },
        ];
      case 'shelter':
        return [
          { key: 'localGovtRegistration', label: 'Local Govt Registration / NGO Affiliation Letter' },
          { key: 'panCard', label: 'PAN Card' },
          { key: 'financialStatement', label: 'Financial Statement' },
        ];
      default:
        return [];
    }
  };

  const handleFileUpload = (key: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    setDocuments({ ...documents, [key]: file.name });
    toast({
      title: "Document Uploaded",
      description: `${file.name} uploaded successfully`,
    });
  };

  const handleNext = () => {
    if (!formData.type || !formData.registeredName || !formData.registeredAddress || !formData.estimatedBeneficiaries) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setCurrentTab(2);
  };

  const handleSubmit = () => {
    const requiredDocs = getRequiredDocuments();
    const missingDocs = requiredDocs.filter((doc) => !documents[doc.key]);
    
    if (missingDocs.length > 0) {
      toast({
        title: "Missing Documents",
        description: `Please upload: ${missingDocs.map((d) => d.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setReceiverProfile({
      ...receiverProfile,
      type: formData.type as ReceiverType,
      registeredName: formData.registeredName,
      registeredAddress: formData.registeredAddress,
      estimatedBeneficiaries: parseInt(formData.estimatedBeneficiaries),
      websiteOrIgLink: formData.websiteOrIgLink,
      documents: documents as any,
      verified: false,
    });

    toast({
      title: "Application Submitted!",
      description: "Your application is under review. You can now browse available donations.",
    });

    setCurrentScreen('receiver-dashboard');
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
            onClick={() => currentTab === 1 ? setCurrentScreen('receiver-otp') : setCurrentTab(1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="text-sm text-muted-foreground">Step {currentTab} of 2</p>
          </div>
        </div>
        
        {/* Progress Tabs */}
        <div className="flex px-4 pb-4 gap-2">
          <button
            onClick={() => setCurrentTab(1)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium transition-all ${
              currentTab === 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
              currentTab === 1 ? 'bg-primary-foreground/20' : 'bg-background'
            }`}>
              {currentTab > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            Basic Details
          </button>
          <button
            onClick={() => formData.type && setCurrentTab(2)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium transition-all ${
              currentTab === 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
              currentTab === 2 ? 'bg-primary-foreground/20' : 'bg-background'
            }`}>
              2
            </div>
            Documents
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <AnimatePresence mode="wait">
        {currentTab === 1 ? (
          <motion.div
            key="tab1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4 space-y-6"
          >
            {/* Basic Details Section */}
            <div className="bg-card rounded-2xl shadow-card p-5 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Organization Details</h2>
              </div>

              <div className="space-y-2">
                <Label>Type of Receiver</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ReceiverType })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="orphanage">Orphanage</SelectItem>
                    <SelectItem value="shelter">Shelter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredName">Registered Name</Label>
                <Input
                  id="registeredName"
                  placeholder="Official registered name"
                  value={formData.registeredName}
                  onChange={(e) => setFormData({ ...formData, registeredName: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredAddress">Registered Address</Label>
                <Textarea
                  id="registeredAddress"
                  placeholder="Full registered address"
                  value={formData.registeredAddress}
                  onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaries">Estimated No. of Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.estimatedBeneficiaries}
                  onChange={(e) => setFormData({ ...formData, estimatedBeneficiaries: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            {/* Other Details Section */}
            <div className="bg-card rounded-2xl shadow-card p-5 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Other Details</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website Link</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.org"
                  value={formData.websiteOrIgLink}
                  onChange={(e) => setFormData({ ...formData, websiteOrIgLink: e.target.value })}
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Instagram className="w-4 h-4" />
                  No website? Add your Instagram link instead
                </p>
              </div>
            </div>

            <Button onClick={handleNext} size="lg" className="w-full">
              Next: Upload Documents
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="tab2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 space-y-4"
          >
            <div className="bg-card rounded-2xl shadow-card p-5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Required Documents</h2>
                  <p className="text-sm text-muted-foreground">Max 10MB per file</p>
                </div>
              </div>

              {getRequiredDocuments().map((doc) => (
                <div key={doc.key} className="space-y-2">
                  <Label>{doc.label}</Label>
                  <label className="flex items-center justify-between p-4 border-2 border-dashed border-border rounded-xl hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className={documents[doc.key] ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        {documents[doc.key] || 'Upload file'}
                      </span>
                    </div>
                    {documents[doc.key] && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.key, file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              ))}
            </div>

            <Button onClick={handleSubmit} size="lg" className="w-full">
              Submit Application
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceiverApplication;
