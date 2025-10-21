"use client";
import { useEffect, useState, useRef } from "react";

export function useScrollTrigger(threshold = 200) {
  const [triggered, setTriggered] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;
      requestAnimationFrame(() => {
        setTriggered(window.scrollY >= threshold);
        ticking.current = false;
      });
    };

    // run once in case we're already scrolled
    onScroll();
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return triggered;
}
