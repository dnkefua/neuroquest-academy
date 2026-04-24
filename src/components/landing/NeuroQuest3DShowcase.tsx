'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type BoxOptions = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
};

type AnimatedNode = {
  object: THREE.Object3D;
  update: (elapsed: number) => void;
};

function createMaterial({
  color,
  emissive = '#000000',
  emissiveIntensity = 0,
  roughness = 0.62,
  metalness = 0.02,
}: Pick<BoxOptions, 'color' | 'emissive' | 'emissiveIntensity' | 'roughness' | 'metalness'>) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness,
    metalness,
  });
}

function addBox(parent: THREE.Object3D, options: BoxOptions) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    createMaterial(options),
  );
  mesh.position.set(...options.position);
  mesh.scale.set(...options.scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createLabelTexture(title: string, detail: string, accent: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, 'rgba(7, 17, 29, 0.95)');
  gradient.addColorStop(1, 'rgba(11, 31, 46, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 224);

  ctx.fillStyle = accent;
  ctx.font = '700 34px Arial';
  ctx.letterSpacing = '2px';
  ctx.fillText(title.toUpperCase(), 36, 66);

  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 56px Arial';
  const words = detail.split(' ');
  let line = '';
  let y = 142;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 430 && line) {
      ctx.fillText(line, 36, y);
      line = word;
      y += 58;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, 36, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function addLabel(
  parent: THREE.Object3D,
  position: [number, number, number],
  rotation: [number, number, number],
  title: string,
  detail: string,
  accent: string,
) {
  const texture = createLabelTexture(title, detail, accent);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.62), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

function addDesk(parent: THREE.Object3D, x: number, z: number, color: string) {
  const group = new THREE.Group();
  group.position.set(x, -0.22, z);
  addBox(group, { position: [0, 0.22, 0], scale: [0.95, 0.08, 0.48], color });
  addBox(group, { position: [-0.36, -0.05, -0.18], scale: [0.08, 0.42, 0.08], color: '#273245' });
  addBox(group, { position: [0.36, -0.05, -0.18], scale: [0.08, 0.42, 0.08], color: '#273245' });
  addBox(group, { position: [-0.36, -0.05, 0.18], scale: [0.08, 0.42, 0.08], color: '#273245' });
  addBox(group, { position: [0.36, -0.05, 0.18], scale: [0.08, 0.42, 0.08], color: '#273245' });
  parent.add(group);
}

function addClassroom(parent: THREE.Object3D) {
  const group = new THREE.Group();
  group.position.set(-2.9, 0, -0.9);
  group.rotation.y = 0.08;

  addBox(group, { position: [0, 0.34, -1.38], scale: [2.6, 1.28, 0.08], color: '#173a32', emissive: '#0d6f63', emissiveIntensity: 0.05 });
  addBox(group, { position: [0, 1.03, -1.43], scale: [2.82, 0.14, 0.15], color: '#704d2a' });
  addBox(group, { position: [0, -0.38, -1.43], scale: [2.82, 0.14, 0.15], color: '#704d2a' });
  addBox(group, { position: [-1.47, 0.34, -1.43], scale: [0.14, 1.42, 0.15], color: '#704d2a' });
  addBox(group, { position: [1.47, 0.34, -1.43], scale: [0.14, 1.42, 0.15], color: '#704d2a' });
  addLabel(group, [-0.7, 0.56, -1.54], [0, 0, 0], 'Number Line', '5 - 10 = -5', '#34d399');

  addDesk(group, -0.74, -0.24, '#f59e0b');
  addDesk(group, 0.72, -0.18, '#14b8a6');
  addDesk(group, 0.03, 0.58, '#ef6f5e');
  parent.add(group);
}

function addLab(parent: THREE.Object3D, animated: AnimatedNode[]) {
  const group = new THREE.Group();
  group.position.set(2.82, 0, -0.65);
  group.rotation.y = -0.12;

  addBox(group, { position: [0, -0.24, 0], scale: [2.5, 0.28, 0.82], color: '#233146' });
  addBox(group, { position: [-0.98, 0.08, 0], scale: [0.1, 0.58, 0.1], color: '#101b2b' });
  addBox(group, { position: [0.98, 0.08, 0], scale: [0.1, 0.58, 0.1], color: '#101b2b' });

  const beaker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 0.52, 28),
    createMaterial({ color: '#67e8f9', emissive: '#0891b2', emissiveIntensity: 0.38, roughness: 0.18, metalness: 0.06 }),
  );
  beaker.position.set(-0.46, 0.26, 0.02);
  beaker.castShadow = true;
  group.add(beaker);

  const flask = new THREE.Mesh(
    new THREE.ConeGeometry(0.26, 0.66, 28),
    createMaterial({ color: '#f0abfc', emissive: '#c026d3', emissiveIntensity: 0.22, roughness: 0.2 }),
  );
  flask.position.set(0.36, 0.29, 0.02);
  flask.castShadow = true;
  group.add(flask);

  const bubbleSeeds: Array<[number, number, number, number]> = [
    [-0.2, 0.35, 0.05, 0],
    [0.15, 0.55, 0, 1.2],
    [0.34, 0.28, 0.05, 2.1],
  ];
  bubbleSeeds.forEach(([x, y, z, phase], index) => {
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.055 + index * 0.018, 18, 18),
      createMaterial({
        color: index === 1 ? '#fef08a' : '#a7f3d0',
        emissive: '#22c55e',
        emissiveIntensity: 0.45,
        roughness: 0.25,
      }),
    );
    bubble.position.set(x, y, z);
    group.add(bubble);
    animated.push({
      object: bubble,
      update: (elapsed) => {
        bubble.position.y = y + Math.sin(elapsed * (1.7 + index * 0.35) + phase) * 0.08;
      },
    });
  });

  addLabel(group, [0.68, 0.92, -0.12], [0, -0.08, 0], 'Lab Explainer', 'Cause -> Effect', '#67e8f9');
  parent.add(group);
}

