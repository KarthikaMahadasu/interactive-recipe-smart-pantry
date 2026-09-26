import { useState, useCallback, useRef } from 'react';
import type { SpatialVector3, SpatialAnchorId, MotionPathConfig, SpatialMotionState } from '../types/spatial';
import { SPATIAL_ANCHORS } from '../spatial/SpatialAnchor';

export function resolveSpatialPosition(pos: SpatialVector3 | SpatialAnchorId): SpatialVector3 {
  if (typeof pos === 'string') {
    const anchor = SPATIAL_ANCHORS[pos];
    return anchor ? anchor.position : { x: 50, y: 50, z: 0 };
  }
  return pos;
}

export function useSpatialMotion() {
  const [motionState, setMotionState] = useState<SpatialMotionState>({
    isAnimating: false,
    currentPosition: { x: 0, y: 0, z: 0 },
    progress: 0
  });

  const animFrameRef = useRef<number | null>(null);

  const startMotion = useCallback((config: MotionPathConfig) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startPos = resolveSpatialPosition(config.start);
    const destPos = resolveSpatialPosition(config.destination);
    const duration = config.duration || 1200;
    const delay = config.delay || 0;

    setMotionState({
      isAnimating: true,
      currentPosition: startPos,
      progress: 0
    });

    const startTime = performance.now() + delay;

    const animate = (currentTime: number) => {
      if (currentTime < startTime) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1.0, elapsed / duration);

      // Smooth ease-in-out curve
      const easedProgress = rawProgress < 0.5
        ? 2 * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentX = startPos.x + (destPos.x - startPos.x) * easedProgress;
      const currentY = startPos.y + (destPos.y - startPos.y) * easedProgress;
      const currentZ = (startPos.z || 0) + ((destPos.z || 0) - (startPos.z || 0)) * easedProgress;

      setMotionState({
        isAnimating: rawProgress < 1.0,
        currentPosition: { x: currentX, y: currentY, z: currentZ },
        progress: easedProgress
      });

      if (rawProgress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (config.onComplete) {
          config.onComplete();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const stopMotion = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setMotionState((prev) => ({ ...prev, isAnimating: false }));
  }, []);

  return {
    motionState,
    startMotion,
    stopMotion
  };
}
