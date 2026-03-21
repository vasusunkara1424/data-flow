import { useState } from 'react'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [teamName, setTeamName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [loading, setLoading] = useState(false)

  const createTeam = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, ownerEmail })
      })
      const data = await res.json()
      if (data.success) {
        setTeams([...teams, data.team])
        setTeamName('')
        setOwnerEmail('')
      }
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const inviteMember = async () => {
    if (!selectedTeam) return
    try {
      const res = await fetch('http://localhost:4000/api/teams/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: selectedTeam.id, email: inviteEmail })
      })
      const data = await res.json()
      if (data.success) {
        setTeams(teams.map(t => t.id === data.team.id ? data.team : t))
        setSelectedTeam(data.team)
        setInviteEmail('')
      }
    } catch (err) { console.error(err) }
  }

  return (
    <div style={{padding:'32px', maxWidth:'900px', margin:'0 auto'}}>
      <h2 style={{fontSize:'22px', fontWeight:'800', marginBottom:'8px'}}>👥 Team Workspaces</h2>
      <p style={{color:'#6b6b80', marginBottom:'32px', fontSize:'14px'}}>Create teams and invite your teammates</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
        {/* Create Team */}
        <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px'}}>
          <h3 style={{marginBottom:'20px', fontSize:'16px', fontWeight:'700'}}>Create New Team</h3>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', fontSize:'13px', color:'#6b6b80', marginBottom:'6px'}}>Team Name</label>
            <input value={teamName} onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. Engineering"
              style={{width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #2a2a38',
                background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px', boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', fontSize:'13px', color:'#6b6b80', marginBottom:'6px'}}>Your Email</label>
            <input value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)}
              placeholder="you@company.com"
              style={{width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #2a2a38',
                background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px', boxSizing:'border-box'}}/>
          </div>
          <button onClick={createTeam} disabled={loading || !teamName || !ownerEmail}
            style={{padding:'10px 24px', borderRadius:'8px', border:'none',
              background: teamName && ownerEmail ? '#00e5ff' : '#2a2a38',
              color: teamName && ownerEmail ? '#000' : '#6b6b80',
              fontWeight:'700', cursor:'pointer', fontSize:'14px'}}>
            {loading ? 'Creating...' : '+ Create Team'}
          </button>
        </div>

        {/* Teams List */}
        <div style={{background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px'}}>
          <h3 style={{marginBottom:'20px', fontSize:'16px', fontWeight:'700'}}>Your Teams</h3>
          {teams.length === 0 && <p style={{color:'#6b6b80', fontSize:'13px'}}>No teams yet. Create one!</p>}
          {teams.map(team => (
            <div key={team.id} onClick={() => setSelectedTeam(team)}
              style={{padding:'12px', borderRadius:'8px', border: selectedTeam?.id===team.id ? '1px solid #00e5ff' : '1px solid #2a2a38',
                background: selectedTeam?.id===team.id ? 'rgba(0,229,255,0.08)' : 'transparent',
                cursor:'pointer', marginBottom:'8px'}}>
              <div style={{fontWeight:'700', fontSize:'14px'}}>{team.name}</div>
              <div style={{color:'#6b6b80', fontSize:'12px'}}>{team.members.length} member{team.members.length !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Members */}
      {selectedTeam && (
        <div style={{marginTop:'24px', background:'#111118', borderRadius:'12px', border:'1px solid #2a2a38', padding:'24px'}}>
          <h3 style={{marginBottom:'20px', fontSize:'16px', fontWeight:'700'}}>Invite to {selectedTeam.name}</h3>
          <div style={{display:'flex', gap:'12px', marginBottom:'20px'}}>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              placeholder="teammate@company.com"
              style={{flex:1, padding:'10px 14px', borderRadius:'8px', border:'1px solid #2a2a38',
                background:'#0a0a0f', color:'#e8e8f0', fontSize:'14px'}}/>
            <button onClick={inviteMember} disabled={!inviteEmail}
              style={{padding:'10px 24px', borderRadius:'8px', border:'none',
                background: inviteEmail ? '#00e5ff' : '#2a2a38',
                color: inviteEmail ? '#000' : '#6b6b80',
                fontWeight:'700', cursor:'pointer', fontSize:'14px'}}>
              Invite
            </button>
          </div>
          <div>
            {selectedTeam.members.map((m, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid #2a2a38'}}>
                <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,229,255,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', color:'#00e5ff', fontWeight:'700'}}>
                  {m.email[0].toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:'13px', fontWeight:'600'}}>{m.email}</div>
                  <div style={{fontSize:'11px', color:'#6b6b80'}}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}