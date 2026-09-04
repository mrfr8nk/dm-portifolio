export const motionDuration = {
  fast: 0.18,
  normal: 0.32,
  section: 0.62,
} as const;

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const revealViewport = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -8% 0px",
} as const;

export const revealTransition = {
  duration: motionDuration.section,
  ease: motionEase,
} as const;