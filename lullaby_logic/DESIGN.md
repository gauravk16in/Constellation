---
name: Lullaby & Logic
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd8e5'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebf9'
  surface-container-high: '#ebe6f3'
  surface-container-highest: '#e6e0ed'
  on-surface: '#1c1a24'
  on-surface-variant: '#484555'
  inverse-surface: '#312f39'
  inverse-on-surface: '#f4eefc'
  outline: '#797586'
  outline-variant: '#c9c4d7'
  surface-tint: '#613ede'
  primary: '#5e3bdb'
  on-primary: '#ffffff'
  primary-container: '#7858f5'
  on-primary-container: '#fffbff'
  inverse-primary: '#cabeff'
  secondary: '#a53a34'
  on-secondary: '#ffffff'
  secondary-container: '#fd7c72'
  on-secondary-container: '#721513'
  tertiary: '#00647c'
  on-tertiary: '#ffffff'
  tertiary-container: '#007f9c'
  on-tertiary-container: '#fafdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#481bc6'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ac'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#84231f'
  tertiary-fixed: '#b7eaff'
  tertiary-fixed-dim: '#4cd6ff'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#fdf8ff'
  on-background: '#1c1a24'
  surface-variant: '#e6e0ed'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  stack-gap: 16px
  section-gap: 32px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system is built to serve as a supportive, sophisticated "co-pilot" for the modern parent. It balances the playful whimsy of childhood with the high-fidelity precision of a premium productivity tool. 

The aesthetic is a hybrid of **Soft Minimalism** and **Glassmorphism**. It rejects the cluttered, primary-color-heavy tropes of traditional childcare apps in favor of a "rich tactile" experience. The interface should feel like a premium physical object—smooth, rounded, and responsive. Use heavy whitespace to reduce cognitive load for busy parents, while employing vibrant "action" accents to maintain a sense of energy and delight.

## Colors

The palette is anchored by a triad of "vibrant actions" set against a series of "soothing foundations."

- **Foundations:** Use Lavender, Mint, and Cream for full-screen backgrounds or large container fills. These should never be used together on the same screen; choose one as the "mood" for a specific section (e.g., Mint for health/growth, Lavender for routine).
- **Actions:** Violet (Primary) is for navigation and main CTA paths. Coral (Secondary) is for urgent alerts or high-energy milestones. Electric Blue (Tertiary) is for information and educational highlights.
- **Surface:** Always use pure white for the primary content cards to ensure the glassmorphism and soft shadows have a clean base to interact with.

## Typography

The typographic system pairs the friendly, rounded terminals of **Quicksand** for display text with the modern, efficient structure of **Be Vietnam Pro** for utility.

- **Headlines:** Use Quicksand with tighter letter-spacing for a "logo-like" feel in titles. Use Bold (700) for primary headers and Semi-Bold (600) for section titles.
- **Body:** Be Vietnam Pro provides the necessary legibility for long-form parental advice and data tracking.
- **Micro-copy:** Labels for navigation and small data points should use Medium (500) or Semi-Bold (600) weights to maintain hierarchy against the soft background colors.

## Layout & Spacing

The layout philosophy follows a **Dynamic Padded Model** rather than a strict 12-column grid. It relies on internal container padding to create "safe zones" for content.

- **Rhythm:** All spacing is based on an 8px scale.
- **Margins:** On mobile, use a 20px edge margin. For tablet and desktop, move to a centered fixed-width container (max 1200px) with 64px margins.
- **Safe Areas:** Cards should have a minimum internal padding of 24px to feel "luxurious" and airy.
- **Reflow:** On desktop, the "co-pilot" dashboard should utilize a 3-column layout (Navigation / Primary Stream / Utility Sidebar). On mobile, these stack vertically, with the Navigation moving to a floating pill-shaped bottom bar.

## Elevation & Depth

This design system uses a multi-layered approach to depth to create a sense of tactile richness:

1.  **The Canvas:** The base background (Lavender/Mint/Cream) is the lowest layer.
2.  **The Frosted Layer (Glassmorphism):** Use for persistent elements like the header or the bottom navigation bar. (Blur: 20px, Opacity: 70% White, Border: 1px Solid White 40%).
3.  **The Primary Cards:** White surfaces with "Ambient Shadows." Shadows should be highly diffused and tinted with the primary color: `0px 12px 32px rgba(124, 93, 250, 0.08)`.
4.  **The Interactive Layer:** Buttons and active chips use a slightly stronger shadow to indicate "press-ability."

## Shapes

The shape language is defined by **Extreme Softness**. 

- **Primary Containers:** Use "Squircle" shapes (continuous curvature) rather than simple rounded rectangles where possible. The base radius for cards is 32px.
- **Buttons:** Exclusively pill-shaped (fully rounded ends) to reinforce the friendly, safe nature of the brand.
- **Imagery:** Photography should be masked in 32px rounded containers or organic, circular blobs.
- **Visual Flourishes:** Use subtle 1px inner borders (white) on glass surfaces to simulate a beveled edge.

## Components

- **Buttons:** 
    - *Primary:* Pill-shaped, Primary Violet fill, White text, soft shadow.
    - *Secondary:* Pill-shaped, White fill, 1px Primary Violet border.
- **Input Fields:** Large, 24px rounded corners, background fill of #FFFFFF 60% (if on pastel background) or light grey #F8F8F8.
- **Cards:** 32px corner radius. Must include a subtle 1px white border to distinguish from the background.
- **Chips:** Small pill shapes used for tags or status indicators. Use the "Action Colors" at 10% opacity for the background and 100% opacity for the text.
- **The "Co-Pilot" Progress Bar:** A thick, 12px height pill track with a gradient fill (Primary to Tertiary) to show completion or growth.
- **Floating Navigation:** A pill-shaped dock that sits 16px from the bottom of the screen, utilizing the glassmorphism effect.