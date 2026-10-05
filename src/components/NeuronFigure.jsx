// NeuronFigure.jsx
// A procedurally grown neuron in ink and sanguine, after Leonardo's anatomical
// studies. Inputs arrive at its dendrite tips, travel to the soma, and the
// soma fires once it has integrated enough of them.
import { useEffect, useRef } from 'react';
import { Clock, Group, IcosahedronGeometry, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { vertexKey } from './signals';
import { createNeuron } from './neuron';

const INK = 0x2b2622;
const SANGUINE = 0x9a4b32;

// Twelve evenly spread dendrite tips: the vertices of an icosahedron.
function tipPositions(radius) {
  const geometry = new IcosahedronGeometry(radius, 0);
  const pos = geometry.getAttribute('position');
  const tips = new Map();
  for (let i = 0; i < pos.count; i++) {
    const v = [pos.getX(i), pos.getY(i), pos.getZ(i)];
    tips.set(vertexKey(...v), v);
  }
  geometry.dispose();
  return [...tips.values()];
}

function NeuronFigure({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const group = new Group();
    const neuron = createNeuron(tipPositions(1.8), {
      inkColor: INK,
      pulseColor: SANGUINE,
      pixelRatio: renderer.getPixelRatio(),
      size: 16,
      animate: !reduceMotion,
      inputRate: 2.6, // spontaneous inputs per second
    });
    group.add(neuron.object);
    scene.add(group);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const draw = (t, dt = 0) => {
      neuron.update(dt, t);
      group.rotation.y = t * 0.18 + pointer.x * 0.5;
      group.rotation.x = 0.35 + Math.sin(t * 0.2) * 0.08 + pointer.y * 0.3;
      renderer.render(scene, camera);
    };

    let frame = 0;
    let visible = true;
    const clock = new Clock();
    let last = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      // Clamp so pulses don't jump after the canvas was off-screen.
      const dt = Math.min(t - last, 0.05);
      last = t;
      if (visible) draw(t, dt);
    };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    resize();

    if (reduceMotion) {
      draw(0);
    } else {
      window.addEventListener('pointermove', onPointerMove);
      loop();
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      neuron.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

export default NeuronFigure;
