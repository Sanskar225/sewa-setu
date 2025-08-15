// src/components/MouseFollower.tsx
import React, { useEffect } from 'react';
import { useMouseFollower } from '../contexts/MouseFollowerContext';

const MouseFollower: React.FC = () => {
  const { 
    isFollowing, 
    showText, 
    talkText, 
    mousePos,
    setMousePos
  } = useMouseFollower();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isFollowing) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFollowing, setMousePos]);

  if (!isFollowing) {
    return (
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-center">
        <img
          src="/assets/plumber-loader.png"
          alt="Idle Icon"
          className="w-14 h-14 animate-bounce"
        />
        <p className="text-xs text-white mt-1">Hi 👋</p>
      </div>
    );
  }

  return (
    <>
      <img
        src="/assets/plumber-loader.png"
        alt="Floating Icon"
        className="fixed w-16 h-16 z-[9999] pointer-events-none transition-all duration-150 ease-out"
        style={{
          left: mousePos.x + 10,
          top: mousePos.y + 10,
        }}
      />
      {(showText || talkText) && (
        <p
          className="fixed z-[9999] text-xs bg-white text-gray-700 px-3 py-1 rounded shadow pointer-events-none transition-opacity duration-200"
          style={{
            left: mousePos.x + 70,
            top: mousePos.y + 10,
          }}
        >
          {talkText || 'Let me follow you 👀 and help you find the best services!'}
        </p>
      )}
    </>
  );
};

export default MouseFollower;