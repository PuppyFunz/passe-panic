# Passé Panic (rebuilt)

A browser-based multiplayer French passé composé game using Express and Socket.IO.

## Included
- Room codes, lobby, up to 8 players
- 5-minute timer, scoreboard, win screen
- Individual computer objective per player
- File stations requiring the correct pronoun + conjugated auxiliary
- An assigned password crate with four past-participle choices
- Correct file + password submitted at the player's computer for 1 point
- A new objective, computer, and crate after each completed objective
- Correct answers give a temporary speed boost
- A 10-second shield timer hook for hits
- Top-down scrolling map, keyboard controls, and mobile directional controls

## Run
Node.js 18+: `npm install` then `npm start`; open `http://localhost:3000`.

## Deploy on Render
Upload these files to a GitHub repository with `package.json` and `server.js` at the root, plus the `public` folder. In Render choose New > Web Service and set Build Command `npm install` and Start Command `npm start`.

## Prototype notes
- The hit shield is implemented as a server event hook, but there is no built-in enemy/hazard that automatically hits players yet.
- Room data is in memory and clears if the server restarts.
- Collision is simple and the grammar agreement rules are a learning-game simplification. Review/test the game before using it for graded French work.
