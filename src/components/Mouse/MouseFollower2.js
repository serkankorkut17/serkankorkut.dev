"use client"

import { useEffect, useState } from 'react';

const MouseFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y - 20,
        left: position.x - 20,
        width: '40px',
        height: '40px',
        border: '2px solid #D97706', // bg-orange-600
        borderRadius: '50%',
        backgroundColor: 'transparent', // No fill
        pointerEvents: 'none', // Prevent the circle from capturing mouse events
        transition: 'top 0.1s, left 0.1s', // Smooth the transition
        zIndex: 1000,
      }}
    />
  );
};

export default MouseFollower;
