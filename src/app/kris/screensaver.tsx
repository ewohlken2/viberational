"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

// Constants
const SPEED = 5; // Speed in pixels per frame
const TRAIL_DELAY = 5; // Number of frames between each trailing copy (1 = every frame)
const MAX_TRAIL_LENGTH = 10; // Maximum number of trailing copies
const BORDER_WIDTH_MULTIPLIER = 0.02; // Border width as a multiplier of font size (0.05 = 5% of font size)
const FONT_SIZE_DIVISOR = 7; // Font size = width / FONT_SIZE_DIVISOR (smaller = larger font)

interface ScreensaverProps {
  text: string;
  delay?: number; // Delay in milliseconds before activating
}

export interface ScreensaverRef {
  activate: () => void;
  deactivate: () => void;
}

const Screensaver = forwardRef<ScreensaverRef, ScreensaverProps>(
  ({ text, delay = 5000 }, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const textDimensionsRef = useRef({ width: 0, height: 0 });
    const positionHistoryRef = useRef<Array<{ x: number; y: number }>>([]);
    const frameCounterRef = useRef(0);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      activate: () => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Immediately activate the screensaver
        setIsActive(true);
        setIsCountingDown(false);
      },
      deactivate: () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        setIsActive(false);
        setIsCountingDown(false);
      },
    }));

    // Draw text on canvas and animate
    useEffect(() => {
      if (!isActive) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Get the computed font family from CSS variable (Geist Sans)
      // Create a test element with the font variable to get the actual font family name
      const testElement = document.createElement("div");
      testElement.style.fontFamily = "var(--font-geist-sans), sans-serif";
      testElement.style.position = "absolute";
      testElement.style.visibility = "hidden";
      testElement.style.width = "1px";
      testElement.style.height = "1px";
      document.body.appendChild(testElement);

      // Force a reflow to ensure the font is computed
      testElement.offsetHeight;

      const computedFontFamily =
        window.getComputedStyle(testElement).fontFamily || "sans-serif";
      document.body.removeChild(testElement);

      // Initialize position and velocity
      const initializePosition = () => {
        const rect = canvas.getBoundingClientRect();
        const logicalWidth = rect.width;
        const logicalHeight = rect.height;

        // Calculate text dimensions
        const fontSize = Math.min(
          logicalWidth / FONT_SIZE_DIVISOR,
          logicalHeight / FONT_SIZE_DIVISOR
        );
        ctx.font = `600 ${fontSize}px ${computedFontFamily}`;
        const letterSpacing = fontSize * 0.05;
        const chars = text.split("");
        let totalWidth = 0;
        chars.forEach((char) => {
          const metrics = ctx.measureText(char);
          totalWidth += metrics.width + letterSpacing;
        });
        totalWidth -= letterSpacing;
        const textHeight = fontSize;

        textDimensionsRef.current = {
          width: totalWidth,
          height: textHeight,
        };

        // Start at center
        positionRef.current = {
          x: logicalWidth / 2,
          y: logicalHeight / 2,
        };

        // Reset position history and frame counter
        positionHistoryRef.current = [];
        frameCounterRef.current = 0;

        // Constant speed with random initial direction
        const angle = Math.random() * Math.PI * 2;
        velocityRef.current = {
          x: Math.cos(angle) * SPEED,
          y: Math.sin(angle) * SPEED,
        };
      };

      // Draw text function with static pink color and opacity support
      const drawText = (x: number, y: number, opacity: number = 1) => {
        const rect = canvas.getBoundingClientRect();
        const fontSize = Math.min(
          rect.width / FONT_SIZE_DIVISOR,
          rect.height / FONT_SIZE_DIVISOR
        );
        ctx.font = `600 ${fontSize}px ${computedFontFamily}`;
        ctx.textBaseline = "middle";

        // Calculate letter spacing (0.05em)
        const letterSpacing = fontSize * 0.05;

        // Set static pink color as stroke style (fill remains transparent)
        ctx.save();
        ctx.globalAlpha = opacity;
        // Pink color from topnav (#f8b4b9)
        ctx.strokeStyle = `rgba(248, 180, 185, ${opacity})`;
        ctx.lineWidth = Math.max(2, fontSize * BORDER_WIDTH_MULTIPLIER);

        // Draw each character with spacing (stroke only, no fill)
        const chars = text.split("");
        let currentX = x - textDimensionsRef.current.width / 2;
        chars.forEach((char) => {
          ctx.strokeText(char, currentX, y);
          const metrics = ctx.measureText(char);
          currentX += metrics.width + letterSpacing;
        });
        ctx.restore();
      };

      // Animation loop
      const animate = () => {
        const rect = canvas.getBoundingClientRect();
        const logicalWidth = rect.width;
        const logicalHeight = rect.height;

        // Increment frame counter
        frameCounterRef.current++;

        // Add current position to history based on TRAIL_DELAY
        if (frameCounterRef.current % TRAIL_DELAY === 0) {
          positionHistoryRef.current.push({
            x: positionRef.current.x,
            y: positionRef.current.y,
          });

          // Keep only the last MAX_TRAIL_LENGTH positions for trailing effect
          if (positionHistoryRef.current.length > MAX_TRAIL_LENGTH) {
            positionHistoryRef.current.shift();
          }
        }

        // Update position
        positionRef.current.x += velocityRef.current.x;
        positionRef.current.y += velocityRef.current.y;

        // Check for collisions with edges and bounce
        const halfWidth = textDimensionsRef.current.width / 2;
        const halfHeight = textDimensionsRef.current.height / 2;

        if (
          positionRef.current.x - halfWidth <= 0 ||
          positionRef.current.x + halfWidth >= logicalWidth
        ) {
          velocityRef.current.x = -velocityRef.current.x;
          // Clamp position to prevent going out of bounds
          positionRef.current.x = Math.max(
            halfWidth,
            Math.min(logicalWidth - halfWidth, positionRef.current.x)
          );
        }

        if (
          positionRef.current.y - halfHeight <= 0 ||
          positionRef.current.y + halfHeight >= logicalHeight
        ) {
          velocityRef.current.y = -velocityRef.current.y;
          // Clamp position to prevent going out of bounds
          positionRef.current.y = Math.max(
            halfHeight,
            Math.min(logicalHeight - halfHeight, positionRef.current.y)
          );
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trailing copies first (oldest to newest)
        const historyLength = positionHistoryRef.current.length;
        positionHistoryRef.current.forEach((pos, index) => {
          // Calculate opacity: older positions are more transparent
          // Last position (most recent) has opacity 0.3, newest has opacity 1
          const opacity = 0.3 + (index / historyLength) * 0.7;
          drawText(pos.x, pos.y, opacity);
        });

        // Draw main text at current position (full opacity)
        drawText(positionRef.current.x, positionRef.current.y, 1);

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Set canvas size with device pixel ratio for crisp rendering
      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.scale(dpr, dpr);
        initializePosition();
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Start animation
      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [isActive, text]);

    // Handle click to deactivate
    const handleClick = () => {
      if (isActive) {
        setIsActive(false);
        setIsCountingDown(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    if (!isActive && !isCountingDown) {
      return null;
    }

    return (
      <div
        onClick={handleClick}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          zIndex: 10000,
          cursor: isActive ? "pointer" : "default",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    );
  }
);

Screensaver.displayName = "Screensaver";

export default Screensaver;
