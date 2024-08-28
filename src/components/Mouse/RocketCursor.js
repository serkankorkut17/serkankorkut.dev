"use client"

// import RocketImg from '@/images/rocket_white_line-20.png';
import RocketImg from '@/images/drndigital_white_2.png';
import { useEffect, useRef } from 'react';

const RocketCursor = () => {
  const rocketRef = useRef(null);
  const position = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const targetPosition = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const speed = 0.2; // Increase this value to make the rocket move faster

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

      if (rocketRef.current) {
        rocketRef.current.style.top = `${position.current.y - 20}px`;
        rocketRef.current.style.left = `${position.current.x - 20}px`;
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
      ref={rocketRef}
      src={RocketImg.src} // Path to your rocket image
      alt="Rocket Cursor"
      style={{
        position: 'fixed',
        width: '40px',
        height: '40px',
        pointerEvents: 'none', // Prevent the rocket from capturing mouse events
        zIndex: 1000,
      }}
    />
  );
};

export default RocketCursor;
