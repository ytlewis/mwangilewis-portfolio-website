'use client'

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/contexts/ThemeContext'
import { defaultTheme } from '@/lib/theme'
import { 
  getOptimalAnimationSettings, 
  getOptimalParticleCount,
  PerformanceMonitor,
  throttle 
} from '@/lib/performance'

interface ParticleBackgroundProps {
  intensity?: number
  className?: string
}

interface ParticleSystem {
  geometry: any
  material: any
  points: any
  velocities: Float32Array
}

export function ParticleBackground({ intensity = 1, className = '' }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const scrollYRef = useRef(0)
  const performanceMonitorRef = useRef<PerformanceMonitor | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [THREE, setTHREE] = useState<any>(null)

  // Dynamically import Three.js only on client side
  useEffect(() => {
    import('three').then((module) => {
      setTHREE(module)
      setMounted(true)
    })
  }, [])

  // Get optimal animation settings based on device capabilities
  const animationSettings = useMemo(() => getOptimalAnimationSettings(), [])

  // Performance optimization: reduce particle count based on device capabilities
  const particleCount = useMemo(() => {
    if (typeof window === 'undefined') return defaultTheme.animations.particleCount
    
    const baseCount = defaultTheme.animations.particleCount * intensity
    return getOptimalParticleCount(baseCount)
  }, [intensity])

  // Check if particles should be enabled
  const shouldEnableParticles = useMemo(() => {
    return animationSettings.enableParticles && animationSettings.enableComplexAnimations
  }, [animationSettings])

  // Get theme-based colors
  const getParticleColors = useCallback(() => {
    if (!THREE) return null
    const themeColors = defaultTheme[theme]
    return {
      primary: new THREE.Color(themeColors.primary),
      accent: new THREE.Color(themeColors.accent),
      background: new THREE.Color(themeColors.background)
    }
  }, [theme, THREE])

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!canvasRef.current || !shouldEnableParticles || !THREE) return

    const canvas = canvasRef.current
    const { clientWidth: width, clientHeight: height } = canvas.parentElement || canvas

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false, // Disable for performance
      powerPreference: 'high-performance',
      stencil: false, // Disable stencil buffer for performance
      depth: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, animationSettings.maxPixelRatio))
    rendererRef.current = renderer

    // Initialize performance monitor
    performanceMonitorRef.current = new PerformanceMonitor()

    // Create particle system
    createParticleSystem(scene)
  }, [shouldEnableParticles, animationSettings.maxPixelRatio, THREE])

  // Create particle system
  const createParticleSystem = useCallback((scene: any) => {
    if (!THREE) return
    
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const particleColors = getParticleColors()
    if (!particleColors) return
    
    const { primary, accent } = particleColors

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Random positions
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

      // Mix of primary and accent colors
      const color = Math.random() > 0.7 ? accent : primary
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    particleSystemRef.current = {
      geometry,
      material,
      points,
      velocities
    }
  }, [particleCount, getParticleColors])

  // Update particle colors based on theme
  const updateParticleColors = useCallback(() => {
    if (!particleSystemRef.current || !THREE) return

    const { geometry } = particleSystemRef.current
    const colors = geometry.getAttribute('color')
    const particleColors = getParticleColors()
    if (!particleColors) return
    
    const { primary, accent } = particleColors

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const color = Math.random() > 0.7 ? accent : primary
      
      colors.setXYZ(i, color.r, color.g, color.b)
    }

    colors.needsUpdate = true
  }, [particleCount, getParticleColors, THREE])

  // Update background color based on scroll
  const updateBackgroundColor = useCallback(() => {
    if (!sceneRef.current || !THREE) return

    const scrollProgress = Math.min(scrollYRef.current / (document.body.scrollHeight - window.innerHeight), 1)
    const particleColors = getParticleColors()
    if (!particleColors) return
    
    const { primary, background, accent } = particleColors

    // Interpolate between background and primary based on scroll
    const mixedColor = new THREE.Color()
    if (scrollProgress < 0.5) {
      mixedColor.lerpColors(background, primary, scrollProgress * 2)
    } else {
      mixedColor.lerpColors(primary, accent, (scrollProgress - 0.5) * 2)
    }

    // Apply very subtle background tint
    mixedColor.multiplyScalar(0.1)
    sceneRef.current.background = mixedColor
  }, [getParticleColors, THREE])

  // Animation loop with performance monitoring
  const animate = useCallback(() => {
    try {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !particleSystemRef.current) {
        return
      }

      // Update performance monitor
      if (performanceMonitorRef.current) {
        performanceMonitorRef.current.update()
        
        // Dynamically adjust quality based on performance
        const quality = performanceMonitorRef.current.getPerformanceQuality()
        if (quality === 'low' && particleSystemRef.current.material.opacity > 0.3) {
          // Reduce opacity for better performance
          particleSystemRef.current.material.opacity = 0.5
        }
      }

      const { geometry, points, velocities } = particleSystemRef.current
      const positions = geometry.getAttribute('position') as THREE.BufferAttribute

      if (!positions || !positions.array) {
        return
      }

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        positions.array[i3] += velocities[i3]
        positions.array[i3 + 1] += velocities[i3 + 1]
        positions.array[i3 + 2] += velocities[i3 + 2]

        // Wrap particles around screen bounds
        if (positions.array[i3] > 5) positions.array[i3] = -5
        if (positions.array[i3] < -5) positions.array[i3] = 5
        if (positions.array[i3 + 1] > 5) positions.array[i3 + 1] = -5
        if (positions.array[i3 + 1] < -5) positions.array[i3 + 1] = 5
        if (positions.array[i3 + 2] > 5) positions.array[i3 + 2] = -5
        if (positions.array[i3 + 2] < -5) positions.array[i3 + 2] = 5
      }

      positions.needsUpdate = true

      // Rotate the entire particle system slowly
      points.rotation.y += 0.001
      points.rotation.x += 0.0005

      // Update background color based on scroll
      updateBackgroundColor()

      rendererRef.current.render(sceneRef.current, cameraRef.current)
      animationIdRef.current = requestAnimationFrame(animate)
    } catch (error) {
      console.error('Error in particle animation:', error)
      // Stop animation on error
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [particleCount, updateBackgroundColor])

  // Handle scroll events with throttling for performance
  const handleScroll = useCallback(
    throttle(() => {
      scrollYRef.current = window.scrollY
    }, 100),
    []
  )

  // Handle resize
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return

    const canvas = canvasRef.current
    const { clientWidth: width, clientHeight: height } = canvas.parentElement || canvas

    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(width, height)
  }, [])

  // Initialize scene on mount
  useEffect(() => {
    if (!shouldEnableParticles || !THREE || !mounted) {
      // If particles are disabled or THREE not loaded, just show a simple gradient background
      return
    }

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      try {
        initScene()
        animate()
      } catch (error) {
        console.error('Error initializing particle background:', error)
      }
    }, 100)

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      // Dispose Three.js resources
      try {
        if (particleSystemRef.current) {
          particleSystemRef.current.geometry.dispose()
          particleSystemRef.current.material.dispose()
        }
        if (rendererRef.current) {
          rendererRef.current.dispose()
        }
      } catch (error) {
        console.error('Error disposing particle background:', error)
      }
    }
  }, [initScene, animate, handleScroll, handleResize, shouldEnableParticles, THREE, mounted])

  // Update colors when theme changes
  useEffect(() => {
    updateParticleColors()
  }, [theme, updateParticleColors])

  // Don't render canvas until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={`fixed inset-0 -z-10 ${className}`}>
        <div 
          className="w-full h-full bg-gradient-to-br from-theme-background via-theme-surface to-theme-background"
          style={{ 
            transition: 'background 0.3s ease',
          }}
        />
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {shouldEnableParticles ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      ) : (
        // Fallback gradient background for low-performance devices
        <div 
          className="w-full h-full bg-gradient-to-br from-theme-background via-theme-surface to-theme-background"
          style={{ 
            transition: 'background 0.3s ease',
          }}
        />
      )}
    </div>
  )
}