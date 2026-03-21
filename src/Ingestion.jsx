import { useState, useEffect } from 'react'

export default function Ingestion() {
  const [sources, setSources] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/api/sources')
      .then(r => r.json())
      .then(data => { setSources(data); setLoading(false) })

    fetch('http://localhost:4000/api/stats')
      .then(r => r.json())
      .then(data => setStats(data))
  }, [])

  if (loading) return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#00e5ff', fontFamily:'monospace', fontSize:'14px'}}>
      Loading sources...
    </div>
  )

  return (
    <div style={{padding:'24px', display:'flex', flexDirection:'column', gap:'24px'}}>

      {/* Header Stats */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px'}}>
        {[
          { label:'Total Sources',  value: sources.length.toString(), color:'#00e5ff' },
          { label:'Active Now',     value: sources.filter(s=>s.status==='connected').length.toString(), color:'#10b981' },
          { label:'Records Today',  value: stats.recordsToday || '—', color:'#7c3aed' },
          { label:'Avg Latency',    value: stats.avgLatency  || '—', color:'#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{background:'#111118', border:'1px solid #2a2a38', borderRadius:'12px', padding:'16px 20px'}}>
            <div style={{fontSize:'11px', fontWeight:'700', color:'#6b6b80', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px'}}>{stat.label}</div>
            <div style={{fontSize:'28px', fontWeight:'800', color:stat.color, fontFamily:'monospace'}}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Sources Grid */}
      <div>
        <div style={{fontSize:'12px', fontWeight:'700', color:'#6b6b80', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'12px'}}>Connected Sources</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px'}}>
          {sources.map(source => (
            <div key={source.id} style={{background:'#111118', border:`1px solid ${source.status==='connected'?'rgba(0,229,255,0.2)':'#2a2a38'}`, borderRadius:'12px', padding:'16px', display:'flex', alignItems:'center', gap:'12px', cursor:'pointer'}}>
              <div style={{width:'44px', height:'44px', borderRadius:'10px', background:`rgba(${source.status==='connected'?'0,229,255':'107,107,128'},0.08)`, border:`1px solid ${source.status==='connected'?'rgba(0,229,255,0.2)':'#2a2a38'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0}}>
                {source.type==='Database'?'🐘':source.type==='SaaS'?'💳':source.type==='Stream'?'📡':'☁️'}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'13px', fontWeight:'700', color:'#e8e8f0', marginBottom:'2px'}}>{source.name}</div>
                <div style={{fontSize:'11px', color:'#6b6b80', fontFamily:'monospace'}}>{source.type} · {source.records}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                <div style={{width:'7px', height:'7px', borderRadius:'50%', background: source.status==='connected'?'#10b981':'#6b6b80', boxShadow: source.status==='connected'?'0 0 6px #10b981':'none'}}></div>
                <span style={{fontSize:'10px', fontWeight:'700', color: source.status==='connected'?'#10b981':'#6b6b80'}}>{source.status==='connected'?'LIVE':'IDLE'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Source */}
      <div style={{border:'2px dashed #2a2a38', borderRadius:'12px', padding:'20px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:'8px', color:'#6b6b80', fontSize:'14px', fontWeight:'600'}}>
        <span style={{fontSize:'20px'}}>+</span> Add New Source
      </div>

    </div>
  )
}
