"use client";

import RocketPointerImg from "@/images/rocket_orange.png";
import RocketImg from "@/images/rocket_white_line-20.png";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const RocketCursor = () => {
  const rocketRef = useRef(null);
  const position = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const targetPosition = useRef({ x: 0, y: 0 }); // Initialize with 0; will be updated on client load
  const speed = 0.2; // Increase this value to make the rocket move faster
  const [isPointer, setIsPointer] = useState(false); // Track if the cursor should be a pointer

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return;
    // Set initial position to center of the screen
    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // Set initial target position to center of the screen
    targetPosition.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const handleMouseMove = (event) => {
      // Update target position on mouse move
      targetPosition.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseOver = (event) => {
      // Check if the cursor is over an interactive element
      let element = event.target;
      // Check for interactive tags and ARIA roles
      const interactiveTags = [
        "a",
        "button",
        "input",
        "select",
        "textarea",
        "label",
      ];
      const interactiveRoles = ["button", "link", "menuitem", "tab"];

      while (element) {
        const tagName = element.tagName.toLowerCase();
        const role = element.getAttribute("role");

        if (
          interactiveTags.includes(tagName) ||
          (role && interactiveRoles.includes(role))
        ) {
          setIsPointer(true);
          return; // Exit early if an interactive element is detected
        }
        element = element.parentElement;
      }
      setIsPointer(false); // Default to false if no interactive element is found
    };

    const animate = () => {
      // Update position based on target position
      position.current.x +=
        (targetPosition.current.x - position.current.x) * speed;
      position.current.y +=
        (targetPosition.current.y - position.current.y) * speed;

      // Update rocket position
      if (rocketRef.current) {
        rocketRef.current.style.top = `${position.current.y - 0}px`;
        rocketRef.current.style.left = `${position.current.x - 20}px`;
      }
      // Loop the animation
      requestAnimationFrame(animate);
    };

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    animate();

    return () => {
      // Clean up event listeners
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Image
      ref={rocketRef}
      src={isPointer ? RocketPointerImg : RocketImg} // Path to your rocket image
      alt="Rocket Cursor"
      width={40}
      height={40}
      className="hidden md:block"
      style={{
        position: "fixed",
        pointerEvents: "none", // Prevent the rocket from capturing mouse events
        zIndex: 1000,
      }}
    />
  );
  // return (
  //   <img
  //     ref={rocketRef}
  //     src={isPointer ? RocketPointerImg.src : RocketImg.src}
  //     alt="Rocket Cursor"
  //     style={{
  //       position: "fixed",
  //       width: "40px",
  //       height: "40px",
  //       pointerEvents: "none",
  //       zIndex: 1000,
  //     }}
  //   />
  // );
};

export default RocketCursor;
