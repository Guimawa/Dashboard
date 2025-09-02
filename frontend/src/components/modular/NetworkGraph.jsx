import React, {useMemo, useState, useRef, useEffect} from 'react'
import ForceGraph2D from 'react-force-graph-2d'

const COLORS = ['#60a5fa','#22c55e','#fbbf24','#ff6ad5']
let auto=0; const nid=()=>`n_${auto++}`

function satellitesFor(label){
  const items = ['Événement 1','Événement 2','Personne A','Personne B']
  const nodes=[], links=[]
  const hub = nid(); nodes.push({id:hub,label, type:'hub', color:'#94a3b8'})
  items.forEach((k,i)=>{const id=nid(); nodes.push({id,label:k,type:'leaf',color:COLORS[i%COLORS.length]}); links.push({source:hub,target:id})})
  return {hub, nodes, links}
}

export default function NetworkGraph({onSelect}){
  const projects = useMemo(()=>Array.from({length:8},(_,i)=>({id:`p${i+1}`,label:`Projet ${i+1}`,type:'project',color:COLORS[i%COLORS.length]})),[])
  const [graph,setGraph]=useState({nodes:[...projects],links:[]})
  const fg = useRef(null)

  const handleClick = (node)=>{
    if(node.type!=='project') return
    const exp = satellitesFor(node.label)
    setGraph(g=>({nodes:[...g.nodes, ...exp.nodes], links:[...g.links, {source:node.id,target:exp.hub}, ...exp.links]}))
    onSelect?.({name: node.label})
  }

  useEffect(()=>{ if(fg.current){ fg.current.zoom(1,400) } },[])

  return (
    <div className="panel glow" style={{position:'relative',height:'100%'}}>
      <ForceGraph2D
        ref={fg}
        graphData={graph}
        backgroundColor="transparent"
        linkColor={()=>'rgba(255,255,255,.14)'} linkWidth={()=>1}
        nodeRelSize={6}
        onNodeClick={handleClick}
        nodeCanvasObject={(n,ctx,scale)=>{
          const r = n.type==='project'?12 : n.type==='hub'?9 : 6
          ctx.save(); ctx.shadowColor = n.color||'#60a5fa'; ctx.shadowBlur=18; ctx.beginPath(); ctx.arc(n.x,n.y,r,0,2*Math.PI); ctx.fillStyle='rgba(255,255,255,.05)'; ctx.fill(); ctx.restore();
          ctx.beginPath(); ctx.arc(n.x,n.y,r,0,2*Math.PI); ctx.lineWidth=2; ctx.strokeStyle=n.color||'#9ca3af'; ctx.stroke();
          const fs = 12/Math.sqrt(scale); if(fs>3){ ctx.font = `${fs}px Inter`; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillStyle='#e5e7eb'; ctx.fillText(n.label,n.x,n.y+r+2) }
        }}
      />
      {/* subtle radial lights */}
      <div style={{pointerEvents:'none',position:'absolute',inset:0,background:'radial-gradient(600px 400px at 25% 25%, rgba(255,255,255,.05), transparent), radial-gradient(500px 300px at 80% 30%, rgba(96,165,250,.07), transparent)'}}/>
    </div>
  )
}