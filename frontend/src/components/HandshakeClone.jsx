import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Globe,
  Sliders,
} from 'lucide-react';

// Generate placeholder projects for the initial graph (GENERIC DATA ONLY)
const initialProjects = [
  { id: 'proj1', label: 'Projet 1', type: 'project', color: '#60A5FA', size: 20, progress: 0 },
  { id: 'proj2', label: 'Projet 2', type: 'project', color: '#34D399', size: 18, progress: 0 },
  { id: 'proj3', label: 'Projet 3', type: 'project', color: '#FBBF24', size: 16, progress: 0 },
  { id: 'proj4', label: 'Projet 4', type: 'project', color: '#F472B6', size: 14, progress: 0 },
];

// Ranking list placeholders (GENERIC NAMES AND EMPTY VALUES)
const initialRanking = [
  { name: 'Personne 1', value: 0, diff: 0 },
  { name: 'Personne 2', value: 0, diff: 0 },
  { name: 'Personne 3', value: 0, diff: 0 },
  { name: 'Personne 4', value: 0, diff: 0 },
  { name: 'Personne 5', value: 0, diff: 0 },
  { name: 'Personne 6', value: 0, diff: 0 },
  { name: 'Personne 7', value: 0, diff: 0 },
  { name: 'Personne 8', value: 0, diff: 0 },
  { name: 'Personne 9', value: 0, diff: 0 },
  { name: 'Personne 10', value: 0, diff: 0 },
  { name: 'Personne 11', value: 0, diff: 0 },
  { name: 'Personne 12', value: 0, diff: 0 },
];

