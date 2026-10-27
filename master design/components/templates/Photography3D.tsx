"use client";

/**
 * Monolith Studio — 3D Darkroom.
 * One fixed WebGL canvas; the camera flies a scroll-driven spline through four stations:
 *   0 The Lens       (3D lens barrel, coated glass, iris opens and the camera dives through)
 *   1 Depth of Field (photos in a volume, scroll racks focus, hover autofocuses, bokeh)
 *   2 The Darkroom   (prints on a line under safelight, hover develops them)
 *   3 Long Exposure  (paint light trails with the cursor, capture a polaroid of the canvas)
 */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { X, Camera, Download, Eraser } from "lucide-react";
import { DemoDock, u, prefersReduced } from "@/components/motion/fx";
import { Station, PanelLabel as Label, FilmOverlay, Loader, ChapterRail, scrollToStation as goTo, stationProgress } from "./three-kit";

const ACCENT = "#ff3b2f";
const PAPER = "#f2efe8";

type Photo = { title: string; cat: string; exif: string; img: string; tall?: boolean };
const PHOTOS: Photo[] = [
  { title: "Salt Flats, Dawn", cat: "Landscape", exif: "f/8 · 1/250 · ISO 100 · 35mm", img: u("1509281373149-e957c6296406", 1000), tall: true },
  { title: "Ines, Studio 4", cat: "Portrait", exif: "f/1.8 · 1/160 · ISO 200 · 85mm", img: u("1494790108377-be9c29b29330", 900) },
  { title: "Fjord Light", cat: "Landscape", exif: "f/11 · 1/60 · ISO 64 · 24mm", img: u("1518709268805-4e9042af9f23", 1000) },
  { title: "Night Run", cat: "Editorial", exif: "f/2 · 1/30 · ISO 3200 · 50mm", img: u("1534447677768-be436bb09401", 1000), tall: true },
  { title: "Marcus", cat: "Portrait", exif: "f/2.8 · 1/200 · ISO 400 · 105mm", img: u("1500648767791-00dcc994a43e", 900), tall: true },
  { title: "Still Water", cat: "Landscape", exif: "f/16 · 2s · ISO 50 · 16mm", img: u("1506744038136-46273834b3fb", 1000) },
  { title: "Blue Hour", cat: "Editorial", exif: "f/1.4 · 1/125 · ISO 800 · 50mm", img: u("1531746020798-e6953c6e8e04", 900) },
  { title: "Mist Valley", cat: "Landscape", exif: "f/5.6 · 1/500 · ISO 100 · 70mm", img: u("1470071459604-3b5ec3a7fe05", 1000), tall: true },
  { title: "The Architect", cat: "Portrait", exif: "f/2 · 1/250 · ISO 100 · 85mm", img: u("1507003211169-0a1dd7228f2d", 900) },
  { title: "Milky Ridge", cat: "Astro", exif: "f/1.8 · 20s · ISO 6400 · 14mm", img: u("1519681393784-d120267933ba", 1000) },
  { title: "Green Cathedral", cat: "Landscape", exif: "f/4 · 1/80 · ISO 200 · 35mm", img: u("1441974231531-c6227db76b6e", 1000) },
  { title: "High Pasture", cat: "Landscape", exif: "f/9 · 1/320 · ISO 100 · 50mm", img: u("1500530855697-b586d89ba3ee", 1000) },
];
// Darkroom prints reuse a curated subset of the archive.
const PRINTS = [1, 4, 9, 7, 8, 2];

const SHUTTERS = [
  { label: "1/2s", s: 0.5 },
  { label: "2s", s: 2 },
  { label: "8s", s: 8 },
  { label: "Bulb", s: 60 },
];
const INKS = [
  { name: "Neon", hex: "#ff3bd4" },
  { name: "Tungsten", hex: "#ffa63b" },
  { name: "Ice", hex: "#5fe3ff" },
];

const CHAPTERS = ["Lens", "Focus", "Darkroom", "Exposure"];
const HUD = [
  { f: "f/16", s: "1/125", iso: 100 },
  { f: "f/1.4", s: "1/250", iso: 400 },
  { f: "f/5.6", s: "1/60", iso: 1600 },
  { f: "f/8", s: "B", iso: 50 },
];

type Api = {
  setPersist: (s: number) => void;
  setInk: (i: number) => void;
  clear: () => void;
  capture: () => void;
};

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */
const planeVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const coverFn = /* glsl */ `
vec2 cover(vec2 uv, float planeA, float imgA) {
  vec2 s = planeA > imgA ? vec2(1.0, imgA / planeA) : vec2(planeA / imgA, 1.0);
  return (uv - 0.5) * s + 0.5;
}`;

