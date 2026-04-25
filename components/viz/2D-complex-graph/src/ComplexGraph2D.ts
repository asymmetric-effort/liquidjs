// ============================================================================
// LiquidJS — 2D Complex Graph (Canvas-based Mandelbrot / Complex Plane)
// Zero-dependency canvas visualization via createElement calls.
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from '../../../../core/src/index';
import { useState, useRef, useEffect, useCallback } from '../../../../core/src/hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComplexPointInfo {
  re: number;
  im: number;
  iterations: number;
  event: Event;
}

export interface ComplexGraph2DProps {
  width?: number;
  height?: number;
  realRange?: [number, number];
  imagRange?: [number, number];
  maxIterations?: number;
  colorScheme?: 'classic' | 'fire' | 'ocean';
  computeFunction?: (re: number, im: number, maxIter: number) => number;
  onPointClick?: (info: ComplexPointInfo) => void;
  onPointHover?: (info: ComplexPointInfo) => void;
  onPointDoubleClick?: (info: ComplexPointInfo) => void;
  onPointContextMenu?: (info: ComplexPointInfo) => void;
}

// ---------------------------------------------------------------------------
// Default compute: Mandelbrot z = z^2 + c
// ---------------------------------------------------------------------------

function mandelbrot(cRe: number, cIm: number, maxIter: number): number {
  let zRe = 0, zIm = 0;
  for (let i = 0; i < maxIter; i++) {
    const zRe2 = zRe * zRe, zIm2 = zIm * zIm;
    if (zRe2 + zIm2 > 4) return i;
    zIm = 2 * zRe * zIm + cIm;
    zRe = zRe2 - zIm2 + cRe;
  }
  return maxIter;
}

// ---------------------------------------------------------------------------
// Color mapping helpers
// ---------------------------------------------------------------------------

function iterToColor(iter: number, maxIter: number, scheme: string): [number, number, number] {
  if (iter === maxIter) return [0, 0, 0];
  const t = iter / maxIter;
  if (scheme === 'fire') {
    return [Math.floor(255 * Math.min(1, t * 3)), Math.floor(255 * Math.max(0, t * 3 - 1)), Math.floor(255 * Math.max(0, t * 3 - 2))];
  }
  if (scheme === 'ocean') {
    return [Math.floor(255 * t * 0.3), Math.floor(255 * t * 0.6), Math.floor(255 * (0.4 + t * 0.6))];
  }
  // classic: HSL-based
  const h = (t * 360) % 360;
  const s = 1, l = 0.5;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.floor((r + m) * 255), Math.floor((g + m) * 255), Math.floor((b + m) * 255)];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ComplexGraph2D(props: ComplexGraph2DProps) {
  const {
    width = 400,
    height = 300,
    realRange: initReal = [-2.5, 1] as [number, number],
    imagRange: initImag = [-1.25, 1.25] as [number, number],
    maxIterations = 100,
    colorScheme = 'classic',
    computeFunction = mandelbrot,
    onPointClick,
    onPointHover,
    onPointDoubleClick,
    onPointContextMenu,
  } = props;

  const [realMin, setRealMin] = useState(initReal[0]);
  const [realMax, setRealMax] = useState(initReal[1]);
  const [imagMin, setImagMin] = useState(initImag[0]);
  const [imagMax, setImagMax] = useState(initImag[1]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number; rMin: number; rMax: number; iMin: number; iMax: number } | null>(null);

  // Map pixel to complex number
  const pxToComplex = useCallback((px: number, py: number) => {
    const re = realMin + (px / width) * (realMax - realMin);
    const im = imagMax - (py / height) * (imagMax - imagMin);
    return { re, im };
  }, [realMin, realMax, imagMin, imagMax, width, height]);

  // Render the fractal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const { re, im } = pxToComplex(px, py);
        const iter = computeFunction(re, im, maxIterations);
        const [r, g, b] = iterToColor(iter, maxIterations, colorScheme);
        const idx = (py * width + px) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [realMin, realMax, imagMin, imagMax, width, height, maxIterations, colorScheme, computeFunction, pxToComplex]);

  const getPointInfo = useCallback((e: MouseEvent): ComplexPointInfo => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const { re, im } = pxToComplex(px, py);
    const iterations = computeFunction(re, im, maxIterations);
    return { re, im, iterations, event: e };
  }, [pxToComplex, computeFunction, maxIterations]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, rMin: realMin, rMax: realMax, iMin: imagMin, iMax: imagMax };
  }, [realMin, realMax, imagMin, imagMax]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (onPointHover) onPointHover(getPointInfo(e));
    if (!dragging.current || !dragStart.current) return;
    const ds = dragStart.current;
    const dx = e.clientX - ds.x, dy = e.clientY - ds.y;
    const rePerPx = (ds.rMax - ds.rMin) / width;
    const imPerPx = (ds.iMax - ds.iMin) / height;
    setRealMin(ds.rMin - dx * rePerPx);
    setRealMax(ds.rMax - dx * rePerPx);
    setImagMin(ds.iMin + dy * imPerPx);
    setImagMax(ds.iMax + dy * imPerPx);
  }, [width, height, onPointHover, getPointInfo]);

  const handleMouseUp = useCallback(() => { dragging.current = false; }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const { re, im } = pxToComplex(px, py);
    setRealMin(re + (realMin - re) * factor);
    setRealMax(re + (realMax - re) * factor);
    setImagMin(im + (imagMin - im) * factor);
    setImagMax(im + (imagMax - im) * factor);
  }, [pxToComplex, realMin, realMax, imagMin, imagMax]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (onPointClick) onPointClick(getPointInfo(e));
  }, [onPointClick, getPointInfo]);

  const handleDblClick = useCallback((e: MouseEvent) => {
    if (onPointDoubleClick) onPointDoubleClick(getPointInfo(e));
  }, [onPointDoubleClick, getPointInfo]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (onPointContextMenu) onPointContextMenu(getPointInfo(e));
  }, [onPointContextMenu, getPointInfo]);

  return createElement('canvas', {
    ref: canvasRef,
    width,
    height,
    style: { cursor: 'crosshair' },
    onmousedown: handleMouseDown,
    onmousemove: handleMouseMove,
    onmouseup: handleMouseUp,
    onmouseleave: handleMouseUp,
    onwheel: handleWheel,
    onclick: handleClick,
    ondblclick: handleDblClick,
    oncontextmenu: handleContextMenu,
  });
}
