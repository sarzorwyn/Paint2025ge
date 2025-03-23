// Class written by @franklinjavier

import { useState, useCallback, useEffect } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface UseMouseOptions {
  resetOnExit?: boolean;
}

export function useMouse<T extends HTMLElement = HTMLElement>(
  options: UseMouseOptions = {}
) {
  const { resetOnExit = false } = options;
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [element, setElement] = useState<T | null>(null);

  // Callback ref to capture the element (if provided)
  const tooltipRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  // Handle mouse movement using native MouseEvent
  const handleMouseMove = useCallback((event: Event) => {
    const mouseEvent = event as MouseEvent;
    if (element) {
      const rect = element.getBoundingClientRect();
      // Calculate coordinates relative to the element
      const x = Math.max(0, Math.round(mouseEvent.clientX - rect.left));
      const y = Math.max(0, Math.round(mouseEvent.clientY - rect.top));
      setPosition({ x, y });
    } else {
      // Fallback: use client coordinates when no element is provided
      setPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    }
  }, [element]);

  // Optionally reset mouse position on leaving the element
  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    // If no element is provided, default to document for global tracking
    const target: HTMLElement | Document = element || document;
    target.addEventListener("mousemove", handleMouseMove);
    if (resetOnExit) {
      target.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
      if (resetOnExit) {
        target.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [element, handleMouseMove, handleMouseLeave, resetOnExit]);

  return { tooltipRef, ...position };
}