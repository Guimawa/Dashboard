import React from 'react'
export default function TopBar({onSearch}){
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.04)',backdropFilter:'blur(6px)'}}>
      <div className="row">
        <span className="small">Statut</span>
        <select className="input"><option>Tous</option><option>En cours</option><option>Terminé</option></select>
        <span className="small">Outil</span>
        <select className="input"><option>Tous</option><option>Outil A</option><option>Outil B</option></select>
        <span className="small">Géographie</span>
        <select className="input"><option>Monde</option><option>Zone A</option><option>Zone B</option></select>
      </div>
      <div className="row">
        <input className="input" placeholder="Rechercher..." onChange={e=>onSearch?.(e.target.value)} />
        <button className="btn">Nouveau Projet</button>
      </div>
    </div>
  )
}