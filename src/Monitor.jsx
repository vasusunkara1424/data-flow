import { useState, useEffect } from 'react'

const CHECKS = [
  { name:'not_null: order_id',      table:'orders table',        status:'passed' },
  { name:'unique: order_id',        table:'orders table',        status:'passed' },
  { name:'accepted_values: status', table:'pending/paid/shipped', status:'passed' },
  { name:'row_count > 0',           table:'fact_orders',         status:'passed' },
  { name:'schema_match: users',     table:'users table',         status:'failed' },
]

const PIPELINES = [
  { name:'ecommerce_analytics', latency:'p99: 89ms',  status:'ok' },
  { name:'user_events_stream',  latency:'p99: 44ms',  status:'ok' },
  { name:'postgres_to_warehouse',latency:'halted',    status:'error' },
]

const INIT_LOGS = [
  { time:'14:32:01', level:'INFO',  msg:'ecommerce: batch #4821 ingested (12,441 rows)' },
  { time:'14:32:01', level:'INFO',  msg:'stripe: 3 new payment_intent events' },
  { time:'14:31:58', level:'WARN',  msg:"postgres_to_warehouse: column 'phone' type mismatch" },
  { time:'14:31:45', level:'INFO',  msg:'dbt run: models/staging/stg_orders.sql ✓' },
  { time:'14:31:30', level:'INFO',  msg:'QA: 14/14 checks passed for order_facts' },
  { time:'14:31:12', level:'ERROR', msg:'postgres_to_warehouse: schema drift halted sync' },
]

const NEW_LOGS = [
  'ecommerce: batch processed ✓',
  'stripe: new webhook received',
  'dbt: incremental run complete',
  'fact_orders: 2,441 rows merged',
  'QA: all checks passed ✓',
  'snowflake: COPY INTO completed',
]

const LEVEL_COLOR = { INFO:'#00e5ff', WARN:'#f59e0b', ERROR:'#ef4444' }
const BARS = [40,60,50,80,70,90,75,100,85,92,78,88]

