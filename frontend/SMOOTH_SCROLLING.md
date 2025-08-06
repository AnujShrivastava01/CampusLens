# 🌊 Smooth Scrolling Implementation

This project now uses a modern smooth scrolling solution combining **Lenis**, **GSAP**, and **Framer Motion** for the best scrolling and animation experience.

## 📦 Packages Used

- **@studio-freight/lenis** - Ultra-smooth, lightweight scrolling library
- **gsap** - High-performance animation library with ScrollTrigger
- **framer-motion** - Production-ready motion library for React

## 🚀 How to Use

### 1. **Smooth Scrolling (Automatic)**

The smooth scrolling is automatically enabled globally through the `SmoothScrollProvider` wrapper in `App.tsx`. No additional setup needed!

```tsx
// Automatically wrapped in App.tsx
<SmoothScrollProvider>
  <YourComponents />
</SmoothScrollProvider>
```

### 2. **Scroll to Top Button**

A floating scroll-to-top button is automatically included in the Layout component. It appears when you scroll down more than 300px and smoothly scrolls back to the top when clicked.

```tsx
import { ScrollToTop } from '@/components/ScrollToTop';

// Already included in Layout.tsx
<Layout>
  <YourContent />
  <ScrollToTop /> {/* Automatically included */}
</Layout>
```

### 3. **Animated Sections**

Use the `AnimatedSection` component to add scroll-triggered animations:

```tsx
import { AnimatedSection } from '@/components/AnimatedSection';

// Basic usage
<AnimatedSection animation="fadeInUp">
  <YourContent />
</AnimatedSection>

// With custom settings
<AnimatedSection 
  animation="fadeInLeft"
  delay={0.3}
  threshold={0.2}
  className="custom-class"
>
  <YourContent />
</AnimatedSection>
```

#### Available Animations:
- `fadeInUp` - Fade in from bottom (default)
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `fadeIn` - Simple fade in
- `scaleIn` - Scale and fade in
- `staggerContainer` - For staggered child animations

### 4. **Smooth Scroll Buttons**

Create buttons that smoothly scroll to specific elements:

```tsx
import { SmoothScrollButton } from '@/components/SmoothScrollButton';

// Scroll to element by ID
<SmoothScrollButton to="#features">
  Go to Features
</SmoothScrollButton>

// Scroll to specific position
<SmoothScrollButton to={500} variant="outline">
  Scroll Down
</SmoothScrollButton>

// With custom options
<SmoothScrollButton 
  to="#contact"
  options={{ duration: 2, easing: 'easeInOut' }}
>
  Contact Us
</SmoothScrollButton>
```

### 5. **Custom Scroll Control**

Access scroll methods anywhere in your components:

```tsx
import { useSmoothScrollContext } from '@/components/SmoothScrollProvider';

function MyComponent() {
  const { scrollTo, start, stop } = useSmoothScrollContext();

  const handleScroll = () => {
    scrollTo('#target', { duration: 1.5 });
  };

  const pauseScrolling = () => stop();
  const resumeScrolling = () => start();

  return (
    <div>
      <button onClick={handleScroll}>Scroll to Target</button>
      <button onClick={pauseScrolling}>Pause Scrolling</button>
      <button onClick={resumeScrolling}>Resume Scrolling</button>
    </div>
  );
}
```

Create your own scroll-triggered animations:

```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion } from 'framer-motion';

function CustomComponent() {
  const { ref, controls } = useScrollAnimation(0.3); // 30% threshold

  const customVariants = {
    hidden: { opacity: 0, rotate: -180 },
    visible: { opacity: 1, rotate: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={customVariants}
    >
      Custom Animation Content
    </motion.div>
  );
}
```

## ⚙️ Configuration

### Lenis Settings

The Lenis configuration can be modified in `hooks/useSmoothScroll.ts`:

```typescript
const lenis = new Lenis({
  duration: 1.2,        // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical', // 'vertical' | 'horizontal'
  smooth: true,         // Enable smooth scrolling
  mouseMultiplier: 1,   // Mouse wheel sensitivity
  touchMultiplier: 2,   // Touch sensitivity
});
```

### Animation Timing

Customize animation timing in `hooks/useScrollAnimation.ts`:

```typescript
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,                    // Animation duration
      ease: [0.25, 0.46, 0.45, 0.94]   // Custom easing curve
    }
  }
};
```

## 🎯 Performance Tips

1. **Use `once: true`** - Animations trigger only once for better performance
2. **Adjust thresholds** - Higher thresholds (0.3-0.5) trigger animations later
3. **Stagger animations** - Use `staggerContainer` for multiple elements
4. **Disable on mobile** - Consider disabling smooth scroll on mobile devices

## 🔧 Troubleshooting

### Scroll Not Working?
- Ensure components are wrapped in `SmoothScrollProvider`
- Check console for JavaScript errors
- Verify target elements exist in DOM

### Animations Not Triggering?
- Check if elements are in viewport
- Adjust threshold values (try 0.1 for early trigger)
- Ensure `useScrollAnimation` hook is properly imported

### Performance Issues?
- Reduce animation duration
- Use `transform` instead of changing layout properties
- Consider using `will-change: transform` in CSS

## 📱 Mobile Considerations

The smooth scrolling is optimized for desktop. On mobile:
- Touch scrolling is less smooth by design (`smoothTouch: false`)
- Consider showing simpler animations
- Test on various devices for performance

## 🎨 Example Implementation

Check `pages/Index.tsx` for a complete example of how all these features work together!
