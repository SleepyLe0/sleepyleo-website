"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export type Destination = "home" | "work" | "about" | "contact";
export interface WorldSceneProps {
  destination: Destination;
  night: boolean;
  paused: boolean;
  resetKey: number;
  onReady: () => void;
  onError: () => void;
  onSelect: (destination: Destination) => void;
}

const destinations = {
  home: { camera: [12, 10, 15], target: [0, 1, 0] },
  work: { camera: [9, 5.5, 8], target: [2.8, 1.6, 0] },
  about: { camera: [-8, 6, 10], target: [-2, 1.4, 1] },
  contact: { camera: [6, 5, 12], target: [1, 1.5, 3] },
} satisfies Record<Destination, { camera: number[]; target: number[] }>;

/** Procedural models are created once; all GPU resources are disposed on unmount. */
export default function SleepyWorldScene(props: WorldSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
  }, [props]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      latest.current.onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.setAttribute(
      "aria-label",
      "Floating island: drag to orbit, pinch to zoom, or choose a destination using the navigation buttons.",
    );
    renderer.domElement.setAttribute("role", "img");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(12, 10, 15);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 28;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotateSpeed = 0.35;

    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const material = (color: string, roughness = 0.8, metalness = 0) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      materials.push(m);
      return m;
    };
    const cream = material("#f4e7d1"),
      stone = material("#c7ba9d"),
      grass = material("#9dab78");
    const green = material("#748d64"),
      darkGreen = material("#405d4d"),
      peach = material("#e99e83");
    const wood = material("#997858"),
      brown = material("#615347"),
      ink = material("#283e3b");
    const brass = material("#d0a563", 0.35, 0.5),
      white = material("#fffae8");
    const world = new THREE.Group();
    scene.add(world);
    function mesh(
      geometry: THREE.BufferGeometry,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      parent: THREE.Object3D = world,
    ) {
      const object = new THREE.Mesh(geometry, mat);
      object.position.set(x, y, z);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    }
    const box = (
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      parent = world,
    ) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
    const sphere = (
      r: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      parent = world,
    ) => mesh(new THREE.SphereGeometry(r, 20, 14), mat, x, y, z, parent);
    const cylinder = (
      top: number,
      bottom: number,
      h: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      parent = world,
      segments = 48,
    ) =>
      mesh(
        new THREE.CylinderGeometry(top, bottom, h, segments),
        mat,
        x,
        y,
        z,
        parent,
      );

    // Floating terrain, layered stone, and small drifting fragments.
    cylinder(5.25, 4.9, 0.45, grass, 0, 0, 0, world, 64);
    cylinder(4.9, 3.9, 0.95, stone, 0, -0.65, 0, world, 14);
    cylinder(3.9, 1.7, 1.45, cream, 0, -1.8, 0, world, 10);
    cylinder(1.7, 0.12, 1.25, stone, 0, -3.1, 0, world, 7);
    const fragments: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 2.4;
      const r = 4.7 + Math.sin(i * 3) * 0.7;
      const rock = mesh(
        new THREE.DodecahedronGeometry(0.15 + (i % 3) * 0.1),
        i % 2 ? stone : cream,
        Math.cos(angle) * r,
        -1.6 - (i % 4) * 0.6,
        Math.sin(angle) * r,
      );
      fragments.push(rock);
    }
    // Curved stepping-stone path between the studio and the lookout.
    for (let i = 0; i < 10; i++) {
      const step = cylinder(
        0.34,
        0.36,
        0.12,
        cream,
        -0.4 + Math.sin(i * 0.32) * 1.4,
        0.3,
        -1.9 + i * 0.61,
        world,
        7,
      );
      step.rotation.y = i * 0.8;
    }

    // Open studio: warm timber, peach roof and a glowing developer's desk.
    const studio = new THREE.Group();
    studio.position.set(-1.5, 0.25, -0.9);
    studio.rotation.y = -0.1;
    world.add(studio);
    box(3.5, 0.2, 2.8, wood, 0, 0.1, 0, studio);
    box(3.35, 2.75, 0.14, cream, 0, 1.6, -1.25, studio);
    box(0.14, 2.75, 2.6, cream, -1.6, 1.6, 0, studio);
    box(0.15, 2.9, 0.15, wood, 1.58, 1.7, 1.2, studio);
    box(0.15, 2.9, 0.15, wood, -1.58, 1.7, 1.2, studio);
    const roof = box(3.9, 0.2, 3.3, peach, 0, 3.2, 0, studio);
    roof.rotation.z = -0.1;
    for (let i = 0; i < 12; i++)
      box(
        0.055,
        0.04,
        3.3,
        cream,
        -1.75 + i * 0.32,
        3.34 - (-1.75 + i * 0.32) * 0.1,
        0,
        studio,
      );
    box(0.7, 0.85, 0.08, wood, -1, 2, -1.15, studio);
    box(0.58, 0.73, 0.09, peach, -1, 2, -1.09, studio);
    const art = mesh(
      new THREE.TorusGeometry(0.2, 0.035, 8, 32),
      cream,
      -1,
      2,
      -1.02,
      studio,
    );
    art.rotation.z = 0.5;
    box(2.6, 0.13, 1, wood, 0.1, 1.2, -0.25, studio);
    for (const x of [-1, 1.2])
      for (const z of [-0.65, 0.1]) box(0.1, 1, 0.1, brown, x, 0.65, z, studio);
    box(1.3, 0.85, 0.12, ink, 0.05, 1.85, -0.45, studio);
    box(0.12, 0.3, 0.12, ink, 0.05, 1.36, -0.45, studio);
    box(0.55, 0.06, 0.32, ink, 0.05, 1.28, -0.4, studio);
    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = 512;
    displayCanvas.height = 320;
    const ctx = displayCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#203e38";
      ctx.fillRect(0, 0, 512, 320);
      ctx.fillStyle = "#a8c98c";
      ctx.font = "22px monospace";
      ctx.fillText("hello, little world.", 32, 65);
      [250, 340, 200, 290, 165].forEach((width, i) => {
        ctx.fillStyle = i % 2 ? "#dcad85" : "#719b7f";
        ctx.fillRect(32 + (i % 2) * 24, 105 + i * 30, width, 8);
      });
    }
    const screenTexture = new THREE.CanvasTexture(displayCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    textures.push(screenTexture);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });
    materials.push(screenMaterial);
    mesh(
      new THREE.PlaneGeometry(1.19, 0.74),
      screenMaterial,
      0.05,
      1.85,
      -0.378,
      studio,
    );
    box(0.82, 0.04, 0.28, ink, 0.05, 1.3, -0.02, studio);
    for (let i = 0; i < 7; i++)
      box(0.035, 0.008, 0.21, stone, -0.27 + i * 0.1, 1.325, -0.02, studio);
    cylinder(0.13, 0.1, 0.24, peach, 1, 1.39, -0.2, studio);
    cylinder(0.11, 0.11, 0.01, green, 1, 1.515, -0.2, studio);
    mesh(
      new THREE.TorusGeometry(0.08, 0.025, 8, 16),
      peach,
      1.14,
      1.4,
      -0.2,
      studio,
    );
    cylinder(0.44, 0.44, 0.13, peach, 0.1, 0.72, 0.75, studio);
    cylinder(0.06, 0.06, 0.5, ink, 0.1, 0.42, 0.75, studio);
    box(0.85, 0.5, 0.12, peach, 0.1, 1, 1.06, studio);
    // Books, shelf and pendant lamp.
    box(1.15, 0.08, 0.32, wood, 0.75, 2.6, -1, studio);
    for (let i = 0; i < 5; i++)
      box(
        0.12,
        0.3 + (i % 2) * 0.1,
        0.23,
        [peach, green, cream][i % 3],
        0.35 + i * 0.15,
        2.81,
        -1,
        studio,
      );
    cylinder(0.012, 0.012, 0.55, brown, 0.2, 2.85, 0.1, studio);
    cylinder(0.06, 0.32, 0.22, brass, 0.2, 2.48, 0.1, studio);
    const lamp = new THREE.PointLight("#ffc38e", 3, 5);
    lamp.position.set(0.2, 2.3, 0.1);
    studio.add(lamp);
    studio.userData.destination = "work";

    // Little trees with soft, sculpted crowns.
    function tree(x: number, z: number, size: number) {
      const group = new THREE.Group();
      group.position.set(x, 0.2, z);
      group.scale.setScalar(size);
      world.add(group);
      cylinder(0.12, 0.2, 1.7, wood, 0, 0.85, 0, group, 8);
      const branch = cylinder(0.06, 0.1, 0.9, wood, 0.2, 1.2, 0, group, 7);
      branch.rotation.z = -0.6;
      sphere(0.82, green, 0, 2, 0, group).scale.set(1, 1.2, 1);
      sphere(0.58, grass, 0.48, 1.75, 0.1, group);
      sphere(0.56, darkGreen, -0.4, 1.6, -0.15, group);
    }
    tree(-3.6, -0.4, 1);
    tree(-2.6, -3, 0.8);
    tree(0.3, -3.65, 1.05);
    tree(3.6, -1.5, 0.7);
    for (let i = 0; i < 24; i++) {
      const angle = i * 2.399;
      const r = 3.1 + (i % 4) * 0.4;
      sphere(
        0.12 + (i % 3) * 0.055,
        i % 4 === 0 ? peach : green,
        Math.cos(angle) * r,
        0.28,
        Math.sin(angle) * r,
      ).scale.y = 0.65;
    }

    // Project portal, orbiting the ideas that become real things.
    const portal = new THREE.Group();
    portal.position.set(2.8, 0.3, -0.4);
    world.add(portal);
    cylinder(0.95, 1.12, 0.25, cream, 0, 0.1, 0, portal);
    cylinder(0.76, 0.9, 0.15, peach, 0, 0.3, 0, portal);
    const portalRing = mesh(
      new THREE.TorusGeometry(0.93, 0.1, 12, 64),
      brass,
      0,
      1.6,
      0,
      portal,
    );
    const portalGlow = new THREE.MeshStandardMaterial({
      color: "#bedac5",
      emissive: "#6cba9a",
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    });
    materials.push(portalGlow);
    mesh(new THREE.CircleGeometry(0.83, 48), portalGlow, 0, 1.6, 0, portal);
    const portalCore = mesh(
      new THREE.IcosahedronGeometry(0.38, 0),
      cream,
      0,
      1.6,
      0.1,
      portal,
    );
    mesh(
      new THREE.TorusGeometry(0.57, 0.018, 8, 48),
      white,
      0,
      1.6,
      0.14,
      portal,
    ).rotation.x = 0.6;
    portal.userData.destination = "work";

    // Matcha garden and the resident sleepy cat.
    const garden = new THREE.Group();
    garden.position.set(-2.6, 0.28, 2.3);
    world.add(garden);
    cylinder(0.9, 0.95, 0.1, cream, 0, 0.02, 0, garden);
    cylinder(0.39, 0.31, 0.55, peach, -0.35, 0.33, -0.1, garden);
    cylinder(0.355, 0.355, 0.02, darkGreen, -0.35, 0.615, -0.1, garden);
    mesh(
      new THREE.TorusGeometry(0.22, 0.065, 10, 24),
      peach,
      0.03,
      0.35,
      -0.1,
      garden,
    );
    const cat = new THREE.Group();
    garden.add(cat);
    cat.position.set(0.5, 0.2, 0.2);
    sphere(0.32, cream, 0, 0.16, 0, cat).scale.set(1.25, 0.7, 0.8);
    sphere(0.21, cream, 0.27, 0.24, 0.12, cat);
    for (const x of [0.15, 0.37]) {
      const ear = mesh(
        new THREE.ConeGeometry(0.1, 0.18, 3),
        cream,
        x,
        0.44,
        0.12,
        cat,
      );
      ear.rotation.z = x < 0.2 ? -0.15 : 0.15;
      const eye = mesh(
        new THREE.TorusGeometry(0.035, 0.009, 4, 12, Math.PI),
        brown,
        x + 0.015,
        0.26,
        0.305,
        cat,
      );
      eye.rotation.z = Math.PI;
    }
    const tail = mesh(
      new THREE.TorusGeometry(0.26, 0.07, 8, 24, Math.PI * 1.5),
      cream,
      -0.25,
      0.15,
      0.07,
      cat,
    );
    tail.rotation.x = Math.PI / 2;
    garden.userData.destination = "about";

    // Mailbox lookout with a tiny flag, ready for the next good idea.
    const mailbox = new THREE.Group();
    mailbox.position.set(1.8, 0.3, 3.1);
    mailbox.rotation.y = -0.3;
    world.add(mailbox);
    cylinder(0.7, 0.8, 0.16, cream, 0, 0.04, 0, mailbox);
    box(0.16, 1.3, 0.16, wood, 0, 0.75, 0, mailbox);
    box(0.75, 0.55, 0.75, peach, 0, 1.6, 0, mailbox);
    const mailboxRoof = cylinder(0.38, 0.38, 0.76, peach, 0, 1.86, 0, mailbox);
    mailboxRoof.rotation.x = Math.PI / 2;
    box(0.55, 0.05, 0.02, brown, 0, 1.62, 0.39, mailbox);
    box(0.025, 0.6, 0.035, brass, 0.4, 1.95, 0, mailbox);
    box(0.28, 0.17, 0.04, peach, 0.53, 2.2, 0, mailbox);
    mailbox.userData.destination = "contact";
    for (let i = 0; i < 4; i++) {
      box(0.1, 0.75, 0.1, wood, 2.7 + i * 0.43, 0.64, 2.3 - i * 0.22);
    }
    const rail = box(1.65, 0.08, 0.08, wood, 3.34, 0.91, 1.97);
    rail.rotation.y = 0.47;

    // Clouds, stars and a small satellite island.
    const clouds: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const cloud = new THREE.Group();
      cloud.position.set(
        Math.cos(i * 1.4) * 7.8,
        -1.6 + (i % 3) * 2.5,
        Math.sin(i * 1.4) * 6,
      );
      world.add(cloud);
      clouds.push(cloud);
      for (let j = 0; j < 4; j++)
        sphere(
          0.6 + (j % 2) * 0.2,
          white,
          j * 0.6 - 0.8,
          (j % 2) * 0.15,
          0,
          cloud,
        ).scale.set(1, 0.55, 0.65);
    }
    const satellite = new THREE.Group();
    satellite.position.set(5.7, 2.2, -3.8);
    world.add(satellite);
    cylinder(0.8, 0.1, 1.1, cream, 0, -0.4, 0, satellite, 7);
    cylinder(0.82, 0.8, 0.12, grass, 0, 0.2, 0, satellite);
    const satelliteOrb = sphere(0.32, peach, 0, 0.7, 0, satellite);
    const orbit = mesh(
      new THREE.TorusGeometry(0.55, 0.025, 8, 48),
      brass,
      0,
      0.7,
      0,
      satellite,
    );
    orbit.rotation.x = 1;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      starPositions[i * 3] = Math.sin(i * 127.1) * 18;
      starPositions[i * 3 + 1] = Math.sin(i * 311.7) * 10 + 5;
      starPositions[i * 3 + 2] = Math.cos(i * 74.7) * 16;
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starMaterial = new THREE.PointsMaterial({
      color: "#fff1ca",
      size: 0.06,
      transparent: true,
      opacity: 0,
    });
    materials.push(starMaterial);
    scene.add(new THREE.Points(starsGeometry, starMaterial));
    const ambient = new THREE.HemisphereLight("#fff4de", "#a5b3a1", 2.7);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight("#ffe9c7", 4.5);
    sun.position.set(-4, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.normalBias = 0.035;
    scene.add(sun);
    const rim = new THREE.DirectionalLight("#aecfd0", 2);
    rim.position.set(6, 3, -6);
    scene.add(rim);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0,
      downY = 0;
    const onDown = (event: PointerEvent) => {
      downX = event.clientX;
      downY = event.clientY;
    };
    function hit(event: PointerEvent) {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(
        [studio, portal, garden, mailbox],
        true,
      );
      let selected: THREE.Object3D | null = intersections[0]?.object ?? null;
      while (selected && !selected.userData.destination)
        selected = selected.parent;
      return selected?.userData.destination as Destination | undefined;
    }
    const onUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return;
      const destination = hit(event);
      if (destination) latest.current.onSelect(destination);
    };
    const onMove = (event: PointerEvent) => {
      renderer.domElement.style.cursor = hit(event) ? "pointer" : "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      latest.current.onError();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(container);
    const size = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    size.observe(container);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastDestination: Destination | null = null;
    let lastReset = -1;
    let transitioning = true;
    let lastTime = 0;
    let elapsed = 0;
    const goalCamera = new THREE.Vector3(),
      goalTarget = new THREE.Vector3();
    const cancelTransition = () => {
      transitioning = false;
    };
    controls.addEventListener("start", cancelTransition);
    let ready = false;
    renderer.setAnimationLoop((time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!visible || document.hidden) return;
      const current = latest.current;
      if (
        current.destination !== lastDestination ||
        current.resetKey !== lastReset
      ) {
        const destination = destinations[current.destination];
        goalCamera.fromArray(destination.camera);
        if (container.clientWidth < 700) goalCamera.multiplyScalar(1.25);
        goalTarget.fromArray(destination.target);
        lastDestination = current.destination;
        lastReset = current.resetKey;
        transitioning = true;
      }
      if (transitioning) {
        const rate = reducedMotion.matches ? 1 : 1 - Math.exp(-delta * 3);
        camera.position.lerp(goalCamera, rate);
        controls.target.lerp(goalTarget, rate);
        if (camera.position.distanceTo(goalCamera) < 0.03)
          transitioning = false;
      }
      const animate = !current.paused && !reducedMotion.matches;
      controls.enableDamping = !reducedMotion.matches;
      controls.autoRotate =
        animate && !transitioning && current.destination === "home";
      controls.update(delta);
      if (animate) {
        elapsed += delta;
        world.position.y = Math.sin(elapsed * 0.55) * 0.07;
        portalCore.rotation.y = elapsed * 0.45;
        portalCore.rotation.z = elapsed * 0.15;
        portalRing.rotation.z = Math.sin(elapsed * 0.4) * 0.04;
        satelliteOrb.position.y = 0.7 + Math.sin(elapsed) * 0.12;
        cat.scale.y = 1 + Math.sin(elapsed * 1.5) * 0.025;
        fragments.forEach((rock, i) => {
          rock.rotation.y += delta * 0.15;
          rock.position.y += Math.sin(elapsed + i) * delta * 0.045;
        });
        clouds.forEach((cloud, i) => {
          cloud.position.y += Math.sin(elapsed * 0.4 + i) * delta * 0.035;
        });
      }
      const lightRate = reducedMotion.matches ? 1 : Math.min(delta * 3, 1);
      ambient.intensity = THREE.MathUtils.lerp(
        ambient.intensity,
        current.night ? 0.75 : 2.7,
        lightRate,
      );
      sun.intensity = THREE.MathUtils.lerp(
        sun.intensity,
        current.night ? 0.7 : 4.5,
        lightRate,
      );
      rim.intensity = THREE.MathUtils.lerp(
        rim.intensity,
        current.night ? 3 : 2,
        lightRate,
      );
      lamp.intensity = THREE.MathUtils.lerp(
        lamp.intensity,
        current.night ? 7 : 3,
        lightRate,
      );
      starMaterial.opacity = THREE.MathUtils.lerp(
        starMaterial.opacity,
        current.night ? 0.9 : 0,
        lightRate,
      );
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        latest.current.onReady();
      }
    });
    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      size.disconnect();
      controls.removeEventListener("start", cancelTransition);
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points)
          object.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div className="world-canvas" ref={host} />;
}
