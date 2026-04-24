"use client";
import { useEffect, useState } from "react";

export function usePointerCapable(): boolean {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    setCapable(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCapable(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return capable;
}
