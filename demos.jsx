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

Object.assign(window, { CozinheiDemo, QualyraDemo });
