/* Interactive demo components — device frames + mock apps */
const { useState, useEffect, useRef } = React;

/* ─── Phone Frame ─────────────────────────────────────── */
function PhoneFrame({ children }) {
  return (
    <div style={{ display:'flex', justifyContent:'center' }}>
      <div style={{
        width:300, height:620, background:'#1c1b1a',
        borderRadius:50, border:'2px solid #2e2c2a',
        position:'relative',
        boxShadow:'0 0 0 1px #0d0c0b, inset 0 0 0 1px #333, 0 40px 80px -20px rgba(0,0,0,.9)',
      }}>
        {/* Side buttons */}
        <div style={{ position:'absolute', left:-4, top:110, width:3, height:28, background:'#2e2c2a', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', left:-4, top:154, width:3, height:46, background:'#2e2c2a', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', left:-4, top:210, width:3, height:46, background:'#2e2c2a', borderRadius:'2px 0 0 2px' }} />
        <div style={{ position:'absolute', right:-4, top:148, width:3, height:64, background:'#2e2c2a', borderRadius:'0 2px 2px 0' }} />
        {/* Screen */}
        <div style={{
          position:'absolute', top:10, left:10, right:10, bottom:10,
          borderRadius:42, overflow:'hidden', background:'#0d0c0b',
        }}>
          {/* Status bar */}
          <div style={{
            height:44, background:'rgba(13,12,11,.97)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 20px', flexShrink:0,
          }}>
            <span style={{ fontSize:12, fontWeight:600, color:'#e5e5e0', fontFamily:'system-ui' }}>9:41</span>
            <div style={{ display:'flex', gap:4, alignItems:'center' }}>
              {[5,8,11,14].map((h,i)=>(
                <div key={i} style={{ width:3, height:h, background: i<3 ? '#e5e5e0':'#3a3a3a', borderRadius:1 }} />
              ))}
              <div style={{ width:15, height:8, border:'1.5px solid #e5e5e0', borderRadius:2, marginLeft:4, position:'relative' }}>
                <div style={{ position:'absolute', top:1, left:1, width:'78%', height:'calc(100% - 2px)', background:'#e5e5e0', borderRadius:1 }} />
                <div style={{ position:'absolute', right:-3, top:'50%', transform:'translateY(-50%)', width:2, height:4, background:'#e5e5e0', borderRadius:1 }} />
              </div>
            </div>
          </div>
          {/* App content */}
          <div style={{ height:'calc(100% - 44px)', overflowY:'auto', overflowX:'hidden' }}>
            {children}
          </div>
        </div>
        {/* Home indicator */}
        <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', width:80, height:4, borderRadius:2, background:'#3a3a3a' }} />
      </div>
    </div>
  );
}

/* ─── Desktop Frame ───────────────────────────────────── */
function DesktopFrame({ children, url }) {
  return (
    <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid #2e2c2a', boxShadow:'0 20px 60px -20px rgba(0,0,0,.8)' }}>
      <div style={{
        background:'#1a1917', padding:'10px 16px',
        display:'flex', alignItems:'center', gap:10,
        borderBottom:'1px solid #1e1d1b',
      }}>
        <div style={{ display:'flex', gap:6 }}>
          <div style={{ width:12, height:12, borderRadius:99, background:'#ff5f56' }} />
          <div style={{ width:12, height:12, borderRadius:99, background:'#ffbd2e' }} />
          <div style={{ width:12, height:12, borderRadius:99, background:'#27c93f' }} />
        </div>
        <div style={{
          flex:1, background:'#111010', borderRadius:6,
          padding:'5px 12px', fontSize:11, color:'#6b6965',
          fontFamily:'monospace', textAlign:'center', letterSpacing:'.01em',
        }}>{url}</div>
      </div>
      <div style={{ height:440, overflow:'hidden', position:'relative' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Cozinhei Demo ───────────────────────────────────── */
const RECIPES = [
  {
    id:1, emoji:'🍗', name:'Frango ao limão siciliano',
    time:'25 min', diff:'Fácil', cal:'320 kcal',
    ingredients:['2 filés de frango','2 limões sicilianos','4 dentes de alho','3 col. azeite','Tomilho a gosto','Sal e pimenta'],
    steps:[
      'Tempere o frango com sal, pimenta e suco de 1 limão. Marine 10 min.',
      'Aqueça o azeite em frigideira em fogo médio-alto.',
      'Grelhe o frango por 6–7 min de cada lado até dourar.',
      'Adicione alho fatiado e tomilho. Regue com o 2º limão.',
      'Tampe e cozinhe mais 5 min. Sirva quente.',
    ],
  },
  {
    id:2, emoji:'🫙', name:'Frango com alho confit',
    time:'40 min', diff:'Médio', cal:'410 kcal',
    ingredients:['2 filés de frango','1 cabeça de alho','4 col. azeite','Tomilho','Alecrim','Sal'],
    steps:[
      'Coloque o alho e o azeite em panelinha em fogo baixo.',
      'Cozinhe 20 min até o alho dourar e amaciar.',
      'Grelhe o frango no azeite do alho até cozinhar.',
      'Finalize com ervas e sirva com o alho confitado.',
    ],
  },
  {
    id:3, emoji:'🥗', name:'Salada quente de frango',
    time:'15 min', diff:'Fácil', cal:'240 kcal',
    ingredients:['1 filé de frango','Mix de folhas','1 limão','Azeite','Sal e pimenta'],
    steps:[
      'Tempere e grelhe o frango por 5 min de cada lado.',
      'Fatie em tiras enquanto quente.',
      'Monte as folhas e coloque o frango por cima.',
      'Regue com azeite e limão. Sirva imediatamente.',
    ],
  },
];

function CozinheiDemo() {
  const [screen, setScreen]     = useState('input');
  const [ingredients, setIngredients] = useState(['frango','alho','limão','azeite']);
  const [input, setInput]       = useState('');
  const [recipe, setRecipe]     = useState(null);

  const addIng = () => {
    const v = input.trim().toLowerCase();
    if(v && !ingredients.includes(v)) setIngredients(i=>[...i,v]);
    setInput('');
  };

  const generate = () => {
    setScreen('loading');
    setTimeout(()=>setScreen('results'), 1600);
  };

  return (
    <PhoneFrame>
      {/* ── Input ── */}
      {screen==='input' && (
        <div style={{ padding:'20px 16px', fontFamily:'system-ui' }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, color:'#f59e0b', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Cozinhei ✦</div>
            <div style={{ fontSize:22, fontWeight:800, color:'#e5e5e0', letterSpacing:'-.03em', lineHeight:1.1 }}>O que tem<br/>na geladeira?</div>
          </div>

          <div style={{ fontSize:10, color:'#6b6965', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Ingredientes · toque para remover</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:14 }}>
            {ingredients.map(ing=>(
              <div key={ing} onClick={()=>setIngredients(i=>i.filter(x=>x!==ing))} style={{
                padding:'6px 11px', borderRadius:99,
                background:'rgba(245,158,11,.12)', border:'1px solid rgba(245,158,11,.28)',
                color:'#f59e0b', fontSize:12, cursor:'pointer', userSelect:'none',
              }}>
                {ing} <span style={{ opacity:.5 }}>×</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addIng()}
              placeholder="adicionar ingrediente..."
              style={{
                flex:1, background:'#1a1917', border:'1px solid #2e2c2a',
                borderRadius:10, padding:'10px 13px',
                color:'#e5e5e0', fontSize:13, fontFamily:'system-ui', outline:'none',
              }}
            />
            <button onClick={addIng} style={{
              width:42, height:42, borderRadius:10,
              background:'#1a1917', border:'1px solid #2e2c2a',
              color:'#f59e0b', fontSize:22, cursor:'pointer',
              display:'grid', placeItems:'center',
            }}>+</button>
          </div>

          {[['⏱','Tempo máximo','30 min'],['👤','Porções','2 pessoas'],['📊','Dificuldade','Fácil']].map(([icon,label,val])=>(
            <div key={label} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:'#141312', border:'1px solid #1e1d1b',
              borderRadius:10, padding:'11px 13px', marginBottom:8,
            }}>
              <span style={{ fontSize:13, color:'#a8a6a0' }}>{icon} {label}</span>
              <span style={{ fontSize:13, color:'#e5e5e0', fontWeight:500 }}>{val}</span>
            </div>
          ))}

          <button onClick={generate} style={{
            marginTop:8, width:'100%', padding:'15px',
            borderRadius:14, background:'#f59e0b', color:'#0a0908',
            fontSize:15, fontWeight:700, border:'none', cursor:'pointer',
          }}>
            ✨ Gerar receitas com IA
          </button>
        </div>
      )}

      {/* ── Loading ── */}
      {screen==='loading' && (
        <div style={{
          height:'100%', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:18,
          fontFamily:'system-ui', padding:24,
        }}>
          <div style={{
            width:52, height:52, borderRadius:99,
            border:'3px solid #1e1d1b', borderTopColor:'#f59e0b',
            animation:'spin .8s linear infinite',
          }} />
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:16, fontWeight:600, color:'#e5e5e0', marginBottom:5 }}>Gerando receitas...</div>
            <div style={{ fontSize:12, color:'#6b6965' }}>IA analisando {ingredients.length} ingredientes</div>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {screen==='results' && (
        <div style={{ padding:'16px', fontFamily:'system-ui' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <button onClick={()=>setScreen('input')} style={{ background:'none', border:'none', color:'#f59e0b', fontSize:20, cursor:'pointer', padding:0, lineHeight:1 }}>←</button>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#e5e5e0' }}>3 receitas encontradas</div>
              <div style={{ fontSize:11, color:'#6b6965' }}>com seus ingredientes</div>
            </div>
          </div>
          {RECIPES.map((r,i)=>(
            <div key={r.id} onClick={()=>{ setRecipe(r); setScreen('detail'); }}
              style={{
                background: i===0 ? '#1f1408' : '#141312',
                border:`1px solid ${i===0 ? 'rgba(245,158,11,.3)' : '#1e1d1b'}`,
                borderRadius:14, padding:'13px', marginBottom:10,
                display:'flex', gap:12, alignItems:'center', cursor:'pointer',
              }}>
              <div style={{ width:46, height:46, borderRadius:12, background:'#232120', display:'grid', placeItems:'center', fontSize:22, flexShrink:0 }}>{r.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#e5e5e0', marginBottom:3 }}>{r.name}</div>
                <div style={{ fontSize:11, color:'#6b6965' }}>{r.time} · {r.diff} · {r.cal}</div>
              </div>
              <span style={{ color: i===0 ? '#f59e0b':'#3a3a3a', fontSize:18 }}>›</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail ── */}
      {screen==='detail' && recipe && (
        <div style={{ fontFamily:'system-ui' }}>
          <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setScreen('results')} style={{ background:'none', border:'none', color:'#f59e0b', fontSize:20, cursor:'pointer', padding:0 }}>←</button>
            <span style={{ fontSize:13, color:'#6b6965' }}>receitas</span>
          </div>
          <div style={{ textAlign:'center', padding:'12px 16px 16px' }}>
            <div style={{ fontSize:52 }}>{recipe.emoji}</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#e5e5e0', letterSpacing:'-.02em', marginBottom:4, marginTop:8 }}>{recipe.name}</div>
            <div style={{ fontSize:12, color:'#6b6965' }}>{recipe.time} · {recipe.diff} · {recipe.cal}</div>
          </div>
          <div style={{ padding:'0 16px 14px' }}>
            <div style={{ fontSize:10, color:'#6b6965', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Ingredientes</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {recipe.ingredients.map(ing=>(
                <span key={ing} style={{ fontSize:11, padding:'4px 10px', borderRadius:99, border:'1px solid #2e2c2a', color:'#a8a6a0', background:'#141312' }}>{ing}</span>
              ))}
            </div>
          </div>
          <div style={{ padding:'0 16px 24px' }}>
            <div style={{ fontSize:10, color:'#6b6965', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Modo de preparo</div>
            {recipe.steps.map((step,i)=>(
              <div key={i} style={{ display:'flex', gap:10, marginBottom:12 }}>
                <span style={{ width:20, height:20, borderRadius:99, background:'#f59e0b', color:'#0a0908', fontSize:10, fontWeight:700, display:'grid', placeItems:'center', flexShrink:0, marginTop:2 }}>{i+1}</span>
                <p style={{ fontSize:12, color:'#a8a6a0', lineHeight:1.65, margin:0 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

/* ─── Qualyra Demo ────────────────────────────────────── */
const NC_DATA = [
  { id:1, title:'Falha no processo de esterilização',    status:'ABERTO',        resp:'Ana Lima',  date:'05/05' },
  { id:2, title:'Desvio de temperatura — câmara fria',   status:'EM ANDAMENTO',  resp:'Carlos M.', date:'04/05' },
  { id:3, title:'NC em lote #4521 — fornecedor B',       status:'RESOLVIDO',     resp:'Pedro S.',  date:'03/05' },
  { id:4, title:'Documentação incompleta — auditoria Q3',status:'ABERTO',        resp:'Maria J.',  date:'02/05' },
  { id:5, title:'Calibração vencida — equipamento #3',   status:'EM ANDAMENTO',  resp:'Ana Lima',  date:'01/05' },
  { id:6, title:'Reclamação cliente — produto devolvido',status:'FECHADO',       resp:'Carlos M.', date:'28/04' },
];

const STATUS_CFG = {
  'ABERTO':       { bg:'rgba(239,68,68,.12)',    color:'#ef4444', next:'EM ANDAMENTO' },
  'EM ANDAMENTO': { bg:'rgba(245,158,11,.12)',   color:'#f59e0b', next:'RESOLVIDO'    },
  'RESOLVIDO':    { bg:'rgba(34,197,94,.12)',    color:'#22c55e', next:'FECHADO'      },
  'FECHADO':      { bg:'rgba(107,105,101,.15)', color:'#6b6965', next:null            },
};

function QualyraDemo() {
  const [ncs, setNcs]     = useState(NC_DATA);
  const [active, setActive] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [nav, setNav]       = useState('ncs');

  const open = (nc) => { setActive(nc); setComment(''); };
  const close = ()  => setActive(null);

  const advance = (id) => {
    setNcs(prev => prev.map(n => {
      if(n.id !== id) return n;
      const next = STATUS_CFG[n.status].next;
      return next ? { ...n, status:next } : n;
    }));
    setActive(prev => {
      if(!prev || prev.id !== id) return prev;
      const next = STATUS_CFG[prev.status].next;
      return next ? { ...prev, status:next } : prev;
    });
  };

  const addComment = () => {
    if(!comment.trim()) return;
    setComments(c=>[...c, { id:Date.now(), text:comment, author:'Você', time:'agora' }]);
    setComment('');
  };

  const stats = {
    ABERTO:        ncs.filter(n=>n.status==='ABERTO').length,
    'EM ANDAMENTO':ncs.filter(n=>n.status==='EM ANDAMENTO').length,
    RESOLVIDO:     ncs.filter(n=>n.status==='RESOLVIDO').length,
    FECHADO:       ncs.filter(n=>n.status==='FECHADO').length,
  };

  return (
    <DesktopFrame url="qualyra.app/dashboard">
      <div style={{ display:'flex', height:'100%', fontFamily:'system-ui', fontSize:13 }}>

        {/* Sidebar */}
        <div style={{ width:172, background:'#111010', borderRight:'1px solid #1e1d1b', display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ padding:'16px 14px 12px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:'#6366f1', display:'grid', placeItems:'center', color:'white', fontSize:12, fontWeight:700 }}>Q</div>
            <span style={{ fontWeight:600, color:'#e5e5e0', fontSize:13 }}>Qualyra</span>
          </div>
          {[
            ['dashboard','Dashboard','▦'],
            ['ncs','Não-conformidades','≡'],
            ['users','Usuários','◎'],
            ['reports','Relatórios','↗'],
          ].map(([id,label,icon])=>(
            <div key={id} onClick={()=>{ setNav(id); setActive(null); }} style={{
              margin:'2px 8px', padding:'8px 10px', borderRadius:7,
              background: nav===id ? '#1e1d1b' : 'transparent',
              color: nav===id ? '#e5e5e0' : '#6b6965',
              cursor:'pointer', display:'flex', alignItems:'center', gap:8,
              transition:'background .15s',
            }}>
              <span style={{ fontSize:12 }}>{icon}</span>
              <span style={{ fontSize:12 }}>{label}</span>
            </div>
          ))}
          <div style={{ flex:1 }} />
          <div style={{ margin:'8px', padding:'8px 10px', borderRadius:7, background:'#1a1917', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:20, height:20, borderRadius:99, background:'#6366f1', display:'grid', placeItems:'center', color:'white', fontSize:9, fontWeight:700 }}>G</div>
            <div>
              <div style={{ fontSize:11, color:'#e5e5e0', fontWeight:500 }}>Guilherme</div>
              <div style={{ fontSize:10, color:'#6b6965' }}>Admin</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>

          {/* Dashboard view */}
          {nav==='dashboard' && !active && (
            <div style={{ padding:'16px', overflowY:'auto', height:'100%' }}>
              <div style={{ fontSize:16, fontWeight:600, color:'#e5e5e0', marginBottom:4 }}>Dashboard</div>
              <div style={{ fontSize:11, color:'#6b6965', marginBottom:16 }}>Visão geral · maio 2026</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
                {[
                  ['ABERTAS',        stats['ABERTO'],        '#ef4444'],
                  ['EM ANDAMENTO',   stats['EM ANDAMENTO'],  '#f59e0b'],
                  ['RESOLVIDAS',     stats['RESOLVIDO'],     '#22c55e'],
                  ['FECHADAS',       stats['FECHADO'],       '#6b6965'],
                ].map(([label,val,color])=>(
                  <div key={label} style={{ background:'#141312', border:'1px solid #1e1d1b', borderRadius:8, padding:'12px' }}>
                    <div style={{ fontSize:9, color:'#6b6965', letterSpacing:'.08em', marginBottom:6 }}>{label}</div>
                    <div style={{ fontSize:26, fontWeight:700, color, lineHeight:1 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:'#6b6965', marginBottom:8 }}>Recentes</div>
              {ncs.slice(0,3).map(nc=>(
                <div key={nc.id} onClick={()=>{ setNav('ncs'); open(nc); }} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px', borderRadius:8, background:'#141312',
                  border:'1px solid #1e1d1b', marginBottom:6, cursor:'pointer',
                }}>
                  <span style={{
                    fontSize:9, padding:'3px 7px', borderRadius:4,
                    background:STATUS_CFG[nc.status].bg, color:STATUS_CFG[nc.status].color,
                    fontWeight:600, letterSpacing:'.04em', whiteSpace:'nowrap',
                  }}>{nc.status}</span>
                  <span style={{ color:'#a8a6a0', fontSize:12, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{nc.title}</span>
                  <span style={{ color:'#6b6965', fontSize:11 }}>{nc.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* NC list view */}
          {nav==='ncs' && !active && (
            <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
              <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid #1e1d1b', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#e5e5e0' }}>Não-conformidades</div>
                  <div style={{ fontSize:10, color:'#6b6965' }}>{ncs.length} registros</div>
                </div>
                <button style={{
                  padding:'6px 12px', borderRadius:7, background:'#f59e0b',
                  color:'#0a0908', border:'none', fontSize:11, fontWeight:600, cursor:'pointer',
                }}>+ Nova NC</button>
              </div>
              <div style={{ flex:1, overflowY:'auto' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 80px 50px', padding:'6px 16px', borderBottom:'1px solid #1e1d1b' }}>
                  {['Título','Status','Resp.','Data'].map(h=>(
                    <span key={h} style={{ fontSize:9, color:'#6b6965', letterSpacing:'.08em', textTransform:'uppercase' }}>{h}</span>
                  ))}
                </div>
                {ncs.map(nc=>(
                  <div key={nc.id} onClick={()=>open(nc)} style={{
                    display:'grid', gridTemplateColumns:'1fr 100px 80px 50px',
                    padding:'10px 16px', borderBottom:'1px solid #1e1d1b',
                    cursor:'pointer', transition:'background .15s',
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background='#1a1917'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <span style={{ color:'#e5e5e0', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{nc.title}</span>
                    <span style={{
                      fontSize:9, padding:'3px 7px', borderRadius:4, height:'fit-content',
                      background:STATUS_CFG[nc.status].bg, color:STATUS_CFG[nc.status].color,
                      fontWeight:600, letterSpacing:'.04em', whiteSpace:'nowrap', width:'fit-content',
                    }}>{nc.status}</span>
                    <span style={{ color:'#a8a6a0', fontSize:11 }}>{nc.resp}</span>
                    <span style={{ color:'#6b6965', fontSize:11 }}>{nc.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NC detail panel */}
          {active && (
            <div style={{ display:'flex', flexDirection:'column', height:'100%', overflowY:'auto' }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid #1e1d1b', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <button onClick={close} style={{ background:'none', border:'none', color:'#f59e0b', fontSize:16, cursor:'pointer', padding:0 }}>←</button>
                <span style={{ fontSize:11, color:'#6b6965' }}>non-conformidade #{active.id}</span>
              </div>
              <div style={{ padding:'16px', flex:1, overflowY:'auto' }}>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:'#e5e5e0', marginBottom:8, lineHeight:1.3 }}>{active.title}</div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{
                      fontSize:10, padding:'4px 10px', borderRadius:99,
                      background:STATUS_CFG[active.status].bg, color:STATUS_CFG[active.status].color,
                      fontWeight:600, letterSpacing:'.04em',
                    }}>{active.status}</span>
                    <span style={{ fontSize:11, color:'#6b6965' }}>Responsável: <span style={{ color:'#a8a6a0' }}>{active.resp}</span></span>
                    <span style={{ fontSize:11, color:'#6b6965' }}>{active.date}</span>
                  </div>
                </div>

                {/* Workflow */}
                <div style={{ background:'#141312', border:'1px solid #1e1d1b', borderRadius:10, padding:'12px', marginBottom:14 }}>
                  <div style={{ fontSize:10, color:'#6b6965', letterSpacing:'.08em', marginBottom:10 }}>FLUXO</div>
                  <div style={{ display:'flex', alignItems:'center', gap:0 }}>
                    {['ABERTO','EM ANDAMENTO','RESOLVIDO','FECHADO'].map((s,i,arr)=>{
                      const cfg = STATUS_CFG[s];
                      const statuses = ['ABERTO','EM ANDAMENTO','RESOLVIDO','FECHADO'];
                      const currentIdx = statuses.indexOf(active.status);
                      const thisIdx = statuses.indexOf(s);
                      const done = thisIdx <= currentIdx;
                      return (
                        <React.Fragment key={s}>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                            <div style={{
                              width:18, height:18, borderRadius:99,
                              background: done ? cfg.color : '#1e1d1b',
                              border:`2px solid ${done ? cfg.color : '#2e2c2a'}`,
                              display:'grid', placeItems:'center',
                              fontSize:9, color: done ? '#0a0908' : '#6b6965', fontWeight:700,
                            }}>{done ? '✓' : i+1}</div>
                            <span style={{ fontSize:8, color: done ? cfg.color : '#6b6965', letterSpacing:'.04em', textAlign:'center', maxWidth:48 }}>{s}</span>
                          </div>
                          {i < arr.length-1 && (
                            <div style={{ flex:1, height:2, background: thisIdx < currentIdx ? STATUS_CFG[arr[i+1]].color : '#1e1d1b', margin:'0 4px', marginBottom:14 }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {STATUS_CFG[active.status].next && (
                    <button onClick={()=>advance(active.id)} style={{
                      marginTop:12, width:'100%', padding:'8px',
                      borderRadius:7, background:'rgba(245,158,11,.1)',
                      border:'1px solid rgba(245,158,11,.3)', color:'#f59e0b',
                      fontSize:11, fontWeight:600, cursor:'pointer',
                    }}>
                      Avançar para {STATUS_CFG[active.status].next} →
                    </button>
                  )}
                </div>

                {/* Comments */}
                <div style={{ background:'#141312', border:'1px solid #1e1d1b', borderRadius:10, padding:'12px' }}>
                  <div style={{ fontSize:10, color:'#6b6965', letterSpacing:'.08em', marginBottom:10 }}>COMENTÁRIOS</div>
                  {comments.length === 0 && (
                    <div style={{ fontSize:11, color:'#6b6965', textAlign:'center', padding:'10px 0', marginBottom:8 }}>Nenhum comentário ainda.</div>
                  )}
                  {comments.map(c=>(
                    <div key={c.id} style={{ marginBottom:8, padding:'8px 10px', background:'#1a1917', borderRadius:7 }}>
                      <div style={{ fontSize:10, color:'#f59e0b', fontWeight:600, marginBottom:3 }}>{c.author} · {c.time}</div>
                      <div style={{ fontSize:12, color:'#a8a6a0' }}>{c.text}</div>
                    </div>
                  ))}
                  <div style={{ display:'flex', gap:8, marginTop:6 }}>
                    <input value={comment} onChange={e=>setComment(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&addComment()}
                      placeholder="adicionar comentário..."
                      style={{
                        flex:1, background:'#111010', border:'1px solid #2e2c2a',
                        borderRadius:7, padding:'8px 10px',
                        color:'#e5e5e0', fontSize:12, fontFamily:'system-ui', outline:'none',
                      }}
                    />
                    <button onClick={addComment} style={{
                      padding:'8px 12px', borderRadius:7,
                      background:'#f59e0b', color:'#0a0908',
                      border:'none', fontSize:12, fontWeight:600, cursor:'pointer',
                    }}>↑</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other views placeholder */}
          {(nav==='users'||nav==='reports') && !active && (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#6b6965', fontSize:13 }}>
              {nav==='users' ? 'Gestão de usuários' : 'Relatórios e exportações'} — em breve
            </div>
          )}
        </div>
      </div>
    </DesktopFrame>
  );
}

/* ─── FinFlow Demo ────────────────────────────────────── */
const TXNS = [
  { id:1, cat:'🛒', label:'Mercado Extra',   amount:-180.50, date:'hoje'  },
  { id:2, cat:'💡', label:'Conta de luz',    amount:-95.00,  date:'ontem' },
  { id:3, cat:'💰', label:'Salário',         amount:5200.00, date:'01/05' },
  { id:4, cat:'🍕', label:'iFood',           amount:-42.90,  date:'30/04' },
  { id:5, cat:'🚗', label:'Uber',            amount:-23.00,  date:'29/04' },
  { id:6, cat:'📱', label:'Spotify',         amount:-21.90,  date:'28/04' },
];

function FinFlowDemo() {
  const [screen, setScreen] = useState('home');
  const [txns, setTxns]     = useState(TXNS);
  const [form, setForm]     = useState({ label:'', amount:'', cat:'🛒', type:'expense' });

  const balance  = txns.reduce((s,t)=>s+t.amount, 0);
  const income   = txns.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount, 0);
  const expenses = txns.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount), 0);

  const add = () => {
    if(!form.label||!form.amount) return;
    const amt = form.type==='expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
    setTxns(t=>[{ id:Date.now(), cat:form.cat, label:form.label, amount:amt, date:'agora' },...t]);
    setForm({ label:'', amount:'', cat:'🛒', type:'expense' });
    setScreen('home');
  };

  const fmt = (n) => n.toLocaleString('pt-BR',{ minimumFractionDigits:2 });

  return (
    <PhoneFrame>
      {screen==='home' && (
        <div style={{ fontFamily:'system-ui' }}>
          <div style={{ background:'linear-gradient(135deg,#1f1408,#2a1a0a)', padding:'20px 16px 24px' }}>
            <div style={{ fontSize:10, color:'rgba(245,158,11,.7)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Saldo total · maio</div>
            <div style={{ fontSize:32, fontWeight:800, color:'#e5e5e0', letterSpacing:'-.03em', marginBottom:16 }}>R$ {fmt(balance)}</div>
            <div style={{ display:'flex', gap:20 }}>
              <div>
                <div style={{ fontSize:9, color:'rgba(34,197,94,.7)', letterSpacing:'.08em' }}>↑ ENTRADA</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#22c55e' }}>R$ {fmt(income)}</div>
              </div>
              <div style={{ width:1, background:'rgba(255,255,255,.08)' }} />
              <div>
                <div style={{ fontSize:9, color:'rgba(239,68,68,.7)', letterSpacing:'.08em' }}>↓ SAÍDA</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#ef4444' }}>R$ {fmt(expenses)}</div>
              </div>
            </div>
          </div>

          <div style={{ padding:'14px 16px' }}>
            <div style={{ fontSize:9, color:'#6b6965', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Transações recentes</div>
            {txns.slice(0,7).map(t=>(
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'#1a1917', display:'grid', placeItems:'center', fontSize:18, flexShrink:0 }}>{t.cat}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:'#e5e5e0', fontWeight:500 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:'#6b6965' }}>{t.date}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:t.amount>0?'#22c55e':'#e5e5e0' }}>
                  {t.amount>0?'+':''}R$ {fmt(Math.abs(t.amount))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ position:'sticky', bottom:0, padding:'0 16px 16px', textAlign:'right' }}>
            <button onClick={()=>setScreen('add')} style={{
              width:50, height:50, borderRadius:99, background:'#f59e0b',
              color:'#0a0908', border:'none', fontSize:26, cursor:'pointer',
              display:'inline-grid', placeItems:'center',
              boxShadow:'0 4px 20px rgba(245,158,11,.4)',
            }}>+</button>
          </div>
        </div>
      )}

      {screen==='add' && (
        <div style={{ padding:'16px', fontFamily:'system-ui' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <button onClick={()=>setScreen('home')} style={{ background:'none', border:'none', color:'#f59e0b', fontSize:20, cursor:'pointer', padding:0 }}>←</button>
            <div style={{ fontSize:16, fontWeight:700, color:'#e5e5e0' }}>Nova transação</div>
          </div>

          <div style={{ display:'flex', background:'#141312', borderRadius:10, padding:4, marginBottom:16 }}>
            {['expense','income'].map(t=>(
              <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{
                flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer',
                background:form.type===t?(t==='expense'?'#ef4444':'#22c55e'):'transparent',
                color:form.type===t?'#fff':'#6b6965',
                fontSize:12, fontWeight:600, transition:'all .2s',
              }}>{t==='expense'?'↓ Saída':'↑ Entrada'}</button>
            ))}
          </div>

          <div style={{ fontSize:9, color:'#6b6965', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Categoria</div>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {['🛒','💡','🍕','🚗','📱','💰','🏠','✈️'].map(c=>(
              <button key={c} onClick={()=>setForm(f=>({...f,cat:c}))} style={{
                width:40, height:40, borderRadius:10,
                border:`1px solid ${form.cat===c?'#f59e0b':'#1e1d1b'}`,
                background:form.cat===c?'rgba(245,158,11,.1)':'#141312',
                fontSize:20, cursor:'pointer',
              }}>{c}</button>
            ))}
          </div>

          <input value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))}
            placeholder="Descrição"
            style={{ width:'100%', background:'#141312', border:'1px solid #1e1d1b', borderRadius:10, padding:'12px', color:'#e5e5e0', fontSize:13, fontFamily:'system-ui', outline:'none', marginBottom:10, boxSizing:'border-box' }}
          />
          <input value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
            placeholder="Valor (ex: 45.90)" type="number"
            style={{ width:'100%', background:'#141312', border:'1px solid #1e1d1b', borderRadius:10, padding:'12px', color:'#e5e5e0', fontSize:13, fontFamily:'system-ui', outline:'none', marginBottom:16, boxSizing:'border-box' }}
          />
          <button onClick={add} style={{
            width:'100%', padding:'14px', borderRadius:12, background:'#f59e0b',
            color:'#0a0908', border:'none', fontSize:14, fontWeight:700, cursor:'pointer',
          }}>Adicionar transação</button>
        </div>
      )}
    </PhoneFrame>
  );
}

/* ─── Kanva Demo ──────────────────────────────────────── */
const INIT_BOARD = {
  todo:  [
    { id:1, title:'Configurar CI/CD pipeline',       tag:'DevOps',   priority:'alta',  av:'GU' },
    { id:2, title:'Design sistema de notificações',  tag:'Design',   priority:'média', av:'PM' },
    { id:3, title:'Documentar endpoints da API',     tag:'Docs',     priority:'baixa', av:'GU' },
  ],
  doing: [
    { id:4, title:'Autenticação OAuth 2.0',          tag:'Backend',  priority:'alta',  av:'CB' },
    { id:5, title:'Dashboard de analytics',          tag:'Frontend', priority:'média', av:'GU' },
  ],
  done:  [
    { id:6, title:'Setup do banco de dados',         tag:'Backend',  priority:'alta',  av:'CB' },
    { id:7, title:'Landing page v2',                 tag:'Frontend', priority:'média', av:'GU' },
  ],
};
const PRI = { alta:'#ef4444', média:'#f59e0b', baixa:'#22c55e' };
const AVC = { GU:'#6366f1', PM:'#ec4899', CB:'#f59e0b' };
const COLS = { todo:['A fazer','#6b6965'], doing:['Em progresso','#f59e0b'], done:['Concluído','#22c55e'] };

function KanvaDemo() {
  const [board, setBoard] = useState(INIT_BOARD);
  const [newCard, setNewCard] = useState('');
  const [addingTo, setAddingTo] = useState(null);

  const advance = (card, from) => {
    const order = ['todo','doing','done'];
    const next = order[order.indexOf(from)+1];
    if(!next) return;
    setBoard(b=>({ ...b, [from]:b[from].filter(c=>c.id!==card.id), [next]:[...b[next],card] }));
  };

  const addCard = (col) => {
    if(!newCard.trim()){ setAddingTo(null); return; }
    setBoard(b=>({ ...b, [col]:[...b[col],{ id:Date.now(), title:newCard, tag:'Novo', priority:'média', av:'GU' }] }));
    setNewCard(''); setAddingTo(null);
  };

  return (
    <DesktopFrame url="kanva.app/board/sprint-12">
      <div style={{ height:'100%', display:'flex', flexDirection:'column', fontFamily:'system-ui', background:'#0d0c0b' }}>
        <div style={{ padding:'11px 16px', borderBottom:'1px solid #1e1d1b', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <span style={{ fontSize:14, fontWeight:600, color:'#e5e5e0' }}>Sprint #12</span>
            <span style={{ fontSize:11, color:'#6b6965', marginLeft:10 }}>7–21 mai · {Object.values(board).flat().length} tarefas</span>
          </div>
          <div style={{ display:'flex', gap:5 }}>
            {['GU','PM','CB'].map(a=>(
              <div key={a} style={{ width:26, height:26, borderRadius:99, background:AVC[a], color:'#fff', fontSize:9, fontWeight:700, display:'grid', placeItems:'center' }}>{a}</div>
            ))}
          </div>
        </div>

        <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, padding:'8px', overflow:'hidden' }}>
          {['todo','doing','done'].map(col=>(
            <div key={col} style={{ display:'flex', flexDirection:'column', background:'#111010', borderRadius:10, overflow:'hidden' }}>
              <div style={{ padding:'9px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #1e1d1b', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:7, height:7, borderRadius:99, background:COLS[col][1] }} />
                  <span style={{ fontSize:11, fontWeight:600, color:'#a8a6a0' }}>{COLS[col][0]}</span>
                </div>
                <span style={{ fontSize:9, color:'#6b6965', background:'#1e1d1b', borderRadius:99, padding:'2px 6px' }}>{board[col].length}</span>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'7px' }}>
                {board[col].map(card=>(
                  <div key={card.id} style={{ background:'#1a1917', border:'1px solid #1e1d1b', borderRadius:8, padding:'9px', marginBottom:5 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7 }}>
                      <span style={{ fontSize:11, color:'#e5e5e0', lineHeight:1.4, flex:1, paddingRight:4 }}>{card.title}</span>
                      <div style={{ width:20, height:20, borderRadius:99, background:AVC[card.av]||'#3a3a3a', color:'#fff', fontSize:8, fontWeight:700, display:'grid', placeItems:'center', flexShrink:0 }}>{card.av}</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', gap:4 }}>
                        <span style={{ fontSize:8, padding:'2px 6px', borderRadius:99, background:'#232120', color:'#6b6965' }}>{card.tag}</span>
                        <span style={{ fontSize:8, padding:'2px 6px', borderRadius:99, background:`${PRI[card.priority]}18`, color:PRI[card.priority] }}>{card.priority}</span>
                      </div>
                      {col!=='done' && (
                        <button onClick={()=>advance(card,col)} style={{
                          fontSize:9, padding:'2px 7px', borderRadius:5,
                          background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.2)',
                          color:'#f59e0b', cursor:'pointer',
                        }}>→</button>
                      )}
                    </div>
                  </div>
                ))}

                {addingTo===col ? (
                  <div>
                    <textarea value={newCard} onChange={e=>setNewCard(e.target.value)} autoFocus
                      placeholder="Título da tarefa..."
                      onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();addCard(col);} if(e.key==='Escape')setAddingTo(null); }}
                      style={{ width:'100%', background:'#141312', border:'1px solid #f59e0b', borderRadius:7, padding:'7px', color:'#e5e5e0', fontSize:11, fontFamily:'system-ui', outline:'none', resize:'none', height:54, boxSizing:'border-box' }}
                    />
                    <div style={{ display:'flex', gap:5, marginTop:4 }}>
                      <button onClick={()=>addCard(col)} style={{ flex:1, padding:'5px', borderRadius:6, background:'#f59e0b', color:'#0a0908', border:'none', fontSize:10, fontWeight:700, cursor:'pointer' }}>Adicionar</button>
                      <button onClick={()=>setAddingTo(null)} style={{ padding:'5px 8px', borderRadius:6, background:'#1e1d1b', color:'#6b6965', border:'none', fontSize:10, cursor:'pointer' }}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>setAddingTo(col)} style={{
                    width:'100%', padding:'6px', borderRadius:7,
                    background:'transparent', border:'1px dashed #1e1d1b',
                    color:'#6b6965', fontSize:10, cursor:'pointer',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#2e2c2a';e.currentTarget.style.color='#a8a6a0';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1d1b';e.currentTarget.style.color='#6b6965';}}
                  >+ tarefa</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DesktopFrame>
  );
}

/* ─── PulseAI Demo ────────────────────────────────────── */
const PULSE_DEFAULT = 'Escreva aqui o seu texto e use os botões acima para transformá-lo com inteligência artificial. Você pode melhorar a escrita, resumir ideias longas, expandir um rascunho ou traduzir para o inglês com um único clique.';
const PULSE_RESULTS = {
  melhorar: 'Escreva aqui o seu texto e utilize os botões acima para transformá-lo com inteligência artificial. Aprimore a qualidade da escrita, condense ideias extensas, desenvolva rascunhos iniciais ou realize traduções — tudo com um único clique.',
  resumir:  'Use os botões acima para transformar seu texto com IA: melhore a escrita, resuma, expanda ou traduza com um clique.',
  expandir: 'Escreva aqui o seu texto e use os botões acima para transformá-lo com inteligência artificial. A plataforma oferece um conjunto completo de ferramentas de processamento de linguagem natural: aprimore a qualidade gramatical e estilística de qualquer trecho, condense ideias complexas em versões mais objetivas, expanda rascunhos em textos mais completos e detalhados, ou traduza seu conteúdo para o inglês de forma fluente e contextualizada — tudo com um único clique, sem sair do editor.',
  traduzir: 'Write your text here and use the buttons above to transform it with artificial intelligence. You can improve writing, summarize long ideas, expand a draft, or translate to English — all with a single click.',
};

function PulseAIDemo() {
  const [text, setText]     = useState(PULSE_DEFAULT);
  const [loading, setLoading] = useState(null);
  const [history, setHistory] = useState([]);

  const transform = (action) => {
    setLoading(action);
    setTimeout(()=>{
      setHistory(h=>[text,...h.slice(0,2)]);
      setText(PULSE_RESULTS[action]);
      setLoading(null);
    }, 1200);
  };

  const ACTIONS = [
    { id:'melhorar', label:'✨ Melhorar', color:'#6366f1' },
    { id:'resumir',  label:'📝 Resumir',  color:'#f59e0b' },
    { id:'expandir', label:'🚀 Expandir', color:'#22c55e' },
    { id:'traduzir', label:'🌐 Traduzir', color:'#ec4899' },
  ];

  return (
    <DesktopFrame url="pulseai.app/editor">
      <div style={{ height:'100%', display:'flex', flexDirection:'column', fontFamily:'system-ui', background:'#0d0c0b' }}>
        <div style={{ padding:'9px 14px', borderBottom:'1px solid #1e1d1b', display:'flex', alignItems:'center', gap:7, flexShrink:0, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, fontWeight:700, color:'#e5e5e0', marginRight:4 }}>PulseAI</span>
          <div style={{ width:1, height:14, background:'#1e1d1b' }} />
          {ACTIONS.map(a=>(
            <button key={a.id} onClick={()=>!loading&&transform(a.id)} style={{
              padding:'5px 11px', borderRadius:7,
              background:loading===a.id?`${a.color}18`:'#141312',
              border:`1px solid ${loading===a.id?a.color:'#1e1d1b'}`,
              color:loading===a.id?a.color:'#a8a6a0',
              fontSize:11, cursor:loading?'not-allowed':'pointer',
              display:'flex', alignItems:'center', gap:5, transition:'all .2s',
            }}
              onMouseEnter={e=>{ if(!loading){e.currentTarget.style.borderColor=a.color;e.currentTarget.style.color=a.color;} }}
              onMouseLeave={e=>{ if(loading!==a.id){e.currentTarget.style.borderColor='#1e1d1b';e.currentTarget.style.color='#a8a6a0';} }}
            >
              {loading===a.id && <span style={{ width:9, height:9, borderRadius:99, border:'1.5px solid currentColor', borderTopColor:'transparent', display:'inline-block', animation:'spin .7s linear infinite' }} />}
              {a.label}
            </button>
          ))}
          <div style={{ flex:1 }} />
          {history.length>0 && (
            <button onClick={()=>{ setText(history[0]); setHistory(h=>h.slice(1)); }} style={{ padding:'5px 9px', borderRadius:7, background:'#141312', border:'1px solid #1e1d1b', color:'#6b6965', fontSize:10, cursor:'pointer' }}>↩ Desfazer</button>
          )}
          <span style={{ fontSize:10, color:'#6b6965' }}>{text.length} chars</span>
        </div>

        <div style={{ flex:1, position:'relative' }}>
          {loading && (
            <div style={{ position:'absolute', inset:0, background:'rgba(13,12,11,.65)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, zIndex:10, backdropFilter:'blur(2px)' }}>
              <div style={{ width:16, height:16, borderRadius:99, border:'2px solid #3a3a3a', borderTopColor:'#f59e0b', animation:'spin .8s linear infinite' }} />
              <span style={{ fontSize:13, color:'#a8a6a0' }}>Processando com IA...</span>
            </div>
          )}
          <textarea value={text} onChange={e=>setText(e.target.value)} style={{
            width:'100%', height:'100%', padding:'20px 24px',
            background:'transparent', border:'none', outline:'none',
            color:'#e5e5e0', fontSize:14, fontFamily:'Georgia,serif',
            lineHeight:1.85, resize:'none', boxSizing:'border-box',
          }} />
        </div>

        <div style={{ padding:'5px 14px', borderTop:'1px solid #1e1d1b', display:'flex', gap:16 }}>
          <span style={{ fontSize:9, color:'#6b6965' }}>{text.trim().split(/\s+/).filter(Boolean).length} palavras</span>
          <span style={{ fontSize:9, color:'#6b6965' }}>{text.length} caracteres</span>
        </div>
      </div>
    </DesktopFrame>
  );
}

/* ─── Agente de Locação Demo ──────────────────────────── */
const CATALOG = [
  { id:'EQ001', name:'Compactador de Solo',  emoji:'🏗️', day:180,  week:700,  month:2200 },
  { id:'EQ002', name:'Betoneira 400L',       emoji:'🔄', day:130,  week:500,  month:1600 },
  { id:'EQ003', name:'Rompedor Elétrico',    emoji:'⚡', day:160,  week:600,  month:1800 },
  { id:'EQ004', name:'Gerador 10KVA',        emoji:'🔌', day:250,  week:950,  month:2800 },
];

const INIT_ORDERS = [
  { id:1, client:'Carlos M.', equip:'Compactador de Solo', days:10, total:1800, status:'pendente' },
  { id:2, client:'Ana Lima',  equip:'Gerador 10KVA',       days:7,  total:950,  status:'confirmado' },
  { id:3, client:'Rafael S.', equip:'Betoneira 400L',      days:30, total:1600, status:'confirmado' },
];

function getBotResponse(text, state) {
  const t = text.toLowerCase();
  const fmt = (n) => n.toLocaleString('pt-BR');

  if (/compactador|compactar/.test(t)) {
    const eq = CATALOG[0];
    return `${eq.emoji} *${eq.name}* disponível!\n\nR$ ${fmt(eq.day)}/dia · R$ ${fmt(eq.week)}/sem · R$ ${fmt(eq.month)}/mês\n\nPor quantos dias você precisa?`;
  }
  if (/betoneira|concreto|cimento/.test(t)) {
    const eq = CATALOG[1];
    return `${eq.emoji} *${eq.name}* disponível!\n\nR$ ${fmt(eq.day)}/dia · R$ ${fmt(eq.week)}/sem · R$ ${fmt(eq.month)}/mês\n\nPor quantos dias você precisa?`;
  }
  if (/rompedor|demolição|martele/.test(t)) {
    const eq = CATALOG[2];
    return `${eq.emoji} *${eq.name}* disponível!\n\nR$ ${fmt(eq.day)}/dia · R$ ${fmt(eq.week)}/sem · R$ ${fmt(eq.month)}/mês\n\nPor quantos dias você precisa?`;
  }
  if (/gerador|energia|luz/.test(t)) {
    const eq = CATALOG[3];
    return `${eq.emoji} *${eq.name}* disponível!\n\nR$ ${fmt(eq.day)}/dia · R$ ${fmt(eq.week)}/sem · R$ ${fmt(eq.month)}/mês\n\nPor quantos dias você precisa?`;
  }
  if (/equipamento|catálogo|lista|tem|disponível|alugar/.test(t)) {
    return `👷 Equipamentos disponíveis:\n\n${CATALOG.map(e=>`${e.emoji} ${e.name} — R$ ${fmt(e.day)}/dia`).join('\n')}\n\nQual você precisa?`;
  }
  const dias = text.match(/(\d+)\s*dia/i);
  if (dias && state.lastEquip) {
    const eq = state.lastEquip;
    const n = parseInt(dias[1]);
    const rate = n >= 30 ? eq.month : n >= 7 ? eq.week : eq.day * n;
    const label = n >= 30 ? `${eq.month}/mês` : n >= 7 ? `${Math.ceil(n/7)} sem × R$ ${fmt(eq.week)}` : `${n} dias × R$ ${fmt(eq.day)}`;
    return `🧮 Orçamento calculado!\n\n${label}\n\n*Total: R$ ${fmt(rate)}*\n\nPara confirmar, preciso de:\nNome · CPF/CNPJ · Endereço · Data início`;
  }
  if (/sim|confirmar|quero|fechar|ok/.test(t)) {
    return `✅ Pedido encaminhado para um de nossos vendedores confirmar a entrega!\n\nVocê receberá uma confirmação em breve. 😊`;
  }
  return `Olá! 👷 Posso te ajudar com:\n\n• Ver equipamentos disponíveis\n• Calcular orçamento\n• Abrir um pedido de locação\n\nO que você precisa?`;
}

function AgentLocacaoDemo() {
  const [msgs, setMsgs] = useState([
    { role:'bot', text:'Olá! 👷 Bem-vindo à nossa locadora.\n\nPosso te ajudar com orçamentos e pedidos de locação. O que você precisa?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [lastEquip, setLastEquip] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMsgs(m => [...m, { role:'user', text }]);
    setTyping(true);

    const t = text.toLowerCase();
    let nextEquip = lastEquip;
    if (/compactador/.test(t)) nextEquip = CATALOG[0];
    else if (/betoneira/.test(t)) nextEquip = CATALOG[1];
    else if (/rompedor/.test(t)) nextEquip = CATALOG[2];
    else if (/gerador/.test(t))  nextEquip = CATALOG[3];
    setLastEquip(nextEquip);

    const dias = text.match(/(\d+)\s*dia/i);
    if (dias && nextEquip) {
      const n = parseInt(dias[1]);
      const rate = n >= 30 ? nextEquip.month : n >= 7 ? nextEquip.week : nextEquip.day * n;
      setTimeout(() => {
        setTyping(false);
        setMsgs(m => [...m, { role:'bot', text: getBotResponse(text, { lastEquip: nextEquip }) }]);
        if (/sim|confirmar|quero|ok/.test(text.toLowerCase())) {
          setOrders(o => [{ id: Date.now(), client:'Você', equip: nextEquip.name, days: n, total: rate, status:'pendente' }, ...o]);
        }
      }, 900);
    } else {
      setTimeout(() => {
        setTyping(false);
        const resp = getBotResponse(text, { lastEquip: nextEquip });
        setMsgs(m => [...m, { role:'bot', text: resp }]);
        if (/sim|confirmar|quero|ok/.test(text.toLowerCase()) && nextEquip) {
          setOrders(o => [{ id: Date.now(), client:'Você', equip: nextEquip?.name || 'Equipamento', days:'-', total:'-', status:'pendente' }, ...o]);
        }
      }, 900);
    }
  };

  const fmt = (n) => typeof n === 'number' ? `R$ ${n.toLocaleString('pt-BR')}` : n;

  return (
    <DesktopFrame url="locacao-agente.app/demo">
      <div style={{ display:'flex', height:'100%', fontFamily:'system-ui', fontSize:13 }}>

        {/* LEFT — WhatsApp chat */}
        <div style={{ width:'52%', display:'flex', flexDirection:'column', borderRight:'1px solid #1e1d1b', background:'#0f0e0d' }}>
          {/* Chat header */}
          <div style={{ padding:'9px 14px', background:'#111010', borderBottom:'1px solid #1e1d1b', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:99, background:'#1a2e1a', border:'1.5px solid #25d366', display:'grid', placeItems:'center', fontSize:14 }}>🏗️</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#e5e5e0' }}>Sua Locadora</div>
              <div style={{ fontSize:10, display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:99, background:'#25d366' }} />
                <span style={{ color:'#25d366' }}>online · agente IA</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'10px 12px', display:'flex', flexDirection:'column', gap:8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'80%', padding:'8px 11px', borderRadius:10,
                  background: m.role==='user' ? '#1a2e1a' : '#1e1d1b',
                  border: `1px solid ${m.role==='user' ? '#1e4a1e' : '#2a2826'}`,
                  fontSize:11, color:'#e5e5e0', lineHeight:1.55,
                  whiteSpace:'pre-wrap',
                }}>
                  {m.text.replace(/\*(.*?)\*/g, '$1')}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', gap:5, padding:'8px 11px', background:'#1e1d1b', border:'1px solid #2a2826', borderRadius:10, width:'fit-content' }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ width:6, height:6, borderRadius:99, background:'#6b6965', animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div style={{ padding:'6px 10px', display:'flex', gap:6, flexWrap:'wrap', borderTop:'1px solid #1e1d1b', background:'#111010' }}>
            {['Ver equipamentos','Compactador','Gerador 10KVA','5 dias'].map(s=>(
              <button key={s} onClick={()=>{ setInput(s); }} style={{
                padding:'4px 10px', borderRadius:99, fontSize:10,
                border:'1px solid #2a2826', background:'#1a1917',
                color:'#a8a6a0', cursor:'pointer',
              }}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding:'8px 10px', borderTop:'1px solid #1e1d1b', display:'flex', gap:8, background:'#111010', flexShrink:0 }}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Mensagem..."
              style={{ flex:1, background:'#1a1917', border:'1px solid #2a2826', borderRadius:20, padding:'8px 14px', color:'#e5e5e0', fontSize:12, fontFamily:'system-ui', outline:'none' }}
            />
            <button onClick={send} style={{ width:34, height:34, borderRadius:99, background:'#25d366', border:'none', color:'#0a0a0a', fontSize:16, fontWeight:700, cursor:'pointer', display:'grid', placeItems:'center' }}>↑</button>
          </div>
        </div>

        {/* RIGHT — Admin panel */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#0d0c0b', overflow:'hidden' }}>
          <div style={{ padding:'9px 14px', borderBottom:'1px solid #1e1d1b', flexShrink:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#e5e5e0' }}>Painel de Pedidos</div>
            <div style={{ fontSize:10, color:'#6b6965' }}>{orders.length} pedidos · admin</div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, padding:'8px 10px', flexShrink:0 }}>
            {[
              [orders.filter(o=>o.status==='pendente').length, 'pendentes', '#f59e0b'],
              [orders.filter(o=>o.status==='confirmado').length, 'confirmados', '#22c55e'],
              [orders.reduce((s,o)=>s+(typeof o.total==='number'?o.total:0),0), 'total mês', '#e5e5e0'],
            ].map(([val,label,color],i)=>(
              <div key={i} style={{ background:'#111010', border:'1px solid #1e1d1b', borderRadius:7, padding:'8px', textAlign:'center' }}>
                <div style={{ fontSize:i===2?11:16, fontWeight:700, color, lineHeight:1 }}>{i===2?`R$ ${val.toLocaleString('pt-BR')}`:val}</div>
                <div style={{ fontSize:9, color:'#6b6965', marginTop:3 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Orders list */}
          <div style={{ flex:1, overflowY:'auto', padding:'0 10px 10px' }}>
            {orders.map((o,i)=>(
              <div key={o.id} style={{ background: i===0&&o.client==='Você'?'#1a1917':'#111010', border:`1px solid ${i===0&&o.client==='Você'?'#f59e0b33':'#1e1d1b'}`, borderRadius:8, padding:'9px 10px', marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:'#e5e5e0' }}>{o.client}</div>
                    <div style={{ fontSize:10, color:'#a8a6a0' }}>{o.equip}</div>
                    <div style={{ fontSize:9, color:'#6b6965' }}>{typeof o.days==='number'?`${o.days} dias`:o.days}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'#e5e5e0', marginBottom:4 }}>{fmt(o.total)}</div>
                    <span style={{
                      fontSize:9, padding:'2px 7px', borderRadius:4, fontWeight:600,
                      background: o.status==='pendente' ? 'rgba(245,158,11,.12)' : 'rgba(34,197,94,.12)',
                      color: o.status==='pendente' ? '#f59e0b' : '#22c55e',
                    }}>{o.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DesktopFrame>
  );
}

Object.assign(window, { CozinheiDemo, QualyraDemo, FinFlowDemo, KanvaDemo, PulseAIDemo, AgentLocacaoDemo });
