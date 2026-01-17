# 05 Collect Flowers

## Goal
Let the bee pick up one flower at a time and deliver it to the beehive.

## Requirements
- Bee can carry at most one flower (inventory = empty or 1).
- Bee collects a flower when it flies into it (simple collision check).
- Bee delivers the carried flower when it flies into the beehive.
- No visual inventory UI yet.
- Keep things kid-friendly and easy to follow.

## Out of Scope
- Scoring, timers, or win/lose states.
- Flower respawning.
- Visual UI for the carried flower.

## Assets
- Beehive: `public/assets/beehive.png`
- Flowers: `public/assets/clover.png`, `daisy.png`, `dandelion.png`, `lavender.png`, `sunflower.png`

## Scene/Code Notes
- Grass scene owns object creation.
- Consider small classes for `Beehive` and `Flower` in `src/game/objects/`.
- Keep asset/scene keys centralized in `src/game/constants.ts`.

## Collision Plan
- Use simple distance-based overlap checks in `update`.
- Treat collisions as circle-based with a small radius per object.
- Only collect if bee inventory is empty.
- Deliver only if bee is carrying a flower.

## Open Questions
- What pickup/delivery radius feels right (e.g., 30–40px)?
- Should collected flowers disappear or be hidden?
