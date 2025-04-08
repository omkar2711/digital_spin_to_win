import React, { useState, useEffect, useRef } from 'react';
import wheelImage from '../assets/wheel-image.png';
import backgroundImage from '../assets/background-image.png';
import { toast } from "sonner";
import WinningModal from './WinningModal';

interface SpinWheelProps {
  onPrizeWon: (prize: string) => void;
  userData: {
    name: string;
    email: string;
    phone: string;
  };
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onPrizeWon, userData }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [randomDegree, setRandomDegree] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const wheelRef = useRef<HTMLImageElement>(null);

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      const wheelImg = new Image();
      wheelImg.src = wheelImage;
      
      const bgImg = new Image();
      bgImg.src = backgroundImage;
    };
    
    preloadImages();
  }, []);

  // Prize mapping based on degree ranges (45 degree segments)
  const PRIZE_SEGMENTS = [
    { minDegree: 90, maxDegree: 135, prize: 'Free Tablet on programs over 1,00,000 Rs for working professionals' },
    { minDegree: 45, maxDegree: 90, prize: 'Free Onspot* offer to your dream university' },
    { minDegree: 0, maxDegree: 45, prize: 'Better Luck Next Time' },
    { minDegree: 315, maxDegree: 360, prize: 'Exclusive Upgrad Merchandise' },
    { minDegree: 270, maxDegree: 315, prize: 'Free Certification course in Data Science' },
    { minDegree: 135, maxDegree: 180, prize: 'Free certification course in digital marketing' },
    { minDegree: 225, maxDegree: 270, prize: 'Free laptops on all accelerated pathway program' },
    { minDegree: 180, maxDegree: 225, prize: 'Better Luck Next Time' }
  ];

  const calculatePrize = (degree: number) => {
    try {
      // Normalize the degree to 0-360
      let normalizedDegree = (270 - degree);
      if (normalizedDegree < 0) {
        normalizedDegree += 360;
      }
      
      // Find the segment where the normalized degree falls
      const segment = PRIZE_SEGMENTS.find(
        seg => {
          if (seg.minDegree < seg.maxDegree) {
            return normalizedDegree >= seg.minDegree && normalizedDegree < seg.maxDegree;
          } else {
            // Handle the case where the segment crosses 0 degrees
            return normalizedDegree >= seg.minDegree || normalizedDegree < seg.maxDegree;
          }
        }
      );
      
      return segment ? segment.prize : PRIZE_SEGMENTS[0].prize;
    } catch (error) {
      console.error('Error calculating prize:', error);
      return PRIZE_SEGMENTS[0].prize;
    }
  };

  const submitToGoogleForm = async (prize: string) => {
    try {
      // Check if we should skip form submission
      if (!userData || !userData.phone) {
        console.log('Skipping form submission - missing user data');
        return;
      }
      
      console.log('SpinWheel submitting form with phone:', userData.phone);
      
      const formId = '1FAIpQLSc0E_Z_2n5xMD7KO0Oim-20UjHZ4hLXRZzvyMXzfzzwMYR2aQ';
      
      // Create a hidden iframe for form submission
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Create a hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
      form.target = 'hidden_iframe'; // Submit to the iframe
      
      // Add the data fields
      const nameField = document.createElement('input');
      nameField.type = 'hidden';
      nameField.name = 'entry.1909378626';
      nameField.value = userData.name || '';
      form.appendChild(nameField);
      
      const phoneField = document.createElement('input');
      phoneField.type = 'hidden';
      phoneField.name = 'entry.850620478';
      phoneField.value = userData.phone || '';
      form.appendChild(phoneField);
      
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'entry.308547054';
      emailField.value = userData.email || '';
      form.appendChild(emailField);
      
      const prizeField = document.createElement('input');
      prizeField.type = 'hidden';
      prizeField.name = 'entry.1057627581';
      prizeField.value = prize || '';
      form.appendChild(prizeField);
      
      // Add form to body and submit
      document.body.appendChild(form);
      form.submit();
      
      // Remove form and iframe from DOM after submission
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
      
      setSubmissionStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
      setErrorMsg('Form submission failed. Please try again.');
    }
  };

  const handleSpinClick = () => {
    if (isSpinning) return;
    
    try {
      console.log('Starting wheel spin with user data:', userData);
      setErrorMsg(null);
      const newRandomDegree = Math.floor(Math.random() * 360);
      console.log('Generated random degree:', newRandomDegree);
      setRandomDegree(newRandomDegree);
      
      // For iOS compatibility, use simpler rotation
      const totalRotation = -(1800 + newRandomDegree);
      console.log('Setting total rotation:', totalRotation);
      setIsSpinning(true);
      setFinalRotation(totalRotation);
      setSubmissionStatus('idle');
      
      // Force reflow to ensure animation starts correctly on iOS
      if (wheelRef.current) {
        wheelRef.current.offsetHeight;
      }
      
      setTimeout(() => {
        try {
          setIsSpinning(false);
          const prize = calculatePrize(newRandomDegree);
          console.log('Spin complete! Prize determined:', prize);
          onPrizeWon(prize);
          // Form submission is now handled exclusively by WinningModal
        } catch (error) {
          console.error('Error in spin completion:', error);
          setSubmissionStatus('error');
          toast.error("Error determining prize. Please try again.", {
            duration: 5000,
            className: "text-lg font-medium px-4 py-3"
          });
        }
      }, 3100);
    } catch (error) {
      console.error('Error initiating spin:', error);
      setIsSpinning(false);
      setSubmissionStatus('error');
      toast.error("Failed to spin the wheel. Please try again.", {
        duration: 5000,
        className: "text-lg font-medium px-4 py-3"
      });
    }
  };

  useEffect(() => {
    setRotation(finalRotation);
  }, [finalRotation]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Changed to 'auto' for iOS compatibility
    });
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 md:px-8" style={{ backgroundColor: '#000' }}>
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Background UI */}
        <img 
          src={backgroundImage}
          alt="Spin Wheel Background"
          className="w-full object-contain"
          style={{ 
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
            pointerEvents: 'none'
          }}
        />
        
        {/* Spinning Wheel */}
        <div className="absolute top-[15%] sm:top-[18%] md:top-[22%] left-1/2 transform -translate-x-1/2 w-[52%] sm:w-[60%] md:w-[52%] aspect-square -mt-4 sm:-mt-16 md:-mt-32">
          <img 
            ref={wheelRef}
            src={wheelImage}
            alt="Spin Wheel"
            className={`w-full h-full ${isSpinning ? 'animate-spin' : ''}`}
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
              WebkitTransform: `rotate(${rotation}deg)`,
              WebkitTransformOrigin: 'center',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitTouchCallout: 'none',
              willChange: 'transform',
              transition: isSpinning ? 'none' : 'transform 3000ms cubic-bezier(0.2, 0.8, 0.3, 1)'
            }}
          />
          
          {/* Click handler */}
          <div 
            className="absolute inset-0 cursor-pointer z-10"
            onClick={handleSpinClick}
            style={{ 
              pointerEvents: isSpinning ? 'none' : 'auto',
              WebkitTapHighlightColor: 'transparent',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
            aria-label="Click to spin the wheel"
          />
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="fixed top-4 left-0 right-0 mx-auto max-w-sm bg-red-500 text-white px-4 py-2 rounded-lg text-center shadow-lg z-50">
            {errorMsg}
          </div>
        )}

        {/* Submission Status */}
        {submissionStatus === 'success' && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-sm sm:text-base z-50">
            Form submitted successfully!
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-sm sm:text-base z-50">
            Error submitting form. Please try again.
          </div>
        )}

        <style>
          {`
            body {
              overflow-x: hidden;
              position: relative;
              background-color: #000;
            }
            
            .animate-spin {
              -webkit-animation: spin 3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
              animation: spin 3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
              -webkit-transform: translateZ(0);
              transform: translateZ(0);
            }
            @-webkit-keyframes spin {
              from {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
              }
              to {
                -webkit-transform: rotate(${finalRotation}deg);
                transform: rotate(${finalRotation}deg);
              }
            }
            @keyframes spin {
              from {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
              }
              to {
                -webkit-transform: rotate(${finalRotation}deg);
                transform: rotate(${finalRotation}deg);
              }
            }
            @media (max-width: 640px) {
              .animate-spin {
                -webkit-animation-duration: 2.5s;
                animation-duration: 2.5s;
              }
            }
            /* Force hardware acceleration for iOS */
            img {
              -webkit-perspective: 1000;
              -webkit-backface-visibility: hidden;
              perspective: 1000;
              backface-visibility: hidden;
              -webkit-transform: translateZ(0);
              transform: translateZ(0);
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SpinWheel;

