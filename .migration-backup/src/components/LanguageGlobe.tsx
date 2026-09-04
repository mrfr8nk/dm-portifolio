import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

type Cat = "frontend" | "backend" | "database" | "devops" | "ai" | "tools";
const CAT_COLOR: Record<Cat, string> = {
  frontend: "#60a5fa",  // blue
  backend:  "#34d399",  // green
  database: "#fbbf24",  // amber
  devops:   "#f87171",  // red
  ai:       "#c084fc",  // purple
  tools:    "#94a3b8",  // slate
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
  { label: "Framer",     cat: "frontend" },

  { label: "Node.js",    cat: "backend" },
  { label: "Express",    cat: "backend" },
  { label: "Python",     cat: "backend" },
  { label: "FastAPI",    cat: "backend" },
  { label: "GraphQL",    cat: "backend" },

  { label: "PostgreSQL", cat: "database" },
  { label: "MongoDB",    cat: "database" },
  { label: "Redis",      cat: "database" },
  { label: "Supabase",   cat: "database" },

  { label: "Docker",     cat: "devops" },
  { label: "Linux",      cat: "devops" },
  { label: "Bash",       cat: "devops" },
  { label: "Cloudflare", cat: "devops" },
  { label: "Vercel",     cat: "devops" },
  { label: "Render",     cat: "devops" },
  { label: "Heroku",     cat: "devops" },
  { label: "AWS",        cat: "devops" },

  { label: "OpenAI",     cat: "ai" },
  { label: "Gemini",     cat: "ai" },
  { label: "DeepSeek",   cat: "ai" },

  { label: "Git",        cat: "tools" },
];

const fibonacciSphere = (samples: number, radius: number) => {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
};

const Sphere = ({ autoRotate, wireColor }: { autoRotate: boolean; wireColor: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(TECH.length, 2.4), []);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.4, 48, 48]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.12} />
      </mesh>
      {TECH.map((t, i) => {
        const [x, y, z] = positions[i];
        const c = CAT_COLOR[t.cat];
        return (
          <Billboard key={t.label} position={[x, y, z]}>
            <Text
              fontSize={0.19}
              color={c}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.008}
              outlineColor="#000000"
              outlineOpacity={0.6}
            >
              {t.label}
            </Text>
          </Billboard>
        );
      })}
    </group>
  );
};

const LanguageGlobe = () => {
  const [interacting, setInteracting] = useState(false);
  const { theme } = useTheme();
  const wireColor = theme === "dark" ? "#ffffff" : "#000000";
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <section id="globe" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-3">
            // tech universe
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Stack, In Orbit</h2>
          <div className="w-12 h-px bg-foreground/20" />
          <p className="text-muted-foreground text-sm mt-4 max-w-xl">
            A living sphere of every language, framework and platform I build with — color-coded by domain. Drag to rotate, scroll to zoom.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full h-[420px] md:h-[520px] rounded-2xl border border-border bg-gradient-to-b from-card/30 to-transparent overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 5, 5]} intensity={0.8} />
              <Sphere autoRotate={!interacting} wireColor={wireColor} />
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
          <div className="absolute bottom-3 left-4 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest pointer-events-none">
            drag · scroll · explore
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {(Object.keys(CAT_LABEL) as Cat[]).map((c) => (
            <div key={c} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/40 backdrop-blur">
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
