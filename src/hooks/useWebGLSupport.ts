import { useEffect, useState } from 'react';

export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(detectWebGL());
  }, []);
  return supported;
}
