# Passé Panic

A real-time multiplayer French passé composé game built with Express and Socket.IO.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000` in a browser. Create a room, invite at least one other player, and start the match.

## Render deployment

- Build command: `npm install`
- Start command: `npm start`
- Root directory: leave blank when `package.json` is in the repository root.

The app serves the browser game from `public/`. Rooms are held in memory and reset when the server restarts.

## Controls

Use WASD or arrow keys on desktop, or the on-screen analog joystick on mobile. Press E/Space or tap INTERACT near a station, your crate, or your computer.

## Gameplay

Collect a grammar file from a file station by entering the required pronoun and auxiliary, answer the assigned crate's past-participle quiz, then bring both items to your computer to score. The computer has an objective directory; crates remain password quizzes. Your objective card displays the English meaning of the assigned verb and target sentence.


## Latest map and zombie updates
- Expanded arena to 2400 × 1600 with more file stations and stone-wall obstacles.
- Every player can see all crates; interacting with another player’s crate applies a 5-second slow. Infinitif labels are larger.
- Zombies move at 150 speed and must answer a passé composé past-participle question to take a life. Converting a player awards +1 point.
- Matches start with one zombie at 12 or fewer players, and two zombies when there are more than 12 players.


## Latest update
- Zombie challenge prompt is formatted as `What is the participe passé of VERB:`.
- The match ends immediately if every player becomes a zombie.
- Hosts can choose a random starting zombie or select a specific player; with more than 12 players, a second zombie is selected randomly.
- Added synthesized spooky background music and sound effects for challenges, correct/incorrect answers, hits, conversions, points, and game over. Sounds begin after a user interaction because browsers restrict autoplay.


Latest update: rounds last 7 minutes. During the final 2 minutes, zombies move at the standard player speed. Zombie name labels display the player username. A central guidance station lets living players activate directional arrows toward their own crate and computer; zombies continuously see an arrow toward the closest living player.
