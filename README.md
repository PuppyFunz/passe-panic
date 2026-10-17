# Passé Panic

Multiplayer French passé composé survival game built with Node.js, Express and Socket.IO.

## Run locally

1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start` and open `http://localhost:3000` in your browser.

## Checks

- `npm test` checks JavaScript syntax and procedural world placement invariants.
- `npm run test:e2e` runs the Playwright end-to-end browser suite. Install the Playwright browser once with `npx playwright install chromium` if needed.
- `GET /health` returns a small server health response.

## Current gameplay features

- Up to 30 players and seven-minute matches.
- Four edge-to-centre ziplines with a ten-second cooldown.
- Four speed relays; zombies reach 225 speed for three seconds when boosting.
- Automatic zombie boosts, a five-second starting freeze, lives/shields, file/crate/computer objectives, score tracking, speed boosts and bandages.
- Procedural four-biome map with obstacles, lakes, file stations, minimap, keyboard and mobile joystick controls.
- Room-code links and QR sharing.

Objective and pickup placement uses a validated open-point search with a deterministic scan fallback; it no longer silently falls back to a hard-coded potentially blocked point.
