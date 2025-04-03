import React, { useState, useEffect } from 'react';
import wheelImage from '../assets/wheel-image.png';
import backgroundImage from '../assets/Spinning Wheel Final v3-1 (1).png';

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

  // const getRandomDegree = () => {
  //   const a = Math.floor(Math.random() * 360);
  //   setRandomDegree(a);
  //   console.log("randomDegree1:",randomDegree, "randomDeg:",a);
  //   console.log(a);
  //   return a;
  // };

  const calculatePrize = (degree: number) => {
    // Normalize the degree to 0-360
    let normalizedDegree = (270 - degree);
    if (normalizedDegree < 0) {
      normalizedDegree += 360;
    }
    

    // console.log("normalizedDegree:",normalizedDegree);
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
    // console.log("segment:",segment,"segment.prize:",segment?.prize);
    return segment ? segment.prize : PRIZE_SEGMENTS[0].prize;
  };

  const submitToGoogleForm = async (prize: string) => {
    try {
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
      nameField.value = userData.name;
      form.appendChild(nameField);
      
      const phoneField = document.createElement('input');
      phoneField.type = 'hidden';
      phoneField.name = 'entry.850620478';
      phoneField.value = userData.phone;
      form.appendChild(phoneField);
      
      const emailField = document.createElement('input');
      emailField.type = 'hidden';
      emailField.name = 'entry.308547054';
      emailField.value = userData.email;
      form.appendChild(emailField);
      
      const prizeField = document.createElement('input');
      prizeField.type = 'hidden';
      prizeField.name = 'entry.1057627581';
      prizeField.value = prize;
      form.appendChild(prizeField);
      
      // Add form to body and submit
      document.body.appendChild(form);
      form.submit();
      // console.log('Form submitted silently via iframe');
      
      // Remove form and iframe from DOM after submission
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 1000);
      
      setSubmissionStatus('success');
    } catch (error) {
      // console.error('Error submitting form:', error);
      setSubmissionStatus('error');
    }
  };

  const handleSpinClick = () => {
    if (!isSpinning) {
      const newRandomDegree = Math.floor(Math.random() * 360);
      // console.log("newRandomDegree:",newRandomDegree);
      
      setRandomDegree(newRandomDegree);
      const totalRotation = -(1800 + newRandomDegree);
      setIsSpinning(true);
      setFinalRotation(totalRotation - 12);
      setSubmissionStatus('idle');
      
      setTimeout(() => {
        setIsSpinning(false);
        const finalDegree = newRandomDegree;
        // const adjustedDegree = finalDegree % 360;
        const prize = calculatePrize(newRandomDegree);
        onPrizeWon(prize);
        submitToGoogleForm(prize);
      }, 3000);
    }
  };

  useEffect(() => {
    setRotation(finalRotation);
  }, [finalRotation]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 md:px-8">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Background UI */}
        <img 
          src={backgroundImage}
          alt="Spin Wheel Background"
          className="w-full object-contain"
        />
        
        {/* Spinning Wheel */}
        <div className="absolute top-[15%] sm:top-[18%] md:top-[22%] left-1/2 transform -translate-x-1/2 w-[52%] sm:w-[60%] md:w-[52%] aspect-square -mt-2 sm:-mt-16 md:-mt-28">
          <img 
            src={wheelImage}
            alt="Spin Wheel"
            className={`w-full h-full transition-transform duration-[3000ms] ease-out ${isSpinning ? 'animate-spin' : ''}`}
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
          />
          
          {/* Click handler */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={handleSpinClick}
            style={{ pointerEvents: isSpinning ? 'none' : 'auto' }}
            aria-label="Click to spin the wheel"
          />
        </div>


        <style>
          {`
            .animate-spin {
              animation: spin 3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
            }
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(${finalRotation}deg);
              }
            }
            @media (max-width: 640px) {
              .animate-spin {
                animation-duration: 2.5s;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SpinWheel;

