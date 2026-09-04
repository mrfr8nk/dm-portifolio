import { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

type Cat = "frontend" | "backend" | "database" | "devops" | "ai" | "tools";
const CAT_COLOR: Record<Cat, string> = {
  frontend: "#227c72",
  backend:  "#b24c3d",
  database: "#c68b16",
  devops:   "#315c73",
  ai:       "#8a5d88",
  tools:    "#63727a",
};
const CAT_LABEL: Record<Cat, string> = {
  frontend: "Frontend", backend: "Backend", database: "Database",
  devops: "DevOps / Cloud", ai: "AI", tools: "Tools",
};

const TECH: { label: string; cat: Cat }[] = [
  { label: "TypeScript", cat: "frontend" },
  { label: "JavaScript", cat: "frontend" },
  { label: "React",      cat: "frontend" },
  { label: "Next.js",    cat: "frontend" },
  { label: "Tailwind",   cat: "frontend" },
  { label: "HTML5",      cat: "frontend" },
  { label: "CSS3",       cat: "frontend" },
  { label: "Vite",       cat: "frontend" },
  { label: "Framer Motion", cat: "frontend" },
  { label: "Node.js",    cat: "backend" },
  { label: "Express",    cat: "backend" },
  { label: "Python",     cat: "backend" },
  { label: "FastAPI",    cat: "backend" },
  { label: "GraphQL",    cat: "backend" },
  { label: "PostgreSQL", cat: "database" },
  { label: "MongoDB",    cat: "database" },
  { label: "Redis",      cat: "database" },
  { label: "Drizzle ORM", cat: "database" },
  { label: "Docker",     cat: "devops" },
  { label: "Linux",      cat: "devops" },
  { label: "Bash",       cat: "devops" },
  { label: "Cloudflare", cat: "devops" },
  { label: "Vercel",     cat: "devops" },
  { label: "AWS",        cat: "devops" },
  { label: "OpenAI",     cat: "ai" },
  { label: "Gemini",     cat: "ai" },
  { label: "DeepSeek",   cat: "ai" },
  { label: "Git",        cat: "tools" },
  { label: "VS Code",    cat: "tools" },
];

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/* ── Beautiful 2D glassmorphism tag-cloud ── */
const TagCloud = () => (
  <div
    className="w-full min-h-[300px] rounded-2xl p-8 flex flex-wrap gap-3 items-center justify-center bg-card/70"
    style={{
      backdropFilter: "blur(24px)",
      border: "1px solid hsl(var(--border) / 0.75)",
      boxShadow: "0 18px 50px hsl(204 36% 15% / 0.08)",
    }}
  >
    {TECH.map((t, i) => (
      <motion.span
        key={t.label}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.025 }}
        whileHover={{ scale: 1.12, y: -2 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono cursor-default select-none"
        style={{
          color: CAT_COLOR[t.cat],
          borderColor: `${CAT_COLOR[t.cat]}28`,
          border: `1px solid ${CAT_COLOR[t.cat]}28`,
          background: `${CAT_COLOR[t.cat]}0d`,
          fontSize: `${0.65 + (i % 4) * 0.06}rem`,
        }}
      >
        {t.label}
      </motion.span>
    ))}
  </div>
);

/* ── 3D Globe (only rendered when WebGL is available) ── */
const Globe3D = ({ wireColor }: { wireColor: string }) => {
  const [interacting, setInteracting] = useState(false);
  const [Mods, setMods] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import("@react-three/fiber"),
      import("@react-three/drei"),
      import("three"),
    ]).then(([fiber, drei, three]) => {
      setMods({ fiber, drei, three });
    }).catch(() => {});
  }, []);

  if (!Mods) return (
    <div className="w-full h-[420px] md:h-[520px] rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse" />
  );

  const { Canvas, useFrame } = Mods.fiber;
  const { OrbitControls, Text, Billboard } = Mods.drei;
  const THREE = Mods.three;

  const fibonacciSphere = (samples: number, radius: number): [number, number, number][] => {
    const pts: [number, number, number][] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
    }
    return pts;
  };

  const Sphere = ({ autoRotate }: { autoRotate: boolean }) => {
    const groupRef = useRef<any>(null);
    const positions = useMemo(() => fibonacciSphere(TECH.length, 2.4), []);
    useFrame((_: any, delta: number) => {
      if (groupRef.current && autoRotate) {
        groupRef.current.rotation.y += delta * 0.15;
        groupRef.current.rotation.x += delta * 0.04;
      }
    });
    return (
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[2.4, 48, 48]} />
          <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.1} />
        </mesh>
        {TECH.map((t, i) => {
          const [x, y, z] = positions[i];
          return (
            <Billboard key={t.label} position={[x, y, z]}>
              <Text fontSize={0.19} color={CAT_COLOR[t.cat]} anchorX="center" anchorY="middle" outlineWidth={0.008} outlineColor="#000" outlineOpacity={0.6}>
                {t.label}
              </Text>
            </Billboard>
          );
        })}
      </group>
    );
  };

  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        border: "1px solid hsl(var(--border) / 0.75)",
        background: "hsl(var(--card) / 0.7)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <Sphere autoRotate={!interacting} />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={4}
            maxDistance={10}
            onStart={() => setInteracting(true)}
            onEnd={() => setTimeout(() => setInteracting(false), 2000)}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 left-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest pointer-events-none">
        drag · scroll · explore
      </div>
    </div>
  );
};

/* ── Main export ── */
const LanguageGlobe = () => {
  const { theme } = useTheme();
  const wireColor = theme === "dark" ? "#ffffff" : "#000000";
  const isMobile = useIsMobile();
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLAvailable(detectWebGL());
  }, []);

  return (
    <section id="globe" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="eyebrow mb-3">// tech universe</p>
          <h2 className="display-font text-4xl md:text-5xl font-bold mb-4 tracking-tight">A stack with range.</h2>
          <div className="section-rule" />
          <p className="text-muted-foreground text-sm mt-4 max-w-xl">
            Every language, framework and platform I build with — color-coded by domain.
            {!isMobile && webGLAvailable && " Drag to rotate, scroll to zoom."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {webGLAvailable === null ? (
            <div className="w-full h-[300px] rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse" />
          ) : isMobile || !webGLAvailable ? (
            <TagCloud />
          ) : (
            <Globe3D wireColor={wireColor} />
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {(Object.keys(CAT_LABEL) as Cat[]).map((c) => (
            <div
              key={c}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                border: "1px solid hsl(var(--border) / 0.75)",
                background: "hsl(var(--card) / 0.55)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: CAT_COLOR[c] }} />
              <span className="font-mono text-[11px] text-muted-foreground tracking-wide">{CAT_LABEL[c]}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LanguageGlobe;
