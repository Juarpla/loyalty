# Design: Social Suggestions Cards UI Component

## 1. Component Architecture
- **File:** `src/components/social/suggestions-cards.component.tsx`
- **Props:** 
  - `suggestions`: Array of suggestion objects, each containing:
    - `id`: string
    - `title`: string
    - `body`: string
    - `hashtags`: string
    - `visualPrompt`: string
- **State:** Keep track of the copied state (boolean) for visual feedback when a user clicks the copy button.

## 2. UI/UX
- Render a list of cards for each suggestion.
- Each card should clearly separate the Title, Body text, Hashtags, and the Visual Prompt.
- Provide a "Copy" button that utilizes the `navigator.clipboard` API.
- The layout should be fully responsive, optimizing for mobile (touch targets, readable text size).
- Use modern styling, e.g. Tailwind CSS, with fluid, clean visual boundaries.
