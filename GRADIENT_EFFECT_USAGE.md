# Animated Gradient Effect - Usage Guide

This guide shows you how to use the animated colorful gradient effect inspired by pro.ui-layouts.com.

## Components Available

### 1. TopGradientBar (Currently Implemented)
A thin animated gradient bar perfect for navigation bars.

```tsx
import { TopGradientBar } from '@/components/GradientEffect';

<TopGradientBar className="fixed top-0 left-0 right-0 z-[60]" />
```

### 2. GradientBackground
Full animated gradient background for sections or pages.

```tsx
import { GradientBackground } from '@/components/GradientEffect';

<GradientBackground className="min-h-screen p-8">
  <h1>Your content here</h1>
  <p>This will have an animated gradient background</p>
</GradientBackground>
```

### 3. GradientOverlay
Subtle gradient overlay effect on top of content.

```tsx
import { GradientOverlay } from '@/components/GradientEffect';

<GradientOverlay className="p-8">
  <h2>Content with gradient overlay</h2>
  <p>The gradient adds a beautiful animated effect</p>
</GradientOverlay>
```

### 4. Main Component with Variants
Use the main component with different variants:

```tsx
import { GradientEffect } from '@/components/GradientEffect';

// Top bar variant
<GradientEffect variant="top-bar" className="..." />

// Full background variant
<GradientEffect variant="full-background" className="...">
  {children}
</GradientEffect>

// Overlay variant
<GradientEffect variant="overlay" className="...">
  {children}
</GradientEffect>
```

## CSS Classes Available

You can also use the CSS classes directly in your components:

### 1. `.top-gradient-bar`
```tsx
<div className="top-gradient-bar" />
```

### 2. `.gradient-bg` (Light mode) / `.gradient-bg-dark` (Dark mode)
```tsx
<div className="gradient-bg p-8">
  Content with gradient background
</div>
```

### 3. `.gradient-overlay`
```tsx
<div className="gradient-overlay p-8">
  Content with gradient overlay
</div>
```

## Customization

### Adjust Animation Speed
Edit the animation duration in `src/app/globals.css`:

```css
.gradient-bg {
  animation: gradient-shift 8s ease infinite; /* Change 8s to your preferred speed */
}
```

### Modify Colors
Update the gradient colors in `src/app/globals.css`:

```css
.gradient-bg {
  background: linear-gradient(
    90deg,
    #ff6b35 0%,    /* Orange */
    #f7931e 15%,   /* Orange-Yellow */
    #fdc830 30%,   /* Yellow */
    /* Add or modify colors here */
  );
}
```

### Dark Mode Support
The component automatically detects dark mode and adjusts accordingly. Dark mode uses cooler tones while light mode uses warm vibrant colors.

## Examples

### Hero Section with Gradient Overlay
```tsx
<GradientOverlay className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-6xl font-bold">Welcome</h1>
    <p className="text-xl mt-4">Beautiful gradient overlay effect</p>
  </div>
</GradientOverlay>
```

### Card with Gradient Background
```tsx
<GradientBackground className="rounded-lg p-8 shadow-lg">
  <h2 className="text-2xl font-bold text-white">Special Offer</h2>
  <p className="text-white/90 mt-2">Limited time deal!</p>
</GradientBackground>
```

### Multiple Gradient Bars
```tsx
<>
  <TopGradientBar className="fixed top-0" />
  <div className="pt-1"> {/* Add padding to account for gradient bar */}
    {/* Your content */}
  </div>
</>
```

## Performance Notes

- The gradient effect uses CSS animations for optimal performance
- Hardware acceleration is enabled automatically
- No JavaScript is required for the animation (runs purely in CSS)
- Dark mode detection uses a MutationObserver for automatic updates

## Browser Support

Works in all modern browsers that support:
- CSS gradients
- CSS animations
- CSS custom properties (CSS variables)

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)