export default function Monitor() {
  const [logs, setLogs] = useState(INIT_LOGS)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
      const newLog = { time, level:'INFO', msg: NEW_LOGS[idx % NEW_LOGS.length] }
      setLogs(prev => [newLog, ...prev.slice(0,10)])
      setIdx(i => i + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [idx])

  return (
    <div style={{padding:'24px', display:'flex', flexDirection:'column', gap:'16px'}}>

      {/* Alert Banner */}
      <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'10px'}}>
        <div style={{width:'8px', height:'8px', borderRadius:'50%', background:'#ef4444', boxShadow:'0 0 6px #ef4444', flexShrink:0, animation:'pulse 1s infinite'}}></div>
        <strong style={{color:'#ef4444', fontSize:'12px'}}>Schema drift detected</strong>
        <span style={{fontSize:'12px', color:'#6b6b80'}}>postgres_to_warehouse — column users.phone changed VARCHAR(20) → VARCHAR(50)</span>
        <button style={{marginLeft:'auto', padding:'4px 12px', borderRadius:'8px', border:'none', background:'#ef4444', color:'#fff', cursor:'pointer', fontSize:'11px', fontWeight:'700', flexShrink:0}}>Fix Now</button>
      </div>

      {/* Stats Row */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px'}}>
        {[
          { label:'Throughput',    value:'68,420', unit:'rec/min', color:'#00e5ff' },
          { label:'Quality Score', value:'97.3%',  unit:'passing', color:'#10b981' },
          { label:'Active Alerts', value:'1',      unit:'critical',color:'#ef4444' },
          { label:'Avg Latency',   value:'142ms',  unit:'p99',     color:'#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{background:'#111118', border:'1px solid #2a2a38', borderRadius:'12px', padding:'16px'}}>
            <div style={{fontSize:'11px', fontWeight:'700', color:'#6b6b80', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px'}}>{s.label}</div>
            <div style={{fontSize:'24px', fontWeight:'800', color:s.color, fontFamily:'monospace'}}>{s.value}</div>
            <div style={{fontSize:'11px', color:'#6b6b80', marginTop:'4px'}}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Charts + Pipeline Health */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>

        {/* Throughput Chart */}
        <div style={{background:'#111118', border:'1px solid #2a2a38', borderRadius:'12px', padding:'16px'}}>
          <div style={{fontSize:'11px', fontWeight:'700', color:'#6b6b80', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px'}}>Throughput — Records/Min</div>
          <div style={{display:'flex', alignItems:'flex-end', gap:'4px', height:'60px'}}>
            {BARS.map((h, i) => (
              <div key={i} style={{flex:1, borderRadius:'3px 3px 0 0', background:`rgba(0,229,255,${0.4 + h/200})`, height:`${h}%`, minHeight:'4px'}}></div>
            ))}
          </div>
          <div style={{fontSize:'22px', fontWeight:'800', color:'#00e5ff', fontFamily:'monospace', marginTop:'10px'}}>68,420 <span style={{fontSize:'13px', color:'#6b6b80'}}>rec/min</span></div>
        </div>

        {/* Pipeline Health */}
        <div style={{background:'#111118', border:'1px solid #2a2a38', borderRadius:'12px', padding:'16px'}}>
          <div style={{fontSize:'11px', fontWeight:'700', color:'#6b6b80', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px'}}>Pipeline Health</div>
          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            {PIPELINES.map(p => (
              <div key={p.name} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', background:'#17171f', borderRadius:'8px'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background: p.status==='ok'?'#10b981':'#ef4444', boxShadow:`0 0 6px ${p.status==='ok'?'#10b981':'#ef4444'}`, flexShrink:0}}></div>
                <div style={{flex:1, fontSize:'12px', fontWeight:'600', color:'#e8e8f0'}}>{p.name}</div>
                <div style={{fontSize:'11px', color:'#6b6b80', fontFamily:'monospace'}}>{p.latency}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Checks + Live Logs */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>

        {/* Quality Checks */}
        <div style={{background:'#111118', border:'1px solid #2a2a38', borderRadius:'12px', overflow:'hidden'}}>
          <div style={{padding:'14px 18px', borderBottom:'1px solid #2a2a38', fontSize:'13px', fontWeight:'700', color:'#e8e8f0'}}>Quality Checks ({CHECKS.length} rules)</div>
          <div style={{padding:'12px', display:'flex', flexDirection:'column', gap:'6px'}}>
            {CHECKS.map(c => (
              <div key={c.name} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', background:'#17171f', borderRadius:'8px'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background: c.status==='passed'?'#10b981':'#ef4444', boxShadow:`0 0 6px ${c.status==='passed'?'#10b981':'#ef4444'}`, flexShrink:0}}></div>
                <div style={{flex:1, fontSize:'12px', fontWeight:'600', color:'#e8e8f0'}}>{c.name}</div>
                <div style={{fontSize:'10px', color:'#6b6b80'}}>{c.table}</div>
                <div style={{fontSize:'10px', padding:'2px 8px', borderRadius:'20px', fontWeight:'700', background: c.status==='passed'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color: c.status==='passed'?'#10b981':'#ef4444'}}>{c.status==='passed'?'✓ Passed':'✕ Failed'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Log Stream */}
        <div style={{background:'#111118', border:'1px solid #2a2a38', borderRadius:'12px', overflow:'hidden'}}>
          <div style={{padding:'14px 18px', borderBottom:'1px solid #2a2a38', fontSize:'13px', fontWeight:'700', color:'#e8e8f0', display:'flex', alignItems:'center', gap:'8px'}}>
            <div style={{width:'7px', height:'7px', borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981'}}></div>
            Live Log Stream
          </div>
          <div style={{padding:'12px', background:'#0a0a0f', margin:'12px', borderRadius:'8px', border:'1px solid #2a2a38', height:'180px', overflowY:'auto', fontFamily:'monospace', fontSize:'11px', lineHeight:'1.8'}}>
            {logs.map((log, i) => (
              <div key={i} style={{display:'flex', gap:'10px'}}>
                <span style={{color:'#6b6b80', flexShrink:0}}>{log.time}</span>
                <span style={{color:LEVEL_COLOR[log.level], flexShrink:0, fontWeight:'700', minWidth:'40px'}}>{log.level}</span>
                <span style={{color:'#a5b4fc'}}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}