// Depth-of-field photo: mip-biased multi-tap blur grows with distance from the focal plane.
const dofFrag = /* glsl */ `
uniform sampler2D uTex;
uniform float uImgA, uPlaneA, uBlur, uHover, uFade;
varying vec2 vUv;
${coverFn}
void main() {
  vec2 uv = cover(vUv, uPlaneA, uImgA);
  float b = uBlur * 5.0;
  float o = uBlur * 0.012;
  vec3 c = texture2D(uTex, uv, b).rgb * 0.4;
  c += texture2D(uTex, uv + vec2(o, 0.0), b).rgb * 0.15;
  c += texture2D(uTex, uv - vec2(o, 0.0), b).rgb * 0.15;
  c += texture2D(uTex, uv + vec2(0.0, o), b).rgb * 0.15;
  c += texture2D(uTex, uv - vec2(0.0, o), b).rgb * 0.15;
  c *= 0.75 + uHover * 0.3 - uBlur * 0.25;
  gl_FragColor = vec4(c, uFade);
  #include <colorspace_fragment>
}`;

// Darkroom print: blank paper, image emerges through a chemical noise front, all under red safelight.
const printFrag = /* glsl */ `
uniform sampler2D uTex;
uniform float uImgA, uPlaneA, uDev, uTime;
varying vec2 vUv;
${coverFn}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  vec2 border = vec2(0.07, 0.06);
  vec3 paper = vec3(0.93, 0.91, 0.87);
  vec3 col = paper;
  if (vUv.x > border.x && vUv.x < 1.0 - border.x && vUv.y > border.y * 1.6 && vUv.y < 1.0 - border.y) {
    vec2 iuv = (vUv - vec2(border.x, border.y * 1.6)) / vec2(1.0 - 2.0 * border.x, 1.0 - 2.6 * border.y);
    vec3 img = texture2D(uTex, cover(iuv, uPlaneA, uImgA)).rgb;
    float lum = dot(img, vec3(0.299, 0.587, 0.114));
    float n = noise(iuv * 5.0 + uTime * 0.05) * 0.6 + noise(iuv * 17.0) * 0.4;
    float shown = smoothstep(n - 0.12, n + 0.12, uDev * 1.25 - 0.1);
    // early development is a pale, contrasty silver ghost; colour arrives last
    vec3 ghost = mix(paper, vec3(lum) * paper, 0.8);
    vec3 dev = mix(ghost, img, smoothstep(0.6, 1.0, uDev));
    col = mix(paper, dev, shown);
  }
  col *= vec3(1.0, 0.42, 0.36) * (1.0 - uDev * 0.15) + vec3(0.0, 0.58, 0.64) * uDev * 0.85;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const pointFrag = /* glsl */ `
