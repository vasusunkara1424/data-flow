import { useState } from 'react'

export default function AI() {
  const [prompt, setPrompt] = useState('')
  const [sql, setSql] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateSQL = async () => {
    setLoading(true)
    setError(null)
    setSql('')
    try {
      const res = await fetch('http://localhost:4000/api/ai/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (data.success) setSql(data.sql)
      else setError(data.error)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{padding:'32px', maxWidth:'800px', margin:'0 auto'}}>
      <h2 style={{fontSize:'22px', fontWeight:'800', marginBottom:'8px'}}>🤖 AI Assistant</h2>
      <p style={{color:'#6b6b80', marginBottom:'32px', fontSize:'14px'}}>Describe what you want in plain English</p>

      <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px', marginBottom:'24px'}}>
        <label style={{display:'block', fontSize:'13px', color:'#6b6b80', marginBottom:'8px'}}>What data do you want?</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. Show me all users who signed up last week and made a purchase"
          rows={4}
          style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #2a2a38',
            background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px', boxSizing:'border-box', resize:'vertical'}}
        />
        <button onClick={generateSQL} disabled={loading || !prompt}
          style={{marginTop:'12px', padding:'10px 24px', borderRadius:'8px', border:'none',
            background: prompt ? '#00e5ff' : '#2a2a38', color: prompt ? '#000' : '#6b6b80',
            fontWeight:'700', cursor: prompt ? 'pointer' : 'not-allowed', fontSize:'14px'}}>
          {loading ? '⏳ Generating...' : '✨ Generate SQL'}
        </button>
      </div>

      {error && (
        <div style={{padding:'12px', borderRadius:'8px', background:'rgba(255,50,50,0.1)', color:'#ff5555', fontSize:'13px', marginBottom:'16px'}}>
          ❌ {error}
        </div>
      )}

      {sql && (
        <div style={{background:'#111118', borderRadius:'12px', border:'1px solid rgba(0,229,255,0.3)', padding:'24px'}}>
          <div style={{color:'#00e5ff', fontWeight:'700', marginBottom:'12px'}}>✅ Generated SQL</div>
          <pre style={{background:'#0a0a0f', padding:'16px', borderRadius:'8px', fontSize:'13px',
            color:'#a0f0a0', overflow:'auto', margin:0}}>{sql}</pre>
          <button onClick={() => navigator.clipboard.writeText(sql)}
            style={{marginTop:'12px', padding:'8px 16px', borderRadius:'8px', border:'1px solid #2a2a38',
              background:'transparent', color:'#6b6b80', cursor:'pointer', fontSize:'13px'}}>
            📋 Copy SQL
          </button>
        </div>
      )}
    </div>
  )
}