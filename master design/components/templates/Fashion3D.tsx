"use client";

/**
 * Maison V — 3D Atelier.
 * One fixed WebGL canvas; the camera flies a scroll-driven spline through four stations:
 *   0 Silk curtain (shader cloth, cursor ripples, parts as you scroll)
 *   1 Spiral runway (looks orbiting a helix, hover + click)
 *   2 Fabric lab (procedural lathe gown, live fabric / colour / pleats / wind)
 *   3 Monogram (particles assemble into MAISON V, cursor repels)
 */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { X, ArrowUpRight, Wind, Layers } from "lucide-react";
import { DemoDock, u, prefersReduced } from "@/components/motion/fx";
import {
  Station,
  PanelLabel as Label,
  FilmOverlay,
  Loader,
  ChapterRail,
  scrollToStation as goTo,
  stationProgress,
} from "./three-kit";

const GOLD = "#c9a96e";
const BG = 0x0a0908;

const LOOKS = [
  { title: "The Structured Trench", note: "Virgin wool · Horn", img: u("1490481651871-ab68de25d43d", 900) },
  { title: "Organza Bias Gown", note: "Mulberry silk", img: u("1445205170230-053b83016050", 900) },
  { title: "Sculptural Leather", note: "Calfskin · Cupro", img: u("1469334031218-e382a71b716b", 900) },
  { title: "Monochrome Tailoring", note: "Wool crêpe", img: u("1509631179647-0177331693ae", 900) },
  { title: "Evening Noir", note: "Duchess satin", img: u("1515886657613-9f3515b0c78f", 900) },
  { title: "Soft Column", note: "Silk jersey", img: u("1496747611176-843222e1e57c", 900) },
  { title: "Rib & Drape", note: "Cashmere", img: u("1485968579580-b6d095142e6e", 900) },
  { title: "Street Couture", note: "Bonded cotton", img: u("1529139574466-a303027c1d8b", 900) },
  { title: "Atelier Finish", note: "Hand-stitched", img: u("1539109136881-3be0616acf4b", 900) },
  { title: "Bias Study", note: "Toile", img: u("1483985988355-763728e1935b", 900) },
];

type Fabric = { name: string; price: number; roughness: number; metalness: number; sheen: number; clearcoat: number };
const FABRICS: Fabric[] = [
  { name: "Silk", price: 3200, roughness: 0.38, metalness: 0, sheen: 1, clearcoat: 0.2 },
  { name: "Velvet", price: 3600, roughness: 0.95, metalness: 0, sheen: 1, clearcoat: 0 },
  { name: "Satin", price: 2900, roughness: 0.18, metalness: 0.05, sheen: 0.4, clearcoat: 0.8 },
  { name: "Lamé", price: 4100, roughness: 0.3, metalness: 0.9, sheen: 0, clearcoat: 0.3 },
];
const COLORS = [
  { name: "Ivory", hex: "#e9e1d3" },
  { name: "Rose", hex: "#c98a8f" },
  { name: "Bordeaux", hex: "#5b1726" },
  { name: "Emerald", hex: "#1f5a48" },
  { name: "Onyx", hex: "#161616" },
];

const CHAPTERS = ["Silk", "Runway", "Fabric Lab", "Maison"];

