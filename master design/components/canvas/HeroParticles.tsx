"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const HeroParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallViewport = window.matchMedia("(max-width: 768px)").matches;
    let isInView = true;
    let isTabVisible = document.visibilityState === "visible";

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Particle Geometry & Material
    const particleCount = smallViewport ? 260 : 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Create a cinematic spiral/cloud distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 8 + Math.random() * 26;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = Math.random() * 1.8 + 0.6;
      opacities[i] = Math.random() * 0.7 + 0.3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    // Custom shader material for soft glowing circular gold/silver particles
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#d4af37") }, // Gold
        uColor2: { value: new THREE.Color("#8b1538") }, // Burgundy
        uColor3: { value: new THREE.Color("#ffffff") }, // Ambient white
      },
      vertexShader: `
        attribute float aScale;
        uniform float uTime;
        varying vec3 vPosition;
        varying float vAlpha;

        void main() {
          vPosition = position;
          vec3 pos = position;
          
          // Subtle wave movement
          pos.y += sin(uTime * 0.8 + position.x * 0.1) * 0.8;
          pos.x += cos(uTime * 0.6 + position.z * 0.1) * 0.8;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aScale * (180.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = smoothstep(40.0, 10.0, -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec3 vPosition;
        varying float vAlpha;

        void main() {
          // Circular particle shape
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.8);

          // Color gradient based on position
          vec3 color = mix(uColor1, uColor2, sin(vPosition.x * 0.05 + vPosition.y * 0.05) * 0.5 + 0.5);
          color = mix(color, uColor3, 0.25);

          gl_FragColor = vec4(color, strength * vAlpha * 0.65);
        }
      `,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Mouse Tracking with Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = -(e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isInView || !isTabVisible) return;

      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Smooth lerp mouse tracking
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;

        particles.rotation.y = elapsedTime * 0.03 + mouseX * 0.25;
        particles.rotation.x = mouseY * 0.15;
        particles.rotation.z = Math.sin(elapsedTime * 0.02) * 0.05;

        particleMaterial.uniforms.uTime.value = elapsedTime;
      }

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
    };

    observer.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-80"
    />
  );
};
