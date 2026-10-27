"use client";

/**
 * Aura Estates — Casa Lumen in 3D.
 * A procedural modernist villa; the camera rides a scroll spline through five stations:
 *   0 Blueprint  — glowing wireframe on a drafting grid; scrolling "3D-prints" the house
 *   1 Sun study  — scrub the hour, shadows sweep, windows glow after dusk
 *   2 Exploded   — floors lift apart, rooms tagged with live labels
 *   3 Configure  — facade, pool and solar roof, price + mortgage update; drag to orbit
 *   4 Neighbourhood — the city grows around the plot, walk/bike/drive isochrones and POIs
 */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Play, Pause, Footprints, Bike, Car, Check } from "lucide-react";
import { DemoDock, prefersReduced } from "@/components/motion/fx";
import {
  Station,
  PanelLabel as Label,
  FilmOverlay,
  Loader,
  ChapterRail,
  scrollToStation,
  stationProgress,
} from "./three-kit";

const ACCENT = "#f2c48d";
const BLUEPRINT = "#4fb3ff";
const CHAPTERS = ["Blueprint", "Sun Study", "Floor Plan", "Configure", "Neighbourhood"];

const ROOMS = [
  { name: "Living", m2: 64, floor: 0, x: -2.1, z: 0, w: 5, d: 6.4, c: "#f2c48d" },
  { name: "Kitchen", m2: 26, floor: 0, x: 2.6, z: -1.6, w: 4, d: 3.2, c: "#9fd3c7" },
  { name: "Studio", m2: 24, floor: 0, x: 2.6, z: 1.7, w: 4, d: 3, c: "#c7b8ea" },
  { name: "Master Suite", m2: 58, floor: 1, x: -0.35, z: -0.3, w: 5.3, d: 5.6, c: "#f4a6a6" },
  { name: "Bedroom II", m2: 32, floor: 1, x: 5.05, z: -1.8, w: 4.7, d: 2.6, c: "#a6c8f4" },
  { name: "Spa Bath", m2: 22, floor: 1, x: 5.05, z: 1.2, w: 4.7, d: 2.4, c: "#b6e3a8" },
];

const FACADES = [
  { name: "Timber", hex: "#8a5a3b", roughness: 0.75, delta: 0 },
  { name: "Basalt", hex: "#2a2a2c", roughness: 0.55, delta: 60000 },
  { name: "Limestone", hex: "#d6cab2", roughness: 0.9, delta: 90000 },
  { name: "Stucco", hex: "#eeeae2", roughness: 0.95, delta: 30000 },
];

const POIS = [
  { name: "Metro L2", walk: 3, x: 18, z: -20 },
  { name: "Parc Lumière", walk: 5, x: -30, z: 18 },
  { name: "Lycée International", walk: 7, x: 34, z: 30 },
  { name: "Marché Couvert", walk: 9, x: -14, z: -38 },
  { name: "Riverside Walk", walk: 14, x: 52, z: -44 },
];
const RINGS = [22, 42, 62];
const MODES = [
  { id: "walk", label: "Walk", icon: Footprints, f: 1 },
  { id: "bike", label: "Bike", icon: Bike, f: 0.35 },
  { id: "drive", label: "Drive", icon: Car, f: 0.22 },
] as const;

const BASE_PRICE = 2450000;
const POOL_PRICE = 180000;
const SOLAR_PRICE = 42000;

// label slots: rooms, then POIs, then isochrone rings
const POI_SLOT = ROOMS.length;
const RING_SLOT = POI_SLOT + POIS.length;

type Api = {
  setHour: (h: number) => void;
  setFacade: (i: number) => void;
  setPool: (on: boolean) => void;
  setSolar: (on: boolean) => void;
  highlightRoom: (i: number | null) => void;
};

