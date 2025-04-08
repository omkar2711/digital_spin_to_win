import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Confetti from './Confetti';

interface WinningModalProps {
  prize: string;
  isOpen: boolean;
  onClose: () => void;
}

const WinningModal: React.FC<WinningModalProps> = ({ prize, isOpen, onClose }) => {
  const { userData } = useUser();
  const isBetterLuck = prize.includes("Better Luck Next Time");
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const checkPhoneNumberExists = async (phone: string) => {
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbyL13UjS0-kxIkoRAVq7tdeQHaf1lqQtdWa-alrbduwdo5s99GznTkdcgexeeg42uUpEA/exec?phone=${phone}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Phone check response:', data);
      return data.exists;
    } catch (error) {
      console.error('Error checking phone number:', error);
      throw error;
    }
  };

  const submitToGoogleForm = async (prize: string) => {
    try {
      console.log('Attempting to submit form with prize:', prize);
      console.log('User data:', userData);
      
      setError(null);
      setSubmissionStatus('idle');

      // Validate phone number exists
      if (!userData?.phone) {
        setError("Phone number is required");
        toast.error("Phone number is required", {
          duration: 5000,
          className: "text-lg font-medium px-4 py-3"
        });
        console.error('Missing phone number, cannot submit form');
        return;
      }

      // Skip form submission for "Better Luck Next Time" results
      if (prize.includes("Better Luck Next Time")) {
        console.log('Skipping form submission for "Better Luck Next Time" result');
        setSubmissionStatus('success');
        return;
      }
      
      const formId = '1FAIpQLSc0E_Z_2n5xMD7KO0Oim-20UjHZ4hLXRZzvyMXzfzzwMYR2aQ';
      console.log('Preparing form submission with ID:', formId);
      
      // Create a hidden iframe for form submission
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Create a hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
      form.target = 'hidden_iframe';
      
      // Add the data fields
      const nameField = document.createElement('input');
      nameField.type = 'hidden';
      nameField.name = 'entry.1909378626';
      nameField.value = userData?.name || '';
      form.appendChild(nameField);
      
      const phoneField = document.createElement('input');
      phoneField.type = 'hidden';
      phoneField.name = 'entry.850620478';
      phoneField.value = userData.phone;
      form.appendChild(phoneField);
      
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'entry.308547054';
      emailField.value = userData?.email || '';
      form.appendChild(emailField);
      
      const prizeField = document.createElement('input');
      prizeField.type = 'hidden';
      prizeField.name = 'entry.1057627581';
      prizeField.value = prize || '';
      form.appendChild(prizeField);
      
      console.log('Form data prepared for submission:', {
        name: userData?.name || '',
        phone: userData.phone,
        email: userData?.email || '',
        prize: prize || ''
      });
      
      // Add form to body and submit
      document.body.appendChild(form);
      form.submit();
      console.log('Form submitted');
      
      // Remove form and iframe from DOM after submission
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        console.log('Form and iframe removed from DOM');
      }, 2000);
      
      setSubmissionStatus('success');
      setError(null);
      toast.success("Your prize has been successfully registered!", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
      console.log('Form submission completed successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
      setError('Error submitting form. Please try again.');
      toast.error("Error submitting form. Please try again.", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
    }
  };
  
  useEffect(() => {
    // Only submit once when the modal is first opened
    if (isOpen && !isBetterLuck && userData?.phone) {
      console.log('WinningModal opened with prize:', prize);
      
      // Use a flag in session storage to prevent duplicate submissions
      const sessionKey = `submitted_${userData.phone}_${prize}`;
      if (!sessionStorage.getItem(sessionKey)) {
        console.log('First-time submission, proceeding...');
        submitToGoogleForm(prize);
        sessionStorage.setItem(sessionKey, 'true');
      } else {
        console.log('Already submitted this combination, skipping duplicate submission');
      }
    }
  }, [isOpen]);
  
  // Play sound effect on mount
  useEffect(() => {
    // In a real implementation, we would play a sound here
    console.log("Playing winning sound effect");
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {!isBetterLuck && <Confetti />}
      
      <Card className={`w-full max-w-md border-2 ${isBetterLuck ? 'border-red-400' : 'border-[#E23744]'} shadow-lg animate-bounce-in bg-black text-white`}>
        <CardHeader className={`text-center ${isBetterLuck ? 'bg-red-500' : 'bg-[#E23744]'} text-white`}>
          <CardTitle className="text-2xl font-bold">
            {isBetterLuck ? 'Almost there!' : 'Congratulations!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2 text-center">
          {error && (
            <div className="mb-4 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            {isBetterLuck ? (
              <div className="text-6xl mb-4">😢</div>
            ) : (
              <div className="text-6xl mb-4">🎉</div>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-white">
            {userData?.name ? `${userData.name}, ` : ''}
            {isBetterLuck ? "Better luck next time!" : "You've won:"}
          </h3>
          
          <p className={`text-xl font-bold mb-4 ${isBetterLuck ? 'text-red-500' : 'text-[#E23744]'}`}>
            {prize}
          </p>
          
          {!isBetterLuck && (
            <div className="text-sm text-gray-400 mt-2">
              <p>Please reach-out to the upGrad POC or visit your nearest upGrad store to claim the reward!</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center space-x-2 pt-2 pb-6">
          {/* <Button 
            variant="outline"
            onClick={onClose}
            className="border-[#E23744] text-[#E23744] hover:bg-[#E23744] hover:text-white"
          >
            Spin Again
          </Button> */}
          
            <Button 
              onClick={() => window.location.href = 'https://www.upgrad.com/offline-centres/'} 
              className="bg-[#E23744] hover:bg-[#E23744]/90"
            >
              Explore upGrad
            </Button>
          
        </CardFooter>
      </Card>
    </div>
  );
};

export default WinningModal;
