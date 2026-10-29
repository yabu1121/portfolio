import { renderOg, OG_SIZE } from '@/app/og/render'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = '経歴とスキル'

/* 組み立ては src/app/og/render.tsx に 1 つだけ置いてある */
export default function Image() {
  return renderOg({ title: '経歴とスキル', mascot: 'public/mascot/og-guide.png' })
}
