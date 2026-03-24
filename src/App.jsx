import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import Landing from './Landing'
import Ingestion from './Ingestion'
import Pipeline from './Pipeline'
import Transform from './Transform'
import Monitor from './Monitor'
import Visualize from './Visualize'
import AI from './AI'
import Connectors from './Connectors'
import Overview from "./Overview"
import Teams from "./Teams"

const TABS = [
  { id:'overview',   icon:'⬡', label:'Overview',     sub:'All systems operational' },
  { id:'ingestion',  icon:'↓', label:'Ingestion',    sub:'12 sources connected' },
  { id:'transform',  icon:'⟳', label:'Transform',    sub:'dbt models · 4 active' },
  { id:'monitor',    icon:'◉', label:'Monitoring',   sub:'1 alert requires attention' },
  { id:'visualize',  icon:'▲', label:'Visualize',    sub:'Live dashboards' },
  { id:'catalog',    icon:'▦', label:'Data Catalog', sub:'5 verified tables' },
  { id:'connectors', icon:'⌬', label:'Connectors',   sub:'8 integrations' },
  { id:'teams', icon:'👥', label:'Teams', sub:'Manage your workspace' },

]

export default function App() {
  const [active, setActive] = useState('overview')
  const current = TABS.find(t => t.id === active)

  return (
    <>
    <SignedOut><Landing /></SignedOut>
    <SignedIn>
    <div style={{display:'flex', height:'100vh', overflow:'hidden', background:'#0a0a0f', color:'#e8e8f0', fontFamily:'Syne, sans-serif'}}>

      <aside style={{width:'220px', background:'#111118', borderRight:'1px solid #2a2a38', display:'flex', flexDirection:'column'}}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid #2a2a38', display:'flex', alignItems:'center', gap:'10px'}}>
          <svg width='32' height='32' viewBox='0 0 680 420' xmlns='http://www.w3.org/2000/svg'>
    <line x1='100' y1='185' x2='380' y2='185' stroke='#e8e8f0' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='100' y1='172' x2='100' y2='198' stroke='#e8e8f0' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='380' y1='172' x2='380' y2='198' stroke='#e8e8f0' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='230' y1='80' x2='230' y2='290' stroke='#e8e8f0' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='218' y1='80' x2='242' y2='80' stroke='#e8e8f0' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='218' y1='290' x2='242' y2='290' stroke='#e8e8f0' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='100' y1='218' x2='380' y2='218' stroke='#e8e8f0' stroke-width='1.2' opacity='0.5'/>
    <path d='M230,130 C240,160 265,185 230,185 C265,185 240,210 230,240 C220,210 195,185 230,185 C195,185 220,160 230,130Z' fill='#e8e8f0' opacity='0.9'/>
    <circle cx='310' cy='185' r='14' fill='#00e5ff'/>
    <circle cx='310' cy='185' r='6' fill='#080810'/>
  </svg>
  </div>
)}
        </main>
      </div>
    </div>
    </SignedIn>
    </>
  )
}