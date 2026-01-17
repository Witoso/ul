## Summary
Show a beehive and five flowers on the grass board at the start of the game.

## Goals
- On scene start, place 1 beehive at a random spot on the grass board.
- Place 5 flowers at random spots chosen from the available flower types.
- Keep all items away from the board edges with a clear margin.
- Keep flowers a bit farther from the beehive (simple spacing, no collisions yet).

## Non-Goals
- No collision or collection logic.
- No animations or movement changes.

## Assets
- Beehive: `public/assets/beehive.png`
- Flowers (random pick from types):
  - `public/assets/clover.png`
  - `public/assets/daisy.png`
  - `public/assets/dandelion.png`
  - `public/assets/lavender.png`
  - `public/assets/sunflower.png`

## Placement Rules
- Use a board margin so items never appear at the screen edge.
- Use a minimum distance from the beehive for flower placement.
- If a random pick lands too close, retry a few times then accept the last pick.

## Open Questions
- Which scene should place these items (likely the grass scene)?
- What margins and minimum distance should we use (e.g., 40px edge margin, 80px from beehive)?
