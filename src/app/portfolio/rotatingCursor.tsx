import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PAGE_TRANSITION_DURATION } from "../transition-config";

// ============================================================================
// Configuration Constants
// ============================================================================
const CONFIG = {
  // Sizing
  BASE_SIZE: 30,
  PADDING: 3,
  DOT_SIZE: 4,
  BORDER_WIDTH: 2,
  CORNER_GAP: 8,

  // Colors
  BORDER_COLOR: "#ffffff",
  DOT_COLOR: "#ffffff",

  // Animation speeds
  LERP: 0.15,
  ROTATION_SPEED: 0.18, // deg per frame
  ROTATION_LERP: 0.18,
  SCALE_LERP: 0.06,

  // Spring physics
  SPRING_STRENGTH: 0.075,
  SPRING_DAMPING: 0.55,
  VELOCITY_INFLUENCE: 0.7,

  // Hover behavior
  SNAP_LERP: 0.9,
  INITIAL_HOVER_LERP: 0.15, // Match size animation speed for smooth growth from entry point
  SPRING_RESET_ON_HOVER: 0.2,

  // Click animations
  BOX_CLICK_SCALE: 0.85,
  DOT_CLICK_SCALE: 0.55,

  // Thresholds
  HOVER_TRANSITION_THRESHOLD: 2,
  RELEASE_THRESHOLD: 0.5,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================
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

const snapToRightAngle = (deg: number) => Math.round(deg / 90) * 90;

const getCenterPosition = (rect: DOMRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

const lerp = (current: number, target: number, factor: number) =>
  current + (target - current) * factor;

const resolveCursorElement = (node: EventTarget | null) => {
  if (!(node instanceof HTMLElement)) return null;
  return node.closest<HTMLElement>("[data-cursor]");
};

const resolveAnchorElement = (node: EventTarget | null) => {
  if (!(node instanceof HTMLElement)) return null;
  return node.closest<HTMLAnchorElement>("a[href]");
};

export function shouldHandleCursorEnter({
  target,
  hoveredElement,
}: {
  target: EventTarget | null;
  hoveredElement: HTMLElement | null;
}) {
  const enteredCursorEl = resolveCursorElement(target);
  if (!enteredCursorEl) return false;
  return enteredCursorEl !== hoveredElement;
}

export function shouldHandleCursorLeave({
  target,
  relatedTarget,
  hoveredElement,
}: {
  target: EventTarget | null;
  relatedTarget: EventTarget | null;
  hoveredElement: HTMLElement | null;
}) {
  const leftCursorEl = resolveCursorElement(target);
  if (!leftCursorEl || hoveredElement !== leftCursorEl) return false;

  const nextCursorEl = resolveCursorElement(relatedTarget);
  return nextCursorEl !== hoveredElement;
}

export function shouldReleaseCursorOnNavigationClick({
  target,
  currentPathname,
}: {
  target: EventTarget | null;
  currentPathname: string;
}) {
  if (typeof window === "undefined") return false;

  const anchor = resolveAnchorElement(target);
  if (!anchor) return false;
  if (anchor.hasAttribute("data-cursor-persist")) return false;
  if (anchor.hasAttribute("download")) return false;

  const targetAttr = (anchor.getAttribute("target") || "").toLowerCase();
  if (targetAttr && targetAttr !== "_self") return false;

  const hrefAttr = anchor.getAttribute("href");
  if (!hrefAttr || hrefAttr.startsWith("#")) return false;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const isSameOrigin = url.origin === window.location.origin;
  if (
    isSameOrigin &&
    url.pathname === currentPathname &&
    url.search === window.location.search
  ) {
    return false;
  }

  return true;
}

// ============================================================================
// Drawing Functions
// ============================================================================
const drawBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  scale: number = 1.0,
) => {
  ctx.save();

  const offsetX = width / 2;
  const offsetY = height / 2;

  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-offsetX, -offsetY);

  ctx.strokeStyle = CONFIG.BORDER_COLOR;
  ctx.lineWidth = CONFIG.BORDER_WIDTH;
  ctx.beginPath();

  // Draw corner segments only
  const gap = CONFIG.CORNER_GAP;

  // Top-left corner
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.min(gap, width), 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, Math.min(gap, height));

  // Top-right corner
  ctx.moveTo(Math.max(0, width - gap), 0);
  ctx.lineTo(width, 0);
  ctx.moveTo(width, 0);
  ctx.lineTo(width, Math.min(gap, height));

  // Bottom-left corner
  ctx.moveTo(0, Math.max(0, height - gap));
  ctx.lineTo(0, height);
  ctx.moveTo(0, height);
  ctx.lineTo(Math.min(gap, width), height);

  // Bottom-right corner
  ctx.moveTo(Math.max(0, width - gap), height);
  ctx.lineTo(width, height);
  ctx.moveTo(width, Math.max(0, height - gap));
  ctx.lineTo(width, height);

  ctx.stroke();
  ctx.restore();
};

const drawDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1.0,
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = CONFIG.DOT_COLOR;
  ctx.beginPath();
  ctx.arc(0, 0, CONFIG.DOT_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// ============================================================================
// Spring Physics
// ============================================================================
class SpringPhysics {
  offset = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };

  update(anchor: { x: number; y: number }, mousePos: { x: number; y: number }) {
    // Spring force pulling back to anchor
    const forceX = -this.offset.x * CONFIG.SPRING_STRENGTH;
    const forceY = -this.offset.y * CONFIG.SPRING_STRENGTH;

    this.velocity.x += forceX;
    this.velocity.y += forceY;

    // Apply damping
    this.velocity.x *= CONFIG.SPRING_DAMPING;
    this.velocity.y *= CONFIG.SPRING_DAMPING;

    // Integrate position
    this.offset.x += this.velocity.x;
    this.offset.y += this.velocity.y;

    return {
      x: anchor.x + this.offset.x,
      y: anchor.y + this.offset.y,
    };
  }

  injectVelocity(deltaX: number, deltaY: number) {
    this.velocity.x += deltaX * CONFIG.VELOCITY_INFLUENCE;
    this.velocity.y += deltaY * CONFIG.VELOCITY_INFLUENCE;
  }

  reset() {
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
  }

  dampen(factor: number = CONFIG.SPRING_RESET_ON_HOVER) {
    this.offset.x *= factor;
    this.offset.y *= factor;
    this.velocity.x *= factor;
    this.velocity.y *= factor;
  }
}

// ============================================================================
// Cursor State
// ============================================================================
type CursorState = "free" | "hovering" | "releasing";

interface CursorData {
  // Position tracking
  mouse: { x: number; y: number };
  actualMouse: { x: number; y: number };
  prevMouse: { x: number; y: number };
  position: { x: number; y: number };

  // State
  state: CursorState;
  isActive: boolean;
  isHoverTransition: boolean;

  // Hover target
  hoveredElement: HTMLElement | null;
  hoveredRect: DOMRect | null;
  targetAnchor: { x: number; y: number } | null;

  // Animation
  rotation: number;
  targetRotation: number;
  cursorSize: { width: number; height: number };
  boxScale: number;
  dotScale: number;

  // Physics
  spring: SpringPhysics;
  navigationGuardUntil: number;
}

