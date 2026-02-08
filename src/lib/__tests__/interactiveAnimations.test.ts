import * as fc from 'fast-check';

// Mock GSAP completely
jest.mock('gsap', () => {
  const mockTimeline = {
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    reverse: jest.fn().mockReturnThis(),
    restart: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
    paused: true,
  };

  return {
    gsap: {
      to: jest.fn(),
      timeline: jest.fn(() => mockTimeline),
      registerPlugin: jest.fn(),
    }
  };
});

// Import after mocking
import { createButtonAnimation, createImageHoverAnimation } from '../animations';
import { gsap } from 'gsap';

describe('Interactive Animation Response', () => {
  let mockTimeline: any;

  beforeEach(() => {
    // Get fresh mock timeline for each test
    mockTimeline = (gsap.timeline as jest.Mock)();
    
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockTimeline.to.mockReturnThis();
    mockTimeline.from.mockReturnThis();
    mockTimeline.set.mockReturnThis();
    
    // Reset DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  test('Property 3: Interactive Animation Response - Button animations should respond to user interactions with appropriate feedback', () => {
    /**
     * **Validates: Requirements 1.4, 2.5**
     * Tests that button micro-interactions provide appropriate visual feedback
     */
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 15 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
      (buttonTexts) => {
        // Create test buttons
        const buttons = buttonTexts.map(text => {
          const button = document.createElement('button');
          button.textContent = text;
          button.className = 'test-button';
          document.body.appendChild(button);
          return button;
        });

        // Apply animations to each button
        const animations = buttons.map(button => createButtonAnimation(button));

        // Test each button's interactive responses
        buttons.forEach((button, index) => {
          const buttonAnimations = animations[index];

          // Clear previous mock calls
          jest.clearAllMocks();

          // Test click interaction - should provide micro-interaction feedback
          const clickEvent = new MouseEvent('click', { bubbles: true });
          button.dispatchEvent(clickEvent);

          // Verify click animation was triggered
          expect(mockTimeline.restart).toHaveBeenCalled();

          // Test hover interactions - should provide visual feedback
          const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
          const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });

          button.dispatchEvent(mouseEnterEvent);
          expect(mockTimeline.play).toHaveBeenCalled();

          jest.clearAllMocks();
          button.dispatchEvent(mouseLeaveEvent);
          expect(mockTimeline.reverse).toHaveBeenCalled();

          // Test focus interactions - should provide accessibility feedback
          const focusEvent = new FocusEvent('focus', { bubbles: true });
          const blurEvent = new FocusEvent('blur', { bubbles: true });

          jest.clearAllMocks();
          button.dispatchEvent(focusEvent);
          expect(mockTimeline.play).toHaveBeenCalled();

          jest.clearAllMocks();
          button.dispatchEvent(blurEvent);
          expect(mockTimeline.reverse).toHaveBeenCalled();

          // Test touch interactions for mobile - should provide tactile feedback
          const touchStartEvent = new TouchEvent('touchstart', { bubbles: true });
          const touchEndEvent = new TouchEvent('touchend', { bubbles: true });

          jest.clearAllMocks();
          button.dispatchEvent(touchStartEvent);
          expect(gsap.to).toHaveBeenCalledWith(button, expect.objectContaining({
            scale: 0.98,
            duration: 0.1
          }));

          jest.clearAllMocks();
          button.dispatchEvent(touchEndEvent);
          expect(gsap.to).toHaveBeenCalledWith(button, expect.objectContaining({
            scale: 1,
            duration: 0.1
          }));
        });

        // Clean up for next iteration
        document.body.innerHTML = '';
      }
    ), { numRuns: 100 });
  });

  test('Property 6: Image Hover Transformations - Image hover animations should provide scale, glow, and tilt effects', () => {
    /**
     * **Validates: Requirements 2.3**
     * Tests that individual image hover animations provide scale, glow, and tilt transformations
     */
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      (imageSrc) => {
        // Create a single test image with unique identifier
        const uniqueId = `test-image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const img = document.createElement('img');
        img.src = `https://example.com/${imageSrc}.jpg`;
        img.alt = `Test image ${imageSrc}`;
        img.className = 'test-image';
        img.id = uniqueId;
        
        // Create a clean container for this test
        const container = document.createElement('div');
        container.id = `container-${uniqueId}`;
        container.appendChild(img);
        document.body.appendChild(container);

        // Clear previous mock calls before creating animation
        jest.clearAllMocks();

        // Apply hover animation to the image
        const timeline = createImageHoverAnimation(img);

        // Verify timeline was created
        expect(gsap.timeline).toHaveBeenCalled();

        // Verify that the timeline.to method was called during animation creation
        // The mockTimeline.to should have been called when createImageHoverAnimation was executed
        expect(mockTimeline.to).toHaveBeenCalledWith(img, expect.objectContaining({
          scale: expect.any(Number),
          rotationX: expect.any(Number),
          rotationY: expect.any(Number),
          boxShadow: expect.any(String),
          duration: expect.any(Number),
          ease: expect.any(String),
        }));

        // Verify scale effect is applied (should be > 1 for zoom effect)
        const toCall = (mockTimeline.to as any).mock.calls.find((call: any) => 
          call[0] === img && call[1].scale !== undefined
        );
        if (toCall) {
          expect(toCall[1].scale).toBeGreaterThan(1);
          expect(toCall[1].scale).toBeLessThanOrEqual(1.2); // Reasonable upper bound
        }

        // Verify glow effect (boxShadow should contain rgba for glow)
        const glowCall = (mockTimeline.to as any).mock.calls.find((call: any) => 
          call[0] === img && call[1].boxShadow !== undefined
        );
        if (glowCall) {
          expect(glowCall[1].boxShadow).toMatch(/rgba/);
        }

        // Test mouse enter (hover start) - should play the animation
        jest.clearAllMocks();
        const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
        img.dispatchEvent(mouseEnterEvent);
        expect(mockTimeline.play).toHaveBeenCalled();

        // Test mouse leave (hover end) - should reverse the animation
        jest.clearAllMocks();
        const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
        img.dispatchEvent(mouseLeaveEvent);
        expect(mockTimeline.reverse).toHaveBeenCalled();

        // Clean up this specific test's DOM elements
        container.remove();
      }
    ), { numRuns: 100 });
  });

  test('Property 3: Interactive Animation Response - Animations should have appropriate timing and easing for smooth user experience', () => {
    /**
     * **Validates: Requirements 1.4, 2.5**
     * Tests that animations have reasonable timing and easing for smooth interactions
     */
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 5 }),
      (numElements) => {
        // Create test elements
        const elements = Array.from({ length: numElements }, (_, i) => {
          const element = document.createElement('div');
          element.className = `test-element-${i}`;
          element.textContent = `Element ${i}`;
          document.body.appendChild(element);
          return element;
        });

        // Apply button animations
        elements.forEach(element => {
          createButtonAnimation(element);
        });

        // Test timing and easing properties
        elements.forEach(element => {
          jest.clearAllMocks();

          // Trigger hover animation
          const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
          element.dispatchEvent(mouseEnterEvent);

          // Check that animations have reasonable timing
          const animationCalls = (gsap.to as jest.Mock).mock.calls;
          animationCalls.forEach(call => {
            const options = call[1];
            if (options.duration !== undefined) {
              // Duration should be reasonable (not too fast, not too slow)
              expect(options.duration).toBeGreaterThan(0);
              expect(options.duration).toBeLessThanOrEqual(2);
            }
            
            if (options.ease !== undefined) {
              // Ease should be a valid string
              expect(typeof options.ease).toBe('string');
              expect(options.ease.length).toBeGreaterThan(0);
            }
          });
        });

        // Clean up for next iteration
        document.body.innerHTML = '';
      }
    ), { numRuns: 100 });
  });

  test('Property 3: Interactive Animation Response - Animation cleanup should prevent memory leaks', () => {
    /**
     * **Validates: Requirements 1.4, 2.5**
     * Tests that animation objects can be properly cleaned up to prevent memory leaks
     */
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 3 }),
      (elementIds) => {
        // Create test elements
        const elements = elementIds.map(id => {
          const element = document.createElement('div');
          element.id = id;
          element.textContent = `Element ${id}`;
          document.body.appendChild(element);
          return element;
        });

        // Apply animations and collect animation objects
        const animationObjects = elements.map(element => {
          return createButtonAnimation(element);
        });

        // Verify animation objects are returned for cleanup
        animationObjects.forEach(animations => {
          expect(animations).toBeDefined();
          expect(animations).toHaveProperty('clickAnimation');
          expect(animations).toHaveProperty('hoverAnimation');
          expect(animations).toHaveProperty('focusAnimation');
          
          // Verify animations have kill method for cleanup
          expect(animations.clickAnimation).toHaveProperty('kill');
          expect(animations.hoverAnimation).toHaveProperty('kill');
          expect(animations.focusAnimation).toHaveProperty('kill');
        });

        // Test cleanup functionality
        animationObjects.forEach(animations => {
          jest.clearAllMocks();
          
          // Call cleanup methods
          animations.clickAnimation.kill();
          animations.hoverAnimation.kill();
          animations.focusAnimation.kill();
          
          // Verify kill was called on each animation
          expect(mockTimeline.kill).toHaveBeenCalledTimes(3);
        });

        // Clean up for next iteration
        document.body.innerHTML = '';
      }
    ), { numRuns: 100 });
  });
});