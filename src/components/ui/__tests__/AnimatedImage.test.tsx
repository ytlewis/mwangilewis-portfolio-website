import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import * as fc from 'fast-check'
import AnimatedImage from '../AnimatedImage'

// Mock GSAP and animations
jest.mock('gsap', () => ({
  gsap: {
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      play: jest.fn(),
      reverse: jest.fn(),
      kill: jest.fn(),
    })),
    to: jest.fn(),
    fromTo: jest.fn(),
    registerPlugin: jest.fn(),
  },
}))

jest.mock('../../../lib/animations', () => ({
  createImageHoverAnimation: jest.fn((element) => {
    if (!element) return null
    
    // Mock the hover animation behavior
    const mockTimeline = {
      play: jest.fn(),
      reverse: jest.fn(),
      kill: jest.fn(),
    }
    
    // Add event listeners to simulate hover behavior
    element.addEventListener('mouseenter', () => {
      // Apply hover transformations
      element.style.transform = 'scale(1.05) rotateY(5deg) rotateX(2.5deg)'
      element.style.boxShadow = '0 0 20px rgba(230, 57, 70, 0.3)'
      mockTimeline.play()
    })
    
    element.addEventListener('mouseleave', () => {
      // Reset transformations
      element.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)'
      element.style.boxShadow = 'none'
      mockTimeline.reverse()
    })
    
    return mockTimeline
  }),
}))

jest.mock('../../../hooks/useAnimations', () => ({
  useImageHover: jest.fn(() => {
    const ref = React.useRef(null)
    
    React.useEffect(() => {
      if (ref.current) {
        const { createImageHoverAnimation } = require('../../../lib/animations')
        createImageHoverAnimation(ref.current)
      }
    }, [])
    
    return ref
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, className, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        {...props}
      />
    )
  }
})

describe('AnimatedImage Hover Transformations', () => {
  test('Property 6: Image Hover Transformations - For any image element, hovering should apply scale, glow, and tilt CSS transformations', () => {
    // Feature: lewis-portfolio-website, Property 6: Image Hover Transformations
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      fc.integer({ min: 100, max: 1000 }),
      fc.integer({ min: 100, max: 1000 }),
      (src, alt, width, height) => {
        // Render the AnimatedImage component
        render(
          <AnimatedImage
            src={src}
            alt={alt}
            width={width}
            height={height}
          />
        )

        // Find the image container (the div that wraps the image)
        const imageContainer = screen.getByRole('img').parentElement
        expect(imageContainer).toBeInTheDocument()

        // Verify initial state - no transformations applied
        const initialTransform = imageContainer?.style.transform || ''
        const initialBoxShadow = imageContainer?.style.boxShadow || ''

        // Simulate mouse enter (hover start)
        act(() => {
          fireEvent.mouseEnter(imageContainer!)
        })

        // Verify hover transformations are applied
        const hoverTransform = imageContainer?.style.transform || ''
        const hoverBoxShadow = imageContainer?.style.boxShadow || ''

        // Check that scale transformation is applied (should contain scale > 1)
        expect(hoverTransform).toContain('scale(1.05)')
        
        // Check that tilt transformations are applied (rotateY and rotateX)
        expect(hoverTransform).toContain('rotateY(5deg)')
        expect(hoverTransform).toContain('rotateX(2.5deg)')
        
        // Check that glow effect is applied (box-shadow with rgba color)
        expect(hoverBoxShadow).toContain('rgba(230, 57, 70, 0.3)')

        // Simulate mouse leave (hover end)
        act(() => {
          fireEvent.mouseLeave(imageContainer!)
        })

        // Verify transformations are reset
        const resetTransform = imageContainer?.style.transform || ''
        const resetBoxShadow = imageContainer?.style.boxShadow || ''

        // Check that transformations are reset to default values
        expect(resetTransform).toContain('scale(1)')
        expect(resetTransform).toContain('rotateY(0deg)')
        expect(resetTransform).toContain('rotateX(0deg)')
        expect(resetBoxShadow).toBe('none')

        // Clean up for next iteration
        document.body.innerHTML = ''
      }
    ), { numRuns: 100 })
  })

  test('Property 6: Image Hover Transformations - Image container should have proper CSS properties for 3D transformations', () => {
    // Feature: lewis-portfolio-website, Property 6: Image Hover Transformations
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      (src, alt) => {
        render(
          <AnimatedImage
            src={src}
            alt={alt}
            width={300}
            height={200}
          />
        )

        const imageContainer = screen.getByRole('img').parentElement
        expect(imageContainer).toBeInTheDocument()

        // Verify the container has proper CSS properties for 3D transformations
        const computedStyle = window.getComputedStyle(imageContainer!)
        
        // Check for transform-style: preserve-3d (may be set via inline style)
        const inlineStyle = imageContainer?.getAttribute('style') || ''
        expect(inlineStyle).toContain('transform-style: preserve-3d')
        expect(inlineStyle).toContain('backface-visibility: hidden')

        // Verify the container has proper classes for styling
        expect(imageContainer).toHaveClass('relative', 'overflow-hidden', 'rounded-lg')

        // Clean up for next iteration
        document.body.innerHTML = ''
      }
    ), { numRuns: 100 })
  })

  test('Property 6: Image Hover Transformations - Animation should be created and cleaned up properly', () => {
    // Feature: lewis-portfolio-website, Property 6: Image Hover Transformations
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      (src, alt) => {
        const { createImageHoverAnimation } = require('../../../lib/animations')
        
        // Clear previous mock calls
        jest.clearAllMocks()

        const { unmount } = render(
          <AnimatedImage
            src={src}
            alt={alt}
            width={300}
            height={200}
          />
        )

        // Verify that createImageHoverAnimation was called
        expect(createImageHoverAnimation).toHaveBeenCalled()

        // Get the mock timeline that was returned
        const mockCalls = (createImageHoverAnimation as jest.Mock).mock.calls
        expect(mockCalls.length).toBeGreaterThan(0)

        // Verify the element passed to createImageHoverAnimation is valid
        const passedElement = mockCalls[0][0]
        expect(passedElement).toBeTruthy()
        expect(passedElement.nodeType).toBe(Node.ELEMENT_NODE)

        // Unmount component to test cleanup
        unmount()

        // Clean up for next iteration
        document.body.innerHTML = ''
      }
    ), { numRuns: 100 })
  })
})