// ============================================================================
// Main Component
// ============================================================================
export default function RotatingCursor() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<CursorData>({
    mouse: { x: 0, y: 0 },
    actualMouse: { x: 0, y: 0 },
    prevMouse: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    state: "free",
    isActive: false,
    isHoverTransition: false,
    hoveredElement: null,
    hoveredRect: null,
    targetAnchor: null,
    rotation: 0,
    targetRotation: 0,
    cursorSize: { width: CONFIG.BASE_SIZE, height: CONFIG.BASE_SIZE },
    boxScale: 1.0,
    dotScale: 1.0,
    spring: new SpringPhysics(),
    navigationGuardUntil: 0,
  });

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const data = dataRef.current;

    // ========================================================================
    // Canvas Setup
    // ========================================================================
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number | null = null;

    const releaseHoverState = () => {
      data.state = "free";
      data.isHoverTransition = false;
      data.spring.reset();
      data.hoveredElement = null;
      data.hoveredRect = null;
      data.targetAnchor = null;
      data.mouse.x = data.actualMouse.x;
      data.mouse.y = data.actualMouse.y;
      data.position.x = data.actualMouse.x;
      data.position.y = data.actualMouse.y;
    };

    // ========================================================================
    // Mouse Event Handlers
    // ========================================================================
    const initMousePos = (e: MouseEvent) => {
      data.prevMouse.x = e.clientX;
      data.prevMouse.y = e.clientY;
      data.actualMouse.x = e.clientX;
      data.actualMouse.y = e.clientY;
      window.removeEventListener("mousemove", initMousePos);
    };
    window.addEventListener("mousemove", initMousePos);

    const onMove = (e: MouseEvent) => {
      const deltaX = e.clientX - data.prevMouse.x;
      const deltaY = e.clientY - data.prevMouse.y;

      data.actualMouse.x = e.clientX;
      data.actualMouse.y = e.clientY;

      // Update box position when free
      if (data.state === "free") {
        data.mouse.x = e.clientX;
        data.mouse.y = e.clientY;
      }

      // Inject velocity into spring when hovering
      if (data.state === "hovering") {
        data.spring.injectVelocity(deltaX, deltaY);
      }

      data.prevMouse.x = e.clientX;
      data.prevMouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const onMouseDown = () => {
      data.isActive = true;
    };
    const onMouseUp = () => {
      data.isActive = false;
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // ========================================================================
    // Hover Event Handlers (using event delegation for dynamic elements)
    // ========================================================================
    const onEnter = (e: MouseEvent) => {
      if (performance.now() < data.navigationGuardUntil) {
        return;
      }

      if (
        !shouldHandleCursorEnter({
          target: e.target,
          hoveredElement: data.hoveredElement,
        })
      ) {
        return;
      }

      const el = resolveCursorElement(e.target);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerPos = getCenterPosition(rect);

      // Handle transition from another hovered element
      if (data.state === "hovering") {
        data.spring.dampen();
      } else {
        data.spring.reset();
      }

      data.state = "hovering";
      data.hoveredElement = el;
      data.hoveredRect = rect;
      data.targetAnchor = { x: centerPos.x, y: centerPos.y };
      data.isHoverTransition = true;
      data.targetRotation = snapToRightAngle(data.rotation);
    };

    const onLeave = (e: MouseEvent) => {
      if (
        !shouldHandleCursorLeave({
          target: e.target,
          relatedTarget: e.relatedTarget,
          hoveredElement: data.hoveredElement,
        })
      ) {
        return;
      }

      data.state = "releasing";
      data.isHoverTransition = false;
      data.spring.reset();
      data.hoveredElement = null;
      data.hoveredRect = null;
      data.targetAnchor = null;
    };

    const onDocumentClickCapture = (e: MouseEvent) => {
      if (
        !shouldReleaseCursorOnNavigationClick({
          target: e.target,
          currentPathname: pathnameRef.current,
        })
      ) {
        return;
      }

      releaseHoverState();
      data.navigationGuardUntil =
        performance.now() + PAGE_TRANSITION_DURATION * 1000;
    };

    // Use event delegation on document to catch dynamically added elements
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("click", onDocumentClickCapture, true);

    // ========================================================================
    // Animation Loop
    // ========================================================================
    const updateSize = () => {
      const targetWidth =
        data.state === "hovering" && data.hoveredRect
          ? data.hoveredRect.width + CONFIG.PADDING
          : CONFIG.BASE_SIZE;
      const targetHeight =
        data.state === "hovering" && data.hoveredRect
          ? data.hoveredRect.height + CONFIG.PADDING
          : CONFIG.BASE_SIZE;

      data.cursorSize.width = lerp(
        data.cursorSize.width,
        targetWidth,
        CONFIG.LERP,
      );
      data.cursorSize.height = lerp(
        data.cursorSize.height,
        targetHeight,
        CONFIG.LERP,
      );
    };

    const updatePosition = () => {
      if (data.state === "hovering" && data.hoveredRect && data.targetAnchor) {
        // Update hovered rect if element still exists
        if (data.hoveredElement) {
          data.hoveredRect = data.hoveredElement.getBoundingClientRect();
          const center = getCenterPosition(data.hoveredRect);
          data.targetAnchor = { x: center.x, y: center.y };
        }

        // Smoothly animate anchor to target position
        const lerpSpeed = data.isHoverTransition
          ? CONFIG.INITIAL_HOVER_LERP
          : CONFIG.SNAP_LERP;

        const dx = data.targetAnchor.x - data.mouse.x;
        const dy = data.targetAnchor.y - data.mouse.y;
        const distance = Math.hypot(dx, dy);

        data.mouse.x = lerp(data.mouse.x, data.targetAnchor.x, lerpSpeed);
        data.mouse.y = lerp(data.mouse.y, data.targetAnchor.y, lerpSpeed);

        if (
          data.isHoverTransition &&
          distance < CONFIG.HOVER_TRANSITION_THRESHOLD
        ) {
          data.isHoverTransition = false;
        }

        // Apply spring physics
        const springPos = data.spring.update(data.mouse, data.actualMouse);
        data.position = springPos;
      } else if (data.state === "releasing") {
        // Freeze anchor while releasing
        data.mouse.x = data.position.x;
        data.mouse.y = data.position.y;

        // Animate toward real cursor
        data.position.x = lerp(
          data.position.x,
          data.actualMouse.x,
          CONFIG.LERP,
        );
        data.position.y = lerp(
          data.position.y,
          data.actualMouse.y,
          CONFIG.LERP,
        );

        const dx = data.actualMouse.x - data.position.x;
        const dy = data.actualMouse.y - data.position.y;

        if (Math.hypot(dx, dy) < CONFIG.RELEASE_THRESHOLD) {
          data.state = "free";
        }
      } else {
        // Free state - follow cursor directly
        data.position.x = data.actualMouse.x;
        data.position.y = data.actualMouse.y;
      }
    };

    const updateRotation = () => {
      if (data.state === "free") {
        data.rotation = (data.rotation + CONFIG.ROTATION_SPEED) % 360;
        data.targetRotation = data.rotation;
      } else {
        data.rotation = lerp(
          data.rotation,
          data.targetRotation,
          CONFIG.ROTATION_LERP,
        );
      }
    };

    const updateScale = () => {
      const targetBoxScale = data.isActive ? CONFIG.BOX_CLICK_SCALE : 1.0;
      const targetDotScale = data.isActive ? CONFIG.DOT_CLICK_SCALE : 1.0;

      data.boxScale = lerp(data.boxScale, targetBoxScale, CONFIG.SCALE_LERP);
      data.dotScale = lerp(data.dotScale, targetDotScale, CONFIG.SCALE_LERP);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine dimensions based on rotation
      const vertical = isCloserToVerticalRotation(data.targetRotation);
      const drawWidth = vertical
        ? data.cursorSize.height
        : data.cursorSize.width;
      const drawHeight = vertical
        ? data.cursorSize.width
        : data.cursorSize.height;

      // Draw box cursor
      drawBox(
        ctx,
        data.position.x,
        data.position.y,
        drawWidth,
        drawHeight,
        data.rotation,
        data.boxScale,
      );

      // Draw dot cursor (always follows actual mouse)
      drawDot(ctx, data.actualMouse.x, data.actualMouse.y, data.dotScale);
    };

    const animate = () => {
      updateSize();
      updatePosition();
      updateRotation();
      updateScale();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ========================================================================
    // Cleanup
    // ========================================================================
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", initMousePos);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("click", onDocumentClickCapture, true);
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
        zIndex: 99999,
        mixBlendMode: "difference",
      }}
    />
  );
}
