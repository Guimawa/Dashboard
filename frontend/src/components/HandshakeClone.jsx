import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Bell, Search, Lock, Bot, BarChart3 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// ------------------------------------------------------------
// DASHBOARD "STYLE HANDSHAKE" — VERSION LIGHT MAIS FIDÈLE VISUELLEMENT
// - Fond sombre bleu/noir, bulles rondes multicolores, connexions fines
// - Grosse bulle = Projet. Clic => expansion (statuts, dates, liens, métriques)
// - Ranking à droite (+ %) ; Stats en bas ; Top bar filtres ; Sidebar gauche
// - Compatible PWA/SPA ; Dépendances: react-force-graph-2d, recharts, lucide-react
// ------------------------------------------------------------

// Palette inspirée de la vidéo: rose, vert, bleu, jaune (glow subtil)
const NODE_COLORS = ["#FF6AD5", "#4ADE80", "#60A5FA", "#FBBF24"]; // rose, vert, bleu, jaune
const BG_GRADIENT = "linear-gradient(180deg, #0B1220 0%, #050A16 100%)";

// --- Données de départ (exemples) ------------------------------------------
// Tu peux remplacer les thumbnails par tes images/vidéos (URL) ou laisser vide.
const INITIAL_PROJECTS = [
  {
    id: "p1",
    label: "Projet App Mobile",
    progress: 72,
    color: NODE_COLORS[2],
    img: "", // ex: "/assets/mobile.png" (facultatif)
    metrics: [
      { t: "Jan", v: 200 },
      { t: "Fév", v: 280 },
      { t: "Mar", v: 360 },
      { t: "Avr", v: 420 },
      { t: "Mai", v: 510 },
    ],
  },
  {
    id: "p2",
    label: "Site E‑commerce",
    progress: 41,
    color: NODE_COLORS[0],
    img: "",
    metrics: [
      { t: "Jan", v: 120 },
      { t: "Fév", v: 130 },
      { t: "Mar", v: 210 },
      { t: "Avr", v: 240 },
      { t: "Mai", v: 300 },
    ],
  },
  {
    id: "p3",
    label: "Campagne Marketing",
    progress: 88,
    color: NODE_COLORS[1],
    img: "",
    metrics: [
      { t: "Jan", v: 80 },
      { t: "Fév", v: 120 },
      { t: "Mar", v: 170 },
      { t: "Avr", v: 190 },
      { t: "Mai", v: 260 },
    ],
  },
];

// Helpers pour créer des noeuds satellites autour d'un projet
let autoId = 0;
const nid = () => `n_${autoId++}`;

function makeProjectSatelliteNodes(project) {
  // 4 groupes: Statuts, Dates, Outils, KPIs
  const status = [
    { key: "En cours", color: "#22C55E" },
    { key: "Bloqué", color: "#EF4444" },
    { key: "Terminé", color: "#3B82F6" },
  ];
  const dates = ["Échéance", "Kickoff", "Dernière maj"].map((d) => ({ key: d }));
  const tools = ["Figma", "GitHub", "Notion", "YouTube"].map((t) => ({ key: t }));
  const kpis = ["Vues", "Utilisateurs", "CA"];

  const nodes = [];
  const links = [];

  const cluster = (
    title,
    items,
    color = "#94A3B8" // slate-400 par défaut pour texte
  ) => {
    const clusterId = nid();
    nodes.push({ id: clusterId, label: title, type: "cluster", color });
    links.push({ source: project.id, target: clusterId });

    items.forEach((it) => {
      const nodeId = nid();
      const label = typeof it === "string" ? it : it.key;
      const ncol = typeof it === "string" ? color : it.color || color;
      nodes.push({ id: nodeId, label, type: "item", color: ncol });
      links.push({ source: clusterId, target: nodeId });
    });
  };

  cluster("Statuts", status);
  cluster("Dates clés", dates);
  cluster("Liens outils", tools);
  cluster("KPIs", kpis.map((k) => ({ key: k })), "#EAB308");

  return { nodes, links };
}

