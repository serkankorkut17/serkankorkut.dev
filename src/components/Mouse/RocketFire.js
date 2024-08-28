"use client"

import { useEffect, useRef } from 'react';
import FireImg from '@/images/rocket_fire.png'; // Adjust the path to your fire image

const RocketFire = () => {
  const followerRef = useRef(null);
  const position = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const targetPosition = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const speed = 0.05; // Adjust this value to make the fire move faster or slower

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') return;

    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetPosition.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event) => {
      targetPosition.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      position.current.x += (targetPosition.current.x - position.current.x) * speed;
      position.current.y += (targetPosition.current.y - position.current.y) * speed;

      if (followerRef.current) {
        followerRef.current.style.top = `${position.current.y + 20}px`;
        followerRef.current.style.left = `${position.current.x - 21}px`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <img
      ref={followerRef}
      src={FireImg.src} // Path to your fire image
      alt="Rocket Fire"
      style={{
        position: 'fixed',
        width: '40px',
        height: '40px',
        pointerEvents: 'none', // Prevent the fire from capturing mouse events
        zIndex: 1000,
      }}
    />
  );
};

export default RocketFire;

