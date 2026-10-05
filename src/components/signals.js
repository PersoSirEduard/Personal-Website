// signals.js
// Pulses that random-walk along a wireframe's edges, lighting up each vertex
// they reach, like activations travelling through a neural network.
import { BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial } from 'three';

export const TRAIL = 6; // samples per pulse, head first
const TRAIL_SPACING = 0.07; // in edge-fractions between trail samples
const FLASH_DECAY = 3.5; // per second

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (7.0 / -mv.z);
    vAlpha = aAlpha;
  }
`;

// Soft dot: a solid core plus a faint halo.
const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.2, 0.05, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.3;
    float a = (core + halo) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

// Turns EdgesGeometry's flat segment list into shared vertices + adjacency.
function buildGraph(edgesGeometry) {
  const pos = edgesGeometry.getAttribute('position');
  const vertices = [];
  const index = new Map();
  const neighbors = [];
  const vertexId = (i) => {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const key = vertexKey(x, y, z);
    if (!index.has(key)) {
      index.set(key, vertices.length);
      vertices.push([x, y, z]);
      neighbors.push([]);
    }
    return index.get(key);
  };
  for (let i = 0; i < pos.count; i += 2) {
    const a = vertexId(i);
    const b = vertexId(i + 1);
    neighbors[a].push(b);
    neighbors[b].push(a);
  }
  return { vertices, neighbors, index };
}

export function makeMaterial(color, pixelRatio) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new Color(color) },
      uPixelRatio: { value: pixelRatio },
    },
  });
}

export function makePoints(count, material) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aSize', new BufferAttribute(new Float32Array(count), 1));
  geometry.setAttribute('aAlpha', new BufferAttribute(new Float32Array(count), 1));
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

export const vertexKey = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

export function createSignals(edgesGeometry, { color, count, size = 9, speed = 1, pixelRatio = 1, onArrive }) {
  const { vertices, neighbors, index } = buildGraph(edgesGeometry);
  const material = makeMaterial(color, pixelRatio);
  const pulses = makePoints(count * TRAIL, material);
  const nodes = makePoints(vertices.length, material);
  const flash = new Float32Array(vertices.length);

  nodes.geometry.getAttribute('position').array.set(vertices.flat());

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const signals = Array.from({ length: count }, () => {
    const from = Math.floor(Math.random() * vertices.length);
    return {
      from,
      to: randomItem(neighbors[from]),
      t: Math.random(),
      rate: speed * (0.7 + Math.random() * 0.6), // edges per second
      phase: Math.random() * Math.PI * 2,
    };
  });

  const update = (dt, time) => {
    const pos = pulses.geometry.getAttribute('position');
    const sizes = pulses.geometry.getAttribute('aSize');
    const alphas = pulses.geometry.getAttribute('aAlpha');

    signals.forEach((s, si) => {
      s.t += dt * s.rate;
      if (s.t >= 1) {
        // Arrived: fire the vertex and continue down a different edge.
        flash[s.to] = 1;
        onArrive?.(vertices[s.to]);
        const options = neighbors[s.to].filter((n) => n !== s.from);
        s.from = s.to;
        s.to = randomItem(options);
        s.t -= 1;
      }
      const a = vertices[s.from];
      const b = vertices[s.to];
      const pulse = 1 + 0.25 * Math.sin(time * 6 + s.phase);
      for (let k = 0; k < TRAIL; k++) {
        const t = Math.max(0, s.t - k * TRAIL_SPACING);
        const i = si * TRAIL + k;
        pos.setXYZ(i, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
        const fade = 1 - k / TRAIL;
        sizes.setX(i, size * (k === 0 ? pulse : 0.45 + 0.4 * fade));
        alphas.setX(i, k === 0 ? 1 : 0.55 * fade * fade);
      }
    });

    const nodeSizes = nodes.geometry.getAttribute('aSize');
    const nodeAlphas = nodes.geometry.getAttribute('aAlpha');
    for (let v = 0; v < flash.length; v++) {
      flash[v] = Math.max(0, flash[v] - dt * FLASH_DECAY);
      nodeSizes.setX(v, size * (0.8 + 1.8 * flash[v]));
      nodeAlphas.setX(v, 0.9 * flash[v]);
    }

    [pos, sizes, alphas, nodeSizes, nodeAlphas].forEach((attr) => { attr.needsUpdate = true; });
  };

  // Lights up the vertex at a given position, e.g. when another system reaches it.
  const flashVertex = ([x, y, z]) => {
    const v = index.get(vertexKey(x, y, z));
    if (v !== undefined) flash[v] = 1;
  };

  const dispose = () => {
    pulses.geometry.dispose();
    nodes.geometry.dispose();
    material.dispose();
  };

  return { objects: [nodes, pulses], update, flashVertex, dispose };
}
