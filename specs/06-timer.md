# 06 Timer

## Goal
Add a simple timer that starts when the game starts and stops when all flowers are collected.

## Requirements
- Timer starts at 0 when the Grass scene starts.
- Timer stops after the last flower is delivered to the beehive.
- Timer text is in the top-left corner with a little padding (e.g., 12px).
- Timer text is slightly transparent so it doesn't hide the world (e.g., alpha ~0.6).
- The bee should render on top of the timer (timer behind the bee).
- Show tenths of a second (minimum precision) in the timer text.
- Keep it kid-friendly and easy to follow.

## Out of Scope
- High scores or best time saving.
- Countdown timers.
- Game over or win screens tied to the timer.

## Assets
- None.

## Phaser API Notes (from docs)
- `this.time.addEvent(config)` creates a `Phaser.Time.TimerEvent` on the scene clock.
- A `TimerEvent` exposes `getElapsedSeconds()` (seconds) or `elapsed` (ms) to read how long it has been running.
- The event can be stored and read each frame or on a fixed interval to update the UI text.

## Scene/Code Notes
- Implement in `src/game/scenes/Grass.ts` since that is the main gameplay scene.
- Track a `TimerEvent` and a `Text` object on the scene.
- Consider helper methods like `createTimerText()` and `updateTimerText()`.
- Keep scene keys, asset keys, and animation keys in `src/game/constants.ts` (no new keys needed for timer text).

## Implementation Sketch
- In `create()`, call `createTimerText()` and `startTimer()`.
- `startTimer()` uses `this.time.addEvent({ delay: 1000, loop: true })` (or a zero-delay event) and stores the `TimerEvent`.
- `updateTimerText()` reads elapsed seconds, formats as `Time: 12.3s` (tenths) and updates the text.
- When the last flower is delivered (e.g., `flowers.length === 0` and the bee drops off its last flower), stop the timer by pausing it or capturing a final value.

## UI Notes
- Position: top-left with padding.
- Use `setAlpha(0.6)` (or similar) for transparency.
- Set depth so the bee renders above the timer (e.g., timer depth lower than the bee).

## Open Questions
- None for now.