export default function HandshakeClone() {
  // Graph state: nodes and links
  const [graphData, setGraphData] = useState({
    nodes: [...initialProjects],
    links: [],
  });
  const [selected, setSelected] = useState(null);
  const fgRef = useRef();

  // Timeline bars placeholder heights (empty data)
  const [timeline, setTimeline] = useState(
    Array.from({ length: 20 }, () => 4) // All bars at minimum height
  );

  // Clear radial nodes helper
  const clearRadial = () => {
    setGraphData((g) => {
      const newNodes = g.nodes.filter((n) => !n.radial);
      const newLinks = g.links.filter((l) => !l.radial);
      return { nodes: newNodes, links: newLinks };
    });
  };

  // Click on a node: expand radial list or collapse (PLACEHOLDER DATA ONLY)
  const handleNodeClick = (node) => {
    if (node.type !== 'project') return; // ignore non-project nodes
    if (selected && selected.id === node.id) {
      // Collapse
      setSelected(null);
      clearRadial();
    } else {
      // Select new
      setSelected(node);
      clearRadial();
      // Add radial nodes: simulate events & influencers with PLACEHOLDER names
      const categories = [
        { name: 'Événements', items: ['Événement 1', 'Événement 2', 'Événement 3'] },
        { name: 'Influenceurs', items: ['Personne A', 'Personne B', 'Personne C'] },
      ];
      setGraphData((g) => {
        const newNodes = [...g.nodes];
        const newLinks = [...g.links];
        const radius = 120;
        let angleOffset = 0;
        categories.forEach((cat, ci) => {
          cat.items.forEach((it, i) => {
            const angle = angleOffset + (Math.PI * 2) * (i / cat.items.length);
            const id = `${node.id}-${cat.name}-${it}`;
            newNodes.push({
              id,
              label: it,
              type: ci === 0 ? 'event' : 'influencer',
              color: ci === 0 ? '#FBBF24' : '#34D399',
              size: 6,
              radial: true,
              fx: node.fx !== undefined ? node.fx + radius * Math.cos(angle) : radius * Math.cos(angle),
              fy: node.fy !== undefined ? node.fy + radius * Math.sin(angle) : radius * Math.sin(angle),
            });
            newLinks.push({ source: node.id, target: id, radial: true });
          });
          angleOffset += Math.PI * 2 / categories.length;
        });
        return { nodes: newNodes, links: newLinks };
      });
    }
  };

  // Node tooltip states
  const [hoverNode, setHoverNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Tooltip update
  const handleNodeHover = (node, prevNode) => {
    setHoverNode(node);
  };
  const handleMouseMove = (event) => {
    setTooltipPos({ x: event.clientX + 10, y: event.clientY + 10 });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr 320px',
        gridTemplateRows: 'auto 1fr auto',
        gap: '12px',
        height: '100%',
        padding: '12px',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Sidebar */}
      <aside className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>Menu</div>
        <button className="btn">Vue d'ensemble</button>
        <button className="btn">Nouveau projet</button>
        <button className="btn">Table Ronde IA</button>
        <button className="btn">Suivi performances</button>
        <button className="btn">Paramètres</button>
      </aside>

      {/* Top bar */}
      <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '60%' }}>
          <Search size={16} color="#94A3B8" />
          <input type="text" className="input" placeholder="Rechercher..." />
          {/* Score slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Score</span>
            <input type="range" min="0" max="100" defaultValue="0" className="slider" style={{ width: '80px' }} />
          </div>
          {/* Actors select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={16} color="#94A3B8" />
            <select className="input" style={{ width: '90px' }}>
              <option>Acteurs: Tous</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
          {/* Geography select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={16} color="#94A3B8" />
            <select className="input" style={{ width: '110px' }}>
              <option>Géogr.: Monde</option>
              <option>Zone A</option>
              <option>Zone B</option>
            </select>
          </div>
        </div>
        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="btn" style={{ gap: '4px' }}>
            0 Groupé
          </div>
          <div className="btn" style={{ gap: '4px' }}>
            0 Favoris
          </div>
          <div className="btn" style={{ gap: '4px' }}>
            Utilisateur <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Graph area */}
      <div
        style={{ position: 'relative' }}
        className="panel"
        onMouseLeave={() => setHoverNode(null)}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={800}
          height={400}
          nodeRelSize={6}
          nodeVal={(n) => n.size}
          nodeColor={(n) => n.color}
          linkColor={() => 'rgba(255,255,255,0.15)'}
          linkWidth={() => 1}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          enableZoomPanInteraction={true}
          enableNodeDrag={false}
          backgroundColor="transparent"
          warmupTicks={100}
          cooldownTicks={100}
        />
        {/* Tooltip */}
        {hoverNode && (
          <div
            className="node-tooltip"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div style={{ fontWeight: '600' }}>{hoverNode.label}</div>
            {hoverNode.type === 'project' && <div className="small">Projet placeholder</div>}
            {hoverNode.type === 'event' && <div className="small">Événement placeholder</div>}
            {hoverNode.type === 'influencer' && <div className="small">Personne placeholder</div>}
          </div>
        )}
      </div>

      {/* Ranking panel */}
      <aside className="panel" style={{ overflowY: 'auto' }}>
        <div style={{ marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>Classement</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
          <span>Nom</span>
          <span>Score</span>
        </div>
        {initialRanking.map((person, idx) => (
          <div key={person.name} className="ranking-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '14px', textAlign: 'right' }}>{idx + 1}.</span>
              <span>{person.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{person.value}</span>
              {person.diff > 0 ? (
                <ArrowUpRight size={12} color="#34D399" />
              ) : person.diff < 0 ? (
                <ArrowDownRight size={12} color="#F87171" />
              ) : (
                <span style={{ width: '12px' }} />
              )}
            </div>
          </div>
        ))}
      </aside>

      {/* Bottom timeline */}
      <div className="panel" style={{ gridColumn: '2 / span 1' }}>
        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '600' }}>Trends par thèmes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA' }} /> Placeholder A
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }} /> Placeholder B
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBF24' }} /> Placeholder C
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Période placeholder</div>
        </div>
        <div className="timeline">
          {timeline.map((h, i) => (
            <div
              key={i}
              className="bar"
              style={{ height: h }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}