function addRacingLoop(parent: THREE.Object3D, animated: AnimatedNode[]) {
  const track = new THREE.Mesh(
    new THREE.RingGeometry(1.62, 2.34, 96),
    createMaterial({ color: '#202a37', roughness: 0.72, metalness: 0.05 }),
  );
  track.position.set(0, -0.59, 1.18);
  track.rotation.x = -Math.PI / 2;
  track.receiveShadow = true;
  parent.add(track);

  const lane = new THREE.Mesh(
    new THREE.RingGeometry(1.9, 1.94, 96),
    createMaterial({ color: '#f8fafc', emissive: '#f8fafc', emissiveIntensity: 0.12 }),
  );
  lane.position.set(0, -0.575, 1.18);
  lane.rotation.x = -Math.PI / 2;
  parent.add(lane);

  const car = new THREE.Group();
  addBox(car, { position: [0, 0, 0], scale: [0.42, 0.16, 0.7], color: '#ef4444', emissive: '#991b1b', emissiveIntensity: 0.12 });
  addBox(car, { position: [0, 0.13, -0.05], scale: [0.32, 0.16, 0.34], color: '#93c5fd', emissive: '#0ea5e9', emissiveIntensity: 0.15 });
  addBox(car, { position: [-0.27, -0.08, -0.24], scale: [0.08, 0.13, 0.16], color: '#05070a' });
  addBox(car, { position: [0.27, -0.08, -0.24], scale: [0.08, 0.13, 0.16], color: '#05070a' });
  addBox(car, { position: [-0.27, -0.08, 0.24], scale: [0.08, 0.13, 0.16], color: '#05070a' });
  addBox(car, { position: [0.27, -0.08, 0.24], scale: [0.08, 0.13, 0.16], color: '#05070a' });
  parent.add(car);

  animated.push({
    object: car,
    update: (elapsed) => {
      const t = elapsed * 0.62;
      car.position.set(Math.sin(t) * 2.05, -0.53, 1.18 + Math.cos(t) * 0.76);
      car.rotation.y = Math.atan2(Math.cos(t) * 2.05, -Math.sin(t) * 0.76);
    },
  });

  addLabel(parent, [1.85, 0.24, 0.54], [-0.08, -0.36, 0], 'Road Sign', '5 - 10 = ?', '#facc15');
}

