# Graph Report - master design  (2026-08-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 166 nodes · 253 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6386369f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `MagneticButton()` - 22 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 5 edges
4. `VERTICAL_TEMPLATES` - 3 edges
5. `HeroParticles()` - 2 edges
6. `CursorFollower()` - 2 edges
7. `SmoothScrollProvider()` - 2 edges
8. `SplitTextReveal()` - 2 edges
9. `AboutSection()` - 2 edges
10. `ContactSection()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (16): MagneticButton(), MagneticButtonProps, WorkPageProps, FashionDemo(), PRODUCTS, FitnessDemo(), TRAINERS, HealthcareDemo() (+8 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (14): FashionChapter(), LOOKBOOK_OUTFITS, CLASS_SCHEDULE, FitnessChapter(), HealthcareChapter(), LawChapter(), GALLERY_IMAGES, PhotographyChapter() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): PROCESS_STEPS, STATS, TESTIMONIALS, VERTICAL_TAGS, VERTICAL_TEMPLATES, VerticalTemplate, AboutSection(), ContactSection() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (17): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, @types/three (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (9): inter, metadata, outfit, registerGSAP(), CursorFollower(), SmoothScrollContext, SmoothScrollContextType, SmoothScrollProvider() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (12): dependencies, clsx, framer-motion, gsap, lenis, lucide-react, motion, next (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.38
Nodes (4): HeroParticles(), SplitTextReveal(), SplitTextRevealProps, HeroSection()

## Knowledge Gaps
- **68 isolated node(s):** `inter`, `outfit`, `metadata`, `WorkPageProps`, `MagneticButtonProps` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MagneticButton()` connect `Community 0` to `Community 1`, `Community 2`, `Community 7`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 6` to `Community 4`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `inter`, `outfit`, `metadata` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12307692307692308 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._