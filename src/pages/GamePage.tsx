import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '../contexts/UserContext';
import SpinWheel from '@/components/SpinWheel';
import WinningModal from '@/components/WinningModal';

const GamePage = () => {
  const navigate = useNavigate();
  const { userData, setPrize } = useUser();
  const [showWinModal, setShowWinModal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to home if no user data
    if (!userData) {
      toast({
        title: "Please register first",
        description: "You need to provide your details before playing",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userData, navigate, toast]);

  const handlePrizeWon = (prize: string) => {
    setCurrentPrize(prize);
    setPrize(prize);
    setTimeout(() => {
      setShowWinModal(true);
    }, 1000); // Show modal after wheel stops
  };

  const handlePlayAgain = () => {
    setShowWinModal(false);
    setCurrentPrize(null);
  };

  if (!userData) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="w-full bg-black py-4 px-6 border-b border-[#E23744]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#E23744]">upGrad Spin &amp; Win</h1>
          <div className="hidden md:block">
            <p className="text-white">Welcome, <span className="font-semibold">{userData?.name}</span>!</p>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        {/* <div className="max-w-6xl w-full mx-auto"> */}
          {/* <div className="flex flex-col items-center"> */}
            {/* The SpinWheel component contains all the branding and design */}
            <SpinWheel onPrizeWon={handlePrizeWon} userData={userData} />
          {/* </div> */}
        {/* </div> */}
      </main>
      
      {showWinModal && currentPrize && (
        <WinningModal 
          prize={currentPrize} 
          isOpen={showWinModal}
          onClose={handlePlayAgain}
        />
      )}
      
      <footer className="w-full bg-black py-4 px-6 border-t border-[#E23744]/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">© 2023 upGrad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GamePage;
