import React, { useEffect, useRef } from 'react';

export const CyberCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let hasMoved = false;
    let isMouseDown = false;
    let isHovering = false;
    let animFrameId: number;

    const handlePointerCoord = (clientX: number, clientY: number, target: EventTarget | null) => {
      if (typeof clientX !== 'number' || isNaN(clientX)) return;

      targetX = clientX;
      targetY = clientY;

      if (!hasMoved) {
        hasMoved = true;
        currentX = targetX;
        currentY = targetY;
      }

      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }

      // Direct zero-latency hardware tracking for the center pinpoint
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      // Hover check without exceptions
      try {
        const el = target as Element | null;
        if (el && typeof el.closest === 'function') {
          isHovering = el.closest('button, a, [role="button"], input, select, textarea, .cursor-pointer') !== null;
        } else {
          isHovering = false;
        }
      } catch {
        isHovering = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      handlePointerCoord(e.clientX, e.clientY, e.target);
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerCoord(e.clientX, e.clientY, e.target);
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseLeave = (e: MouseEvent) => {
      // Only hide if the cursor truly exited the viewport
      if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        if (containerRef.current) {
          containerRef.current.style.opacity = '0';
        }
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      handlePointerCoord(e.clientX, e.clientY, e.target);
    };

    // Listen on both window and document with capture to guarantee capture of all movement
    window.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true, capture: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true, capture: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true, capture: true });

    window.addEventListener('mousedown', onMouseDown, { passive: true, capture: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true, capture: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    // High performance RAF loop for the spring reticle
    const renderLoop = () => {
      if (hasMoved) {
        // Outer golden cyber reticle lerps smoothly with spring
        const lerpFactor = 0.42;
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        if (ringRef.current) {
          const scale = isMouseDown ? 0.82 : isHovering ? 1.25 : 1.0;
          ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('pointermove', onPointerMove, true);
      document.removeEventListener('mousemove', onMouseMove, true);

      window.removeEventListener('mousedown', onMouseDown, true);
      window.removeEventListener('mouseup', onMouseUp, true);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ opacity: 0, transition: 'opacity 0.15s ease-out' }}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
    >
      {/* Outer Golden Cyber Reticle Brackets */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 will-change-transform transition-transform duration-100 ease-out"
      >
        <svg
          className="stroke-[#c5a880] drop-shadow-[0_0_6px_rgba(197,168,128,0.5)]"
          width="46"
          height="46"
          viewBox="0 0 48 48"
          fill="none"
        >
          {/* Subtle Outer Target Brackets in Champagne Gold */}
          <path
            d="M 14 8 L 8 8 L 8 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="opacity-90"
          />
          <path
            d="M 34 8 L 40 8 L 40 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="opacity-90"
          />
          <path
            d="M 8 34 L 8 40 L 14 40"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="opacity-90"
          />
          <path
            d="M 40 34 L 40 40 L 34 40"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Center Crosshair Tick Marks */}
          <line x1="24" y1="16" x2="24" y2="19.5" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
          <line x1="24" y1="28.5" x2="24" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
          <line x1="16" y1="24" x2="19.5" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
          <line x1="28.5" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
        </svg>
      </div>

      {/* Pinpoint Precision Golden Laser Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 will-change-transform"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-white/80 shadow-[0_0_10px_rgba(212,175,55,0.95),0_0_3px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
};
