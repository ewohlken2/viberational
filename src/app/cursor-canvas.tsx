import { useEffect, useRef } from "react";

const BASE_SIZE = 48;
const PADDING = 4;
const LERP = 0.15;
const ROTATION_SPEED = 0.2; // deg per frame
const ROTATION_LERP = 0.18; // Smooth rotation interpolation
const DOT_SIZE = 6;
const BORDER_WIDTH = 3;
const BORDER_COLOR = "#ffffff"; // White for inversion effect
const DOT_COLOR = "#ffffff"; // White for inversion effect
const CORNER_GAP = 12; // Pixels from center of each side to leave transparent
const SPRING_STRENGTH = 0.015; // How stiff the rubber band is
const SPRING_DAMPING = 0.55; // How quickly it loses energy
const VELOCITY_INFLUENCE = 0.8; // How much mouse speed stretches it
const SNAP_LERP = 0.9; // How quickly it snaps to the hovered element center
const CLICK_SCALE = 0.85; // Scale reduction on click
const SCALE_LERP = 0.06; // How quickly scale animates (smooth transition)

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
  const isHoverTransition = useRef(false);

  const rotation = useRef(0);
  const targetRotation = useRef(0);
  const hovering = useRef(false);
  const releasing = useRef(false);
  const hoveredElement = useRef<HTMLElement | null>(null);
  const hoveredRect = useRef<DOMRect | null>(null);
  const cursorSize = useRef({ width: BASE_SIZE, height: BASE_SIZE });
  const springOffset = useRef({ x: 0, y: 0 }); // Spring displacement from anchor
  const springVelocity = useRef({ x: 0, y: 0 }); // Spring velocity
  const targetAnchor = useRef<{ x: number; y: number } | null>(null); // Target anchor position for smooth snapping
  const boxScale = useRef(1.0); // Current scale of the box cursor
  const dotScale = useRef(1.0); // Current scale of the dot cursor
  const isActive = useRef(false); // Active state when mouse is pressed

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

      // Always update actual mouse position
      actualMouse.current.x = e.clientX;
      actualMouse.current.y = e.clientY;

      if (!hovering.current && !releasing.current) {
        // When not hovering and not releasing, box center follows mouse
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      }

      if (hovering.current) {
        // Inject velocity into the spring (this is the rubber band stretch)
        springVelocity.current.x += deltaX * VELOCITY_INFLUENCE;
        springVelocity.current.y += deltaY * VELOCITY_INFLUENCE;
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
    // Click detection
    // ----------------------------
    const onMouseDown = () => {
      isActive.current = true;
    };
    const onMouseUp = () => {
      isActive.current = false;
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // ----------------------------
    // Hover target detection
    // ----------------------------
    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const centerPos = getCenterPosition(rect);

      // 🔥 IF we were already hovering another element
      if (hovering.current) {
        // Reduce spring energy instead of killing it
        springOffset.current.x *= 0.2;
        springOffset.current.y *= 0.2;
        springVelocity.current.x *= 0.2;
        springVelocity.current.y *= 0.2;
      } else {
        // First hover → no residual energy
        springOffset.current.x = 0;
        springOffset.current.y = 0;
        springVelocity.current.x = 0;
        springVelocity.current.y = 0;
      }

      // Cancel release immediately
      releasing.current = false;

      hovering.current = true;
      hoveredElement.current = el;
      hoveredRect.current = rect;

      // Set target anchor for smooth animation to new element center
      targetAnchor.current = { x: centerPos.x, y: centerPos.y };

      // Mark that we're transitioning into hover state
      isHoverTransition.current = true;

      targetRotation.current = snapToRightAngle(rotation.current);
    };
    const onLeave = () => {
      hovering.current = false;
      releasing.current = true;
      isHoverTransition.current = false;

      springOffset.current.x = 0;
      springOffset.current.y = 0;
      springVelocity.current.x = 0;
      springVelocity.current.y = 0;

      hoveredElement.current = null;
      hoveredRect.current = null;
      targetAnchor.current = null;
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
      rotation: number,
      scale: number = 1.0
    ) => {
      ctx.save();

      // Always use center positioning
      const offsetX = width / 2;
      const offsetY = height / 2;

      // Translate to position
      ctx.translate(x, y);
      // Apply scale
      ctx.scale(scale, scale);
      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);
      // Translate back by offset to center the box
      ctx.translate(-offsetX, -offsetY);

      // Draw corner segments only (leaving middle sections transparent)
      // CORNER_GAP determines how many pixels from each corner are visible
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = BORDER_WIDTH;
      ctx.beginPath();

      // Top-left corner: top edge and left edge
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.min(CORNER_GAP, width), 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, Math.min(CORNER_GAP, height));

      // Top-right corner: top edge and right edge
      ctx.moveTo(Math.max(0, width - CORNER_GAP), 0);
      ctx.lineTo(width, 0);
      ctx.moveTo(width, 0);
      ctx.lineTo(width, Math.min(CORNER_GAP, height));

      // Bottom-left corner: bottom edge and left edge
      ctx.moveTo(0, Math.max(0, height - CORNER_GAP));
      ctx.lineTo(0, height);
      ctx.moveTo(0, height);
      ctx.lineTo(Math.min(CORNER_GAP, width), height);

      // Bottom-right corner: bottom edge and right edge
      ctx.moveTo(Math.max(0, width - CORNER_GAP), height);
      ctx.lineTo(width, height);
      ctx.moveTo(width, Math.max(0, height - CORNER_GAP));
      ctx.lineTo(width, height);

      ctx.stroke();

      ctx.restore();
    };

    const drawDot = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      scale: number = 1.0
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = DOT_COLOR;
      ctx.beginPath();
      ctx.arc(0, 0, DOT_SIZE / 2, 0, Math.PI * 2);
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
      if (hovering.current && hoveredRect.current) {
        // Hovering → spring physics

        // Update target anchor if rect changed (for dynamic elements)
        const center = getCenterPosition(hoveredRect.current);
        targetAnchor.current = { x: center.x, y: center.y };

        // Smoothly animate anchor to target position
        // Use faster lerp during initial transition, then normal snap lerp
        const lerpSpeed = isHoverTransition.current ? 0.25 : SNAP_LERP;

        if (targetAnchor.current) {
          const dx = targetAnchor.current.x - mouse.current.x;
          const dy = targetAnchor.current.y - mouse.current.y;
          const distance = Math.hypot(dx, dy);

          mouse.current.x += dx * lerpSpeed;
          mouse.current.y += dy * lerpSpeed;

          // Once we're close enough, mark transition as complete
          if (isHoverTransition.current && distance < 2) {
            isHoverTransition.current = false;
          }
        }

        // Spring force pulling back to center
        const forceX = -springOffset.current.x * SPRING_STRENGTH;
        const forceY = -springOffset.current.y * SPRING_STRENGTH;

        springVelocity.current.x += forceX;
        springVelocity.current.y += forceY;

        // Apply damping
        springVelocity.current.x *= SPRING_DAMPING;
        springVelocity.current.y *= SPRING_DAMPING;

        // Integrate position
        springOffset.current.x += springVelocity.current.x;
        springOffset.current.y += springVelocity.current.y;

        pos.current.x = mouse.current.x + springOffset.current.x;
        pos.current.y = mouse.current.y + springOffset.current.y;
      } else if (releasing.current) {
        // Freeze anchor while releasing
        mouse.current.x = pos.current.x;
        mouse.current.y = pos.current.y;

        // Animate toward real cursor
        pos.current.x += (actualMouse.current.x - pos.current.x) * LERP;
        pos.current.y += (actualMouse.current.y - pos.current.y) * LERP;

        const dx = actualMouse.current.x - pos.current.x;
        const dy = actualMouse.current.y - pos.current.y;

        if (Math.hypot(dx, dy) < 0.5) {
          releasing.current = false;
        }
      } else {
        // Fully free → hard follow cursor
        pos.current.x = actualMouse.current.x;
        pos.current.y = actualMouse.current.y;
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

      // Animate scale based on active state
      const targetBoxScale = isActive.current ? CLICK_SCALE : 1.0;
      const targetDotScale = isActive.current ? CLICK_SCALE : 1.0;
      boxScale.current += (targetBoxScale - boxScale.current) * SCALE_LERP;
      dotScale.current += (targetDotScale - dotScale.current) * SCALE_LERP;

      // Draw box cursor
      const vertical = isCloserToVerticalRotation(targetRotation.current);

      const drawWidth = vertical
        ? cursorSize.current.height
        : cursorSize.current.width;

      const drawHeight = vertical
        ? cursorSize.current.width
        : cursorSize.current.height;

      drawBox(
        ctx,
        pos.current.x,
        pos.current.y,
        drawWidth,
        drawHeight,
        rotation.current,
        boxScale.current
      );

      // Draw dot cursor (always follows actual mouse)
      drawDot(
        ctx,
        actualMouse.current.x,
        actualMouse.current.y,
        dotScale.current
      );

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
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
        mixBlendMode: "difference",
      }}
    />
  );
}
