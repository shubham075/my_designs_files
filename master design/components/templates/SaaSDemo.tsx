"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal, Cpu, Globe2, Shield, Zap, GitBranch, Package, FlaskConical, Rocket, Radio, Copy, Check } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  DemoDock,
  ScrollProgress,
  Reveal,
  Headline,
  Marquee,
  CountUp,
  Spotlight,
  useGsap,
  prefersReduced,
} from "@/components/motion/fx";

const CY = "#00f0ff";

/* ------------- Canvas globe: rotating point sphere + arcs ----------- */
function Globe() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Fibonacci sphere
    const N = 900;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(t) * r, y, Math.sin(t) * r];
    });
    const regions = [12, 140, 260, 400, 520, 610, 700, 820].map((i) => pts[i]);
    const arcs = regions.flatMap((a, i) => [[a, regions[(i + 3) % regions.length]]]);
    let rot = 0, tilt = 0.35, mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      my = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMove);

    const project = (p: number[], R: number) => {
      const cy = Math.cos(rot), sy = Math.sin(rot);
      const x1 = p[0] * cy - p[2] * sy;
      const z1 = p[0] * sy + p[2] * cy;
      const ct = Math.cos(tilt + my), st = Math.sin(tilt + my);
      const y2 = p[1] * ct - z1 * st;
      const z2 = p[1] * st + z1 * ct;
      return { x: w / 2 + x1 * R, y: h / 2 + y2 * R, z: z2 };
    };

    const reduced = prefersReduced();
    let t0 = 0;
    const draw = (t: number) => {
      const dt = t0 ? (t - t0) / 1000 : 0;
      t0 = t;
      rot += dt * 0.12 + mx * dt * 0.8;
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.42;
      // atmosphere
      const g = ctx.createRadialGradient(w / 2, h / 2, R * 0.6, w / 2, h / 2, R * 1.35);
      g.addColorStop(0, "rgba(0,240,255,0.10)");
      g.addColorStop(1, "rgba(0,240,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (const p of pts) {
        const q = project(p, R);
        if (q.z < -0.1) continue;
        const a = 0.3 + q.z * 0.7;
        ctx.fillStyle = `rgba(160,245,255,${a})`;
        const sz = 1.4 + q.z * 1.4;
        ctx.fillRect(q.x, q.y, sz, sz);
      }
      // arcs with travelling packets
      arcs.forEach(([a, b], i) => {
        const steps = 40;
        ctx.beginPath();
        let visible = false;
        for (let s = 0; s <= steps; s++) {
          const k = s / steps;
          const m = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
          const len = Math.hypot(m[0], m[1], m[2]);
          const lift = 1 + Math.sin(k * Math.PI) * 0.25;
          const q = project(m.map((v) => (v / len) * lift), R);
          if (q.z > -0.05) visible = true;
          if (s === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        if (!visible) return;
        ctx.strokeStyle = "rgba(0,240,255,0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
        const k = ((t / 1600 + i * 0.17) % 1);
        const m = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
        const len = Math.hypot(m[0], m[1], m[2]);
        const q = project(m.map((v) => (v / len) * (1 + Math.sin(k * Math.PI) * 0.25)), R);
        if (q.z > 0) {
          ctx.fillStyle = CY;
          ctx.shadowColor = CY;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      // region beacons
      regions.forEach((p) => {
        const q = project(p, R);
        if (q.z < 0) return;
        const pulse = (t / 1000) % 1;
        ctx.strokeStyle = `rgba(0,240,255,${1 - pulse})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 3 + pulse * 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillRect(q.x - 1.5, q.y - 1.5, 3, 3);
      });
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  return <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* --------------------- Typing terminal ------------------------------ */
const LOG = [
  { t: "$ hyperion deploy --prod", c: "text-white" },
  { t: "▸ Detected Next.js 15 · Node 22", c: "text-zinc-400" },
  { t: "▸ Building on 64 vCPU edge builder…", c: "text-zinc-400" },
  { t: "✓ Build completed in 8.2s", c: "text-emerald-400" },
  { t: "✓ 1,284 tests passed", c: "text-emerald-400" },
  { t: "▸ Propagating to 38 regions", c: "text-zinc-400" },
  { t: "✓ Live at https://app.hyperion.run  (p99 18ms)", c: "text-cyan-300" },
];

function TypingTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [cur, setCur] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let started = false;
    const run = async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      while (!cancelled) {
        setLines([]);
        for (const l of LOG) {
          const speed = l.t.startsWith("$") ? 45 : 10;
          for (let i = 1; i <= l.t.length && !cancelled; i++) {
            setCur(l.t.slice(0, i));
            await sleep(speed);
          }
          setLines((x) => [...x, l.t]);
          setCur("");
          await sleep(l.t.startsWith("$") ? 500 : 280);
        }
        await sleep(4000);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        run();
      }
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-[#03070d]/90 shadow-[0_0_80px_-20px_rgba(0,240,255,0.4)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" /><span className="h-3 w-3 rounded-full bg-yellow-500/70" /><span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-zinc-500"><Terminal className="h-3 w-3" />~/acme-app</span>
      </div>
      <div className="h-[230px] p-5 font-mono text-[12px] sm:text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={LOG[i]?.c}>{l}</div>
        ))}
        {cur && (
          <div className={LOG[lines.length]?.c}>
            {cur}
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-cyan-300" />
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------- Pinned "scroll to deploy" pipeline ------------------ */
const STAGES = [
  { icon: GitBranch, t: "Commit", d: "Push to main. Preview URL in 4s." },
  { icon: Package, t: "Build", d: "Remote cache hits 94% of the time." },
  { icon: FlaskConical, t: "Test", d: "Parallel shards across 64 vCPU." },
  { icon: Shield, t: "Verify", d: "SBOM, secrets scan, policy gates." },
  { icon: Rocket, t: "Ship", d: "Atomic rollout to 38 regions." },
];

function Pipeline() {
  const [p, setP] = useState(0);
  const ref = useGsap((root) => {
    gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=220%", pin: true, scrub: 0.4, onUpdate: (s) => setP(s.progress) },
    }).fromTo(root.querySelector(".pipe-fill"), { scaleX: 0 }, { scaleX: 1, ease: "none" });
  }, []);
  const active = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
  const latency = Math.round(420 - p * 402);
  return (
    <section ref={ref} className="relative flex h-screen flex-col justify-center overflow-hidden bg-[#050b14] px-6 sm:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(0,240,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.07) 1px,transparent 1px)", backgroundSize: "48px 48px", transform: `translateY(${p * -120}px)` }} />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300">Scroll to deploy</div>
            <h3 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold tracking-tight">From commit to<br />global in <span className="text-cyan-300">{(p * 11.4).toFixed(1)}s</span></h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 font-mono">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">p99 latency</div>
            <div className="text-4xl font-bold tabular-nums" style={{ color: p > 0.95 ? "#34d399" : CY }}>{latency}ms</div>
          </div>
        </div>
        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-7 h-px bg-white/10">
            <div className="pipe-fill h-full origin-left" style={{ background: `linear-gradient(90deg, transparent, ${CY})`, boxShadow: `0 0 20px ${CY}` }} />
          </div>
          <div className="relative grid grid-cols-5 gap-2">
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              const on = i <= active;
              return (
                <div key={s.t} className="flex flex-col items-center text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 ${on ? "border-cyan-300 bg-cyan-300 text-black shadow-[0_0_40px_rgba(0,240,255,0.6)]" : "border-white/15 bg-[#050b14] text-zinc-500"}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`mt-4 font-display text-sm sm:text-lg font-bold transition-colors ${on ? "text-white" : "text-zinc-600"}`}>{s.t}</div>
                  <div className={`mt-1 hidden sm:block text-xs transition-colors ${on ? "text-zinc-400" : "text-zinc-700"}`}>{s.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------ Live bento dashboard ---------------------------- */
function useLiveSeries(n = 30, base = 50, vol = 8) {
  const [s, setS] = useState(() => Array.from({ length: n }, (_, i) => base + Math.sin(i / 3) * vol));
  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => setS((x) => [...x.slice(1), Math.max(5, Math.min(95, x[x.length - 1] + (Math.random() - 0.5) * vol))]), 900);
    return () => clearInterval(id);
  }, [vol]);
  return s;
}

function Spark({ data, color = CY, fill = true }: { data: number[]; color?: string; fill?: boolean }) {
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - v}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      {fill && <polygon points={`0,100 ${pts} 100,100`} fill={color} opacity="0.12" />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Bento() {
  const rps = useLiveSeries(40, 60, 10);
  const cpu = useLiveSeries(30, 40, 14);
  const err = useLiveSeries(30, 10, 4);
  const regions = ["iad1", "sfo1", "fra1", "lhr1", "sin1", "hnd1", "syd1", "gru1"];
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <Headline lines={["Observability,", "built in."]} className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-[0.95]" />
          <span className="flex items-center gap-2 font-mono text-xs text-emerald-400"><Radio className="h-3.5 w-3.5 animate-pulse" />Live demo data</span>
        </div>
        <div className="mt-12 grid auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-4">
          <Spotlight color="rgba(0,240,255,0.10)" className="md:col-span-2 md:row-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-zinc-500"><span>Requests / sec</span><span className="text-cyan-300">+12.4%</span></div>
            <div className="mt-2 font-display text-5xl font-bold tabular-nums">{Math.round(rps[rps.length - 1] * 2140).toLocaleString()}</div>
            <div className="mt-6 h-[200px]"><Spark data={rps} /></div>
          </Spotlight>
          <Spotlight color="rgba(0,240,255,0.10)" className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Uptime · 90d</div>
            <div className="mt-2 font-display text-4xl font-bold text-emerald-400">99.999%</div>
            <div className="mt-4 flex gap-[3px]">
              {Array.from({ length: 30 }).map((_, i) => <span key={i} className={`h-8 flex-1 rounded-sm ${i === 17 ? "bg-yellow-400/80" : "bg-emerald-400/70"}`} />)}
            </div>
          </Spotlight>
          <Spotlight color="rgba(0,240,255,0.10)" className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-zinc-500"><span>CPU</span><Cpu className="h-3.5 w-3.5" /></div>
            <div className="mt-2 font-display text-4xl font-bold tabular-nums">{Math.round(cpu[cpu.length - 1])}%</div>
            <div className="mt-2 h-16"><Spark data={cpu} color="#a78bfa" /></div>
          </Spotlight>
          <Spotlight color="rgba(0,240,255,0.10)" className="md:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Edge regions</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {regions.map((r, i) => (
                <div key={r} className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" style={{ animation: `pulse 2s ${i * 0.2}s infinite` }} />
                  {r}
                  <span className="ml-auto text-zinc-500">{8 + ((i * 7) % 23)}ms</span>
                </div>
              ))}
            </div>
          </Spotlight>
          <Spotlight color="rgba(0,240,255,0.10)" className="md:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-zinc-500"><span>Error rate</span><span className="text-emerald-400">healthy</span></div>
            <div className="mt-2 font-display text-4xl font-bold tabular-nums">{(err[err.length - 1] / 100).toFixed(3)}%</div>
            <div className="mt-2 h-14"><Spark data={err} color="#f472b6" /></div>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Code tabs with copy -------------------------- */
const CODE: Record<string, string> = {
  TypeScript: `import { Hyperion } from "@hyperion/sdk";

const hx = new Hyperion({ token: process.env.HX_TOKEN });

await hx.functions.deploy({
  name: "checkout",
  regions: ["auto"],
  memory: "1gb",
  scale: { min: 0, max: 5000 },
});`,
  Python: `from hyperion import Hyperion

hx = Hyperion(token=os.environ["HX_TOKEN"])

hx.functions.deploy(
    name="checkout",
    regions=["auto"],
    memory="1gb",
    scale={"min": 0, "max": 5000},
)`,
  Go: `client := hyperion.New(os.Getenv("HX_TOKEN"))

err := client.Functions.Deploy(ctx, hyperion.Function{
    Name:    "checkout",
    Regions: []string{"auto"},
    Memory:  "1gb",
    Scale:   hyperion.Scale{Min: 0, Max: 5000},
})`,
};

function CodeTabs() {
  const [tab, setTab] = useState("TypeScript");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#03070d]">
      <div className="flex items-center justify-between border-b border-white/10 px-2">
        <div className="flex">
          {Object.keys(CODE).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`relative px-4 py-3 font-mono text-xs transition-colors ${tab === k ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
              {k}
              {tab === k && <span className="absolute inset-x-2 bottom-0 h-px bg-cyan-300" />}
            </button>
          ))}
        </div>
        <button onClick={copy} className="mr-2 flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-zinc-400 hover:bg-white/5">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre key={tab} className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed text-zinc-300 animate-[fadeUp_.4s_ease-out]">
        {CODE[tab].split("\n").map((l, i) => (
          <div key={i}><span className="mr-5 inline-block w-4 select-none text-right text-zinc-700">{i + 1}</span>{l}</div>
        ))}
      </pre>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/* ----------------------- Pricing calculator ------------------------- */
function Pricing() {
  const [req, setReq] = useState(50); // millions / month
  const [gb, setGb] = useState(200); // GB-hours
  const ours = Math.round(20 + req * 0.4 + gb * 0.018);
  const theirs = Math.round(ours * 2.7);
  return (
    <section className="px-6 py-28 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 items-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300">Usage pricing</div>
          <h3 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight">Pay for compute,<br />not for idle.</h3>
          <label className="mt-10 block">
            <div className="flex justify-between font-mono text-xs uppercase text-zinc-400"><span>Requests / month</span><span className="text-white">{req}M</span></div>
            <input type="range" min={1} max={500} value={req} onChange={(e) => setReq(+e.target.value)} className="mt-3 w-full accent-cyan-400" />
          </label>
          <label className="mt-8 block">
            <div className="flex justify-between font-mono text-xs uppercase text-zinc-400"><span>Compute (GB-hours)</span><span className="text-white">{gb.toLocaleString()}</span></div>
            <input type="range" min={10} max={5000} step={10} value={gb} onChange={(e) => setGb(+e.target.value)} className="mt-3 w-full accent-cyan-400" />
          </label>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">Estimated monthly</div>
          <div className="mt-2 font-display text-7xl font-extrabold tabular-nums text-cyan-300">${ours.toLocaleString()}</div>
          <div className="mt-8 space-y-4">
            {[
              { l: "Hyperion", v: ours, c: CY },
              { l: "Typical hyperscaler", v: theirs, c: "#3f3f46" },
            ].map((b) => (
              <div key={b.l}>
                <div className="flex justify-between text-xs text-zinc-400"><span>{b.l}</span><span className="font-mono">${b.v.toLocaleString()}</span></div>
                <div className="mt-2 h-3 rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(b.v / theirs) * 100}%`, background: b.c }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-sm text-emerald-400">You save ${(theirs - ours).toLocaleString()} / month</div>
          <MagneticButton strength={0.3} className="mt-8 w-full">
            <button className="w-full rounded-full py-4 text-xs font-bold uppercase tracking-widest text-black" style={{ background: CY }}>Start free — no card</button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ============================ Page ================================ */
export const SaaSDemo: React.FC = () => {
  const heroRef = useGsap((root) => {
    gsap.from(root.querySelectorAll(".rise"), { y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.2 });
    gsap.to(root.querySelector(".globe-wrap"), { scale: 1.6, opacity: 0.25, yPercent: 20, scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  }, []);

  const FEATURES = [
    { icon: Zap, t: "Cold starts under 5ms", d: "V8 isolates pre-warmed at every edge." },
    { icon: Globe2, t: "38 regions, one config", d: "Set regions: auto and we route by latency." },
    { icon: Shield, t: "SOC 2 Type II · HIPAA", d: "Encrypted at rest, in transit, and in memory." },
    { icon: Cpu, t: "GPU on demand", d: "H100s billed per second for inference." },
  ];

  return (
    <div className="relative w-full bg-[#050b14] text-white selection:bg-cyan-300 selection:text-black">
      <ScrollProgress color={CY} />
      <DemoDock
        label="Hyperion Cloud"
        accent={CY}
        right={<button className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-black" style={{ background: CY }}>Start free</button>}
      />

      <section ref={heroRef} className="relative min-h-screen overflow-hidden px-6 pt-32 pb-20 sm:px-12 lg:px-20">
        <div className="globe-wrap absolute inset-0 lg:left-[35%]"><Globe /></div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/70 to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 items-center min-h-[calc(100vh-13rem)]">
          <div>
            <div className="rise inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 font-mono text-[11px] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" /> v4.0 — GPU functions are live
            </div>
            <h1 className="rise mt-8 font-display text-5xl sm:text-7xl font-extrabold leading-[0.95] tracking-tight">
              Autonomous compute
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-500 bg-clip-text text-transparent">at planet scale.</span>
            </h1>
            <p className="rise mt-6 max-w-md text-lg text-zinc-400">Deploy once. Hyperion places, scales, and heals your workloads across 38 regions — automatically.</p>
            <div className="rise mt-10 flex flex-wrap gap-4">
              <MagneticButton strength={0.35}>
                <button className="rounded-full px-7 py-4 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_40px_rgba(0,240,255,0.5)]" style={{ background: CY }}>Deploy in 60 seconds</button>
              </MagneticButton>
              <button className="rounded-full border border-white/15 px-7 py-4 font-mono text-xs text-zinc-300 hover:border-white/40">npx hyperion init</button>
            </div>
          </div>
          <div className="rise lg:mt-40"><TypingTerminal /></div>
        </div>
      </section>

      <Marquee
        className="border-y border-white/5 py-8"
        itemClassName="px-12 font-display text-2xl font-bold text-zinc-600"
        items={["Linear", "Vercel", "Ramp", "Notion", "Arc", "Raycast", "Mercury", "Figma"]}
      />

      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <Reveal each className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Spotlight key={f.t} color="rgba(0,240,255,0.12)" className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-cyan-300/30">
              <f.icon className="h-6 w-6 text-cyan-300" />
              <div className="mt-8 font-display text-xl font-bold">{f.t}</div>
              <p className="mt-2 text-sm text-zinc-400">{f.d}</p>
            </Spotlight>
          ))}
        </Reveal>
      </section>

      <Pipeline />
      <Bento />

      <section className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] items-center">
          <div>
            <Headline lines={["Ten lines.", "Global."]} className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight leading-[0.95]" />
            <p className="mt-6 max-w-sm text-zinc-400">SDKs for every stack. Infrastructure as code that actually reads like code.</p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div><div className="font-display text-4xl font-bold text-cyan-300"><CountUp to={4.2} decimals={1} suffix="B" /></div><div className="text-xs uppercase tracking-widest text-zinc-500">Requests / day</div></div>
              <div><div className="font-display text-4xl font-bold text-cyan-300"><CountUp to={18} suffix="ms" /></div><div className="text-xs uppercase tracking-widest text-zinc-500">Global p99</div></div>
            </div>
          </div>
          <CodeTabs />
        </div>
      </section>

      <Pricing />

      <footer className="relative overflow-hidden border-t border-white/10 px-6 pb-10 pt-24 sm:px-12 lg:px-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-cyan-500/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <div className="font-display text-[16vw] font-extrabold leading-none tracking-tighter text-white/[0.06]">HYPERION</div>
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs text-zinc-500">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> All systems operational</span>
            <span>© 2026 Hyperion Cloud — concept template</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
