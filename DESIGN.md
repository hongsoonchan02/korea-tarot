---
name: Ethereal Intelligence
colors:
  surface: '#101221'
  surface-dim: '#101221'
  surface-bright: '#363848'
  surface-container-lowest: '#0b0d1b'
  surface-container-low: '#191b29'
  surface-container: '#1d1f2d'
  surface-container-high: '#272938'
  surface-container-highest: '#323443'
  on-surface: '#e1e1f5'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e1e1f5'
  inverse-on-surface: '#2e2f3f'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#ca801e'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#101221'
  on-background: '#e1e1f5'
  surface-variant: '#323443'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  section-gap: 4rem
---

## Brand & Style
The design system is rooted in the intersection of ancient esoteric wisdom and cutting-edge artificial intelligence. It evokes a sense of cosmic calm, guiding users through a journey of self-discovery and spiritual insight. 

The visual style is **Modern Glassmorphism with a Spiritual/Celestial lean**. By utilizing deep, immersive backgrounds contrasted against ethereal glows and precise gold accents, the interface feels less like a tool and more like a digital sanctuary. High-quality whitespace is used to provide psychological breathing room, ensuring the AI's insights are delivered with clarity and reverence.

## Colors
This design system utilizes a palette designed for deep immersion. The foundation is built upon **Deep Indigo** and **Midnight Blue**, creating a nocturnal canvas that reduces eye strain and enhances the "mystic" atmosphere.

- **Primary Action:** Mystic Purple (#8B5CF6) is reserved for interactive elements, representing intuition and the aura of the AI.
- **Elegance Accent:** Soft Gold (#F59E0B) is used sparingly for highlights, borders of significant cards (like the Major Arcana), and high-value indicators.
- **Hierarchy:** Pure White is strictly for high-level headings to ensure maximum legibility against the dark void, while Muted Gray handles secondary information to maintain the moody aesthetic.

## Typography
The typography system relies on **Inter** to ground the spiritual experience in modern precision. To differentiate from standard SaaS apps, this design system uses wide tracking for labels and dramatic scale for display headings.

- **Headings:** Use high-contrast weights (Bold/700) and white color to command attention.
- **Body Text:** Use the Muted Gray token and regular weights to ensure a soft, non-aggressive reading experience for long tarot interpretations.
- **Labels:** Small labels use uppercase with increased letter spacing to evoke the feeling of inscriptions or modern runes.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain a cinematic, centered focus, while transitioning to a fluid model for mobile.

- **Philosophy:** Negative space is a functional element here, representing the "void." Avoid cluttering the screen with multiple cards; prioritize a single, focused flow.
- **Grid:** A 12-column grid is used for the dashboard, but most reading experiences should be constrained to the center 6-8 columns to improve focus.
- **Rhythm:** Use the `section-gap` for vertical breathing room between different parts of a reading (e.g., between the Card Spread and the AI Interpretation).

## Elevation & Depth
In this design system, depth is not conveyed through traditional shadows, but through **Tonal Layering and Glassmorphism**.

1.  **Base Layer:** Deep Indigo (#0B0D1B) solid background.
2.  **Mid Layer (Cards/Containers):** Midnight Blue (#14172E) with a subtle 1px border of white at 10% opacity.
3.  **Top Layer (Active/Floating):** Semi-transparent glass (Background Blur 12px) with a `primary-glow`.
4.  **Glows:** Use `box-shadow: 0 0 20px rgba(139, 92, 246, 0.3)` for primary buttons and active tarot cards to simulate an "energy" radiating from the element.

## Shapes
The shape language is consistently **Soft and Approachable**. By utilizing `rounded-xl` (1.5rem) for main containers, we remove the "sharpness" of technology, making the AI feel more organic and empathetic. 

- **Cards:** Must use `rounded-xl` to frame tarot imagery elegantly.
- **Buttons:** Should maintain a slightly smaller radius or be fully pill-shaped to differentiate them from static containers.
- **Borders:** Use ultra-thin (1px) strokes. For special elements, use a linear gradient border transitioning from Mystic Purple to Soft Gold.

## Components
- **Buttons:** Primary buttons use a solid Mystic Purple fill with a subtle outer glow. Secondary buttons use a transparent fill with a Soft Gold 1px border.
- **Tarot Cards:** These are the centerpiece. Use a high-quality glassmorphism effect for the "back" of the card and a 1px Soft Gold border for "face-up" cards.
- **Input Fields:** Darker than the background with a bottom-only border that glows Mystic Purple when focused.
- **Chips/Badges:** Small, pill-shaped elements with low-opacity Purple backgrounds, used for categorizing reading themes (e.g., "Love," "Career").
- **AI Response Box:** A full-width glass container with a subtle vertical gradient (Purple to Transparent) on the left edge to indicate the "active" voice of the AI.