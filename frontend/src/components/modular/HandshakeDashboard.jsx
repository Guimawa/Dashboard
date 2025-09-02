import React, {useState} from 'react'
import TopBar from './TopBar'
import RightPanel from './RightPanel'
import NetworkGraph from './NetworkGraph'
import BottomTimeline from './BottomTimeline'

export default function HandshakeDashboard(){
  const [query,setQuery]=useState('')
  const [selection,setSelection]=useState(null)

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'var(--bg-main)'}}>
      {/* Header - Recherche & Filtres */}
      <header style={{padding:'16px 32px',borderBottom:'1px solid var(--bg-separator)',background:'var(--bg-panel)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
          <input 
            className="input" 
            placeholder="Search influence, organization or person" 
            style={{flex:'1',maxWidth:'50%'}}
            onChange={e=>setQuery(e.target.value)}
          />
          <select className="input" style={{width:'150px'}}>
            <option>Géographie: Monde</option>
            <option>Europe</option>
            <option>Amérique</option>
          </select>
          <select className="input" style={{width:'150px'}}>
            <option>Statut: Tous</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
      </header>

      {/* Corps principal */}
      <div style={{flex:1,display:'flex',padding:'0 32px'}}>
        {/* Zone graphe (8 colonnes - 66%) */}
        <div style={{flex:'2',marginRight:'24px',position:'relative'}}>
          <NetworkGraph onSelect={setSelection} />
        </div>

        {/* Panneau classement (4 colonnes - 33%) */}
        <div style={{width:'33%',background:'var(--bg-panel)',borderRadius:'8px',padding:'16px'}}>
          <RightPanel />
        </div>
      </div>

      {/* Footer - Timeline */}
      <footer style={{height:'100px',padding:'16px 32px',borderTop:'1px solid var(--bg-separator)'}}>
        <BottomTimeline />
      </footer>
    </div>
  )
}