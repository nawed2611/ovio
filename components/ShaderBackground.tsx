"use client"

import type React from "react"

import { useRef } from "react"
import { GrainGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate three random HSL colors for the gradient
  const randomColors = Array.from({ length: 3 }, () => {
    const h = Math.floor(Math.random() * 360)
    const s = Math.floor(Math.random() * 41) + 60 // 60% - 100%
    const l = Math.floor(Math.random() * 41) + 40 // 40% - 80%
    return `hsl(${h}, ${s}%, ${l}%)`
  })

  return (
    <div ref={containerRef} className="min-h-screen ">
      <div className="absolute inset-0 -z-10">
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack="hsl(0, 0%, 0%)"
          softness={Math.random() * 0.3 + 0.65} 
          intensity={Math.random() * 0.3 + 0.35} 
          noise={0}
          shape={"ripple"}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={randomColors}
        />
      </div>
      {children}
    </div>
  )
}