function addMaze(parent: THREE.Object3D, animated: AnimatedNode[]) {
  const group = new THREE.Group();
  group.position.set(0, 0, 3.35);
  addBox(group, { position: [0, -0.61, 0.06], scale: [3.0, 0.06, 2.1], color: '#143524', roughness: 0.8 });

  const walls = [
    [-1.0, 0.0, 0.0, 0.18, 0.52, 1.1],
    [-0.35, 0.0, -0.45, 1.1, 0.52, 0.18],
    [0.55, 0.0, 0.15, 0.18, 0.52, 1.25],
    [1.05, 0.0, -0.5, 0.82, 0.52, 0.18],
    [0.1, 0.0, 0.72, 1.2, 0.52, 0.18],
  ] as const;

  walls.forEach(([x, y, z, sx, sy, sz], index) => {
    addBox(group, {
      position: [x, y - 0.3, z],
      scale: [sx, sy, sz],
      color: index % 2 ? '#2f7d45' : '#1f6f3a',
      emissive: '#14532d',
      emissiveIntensity: 0.05,
    });
  });

  const avatar = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 24, 24),
    createMaterial({ color: '#60a5fa', emissive: '#2563eb', emissiveIntensity: 0.34 }),
  );
  avatar.position.set(-0.82, -0.18, 0.56);
  avatar.castShadow = true;
  group.add(avatar);

  const pursuer = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.18, 1),
    createMaterial({ color: '#f97316', emissive: '#ea580c', emissiveIntensity: 0.32, roughness: 0.48 }),
  );
  pursuer.position.set(0.82, -0.18, -0.2);
  pursuer.castShadow = true;
  group.add(pursuer);

  animated.push({
    object: avatar,
    update: (elapsed) => {
      avatar.position.x = -0.82 + Math.sin(elapsed * 1.15) * 0.28;
      avatar.position.z = 0.56 + Math.cos(elapsed * 1.1) * 0.18;
    },
  });
  animated.push({
    object: pursuer,
    update: (elapsed) => {
      pursuer.position.x = 0.82 + Math.sin(elapsed * 1 + 2) * 0.24;
      pursuer.position.z = -0.2 + Math.cos(elapsed * 0.95) * 0.26;
      pursuer.rotation.y = elapsed * 2.2;
    },
  });

  [[-1.2, 0.22], [0.1, -0.74], [1.2, 0.46]].forEach(([x, z], index) => {
    const coin = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.025, 12, 28),
      createMaterial({ color: '#fbbf24', emissive: '#f59e0b', emissiveIntensity: 0.6, metalness: 0.4 }),
    );
    coin.position.set(x, -0.19, z);
    coin.castShadow = true;
    group.add(coin);
    animated.push({
      object: coin,
      update: (elapsed) => {
        coin.rotation.y = elapsed * (1.4 + index * 0.2);
        coin.position.y = -0.19 + Math.sin(elapsed * 1.7 + index) * 0.045;
      },
    });
  });

  addLabel(group, [-1.24, 0.34, -0.82], [-0.12, 0.18, 0], 'Maze Power', 'Answer -> Blink', '#fb7185');
  parent.add(group);
}

