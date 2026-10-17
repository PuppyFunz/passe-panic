"use strict";
const assert = require("node:assert/strict");
const World = require("../world");
for (let seed = 1; seed <= 60; seed++) {
  const w = World.generateWorld(seed);
  assert.equal(w.width, 4000); assert.equal(w.height, 4000);
  assert.equal(w.elevations.length, 2);
  const collisionWorld = { walls: [], decor: [], elevations: [{ x: 100, y: 100, w: 100, h: 100, level: 1, ramps: [{ x: 130, y: 80, w: 30, h: 140 }] }] };
  assert.equal(World.canMove(collisionWorld, 90, 110, 105, 110), false, "cliff blocks entry away from ramp");
  assert.equal(World.canMove(collisionWorld, 140, 90, 140, 105), true, "ramp permits elevation transition");
  assert.equal(w.stations.length, 10); assert.equal(w.relays.length, 4); assert.equal(w.ziplines.length, 6);
  assert.ok(w.decor.length > 0, `decor missing seed=${seed}`);
  assert.ok(w.decor.every(d => Number.isFinite(d.x) && Number.isFinite(d.y) && d.t), `invalid decor seed=${seed}`);
  for (const p of World.SPAWN_POINTS) {
    assert.ok(!World.insideWall(w, p.x, p.y), `spawn blocked seed=${seed} at ${p.x},${p.y}`);
    assert.ok(!World.inWater(w, p.x, p.y), `spawn in water seed=${seed}`);
    assert.ok(!World.insideDecor(w, p.x, p.y), `spawn blocked by decor seed=${seed} at ${p.x},${p.y}`);
  }
  const taken = [...w.stations];
  for (let i = 0; i < 30; i++) {
    const p = World.openPoint(w, taken, 220);
    assert.ok(p.x >= 160 && p.x <= 3840 && p.y >= 160 && p.y <= 3840);
    assert.ok(!World.insideWall(w, p.x, p.y)); assert.ok(!World.inWater(w, p.x, p.y));
    assert.ok(Math.hypot(p.x - w.guide.x, p.y - w.guide.y) >= 340);
    taken.push(p);
  }
}
console.log("World tests passed: 60 seeds, edge spawns, stations, and 1,800 valid open-point placements.");
