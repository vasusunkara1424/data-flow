import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import Ingestion from './Ingestion'
import Pipeline from './Pipeline'
import Transform from './Transform'
import Monitor from './Monitor'
import Visualize from './Visualize'

const TABS = [
  { id:'overview',   icon:'⬡', label:'Overview',     sub:'All systems operational' },
  { id:'ingestion',  icon:'↓', label:'Ingestion',    sub:'12 sources connected' },
  { id:'transform',  icon:'⟳', label:'Transform',    sub:'dbt models · 4 active' },
  { id:'monitor',    icon:'◉', label:'Monitoring',   sub:'1 alert requires attention' },
  { id:'visualize',  icon:'▲', label:'Visualize',    sub:'Live dashboards' },
  { id:'catalog',    icon:'▦', label:'Data Catalog', sub:'5 verified tables' },
  { id:'connectors', icon:'⌬', label:'Connectors',   sub:'8 integrations' },
]

export default function App() {
  const [active, setActive] = useState('overview')
  const current = TABS.find(t => t.id === active)

  return (
    <div style={{display:'flex', height:'100vh', overflow:'hidden', background:'#0a0a0f', color:'#e8e8f0', fontFamily:'Syne, sans-serif'}}>

      <aside style={{width:'220px', background:'#111118', borderRight:'1px solid #2a2a38', display:'flex', flexDirection:'column'}}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid #2a2a38', display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#00e5ff,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px'}}>⚡</div>
          <span style={{fontSize:'18px', fontWeight:'800'}}>Data<span style={{color:'#00e5ff'}}>Flow</span></span>
        </div>

        <nav style={{flex:1, padding:'12px 8px'}}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              style={{width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'8px', border:'none', cursor:'pointer', marginBottom:'2px', background: active===tab.id ? 'rgba(0,229,255,0.08)' : 'transparent', color: active===tab.id ? '#00e5ff' : '#6b6b80', fontSize:'13.5px', fontWeight:'500', textAlign:'left'}}>
              <span style={{width:'24px', height:'24px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', background: active===tab.id ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.04)', color: active===tab.id ? '#00e5ff' : '#6b6b80', border: active===tab.id ? '1px solid rgba(0,229,255,0.3)' : '1px solid #2a2a38', textShadow: active===tab.id ? '0 0 8px #00e5ff' : 'none'}}>{tab.icon}</span>
              <span>{tab.label}</span>
              {active===tab.id && <span style={{marginLeft:'auto', width:'6px', height:'6px', borderRadius:'50%', background:'#00e5ff', boxShadow:'0 0 6px #00e5ff'}}></span>}
            </button>
          ))}
        </nav>
      </aside>

      <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        <header style={{height:'56px', background:'#111118', borderBottom:'1px solid #2a2a38', display:'flex', alignItems:'center', padding:'0 24px', gap:'16px'}}>
          <h1 style={{flex:1, fontSize:'16px', fontWeight:'700'}}>
            {current.label}
            <span style={{marginLeft:'8px', fontSize:'13px', fontWeight:'400', color:'#6b6b80'}}>{current.sub}</span>
          </h1>
          <button style={{padding:'7px 14px', borderRadius:'8px', border:'1px solid #2a2a38', background:'transparent', color:'#6b6b80', cursor:'pointer', fontSize:'13px', fontWeight:'600'}}>+ Pipeline</button>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{padding:'7px 14px', borderRadius:'8px', border:'none', background:'#00e5ff', color:'#000', cursor:'pointer', fontSize:'13px', fontWeight:'600', boxShadow:'0 0 20px rgba(0,229,255,0.3)'}}>Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
        </header>

        <main style={{flex:1, background:'#0a0a0f', overflow:'auto'}}>
          {active === 'overview'   && <Pipeline />}
          {active === 'ingestion'  && <Ingestion />}
          {active === 'transform'  && <Transform />}
          {active === 'monitor'    && <Monitor />}
          {active === 'visualize'  && <Visualize />}
          {active !== 'overview' && active !== 'ingestion' && active !== 'transform' && active !== 'monitor' && active !== 'visualize' && (
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>
              <div style={{textAlign:'center', color:'#6b6b80'}}>
                <div style={{fontSize:'48px', marginBottom:'16px', color:'#00e5ff'}}>{current.icon}</div>
                <div style={{fontFamily:'monospace', fontSize:'14px'}}>{current.label} — coming soon</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}