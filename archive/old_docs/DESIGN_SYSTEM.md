# Purposeful Live Coaching - Design System
**Created:** December 13, 2025 1:00 PM EST
**Purpose:** World-class UI design system for transformation platform

---

## Design Philosophy

**We are building a WORLD-CLASS platform** - not "good enough", not "functional" - but **exceptional**.

### Core Principles
1. **Sophistication Over Simplicity** - Premium feel, not basic
2. **Clarity Over Cleverness** - Information hierarchy, not confusion
3. **Depth Over Flatness** - Tactile, dimensional, real
4. **Purpose Over Decoration** - Every element serves transformation
5. **Accessibility First** - ASD-aware, neurodivergent-friendly

---

## Typography System

### Font Families
**Display (Headings):** Inter Variable (Bold 700-900)
**Body (Content):** Inter Variable (Regular 400-500)
**Monospace (Code/Data):** JetBrains Mono

### Type Scale (8px grid)
```
h1: 48px / 56px line-height (3rem / 3.5rem)
h2: 40px / 48px (2.5rem / 3rem)
h3: 32px / 40px (2rem / 2.5rem)
h4: 24px / 32px (1.5rem / 2rem)
h5: 20px / 28px (1.25rem / 1.75rem)
h6: 18px / 24px (1.125rem / 1.5rem)
body: 16px / 24px (1rem / 1.5rem)
small: 14px / 20px (0.875rem / 1.25rem)
tiny: 12px / 16px (0.75rem / 1rem)
```

### Font Weights
- **900 Black** - Hero headlines only
- **700 Bold** - Section headers, CTAs
- **600 Semibold** - Card titles, labels
- **500 Medium** - Body emphasis
- **400 Regular** - Body text

---

## Color System

### Brand Colors
```
Primary (Purple): #8B5CF6 (purple-500)
Secondary (Indigo): #6366F1 (indigo-500)
Accent (Blue): #3B82F6 (blue-500)
Success (Green): #10B981 (emerald-500)
Warning (Orange): #F59E0B (amber-500)
Error (Red): #EF4444 (red-500)
```

### Semantic Colors
```
Background: #FFFFFF (light) / #0F172A (dark)
Surface: #F8FAFC (light) / #1E293B (dark)
Border: #E2E8F0 (light) / #334155 (dark)
Text Primary: #0F172A (light) / #F1F5F9 (dark)
Text Secondary: #64748B (light) / #94A3B8 (dark)
Text Tertiary: #94A3B8 (light) / #64748B (dark)
```

### Gradient Palette
```
Hero: from-purple-600 via-indigo-600 to-blue-600
Success: from-emerald-500 to-teal-600
Warning: from-amber-500 to-orange-600
Premium: from-purple-900 via-indigo-900 to-blue-900
```

---

## Spacing System (8px Grid)

```
0: 0px
1: 8px (0.5rem)
2: 16px (1rem)
3: 24px (1.5rem)
4: 32px (2rem)
5: 40px (2.5rem)
6: 48px (3rem)
8: 64px (4rem)
10: 80px (5rem)
12: 96px (6rem)
16: 128px (8rem)
20: 160px (10rem)
```

**Usage:**
- **Micro spacing (8-16px):** Between related elements
- **Macro spacing (24-48px):** Between sections
- **Hero spacing (64-160px):** Page headers, CTAs

---

## Elevation & Shadows

### Shadow Scale
```
sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Blur Effects
```
Backdrop blur: backdrop-blur-sm (4px)
Glass morphism: backdrop-blur-md (12px) + bg-white/10
Depth blur: blur-sm (4px) for background layers
```

---

## Border Radius

```
sm: 4px (0.25rem) - Badges, tags
md: 8px (0.5rem) - Buttons, inputs
lg: 12px (0.75rem) - Cards, modals
xl: 16px (1rem) - Hero cards
2xl: 24px (1.5rem) - Feature sections
full: 9999px - Pills, avatars
```

---

## Component Patterns

### Cards
```
Standard Card:
- Border: 2px solid border-color
- Radius: lg (12px)
- Shadow: md
- Padding: 6 (48px)
- Hover: shadow-xl + translate-y-1

Premium Card:
- Gradient border
- Shadow: xl
- Backdrop blur
- Hover: scale-105
```

### Buttons
```
Primary:
- BG: gradient-to-r from-purple-600 to-indigo-600
- Text: white
- Padding: px-6 py-3
- Radius: lg
- Shadow: md
- Hover: shadow-lg + brightness-110

Secondary:
- BG: transparent
- Border: 2px solid purple-600
- Text: purple-600
- Hover: bg-purple-50

Ghost:
- BG: transparent
- Text: gray-700
- Hover: bg-gray-100
```

### Inputs
```
Standard Input:
- Border: 2px solid gray-300
- Radius: md (8px)
- Padding: px-4 py-3
- Focus: ring-2 ring-purple-500

Error State:
- Border: red-500
- Ring: red-500
- Icon: AlertTriangle

Success State:
- Border: green-500
- Icon: CheckCircle
```

---

## Motion & Animation

### Transition Timing
```
Fast: 150ms - Hover states, tooltips
Medium: 300ms - Modals, dropdowns
Slow: 500ms - Page transitions
```

### Easing Functions
```
ease-in-out: Smooth both ways (default)
ease-out: Snappy start, smooth end (buttons)
ease-in: Smooth start, snappy end (exits)
spring: Bouncy, playful (success states)
```

### Animation Patterns
```
Fade In: opacity-0 → opacity-100
Slide Up: translate-y-4 → translate-y-0
Scale: scale-95 → scale-100
Bounce: scale-100 → scale-110 → scale-100
```

---

## ASD-Aware Design

### Cognitive Load Reduction
- **One primary action per screen**
- **Clear visual hierarchy** (size, color, spacing)
- **Predictable patterns** (same action = same location)
- **Progress indicators** for multi-step flows

### Sensory Considerations
- **No auto-play** videos or audio
- **Reduce motion** option (prefers-reduced-motion)
- **High contrast** mode support
- **Adjustable font sizes**

### Clear Communication
- **Plain language** (no jargon)
- **Visual + text** labels (icons alone not enough)
- **Error messages** with solutions, not blame
- **Confirmation dialogs** for destructive actions

---

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color contrast:** 4.5:1 for text, 3:1 for large text
- **Focus indicators:** Visible on all interactive elements
- **Keyboard navigation:** Tab order logical
- **Screen reader:** ARIA labels on all controls

### Semantic HTML
```
<header> - Site header
<nav> - Navigation menus
<main> - Primary content
<article> - Self-contained content
<section> - Thematic grouping
<aside> - Complementary content
<footer> - Site footer
```

---

## Implementation Checklist

### Phase 3: World-Class UI (Current)
- [ ] Update global CSS with design tokens
- [ ] Create premium component library
- [ ] Implement typography system
- [ ] Add depth & texture (shadows, gradients)
- [ ] Build micro-interactions
- [ ] Polish all 29 pages with new design system

### Phase 4: Daily Operating System
- [ ] Morning routine dashboard
- [ ] Evening reflection interface
- [ ] Habit tracking UI
- [ ] Progress visualization

### Phase 5: Advanced Features
- [ ] Behavioral analysis dashboard
- [ ] AI insights visualization
- [ ] Predictive analytics charts

---

**Last Updated:** December 13, 2025 1:00 PM EST
