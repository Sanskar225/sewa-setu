// src/contexts/MouseFollowerContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface MouseFollowerContextType {
  isFollowing: boolean;
  setIsFollowing: (value: boolean) => void;
  showText: boolean;
  setShowText: (value: boolean) => void;
  talkText: string | null;
  setTalkText: (value: string | null) => void;
  mousePos: { x: number; y: number };
  setMousePos: (value: { x: number; y: number }) => void;
}

const MouseFollowerContext = createContext<MouseFollowerContextType | undefined>(undefined);

export const MouseFollowerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showText, setShowText] = useState(true);
  const [talkText, setTalkText] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <MouseFollowerContext.Provider
      value={{ 
        isFollowing, 
        setIsFollowing, 
        showText, 
        setShowText, 
        talkText, 
        setTalkText,
        mousePos,
        setMousePos
      }}
    >
      {children}
    </MouseFollowerContext.Provider>
  );
};

export const useMouseFollower = () => {
  const context = useContext(MouseFollowerContext);
  if (context === undefined) {
    throw new Error('useMouseFollower must be used within a MouseFollowerProvider');
  }
  return context;
};