"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import useInactivity from "./useInactivity";

// Constants
const SPEED = 5; // Speed in pixels per frame
const TRAIL_DELAY = 5; // Number of frames between each trailing copy
const MAX_TRAIL_LENGTH = 10; // Maximum number of trailing copies
const BORDER_WIDTH_MULTIPLIER = 0.02; // Border width as a multiplier of font size
const FONT_SIZE_DIVISOR = 7; // Font size = width / FONT_SIZE_DIVISOR
const INACTIVITY_DELAY = 12000; // Time in milliseconds before activating screensaver
const LETTER_SPACING_MULTIPLIER = 0.05; // Letter spacing as multiplier of font size
const TRAIL_MIN_OPACITY = 0.3; // Minimum opacity for trail effect
const TRAIL_OPACITY_RANGE = 0.7; // Opacity range for trail effect (max - min)
const PINK_COLOR = { r: 248, g: 180, b: 185 }; // Pink color from topnav (#f8b4b9)

interface ScreensaverProps {
  text: string;
}

export interface ScreensaverRef {
  activate: () => void;
  deactivate: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface TextDimensions {
  width: number;
  height: number;
}

const Screensaver = forwardRef<ScreensaverRef, ScreensaverProps>(
  ({ text }, ref) => {
    const [isActive, setIsActive] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const positionRef = useRef<Position>({ x: 0, y: 0 });
    const velocityRef = useRef<Position>({ x: 0, y: 0 });
    const textDimensionsRef = useRef<TextDimensions>({ width: 0, height: 0 });
    const positionHistoryRef = useRef<Position[]>([]);
    const frameCounterRef = useRef(0);
    const isActiveRef = useRef(false);
    const fontFamilyRef = useRef<string>("");

    // Keep ref in sync with state
    useEffect(() => {
      isActiveRef.current = isActive;
    }, [isActive]);

    // Helper: Get computed font family from CSS variable
    const getComputedFontFamily = useCallback(() => {
      if (fontFamilyRef.current) return fontFamilyRef.current;

      const testElement = document.createElement("div");
      testElement.style.fontFamily = "var(--font-geist-sans), sans-serif";
      testElement.style.position = "absolute";
      testElement.style.visibility = "hidden";
      testElement.style.width = "1px";
      testElement.style.height = "1px";
      document.body.appendChild(testElement);
      testElement.offsetHeight; // Force reflow
      const computed =
        window.getComputedStyle(testElement).fontFamily || "sans-serif";
      document.body.removeChild(testElement);
      fontFamilyRef.current = computed;
      return computed;
    }, []);

    // Helper: Clean up animation frame
    const cleanupAnimation = useCallback(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }, []);

    // Helper: Deactivate screensaver
    const deactivate = useCallback(() => {
      cleanupAnimation();
      setIsActive(false);
    }, [cleanupAnimation]);

    // Callbacks for inactivity hook
    const handleInactive = useCallback(() => {
      // On inactivity: activate if not already active
      if (!isActiveRef.current) {
        setIsActive(true);
      }
    }, []);

    const handleActivity = useCallback(() => {
      // On activity: deactivate if currently active
      if (isActiveRef.current) {
        deactivate();
      }
    }, [deactivate]);

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        activate: () => {
          setIsActive(true);
        },
        deactivate,
      }),
      [deactivate]
    );

    // Set up inactivity detection
    useInactivity(INACTIVITY_DELAY, handleInactive, handleActivity);

    // Calculate text dimensions
    const calculateTextDimensions = useCallback(
      (ctx: CanvasRenderingContext2D, fontSize: number): TextDimensions => {
        const fontFamily = getComputedFontFamily();
        ctx.font = `600 ${fontSize}px ${fontFamily}`;
        const letterSpacing = fontSize * LETTER_SPACING_MULTIPLIER;
        const chars = text.split("");
        let totalWidth = 0;
        chars.forEach((char) => {
          totalWidth += ctx.measureText(char).width + letterSpacing;
        });
        totalWidth -= letterSpacing;
        return { width: totalWidth, height: fontSize };
      },
      [text, getComputedFontFamily]
    );

    // Get canvas dimensions
    const getCanvasDimensions = useCallback(() => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { width: 0, height: 0 };
      return { width: rect.width, height: rect.height };
    }, []);

    // Calculate font size based on canvas dimensions
    const calculateFontSize = useCallback((width: number, height: number) => {
      return Math.min(width / FONT_SIZE_DIVISOR, height / FONT_SIZE_DIVISOR);
    }, []);

    // Handle collision detection and bouncing
    const handleCollisions = useCallback((width: number, height: number) => {
      const halfWidth = textDimensionsRef.current.width / 2;
      const halfHeight = textDimensionsRef.current.height / 2;

      if (
        positionRef.current.x - halfWidth <= 0 ||
        positionRef.current.x + halfWidth >= width
      ) {
        velocityRef.current.x = -velocityRef.current.x;
        positionRef.current.x = Math.max(
          halfWidth,
          Math.min(width - halfWidth, positionRef.current.x)
        );
      }

      if (
        positionRef.current.y - halfHeight <= 0 ||
        positionRef.current.y + halfHeight >= height
      ) {
        velocityRef.current.y = -velocityRef.current.y;
        positionRef.current.y = Math.max(
          halfHeight,
          Math.min(height - halfHeight, positionRef.current.y)
        );
      }
    }, []);

    // Initialize position and velocity
    const initializePosition = useCallback(() => {
      const { width, height } = getCanvasDimensions();
      if (!width || !height) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fontSize = calculateFontSize(width, height);
      textDimensionsRef.current = calculateTextDimensions(ctx, fontSize);

      positionRef.current = { x: width / 2, y: height / 2 };
      positionHistoryRef.current = [];
      frameCounterRef.current = 0;

      const angle = Math.random() * Math.PI * 2;
      velocityRef.current = {
        x: Math.cos(angle) * SPEED,
        y: Math.sin(angle) * SPEED,
      };
    }, [getCanvasDimensions, calculateFontSize, calculateTextDimensions]);

    // Draw text function
    const drawText = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        opacity: number = 1
      ) => {
        const { width, height } = getCanvasDimensions();
        const fontSize = calculateFontSize(width, height);
        const fontFamily = getComputedFontFamily();
        ctx.font = `600 ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = "middle";

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = `rgba(${PINK_COLOR.r}, ${PINK_COLOR.g}, ${PINK_COLOR.b}, ${opacity})`;
        ctx.lineWidth = Math.max(2, fontSize * BORDER_WIDTH_MULTIPLIER);

        const letterSpacing = fontSize * LETTER_SPACING_MULTIPLIER;
        const chars = text.split("");
        let currentX = x - textDimensionsRef.current.width / 2;
        chars.forEach((char) => {
          ctx.strokeText(char, currentX, y);
          currentX += ctx.measureText(char).width + letterSpacing;
        });
        ctx.restore();
      },
      [text, getComputedFontFamily, getCanvasDimensions, calculateFontSize]
    );

    // Draw text on canvas and animate
    useEffect(() => {
      if (!isActive) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size with device pixel ratio for crisp rendering
      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        initializePosition();
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Animation loop
      const animate = () => {
        const { width, height } = getCanvasDimensions();
        if (!width || !height) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        frameCounterRef.current++;

        // Add current position to history based on TRAIL_DELAY
        if (frameCounterRef.current % TRAIL_DELAY === 0) {
          positionHistoryRef.current.push({
            x: positionRef.current.x,
            y: positionRef.current.y,
          });

          // Keep only the last MAX_TRAIL_LENGTH positions
          if (positionHistoryRef.current.length > MAX_TRAIL_LENGTH) {
            positionHistoryRef.current.shift();
          }
        }

        // Update position
        positionRef.current.x += velocityRef.current.x;
        positionRef.current.y += velocityRef.current.y;

        // Handle collisions
        handleCollisions(width, height);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trailing copies (oldest to newest)
        const historyLength = positionHistoryRef.current.length;
        positionHistoryRef.current.forEach((pos, index) => {
          const opacity =
            TRAIL_MIN_OPACITY + (index / historyLength) * TRAIL_OPACITY_RANGE;
          drawText(ctx, pos.x, pos.y, opacity);
        });

        // Draw main text at current position
        drawText(ctx, positionRef.current.x, positionRef.current.y, 1);

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cleanupAnimation();
      };
    }, [
      isActive,
      initializePosition,
      getCanvasDimensions,
      handleCollisions,
      drawText,
      cleanupAnimation,
    ]);

    if (!isActive) {
      return null;
    }

    return (
      <div
        onClick={deactivate}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          zIndex: 10000,
          cursor: "pointer",
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
