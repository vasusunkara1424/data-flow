import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

export default function Teams() {
  const { user } = useUser()
  const [workspaces, setWorkspaces] = useState([])
  const [newName, setNewName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedWs, setSelectedWs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (user) fetchWorkspaces()
  }, [user])

  const fetchWorkspaces = async () => {
    const res = await fetch(`https://dataflow-api-production-7b08.up.railway.app/api/workspaces/${user.id}`)
    const data = await res.json()
    if (data.success) setWorkspaces(data.workspaces)
  }

  const createWorkspace = async () => {
    if (!newName.trim()) return
    setLoading(true)
    const res = await fetch('https://dataflow-api-production-7b08.up.railway.app/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, userId: user.id, email: user.primaryEmailAddress?.emailAddress })
    })
    const data = await res.json()
    if (data.success) {
      setMessage('✅ Workspace created!')
      setNewName('')
      fetchWorkspaces()
    } else {
      setMessage('❌ ' + data.error)
    }
    setLoading(false)
  }

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !selectedWs) return
    setLoading(true)
    const res = await fetch(`https://dataflow-api-production-7b08.up.railway.app/api/workspaces/${selectedWs}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail })
    })
    const data = await res.json()
    setMessage(data.success ? '✅ ' + data.message : '❌ ' + data.error)
    setInviteEmail('')
    setLoading(false)
  }

  return (
    <div style={{padding:'32px', maxWidth:'800px', margin:'0 auto'}}>
      <h2 style={{fontSize:'22px', fontWeight:'800', marginBottom:'4px'}}>👥 Team Workspaces</h2>
      <p style={{color:'#6b6b80', marginBottom:'32px', fontSize:'14px'}}>Create and manage your team workspaces</p>

      {message && (
        <div style={{padding:'12px 16px', borderRadius:'8px', marginBottom:'24px',
          background: message.startsWith('✅') ? 'rgba(0,229,100,0.1)' : 'rgba(255,50,50,0.1)',
          color: message.startsWith('✅') ? '#00e564' : '#ff5555', fontSize:'14px'}}>
          {message}
        </div>
      )}

      {/* Create Workspace */}
      <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px', marginBottom:'24px'}}>
        <h3 style={{fontSize:'15px', fontWeight:'700', marginBottom:'16px'}}>Create New Workspace</h3>
        <div style={{display:'flex', gap:'12px'}}>
          <input value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createWorkspace()}
            placeholder="e.g. Acme Corp, My Startup..."
            style={{flex:1, padding:'10px 14px', borderRadius:'8px', border:'1px solid #2a2a38',
              background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px'}}/>
          <button onClick={createWorkspace} disabled={loading}
            style={{padding:'10px 24px', borderRadius:'8px', border:'none',
              background:'#00e5ff', color:'#000', fontWeight:'700', cursor:'pointer'}}>
            {loading ? '...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Workspaces List */}
      {workspaces.length > 0 && (
        <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px', marginBottom:'24px'}}>
          <h3 style={{fontSize:'15px', fontWeight:'700', marginBottom:'16px'}}>Your Workspaces</h3>
          {workspaces.map(ws => (
            <div key={ws.id} onClick={() => setSelectedWs(ws.id)}
              style={{padding:'14px 16px', borderRadius:'8px', border: selectedWs===ws.id ? '1px solid #00e5ff' : '1px solid #2a2a38',
                background: selectedWs===ws.id ? 'rgba(0,229,255,0.05)' : '#0a0a0f',
                marginBottom:'8px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:'700', fontSize:'14px'}}>{ws.name}</div>
                <div style={{fontSize:'12px', color:'#6b6b80'}}>/{ws.slug}</div>
              </div>
              <span style={{padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700',
                background: ws.role==='owner' ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)',
                color: ws.role==='owner' ? '#00e5ff' : '#6b6b80'}}>
                {ws.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member */}
      {selectedWs && (
        <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px'}}>
          <h3 style={{fontSize:'15px', fontWeight:'700', marginBottom:'16px'}}>Invite Member to Workspace</h3>
          <div style={{display:'flex', gap:'12px'}}>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              placeholder="teammate@email.com"
              style={{flex:1, padding:'10px 14px', borderRadius:'8px', border:'1px solid #2a2a38',
                background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px'}}/>
            <button onClick={inviteMember} disabled={loading}
              style={{padding:'10px 24px', borderRadius:'8px', border:'none',
                background:'#00e5ff', color:'#000', fontWeight:'700', cursor:'pointer'}}>
              {loading ? '...' : 'Invite'}
            </button>
          </div>
        </div>
      )}

      {workspaces.length === 0 && (
        <div style={{textAlign:'center', padding:'48px', color:'#6b6b80'}}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>👥</div>
          <div style={{fontSize:'16px', fontWeight:'700', marginBottom:'8px'}}>No workspaces yet</div>
          <div style={{fontSize:'14px'}}>Create your first workspace above!</div>
        </div>
      )}
    </div>
  )
}
