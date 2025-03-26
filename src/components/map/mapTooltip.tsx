"use client"

import { getHoverDesc } from "@/handler/mapHandlers";
import { getHoverColor } from "@/handler/partyColorHandlers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
interface MousePosition {
    x: number;
    y: number;
  }

const MapTooltip = ({
  hoverId,
  selectedParty,
  partyAreas,
  tooltipRef
}: {
  hoverId: string | null;
  selectedParty: string | null;
  partyAreas: Map<string, string | null>;
  tooltipRef: React.RefObject<HTMLElement | null>;
}) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });



  useEffect(() => {
    const handleMouseMove = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        if (tooltipRef.current) {
          const rect = tooltipRef.current.getBoundingClientRect();
          // Calculate coordinates relative to the element
          const x = Math.max(0, Math.round(mouseEvent.clientX - rect.left));
          const y = Math.max(0, Math.round(mouseEvent.clientY - rect.top));
          setPosition({ x, y });  
        } 
      };
  // Optionally reset mouse position on leaving the element
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

    const target: HTMLElement = tooltipRef.current! ;
    target.addEventListener("mousemove", handleMouseMove);
    target.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
    target.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tooltipRef]); // Removed elementRef as a dependency

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: position.x + 12, y: position.y }}
      transition={{ type: "spring", stiffness: 2000000, damping: 2000000 }}
      className={`absolute pointer-events-none bg-white p-1 px-2 rounded border-l-5 shadow-md ${hoverId == null && 'hidden'} ${getHoverColor(selectedParty, hoverId, partyAreas)}`}
    >
      <div >
        {getHoverDesc(hoverId)}
      </div>
    </motion.div>
);
};

export default MapTooltip;
