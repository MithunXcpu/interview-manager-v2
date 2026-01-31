import confetti from "canvas-confetti";
import { useCallback } from "react";

export function useConfetti() {
  const celebrate = useCallback(() => {
    // Fire from the left
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
    });

    // Fire from the right with slight delay
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
      });
    }, 150);
  }, []);

  return { celebrate };
}
