"use client";

import { useEffect, useRef } from "react";
import FireImg from "@/images/rocket_fire.png";
import Image from "next/image";

const RocketFire = () => {
  const followerRef = useRef<HTMLImageElement>(null); // Reference to the fire image
  const position = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const targetPosition = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const speed = 0.05; // Adjust this value to make the fire move faster or slower

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return;

    // Set initial position and target position to center of the screen
    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    targetPosition.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Update target position on mouse move
      targetPosition.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      // Update position based on target position
      position.current.x +=
        (targetPosition.current.x - position.current.x) * speed;
      position.current.y +=
        (targetPosition.current.y - position.current.y) * speed;
      // Update the fire image position
      if (followerRef.current) {
        followerRef.current.style.top = `${position.current.y + 40}px`;
        followerRef.current.style.left = `${position.current.x - 21}px`;
      }
      // Request animation frame
      requestAnimationFrame(animate);
    };

    // Add event listener for mouse move
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Image
      ref={followerRef}
      src={FireImg}
      alt="Rocket Fire"
      width={40}
      height={40}
      className="hidden md:block"
      style={{
        position: "fixed",
        pointerEvents: "none", // Prevent the fire from capturing mouse events
        zIndex: 1000,
      }}
    />
  );
  // return (
  //   <img
  //     ref={followerRef}
  //     src={FireImg.src}
  //     alt="Rocket Fire"
  //     style={{
  //       position: 'fixed',
  //       width: '40px',
  //       height: '40px',
  //       pointerEvents: 'none',
  //       zIndex: 1000,
  //     }}
  //   />
  // );
};

export default RocketFire;
