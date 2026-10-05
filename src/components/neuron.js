// neuron.js
// A procedurally grown neuron, drawn like Leonardo's anatomical studies.
// Dendrites reach from the soma to a set of tips. Inputs arrive at the tips
// and travel inward, charging the soma; past a threshold it fires and sends
// action potentials back out (a leaky integrate-and-fire neuron).
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Points,
  PointsMaterial,
  Vector3,
} from 'three';
import { TRAIL, makeMaterial, makePoints, vertexKey } from './signals';

const SOMA_RADIUS = 0.15;
const PATH_SAMPLES = 28;
const MAX_SEGMENTS = 110;
const MAX_PULSES = 18;

const GROW_RATE = 1 / 2.4; // growth-fractions per second
const RETRACT_RATE = 1 / 1.6;
const HOLD_MIN = 12;
const HOLD_MAX = 26;

const INJECT_CHANCE = 0.4; // share of external arrivals that travel inward
const TIP_FLASH_DECAY = 3;
const CHARGE_PER_PULSE = 0.3;
const LEAK = 0.12; // potential lost per second
const FIRE_DECAY = 2.2;

const rand = (a, b) => a + Math.random() * (b - a);

// Any two unit vectors perpendicular to `dir`.
function basis(dir) {
  const helper = Math.abs(dir.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
  const u = new Vector3().crossVectors(dir, helper).normalize();
  const v = new Vector3().crossVectors(dir, u).normalize();
  return [u, v];
}

// Wobbly path from the soma surface to the tip; displacement tapers to zero
// at both ends so it always meets the soma and the vertex exactly.
function mainPath(tip) {
  const dir = tip.clone().normalize();
  const start = dir.clone().multiplyScalar(SOMA_RADIUS);
  const [u, v] = basis(dir);
  const waves = Array.from({ length: 2 }, (_, k) => ({
    au: rand(0.06, 0.16) / (k + 1),
    av: rand(0.06, 0.16) / (k + 1),
    fu: rand(1, 2.5) * (k + 1),
    fv: rand(1, 2.5) * (k + 1),
    pu: rand(0, Math.PI * 2),
    pv: rand(0, Math.PI * 2),
  }));
  return Array.from({ length: PATH_SAMPLES }, (_, i) => {
    const s = i / (PATH_SAMPLES - 1);
    const taper = Math.sin(Math.PI * s);
    const p = start.clone().lerp(tip, s);
    waves.forEach((w) => {
      p.addScaledVector(u, taper * w.au * Math.sin(w.fu * Math.PI * s + w.pu));
      p.addScaledVector(v, taper * w.av * Math.sin(w.fv * Math.PI * s + w.pv));
    });
    return p;
  });
}

// Short curved side branch, optionally with one sub-branch.
function twig(origin, tangent, length, depth, segments, birth, span) {
  const [u, v] = basis(tangent);
  const angle = rand(0, Math.PI * 2);
  const side = u.clone().multiplyScalar(Math.cos(angle)).addScaledVector(v, Math.sin(angle));
  let dir = tangent.clone().multiplyScalar(rand(0.3, 0.8)).add(side).normalize();
  const bend = side.clone().multiplyScalar(rand(-0.25, 0.25));
  const steps = depth === 0 ? 6 : 4;
  let prev = origin.clone();
  for (let j = 0; j < steps; j++) {
    dir = dir.clone().add(bend.clone().multiplyScalar(1 / steps)).normalize();
    const next = prev.clone().addScaledVector(dir, length / steps);
    const b = birth + ((j + 1) / steps) * span;
    segments.push({ a: prev, b: next, birth: b, alpha: depth === 0 ? 0.42 : 0.3 });
    if (depth === 0 && j === 2 && Math.random() < 0.6) {
      twig(next, dir, length * 0.5, 1, segments, b, span * 0.6);
    }
    prev = next;
  }
}

// Builds one dendrite's segments, each tagged with when it appears (0..1).
function grow(tip) {
  const path = mainPath(tip);
  const segments = [];
  for (let i = 0; i < PATH_SAMPLES - 1; i++) {
    segments.push({ a: path[i], b: path[i + 1], birth: ((i + 1) / (PATH_SAMPLES - 1)) * 0.82, alpha: 0.7 });
  }
  const twigs = Math.floor(rand(3, 6));
  for (let k = 0; k < twigs; k++) {
    const i = Math.floor(rand(0.18, 0.85) * (PATH_SAMPLES - 1));
    const tangent = path[i + 1].clone().sub(path[i]).normalize();
    twig(path[i], tangent, rand(0.12, 0.3), 0, segments, (i / (PATH_SAMPLES - 1)) * 0.82, 0.18);
  }
  segments.sort((x, y) => x.birth - y.birth);
  return { path, segments: segments.slice(0, MAX_SEGMENTS) };
}

export function createNeuron(tips, { inkColor, pulseColor, pixelRatio = 1, size = 14, animate = true, inputRate = 0, onFire }) {
  const group = new Group();
  const ink = new Color(inkColor);

  const lineMaterial = new LineBasicMaterial({ vertexColors: true, transparent: true });
  const dendrites = tips.map((tipArray) => {
    const tip = new Vector3(...tipArray);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(MAX_SEGMENTS * 6), 3));
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(MAX_SEGMENTS * 8), 4));
    const lines = new LineSegments(geometry, lineMaterial);
    lines.frustumCulled = false;
    group.add(lines);
    const d = { tip, key: vertexKey(...tipArray), geometry, phase: 'grow', g: 0, timer: 0 };
    reshape(d);
    if (animate) {
      d.timer = -rand(0, 1.2); // stagger the first growth
    } else {
      d.phase = 'hold';
      d.g = 1;
    }
    setDrawn(d);
    return d;
  });
  const byKey = new Map(dendrites.map((d) => [d.key, d]));

  function reshape(d) {
    const { path, segments } = grow(d.tip);
    const pos = d.geometry.getAttribute('position');
    const col = d.geometry.getAttribute('color');
    segments.forEach((seg, i) => {
      pos.setXYZ(i * 2, seg.a.x, seg.a.y, seg.a.z);
      pos.setXYZ(i * 2 + 1, seg.b.x, seg.b.y, seg.b.z);
      col.setXYZW(i * 2, ink.r, ink.g, ink.b, seg.alpha);
      col.setXYZW(i * 2 + 1, ink.r, ink.g, ink.b, seg.alpha);
    });
    pos.needsUpdate = true;
    col.needsUpdate = true;
    d.path = path;
    d.births = segments.map((seg) => seg.birth);
  }

  function setDrawn(d) {
    let n = 0;
    while (n < d.births.length && d.births[n] <= d.g) n++;
    d.geometry.setDrawRange(0, n * 2);
  }

  // Soma: three ink rings, a nucleus, and a glow that shows charge and firing.
  const soma = new Group();
  const ringMaterial = new LineBasicMaterial({ color: inkColor, transparent: true, opacity: 0.8 });
  const ringGeometry = new BufferGeometry().setFromPoints(
    Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      return new Vector3(Math.cos(a) * SOMA_RADIUS, Math.sin(a) * SOMA_RADIUS, 0);
    }),
  );
  [[0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, Math.PI / 4]].forEach(([x, y, z]) => {
    const ring = new LineLoop(ringGeometry, ringMaterial);
    ring.rotation.set(x, y, z);
    soma.add(ring);
  });
  const nucleusGeometry = new BufferGeometry().setFromPoints([new Vector3()]);
  const nucleusMaterial = new PointsMaterial({ color: inkColor, size: 0.07 });
  soma.add(new Points(nucleusGeometry, nucleusMaterial));
  group.add(soma);

  const glowMaterial = makeMaterial(pulseColor, pixelRatio);
  const glow = makePoints(1, glowMaterial);
  group.add(glow);

  // Terminals: ink dots at grown tips, plus a glow when a signal arrives or leaves.
  const terminalMaterial = makeMaterial(inkColor, pixelRatio);
  const terminals = makePoints(dendrites.length, terminalMaterial);
  const tipGlow = makePoints(dendrites.length, glowMaterial);
  dendrites.forEach((d, i) => {
    terminals.geometry.getAttribute('position').setXYZ(i, d.tip.x, d.tip.y, d.tip.z);
    tipGlow.geometry.getAttribute('position').setXYZ(i, d.tip.x, d.tip.y, d.tip.z);
    d.flash = 0;
  });
  group.add(terminals, tipGlow);

  // Pulses travelling along dendrites: dir -1 = inward to soma, +1 = outward to tip.
  const pulses = makePoints(MAX_PULSES * TRAIL, glowMaterial);
  group.add(pulses);
  const active = [];
  let potential = 0;
  let fire = 0;

  const send = (d, dir) => {
    if (active.length >= MAX_PULSES || d.phase !== 'hold') return;
    active.push({ d, dir, s: dir < 0 ? 1 : 0, rate: rand(0.8, 1.1) });
  };

  // Called when an external signal reaches a tip.
  const receive = (vertex) => {
    const d = byKey.get(vertexKey(...vertex));
    if (d && Math.random() < INJECT_CHANCE) send(d, -1);
  };

  // Spontaneous synaptic input at a random fully grown tip.
  const stimulate = () => {
    const grown = dendrites.filter((d) => d.phase === 'hold');
    if (!grown.length) return;
    const d = grown[Math.floor(Math.random() * grown.length)];
    d.flash = 1;
    send(d, -1);
  };

  const sample = (path, s) => {
    const f = Math.min(Math.max(s, 0), 1) * (path.length - 1);
    const i = Math.min(Math.floor(f), path.length - 2);
    return path[i].clone().lerp(path[i + 1], f - i);
  };

  const update = (dt, time) => {
    if (Math.random() < inputRate * dt) stimulate();

    dendrites.forEach((d) => {
      d.timer += dt;
      if (d.phase === 'grow' && d.timer > 0) {
        d.g = Math.min(1, d.g + dt * GROW_RATE);
        if (d.g === 1) { d.phase = 'hold'; d.timer = -rand(HOLD_MIN, HOLD_MAX); }
      } else if (d.phase === 'hold' && d.timer > 0) {
        d.phase = 'retract';
      } else if (d.phase === 'retract') {
        d.g = Math.max(0, d.g - dt * RETRACT_RATE);
        if (d.g === 0) { reshape(d); d.phase = 'grow'; d.timer = -rand(0.3, 1.5); }
      }
      setDrawn(d);
    });

    // Move pulses; drop any whose dendrite started retracting.
    for (let i = active.length - 1; i >= 0; i--) {
      const p = active[i];
      p.s += p.dir * dt * p.rate;
      if (p.d.phase === 'retract') { active.splice(i, 1); continue; }
      if (p.dir < 0 && p.s <= 0) {
        potential += CHARGE_PER_PULSE;
        active.splice(i, 1);
      } else if (p.dir > 0 && p.s >= 1) {
        p.d.flash = 1;
        onFire?.([p.d.tip.x, p.d.tip.y, p.d.tip.z]);
        active.splice(i, 1);
      }
    }

    potential = Math.max(0, potential - dt * LEAK);
    if (potential >= 1) {
      potential = 0;
      fire = 1;
      const grown = dendrites.filter((d) => d.phase === 'hold');
      for (let k = 0; k < 2 && grown.length; k++) {
        send(grown.splice(Math.floor(Math.random() * grown.length), 1)[0], 1);
      }
    }
    fire = Math.max(0, fire - dt * FIRE_DECAY);

    soma.scale.setScalar(1 + 0.12 * potential + 0.35 * fire);
    soma.rotation.y = time * 0.4;
    glow.geometry.getAttribute('aSize').setX(0, size * (1.2 + 1.5 * potential + 4 * fire));
    glow.geometry.getAttribute('aAlpha').setX(0, Math.max(0.25 * potential, fire));

    const termSizes = terminals.geometry.getAttribute('aSize');
    const termAlphas = terminals.geometry.getAttribute('aAlpha');
    const glowSizes = tipGlow.geometry.getAttribute('aSize');
    const glowAlphas = tipGlow.geometry.getAttribute('aAlpha');
    dendrites.forEach((d, i) => {
      d.flash = Math.max(0, d.flash - dt * TIP_FLASH_DECAY);
      const grown = Math.min(1, Math.max(0, (d.g - 0.9) * 10));
      termSizes.setX(i, size * 0.55);
      termAlphas.setX(i, 0.85 * grown);
      glowSizes.setX(i, size * (1 + 1.8 * d.flash));
      glowAlphas.setX(i, 0.9 * d.flash);
    });
    [termSizes, termAlphas, glowSizes, glowAlphas].forEach((attr) => { attr.needsUpdate = true; });

    const pos = pulses.geometry.getAttribute('position');
    const sizes = pulses.geometry.getAttribute('aSize');
    const alphas = pulses.geometry.getAttribute('aAlpha');
    for (let i = 0; i < MAX_PULSES; i++) {
      const p = active[i];
      for (let k = 0; k < TRAIL; k++) {
        const j = i * TRAIL + k;
        if (!p) { alphas.setX(j, 0); continue; }
        const q = sample(p.d.path, p.s - p.dir * k * 0.035);
        pos.setXYZ(j, q.x, q.y, q.z);
        const fade = 1 - k / TRAIL;
        sizes.setX(j, size * (k === 0 ? 1 + 0.2 * Math.sin(time * 8 + i) : 0.4 + 0.4 * fade));
        alphas.setX(j, k === 0 ? 1 : 0.5 * fade * fade);
      }
    }
    [glow.geometry.getAttribute('aSize'), glow.geometry.getAttribute('aAlpha'), pos, sizes, alphas]
      .forEach((attr) => { attr.needsUpdate = true; });
  };

  const dispose = () => {
    dendrites.forEach((d) => d.geometry.dispose());
    [ringGeometry, nucleusGeometry, glow.geometry, pulses.geometry, terminals.geometry, tipGlow.geometry].forEach((g) => g.dispose());
    [lineMaterial, ringMaterial, nucleusMaterial, glowMaterial, terminalMaterial].forEach((m) => m.dispose());
  };

  return { object: group, update, receive, dispose };
}
