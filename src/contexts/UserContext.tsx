
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  prize: string | null;
  setPrize: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prize, setPrize] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData, prize, setPrize }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
