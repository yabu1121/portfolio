'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react"

type FadeInSectionProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  animation?: string
  threshold?: number
}

const FadeInSection = ({
  children,
  className = "",
  delay = 0,
  duration = 900,
  animation = "fadeInUp",
  threshold = 0.2,
}: FadeInSectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const current = ref.current
    if (!current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: "0px",
        threshold,
      },
    )

    observer.observe(current)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`fade-init ${isVisible ? "is-visible" : ""} ${className}`}
      style={{
        "--fade-delay": `${delay}ms`,
        "--fade-duration": `${duration}ms`,
        "--fade-animation": animation,
      } as CSSProperties}
    >
      {children}
    </div>
  )
}

export default FadeInSection