export const SCENE = {
  camera: { fov: 60, z: 62 },
  orbit: {
    radius: 14, tube: 0.08,
    tiltDeg: -15,
    speed: 0.04,
    pulse: { period: 6, amplitude: 0.15 },
  },
  stars: {
    far:  { count: () => (typeof window !== "undefined" && window.innerWidth < 768 ? 600  : 1200), size: 0.7  },
    mid:  { count: () => (typeof window !== "undefined" && window.innerWidth < 768 ? 300  : 600),  size: 1.1  },
    near: { count: () => (typeof window !== "undefined" && window.innerWidth < 768 ? 0    : 200),  size: 1.6  },
  },
  dust:  { count: () => (typeof window !== "undefined" && window.innerWidth < 768 ? 80   : 250) },
  backlight: { opacity: 0.18 },
} as const;