/* ------------------------------------------------------------------ */
/* Sky + sun                                                           */
/* ------------------------------------------------------------------ */
const SKY: [number, string][] = [
  [4, "#0b1530"],
  [6, "#3b3560"],
  [7, "#e8a07a"],
  [9.5, "#a9c6df"],
  [16, "#a9c6df"],
  [18.5, "#e48a6a"],
  [20, "#2a2550"],
  [22, "#0b1530"],
];
const skyAt = (h: number, out: THREE.Color) => {
  for (let i = 0; i < SKY.length - 1; i++) {
    const [h0, c0] = SKY[i];
    const [h1, c1] = SKY[i + 1];
    if (h <= h1) return out.set(c0).lerp(new THREE.Color(c1), THREE.MathUtils.clamp((h - h0) / (h1 - h0), 0, 1));
  }
  return out.set(SKY[SKY.length - 1][1]);
};
/** Sun elevation as sin of its arc; negative at night. */
const sunArc = (h: number) => ((h - 6) / 14) * Math.PI;

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */
function startEngine(
  canvas: HTMLCanvasElement,
  labels: HTMLElement,
  cb: { onReady: () => void; onChapter: (i: number) => void }
): { api: Api; dispose: () => void } {
  const reduced = prefersReduced();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const bg = new THREE.Color();
  scene.background = bg;
  const fog = new THREE.Fog(0, 60, 220);
  fog.color = bg; // share the sky colour so the horizon tracks the time of day
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 500);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  // "3D printer" clip: everything above buildH is cut away
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const mat = (p: THREE.MeshStandardMaterialParameters) =>
    track(new THREE.MeshStandardMaterial({ ...p, clippingPlanes: [clip] }));

  const slabMat = mat({ color: "#cfcac0", roughness: 0.85 });
  const wallMat = mat({ color: "#d8d3c9", roughness: 0.85, transparent: true });
  const cladMat = mat({ color: FACADES[0].hex, roughness: FACADES[0].roughness, transparent: true });
  const roofMat = mat({ color: "#f1eee8", roughness: 0.6 });
  const darkMat = mat({ color: "#1d1d1f", roughness: 0.4, metalness: 0.6 });
  const glassMat = mat({
    color: "#9fb8c8",
    roughness: 0.05,
    metalness: 0.9,
    transparent: true,
    opacity: 0.35,
    emissive: new THREE.Color("#ffcf8a"),
  });
  const waterMat = mat({ color: "#3aa7c9", roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85, emissive: new THREE.Color("#4fe0ff") });
  const deckMat = mat({ color: "#9a6b47", roughness: 0.8 });
  const solarMat = mat({ color: "#1b2a4a", roughness: 0.3, metalness: 0.7 });
  const lineMat = track(new THREE.LineBasicMaterial({ color: BLUEPRINT, transparent: true }));

  const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(mesh.geometry)), lineMat));
    parent.add(mesh);
    return mesh;
  };

  /* --- Villa --- */
  const house = new THREE.Group();
  scene.add(house);
  const ground = new THREE.Group();
  const upper = new THREE.Group();
  const roof = new THREE.Group();
  house.add(ground, upper, roof);

  box(10, 0.3, 7, slabMat, 0, 0.15, 0, ground);
  box(10, 3, 0.25, wallMat, 0, 1.8, -3.375, ground);
  box(0.25, 3, 7, wallMat, -4.875, 1.8, 0, ground);
  box(0.25, 3, 3, wallMat, 4.875, 1.8, -2, ground);
  box(9.5, 3, 0.06, glassMat, 0, 1.8, 3.4, ground);
  box(0.06, 3, 3.6, glassMat, 4.9, 1.8, 1.6, ground);
  for (let i = -2; i <= 2; i++) box(0.08, 3, 0.12, darkMat, i * 2.3, 1.8, 3.45, ground);
  box(10.4, 0.3, 7.4, slabMat, 0, 3.45, 0, ground);

  box(11, 0.2, 6, slabMat, 2.2, 0.1, -0.3, upper);
  box(11, 2.6, 0.2, cladMat, 2.2, 1.5, -3.2, upper);
  box(11, 2.6, 0.2, cladMat, 2.2, 1.5, 2.6, upper);
  box(0.2, 2.6, 6, cladMat, -3.2, 1.5, -0.3, upper);
  box(0.2, 2.6, 6, cladMat, 7.6, 1.5, -0.3, upper);
  box(8, 1.1, 0.06, glassMat, 2.7, 1.6, 2.72, upper);
  box(0.06, 1.8, 4, glassMat, 7.72, 1.5, -0.3, upper);

  box(11.6, 0.3, 6.6, roofMat, 2.2, 0.15, -0.3, roof);
  const solar = new THREE.Group();
  roof.add(solar);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 2; j++) {
      const p = box(1.8, 0.06, 1.1, solarMat, -1 + i * 2.1, 0.55, -1.6 + j * 2.2, solar);
      p.rotation.x = -0.35;
    }
  solar.visible = false;

  const pool = new THREE.Group();
  house.add(pool);
  box(8, 0.12, 11, deckMat, -8.5, 0.06, 1.2, house);
  box(3.4, 0.08, 8.6, waterMat, -8.2, 0.1, 1.4, pool);
  box(3.9, 0.04, 9.1, roofMat, -8.2, 0.07, 1.4, pool);

  // rooms: tiles that surface in the exploded view
  const roomTiles = ROOMS.map((r) => {
    const m = new THREE.Mesh(
      track(new THREE.PlaneGeometry(r.w, r.d)),
      track(new THREE.MeshBasicMaterial({ color: r.c, transparent: true, opacity: 0, depthWrite: false }))
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(r.x, r.floor ? 0.22 : 0.32, r.z);
    (r.floor ? upper : ground).add(m);
    return m;
  });
  let roomHi: number | null = null;

  const warmA = new THREE.PointLight(0xffc27a, 0, 14);
  warmA.position.set(0, 2, 1);
  const warmB = new THREE.PointLight(0xffc27a, 0, 14);
  warmB.position.set(2.5, 1.6, 0);
  ground.add(warmA);
  upper.add(warmB);

  // scanning plane for the build
  const scan = new THREE.Mesh(
    track(new THREE.PlaneGeometry(26, 14)),
    track(
      new THREE.MeshBasicMaterial({
        color: BLUEPRINT,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
  );
  scan.rotation.x = -Math.PI / 2;
  scan.position.x = -1.5;
  scene.add(scan);

  /* --- Site + city --- */
  const groundMat = track(new THREE.MeshStandardMaterial({ color: "#56654f", roughness: 1 }));
  const site = new THREE.Mesh(track(new THREE.PlaneGeometry(500, 500)), groundMat);
  site.rotation.x = -Math.PI / 2;
  site.receiveShadow = true;
  scene.add(site);
  const grid = new THREE.GridHelper(80, 80, BLUEPRINT, BLUEPRINT);
  const gridMat = grid.material as THREE.LineBasicMaterial;
  gridMat.transparent = true;
  grid.position.y = 0.01;
  scene.add(grid);
  track(grid.geometry);
  track(gridMat);

  const park = POIS[1];
  const blocks: { x: number; z: number; w: number; d: number; h: number; dist: number }[] = [];
  const treeSpots: [number, number][] = [];
  for (let gx = -8; gx <= 8; gx++)
    for (let gz = -8; gz <= 8; gz++) {
      const x = gx * 9 + (Math.random() - 0.5) * 1.5;
      const z = gz * 9 + (Math.random() - 0.5) * 1.5;
      if (Math.abs(x) < 17 && Math.abs(z) < 15) continue;
      if (Math.hypot(x - park.x, z - park.z) < 11 || Math.random() < 0.12) {
        treeSpots.push([x, z]);
        continue;
      }
      const dist = Math.hypot(x, z);
      blocks.push({ x, z, w: 5 + Math.random() * 2, d: 5 + Math.random() * 2, h: 1.5 + Math.random() * (2 + dist / 14), dist });
    }
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 13 + Math.random() * 5;
    treeSpots.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const cityMat = track(new THREE.MeshStandardMaterial({ color: "#d9d4ca", roughness: 0.9, emissive: new THREE.Color("#ffcf8a"), emissiveIntensity: 0 }));
  const city = new THREE.InstancedMesh(track(new THREE.BoxGeometry(1, 1, 1)), cityMat, blocks.length);
  city.castShadow = city.receiveShadow = true;
  scene.add(city);
  const trees = new THREE.InstancedMesh(
    track(new THREE.ConeGeometry(0.9, 2.8, 7)),
    track(new THREE.MeshStandardMaterial({ color: "#3f6b45", roughness: 0.9 })),
    treeSpots.length
  );
  trees.castShadow = true;
  const dummy = new THREE.Object3D();
  treeSpots.forEach(([x, z], i) => {
    const s = 0.7 + Math.random() * 0.6;
    dummy.position.set(x, 1.4 * s, z);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
  });
  scene.add(trees);
  let lastRise = -1;
  const layoutCity = (rise: number) => {
    blocks.forEach((b, i) => {
      const s = THREE.MathUtils.clamp((rise * 1.5 - b.dist / 110) * 3, 0.001, 1);
      dummy.position.set(b.x, (b.h * s) / 2, b.z);
      dummy.scale.set(b.w, b.h * s, b.d);
      dummy.updateMatrix();
      city.setMatrixAt(i, dummy.matrix);
    });
    city.instanceMatrix.needsUpdate = true;
  };
  layoutCity(0);

  const accent = new THREE.Color(ACCENT);
  const pinMat = track(new THREE.MeshBasicMaterial({ color: accent, transparent: true }));
  const pulseMat = track(new THREE.MeshBasicMaterial({ color: accent, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  const pins = POIS.map((p) => {
    const g = new THREE.Group();
    g.position.set(p.x, 0, p.z);
    const stem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.08, 0.08, 6, 8)), pinMat);
    stem.position.y = 3;
    const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.6, 16, 12)), pinMat);
    head.position.y = 6.3;
    const pulse = new THREE.Mesh(track(new THREE.RingGeometry(0.8, 1.1, 40)), pulseMat);
    pulse.rotation.x = -Math.PI / 2;
    pulse.position.y = 0.06;
    g.add(stem, head, pulse);
    scene.add(g);
    return { g, pulse };
  });
  const rings = RINGS.map((r) => {
    const m = new THREE.Mesh(
      track(new THREE.RingGeometry(r, r + 0.35, 120)),
      track(new THREE.MeshBasicMaterial({ color: accent, transparent: true, side: THREE.DoubleSide, depthWrite: false }))
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.05;
    scene.add(m);
    return m;
  });

  /* --- Lights --- */
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 120 });
  sun.shadow.bias = -0.0005;
  const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x3a3328, 0.8);
  scene.add(sun, sun.target, hemi);

  let hour = 17.5;
  const sunWarm = new THREE.Color("#ffb070");
  const sunNoon = new THREE.Color("#fff4e0");
  const sky = new THREE.Color();
  const bpColor = new THREE.Color("#0c2340");
  const grass = new THREE.Color("#56654f");

  /* --- Camera rail --- */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const posCurve = new THREE.CatmullRomCurve3(
    [V(16, 10, 18), V(-17, 4.5, 15), V(20, 13, 14), V(13, 3.5, 16), V(45, 62, 52)],
    false,
    "centripetal"
  );
  const tgtCurve = new THREE.CatmullRomCurve3([V(1, 2.5, 0), V(0, 3, 0), V(1, 5.5, 0), V(0, 3, 0), V(0, 0, 0)], false, "centripetal");
  const frame = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // push the villa right of centre on wide screens so the copy can sit left
    if (w / h > 1.1) camera.setViewOffset(w, h, -w * 0.14, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  frame();
  window.addEventListener("resize", frame);

  /* --- Input --- */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let dragging = false;
  let lastX = 0;
  let yaw = 0;
  let yawTarget = 0;
  let k = 0;
  const configActive = () => k > 2.6 && k < 3.4;
  const onMove = (e: PointerEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (dragging) {
      yawTarget = THREE.MathUtils.clamp(yawTarget - (e.clientX - lastX) * 0.006, -1.4, 1.4);
      lastX = e.clientX;
    }
  };
  const onDown = (e: PointerEvent) => {
    if (e.target === canvas && configActive()) {
      dragging = true;
      lastX = e.clientX;
    }
  };
  const onUp = () => (dragging = false);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);

  /* --- Labels: DOM elements pinned to world points --- */
  const slots = Array.from(labels.querySelectorAll<HTMLElement>("[data-slot]"));
  const v = new THREE.Vector3();
  const placeLabel = (i: number, p: THREE.Vector3, alpha: number) => {
    const el = slots[i];
    if (!el) return;
    v.copy(p).project(camera);
    const vis = alpha > 0.02 && v.z < 1;
    el.style.opacity = vis ? String(alpha) : "0";
    el.style.pointerEvents = vis && alpha > 0.5 ? "auto" : "none";
    if (vis)
      el.style.transform = `translate(${((v.x + 1) / 2) * window.innerWidth}px, ${((1 - v.y) / 2) * window.innerHeight}px) translate(-50%, -100%)`;
  };

  /* --- Loop --- */
  let ks = 0;
  let chapter = -1;
  let raf = 0;
  let first = true;
  const clock = new THREE.Clock();
  const smooth = THREE.MathUtils.smoothstep;
  const tgt = new THREE.Vector3();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    k = stationProgress(4);
    ks += (k - ks) * 0.07;
    const ch = Math.round(k);
    if (ch !== chapter) cb.onChapter((chapter = ch));

    // camera: eased between stations, orbit by drag while configuring
    const seg = Math.min(Math.floor(ks), 3);
    const f = ks - seg;
    const u = (seg + f * f * (3 - 2 * f)) / 4;
    camera.position.copy(posCurve.getPoint(u));
    tgt.copy(tgtCurve.getPoint(u));
    const cw = 1 - smooth(Math.abs(ks - 3), 0.25, 0.7);
    if (!configActive() && !dragging) yawTarget *= 0.95;
    yaw += (yawTarget - yaw) * 0.08;
    camera.position.sub(tgt).applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw * cw).add(tgt);
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;
    camera.position.x += mouse.sx * 0.6;
    camera.position.y += mouse.sy * 0.4;
    camera.lookAt(tgt);

    // blueprint → built
    const bp = 1 - smooth(ks, 0.35, 0.9);
    const build = smooth(ks, 0.1, 0.85);
    const buildH = build >= 1 ? 1000 : -0.1 + build * 7.6;
    clip.constant = buildH;
    scan.visible = build > 0 && build < 1;
    scan.position.y = buildH;

    // sky, sun, night glow
    const a = sunArc(hour);
    const elev = Math.sin(a);
    const night = 1 - smooth(elev, -0.1, 0.2);
    skyAt(hour, sky);
    bg.copy(sky).lerp(bpColor, bp);
    groundMat.color.copy(grass).multiplyScalar(0.35 + 0.65 * (1 - night)).lerp(bpColor, bp);
    gridMat.opacity = bp * 0.35;
    sun.position.set(-Math.cos(a) * 30, Math.max(elev, 0.04) * 26, 16);
    sun.intensity = 3.2 * smooth(elev, 0, 0.25) * (1 - bp);
    sun.color.copy(sunWarm).lerp(sunNoon, THREE.MathUtils.clamp(elev * 1.5, 0, 1));
    hemi.intensity = (0.2 + 0.7 * (1 - night)) * (1 - bp * 0.6) + bp * 0.3;
    glassMat.emissiveIntensity = night * 2.2;
    waterMat.emissiveIntensity = 0.1 + night * 1.1;
    warmA.intensity = warmB.intensity = night * 18;
    cityMat.emissiveIntensity = night * 0.14;

    // exploded floors + rooms
    const ex = 1 - smooth(Math.abs(ks - 2), 0.3, 0.75);
    upper.position.y = 3.6 + ex * 3.2;
    roof.position.y = 6.4 + ex * 6.6;
    wallMat.opacity = cladMat.opacity = 1 - ex * 0.9;
    wallMat.depthWrite = cladMat.depthWrite = ex < 0.1;
    glassMat.opacity = 0.35 * (1 - ex * 0.7);
    lineMat.opacity = Math.max(bp, ex * 0.55);
    roomTiles.forEach((m, i) => {
      const hi = roomHi === i;
      (m.material as THREE.MeshBasicMaterial).opacity = ex * (hi ? 0.95 : 0.6);
      m.position.y += ((ROOMS[i].floor ? 0.22 : 0.32) + (hi ? 0.15 : 0) - m.position.y) * 0.2;
      placeLabel(i, m.getWorldPosition(v).setY(v.y + 0.4), ex);
    });

    // neighbourhood
    const rise = smooth(ks, 3.1, 3.85);
    city.visible = rise > 0.001;
    if (city.visible && Math.abs(rise - lastRise) > 0.001) layoutCity((lastRise = rise));
    const hood = smooth(ks, 3.4, 3.9);
    pinMat.opacity = hood;
    // pulses share one material, so they beat in sync
    const beat = reduced ? 0.5 : (t * 0.6) % 1;
    pulseMat.opacity = hood * (1 - beat) * 0.8;
    pins.forEach(({ g, pulse }, i) => {
      g.visible = hood > 0.01;
      pulse.scale.setScalar(1 + beat * 5);
      placeLabel(POI_SLOT + i, v.set(g.position.x, 7.4, g.position.z), hood);
    });
    rings.forEach((m, i) => {
      (m.material as THREE.MeshBasicMaterial).opacity = hood * (0.55 - i * 0.12 + Math.sin(t * 1.5 - i) * 0.08);
      placeLabel(RING_SLOT + i, v.set(RINGS[i] * 0.7071, 0.5, RINGS[i] * 0.7071), hood);
    });

    canvas.style.cursor = dragging ? "grabbing" : configActive() ? "grab" : "default";
    renderer.render(scene, camera);
    if (first) {
      first = false;
      cb.onReady();
    }
  };
  tick();

  return {
    api: {
      setHour: (h) => (hour = h),
      setFacade: (i) => {
        cladMat.color.set(FACADES[i].hex);
        cladMat.roughness = FACADES[i].roughness;
      },
      setPool: (on) => (pool.visible = on),
      setSolar: (on) => (solar.visible = on),
      highlightRoom: (i) => (roomHi = i),
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      disposables.forEach((d) => d.dispose());
      city.dispose();
      trees.dispose();
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const fmtHour = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};
const eur = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

export const RealEstate3D: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [hour, setHour] = useState(17.5);
  const [playing, setPlaying] = useState(false);
  const [facade, setFacade] = useState(0);
  const [pool, setPool] = useState(true);
  const [solar, setSolar] = useState(false);
  const [room, setRoom] = useState<number | null>(null);
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("walk");
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!canvas.current || !labels.current) return;
    let readyTimer: ReturnType<typeof setTimeout>;
    const eng = startEngine(canvas.current, labels.current, {
      onReady: () => (readyTimer = setTimeout(() => setLoaded(true), 600)),
      onChapter: setChapter,
    });
    api.current = eng.api;
    return () => {
      clearTimeout(readyTimer);
      eng.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.setHour(hour);
  }, [hour]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setHour((h) => {
        const n = h + dt * 1.6;
        if (n >= 22) {
          setPlaying(false);
          return 22;
        }
        return n;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const elev = Math.sin(sunArc(hour));
  const altitude = Math.max(0, Math.round(Math.asin(Math.max(elev, 0)) * (180 / Math.PI) * 0.7));
  const mood = elev < -0.05 ? "Lamp-lit" : elev < 0.3 ? "Golden hour" : "Full daylight";
  const price = BASE_PRICE + FACADES[facade].delta + (pool ? POOL_PRICE : 0) + (solar ? SOLAR_PRICE : 0);
  const r = 0.041 / 12;
  const monthly = (price * 0.8 * r) / (1 - Math.pow(1 + r, -360));
  const modeF = MODES.find((m) => m.id === mode)!.f;
  const mins = (walk: number) => Math.max(1, Math.round(walk * modeF));

  return (
    <div className="relative bg-[#0c2340] text-white selection:bg-[#f2c48d] selection:text-black">
      <canvas ref={canvas} className="fixed inset-0 h-screen w-screen" />
      <FilmOverlay />
      <Loader
        title={
          <p className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">
            Casa <span style={{ color: BLUEPRINT }}>Lumen</span>
          </p>
        }
        note="Drafting the plans"
        progress={loaded ? 1 : 0.6}
        loaded={loaded}
        accent={BLUEPRINT}
        bg="#0c2340"
      />

      <DemoDock
        label="Aura Estates — Casa Lumen 3D"
        accent={ACCENT}
        right={
          <Link
            href="/work/real-estate"
            className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-xl"
          >
            2D Site
          </Link>
        }
      />
      <ChapterRail chapters={CHAPTERS} active={chapter} accent={ACCENT} />

      {/* world-pinned labels, positioned by the engine each frame */}
      <div ref={labels} className="pointer-events-none fixed inset-0 z-20">
        {ROOMS.map((rm, i) => (
          <div
            key={rm.name}
            data-slot
            className="absolute left-0 top-0 opacity-0"
            onMouseEnter={() => {
              setRoom(i);
              api.current?.highlightRoom(i);
            }}
            onMouseLeave={() => {
              setRoom(null);
              api.current?.highlightRoom(null);
            }}
          >
            <div
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md transition-all ${
                room === i ? "scale-110 border-white bg-white text-black" : "border-white/20 bg-black/50 text-white"
              }`}
            >
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: rm.c }} />
              {rm.name} · {rm.m2} m²
            </div>
          </div>
        ))}
        {POIS.map((p) => (
          <div key={p.name} data-slot className="absolute left-0 top-0 opacity-0">
            <div className="whitespace-nowrap rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-center backdrop-blur-md">
              <p className="text-[11px] font-semibold">{p.name}</p>
              <p className="font-mono text-[10px]" style={{ color: ACCENT }}>
                {mins(p.walk)} min {mode}
              </p>
            </div>
          </div>
        ))}
        {RINGS.map((rg, i) => (
          <div key={rg} data-slot className="absolute left-0 top-0 opacity-0">
            <span className="font-mono text-[10px] font-bold" style={{ color: ACCENT }}>
              {mins((i + 1) * 5)} MIN
            </span>
          </div>
        ))}
      </div>

      <main className="pointer-events-none relative z-10">
        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-16 sm:px-12 md:justify-center md:pb-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: BLUEPRINT }}>
              Aura Estates · Lot 07 · Côte Ouest
            </p>
            <h1 className="mt-4 font-display text-[16vw] font-extrabold uppercase leading-[0.85] tracking-tight md:text-[7.5vw]">
              Casa
              <br />
              Lumen
            </h1>
            <p className="mt-6 max-w-xs text-sm font-light text-white/70">
              This is the blueprint. Scroll, and watch the house print itself into existence.
            </p>
            <div className="mt-6 flex gap-6 font-mono text-[11px] text-white/60">
              <span>312 m²</span>
              <span>4 bed</span>
              <span>0.4 ha</span>
            </div>
          </div>
        </Station>

        <Station>
          <div className="flex h-full items-center px-6 sm:px-12">
            <Panel>
              <Eyebrow>02 — Sun Study</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none">Live with the light</h2>
              <p className="mt-2 text-xs text-white/60">Scrub the day. Shadows are computed from the real sun arc.</p>
              <div className="mt-5 flex items-end justify-between">
                <p className="font-mono text-4xl font-bold">{fmtHour(hour)}</p>
                <button
                  onClick={() => {
                    if (hour >= 21.9) setHour(5);
                    setPlaying(!playing);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold"
                >
                  {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />} {playing ? "Pause" : "Play a day"}
                </button>
              </div>
              <input
                type="range"
                min={5}
                max={22}
                step={0.05}
                value={hour}
                onChange={(e) => {
                  setPlaying(false);
                  setHour(Number(e.target.value));
                }}
                className="mt-3 w-full accent-[#f2c48d]"
              />
              <div className="mt-1 flex justify-between font-mono text-[9px] text-white/40">
                <span>05:00</span>
                <span>12:00</span>
                <span>22:00</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Stat k="Sun altitude" v={`${altitude}°`} />
                <Stat k="Mood" v={mood} />
                <Stat k="Daylight" v="13h 40m" />
              </div>
            </Panel>
          </div>
        </Station>

        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-16 sm:px-12">
            <Eyebrow>03 — Floor Plan</Eyebrow>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-extrabold uppercase leading-none sm:text-6xl">
              Every metre, <span style={{ color: ACCENT }}>accounted for.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm font-light text-white/60">
              The floors lift apart. Hover a room tag to light it up — {ROOMS.reduce((a, b) => a + b.m2, 0)} m² interior,
              312 m² with terraces.
            </p>
          </div>
        </Station>

        <Station>
          <div className="flex h-full items-center px-6 sm:px-12">
            <Panel>
              <Eyebrow>04 — Configure</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none">Make it yours</h2>
              <p className="mt-2 text-xs text-white/60">Drag the scene to walk around the house.</p>
              <Label>Facade · {FACADES[facade].name}</Label>
              <div className="grid grid-cols-4 gap-2">
                {FACADES.map((fc, i) => (
                  <button
                    key={fc.name}
                    onClick={() => {
                      setFacade(i);
                      api.current?.setFacade(i);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-[10px] font-semibold transition ${
                      facade === i ? "border-[#f2c48d]" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="h-6 w-full rounded-md" style={{ background: fc.hex }} />
                    {fc.name}
                  </button>
                ))}
              </div>
              <Label>Extras</Label>
              <Toggle
                on={pool}
                label="Infinity pool"
                price={POOL_PRICE}
                onClick={() => {
                  setPool(!pool);
                  api.current?.setPool(!pool);
                }}
              />
              <Toggle
                on={solar}
                label="Solar roof · 9.6 kWp"
                price={SOLAR_PRICE}
                onClick={() => {
                  setSolar(!solar);
                  api.current?.setSolar(!solar);
                }}
              />
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[10px] uppercase tracking-widest text-white/40">Asking price</p>
                <p className="font-display text-3xl font-extrabold">{eur(price)}</p>
                <p className="mt-1 font-mono text-[11px] text-white/50">
                  ≈ {eur(monthly)}/mo · 20% down · 30y @ 4.1%
                </p>
              </div>
            </Panel>
          </div>
        </Station>

        <Station last>
          <div className="flex h-full items-end px-6 pb-12 sm:px-12">
            <Panel>
              <Eyebrow>05 — Neighbourhood</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none">Everything, minutes away</h2>
              <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-full border border-white/10 p-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[11px] font-semibold transition ${
                      mode === m.id ? "bg-[#f2c48d] text-black" : "text-white/70"
                    }`}
                  >
                    <m.icon className="h-3.5 w-3.5" /> {m.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setRequested(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-black"
                >
                  {requested ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Requested
                    </>
                  ) : (
                    "Book private viewing"
                  )}
                </button>
                <button
                  onClick={() => scrollToStation(0)}
                  className="rounded-full border border-white/20 px-4 text-xs font-bold uppercase tracking-wider"
                >
                  Replay
                </button>
              </div>
            </Panel>
          </div>
        </Station>
      </main>
    </div>
  );
};

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl">
    {children}
  </div>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: ACCENT }}>
    {children}
  </p>
);

const Stat: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="rounded-xl border border-white/10 px-2 py-2">
    <p className="text-[9px] uppercase tracking-widest text-white/40">{k}</p>
    <p className="mt-0.5 text-xs font-semibold">{v}</p>
  </div>
);

const Toggle: React.FC<{ on: boolean; label: string; price: number; onClick: () => void }> = ({ on, label, price, onClick }) => (
  <button onClick={onClick} className="mb-2 flex w-full items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-xs">
    <span className="flex items-center gap-2">
      <span className={`flex h-4 w-7 items-center rounded-full p-0.5 transition ${on ? "bg-[#f2c48d]" : "bg-white/15"}`}>
        <span className={`h-3 w-3 rounded-full bg-white transition-transform ${on ? "translate-x-3" : ""}`} />
      </span>
      {label}
    </span>
    <span className="font-mono text-white/50">+{eur(price)}</span>
  </button>
);
