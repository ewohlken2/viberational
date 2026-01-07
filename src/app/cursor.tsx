import { useEffect, useRef } from "react";

const BASE_SIZE = 30;
const PADDING = 14;
const LERP = 0.15;
const ROTATION_SPEED = 0.5; // deg per frame
const ROTATION_LERP = 0.1; // Smooth rotation interpolation

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const actualMouse = useRef({ x: 0, y: 0 }); // Actual mouse position for dot
  const pos = useRef({ x: 0, y: 0 });
  const rotation = useRef(0);
  const targetRotation = useRef(0);
  const hovering = useRef(false);
  const hoveredElement = useRef<HTMLElement | null>(null);
  const hoveredRect = useRef<DOMRect | null>(null);
  const targetCorner = useRef<Corner | null>(null);

  useEffect(() => {
    // ----------------------------
    // Mouse tracking
    // ----------------------------
    const getClosestCorner = (x: number, y: number, rect: DOMRect): Corner => {
      const corners = {
        "top-left": { x: rect.left, y: rect.top },
        "top-right": { x: rect.right, y: rect.top },
        "bottom-left": { x: rect.left, y: rect.bottom },
        "bottom-right": { x: rect.right, y: rect.bottom },
      };

      let closest: Corner = "top-left";
      let minDistance = Infinity;

      Object.entries(corners).forEach(([corner, pos]) => {
        const distance = Math.sqrt(
          Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closest = corner as Corner;
        }
      });

      return closest;
    };

    const getCornerPosition = (corner: Corner, rect: DOMRect) => {
      const padding = PADDING / 2;
      switch (corner) {
        case "top-left":
          return { x: rect.left - padding, y: rect.top - padding };
        case "top-right":
          return { x: rect.right + padding, y: rect.top - padding };
        case "bottom-left":
          return { x: rect.left - padding, y: rect.bottom + padding };
        case "bottom-right":
          return { x: rect.right + padding, y: rect.bottom + padding };
      }
    };

    const onMove = (e: MouseEvent) => {
      // Always update actual mouse position
      actualMouse.current.x = e.clientX;
      actualMouse.current.y = e.clientY;

      if (!hovering.current) {
        // When not hovering, box center follows mouse
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      } else if (hoveredRect.current) {
        // When hovering, determine closest corner
        const corner = getClosestCorner(
          e.clientX,
          e.clientY,
          hoveredRect.current
        );
        targetCorner.current = corner;
        const cornerPos = getCornerPosition(corner, hoveredRect.current);
        // Set box center to corner position (will be offset in transform)
        mouse.current.x = cornerPos.x;
        mouse.current.y = cornerPos.y;
      }
    };

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

      // Determine initial corner based on mouse position
      const corner = getClosestCorner(mouse.current.x, mouse.current.y, rect);
      targetCorner.current = corner;
      const cornerPos = getCornerPosition(corner, rect);

      console.log("onenter");

      mouse.current.x = cornerPos.x;
      mouse.current.y = cornerPos.y;
      pos.current.x = cornerPos.x;
      pos.current.y = cornerPos.y;

      // Set target rotation to 0 (aligned with element)
      targetRotation.current = 0;

      if (!cursorRef.current) return;

      const newWidth = rect.width + PADDING;
      const newHeight = rect.height + PADDING;
      cursorRef.current.style.width = `${newWidth}px`;
      cursorRef.current.style.height = `${newHeight}px`;
      cursorRef.current.style.borderWidth = "2px";
    };

    const onLeave = () => {
      hovering.current = false;
      hoveredElement.current = null;
      hoveredRect.current = null;
      console.log("onleave");

      targetCorner.current = null;

      if (!cursorRef.current) return;

      cursorRef.current.style.width = `${BASE_SIZE}px`;
      cursorRef.current.style.height = `${BASE_SIZE}px`;
      cursorRef.current.style.borderWidth = "2px";
    };

    const targets = document.querySelectorAll<HTMLElement>("[data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // ----------------------------
    // Animation loop
    // ----------------------------
    const animate = () => {
      // Update hovered rect if element still exists
      if (hovering.current && hoveredElement.current) {
        hoveredRect.current = hoveredElement.current.getBoundingClientRect();
      }

      // Handle position - when not hovering, box center should be exactly at mouse
      if (!hovering.current) {
        pos.current.x = actualMouse.current.x;
        pos.current.y = actualMouse.current.y;
      } else {
        // When hovering, lerp towards corner position
        pos.current.x += (mouse.current.x - pos.current.x) * LERP;
        pos.current.y += (mouse.current.y - pos.current.y) * LERP;

        console.log("onlerp");
      }

      // Handle rotation
      if (!hovering.current) {
        // Rotate continuously when not hovering
        rotation.current += ROTATION_SPEED;
        targetRotation.current = rotation.current;
      } else {
        // // Smoothly rotate to 0 degrees (aligned) when hovering
        // console.log("smoothly rotate to 0 degrees");
        // rotation.current +=
        //   (targetRotation.current - rotation.current) * ROTATION_LERP;
      }

      if (cursorRef.current) {
        // Calculate offset based on current cursor size
        const currentWidth = cursorRef.current.offsetWidth || BASE_SIZE;
        const currentHeight = cursorRef.current.offsetHeight || BASE_SIZE;

        // When hovering, position at corner (no offset needed since corner is the target)
        // When not hovering, center the cursor
        let offsetX = currentWidth / 2;
        let offsetY = currentHeight / 2;

        if (hovering.current && targetCorner.current && hoveredRect.current) {
          // Position at the corner based on which corner it is
          const corner = targetCorner.current;
          switch (corner) {
            case "top-left":
              offsetX = 0;
              offsetY = 0;
              break;
            case "top-right":
              offsetX = currentWidth;
              offsetY = 0;
              break;
            case "bottom-left":
              offsetX = 0;
              offsetY = currentHeight;
              break;
            case "bottom-right":
              offsetX = currentWidth;
              offsetY = currentHeight;
              break;
          }
        }

        cursorRef.current.style.transform = `
          translate3d(${pos.current.x - offsetX}px, ${
          pos.current.y - offsetY
        }px, 0)
          rotate(${rotation.current}deg)
        `;
      }

      // Update dot position to always match actual mouse cursor
      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate3d(${actualMouse.current.x}px, ${actualMouse.current.y}px, 0)
        `;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
}
