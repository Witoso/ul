# 07 Pollen Dust Trail

## Goal
Add a light dust-like particle trail behind the bee when it is **moving** and **carrying pollen**.

## Requirements
- Use the new `public/assets/pollen_dust.png` as the particle texture.
- Emit only while the bee is moving **and** carrying pollen.
- Particles should trail behind the bee (short-lived, light and airy).
- Keep it kid-friendly and easy to follow.

## Out of Scope
- New particle assets beyond `pollen_dust.png`.
- Wind, physics, or complex particle interactions.
- Extra UI or scoring tied to the dust.

## Assets
- `public/assets/pollen_dust.png`

## Phaser API Notes (from docs)
- `this.add.particles(x, y, textureKey, config)` creates a `ParticleEmitter` (Phaser 3.60+).
- Use emitter config with `frequency`, `quantity`, `lifespan`, `speed`, `scale`, `alpha`, `angle` for the dust look.
- You can start/stop emission or set frequency to control flow.

## Scene/Code Notes
- Implement in `src/game/scenes/Grass.ts`.
- Add `ASSET_KEYS.PollenDust` in `src/game/constants.ts` and load in `Preloader`.
- The bee class already exposes `hasFlower()` and `isMoving()`; add a small helper (e.g., `getPosition()` or `getSprite()`) so the emitter can follow the bee.
- Set emitter depth behind the bee (lower depth than `beeDepth`).

## Implementation Sketch
- In `preload`, load the dust texture with `this.load.image(ASSET_KEYS.PollenDust, 'pollen_dust.png')`.
- In `create`, build a particle emitter:
  - `lifespan`: ~400–700ms
  - `speed`: ~20–50
  - `scale`: `{ start: 0.25, end: 0 }`
  - `alpha`: `{ start: 0.6, end: 0 }`
  - `frequency`: ~60–90ms
  - `quantity`: 1–2
  - `angle`: a small spread (e.g., 160–200 deg) so it drifts behind.
- In `update`, if `bee.isMoving()` and `bee.hasFlower()`, ensure emitter is on and positioned behind the bee; otherwise stop emission.

## Open Questions
- Should dust emit only while the bee is moving forward (up key), or also when rotating in place?
- How strong should the trail be (tiny wisps vs. a thicker trail)?
