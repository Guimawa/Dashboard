import React, {useState} from 'react'
import TopBar from './TopBar'
import RightPanel from './RightPanel'
import NetworkGraph from './NetworkGraph'
import BottomTimeline from './BottomTimeline'

export default function HandshakeDashboard(){
  const [query,setQuery]=useState('')
  const [selection,setSelection]=useState(null)

  return (
    <div style={{height:'100vh',display:'grid',gridTemplateColumns:'200px 1fr 250px',gridTemplateRows:'auto 1fr auto',overflow:'hidden'}}>
      {/* Sidebar (static placeholders) */}
      <aside style={{borderRight:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)'}}>
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
      <div style={{display:'grid',gridTemplateRows:'auto 1fr auto',gap:8}}>
        <TopBar onSearch={setQuery}/>
        <div style={{position:'relative'}}>
          <NetworkGraph onSelect={setSelection} />
        </div>
        <BottomTimeline />
      </div>

      {/* Right */}
      <div style={{background:'red', padding:'20px', color:'white'}}>
        <h3>PANEL DROIT TEST</h3>
        <p>Si vous voyez ceci, le layout fonctionne !</p>
      </div>
    </div>
  )
}