
import React, { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Confetti from './Confetti';

interface WinningModalProps {
  prize: string;
  isOpen: boolean;
  onClose: () => void;
}

const WinningModal: React.FC<WinningModalProps> = ({ prize, isOpen, onClose }) => {
  const { userData } = useUser();
  const isBetterLuck = prize.includes("Better Luck Next Time");
  
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
              <p>We'll contact you at {userData?.email || 'your email'} with details on how to claim your prize.</p>
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
              onClick={() => window.location.href = 'https://www.upgrad.com'} 
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
