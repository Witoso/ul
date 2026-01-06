# 03 Hero Bee

## Goal
Add a controllable hero bee in the grass scene, viewed from above.

## Requirements
- Load the bee sprite from `public/assets/bee.png` (it contains multiple frames of a flying bee).
- Place the bee in the middle of the grass scene when the scene starts.
- Left/Right arrow keys rotate the bee (top-down turning).
- Space bar makes the bee fly forward in the direction it is facing.
- When the bee goes past the scene edge, it appears on the opposite side (wrap like Snake).
- Keep it simple and kid friendly.

## Movement Notes
- Use Phaser keyboard input to read arrow keys and Space.
- Use the bee rotation to decide its forward direction each frame.
- Wrapping can be done by checking scene bounds or using Phaser Arcade World wrapping helpers.

## Out of Scope
- Acceleration, inertia, or advanced physics.
- Collisions with obstacles or enemies.
- Animations beyond the basic sprite.

## Docs References
- Sprite creation: https://docs.phaser.io/api-documentation/class/gameobjects-sprite
- Keyboard input: https://docs.phaser.io/api-documentation/class/input-keyboard-keyboardplugin
- World wrap: https://docs.phaser.io/api-documentation/class/physics-arcade-world