function addConceptOrbit(parent: THREE.Object3D, animated: AnimatedNode[]) {
  const group = new THREE.Group();
  group.position.set(0, 1.32, 0.1);

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 32),
    createMaterial({ color: '#f472b6', emissive: '#db2777', emissiveIntensity: 0.55 }),
  );
  group.add(nucleus);

  [0, 1, 2].forEach((item) => {
    const orbit = new THREE.Group();
    orbit.rotation.set(item * 1.05, item * 0.68, item * 1.48);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.012, 12, 80),
      createMaterial({
        color: item === 1 ? '#67e8f9' : '#fde68a',
        emissive: '#0ea5e9',
        emissiveIntensity: 0.22,
        roughness: 0.35,
      }),
    );
    const electron = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 16),
      createMaterial({ color: '#a7f3d0', emissive: '#10b981', emissiveIntensity: 0.5 }),
    );
    electron.position.set(0.68, 0, 0);
    orbit.add(ring, electron);
    group.add(orbit);
  });

  animated.push({
    object: group,
    update: (elapsed) => {
      group.rotation.y = elapsed * 0.55;
      group.rotation.x = Math.sin(elapsed * 0.4) * 0.08;
      group.position.y = 1.32 + Math.sin(elapsed * 1.1) * 0.06;
    },
  });

  parent.add(group);
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else if (material) {
      const map = (material as THREE.MeshBasicMaterial).map;
      if (map) {
        map.dispose();
      }
      material.dispose();
    }
  });
}

export default function NeuroQuest3DShowcase() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#061018');
    scene.fog = new THREE.Fog('#061018', 7.5, 16);

    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 3.1, 7.4);
    camera.lookAt(0, 0.15, 0.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const animated: AnimatedNode[] = [];
    const campus = new THREE.Group();
    scene.add(campus);

    scene.add(new THREE.AmbientLight('#dbeafe', 0.45));
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.25);
    keyLight.position.set(3.6, 5.2, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    scene.add(new THREE.PointLight('#14b8a6', 6, 7).translateX(-3.8).translateY(2.1).translateZ(2.4));
    scene.add(new THREE.PointLight('#f97316', 4.2, 6).translateX(3.4).translateY(1.8).translateZ(-1.2));

    const spotLight = new THREE.SpotLight('#dbeafe', 4, 14, 0.62, 0.8, 1);
    spotLight.position.set(0, 4.3, 4.1);
    scene.add(spotLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10.5, 8.2),
      createMaterial({ color: '#101923', roughness: 0.74, metalness: 0.08 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.64, 0.8);
    floor.receiveShadow = true;
    campus.add(floor);
    campus.add(new THREE.GridHelper(10, 20, '#38bdf8', '#1f2937').translateY(-0.62).translateZ(0.8));

    addClassroom(campus);
    addLab(campus, animated);
    addRacingLoop(campus, animated);
    addMaze(campus, animated);
    addConceptOrbit(campus, animated);

    addBox(campus, { position: [-4.65, 0.35, 0.8], scale: [0.1, 2.2, 5.4], color: '#0c1722' });
    addBox(campus, { position: [4.65, 0.35, 0.8], scale: [0.1, 2.2, 5.4], color: '#0c1722' });
    addBox(campus, { position: [0, 0.35, -2.5], scale: [9.4, 2.2, 0.1], color: '#0c1722' });

    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
    };

    mount.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    let frameId = 0;
    const render = () => {
      const elapsed = clock.getElapsedTime();
      campus.rotation.y = Math.sin(elapsed * 0.18) * 0.045 + pointer.x * 0.045;
      campus.rotation.x = pointer.y * -0.025;
      camera.position.x += (pointer.x * 0.34 - camera.position.x) * 0.025;
      camera.lookAt(0, 0.15, 0.6);
      animated.forEach(({ update }) => update(elapsed));
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      mount.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      disposeObject(scene);
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_67%_35%,rgba(20,184,166,0.16),transparent_34%),linear-gradient(90deg,rgba(6,16,24,0.92)_0%,rgba(6,16,24,0.72)_36%,rgba(6,16,24,0.1)_72%)]" />
    </div>
  );
}