type Api = {
  setFabric: (f: Fabric) => void;
  setColor: (hex: string) => void;
  setPleats: (v: number) => void;
  setWind: (on: boolean) => void;
};

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */
const silkVert = /* glsl */ `
uniform float uTime, uHover, uLeave, uAmp, uSide, uOff;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vShade;
void main() {
  vec2 fuv = vec2(uv.x * 0.5 + uOff, uv.y);
  vUv = fuv;
  vec3 p = position;
  float wx = p.x + uSide * 1.05;
  float w = sin(wx * 1.6 + uTime * 0.9) * 0.12 + sin(p.y * 2.3 + uTime * 1.2) * 0.08 + sin((wx + p.y) * 3.1 + uTime * 1.7) * 0.04;
  w *= uAmp * (0.4 + 0.6 * (1.0 - fuv.y));
  float d = distance(fuv * vec2(0.75, 1.0), uMouse * vec2(0.75, 1.0));
  float rip = exp(-d * 7.0) * sin(d * 30.0 - uTime * 5.0) * 0.16 * uHover;
  p.z += w + rip;
  float l = uLeave * uLeave;
  float edge = uSide < 0.0 ? uv.x : 1.0 - uv.x;
  p.x += uSide * l * (2.5 + (1.0 - uv.y) * 2.5) * (0.4 + edge);
  p.z += l * (sin(uv.y * 7.0 + uTime * 2.0) * 0.5 - 1.2);
  vShade = w * 2.4 + rip * 3.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const silkFrag = /* glsl */ `