// --- Composants UI ----------------------------------------------------------
function TopBar({ onSearch }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-white/70 text-sm">Statut</span>
        <select className="bg-white/5 text-white text-sm rounded-md px-2 py-1 border border-white/10">
          <option>Tous</option>
          <option>En cours</option>
          <option>Bloqué</option>
          <option>Terminé</option>
        </select>
        <span className="text-white/70 text-sm ml-4">Période</span>
        <select className="bg-white/5 text-white text-sm rounded-md px-2 py-1 border border-white/10">
          <option>90 jours</option>
          <option>30 jours</option>
          <option>7 jours</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-white/40" />
          <input
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Rechercher un projet…"
            className="pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 text-white/80" />
          <span className="absolute -top-2 -right-2 text-[10px] bg-blue-500 text-white rounded-full px-1.5 py-0.5">3</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-white/5">
      <div className="p-4">
        <h2 className="text-white/80 font-semibold tracking-wide">Dashboard</h2>
      </div>
      <nav className="px-2 space-y-1 pb-4">
        {[
          { key: "overview", label: "Vue d'ensemble", icon: <BarChart3 className="w-4 h-4" /> },
          { key: "vault", label: "Coffre-fort sécurisé", icon: <Lock className="w-4 h-4" /> },
          { key: "ia", label: "Table Ronde IA", icon: <Bot className="w-4 h-4" /> },
          { key: "perf", label: "Suivi performances", icon: <BarChart3 className="w-4 h-4" /> },
        ].map((item, idx) => (
          <a
            key={item.key}
            href="#"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 ${idx === 0 ? "bg-white/10" : ""}`}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-4 py-3 mt-auto text-xs text-white/40">
        v1 • Style Handshake • Light
      </div>
    </aside>
  );
}

function RankingPanel({ projects, onFocus }) {
  const sorted = useMemo(() => [...projects].sort((a, b) => b.progress - a.progress), [projects]);
  return (
    <aside className="w-80 shrink-0 border-l border-white/10 bg-white/5 p-4">
      <h3 className="text-white/80 font-semibold mb-3">Ranking projets</h3>
      <div className="space-y-2">
        {sorted.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onFocus?.(p.id)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-white/90 text-sm truncate">{i + 1}. {p.label}</span>
            </div>
            <span className="text-white/70 text-sm">{p.progress}%</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function StatsStrip({ selected }) {
  const data = selected?.metrics || [];
  return (
    <div className="border-t border-white/10 bg-white/5 p-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {["Vues", "Utilisateurs", "Conversions"].map((k, idx) => (
          <div key={k} className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-xs">{k}</span>
              <span className="text-white/50 text-[10px]">30 derniers jours</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="t" stroke="#7F8EA3" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7F8EA3" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                  <Line type="monotone" dataKey="v" stroke="#60A5FA" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Graph réseau (canvas 2D) ----------------------------------------------
function NetworkGraph({ graphData, focusId, onNodeClick }) {
  const fgRef = useRef(null);

  // Focus sur un projet depuis le ranking
  useEffect(() => {
    if (!focusId || !fgRef.current) return;
    const node = graphData.nodes.find((n) => n.id === focusId);
    if (node) fgRef.current.centerAt(node.x || 0, node.y || 0, 600);
  }, [focusId, graphData.nodes]);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      width={undefined}
      height={undefined}
      backgroundColor={"transparent"}
      cooldownTicks={60}
      linkColor={() => "rgba(255,255,255,0.15)"}
      linkWidth={() => 1}
      linkDirectionalParticles={0}
      nodeRelSize={6}
      onNodeClick={onNodeClick}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const N = node;
        const r = N.type === "project" ? 14 : N.type === "cluster" ? 10 : 6;
        // Glow
        ctx.save();
        ctx.shadowColor = N.color || "#93C5FD";
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(N.x, N.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fill();
        ctx.restore();

        // Cercle principal
        ctx.beginPath();
        ctx.arc(N.x, N.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(15,23,42,0.9)"; // slate-900 translucent
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = N.color || "#9CA3AF";
        ctx.stroke();

        // Label (pas pour trop petit zoom)
        const label = N.label || "";
        const fontSize = 12 / Math.sqrt(globalScale);
        if (fontSize > 3) {
          ctx.font = `${fontSize}px Inter, system-ui, -apple-system`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = "#E5E7EB";
          ctx.fillText(label, N.x, N.y + r + 2);
        }
      }}
    />
  );
}

// --- Composant principal ----------------------------------------------------
export default function DashboardHandshakeClone() {
  const [projects] = useState(INITIAL_PROJECTS);
  const [focusId, setFocusId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [search, setSearch] = useState("");

  // Graph state
  const [graph, setGraph] = useState(() => {
    const nodes = projects.map((p) => ({ id: p.id, label: p.label, type: "project", color: p.color }));
    const links = []; // liens inter‑projets (optionnel)
    return { nodes, links };
  });

  // Clic sur un noeud => expansion si projet
  const handleNodeClick = (node) => {
    if (node.type !== "project") return;

    setSelectedProject(projects.find((p) => p.id === node.id) || null);
    setFocusId(node.id);

    // Si déjà des satellites reliés => ne pas dupliquer
    const alreadyExpanded = graph.links.some((l) => l.source.id === node.id || l.source === node.id);
    if (alreadyExpanded) return;

    const { nodes: satellites, links } = makeProjectSatelliteNodes(node);
    setGraph((g) => ({ nodes: [...g.nodes, ...satellites], links: [...g.links, ...links] }));
  };

  const filteredProjects = useMemo(
    () => projects.filter((p) => p.label.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  // Fond gradient appliqué au body de la zone centrale
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundImage = BG_GRADIENT;
    }
  }, []);

  return (
    <div className="h-screen w-screen text-white/90 flex overflow-hidden" style={{ background: "#060B16" }}>
      <Sidebar />

      <div ref={containerRef} className="flex-1 flex flex-col">
        <TopBar onSearch={setSearch} />

        {/* Zone centrale: Graph + overlay subtle */}
        <div className="relative flex-1">
          <div className="absolute inset-0">
            <NetworkGraph graphData={graph} focusId={focusId} onNodeClick={handleNodeClick} />
          </div>

          {/* Overlay décor (rayures très subtiles) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.05),transparent_35%)]" />
        </div>

        {/* Stats bas (liées au projet sélectionné) */}
        <StatsStrip selected={selectedProject} />
      </div>

      <RankingPanel projects={filteredProjects} onFocus={setFocusId} />
    </div>
  );
}

// ------------------------------------------------------------
// INSTALLATION RAPIDE (si besoin en dehors du canvas):
//   npm i react-force-graph-2d recharts lucide-react
// Place ce composant comme page principale (ex: App.jsx) et démarre.
// Clique sur une grosse bulle (projet) => expansion dynamique comme dans la vidéo.
// Pour attacher tes images/vidéos: ajoute des props (img, videoUrl) dans INITIAL_PROJECTS
// et dessine-les dans nodeCanvasObject si tu veux un aperçu dans la bulle.
// ------------------------------------------------------------