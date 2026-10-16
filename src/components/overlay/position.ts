import type { NsPlacement } from './types'

export interface PositionResult {
  left: number
  top: number
  placement: NsPlacement
}

export function getOverlayPosition(
  anchor: DOMRect,
  overlay: { width: number; height: number },
  placement: NsPlacement,
  offset: number,
  viewport = { width: window.innerWidth, height: window.innerHeight },
): PositionResult {
  const [side, align = 'center'] = placement.split('-') as [string, string?]
  const gap = offset
  const preferred = calculate(anchor, overlay, side, align, gap)
  const flippedSide = side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left'
  const fits = (point: { left: number; top: number }) =>
    point.left >= 8 && point.top >= 8 && point.left + overlay.width <= viewport.width - 8 && point.top + overlay.height <= viewport.height - 8
  if (fits(preferred)) return { ...preferred, placement }
  const flipped = calculate(anchor, overlay, flippedSide, align, gap)
  const actualPlacement = `${flippedSide}${align === 'center' ? '' : `-${align}`}` as NsPlacement
  const chosen = fits(flipped) ? flipped : preferred
  return {
    left: Math.max(8, Math.min(chosen.left, viewport.width - overlay.width - 8)),
    top: Math.max(8, Math.min(chosen.top, viewport.height - overlay.height - 8)),
    placement: fits(flipped) ? actualPlacement : placement,
  }
}

function calculate(anchor: DOMRect, overlay: { width: number; height: number }, side: string, align: string, gap: number) {
  let left = anchor.left + (anchor.width - overlay.width) / 2
  let top = anchor.top + (anchor.height - overlay.height) / 2
  if (side === 'top' || side === 'bottom') {
    top = side === 'top' ? anchor.top - overlay.height - gap : anchor.bottom + gap
    left = align === 'start' ? anchor.left : align === 'end' ? anchor.right - overlay.width : left
  } else {
    left = side === 'left' ? anchor.left - overlay.width - gap : anchor.right + gap
    top = align === 'start' ? anchor.top : align === 'end' ? anchor.bottom - overlay.height : top
  }
  return { left, top }
}