uniform sampler2D uTex;
uniform float uImgA, uPlaneA, uVel, uLeave;
varying vec2 vUv;
varying float vShade;
vec2 cover(vec2 uv) {
  vec2 s = uPlaneA > uImgA ? vec2(1.0, uImgA / uPlaneA) : vec2(uPlaneA / uImgA, 1.0);
  return (uv - 0.5) * s + 0.5;
}
void main() {
  vec2 uv = cover(vUv);
  float sh = 0.002 + uVel * 0.03;
  vec3 col = vec3(texture2D(uTex, uv + vec2(sh, 0.0)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(sh, 0.0)).b);
  col *= 0.8 + vShade;
  col += pow(max(vShade, 0.0), 2.0) * 0.5;
  gl_FragColor = vec4(col, 1.0 - uLeave * uLeave * 0.6);
  #include <colorspace_fragment>
}`;

const monoVert = /* glsl */ `
attribute vec3 aStart;
attribute float aSeed;
uniform float uMorph, uTime, uSize;
uniform vec3 uMouse;
varying float vA;
void main() {
  float m = uMorph * uMorph * (3.0 - 2.0 * uMorph);
  vec3 p = mix(aStart, position, m);
  p += vec3(sin(uTime + aSeed * 40.0), cos(uTime * 0.8 + aSeed * 30.0), sin(uTime * 0.6 + aSeed * 20.0)) * (0.04 + (1.0 - m) * 0.4);
  vec2 dir = p.xy - uMouse.xy;
  float d = length(dir);
  p.xy += normalize(dir + 0.0001) * max(0.0, 1.4 - d) * 0.9 * m;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.6 + aSeed) * (300.0 / -mv.z);
  vA = 0.35 + 0.65 * m;
  gl_Position = projectionMatrix * mv;
}`;

const monoFrag = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vA);
}`;

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */
function startEngine(
  canvas: HTMLCanvasElement,
  cb: {
    onProgress: (p: number) => void;
    onLoaded: () => void;
    onChapter: (i: number) => void;
    onHover: (i: number | null) => void;
    onSelect: (i: number) => void;
  }
): { api: Api; dispose: () => void } {
  const reduced = prefersReduced();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 6, 26);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);

  const manager = new THREE.LoadingManager();
  manager.onProgress = (_u, loaded, total) => cb.onProgress(loaded / total);
  manager.onLoad = () => cb.onLoaded();
  const loader = new THREE.TextureLoader(manager);
  loader.setCrossOrigin("anonymous");
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  /* --- 0 · Silk curtain --- */
  const silk = new THREE.Group();
  scene.add(silk);
  const silkTex = track(loader.load(u("1509631179647-0177331693ae", 1600), (t) => {
    silkU.uImgA.value = t.image.width / t.image.height;
  }));
  silkTex.colorSpace = THREE.SRGBColorSpace;
  const silkU = {
    uTex: { value: silkTex },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uLeave: { value: 0 },
    uAmp: { value: reduced ? 0.2 : 1 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uImgA: { value: 0.75 },
    uPlaneA: { value: 4.2 / 5.6 },
    uVel: { value: 0 },
  };
  const halves: THREE.Mesh[] = [-1, 1].map((side) => {
    const mat = track(
      new THREE.ShaderMaterial({
        vertexShader: silkVert,
        fragmentShader: silkFrag,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: { ...silkU, uSide: { value: side }, uOff: { value: side < 0 ? 0 : 0.5 } },
      })
    );
    const m = new THREE.Mesh(track(new THREE.PlaneGeometry(2.1, 5.6, 60, 160)), mat);
    m.position.x = side * 1.05;
    silk.add(m);
    return m;
  });

  /* --- 1 · Spiral runway --- */
  const panels: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  const panelGeo = track(new THREE.PlaneGeometry(2.1, 2.9));
  LOOKS.forEach((look, i) => {
    const tex = track(loader.load(look.img, (t) => {
      const a = t.image.width / t.image.height;
      const pa = 2.1 / 2.9;
      if (pa > a) { t.repeat.set(1, a / pa); t.offset.set(0, (1 - a / pa) / 2); }
      else { t.repeat.set(pa / a, 1); t.offset.set((1 - pa / a) / 2, 0); }
    }));
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = track(new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, color: 0x8a8a8a }));
    const m = new THREE.Mesh(panelGeo, mat);
    const a = i * 0.95;
    m.position.set(Math.cos(a) * 3.1, Math.sin(a) * 1.9, -9 - i * 2.7);
    m.lookAt(0, m.position.y * 0.4, m.position.z + 1.2);
    m.userData = { i, base: m.position.clone(), s: 1 };
    panels.push(m);
    scene.add(m);
  });

  /* --- 2 · Fabric lab gown --- */
  const GOWN_Z = -52;
  const gown = new THREE.Group();
  gown.position.set(0, -0.2, GOWN_Z);
  scene.add(gown);
  const profile = new THREE.SplineCurve(
    [
      [1.22, -1.45], [1.18, -1.2], [0.92, -0.45], [0.6, 0.35], [0.42, 0.8],
      [0.27, 1.15], [0.33, 1.45], [0.37, 1.62], [0.33, 1.85], [0.12, 2.0],
    ].map(([x, y]) => new THREE.Vector2(x, y))
  ).getPoints(80);
  const gownGeo = track(new THREE.LatheGeometry(profile, 180));
  const base = (gownGeo.attributes.position.array as Float32Array).slice();
  const gownMat = track(
    new THREE.MeshPhysicalMaterial({ color: COLORS[0].hex, side: THREE.DoubleSide, sheenColor: new THREE.Color("#ffffff") })
  );
  const gownMesh = new THREE.Mesh(gownGeo, gownMat);
  gownMesh.castShadow = true;
  gown.add(gownMesh);
  const brass = track(new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.25 }));
  const neck = new THREE.Mesh(track(new THREE.CylinderGeometry(0.08, 0.11, 0.35, 32)), brass);
  neck.position.y = 2.15;
  const knob = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 32, 16)), brass);
  knob.position.y = 2.38;
  const plinth = new THREE.Mesh(
    track(new THREE.CylinderGeometry(1.7, 1.8, 0.2, 96)),
    track(new THREE.MeshStandardMaterial({ color: 0x1a1816, roughness: 0.25, metalness: 0.3 }))
  );
  plinth.position.y = -1.56;
  plinth.receiveShadow = true;
  gown.add(neck, knob, plinth);
  const floor = new THREE.Mesh(
    track(new THREE.CircleGeometry(14, 64)),
    track(new THREE.MeshStandardMaterial({ color: 0x0d0c0b, roughness: 0.8 }))
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.86, GOWN_Z);
  floor.receiveShadow = true;
  scene.add(floor);

  const spot = new THREE.SpotLight(0xfff1dc, 140, 22, 0.5, 0.7, 1.6);
  spot.position.set(2.5, 7, GOWN_Z + 3);
  spot.target = gown;
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  const rimWarm = new THREE.PointLight(0xc9a96e, 30, 12);
  rimWarm.position.set(-3, 2.5, GOWN_Z - 3);
  const rimCool = new THREE.PointLight(0x9fb4ff, 18, 12);
  rimCool.position.set(3.2, 1, GOWN_Z - 2.5);
  scene.add(spot, rimWarm, rimCool, new THREE.AmbientLight(0xffffff, 0.25));

  let pleats = 0.6;
  let wind = false;
  let windAmt = 0;
  let gownRot = 0;
  let gownRotTarget = 0;
  const applyFabric = (f: Fabric) => {
    gownMat.roughness = f.roughness;
    gownMat.metalness = f.metalness;
    gownMat.sheen = f.sheen;
    gownMat.sheenRoughness = f.name === "Velvet" ? 0.3 : 0.6;
    gownMat.clearcoat = f.clearcoat;
  };
  applyFabric(FABRICS[0]);
  const targetColor = new THREE.Color(COLORS[0].hex);

  const updateGown = (t: number) => {
    const pos = gownGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i], y = base[i + 1], z = base[i + 2];
      const r0 = Math.hypot(x, z);
      const a = Math.atan2(z, x);
      const below = THREE.MathUtils.smoothstep(1.1 - y, 0, 2.5);
      const r =
        r0 *
        (1 +
          pleats * 0.08 * Math.sin(a * 18) * below +
          windAmt * 0.09 * Math.sin(a * 3 + t * 2.4 + y * 2) * below * below +
          0.015 * Math.sin(a * 5 - t * 0.8) * below);
      pos[i] = Math.cos(a) * r;
      pos[i + 2] = Math.sin(a) * r;
    }
    gownGeo.attributes.position.needsUpdate = true;
    gownGeo.computeVertexNormals();
  };

  /* --- 3 · Monogram particles --- */
  const MONO_Z = -74;
  const c2 = document.createElement("canvas");
  c2.width = 1200;
  c2.height = 260;
  const g = c2.getContext("2d")!;
  g.fillStyle = "#fff";
  g.font = "700 190px Georgia, 'Times New Roman', serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("MAISON V", 600, 135);
  const px = g.getImageData(0, 0, c2.width, c2.height).data;
  const target: number[] = [];
  for (let y = 0; y < c2.height; y += 3)
    for (let x = 0; x < c2.width; x += 3) if (px[(y * c2.width + x) * 4 + 3] > 128) target.push(x, y);
  const count = target.length / 2;
  const tPos = new Float32Array(count * 3);
  const sPos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const W = 11;
  for (let i = 0; i < count; i++) {
    tPos[i * 3] = (target[i * 2] / c2.width - 0.5) * W;
    tPos[i * 3 + 1] = -(target[i * 2 + 1] / c2.height - 0.5) * W * (c2.height / c2.width);
    tPos[i * 3 + 2] = 0;
    const v = new THREE.Vector3().randomDirection().multiplyScalar(4 + Math.random() * 10);
    sPos.set([v.x, v.y, v.z], i * 3);
    seeds[i] = Math.random();
  }
  const monoGeo = track(new THREE.BufferGeometry());
  monoGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
  monoGeo.setAttribute("aStart", new THREE.BufferAttribute(sPos, 3));
  monoGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const monoU = {
    uMorph: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 0.13 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uColor: { value: new THREE.Color(GOLD) },
  };
  const mono = new THREE.Points(
    monoGeo,
    track(
      new THREE.ShaderMaterial({
        vertexShader: monoVert,
        fragmentShader: monoFrag,
        uniforms: monoU,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  mono.position.z = MONO_Z;
  mono.frustumCulled = false;
  scene.add(mono);

  /* --- Dust through the whole corridor --- */
  const dustN = 1800;
  const dust = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) dust.set([(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, 8 - Math.random() * 90], i * 3);
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPts = new THREE.Points(
    dustGeo,
    track(new THREE.PointsMaterial({ color: GOLD, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }))
  );
  scene.add(dustPts);

  /* --- Camera rail --- */
  let posCurve: THREE.CatmullRomCurve3;
  let tgtCurve: THREE.CatmullRomCurve3;
  const buildRail = () => {
    const wide = window.innerWidth / window.innerHeight > 1.1;
    const sx = wide ? 1.5 : 0;
    silk.position.x = sx;
    gown.position.x = sx;
    floor.position.x = sx;
    spot.position.x = sx + 2.5;
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    posCurve = new THREE.CatmullRomCurve3([V(0, 0, wide ? 6.2 : 8), V(0, 0, -12), V(-0.3, 0.9, GOWN_Z + 7), V(0, 0, MONO_Z + (wide ? 11 : 17))], false, "centripetal");
    tgtCurve = new THREE.CatmullRomCurve3([V(0, 0, 0), V(0, 0, -24), V(0, 0.5, GOWN_Z), V(0, 0, MONO_Z)], false, "centripetal");
  };
  buildRail();

  /* --- Input --- */
  const ndc = new THREE.Vector2(9, 9);
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  const ray = new THREE.Raycaster();
  let hovered: number | null = null;
  let dragging = false;
  let lastX = 0;
  let k = 0;

  const onMove = (e: PointerEvent) => {
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    mouse.x = ndc.x;
    mouse.y = ndc.y;
    if (dragging) {
      gownRotTarget += (e.clientX - lastX) * 0.01;
      lastX = e.clientX;
    }
  };
  const gownActive = () => k > 1.55 && k < 2.45;
  const onDown = (e: PointerEvent) => {
    if (e.target !== canvas) return;
    if (hovered !== null) return cb.onSelect(hovered);
    if (gownActive()) {
      dragging = true;
      lastX = e.clientX;
      canvas.style.cursor = "grabbing";
    }
  };
  const onUp = () => (dragging = false);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);

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
  let prevKs = 0;
  let chapter = -1;
  let raf = 0;
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -MONO_Z);
  const hit = new THREE.Vector3();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    k = stationProgress(3);
    ks += (k - ks) * 0.07;
    const vel = Math.abs(ks - prevKs);
    prevKs = ks;

    // eased stops: camera lingers at each station
    const seg = Math.min(Math.floor(ks), 2);
    const f = ks - seg;
    const eased = (seg + f * f * (3 - 2 * f)) / 3;
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;
    camera.position.copy(posCurve.getPoint(eased));
    camera.position.x += mouse.sx * 0.35;
    camera.position.y += mouse.sy * 0.22;
    camera.lookAt(tgtCurve.getPoint(eased));

    const ch = Math.round(k);
    if (ch !== chapter) cb.onChapter((chapter = ch));

    ray.setFromCamera(ndc, camera);

    // silk
    silkU.uTime.value = t;
    silkU.uLeave.value = THREE.MathUtils.clamp(ks * 1.3, 0, 1);
    silkU.uVel.value += (Math.min(vel * 6, 1) - silkU.uVel.value) * 0.1;
    silk.visible = ks < 1.2;
    if (ks < 0.6) {
      const h = ray.intersectObjects(halves)[0];
      if (h?.uv) {
        const off = h.object === halves[0] ? 0 : 0.5;
        silkU.uMouse.value.lerp(new THREE.Vector2(h.uv.x * 0.5 + off, h.uv.y), 0.2);
      }
      silkU.uHover.value += ((h ? 1 : 0) - silkU.uHover.value) * 0.06;
    }

    // runway
    let nextHover: number | null = null;
    if (ks > 0.4 && ks < 2.1) {
      const h = ray.intersectObjects(panels)[0];
      if (h) nextHover = (h.object.userData as { i: number }).i;
    }
    if (nextHover !== hovered) {
      hovered = nextHover;
      cb.onHover(hovered);
    }
    panels.forEach((p, i) => {
      const d = p.userData as { base: THREE.Vector3; s: number };
      const on = i === hovered;
      d.s += ((on ? 1.12 : 1) - d.s) * 0.12;
      p.scale.setScalar(d.s);
      p.position.y = d.base.y + Math.sin(t * 0.7 + i) * 0.12;
      p.material.color.lerp(new THREE.Color(on ? 0xffffff : 0x8a8a8a), 0.12);
    });

    // gown
    if (ks > 1.2 && ks < 2.8) {
      windAmt += ((wind ? 1 : 0) - windAmt) * 0.04;
      if (!dragging) gownRotTarget += reduced ? 0 : 0.0025;
      gownRot += (gownRotTarget - gownRot) * 0.08;
      gownMesh.rotation.y = gownRot;
      gownMat.color.lerp(targetColor, 0.08);
      updateGown(t);
    }

    // monogram
    monoU.uTime.value = t;
    monoU.uMorph.value = THREE.MathUtils.clamp((ks - 2.2) / 0.75, 0, 1);
    if (ks > 2.2 && ray.ray.intersectPlane(plane, hit)) monoU.uMouse.value.set(hit.x, hit.y, 0);

    canvas.style.cursor = dragging ? "grabbing" : hovered !== null ? "pointer" : gownActive() ? "grab" : "default";
    renderer.render(scene, camera);
  };
  tick();

  return {
    api: {
      setFabric: applyFabric,
      setColor: (hex) => targetColor.set(hex),
      setPleats: (v) => (pleats = v),
      setWind: (on) => (wind = on),
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export const Fashion3D: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<Api | null>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [pleats, setPleats] = useState(0.6);
  const [wind, setWind] = useState(false);

  useEffect(() => {
    if (!canvas.current) return;
    const eng = startEngine(canvas.current, {
      onProgress: setProgress,
      onLoaded: () => setLoaded(true),
      onChapter: setChapter,
      onHover: setHover,
      onSelect: setSelected,
    });
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

  return (
    <div className="relative bg-[#0a0908] text-[#efe9df] selection:bg-[#c9a96e] selection:text-black">
      <canvas ref={canvas} className="fixed inset-0 h-screen w-screen" />

      <FilmOverlay />
      <Loader
        title={<p className="font-serif text-5xl sm:text-7xl italic tracking-tight">Maison V</p>}
        note="Weaving the atelier"
        progress={progress}
        loaded={loaded}
        accent={GOLD}
        bg="#0a0908"
      />

      <DemoDock
        label="Maison V — 3D Atelier"
        accent={GOLD}
        right={
          <Link
            href="/work/fashion"
            className="rounded-full bg-[#efe9df] px-5 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-xl"
          >
            2D Site
          </Link>
        }
      />

      <ChapterRail chapters={CHAPTERS} active={chapter} accent={GOLD} />

      {/* hover label for runway panels */}
      <div
        ref={tip}
        className={`pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-[#efe9df] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition-opacity ${
          hover !== null ? "opacity-100" : "opacity-0"
        }`}
      >
        {hover !== null && `${LOOKS[hover].title} — View`}
      </div>

      {/* scroll content */}
      <main className="pointer-events-none relative z-10">
        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-16 sm:px-12 md:justify-center md:pb-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">AW26 · Florence</p>
            <h1 className="mt-4 font-serif text-[18vw] leading-[0.85] tracking-tight md:text-[9vw]">
              Maison
              <br />
              <span className="italic text-[#c9a96e]">V.</span>
            </h1>
            <p className="mt-6 max-w-xs text-sm font-light text-white/60">
              Run your cursor across the silk. Scroll, and the curtain parts into the atelier.
            </p>
            <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              <span className="block h-8 w-px animate-pulse bg-[#c9a96e]" /> Scroll to enter
            </div>
          </div>
        </Station>

        <Station>
          <div className="flex h-full flex-col justify-end px-6 pb-16 sm:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">02 — The Spiral Runway</p>
            <h2 className="mt-3 max-w-xl font-serif text-5xl leading-none sm:text-7xl">
              Ten looks, <span className="italic">one orbit.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm font-light text-white/60">
              Fly through the collection. Hover a look to light it, click to open the dossier.
            </p>
          </div>
        </Station>

        <Station>
          <div className="flex h-full items-center px-6 sm:px-12">
            <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">03 — Fabric Lab</p>
              <h2 className="mt-2 font-serif text-4xl leading-none">
                The Column <span className="italic">Gown</span>
              </h2>
              <p className="mt-2 text-xs text-white/50">Drag the gown to turn it. Every change renders live.</p>

              <Label>Fabric</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {FABRICS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setFabric(f);
                      api.current?.setFabric(f);
                    }}
                    className={`rounded-full border py-1.5 text-[11px] font-semibold transition ${
                      fabric.name === f.name ? "border-[#c9a96e] bg-[#c9a96e] text-black" : "border-white/15 hover:border-white/40"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              <Label>Colour · {color.name}</Label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    aria-label={c.name}
                    onClick={() => {
                      setColor(c);
                      api.current?.setColor(c.hex);
                    }}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      color.name === c.name ? "scale-110 border-[#c9a96e]" : "border-white/20"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>

              <Label>
                <Layers className="mr-1.5 inline h-3 w-3" />
                Pleat depth · {Math.round(pleats * 100)}%
              </Label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={pleats}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPleats(v);
                  api.current?.setPleats(v);
                }}
                className="w-full accent-[#c9a96e]"
              />

              <button
                onClick={() => {
                  setWind(!wind);
                  api.current?.setWind(!wind);
                }}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border py-2 text-xs font-semibold transition ${
                  wind ? "border-[#c9a96e] text-[#c9a96e]" : "border-white/15 text-white/70"
                }`}
              >
                <Wind className="h-3.5 w-3.5" /> {wind ? "Runway breeze on" : "Add runway breeze"}
              </button>

              <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Made to measure</p>
                  <p className="font-serif text-3xl">€{fabric.price.toLocaleString()}</p>
                </div>
                <Link
                  href="/work/fashion"
                  className="rounded-full bg-[#efe9df] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black"
                >
                  Reserve
                </Link>
              </div>
            </div>
          </div>
        </Station>

        <Station last>
          <div className="flex h-full flex-col items-center justify-end px-6 pb-20 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">04 — The House</p>
            <p className="mt-3 max-w-md text-sm font-light text-white/60">
              Ten thousand threads, one name. Move through them.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/work/fashion"
                className="group inline-flex items-center gap-2 rounded-full bg-[#efe9df] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black"
              >
                Enter the boutique <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => goTo(0)}
                className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-wider"
              >
                Replay
              </button>
            </div>
          </div>
        </Station>
      </main>

      {/* look dossier */}
      {selected !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={() => setSelected(null)}>
          <div
            className="grid w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#121110] md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOOKS[selected].img} alt={LOOKS[selected].title} className="h-72 w-full object-cover md:h-full" />
            <div className="relative flex flex-col justify-end p-8">
              <button onClick={() => setSelected(null)} className="absolute right-5 top-5 rounded-full border border-white/15 p-2">
                <X className="h-4 w-4" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">
                Look {String(selected + 1).padStart(2, "0")} / {LOOKS.length}
              </p>
              <h3 className="mt-3 font-serif text-4xl leading-none">{LOOKS[selected].title}</h3>
              <p className="mt-2 text-sm text-white/50">{LOOKS[selected].note}</p>
              <div className="mt-8 flex gap-2">
                <button
                  onClick={() => setSelected((selected + LOOKS.length - 1) % LOOKS.length)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs"
                >
                  Prev
                </button>
                <button
                  onClick={() => setSelected((selected + 1) % LOOKS.length)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs"
                >
                  Next
                </button>
                <Link href="/work/fashion" className="ml-auto rounded-full bg-[#efe9df] px-4 py-2 text-xs font-bold text-black">
                  Shop look
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
