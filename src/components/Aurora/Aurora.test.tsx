import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '@/styles/themes'
import { Aurora, paint } from './Aurora'

describe('Aurora', () => {
  it('renders a decorative canvas that assistive tech skips', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <Aurora />
      </ThemeProvider>,
    )
    const canvas = screen.getByTestId('aurora')
    expect(canvas.tagName).toBe('CANVAS')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })

  it('paints one orb per brand stop over a ground of the first', () => {
    const gradients: string[][] = []
    const ctx = {
      globalCompositeOperation: '',
      fillStyle: '',
      fillRect: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: (_: number, color: string) => gradients.at(-1)?.push(color),
      })),
    } as unknown as CanvasRenderingContext2D
    ;(ctx.createRadialGradient as ReturnType<typeof vi.fn>).mockImplementation(() => {
      gradients.push([])
      return { addColorStop: (_: number, color: string) => gradients.at(-1)?.push(color) }
    })

    const stops = darkTheme.gradient.stops
    paint(ctx, 200, 300, stops, 12, { x: 0, y: 0 })

    expect(gradients).toHaveLength(stops.length)
    expect(gradients.map((g) => g[0])).toEqual(stops)
    // The ground fill plus one rect per orb.
    expect(ctx.fillRect).toHaveBeenCalledTimes(stops.length + 1)
  })
})
