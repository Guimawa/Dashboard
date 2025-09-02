import React, {useState} from 'react'
import TopBar from './TopBar'
import RightPanel from './RightPanel'
import NetworkGraph from './NetworkGraph'
import BottomTimeline from './BottomTimeline'

export default function HandshakeDashboard(){
  const [query,setQuery]=useState('')
  const [selection,setSelection]=useState(null)

  return (
    <div style={{height:'100vh',display:'flex',overflow:'hidden'}}>
      {/* Sidebar (static placeholders) */}
      <aside style={{width:'180px',minWidth:'180px',borderRight:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)'}}>
        <div style={{padding:14}}>
          <div style={{fontWeight:600}}>Dashboard</div>
          <div className="grid" style={{marginTop:12}}>
            <button className="btn">Vue d'ensemble</button>
            <button className="btn">Nouveau projet</button>
            <button className="btn">Table Ronde IA</button>
            <button className="btn">Suivi performances</button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div style={{flex:'1',display:'flex',flexDirection:'column',minWidth:0}}>
        <TopBar onSearch={setQuery}/>
        <div style={{flex:1,position:'relative',minHeight:0}}>
          <NetworkGraph onSelect={setSelection} />
        </div>
        <div style={{height:'100px',minHeight:'100px'}}>
          <BottomTimeline />
        </div>
      </div>

      {/* Right Panel - FORCER LA VISIBILITÉ */}  
      <div style={{width:'280px',minWidth:'280px',borderLeft:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)'}}>
        <RightPanel />
      </div>
    </div>
  )
}