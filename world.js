"use strict";

// Deterministic procedural arena for Passé Panic. Every generated location is validated
// against walls, lakes, the central hub, stations, relays and already-placed objectives.
const MAP = Object.freeze({ width: 3600, height: 3600 });
const RING_R = 1190;
const CENTER = { x: 1800, y: 1800 };
const SPAWN_POINTS = [];
for (let y = 420; y < 3300; y += 480) SPAWN_POINTS.push({ x: 100, y }, { x: MAP.width - 100, y });
for (let x = 420; x < 3300; x += 480) SPAWN_POINTS.push({ x, y: 100 }, { x, y: MAP.height - 100 });

function rngFor(seed) {
  let a = (Number(seed) >>> 0) || 1;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function insideWall(world, x, y, pad = 18) {
  return world.walls.some(w => x >= w.x - pad && x <= w.x + w.w + pad && y >= w.y - pad && y <= w.y + w.h + pad);
}
function inWater(world, x, y) {
  return world.lakes.some(l => { const dx = (x - l.x) / l.rx, dy = (y - l.y) / l.ry; return dx * dx + dy * dy < 1; });
}
function inHub(x, y, radius = 360) { return Math.hypot(x - CENTER.x, y - CENTER.y) < radius; }
function nearLake(world, x, y, pad = 55) {
  return world.lakes.some(l => { const dx = (x - l.x) / (l.rx + pad), dy = (y - l.y) / (l.ry + pad); return dx * dx + dy * dy < 1; });
}
function clearPoint(world, x, y, taken = [], separation = 0) {
  if (x < 160 || y < 160 || x > MAP.width - 160 || y > MAP.height - 160) return false;
  if (insideWall(world, x, y, 28) || inWater(world, x, y) || nearLake(world, x, y, 55) || inHub(x, y, 340)) return false;
  if (world.relays.some(r => Math.hypot(r.x - x, r.y - y) < 150)) return false;
  if (world.ziplines.some(z => pointSegmentDistance({ x, y }, z.x, z.y, z.endX, z.endY) < 58)) return false;
  const existing = [...world.stations, ...taken];
  return existing.every(p => Math.hypot(p.x - x, p.y - y) >= separation);
}
function pointSegmentDistance(p, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((p.x - x1) * dx + (p.y - y1) * dy) / l2)) : 0;
  return Math.hypot(p.x - (x1 + t * dx), p.y - (y1 + t * dy));
}
function openPoint(world, taken = [], separation = 0) {
  const random = world._random || Math.random;
  const existing = [...world.stations, ...taken];
  for (let i = 0; i < 1600; i++) {
    const x = 180 + random() * (MAP.width - 360), y = 180 + random() * (MAP.height - 360);
    if (clearPoint(world, x, y, existing, separation)) return { x: Math.round(x), y: Math.round(y) };
  }
  // Guaranteed deterministic scan fallback; never return the old unsafe (400,400) point.
  for (let y = 200; y <= MAP.height - 200; y += 70) for (let x = 200; x <= MAP.width - 200; x += 70) {
    if (clearPoint(world, x, y, existing, separation)) return { x, y };
  }
  // If the map is genuinely full, relax only spacing from other items, never walls/water/hub.
  for (let y = 200; y <= MAP.height - 200; y += 45) for (let x = 200; x <= MAP.width - 200; x += 45) {
    if (x < 240 || y < 240 || x > MAP.width - 240 || y > MAP.height - 240) continue;
    if (!insideWall(world, x, y, 24) && !inWater(world, x, y) && !nearLake(world, x, y, 30) && !inHub(x, y, 340) && !world.relays.some(r => Math.hypot(r.x-x,r.y-y)<130)) return { x, y };
  }
  throw new Error("World has no valid open point left; reduce generated objectives/obstacles.");
}
function generateWorld(seed = Date.now()) {
  const random = rngFor(seed);
  const world = { width: MAP.width, height: MAP.height, guide: { id: "guide", x: CENTER.x, y: CENTER.y, label: "CENTRAL GUIDE" }, walls: [], lakes: [], stations: [], ziplines: [], relays: [], _random: random };
  world.relays = [
    { id: "relay-n", x: 1800, y: 520, label: "NORTH RELAY" },
    { id: "relay-e", x: 3080, y: 1800, label: "EAST RELAY" },
    { id: "relay-s", x: 1800, y: 3080, label: "SOUTH RELAY" },
    { id: "relay-w", x: 520, y: 1800, label: "WEST RELAY" },
  ];
  world.ziplines = [
    { id: "zip-n", x: 1800, y: 100, endX: 1800, endY: 1600, label: "NORTH" },
    { id: "zip-e", x: 3500, y: 1800, endX: 2000, endY: 1800, label: "EAST" },
    { id: "zip-s", x: 1800, y: 3500, endX: 1800, endY: 2000, label: "SOUTH" },
    { id: "zip-w", x: 100, y: 1800, endX: 1600, endY: 1800, label: "WEST" },
  ];
  // The four themed biomes use distinct obstacle types, while leaving edge spawns and zipline corridors open.
  const specs = [
    { kind: "lab", x: 520, y: 300, w: 260, h: 180, fill: "#d2e0e2", edge: "#657e89" },
    { kind: "lab", x: 1120, y: 360, w: 300, h: 170, fill: "#d2e0e2", edge: "#657e89" },
    { kind: "lab", x: 2250, y: 360, w: 300, h: 180, fill: "#d2e0e2", edge: "#657e89" },
    { kind: "lab", x: 2850, y: 650, w: 230, h: 200, fill: "#d2e0e2", edge: "#657e89" },
    { kind: "ruin", x: 2670, y: 1150, w: 300, h: 210, fill: "#aeb89d", edge: "#626e54" },
    { kind: "ruin", x: 3000, y: 2250, w: 250, h: 230, fill: "#aeb89d", edge: "#626e54" },
    { kind: "ruin", x: 2420, y: 2780, w: 300, h: 170, fill: "#aeb89d", edge: "#626e54" },
    { kind: "hedge", x: 500, y: 2760, w: 290, h: 190, fill: "#83b878", edge: "#367447" },
    { kind: "hedge", x: 980, y: 2300, w: 260, h: 210, fill: "#83b878", edge: "#367447" },
    { kind: "hedge", x: 720, y: 1050, w: 270, h: 190, fill: "#83b878", edge: "#367447" },
    { kind: "rock", x: 280, y: 1640, w: 230, h: 270, fill: "#c0c8c0", edge: "#6d7a74" },
    { kind: "rock", x: 950, y: 1650, w: 240, h: 260, fill: "#c0c8c0", edge: "#6d7a74" },
    { kind: "rock", x: 1250, y: 2750, w: 260, h: 180, fill: "#c0c8c0", edge: "#6d7a74" },
  ];
  world.walls = specs.map(w => ({ ...w }));
  const lakes = [
    [530, 690, 125, 82], [1480, 760, 135, 90], [2470, 820, 150, 100],
    [3180, 1450, 120, 170], [3000, 3000, 150, 100], [2050, 2860, 135, 85],
    [950, 3100, 150, 95], [420, 2320, 100, 145], [1350, 1250, 100, 75],
  ];
  for (const [x,y,rx,ry] of lakes) {
    if (Math.hypot(x-CENTER.x,y-CENTER.y) < 520) continue;
    if (world.ziplines.some(z => pointSegmentDistance({x,y},z.x,z.y,z.endX,z.endY) < rx+100)) continue;
    if (world.walls.some(w => x+rx>w.x-30 && x-rx<w.x+w.w+30 && y+ry>w.y-30 && y-ry<w.y+w.h+30)) continue;
    world.lakes.push({ x, y, rx, ry });
  }
  const used = [];
  // Spread stations across all four quadrants and validate each placement.
  const stationZones = [
    { x0: 260, x1: 1550, y0: 260, y1: 1500 }, { x0: 2050, x1: 3340, y0: 260, y1: 1500 },
    { x0: 2050, x1: 3340, y0: 2100, y1: 3340 }, { x0: 260, x1: 1550, y0: 2100, y1: 3340 },
  ];
  for (let i = 0; i < 10; i++) {
    let pt = null; const z = stationZones[i % stationZones.length];
    for (let n = 0; n < 800; n++) { const x = z.x0 + random() * (z.x1-z.x0), y = z.y0 + random() * (z.y1-z.y0); if (clearPoint(world,x,y,used,250)) { pt={x:Math.round(x),y:Math.round(y)}; break; } }
    if (!pt) pt = openPoint(world, used, 250);
    used.push(pt); world.stations.push({ id: "file-" + (i+1), x: pt.x, y: pt.y, label: "FILE STATION " + (i+1) });
  }
  delete world._random;
  return world;
}
module.exports = { MAP, RING_R, SPAWN_POINTS, generateWorld, openPoint, insideWall, inWater };
