import { useState, useEffect } from 'react';

export interface ResponsiveInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  recommendedSpatialMode: '3d' | 'canvas2d' | 'simplified';
}

export function useResponsive(): ResponsiveInfo {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  let recommendedSpatialMode: '3d' | 'canvas2d' | 'simplified' = '3d';
  if (isMobile) {
    recommendedSpatialMode = 'canvas2d';
  } else if (isTablet) {
    recommendedSpatialMode = '3d';
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    width: windowSize.width,
    height: windowSize.height,
    recommendedSpatialMode
  };
}
