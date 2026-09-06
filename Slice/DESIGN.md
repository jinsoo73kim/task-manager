---
name: Modern Trust Onboarding
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444656'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757688'
  outline-variant: '#c5c5d9'
  surface-tint: '#2848ee'
  primary: '#183ce6'
  on-primary: '#ffffff'
  primary-container: '#3d5afe'
  on-primary-container: '#f1f0ff'
  inverse-primary: '#bbc3ff'
  secondary: '#006493'
  on-secondary: '#ffffff'
  secondary-container: '#00affe'
  on-secondary-container: '#003f5f'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000f5d'
  on-primary-fixed-variant: '#002ccd'
  secondary-fixed: '#cae6ff'
  secondary-fixed-dim: '#8dcdff'
  on-secondary-fixed: '#001e30'
  on-secondary-fixed-variant: '#004b70'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
  margin-mobile: 1.25rem
  margin-tablet: 2rem
  gutter: 1rem
---

## Brand & Style

The visual identity targets users seeking clarity, modern refinement, and uncompromised security during onboarding. The emotional response is balanced: calm confidence meets effortless momentum. Friction during sign-up is minimized through clarity, high-legibility typographic scales, and purposeful tactile feedback.

The design movement is **Corporate / Modern** elevated by **Soft Minimalism**:
- Pristine, breathing whitespace that directs focus strictly onto active inputs.
- Uncluttered visual surfaces with high signal-to-noise ratios.
- Tactile, friendly micro-affordances avoiding clinical sterility while sustaining an authoritative, secure atmosphere.

## Colors

The palette balances vibrant optical presence with WCAG AAA accessibility across structural interfaces:

- **Primary (`#3D5AFE`)**: Electric Indigo. Acts as the primary call-to-action color, driving user progression, active focus borders, and key progression milestones.
- **Secondary (`#00B0FF`)**: Vivid Sky. Deployed sparingly for supplemental accents, interactive progress tracks, and non-blocking notification badges.
- **Tertiary (`#10B981`)**: Mint Emerald. Dedicated to positive feedback, completed password validations, and verified credential statuses.
- **Neutral (`#0F172A`)**: Slate Night. The anchor tone for high-contrast primary text, deep borders, and subtle structural washes (`#F8FAFC` base surface, `#F1F5F9` input fills).

Interactive elements require explicit color shifts:
- Hover states transition primary fills 8% darker (`#304FFE`).
- Disabled controls lock to `#CBD5E1` text over `#F1F5F9` containers.
- Form validation errors exclusively use vibrant Crimson (`#EF4444`) with paired icons to prevent reliance solely on color perception.

## Typography

The type system relies on **Plus Jakarta Sans** across all hierarchies. Its clean geometry delivers corporate dependability while its sculpted terminals and wide apertures impart warmth and human accessibility.

- **Headlines (`display-lg` to `headline-sm`)**: Set with tight, intentional letter-spacing to prevent visual leakage across mobile viewports. Used for welcome banners, step headlines, and validation modals.
- **Body Text (`body-lg` to `body-sm`)**: Features open vertical rhythm for optimal scanability during terms acceptance, tooltips, and contextual microcopy.
- **Form Labels & CTAs (`label-lg` to `label-sm`)**: Rendered in Semibold (`600`) to guarantee unmistakable affordance over variable background cards.

## Layout & Spacing

The layout is built on an **8pt rhythmic base grid**, downscaled to 4pt micro-increments for precision input control styling:

- **Mobile (<640px)**: Single-column fluid layout with dynamic vertical staging. Screen edge margins are constrained to `margin-mobile` (`1.25rem` / `20px`), maximizing thumb-reach area without bleeding across screen edges. Form fields stretch 100% width.
- **Tablet / Large Mobile (640px - 1024px)**: Centers the onboarding module inside a constrained card structure with a maximum width of `480px`, surrounded by `margin-tablet` (`2rem`).
- **Vertical Spacing Rhythm**: Input elements are grouped using `space-xs` (8px) between label and container, `space-lg` (20px) between distinct input groups, and `space-2xl` (32px) preceding primary action buttons.

## Elevation & Depth

Hierarchy uses **ambient tinted shadows** combined with **low-contrast borders** rather than stark drop-shadows:

- **Surface Level 0 (Canvas)**: `#F8FAFC`. Flat, clean, non-reflective baseline.
- **Surface Level 1 (Cards & Modals)**: Pure `#FFFFFF` supported by an ultra-subtle ambient shadow: `0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.02)`, bounded by a 1px border (`#E2E8F0`).
- **Surface Level 2 (Floating Action & Toast Prompts)**: Elevated via `0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px 0 rgba(15, 23, 42, 0.04)`.
- **Primary CTA Depth**: Buttons receive an indigo-tinted glow on interactive resting states: `0 8px 20px -4px rgba(61, 90, 254, 0.35)`, translating down to `0 2px 6px -1px rgba(61, 90, 254, 0.25)` on tap/press.

## Shapes

The design system embraces a **Rounded (Level 2)** shape language:

- Standard controls (text fields, checkboxes, secondary icon containers) employ `rounded` (`0.5rem` / `8px`) corners to communicate structural reliability.
- Key surfaces, elevated sheets, and grouped sign-up containers employ `rounded-lg` (`1rem` / `16px`) to soften visual mass.
- Action items (primary CTA buttons, status badges, social auth pills) adopt dynamic soft radiuses that harmonize with the inner form fields while remaining distinct from the background canvas.

## Components

### Buttons
- **Primary CTA**: Full-width button with height `52px`, background `#3D5AFE`, text `#FFFFFF` (`label-lg`), radius `12px`, and ambient primary glow shadow. On active press, scale translates to `0.985` with deepened color `#304FFE`.
- **Social Auth Buttons**: Height `48px`, background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A` (`label-md`). Displays identity provider icons left-aligned with centered text.
- **Ghost/Tertiary**: Text-only button, `#3D5AFE` font, no background or border, used for skip or back navigation.

### Input Fields
- **Container**: Height `52px`, radius `10px`, background `#FFFFFF`, border `1.5px solid #E2E8F0`, horizontal padding `16px`.
- **Typography**: Entered text set to `body-lg` in `#0F172A`; placeholder text in `#94A3B8`.
- **Focus State**: Border transitions smoothly to `1.5px solid #3D5AFE` with an external glow ring (`box-shadow: 0 0 0 3px rgba(61, 90, 254, 0.12)`).
- **Error State**: Border shifts to `1.5px solid #EF4444` with a red focus ring (`box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12)`), accompanied by a sub-label icon and error message in `body-sm`.

### Checkboxes & Radio Buttons
- **Checkboxes**: Sized `20px x 20px`, radius `6px`. Unchecked state has `1.5px solid #CBD5E1` border over `#FFFFFF`. Checked state applies `#3D5AFE` background with a crisp white checkmark vector.
- **Terms Agreement Group**: Integrates inline links using Semibold weight with primary `#3D5AFE` color and underline on hover.

### Progress & Password Strength Indicator
- **Progress Track**: Segmented horizontal track bar (`4px` height, radius `9999px`) utilizing `#F1F5F9` for unfilled segments.
- **Strength Fill**: Dynamic morphing across Red (`#EF4444`, Weak), Amber (`#F59E0B`, Fair), and Mint Emerald (`#10B981`, Strong), accompanied by immediate inline validation criteria icons.

### Verification Pin Cells
- Four to six separate square cells (`54px x 54px`), radius `12px`, text-align center, `headline-md` weight, auto-advancing focus indicator ring.