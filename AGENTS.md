# Project Agents Guide

## Intro
- This is a toy project built with my kids. We are making a fun game with a bee flying around.
- Keep everything kid friendly and easy to understand.

## Specs First
- We will create a spec before major changes.
- Use the `specs/` folder for specs.
- Name each spec file with a leading number and short description, e.g., `01-info-and-more.md`.

## Stack
- Phaser 3 + Vite + TypeScript.
- Use `pnpm run dev` to run the project.
- You may use the Chrome MCP to inspect how the project runs.
- You have Context7 MCP available; use it to check Phaser docs when needed.
- Dev server is already running in the background at `http://localhost:8080/`.

## Workflow Rules
- Keep changes small and focused.
- Small commits are OK when asked to commit.
- If you need assets (sprites, audio, etc.), ask before inventing them.

## Architecture Notes
- Keep scene keys, asset keys, and animation keys centralized in `src/game/constants.ts` to avoid string drift.
- Prefer small helper methods in scenes (e.g., `createBackground`, `createBee`, `handleInput`, `wrapBee`) for clarity.
- Use the standard Phaser scene lifecycle (`init`, `preload`, `create`, `update`) and keep input/movement in `update`.
- For game objects (bee, flowers, beehive), prefer small classes in `src/game/objects/` with `update()` and scene-owned construction.

## Scope
- Work only within this repository.