varying vec3 vColor;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d) * vA);
}`;

const bokehVert = /* glsl */ `
attribute vec3 aColor;
uniform float uFocus, uTime;
varying vec3 vColor;
varying float vA;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.3 + position.x) * 0.15;
  float off = abs(p.z - uFocus);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (0.12 + off * 0.2) * (300.0 / -mv.z);
  vColor = aColor;
  vA = clamp(0.9 / (1.0 + off * 0.8), 0.08, 0.9);
  gl_Position = projectionMatrix * mv;
}`;

const trailVert = /* glsl */ `
attribute float aBirth;
attribute vec3 aColor;
uniform float uTime, uPersist, uSize;
varying vec3 vColor;
varying float vA;
void main() {
  float age = uTime - aBirth;
  float a = aBirth < 0.0 ? 0.0 : clamp(1.0 - age / uPersist, 0.0, 1.0);
  vec3 p = position + vec3(0.0, age * 0.01, 0.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.35 + a) * (300.0 / -mv.z);
  vColor = aColor;
  vA = a;
  gl_Position = projectionMatrix * mv;
}`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
/** Engraved front ring: text set around a circle on a transparent canvas. */
function ringTexture(text: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d")!;
  g.translate(512, 512);
  g.fillStyle = "#d8d4cc";
  g.font = "600 34px 'Helvetica Neue', Arial, sans-serif";
  g.textAlign = "center";
  const step = (Math.PI * 2) / 64;
  [...text].forEach((ch, i) => {
    g.save();
    g.rotate(-Math.PI / 2 + (i - text.length / 2) * step * 0.55);
    g.fillText(ch, 0, -440);
    g.restore();
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Aperture blade, pivot at the local origin; its tip sweeps toward the optical axis when closed. */
function bladeShape(R: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(-R * 0.45, R * 0.55, -R * 1.08, R * 0.3);
  s.lineTo(-R * 1.05, -R * 0.08);
  s.quadraticCurveTo(-R * 0.5, R * 0.12, 0, -R * 0.28);
  s.closePath();
  return s;
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */
function startEngine(
  canvas: HTMLCanvasElement,
  hud: { af: HTMLDivElement; focus: HTMLSpanElement },
  cb: {
    onProgress: (p: number) => void;
    onLoaded: () => void;
    onChapter: (i: number) => void;
    onHover: (title: string | null) => void;
    onSelect: (i: number) => void;
    onCapture: (url: string) => void;
  }
): { api: Api; dispose: () => void } {
  const reduced = prefersReduced();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const bgLens = new THREE.Color(0x060606);
  const bgField = new THREE.Color(0x07080b);
  const bgDark = new THREE.Color(0x1a0405);
  const bgPaint = new THREE.Color(0x030303);
  scene.background = bgLens.clone();
  scene.fog = new THREE.Fog(0x060606, 7, 30);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 140);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.7;

  const manager = new THREE.LoadingManager();
  manager.onProgress = (_u, loaded, total) => cb.onProgress(loaded / total);
  manager.onLoad = () => cb.onLoaded();
  const loader = new THREE.TextureLoader(manager);
  loader.setCrossOrigin("anonymous");
  const disposables: { dispose: () => void }[] = [envTex, pmrem];
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  const aspects = PHOTOS.map(() => 1);
  const textures = PHOTOS.map((p, i) => {
    const t = track(loader.load(p.img, (tx) => (aspects[i] = tx.image.width / tx.image.height)));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  });

  /* --- 0 · The lens --- */
  const lens = new THREE.Group();
  scene.add(lens);
  const anodised = track(new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.7, roughness: 0.42, side: THREE.DoubleSide }));
  const barrel = new THREE.Mesh(track(new THREE.CylinderGeometry(1.95, 1.95, 3, 96, 1, true)), anodised);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = -0.9;
  const gripGeo = track(new THREE.CylinderGeometry(2.05, 2.05, 1, 240, 1, true));
  const gp = gripGeo.attributes.position;
  for (let i = 0; i < gp.count; i++) {
    const a = Math.atan2(gp.getZ(i), gp.getX(i));
    const r = 2.05 + (Math.sin(a * 120) > 0 ? 0.035 : 0);
    gp.setXYZ(i, Math.cos(a) * r, gp.getY(i), Math.sin(a) * r);
  }
  gripGeo.computeVertexNormals();
  const grip = new THREE.Mesh(gripGeo, track(new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.85, side: THREE.DoubleSide })));
  grip.rotation.x = Math.PI / 2;
  grip.position.z = -0.6;
  const redRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(1.99, 0.025, 8, 160)),
    track(new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.6 }))
  );
  redRing.position.z = 0.15;
  // engraving is light-on-transparent: used as both map and emissive so the lettering reads in the dark
  const engraving = track(ringTexture("MONOLITH  50mm  1:1.2  ·  Ø 77  ·  MADE IN STUDIO"));
  const front = new THREE.Mesh(
    track(new THREE.RingGeometry(1.72, 2.0, 160)),
    track(
      new THREE.MeshStandardMaterial({ map: engraving, emissiveMap: engraving, emissive: 0xffffff, emissiveIntensity: 0.8, color: 0x1a1a1a, metalness: 0.6, roughness: 0.35 })
    )
  );
  front.position.z = 0.6;

  const capR = 2.6;
  const capTheta = Math.asin(1.72 / capR);
  const glassGeo = track(new THREE.SphereGeometry(capR, 64, 24, 0, Math.PI * 2, 0, capTheta));
  glassGeo.rotateX(Math.PI / 2);
  const glass = new THREE.Mesh(
    glassGeo,
    track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1,
        thickness: 0.6,
        roughness: 0.04,
        ior: 1.5,
        iridescence: 1,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [180, 600],
        envMapIntensity: 0.8,
      })
    )
  );
  glass.position.z = 0.5 - capR * Math.cos(capTheta);

  const iris = new THREE.Group();
  iris.position.z = -0.15;
  const blades: THREE.Mesh[] = [];
  const BLADES = 9;
  const IR = 1.72;
  const bladeGeo = track(new THREE.ShapeGeometry(bladeShape(IR), 24));
  const bladeMat = track(new THREE.MeshStandardMaterial({ color: 0x1c1c1e, metalness: 0.85, roughness: 0.38, side: THREE.DoubleSide }));
  for (let i = 0; i < BLADES; i++) {
    const th = (i / BLADES) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.position.set(Math.cos(th) * IR, Math.sin(th) * IR, i * 0.004);
    pivot.rotation.z = th;
    const b = new THREE.Mesh(bladeGeo, bladeMat);
    pivot.add(b);
    iris.add(pivot);
    blades.push(b);
  }
  lens.add(barrel, grip, redRing, front, glass, iris);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 5, 8);
  const rim = new THREE.PointLight(ACCENT, 25, 10);
  rim.position.set(-3, -2, 2);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

  /* --- 1 · Depth of field --- */
  type DofMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  const field: DofMesh[] = [];
  PHOTOS.forEach((p, i) => {
    const w = p.tall ? 1.7 : 2.6;
    const h = p.tall ? 2.3 : 1.7;
    const mat = track(
      new THREE.ShaderMaterial({
        vertexShader: planeVert,
        fragmentShader: dofFrag,
        transparent: true,
        uniforms: {
          uTex: { value: textures[i] },
          uImgA: { value: 1 },
          uPlaneA: { value: w / h },
          uBlur: { value: 1 },
          uHover: { value: 0 },
          uFade: { value: 1 },
        },
      })
    );
    const m = new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), mat) as DofMesh;
    const a = i * 2.4;
    let x = Math.cos(a) * (2.2 + (i % 3) * 1.1);
    const y = Math.sin(a * 1.3) * 1.6;
    if (Math.abs(x) < 1.6) x = Math.sign(x || 1) * 1.6;
    m.position.set(x, y, -18 - i * 2.1);
    m.rotation.y = -x * 0.06;
    m.userData = { i, w, h, base: m.position.clone() };
    field.push(m);
    scene.add(m);
  });

  const bokehN = 220;
  const bPos = new Float32Array(bokehN * 3);
  const bCol = new Float32Array(bokehN * 3);
  const warm = new THREE.Color("#ffb46b");
  const cool = new THREE.Color("#7fb6ff");
  for (let i = 0; i < bokehN; i++) {
    bPos.set([(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 9, -14 - Math.random() * 34], i * 3);
    const c = warm.clone().lerp(cool, Math.random());
    bCol.set([c.r, c.g, c.b], i * 3);
  }
  const bokehGeo = track(new THREE.BufferGeometry());
  bokehGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
  bokehGeo.setAttribute("aColor", new THREE.BufferAttribute(bCol, 3));
  const bokehU = { uFocus: { value: -20 }, uTime: { value: 0 } };
  const bokeh = new THREE.Points(
    bokehGeo,
    track(new THREE.ShaderMaterial({ vertexShader: bokehVert, fragmentShader: pointFrag, uniforms: bokehU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  );
  bokeh.frustumCulled = false;
  scene.add(bokeh);

  /* --- 2 · Darkroom --- */
  const DARK_Z = -64;
  const darkroom = new THREE.Group();
  darkroom.position.z = DARK_Z;
  scene.add(darkroom);
  const lineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7, 2.1, 0),
    new THREE.Vector3(0, 1.75, 0),
    new THREE.Vector3(7, 2.1, 0),
  ]);
  darkroom.add(new THREE.Mesh(track(new THREE.TubeGeometry(lineCurve, 64, 0.008, 6)), track(new THREE.MeshBasicMaterial({ color: 0x3a1010 }))));
  type PrintMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  const prints: PrintMesh[] = [];
  const pinMat = track(new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.8 }));
  const pinGeo = track(new THREE.BoxGeometry(0.08, 0.32, 0.06));
  const printGeo = track(new THREE.PlaneGeometry(1.5, 1.95));
  printGeo.translate(0, -0.975, 0);
  PRINTS.forEach((pi, i) => {
    const x = -5.2 + i * 2.08;
    const tx = (x + 7) / 14;
    const hang = new THREE.Group();
    hang.position.copy(lineCurve.getPoint(tx));
    const mat = track(
      new THREE.ShaderMaterial({
        vertexShader: planeVert,
        fragmentShader: printFrag,
        side: THREE.DoubleSide,
        uniforms: { uTex: { value: textures[pi] }, uImgA: { value: 1 }, uPlaneA: { value: 1.36 / 1.66 }, uDev: { value: 0 }, uTime: { value: 0 } },
      })
    );
    const m = new THREE.Mesh(printGeo, mat) as PrintMesh;
    m.userData = { i: pi, dev: 0, hover: 0, seed: Math.random() * 10 };
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.y = -0.05;
    pin.position.z = 0.02;
    hang.add(m, pin);
    darkroom.add(hang);
    prints.push(m);
  });
  const safelight = new THREE.PointLight(0xff2a1a, 40, 14);
  safelight.position.set(-4.5, 3.2, DARK_Z + 2);
  const lamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.18, 24, 12)), track(new THREE.MeshBasicMaterial({ color: 0xff3b2f })));
  lamp.position.copy(safelight.position);
  scene.add(safelight, lamp);

  /* --- 3 · Long exposure light painting --- */
  const PAINT_Z = -90;
  const TRAIL = 9000;
  const tPos = new Float32Array(TRAIL * 3);
  const tBirth = new Float32Array(TRAIL).fill(-1);
  const tCol = new Float32Array(TRAIL * 3);
  const trailGeo = track(new THREE.BufferGeometry());
  trailGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
  trailGeo.setAttribute("aBirth", new THREE.BufferAttribute(tBirth, 1));
  trailGeo.setAttribute("aColor", new THREE.BufferAttribute(tCol, 3));
  const trailU = { uTime: { value: 0 }, uPersist: { value: 2 }, uSize: { value: 0.16 } };
  const trail = new THREE.Points(
    trailGeo,
    track(new THREE.ShaderMaterial({ vertexShader: trailVert, fragmentShader: pointFrag, uniforms: trailU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  );
  trail.frustumCulled = false;
  scene.add(trail);
  let head = 0;
  let ink = 0;
  const tmpC = new THREE.Color();
  const emit = (p: THREE.Vector3, t: number) => {
    if (ink === 0) tmpC.setHSL((t * 0.12) % 1, 1, 0.6);
    else tmpC.set(INKS[ink].hex).offsetHSL((Math.random() - 0.5) * 0.04, 0, (Math.random() - 0.5) * 0.1);
    tPos.set([p.x + (Math.random() - 0.5) * 0.03, p.y + (Math.random() - 0.5) * 0.03, p.z], head * 3);
    tCol.set([tmpC.r, tmpC.g, tmpC.b], head * 3);
    tBirth[head] = t;
    head = (head + 1) % TRAIL;
  };
  const paintPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -PAINT_Z);

  /* --- Camera rail --- */
  let posCurve: THREE.CatmullRomCurve3;
  let tgtCurve: THREE.CatmullRomCurve3;
  const buildRail = () => {
    const wide = window.innerWidth / window.innerHeight > 1.1;
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    posCurve = new THREE.CatmullRomCurve3(
      [V(0, 0, wide ? 7 : 10), V(0, 0, -11), V(0, 0.3, DARK_Z + (wide ? 8 : 12)), V(0, 0, PAINT_Z + 10)],
      false,
      "centripetal"
    );
    tgtCurve = new THREE.CatmullRomCurve3([V(wide ? -1.8 : 0, 0, 0), V(0, 0, -30), V(0, 0.2, DARK_Z), V(0, 0, PAINT_Z)], false, "centripetal");
  };
  buildRail();

  /* --- Input --- */
  const ndc = new THREE.Vector2(9, 9);
  const mouse = { x: 0, y: 0, sx: 0, sy: 0, vx: 0 };
  const ray = new THREE.Raycaster();
  let hovered: THREE.Mesh | null = null;
  let overCanvas = false;
  let lastPaint: THREE.Vector3 | null = null;
  let lastPaintT = -10;
  let lastUserT = -10;
  let k = 0;

  const onMove = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.vx = nx - ndc.x;
    ndc.set(nx, -(e.clientY / window.innerHeight) * 2 + 1);
    mouse.x = ndc.x;
    mouse.y = ndc.y;
    overCanvas = e.target === canvas;
  };
  const onDown = (e: PointerEvent) => {
    if (e.target !== canvas || !hovered) return;
    cb.onSelect((hovered.userData as { i: number }).i);
  };
  const onLeave = () => (overCanvas = false);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onDown);
  document.addEventListener("pointerleave", onLeave);

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    buildRail();
  };
  window.addEventListener("resize", onResize);

  /* --- Loop --- */
  const clock = new THREE.Clock();
  let ks = 0;
  let chapter = -1;
  let raf = 0;
  let focusZ = -18;
  let captureReq = false;
  const hit = new THREE.Vector3();
  const corner = new THREE.Vector3();
  const bgTmp = new THREE.Color();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    k = stationProgress(3);
    ks += (k - ks) * 0.07;

    const seg = Math.min(Math.floor(ks), 2);
    const f = ks - seg;
    const eased = (seg + f * f * (3 - 2 * f)) / 3;
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;
    camera.position.copy(posCurve.getPoint(eased));
    camera.position.x += mouse.sx * 0.3;
    camera.position.y += mouse.sy * 0.2;
    camera.lookAt(tgtCurve.getPoint(eased));
    // dolly-zoom kick as we dive through the aperture
    const warp = Math.exp(-Math.pow((ks - 0.42) / 0.14, 2));
    camera.fov = 45 + warp * 28;
    camera.updateProjectionMatrix();

    // background mood per station
    if (ks < 1) bgTmp.copy(bgLens).lerp(bgField, ks);
    else if (ks < 2) bgTmp.copy(bgField).lerp(bgDark, THREE.MathUtils.smoothstep(ks, 1.3, 1.9));
    else bgTmp.copy(bgDark).lerp(bgPaint, THREE.MathUtils.smoothstep(ks, 2.2, 2.7));
    (scene.background as THREE.Color).copy(bgTmp);
    (scene.fog as THREE.Fog).color.copy(bgTmp);

    const ch = Math.round(k);
    if (ch !== chapter) cb.onChapter((chapter = ch));
    ray.setFromCamera(ndc, camera);

    // lens
    lens.visible = camera.position.z > -3;
    glass.visible = camera.position.z > 1.3;
    const open = reduced ? 1 : THREE.MathUtils.clamp(0.22 + ks * 2.2, 0, 1);
    blades.forEach((b, i) => {
      b.rotation.z = -0.15 - open * 1.05 + Math.sin(t * 2 + i) * 0.004;
    });
    lens.rotation.y = mouse.sx * 0.25 * (1 - Math.min(ks * 2, 1));
    lens.rotation.x = -mouse.sy * 0.18 * (1 - Math.min(ks * 2, 1));
    redRing.rotation.z = t * 0.2;

    // depth of field
    let hoverNext: THREE.Mesh | null = null;
    if (overCanvas && ks > 0.6 && ks < 1.6) hoverNext = (ray.intersectObjects(field)[0]?.object as THREE.Mesh) ?? null;
    if (overCanvas && ks > 1.6 && ks < 2.5) hoverNext = (ray.intersectObjects(prints)[0]?.object as THREE.Mesh) ?? null;
    if (hoverNext !== hovered) {
      hovered = hoverNext;
      cb.onHover(hovered ? PHOTOS[(hovered.userData as { i: number }).i].title : null);
    }
    const hoveredField = hovered && field.includes(hovered as DofMesh) ? (hovered as DofMesh) : null;
    const scrollFocus = THREE.MathUtils.mapLinear(THREE.MathUtils.clamp(k, 0.55, 1.6), 0.55, 1.6, -17, -41);
    focusZ += ((hoveredField ? hoveredField.position.z : scrollFocus) - focusZ) * 0.08;
    bokehU.uFocus.value = focusZ;
    bokehU.uTime.value = t;
    let sharpest: DofMesh | null = null;
    field.forEach((m, i) => {
      const d = m.userData as { base: THREE.Vector3 };
      m.material.uniforms.uImgA.value = aspects[i];
      const off = Math.abs(m.position.z - focusZ);
      m.material.uniforms.uBlur.value = Math.min(off / 5, 1);
      m.material.uniforms.uHover.value += ((m === hovered ? 1 : 0) - m.material.uniforms.uHover.value) * 0.1;
      m.material.uniforms.uFade.value = THREE.MathUtils.clamp((camera.position.z - m.position.z - 0.6) / 2, 0, 1);
      m.position.y = d.base.y + Math.sin(t * 0.5 + i) * 0.08;
      if (!sharpest || off < Math.abs(sharpest.position.z - focusZ)) sharpest = m;
    });

    // autofocus brackets on the sharpest frame
    const showAf = ks > 0.7 && ks < 1.5 && sharpest;
    if (showAf && sharpest) {
      const s = sharpest as DofMesh;
      const { w, h } = s.userData as { w: number; h: number };
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        corner.set((cx * w) / 2, (cy * h) / 2, 0).applyMatrix4(s.matrixWorld).project(camera);
        const sx = (corner.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-corner.y * 0.5 + 0.5) * window.innerHeight;
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
      }
      hud.af.style.opacity = "1";
      hud.af.style.transform = `translate(${x0}px, ${y0}px)`;
      hud.af.style.width = `${x1 - x0}px`;
      hud.af.style.height = `${y1 - y0}px`;
      hud.focus.textContent = `${(Math.abs(camera.position.z - focusZ) * 0.35).toFixed(1)} m`;
    } else {
      hud.af.style.opacity = "0";
      hud.focus.textContent = ks < 0.6 ? "∞" : ks < 2.5 ? "1.2 m" : "3.0 m";
    }

    // darkroom
    if (ks > 1.4 && ks < 2.8) {
      const arrived = ks > 1.85;
      prints.forEach((m, i) => {
        const d = m.userData as { dev: number; hover: number; seed: number };
        const want = m === hovered ? 1 : arrived ? Math.min(1, Math.max(0, (ks - 1.85) * 5 - i * 0.1)) * 0.8 : 0;
        d.dev = Math.max(d.dev - 0.0006, d.dev + (want - d.dev) * (m === hovered ? 0.03 : 0.015));
        m.material.uniforms.uDev.value = d.dev;
        m.material.uniforms.uTime.value = t;
        m.material.uniforms.uImgA.value = aspects[(m.userData as { i: number }).i];
        const breeze = reduced ? 0 : mouse.vx * 6;
        d.hover += ((m === hovered ? 1 : 0) - d.hover) * 0.1;
        m.parent!.rotation.z = Math.sin(t * 0.9 + d.seed) * 0.03 + breeze * 0.05;
        m.parent!.rotation.x = Math.sin(t * 0.7 + d.seed) * 0.05 - d.hover * 0.12;
      });
      mouse.vx *= 0.92;
      safelight.intensity = 36 + Math.sin(t * 7) * 1.5 + Math.random() * 1.5;
    }

    // long exposure
    trailU.uTime.value = t;
    if (ks > 2.5) {
      const stroke = (p: THREE.Vector3) => {
        const from = lastPaint && t - lastPaintT < 0.25 ? lastPaint : p;
        const steps = Math.min(80, Math.ceil(from.distanceTo(p) / 0.025) + 1);
        for (let s = 0; s < steps; s++) emit(corner.lerpVectors(from, p, s / steps), t);
        lastPaint = p.clone();
        lastPaintT = t;
      };
      if (overCanvas && ray.ray.intersectPlane(paintPlane, hit)) {
        stroke(hit);
        lastUserT = t;
      } else if (t - lastUserT > 1.5 && !reduced) {
        // ghost painter keeps the frame alive while nobody is drawing
        stroke(hit.set(Math.sin(t * 1.1) * 3.6, Math.sin(t * 1.7 + 1) * 1.9, PAINT_Z));
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.aBirth.needsUpdate = true;
      trailGeo.attributes.aColor.needsUpdate = true;
    }

    canvas.style.cursor = hovered ? "pointer" : ks > 2.5 ? "crosshair" : "default";
    renderer.render(scene, camera);
    if (captureReq) {
      captureReq = false;
      cb.onCapture(canvas.toDataURL("image/jpeg", 0.85));
    }
  };
  tick();

  return {
    api: {
      setPersist: (s) => (trailU.uPersist.value = s),
      setInk: (i) => (ink = i),
      clear: () => tBirth.fill(-1),
      capture: () => (captureReq = true),
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
type Shot = { url: string; n: number; label: string };

export const Photography3D: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const af = useRef<HTMLDivElement>(null);
  const focus = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [shutter, setShutter] = useState(1);
  const [ink, setInk] = useState(0);
  const [shots, setShots] = useState<Shot[]>([]);
  const [flash, setFlash] = useState(false);
  const shutterRef = useRef(shutter);
  shutterRef.current = shutter;

  useEffect(() => {
    if (!canvas.current || !af.current || !focus.current) return;
    const eng = startEngine(
      canvas.current,
      { af: af.current, focus: focus.current },
      {
        onProgress: setProgress,
        onLoaded: () => setLoaded(true),
        onChapter: setChapter,
        onHover: setHover,
        onSelect: setSelected,
        onCapture: (url) =>
          setShots((s) => [{ url, n: s.length + 1, label: `f/8 · ${SHUTTERS[shutterRef.current].label} · ISO 50` }, ...s].slice(0, 6)),
      }
    );
    api.current = eng.api;
    const fallback = setTimeout(() => setLoaded(true), 9000);
    const moveTip = (e: PointerEvent) => {
      if (tip.current) tip.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 18}px)`;
    };
    window.addEventListener("pointermove", moveTip);
    return () => {
      clearTimeout(fallback);
      window.removeEventListener("pointermove", moveTip);
      eng.dispose();
      api.current = null;
    };
  }, []);

  const shoot = () => {
    setFlash(true);
    api.current?.capture();
    setTimeout(() => setFlash(false), 180);
  };

  const hud = HUD[Math.min(chapter, 3)];

  return (
    <div className="relative bg-[#060606] text-[#f2efe8] selection:bg-[#ff3b2f] selection:text-white">
      <canvas ref={canvas} className="fixed inset-0 h-screen w-screen" />
      <FilmOverlay />
      <Loader
        title={<p className="font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl">Monolith</p>}
        note="Loading film"
        progress={progress}
        loaded={loaded}
        accent={ACCENT}
        bg="#060606"
      />

      <DemoDock
        label="Monolith Studio — 3D Darkroom"
        accent={ACCENT}
        right={
          <Link href="/work/photography" className="rounded-full bg-[#f2efe8] px-5 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-xl">
            2D Site
          </Link>
        }
      />
      <ChapterRail chapters={CHAPTERS} active={chapter} accent={ACCENT} />

      {/* viewfinder chrome */}
      <div className="pointer-events-none fixed inset-6 z-20 hidden sm:block">
        {["left-0 top-12 border-l border-t", "right-0 top-12 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-white/40 ${c}`} />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md sm:gap-6">
        <span className="flex items-center gap-1.5 text-[#ff3b2f]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff3b2f]" /> Rec
        </span>
        <span>{hud.f}</span>
        <span>{chapter === 3 ? SHUTTERS[shutter].label : hud.s}</span>
        <span className="hidden sm:inline">ISO {hud.iso}</span>
        <span>
          ◎ <span ref={focus}>∞</span>
        </span>
        <span className="hidden sm:inline">
          FR {String(chapter + 1 + shots.length).padStart(2, "0")}/36
        </span>
      </div>

      {/* autofocus brackets (positioned by the engine) */}
      <div ref={af} className="pointer-events-none fixed left-0 top-0 z-20 opacity-0 transition-opacity duration-300">
        {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
          <span key={c} className={`absolute h-4 w-4 border-[#7dff8a] ${c}`} />
        ))}
        <span className="absolute -top-5 left-0 font-mono text-[9px] uppercase tracking-widest text-[#7dff8a]">AF-C · Locked</span>
      </div>

      <div
        ref={tip}
        className={`pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-[#f2efe8] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        {hover && `${hover} — Open`}
      </div>

      <div className={`pointer-events-none fixed inset-0 z-[65] bg-white transition-opacity ${flash ? "opacity-90 duration-0" : "opacity-0 duration-500"}`} />

      <main className="pointer-events-none relative z-10">
        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-24 sm:px-12 md:justify-center md:pb-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff3b2f]">Monolith Studio · Est. 2014</p>
            <h1 className="mt-4 font-display text-[16vw] font-extrabold uppercase leading-[0.85] tracking-tight md:text-[8vw]">
              Light,
              <br />
              <span className="font-serif font-normal normal-case italic text-white/80">captured.</span>
            </h1>
            <p className="mt-6 max-w-xs text-sm font-light text-white/60">
              A 50mm prime, nine blades, one breath of light. Scroll to open the aperture and step inside the archive.
            </p>
          </div>
        </Station>

        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-24 sm:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff3b2f]">02 — Depth of Field</p>
            <h2 className="mt-3 max-w-xl font-display text-5xl font-extrabold uppercase leading-none sm:text-7xl">
              Everything else <span className="font-serif font-normal normal-case italic text-white/70">falls away.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm font-light text-white/60">
              Scrolling racks focus through twelve frames. Hover one to autofocus on it, click to open the negative.
            </p>
          </div>
        </Station>

        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-24 sm:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff3b2f]">03 — The Darkroom</p>
            <h2 className="mt-3 max-w-xl font-display text-5xl font-extrabold uppercase leading-none sm:text-7xl">
              Images, <span className="font-serif font-normal normal-case italic text-white/70">slowly.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm font-light text-white/60">
              Six prints hang under the safelight. Hold your cursor on one to develop it; move fast and the line sways.
            </p>
          </div>
        </Station>

        <Station last>
          <div className="flex h-full items-end px-6 pb-24 sm:items-center sm:px-12 sm:pb-0">
            <div className="pointer-events-auto w-full max-w-xs rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff3b2f]">04 — Long Exposure</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none">Paint with light</h2>
              <p className="mt-2 text-xs text-white/50">Move across the dark to draw. Shutter speed sets how long the light lingers.</p>

              <Label>Shutter</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {SHUTTERS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setShutter(i);
                      api.current?.setPersist(s.s);
                    }}
                    className={`rounded-full border py-1.5 text-[11px] font-semibold transition ${
                      shutter === i ? "border-[#ff3b2f] bg-[#ff3b2f] text-white" : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <Label>Light source</Label>
              <div className="flex gap-2">
                {INKS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setInk(i);
                      api.current?.setInk(i);
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition ${
                      ink === i ? "border-white/70" : "border-white/15 text-white/60"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? "linear-gradient(90deg,#ff3bd4,#5fe3ff,#ffa63b)" : c.hex, boxShadow: `0 0 10px ${c.hex}` }} />
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={shoot}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f2efe8] py-2.5 text-xs font-bold uppercase tracking-wider text-black"
                >
                  <Camera className="h-3.5 w-3.5" /> Take the shot
                </button>
                <button onClick={() => api.current?.clear()} aria-label="Clear" className="rounded-full border border-white/15 px-3">
                  <Eraser className="h-3.5 w-3.5" />
                </button>
              </div>
              <Link href="/work/photography" className="mt-3 block text-center text-[11px] uppercase tracking-widest text-white/50 hover:text-white">
                Book a session →
              </Link>
            </div>
          </div>
        </Station>
      </main>

      {/* polaroid stack */}
      <div className="fixed bottom-20 right-6 z-30 hidden sm:block">
        {shots.map((s, i) => (
          <a
            key={s.n}
            href={s.url}
            download={`monolith-exposure-${s.n}.jpg`}
            className="group absolute bottom-0 right-0 block w-40 bg-[#f2efe8] p-2 pb-8 shadow-2xl transition-all duration-500 hover:z-10 hover:scale-105"
            style={{ transform: `translate(${-i * 26}px, ${-i * 6}px) rotate(${(i % 2 ? -1 : 1) * (3 + i * 2)}deg)`, zIndex: 10 - i }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.url} alt={`Exposure ${s.n}`} className="aspect-square w-full object-cover" />
            <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase text-black/60">
              #{String(s.n).padStart(2, "0")} · {s.label}
            </span>
            <Download className="absolute bottom-2 right-2 h-3 w-3 text-black/40 opacity-0 group-hover:opacity-100" />
          </a>
        ))}
      </div>

      {selected !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={() => setSelected(null)}>
          <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e0e] md:grid-cols-[1.4fr_1fr]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTOS[selected].img} alt={PHOTOS[selected].title} className="h-72 w-full object-cover md:h-[70vh]" />
            <div className="relative flex flex-col justify-end p-8">
              <button onClick={() => setSelected(null)} aria-label="Close" className="absolute right-5 top-5 rounded-full border border-white/15 p-2">
                <X className="h-4 w-4" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff3b2f]">
                {PHOTOS[selected].cat} · {String(selected + 1).padStart(2, "0")}/{PHOTOS.length}
              </p>
              <h3 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none">{PHOTOS[selected].title}</h3>
              <p className="mt-3 font-mono text-xs text-white/50">{PHOTOS[selected].exif}</p>
              <div className="mt-8 flex gap-2">
                <button onClick={() => setSelected((selected + PHOTOS.length - 1) % PHOTOS.length)} className="rounded-full border border-white/15 px-4 py-2 text-xs">
                  Prev
                </button>
                <button onClick={() => setSelected((selected + 1) % PHOTOS.length)} className="rounded-full border border-white/15 px-4 py-2 text-xs">
                  Next
                </button>
                <Link href="/work/photography" className="ml-auto rounded-full bg-[#f2efe8] px-4 py-2 text-xs font-bold text-black">
                  Order print
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
