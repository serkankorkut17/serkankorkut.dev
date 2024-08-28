"use client"

import { useEffect, useRef } from 'react';

const MouseFollower = () => {
  const followerRef = useRef(null);
  const position = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const speed = 0.05; // Adjust this value to make the circle move faster or slower

  useEffect(() => {
    const handleMouseMove = (event) => {
      targetPosition.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      position.current.x += (targetPosition.current.x - position.current.x) * speed;
      position.current.y += (targetPosition.current.y - position.current.y) * speed;

      if (followerRef.current) {
        followerRef.current.style.top = `${position.current.y - 20}px`;
        followerRef.current.style.left = `${position.current.x - 20}px`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={followerRef}
      style={{
        position: 'fixed',
        width: '40px',
        height: '40px',
        border: '2px solid #D97706', // bg-orange-600
        borderRadius: '50%',
        backgroundColor: 'transparent', // No fill
        pointerEvents: 'none', // Prevent the circle from capturing mouse events
        zIndex: 1000,
      }}
    />
  );
};

export default MouseFollower;
