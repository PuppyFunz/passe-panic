"use strict";
const assert = require("node:assert/strict");
const World = require("../world");
for (let seed = 1; seed <= 60; seed++) {
  const w = World.generateWorld(seed);
  assert.equal(w.width, 3600); assert.equal(w.height, 3600);
  assert.equal(w.stations.length, 10); assert.equal(w.relays.length, 4); assert.equal(w.ziplines.length, 4);
  for (const p of World.SPAWN_POINTS) {
    assert.ok(!World.insideWall(w, p.x, p.y), `spawn blocked seed=${seed} at ${p.x},${p.y}`);
    assert.ok(!World.inWater(w, p.x, p.y), `spawn in water seed=${seed}`);
  }
  const taken = [...w.stations];
  for (let i = 0; i < 30; i++) {
    const p = World.openPoint(w, taken, 220);
    assert.ok(p.x >= 160 && p.x <= 3440 && p.y >= 160 && p.y <= 3440);
    assert.ok(!World.insideWall(w, p.x, p.y)); assert.ok(!World.inWater(w, p.x, p.y));
    assert.ok(Math.hypot(p.x - w.guide.x, p.y - w.guide.y) >= 340);
    taken.push(p);
  }
}
console.log("World tests passed: 60 seeds, edge spawns, stations, and 1,800 valid open-point placements.");
