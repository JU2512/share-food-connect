import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ReceiverOTP: React.FC = () => {
  const { setCurrentScreen, receiverProfile } = useApp();
  const { toast } = useToast();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP verification
    toast({
      title: "Phone Verified!",
      description: "Your phone number has been verified successfully",
    });
    
    setCurrentScreen('receiver-application');
  };

  const handleResend = () => {
    toast({
      title: "OTP Resent",
      description: `A new OTP has been sent to ${receiverProfile?.phone || 'your phone'}`,
    });
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('receiver-register')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </motion.header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <Shield className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Phone</h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold text-foreground">{receiverProfile?.phone || '+91 98765 43210'}</span>
            </p>
          </div>

          {/* OTP Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl shadow-card p-6 space-y-6"
          >
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-border rounded-xl bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              ))}
            </div>

            <Button type="submit" size="lg" className="w-full">
              Verify & Continue
            </Button>
          </motion.form>

          {/* Resend Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6 text-muted-foreground"
          >
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiverOTP;
