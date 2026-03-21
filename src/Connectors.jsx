import { useState } from 'react'

const CONNECTORS = [
  { id: 'postgres', label: 'PostgreSQL', icon: '🐘', fields: [
    { key: 'host', label: 'Host', placeholder: 'localhost' },
    { key: 'port', label: 'Port', placeholder: '5432' },
    { key: 'database', label: 'Database', placeholder: 'mydb' },
    { key: 'user', label: 'User', placeholder: 'postgres' },
    { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
  ]},
  { id: 'stripe', label: 'Stripe', icon: '💳', fields: [
    { key: 'apiKey', label: 'API Key', placeholder: 'sk_live_...', type: 'password' },
  ]},
  { id: 's3', label: 'AWS S3', icon: '☁️', fields: [
    { key: 'accessKeyId', label: 'Access Key ID', placeholder: 'AKIA...' },
    { key: 'secretAccessKey', label: 'Secret Access Key', placeholder: '••••••••', type: 'password' },
    { key: 'region', label: 'Region', placeholder: 'us-east-1' },
  ]},
]

export default function Connectors() {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`http://localhost:4000/api/connect/${selected.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) setResult(data.data)
      else setError(data.error)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{padding:'32px', maxWidth:'800px', margin:'0 auto'}}>
      <h2 style={{fontSize:'22px', fontWeight:'800', marginBottom:'8px'}}>Connectors</h2>
      <p style={{color:'#6b6b80', marginBottom:'32px', fontSize:'14px'}}>Connect your data sources</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px'}}>
        {CONNECTORS.map(c => (
          <button key={c.id} onClick={() => { setSelected(c); setForm({}); setResult(null); setError(null) }}
            style={{padding:'24px', borderRadius:'12px', border: selected?.id===c.id ? '1px solid #00e5ff' : '1px solid #2a2a38',
              background: selected?.id===c.id ? 'rgba(0,229,255,0.08)' : '#111118',
              color: selected?.id===c.id ? '#00e5ff' : '#e8e8f0', cursor:'pointer', textAlign:'left'}}>
            <div style={{fontSize:'32px', marginBottom:'8px'}}>{c.icon}</div>
            <div style={{fontWeight:'700', fontSize:'15px'}}>{c.label}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px'}}>
          <h3 style={{marginBottom:'20px', fontSize:'16px', fontWeight:'700'}}>Connect to {selected.label}</h3>
          {selected.fields.map(f => (
            <div key={f.key} style={{marginBottom:'16px'}}>
              <label style={{display:'block', fontSize:'13px', color:'#6b6b80', marginBottom:'6px'}}>{f.label}</label>
              <input type={f.type || 'text'} placeholder={f.placeholder}
                value={form[f.key] || ''}
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                style={{width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #2a2a38',
                  background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px', boxSizing:'border-box'}}/>
            </div>
          ))}
          <button onClick={handleConnect} disabled={loading}
            style={{padding:'10px 24px', borderRadius:'8px', border:'none',
              background:'#00e5ff', color:'#000', fontWeight:'700', cursor:'pointer', fontSize:'14px'}}>
            {loading ? 'Connecting...' : 'Connect'}
          </button>

          {error && <div style={{marginTop:'16px', padding:'12px', borderRadius:'8px', background:'rgba(255,50,50,0.1)', color:'#ff5555', fontSize:'13px'}}>❌ {error}</div>}
          {result && (
            <div style={{marginTop:'16px', padding:'12px', borderRadius:'8px', background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)'}}>
              <div style={{color:'#00e5ff', fontWeight:'700', marginBottom:'8px'}}>✅ Connected!</div>
              <pre style={{fontSize:'12px', color:'#a0a0b8', overflow:'auto'}}>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}