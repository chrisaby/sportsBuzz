# Design System: High-Velocity Athletics

## 1. Overview & Creative North Star
**Creative North Star: "Kinetic Precision"**

This design system is engineered to capture the raw energy of the stadium and the surgical precision of elite sports data. We are moving away from the "static grid" of traditional sports sites. Instead, our goal is to create a sense of forward momentum. We achieve this through **Kinetic Precision**: a layout philosophy that uses intentional asymmetry, overlapping "glass" layers, and aggressive typographic scales to mimic the movement of an athlete. 

The experience should feel like a high-end broadcast HUD (Heads-Up Display)—immersive, dark, and reactive. By utilizing depth over lines, we ensure the UI never feels like a spreadsheet, but rather a premium editorial experience.

---

## 2. Colors & Surface Philosophy
The palette is built on high-contrast vibrance set against a deep, multi-layered void. 

### The Palette
- **Primary (Electric Blue):** `primary` (#95aaff) and `primary_dim` (#3766ff). Use these for high-action states and brand focal points.
- **Secondary (Neon Lime):** `secondary` (#c3f400). This is our "Hyper-Action" color. Use sparingly for live indicators, "Watch Now" CTAs, and winning score highlights.
- **Neutral Background:** `background` (#0a0e14). A deep, ink-black base that allows neon accents to vibrate.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. They create visual friction and "box in" the energy. 
- **Containment:** Define boundaries using color shifts. A `surface_container_low` card sitting on a `surface` background is all the definition required.
- **Transitions:** Use `surface_container_highest` for hover states rather than adding a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface_container` tiers to create "nested" depth:
1.  **Base Layer:** `background` (#0a0e14).
2.  **Sectional Blocks:** `surface_container_low` (#0f141a) for large news feeds or stat blocks.
3.  **Active Cards:** `surface_container_high` (#1b2028) to pull content toward the user.

### The "Glass & Gradient" Rule
To achieve a "Sleek/Modern" feel, use **Glassmorphism** for floating headers and overlay scores.
- **Formula:** `surface_variant` at 60% opacity + `backdrop-filter: blur(12px)`.
- **Signature Gradients:** For primary CTAs, transition from `primary_dim` (#3766ff) to `primary` (#95aaff) at a 135-degree angle to create a sense of metallic sheen.

---

## 3. Typography
We utilize a dual-font strategy to balance "Athletic Power" with "Data Readability."

- **Display & Headlines (Lexend):** This is our "Athletic" voice. Lexend provides the geometric stability and condensed feel required for scores and bold headlines. Use `display-lg` (3.5rem) for hero news and `headline-lg` (2rem) for game titles.
- **Body & Technical Data (Manrope):** A high-performance sans-serif used for player stats, articles, and small labels. Its modern construction ensures legibility even at `body-sm` (0.75rem) during fast-scrolling live feeds.
- **Hierarchy Hint:** Always pair a `secondary` (Neon Lime) `label-md` uppercase tag above a `display-sm` headline to create an "Editorial Kicker" effect.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not shadows.

- **The Layering Principle:** To lift a score card, do not reach for a drop shadow. Instead, place a `surface_container_highest` card atop a `surface_container_low` background. The difference in luminance creates a natural, sophisticated lift.
- **Ambient Shadows:** Shadows are reserved only for "floating" elements (e.g., Modals, Tooltips). Use a `40px` blur at 8% opacity, tinted with `primary` (#95aaff). This mimics the glow of a stadium screen rather than a generic grey shadow.
- **The "Ghost Border" Fallback:** If a layout requires extreme definition (e.g., a dark image on a dark background), use a "Ghost Border": `outline_variant` at 15% opacity.

---

## 5. Components

### Cards & News Feeds (The Core)
- **Rule:** Absolute prohibition of divider lines.
- **Styling:** Use `xl` (0.75rem) rounded corners. For Live Scores, use a `surface_container_high` background. Use vertical white space (32px+) to separate news stories.
- **Live Indicator:** Use `secondary` (Neon Lime) for a pulsing dot next to "LIVE" text in `label-sm`.

### Buttons
- **Primary:** Gradient fill (`primary_dim` to `primary`), `md` (0.375rem) rounded corners. Text color: `on_primary` (#00247e).
- **Secondary (The "Outlined" Look):** No fill. Use a `Ghost Border` (20% opacity `outline`) with `primary` text.
- **Tertiary:** Transparent background, `label-md` bold text with a 2px underline in `secondary`.

### Live Score Chips
- Small, pill-shaped (`full` roundedness). 
- Background: `surface_variant`. 
- Content: Team abbreviation and score. Use `secondary` for the leading team's score to provide immediate visual hierarchy.

### Input Fields
- Background: `surface_container_lowest`.
- Border: No border, only a 2px bottom-accent in `primary` when focused.
- Corner: `sm` (0.125rem) to keep the "Technical" athletic aesthetic.

### Additional Component: "The Momentum Gauge"
- A custom data visualization component for game flow. 
- A horizontal bar using a gradient from `primary` to `secondary`. Use `surface_bright` as the track color to ensure the "Neon" pops.

---

## 6. Do's and Don'ts

### Do
- **Do** use `secondary` (Neon Lime) exclusively for "Success," "Live," or "Action" states. It is a high-energy tool; don't dull it by overusing it for static text.
- **Do** lean into asymmetry. Offsetting an image in a news card so it breaks the container's top boundary creates "Kinetic" energy.
- **Do** prioritize `surface_container` shifting over borders.

### Don't
- **Don't** use 100% opaque white text on black. Use `on_surface_variant` (#a8abb3) for secondary information to maintain visual comfort.
- **Don't** use "standard" drop shadows. They look muddy on dark OLED-optimized backgrounds.
- **Don't** use sharp 0px corners. This isn't "Retro Brutalism"; it's high-end performance. Use the `md` or `xl` tokens to keep the UI feeling "engineered."
- **Don't** use dividers between list items. Use 12px or 16px of vertical gap and a background color hover state.
