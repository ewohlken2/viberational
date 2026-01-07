import { useEffect, useRef } from "react";

const BASE_SIZE = 30;
const PADDING = 14;
const LERP = 0.15;
const ROTATION_SPEED = 0.3; // deg per frame
const ROTATION_LERP = 0.18; // Smooth rotation interpolation
const DOT_SIZE = 7;
const BORDER_WIDTH = 2;
const BORDER_COLOR = "#f8b4b9";
const DOT_COLOR = "#f8b4b9";
const JIGGLE_INTENSITY = 2; // Maximum jiggle distance in pixels
const JIGGLE_LERP = 0.15; // How quickly jiggle follows mouse movement
const SNAP_BACK_LERP = 0.12; // How quickly it snaps back to center

const normalizeDeg = (deg: number) => ((deg % 360) + 360) % 360;

const angleDistance = (a: number, b: number) => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

const isCloserToVerticalRotation = (deg: number) => {
  const n = normalizeDeg(deg);

  const distToVertical = Math.min(angleDistance(n, 90), angleDistance(n, 270));

  const distToHorizontal = Math.min(angleDistance(n, 0), angleDistance(n, 180));

  return distToVertical < distToHorizontal;
};

export default function CursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const actualMouse = useRef({ x: 0, y: 0 }); // Actual mouse position for dot
  const prevMouse = useRef({ x: 0, y: 0 }); // Previous mouse position to detect movement
  const pos = useRef({ x: 0, y: 0 });
  const rotation = useRef(0);
  const targetRotation = useRef(0);
  const hovering = useRef(false);
  const releasing = useRef(false);
  const hoveredElement = useRef<HTMLElement | null>(null);
  const hoveredRect = useRef<DOMRect | null>(null);
  const cursorSize = useRef({ width: BASE_SIZE, height: BASE_SIZE });
  const jiggleOffset = useRef({ x: 0, y: 0 }); // Jiggle offset when snapped
  const targetJiggle = useRef({ x: 0, y: 0 }); // Target jiggle position

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ----------------------------
    // Mouse tracking
    // ----------------------------
    const getCenterPosition = (rect: DOMRect) => {
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const snapToRightAngle = (deg: number) => Math.round(deg / 90) * 90;

    const onMove = (e: MouseEvent) => {
      // Calculate mouse movement delta
      const deltaX = e.clientX - prevMouse.current.x;
      const deltaY = e.clientY - prevMouse.current.y;
      const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Always update actual mouse position
      actualMouse.current.x = e.clientX;
      actualMouse.current.y = e.clientY;

      if (!hovering.current && !releasing.current) {
        // When not hovering and not releasing, box center follows mouse
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
        // Reset jiggle when not hovering
        targetJiggle.current.x = 0;
        targetJiggle.current.y = 0;
      } else if (hoveredRect.current) {
        // When hovering, use the center of the hovered element
        const centerPos = getCenterPosition(hoveredRect.current);
        mouse.current.x = centerPos.x;
        mouse.current.y = centerPos.y;

        // Calculate jiggle based on mouse movement direction
        if (movementDistance > 0) {
          // Normalize the direction vector
          const normalizedX = deltaX / movementDistance;
          const normalizedY = deltaY / movementDistance;

          // Set target jiggle in the direction of mouse movement
          targetJiggle.current.x = normalizedX * JIGGLE_INTENSITY;
          targetJiggle.current.y = normalizedY * JIGGLE_INTENSITY;
        } else {
          // If mouse isn't moving, target jiggle should be zero (will snap back)
          targetJiggle.current.x = 0;
          targetJiggle.current.y = 0;
        }
      }

      // Update previous mouse position
      prevMouse.current.x = e.clientX;
      prevMouse.current.y = e.clientY;
    };

    // Initialize previous mouse position
    const initMousePos = (e: MouseEvent) => {
      prevMouse.current.x = e.clientX;
      prevMouse.current.y = e.clientY;
      actualMouse.current.x = e.clientX;
      actualMouse.current.y = e.clientY;
      window.removeEventListener("mousemove", initMousePos);
    };
    window.addEventListener("mousemove", initMousePos);
    window.addEventListener("mousemove", onMove);

    // ----------------------------
    // Hover target detection
    // ----------------------------
    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();

      hovering.current = true;
      hoveredElement.current = el;
      hoveredRect.current = rect;

      // Use center of the hovered element
      const centerPos = getCenterPosition(rect);
      mouse.current.x = centerPos.x;
      mouse.current.y = centerPos.y;
      pos.current.x = centerPos.x;
      pos.current.y = centerPos.y;

      // Reset jiggle when entering hover state
      jiggleOffset.current.x = 0;
      jiggleOffset.current.y = 0;
      targetJiggle.current.x = 0;
      targetJiggle.current.y = 0;

      // Set target rotation to 0 (aligned with element)
      targetRotation.current = snapToRightAngle(rotation.current);
    };

    const onLeave = () => {
      hovering.current = false;
      releasing.current = true; // start release animation
      hoveredElement.current = null;
      hoveredRect.current = null;
    };

    const targets = document.querySelectorAll<HTMLElement>("[data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // ----------------------------
    // Canvas drawing functions
    // ----------------------------
    const drawBox = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      rotation: number
    ) => {
      ctx.save();

      // Always use center positioning
      const offsetX = width / 2;
      const offsetY = height / 2;

      // Translate to position
      ctx.translate(x, y);
      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);
      // Translate back by offset to center the box
      ctx.translate(-offsetX, -offsetY);

      // Draw border rectangle
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = BORDER_WIDTH;
      ctx.strokeRect(0, 0, width, height);

      ctx.restore();
    };

    const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.save();
      ctx.fillStyle = DOT_COLOR;
      ctx.beginPath();
      ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ----------------------------
    // Animation loop
    // ----------------------------
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update hovered rect if element still exists
      if (hovering.current && hoveredElement.current) {
        hoveredRect.current = hoveredElement.current.getBoundingClientRect();
      }

      // Smoothly interpolate cursor size
      const targetWidth = hovering.current
        ? (hoveredRect.current?.width || BASE_SIZE) + PADDING
        : BASE_SIZE;
      const targetHeight = hovering.current
        ? (hoveredRect.current?.height || BASE_SIZE) + PADDING
        : BASE_SIZE;

      cursorSize.current.width +=
        (targetWidth - cursorSize.current.width) * LERP;
      cursorSize.current.height +=
        (targetHeight - cursorSize.current.height) * LERP;

      // Handle position - three states: hovering, releasing, or free
      if (hovering.current) {
        // Hovering → follow element center
        const centerX = mouse.current.x;
        const centerY = mouse.current.y;

        // Update jiggle offset to follow target jiggle (only moves when mouse moves)
        jiggleOffset.current.x +=
          (targetJiggle.current.x - jiggleOffset.current.x) * JIGGLE_LERP;
        jiggleOffset.current.y +=
          (targetJiggle.current.y - jiggleOffset.current.y) * JIGGLE_LERP;

        // Snap back to center when target is zero (mouse not moving)
        if (
          Math.abs(targetJiggle.current.x) < 0.1 &&
          Math.abs(targetJiggle.current.y) < 0.1
        ) {
          jiggleOffset.current.x +=
            (0 - jiggleOffset.current.x) * SNAP_BACK_LERP;
          jiggleOffset.current.y +=
            (0 - jiggleOffset.current.y) * SNAP_BACK_LERP;
        }

        // Position is center + jiggle offset
        pos.current.x = centerX + jiggleOffset.current.x;
        pos.current.y = centerY + jiggleOffset.current.y;
      } else if (releasing.current) {
        // Releasing → animate back to cursor
        pos.current.x += (actualMouse.current.x - pos.current.x) * LERP;
        pos.current.y += (actualMouse.current.y - pos.current.y) * LERP;

        // Reset jiggle when releasing
        jiggleOffset.current.x = 0;
        jiggleOffset.current.y = 0;
        targetJiggle.current.x = 0;
        targetJiggle.current.y = 0;

        // Stop releasing when close enough
        const dx = actualMouse.current.x - pos.current.x;
        const dy = actualMouse.current.y - pos.current.y;

        if (Math.hypot(dx, dy) < 0.5) {
          releasing.current = false;
        }
      } else {
        // Fully free → hard follow cursor
        pos.current.x = actualMouse.current.x;
        pos.current.y = actualMouse.current.y;
        // Reset jiggle when not hovering
        jiggleOffset.current.x = 0;
        jiggleOffset.current.y = 0;
        targetJiggle.current.x = 0;
        targetJiggle.current.y = 0;
      }

      // Handle rotation
      if (!hovering.current) {
        // Rotate continuously when not hovering
        rotation.current = (rotation.current + ROTATION_SPEED) % 360;
        targetRotation.current = rotation.current;
      } else {
        // Smoothly rotate to 0 degrees (aligned) when hovering
        rotation.current +=
          (targetRotation.current - rotation.current) * ROTATION_LERP;
      }

      // Draw box cursor
      const vertical = isCloserToVerticalRotation(targetRotation.current);

      const drawWidth = vertical
        ? cursorSize.current.height
        : cursorSize.current.width;

      const drawHeight = vertical
        ? cursorSize.current.width
        : cursorSize.current.height;

      console.log("is vertical", vertical);

      drawBox(
        ctx,
        pos.current.x,
        pos.current.y,
        drawWidth,
        drawHeight,
        rotation.current
      );

      // Draw dot cursor (always follows actual mouse)
      drawDot(ctx, actualMouse.current.x, actualMouse.current.y);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resizeCanvas);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
