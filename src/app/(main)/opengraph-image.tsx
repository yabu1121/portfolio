import { renderOg, OG_SIZE } from '@/app/og/render'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'hayato'

/* 組み立ては src/app/og/render.tsx に 1 つだけ置いてある */
export default function Image() {
  return renderOg({ title: 'hayato', mascot: 'public/mascot/og-wave.png' })
}
