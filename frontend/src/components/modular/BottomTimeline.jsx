import React from 'react'
export default function BottomTimeline(){
  const days = Array.from({length:16}, (_,i)=>({h: 6})) // All bars at minimum height
  return (
    <div className="panel" style={{padding:'10px',marginTop:'8px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <div className="row">
          <strong>Trends par thèmes</strong>
          <span className="badge"><span style={{width:8,height:8,borderRadius:999,background:'#60a5fa'}}></span>Placeholder A</span>
          <span className="badge"><span style={{width:8,height:8,borderRadius:999,background:'#22c55e'}}></span>Placeholder B</span>
          <span className="badge"><span style={{width:8,height:8,borderRadius:999,background:'#fbbf24'}}></span>Placeholder C</span>
        </div>
        <div className="row"><span className="small">Période</span><span style={{opacity:.5}}>—</span><span className="small">Placeholder</span></div>
      </div>
      <div className="timeline">
        {days.map((d,i)=>(<div key={i} className="bar" style={{height:d.h}} />))}
      </div>
    </div>
  )
}