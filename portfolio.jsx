/* Portfolio components — Guilherme Uriarte */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Hooks ---------- */
function useReveal(){
  useEffect(()=>{
    if(document.body.classList.contains('no-motion')) {
      document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{ threshold:.12, rootMargin:'0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[]);
}

function useScrollY(){
  const [y,setY] = useState(0);
  useEffect(()=>{
    const onScroll = ()=> setY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);
  return y;
}

function useCountUp(target, trigger){
  const [val,setVal] = useState(0);
  useEffect(()=>{
    if(!trigger) return;
    if(document.body.classList.contains('no-motion')){ setVal(target); return; }
    const start = performance.now();
    const dur = 1400;
    let raf;
    const tick = (t)=>{
      const p = Math.min(1, (t-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      setVal(Math.round(target * eased));
      if(p<1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf);
  },[target,trigger]);
  return val;
}

/* ---------- NAV ---------- */
function Nav({ onContact }){
  const y = useScrollY();
  const scrolled = y > 40;
  const [open,setOpen] = useState(false);

  const linkTo = (id)=> (e)=>{
    e.preventDefault();
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    setOpen(false);
  };

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:50,
      padding: scrolled ? '14px 32px' : '24px 32px',
      transition:'padding .35s ease, background .35s ease, backdrop-filter .35s ease, border-color .35s ease',
      background: scrolled ? 'rgba(10,9,8,.72)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(160%) blur(18px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'saturate(160%) blur(18px)' : 'none',
      borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
    }}>
      <div style={{ maxWidth:1440, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24 }}>
        {/* Logo */}
        <a href="#top" onClick={linkTo('top')} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{
            width:34, height:34, borderRadius:10,
            background:'var(--fg)', color:'var(--bg)',
            display:'grid', placeItems:'center',
            fontWeight:800, fontSize:13, letterSpacing:'-.02em'
          }}>GU</span>
          <span style={{ fontSize:14, fontWeight:500, letterSpacing:'-.01em', display:'flex', alignItems:'center', gap:8 }}>
            <span>Guilherme Uriarte</span>
            <span style={{ width:6, height:6, borderRadius:99, background:'var(--accent)', boxShadow:'0 0 14px var(--accent)' }}></span>
          </span>
        </a>

        {/* Center links */}
        <nav className="nav-center" style={{ display:'flex', gap:36, fontSize:14, color:'var(--fg-dim)' }}>
          {[
            ['Sobre','about'],
            ['Serviços','services'],
            ['Projetos','projects'],
            ['Stack','skills'],
          ].map(([label,id])=>(
            <a key={id} href={`#${id}`} onClick={linkTo(id)} style={{ transition:'color .2s' }}
               onMouseEnter={e=>e.currentTarget.style.color='var(--fg)'}
               onMouseLeave={e=>e.currentTarget.style.color='var(--fg-dim)'}>
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button onClick={onContact} style={{
          padding:'10px 20px', borderRadius:99,
          background:'var(--accent)', color:'#0A0908',
          fontSize:14, fontWeight:600, letterSpacing:'-.005em',
          transition:'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 28px -8px rgba(245,158,11,.7)'; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
          Contratar
        </button>
      </div>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero(){
  const heroWords = ["Construo", "produtos", "digitais", "com", "código", "preciso"];
  const [revealed, setRevealed] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(()=>{
    if(document.body.classList.contains('no-motion')){ setRevealed(heroWords.length); return; }
    let i = 0;
    const id = setInterval(()=>{
      i++;
      setRevealed(i);
      if(i >= heroWords.length) clearInterval(id);
    }, 110);
    return ()=> clearInterval(id);
  },[]);

  useEffect(()=>{
    const id = setInterval(()=> setShowCursor(c=>!c), 540);
    return ()=> clearInterval(id);
  },[]);

  return (
    <section id="top" style={{
      minHeight:'100vh', position:'relative',
      padding:'140px 32px 80px',
      display:'flex', flexDirection:'column', justifyContent:'space-between',
    }}>
      {/* faint corner marks */}
      <div className="mono" style={{ position:'absolute', top:120, right:32, fontSize:11, color:'var(--fg-mute)', letterSpacing:'.08em', textTransform:'uppercase', textAlign:'right' }}>
        <div>PORTFOLIO / 2026</div>
        <div style={{ marginTop:4 }}>BRASIL</div>
      </div>

      <div style={{ maxWidth:1440, margin:'120px auto 0', width:'100%', flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        {/* eyebrow */}
        <div className="mono" style={{ display:'flex', alignItems:'center', gap:14, fontSize:12, color:'var(--fg-mute)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:48 }}>
          <span style={{ width:36, height:1, background:'var(--fg-mute)' }}></span>
          <span>Fullstack Developer</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:99, background:'rgba(34,197,94,.08)', color:'#86efac' }}>
            <span style={{ width:6, height:6, borderRadius:99, background:'#22c55e', boxShadow:'0 0 10px #22c55e' }}></span>
            Disponível p/ projetos
          </span>
        </div>

        {/* Massive headline */}
        <h1 style={{
          fontSize:'clamp(56px, 9.2vw, 132px)', lineHeight:.92, letterSpacing:'-.045em',
          fontWeight:700, color:'var(--fg)',
          maxWidth:'14ch'
        }}>
          {heroWords.map((w,i)=>(
            <span key={i} style={{
              display:'inline-block', marginRight:'.22em',
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity .5s cubic-bezier(.2,.7,.2,1), transform .55s cubic-bezier(.2,.7,.2,1)',
              color: w==='preciso' ? 'var(--accent)' : 'inherit',
              fontStyle: w==='preciso' ? 'italic' : 'normal',
              fontWeight: w==='preciso' ? 600 : 700,
            }}>
              {w}
              {w==='preciso' && (
                <span style={{
                  display:'inline-block', width:'.08em', height:'.85em',
                  background:'var(--accent)', marginLeft:'.06em',
                  verticalAlign:'baseline', transform:'translateY(.08em)',
                  opacity: showCursor ? 1 : 0, transition:'opacity .12s',
                  boxShadow:'0 0 18px var(--accent)'
                }}></span>
              )}
            </span>
          ))}
        </h1>

        {/* sub */}
        <div className="reveal d3" style={{
          marginTop:64, display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'end',
        }}>
          <p style={{ fontSize:'clamp(16px, 1.3vw, 19px)', color:'var(--fg-dim)', maxWidth:'48ch', lineHeight:1.55 }}>
            Engenheiro fullstack apaixonado por transformar ideias em produtos que funcionam de verdade — da interface ao banco de dados. Trabalho com startups em fase inicial que precisam de produto, não de PowerPoint.
          </p>
          <div className="mono" style={{ textAlign:'right', fontSize:12, color:'var(--fg-mute)', letterSpacing:'.08em' }}>
            <div>↓ ROLAR</div>
          </div>
        </div>
      </div>

      {/* horizontal rule footer */}
      <div style={{ maxWidth:1440, margin:'80px auto 0', width:'100%', borderTop:'1px solid var(--line)', paddingTop:24, display:'flex', justifyContent:'space-between' }} className="mono">
        <span style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase' }}>v.2026.05 · build estável</span>
        <span style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase' }}>06 seções · uma história</span>
      </div>
    </section>
  );
}

/* ---------- ABOUT ---------- */
function About(){
  const ref = useRef(null);
  const [trigger, setTrigger] = useState(false);
  useEffect(()=>{
    const io = new IntersectionObserver((es)=>{
      es.forEach(e=>{ if(e.isIntersecting){ setTrigger(true); io.disconnect(); } });
    },{ threshold:.4 });
    if(ref.current) io.observe(ref.current);
    return ()=> io.disconnect();
  },[]);

  const years = useCountUp(5, trigger);
  const projects = useCountUp(15, trigger);
  const stacks = useCountUp(3, trigger);
  const platforms = useCountUp(8, trigger);

  return (
    <section id="about" ref={ref} style={{ padding:'180px 32px 160px', position:'relative' }}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>
        {/* Section label */}
        <SectionLabel num="01" label="Sobre" />

        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'min(10vw, 140px)', marginTop:80, alignItems:'start' }}>
          {/* Left: bold quote + photo */}
          <div className="reveal">
            <blockquote style={{
              fontSize:'clamp(36px, 5.4vw, 76px)', lineHeight:1.04, letterSpacing:'-.035em',
              fontWeight:500, color:'var(--fg)',
            }}>
              <span style={{ color:'var(--fg-mute)' }}>"</span>
              Software bom <span style={{ fontStyle:'italic', fontWeight:400, color:'var(--accent)' }}>some</span> da consciência do usuário. É essa a arte que persigo.<span style={{ color:'var(--fg-mute)' }}>"</span>
            </blockquote>

            <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:48, color:'var(--fg-mute)', fontSize:13 }} className="mono">
              <span style={{ width:32, height:1, background:'var(--fg-mute)' }}></span>
              GUILHERME URIARTE
            </div>

            {/* Portrait photo slot */}
            <div style={{ marginTop:40, width:'100%', aspectRatio:'4/3', borderRadius:18, overflow:'hidden', border:'1px solid var(--line)' }}>
              <image-slot
                id="photo-guilherme"
                placeholder="foto: Guilherme Uriarte"
                radius="0"
                style={{ width:'100%', height:'100%', display:'block' }}
              ></image-slot>
            </div>
          </div>

          {/* Right: bio + stats */}
          <div className="reveal d2" style={{ paddingTop:12 }}>
            <p style={{ fontSize:17, lineHeight:1.65, color:'var(--fg-dim)', marginBottom:24 }}>
              Cinco anos construindo produtos do zero — sem nicho fixo, com muita curiosidade. Já trabalhei com saúde, alimentação, finanças e automação. O que muda é o domínio; o que não muda é a obsessão por fazer funcionar de verdade.
            </p>
            <p style={{ fontSize:17, lineHeight:1.65, color:'var(--fg-dim)', marginBottom:48 }}>
              Gosto de projetos onde ainda cabe um humano responsável pelo todo. Código, design, infra, integração — prefiro entregar produto a empurrar ticket.
            </p>

            {/* stats grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'var(--line)', border:'1px solid var(--line)', borderRadius:14, overflow:'hidden' }}>
              {[
                ['anos de experiência', years, '+'],
                ['projetos entregues', projects, '+'],
                ['linguagens no dia a dia', stacks, ''],
                ['plataformas integradas', platforms, '+'],
              ].map(([label,val,suf],i)=>(
                <div key={i} style={{ background:'var(--bg)', padding:'28px 24px' }}>
                  <div style={{ fontSize:'clamp(34px, 3.4vw, 48px)', fontWeight:600, letterSpacing:'-.03em', color:'var(--fg)', lineHeight:1 }}>
                    {val}{suf}
                  </div>
                  <div className="mono" style={{ marginTop:10, fontSize:11, color:'var(--fg-mute)', letterSpacing:'.08em', textTransform:'uppercase' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICES ---------- */
function Services(){
  const items = [
    {
      n:'i', title:'Sites & Landing Pages',
      desc:'Design pixel-perfect, performance real. Next.js, animações com propósito, SEO desde o início. Do Figma ao ar em semanas.',
      tags:['Next.js','Tailwind','Vercel']
    },
    {
      n:'ii', title:'Apps Web & Mobile',
      desc:'Produtos completos com React ou Flutter. Integração de IA quando faz sentido — Claude API, Groq, automações via Z-API.',
      tags:['React','Flutter','IA']
    },
    {
      n:'iii', title:'Sistemas & APIs',
      desc:'Backends que aguentam pressão. Node, FastAPI ou Spring Boot. Autenticação, pagamentos, webhooks, observabilidade.',
      tags:['Node.js','FastAPI','Stripe']
    },
  ];

  return (
    <section id="services" style={{ padding:'160px 32px 160px', background:'var(--bg-2)', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)' }}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>
        <SectionLabel num="02" label="Serviços" />

        <div className="reveal" style={{ marginTop:48, display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'end', marginBottom:80 }}>
          <h2 style={{ fontSize:'clamp(40px, 5.2vw, 72px)', lineHeight:1, letterSpacing:'-.04em', fontWeight:600 }}>
            O que entrego, em <span style={{ color:'var(--accent)' }}>três</span> formatos.
          </h2>
          <p style={{ fontSize:16, lineHeight:1.6, color:'var(--fg-dim)', maxWidth:'42ch' }}>
            Trabalho de forma enxuta: poucos clientes simultâneos, escopos claros, comunicação direta sem intermediários.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:1, background:'var(--line)', border:'1px solid var(--line)', borderRadius:18, overflow:'hidden' }}>
          {items.map((it,i)=>(
            <ServiceCard key={i} {...it} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ n, title, desc, tags, delay }){
  const [hover,setHover] = useState(false);
  return (
    <div className={`reveal d${delay+1}`}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:'var(--bg-2)', padding:'48px 40px 40px',
        position:'relative', overflow:'hidden', minHeight:380,
        display:'flex', flexDirection:'column', justifyContent:'space-between',
        transition:'background .3s',
        cursor:'default',
      }}>
      {/* underline reveal */}
      <div style={{
        position:'absolute', left:40, right:40, top:0,
        height:1, background:'var(--accent)',
        transform:`scaleX(${hover ? 1 : 0})`, transformOrigin:'left',
        transition:'transform .5s cubic-bezier(.2,.7,.2,1)',
      }}></div>

      <div>
        <div className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:32 }}>
          {n.padStart(3,'0')}
        </div>
        <h3 style={{ fontSize:28, lineHeight:1.1, letterSpacing:'-.02em', fontWeight:600, marginBottom:18 }}>
          {title}
        </h3>
        <p style={{ fontSize:15, lineHeight:1.6, color:'var(--fg-dim)' }}>
          {desc}
        </p>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:40 }}>
        {tags.map(t=>(
          <span key={t} className="mono" style={{
            fontSize:11, padding:'5px 10px', borderRadius:99,
            border:'1px solid var(--line-2)', color:'var(--fg-dim)',
            letterSpacing:'.04em',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- PROJECT MODAL ---------- */
function ProjectModal({ project, onClose }){
  const tones = {
    'amber':     { accent:'var(--accent)' },
    'amber-dim': { accent:'#FB923C' },
    'ink':       { accent:'var(--fg)' },
    'warm':      { accent:'#E8B57A' },
  };
  const c = tones[project.tone] || tones.ink;
  const accentColor = c.accent === 'var(--fg)' ? 'var(--fg-dim)' : c.accent;

  useEffect(()=>{
    const onKey = (e)=>{ if(e.key==='Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return ()=>{
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  },[]);

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.82)', backdropFilter:'blur(14px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, animation:'fadeIn .2s ease',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#141210', border:'1px solid #2a2520',
        borderRadius:22, padding:40, maxWidth:820, width:'100%',
        maxHeight:'90vh', overflowY:'auto', position:'relative',
        animation:'slideUp .25s cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* close */}
        <button onClick={onClose} style={{
          position:'absolute', top:18, right:18,
          background:'rgba(255,255,255,.06)', border:'none',
          color:'var(--fg-dim)', fontSize:18, cursor:'pointer',
          width:36, height:36, borderRadius:10, display:'flex',
          alignItems:'center', justifyContent:'center', lineHeight:1,
        }}>✕</button>

        {/* image slot */}
        {project.slot && (
          <div style={{ borderRadius:14, overflow:'hidden', marginBottom:32, height:340 }}>
            <image-slot
              id={`proj-modal-${project.slot}`}
              src={project.preview}
              placeholder={`screenshot: ${project.title}`}
              radius="0"
              style={{ width:'100%', height:'100%', display:'block' }}
            ></image-slot>
          </div>
        )}

        {/* meta */}
        <div style={{ display:'flex', gap:14, marginBottom:18, alignItems:'center' }}>
          <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase' }}>{project.year}</span>
          <span style={{ width:1, height:10, background:'var(--line-2)' }}></span>
          <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.06em' }}>{project.stack}</span>
        </div>

        {/* title */}
        <h3 style={{ fontSize:'clamp(28px,4vw,44px)', letterSpacing:'-.03em', fontWeight:600, marginBottom:8, lineHeight:1.05, color:'var(--fg)' }}>
          {project.title}
          <span style={{ display:'inline-block', marginLeft:10, width:8, height:8, borderRadius:99, background:c.accent }}></span>
        </h3>
        <p style={{ fontSize:16, color:'var(--fg-dim)', marginBottom: project.desc ? 20 : 32, lineHeight:1.5 }}>{project.subtitle}</p>
        {project.desc && (
          <p style={{ fontSize:15, color:'var(--fg-mute)', lineHeight:1.7, marginBottom: project.features ? 24 : 32, maxWidth:'58ch' }}>{project.desc}</p>
        )}

        {project.features && (
          <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
            {project.features.map((f,i)=>(
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'var(--fg-dim)', lineHeight:1.5 }}>
                <span style={{ marginTop:4, width:6, height:6, borderRadius:99, background:accentColor, flexShrink:0 }}></span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* github button */}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'11px 22px', borderRadius:10,
            border:`1px solid ${accentColor}55`,
            color:accentColor, fontSize:13, textDecoration:'none',
            letterSpacing:'.02em', transition:'background .2s',
          }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.05)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >
            Ver no GitHub →
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------- PROJECTS (Bento) ---------- */
function Projects(){
  const [active, setActive] = useState(null);

  return (
    <section id="projects" style={{ padding:'180px 32px 160px' }}>
      {active && <ProjectModal project={active} onClose={()=>setActive(null)} />}

      <div style={{ maxWidth:1440, margin:'0 auto' }}>
        <SectionLabel num="03" label="Projetos selecionados" />

        <div className="reveal" style={{ marginTop:48, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'end', marginBottom:64 }}>
          <h2 style={{ fontSize:'clamp(40px, 5.2vw, 72px)', lineHeight:1, letterSpacing:'-.04em', fontWeight:600, maxWidth:'12ch' }}>
            Um recorte do que construí.
          </h2>
          <a href="https://github.com/uriartegui" target="_blank" rel="noopener noreferrer"
            className="mono" style={{ fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--fg-dim)', borderBottom:'1px solid var(--line-2)', paddingBottom:4 }}>
            Ver GitHub →
          </a>
        </div>

        {/* Bento grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(6, 1fr)',
          gridAutoRows:'200px',
          gap:16,
        }}>
          <ProjectCard
            span="span 4 / span 4" rows="span 2"
            tone="amber" featured
            year="2025" stack="Vite · Spring Boot · PostgreSQL"
            title="Qualyra" subtitle="SaaS de gestão da qualidade — da planilha ao processo rastreável"
            desc="Centraliza não-conformidades com fluxo estruturado, responsabilidades claras e trilha de auditoria completa. Multi-tenant, controle de acesso por papéis e dashboards em tempo real."
            link="https://github.com/uriartegui/qualyra"
            slot="qualyra"
            preview="img/qualyra.svg"
            features={[
              'Fluxo OPEN → IN_PROGRESS → RESOLVED → CLOSED',
              'Controle de acesso por papéis (RBAC)',
              'Isolamento multi-tenant seguro',
              'Trilha de auditoria para conformidade',
              'Dashboards de visibilidade em tempo real',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 2" rows="span 1"
            tone="ink"
            year="2025" stack="Next.js · Claude API"
            title="Cozinhei" subtitle="App de receitas geradas por IA"
            link="https://github.com/uriartegui/cozinhei"
            slot="cozinhei"
            preview="img/cozinhei.svg"
            onOpen={setActive}
          />
          <ProjectCard
            span="span 2" rows="span 1"
            tone="warm"
            year="2025" stack="Next.js · Stripe · Resend"
            title="Cobranças SaaS" subtitle="Sistema de cobranças recorrentes"
            link="https://github.com/uriartegui/cobrancas-saas"
            onOpen={setActive}
          />
          <ProjectCard
            span="span 3" rows="span 2"
            tone="ink"
            year="2024" stack="Next.js · Supabase · OpenAI"
            title="Repution" subtitle="Plataforma de gestão de reputação online"
            desc="Monitora avaliações em tempo real e sugere respostas com IA. Painel centralizado para múltiplas unidades."
            link="https://github.com/uriartegui/repution"
            slot="repution"
            preview="img/repution.svg"
            onOpen={setActive}
          />
          <ProjectCard
            span="span 3" rows="span 1"
            tone="amber-dim"
            year="2024" stack="Robot Framework · Playwright"
            title="Framework QA" subtitle="Suite de automação de testes end-to-end"
            link="https://github.com/uriartegui/framework-qa"
            onOpen={setActive}
          />
          <ProjectCard
            span="span 3" rows="span 1"
            tone="warm"
            year="2024" stack="Next.js · Supabase"
            title="Colmeia" subtitle="Plataforma de gestão para times remotos"
            link="https://github.com/uriartegui/colmeia"
            onOpen={setActive}
          />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ span, rows, tone, year, stack, title, subtitle, desc, features, featured, slot, preview, link, onOpen }){
  const [hover,setHover] = useState(false);
  const tones = {
    'amber':       { bg:'#1F1408', border:'#3a2310', accent:'var(--accent)' },
    'amber-dim':   { bg:'#191210', border:'#2c1f17', accent:'#FB923C' },
    'ink':         { bg:'#121110', border:'#232120', accent:'var(--fg)' },
    'warm':        { bg:'#181513', border:'#27221e', accent:'#E8B57A' },
  };
  const c = tones[tone] || tones.ink;

  const handleClick = ()=>{
    if(onOpen) onOpen({ tone, year, stack, title, subtitle, desc, features, slot, preview, link });
  };

  return (
    <article className="reveal"
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={handleClick}
      style={{
        gridColumn: span, gridRow: rows,
        background: c.bg, border:`1px solid ${c.border}`,
        borderRadius:18, padding: featured ? '36px' : '28px',
        position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column', justifyContent:'space-between',
        transform: hover ? 'translateY(-3px) scale(1.005)' : 'none',
        transition:'transform .45s cubic-bezier(.2,.7,.2,1), border-color .3s, background .3s',
        cursor: onOpen ? 'pointer' : 'default',
      }}>

      {/* meta row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:2 }}>
        <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase' }}>
          {year}
        </span>
        <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.06em', textAlign:'right', maxWidth:'60%' }}>
          {stack}
        </span>
      </div>

      {/* image slot if specified */}
      {slot && (
        <div style={{
          position:'absolute', inset: featured ? '90px 36px 130px' : '60px 28px 110px',
          opacity: featured ? .9 : .55,
          pointerEvents:'none',
        }}>
          <image-slot id={`proj-${slot}`} src={preview} placeholder={`captura: ${title}`} radius="10" style={{ width:'100%', height:'100%', display:'block' }}></image-slot>
        </div>
      )}

      {/* title block */}
      <div style={{ position:'relative', zIndex:2 }}>
        <h3 style={{
          fontSize: featured ? 44 : 24,
          lineHeight:1.05, letterSpacing:'-.03em', fontWeight:600,
          marginBottom:6, color:'var(--fg)',
        }}>
          {title}
          <span style={{
            display:'inline-block', marginLeft:10, width:7, height:7, borderRadius:99,
            background:c.accent,
            transform: hover ? 'scale(1.4)' : 'scale(1)',
            transition:'transform .3s',
          }}></span>
        </h3>
        <p style={{ fontSize: featured ? 16 : 13, color:'var(--fg-dim)', lineHeight:1.5 }}>
          {subtitle}
        </p>
        {desc && (
          <p style={{ fontSize:14, color:'var(--fg-mute)', marginTop:14, lineHeight:1.55, maxWidth:'48ch' }}>
            {desc}
          </p>
        )}
        {/* arrow */}
        {link && (
          <div style={{
            marginTop: featured ? 20 : 14,
            display:'flex', alignItems:'center', gap:8,
            fontSize:13, color: c.accent === 'var(--accent)' ? 'var(--accent)' : 'var(--fg)',
            letterSpacing:'-.005em',
            opacity: hover ? 1 : .7,
            transform: hover ? 'translateX(4px)' : 'none',
            transition:'transform .3s, opacity .3s',
          }}>
            <span>Ver projeto</span>
            <span style={{ fontSize:16 }}>→</span>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- SKILLS ---------- */
function Skills(){
  const groups = [
    { label:'Linguagens', items:[
      { name:'TypeScript', level:95 },
      { name:'Dart', level:80 },
      { name:'Python', level:78 },
      { name:'Java', level:72 },
      { name:'SQL', level:88 },
    ]},
    { label:'Frameworks & Runtime', items:[
      { name:'Next.js / React', level:95 },
      { name:'Node.js', level:88 },
      { name:'Flutter', level:80 },
      { name:'FastAPI', level:78 },
      { name:'Spring Boot', level:75 },
    ]},
    { label:'Infra & Dados', items:[
      { name:'Vercel', level:92 },
      { name:'Supabase', level:90 },
      { name:'PostgreSQL', level:88 },
      { name:'Docker', level:78 },
      { name:'AWS', level:72 },
    ]},
  ];
  const tags = ['Claude API','Groq','Robot Framework','Playwright','Z-API','Stripe','Resend','Tailwind CSS','Prisma','Drizzle','Auth.js','Supabase Auth','GitHub Actions','Figma','Zod','tRPC','Vitest','OpenAI API','Vercel AI SDK','Sanity','Framer Motion','PNPM'];

  return (
    <section id="skills" style={{ padding:'180px 32px 160px', background:'var(--bg-2)', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)' }}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>
        <SectionLabel num="04" label="Stack técnica" />

        <div className="reveal" style={{ marginTop:48, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'end', marginBottom:80 }}>
          <h2 style={{ fontSize:'clamp(40px, 5.2vw, 72px)', lineHeight:1, letterSpacing:'-.04em', fontWeight:600, maxWidth:'14ch' }}>
            Ferramentas que uso quase todos os dias.
          </h2>
          <p className="mono" style={{ fontSize:12, color:'var(--fg-mute)', letterSpacing:'.08em', textTransform:'uppercase', textAlign:'right' }}>
            Atualizado · maio 2026
          </p>
        </div>

        {/* Three columns */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:64 }}>
          {groups.map((g,gi)=>(
            <div key={gi} className={`reveal d${gi+1}`}>
              <div className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:24, paddingBottom:12, borderBottom:'1px solid var(--line)' }}>
                {g.label}
              </div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:18 }}>
                {g.items.map(it=>(
                  <SkillBar key={it.name} {...it} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tag cloud */}
        <div className="reveal" style={{ marginTop:96 }}>
          <div className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:24 }}>
            E também
          </div>
          <div className="tag-marquee" style={{
            display:'flex', flexWrap:'wrap', gap:10,
          }}>
            {tags.map(t=>(
              <span key={t} className="mono" style={{
                fontSize:13, padding:'8px 16px', borderRadius:99,
                border:'1px solid var(--line-2)', color:'var(--fg-dim)',
                background:'var(--bg)',
                transition:'border-color .25s, color .25s, background .25s',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--line-2)'; e.currentTarget.style.color='var(--fg-dim)'; }}
              >{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillBar({ name, level }){
  const ref = useRef(null);
  const [vis,setVis] = useState(false);
  useEffect(()=>{
    const io = new IntersectionObserver((es)=> es.forEach(e=>{ if(e.isIntersecting){ setVis(true); io.disconnect(); }}),{ threshold:.4 });
    if(ref.current) io.observe(ref.current);
    return ()=> io.disconnect();
  },[]);
  return (
    <li ref={ref}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
        <span style={{ fontSize:15, color:'var(--fg)' }}>{name}</span>
        <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.06em' }}>
          {level.toString().padStart(2,'0')}
        </span>
      </div>
      <div style={{ height:2, background:'var(--line)', borderRadius:2, overflow:'hidden' }}>
        <div style={{
          height:'100%', width: vis ? `${level}%` : '0%',
          background: level >= 85 ? 'var(--accent)' : 'var(--fg-dim)',
          transition:'width 1.1s cubic-bezier(.2,.7,.2,1)',
          transitionDelay:'.15s',
          boxShadow: level >= 85 ? '0 0 10px rgba(245,158,11,.5)' : 'none',
        }}></div>
      </div>
    </li>
  );
}

/* ---------- CONTACT ---------- */
function Contact({ formRef }){
  const [state,setState] = useState({ name:'', email:'', message:'', budget:'' });
  const [errors,setErrors] = useState({});
  const [sent,setSent] = useState(false);
  const [sending,setSending] = useState(false);

  const update = (k)=>(e)=> setState(s=>({ ...s, [k]: e.target.value }));

  const submit = (e)=>{
    e.preventDefault();
    const errs = {};
    if(!state.name.trim()) errs.name = 'Diga seu nome';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errs.email = 'Email inválido';
    if(state.message.trim().length < 10) errs.message = 'Conte um pouco mais (10+ chars)';
    setErrors(errs);
    if(Object.keys(errs).length) return;
    setSending(true);
    setTimeout(()=>{ setSending(false); setSent(true); }, 900);
  };

  return (
    <section id="contact" ref={formRef} style={{ padding:'200px 32px 120px', position:'relative' }}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>
        <SectionLabel num="05" label="Contato" />

        <h2 className="reveal" style={{
          marginTop:64, fontSize:'clamp(56px, 11vw, 168px)', lineHeight:.92,
          letterSpacing:'-.05em', fontWeight:600, maxWidth:'14ch',
        }}>
          Vamos construir<br/>
          algo <span style={{ color:'var(--accent)', fontStyle:'italic', fontWeight:500 }}>juntos</span>.
        </h2>

        <div className="reveal d2" style={{
          marginTop:80, display:'grid', gridTemplateColumns:'1fr 1.4fr',
          gap:'min(8vw, 120px)',
        }}>
          {/* Left: links */}
          <div>
            <p style={{ fontSize:18, color:'var(--fg-dim)', lineHeight:1.55, maxWidth:'34ch', marginBottom:48 }}>
              Conte sobre seu projeto. Costumo responder em menos de 24h, em dias úteis.
            </p>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:18 }}>
              {[
                ['Email','guiuriarte@gmail.com','mailto:guiuriarte@gmail.com'],
                ['LinkedIn','/in/guilherme-uriarte','https://linkedin.com/in/guilherme-uriarte'],
                ['GitHub','github.com/uriartegui','https://github.com/uriartegui'],
                ['Localização','Brasil · Remoto',null],
              ].map(([k,v,href])=>(
                <li key={k} style={{ display:'grid', gridTemplateColumns:'120px 1fr', alignItems:'baseline', borderBottom:'1px solid var(--line)', paddingBottom:14 }}>
                  <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase' }}>{k}</span>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{
                      fontSize:16, color:'var(--fg)',
                      transition:'color .2s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--fg)'}
                    >{v}</a>
                  ) : (
                    <span style={{ fontSize:16, color:'var(--fg)' }}>{v}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form */}
          {sent ? (
            <div style={{
              padding:48, border:'1px solid var(--line)', borderRadius:18,
              background:'var(--bg-2)', display:'flex', flexDirection:'column', gap:18,
              minHeight:340, justifyContent:'center',
            }}>
              <div style={{ width:48, height:48, borderRadius:99, background:'var(--accent)', display:'grid', placeItems:'center', color:'#0A0908', fontSize:22, fontWeight:700 }}>✓</div>
              <h3 style={{ fontSize:32, letterSpacing:'-.02em', fontWeight:600 }}>Mensagem enviada.</h3>
              <p style={{ color:'var(--fg-dim)', fontSize:16, lineHeight:1.55 }}>
                Obrigado, {state.name.split(' ')[0]}. Te respondo no email <span style={{ color:'var(--fg)' }}>{state.email}</span> em até 24h úteis.
              </p>
              <button onClick={()=>{ setSent(false); setState({ name:'', email:'', message:'', budget:'' }); }} className="mono" style={{ alignSelf:'flex-start', marginTop:14, fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--fg-dim)', borderBottom:'1px solid var(--line-2)', paddingBottom:3 }}>
                ← Enviar outra
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:0 }} noValidate>
              <Field label="Nome" id="name" value={state.name} onChange={update('name')} error={errors.name} placeholder="Como devo te chamar?" />
              <Field label="Email" id="email" type="email" value={state.email} onChange={update('email')} error={errors.email} placeholder="email@empresa.com" />
              <BudgetSelect value={state.budget} onChange={(v)=>setState(s=>({...s, budget:v}))} />
              <Field label="Projeto" id="message" textarea value={state.message} onChange={update('message')} error={errors.message} placeholder="Conta um pouco do que você precisa construir." />

              <button type="submit" disabled={sending} style={{
                marginTop:32, alignSelf:'flex-start',
                padding:'18px 32px', borderRadius:99,
                background: sending ? 'var(--bg-3)' : 'var(--accent)',
                color: sending ? 'var(--fg-dim)' : '#0A0908',
                fontSize:15, fontWeight:600, letterSpacing:'-.005em',
                display:'inline-flex', alignItems:'center', gap:12,
                transition:'transform .2s, box-shadow .2s, background .2s',
              }}
              onMouseEnter={e=>{ if(!sending){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 40px -12px rgba(245,158,11,.6)'; } }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
              >
                {sending ? 'Enviando...' : 'Enviar mensagem'}
                {!sending && <span style={{ fontSize:18 }}>→</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, value, onChange, error, placeholder, type='text', textarea }){
  const [focus,setFocus] = useState(false);
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div style={{ borderBottom:`1px solid ${error ? 'var(--accent-2)' : 'var(--line)'}`, padding:'24px 0', position:'relative', transition:'border-color .25s' }}>
      <label htmlFor={id} className="mono" style={{
        position:'absolute', top: (focus || value) ? 4 : 30,
        fontSize: (focus || value) ? 10 : 14,
        color: error ? 'var(--accent-2)' : (focus ? 'var(--accent)' : 'var(--fg-mute)'),
        letterSpacing:'.1em', textTransform:'uppercase',
        transition:'all .25s cubic-bezier(.2,.7,.2,1)',
        pointerEvents:'none',
      }}>{label}{error ? ` · ${error}` : ''}</label>
      <Tag
        id={id} type={type} value={value} onChange={onChange}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        placeholder={focus ? placeholder : ''}
        rows={textarea ? 3 : undefined}
        style={{
          width:'100%', background:'transparent', border:'none', outline:'none',
          color:'var(--fg)', fontSize:18, fontFamily:'inherit',
          padding: textarea ? '20px 0 0' : '20px 0 0',
          resize:'none', lineHeight: textarea ? 1.5 : 1,
        }}
      />
    </div>
  );
}

function BudgetSelect({ value, onChange }){
  const opts = ['até R$ 5k','R$ 5k – 15k','R$ 15k – 50k','R$ 50k+'];
  return (
    <div style={{ borderBottom:'1px solid var(--line)', padding:'24px 0' }}>
      <div className="mono" style={{ fontSize:10, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
        Orçamento (opcional)
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {opts.map(o=>(
          <button type="button" key={o} onClick={()=>onChange(value===o ? '' : o)} className="mono" style={{
            padding:'8px 14px', borderRadius:99,
            border:`1px solid ${value===o ? 'var(--accent)' : 'var(--line-2)'}`,
            background: value===o ? 'rgba(245,158,11,.08)' : 'transparent',
            color: value===o ? 'var(--accent)' : 'var(--fg-dim)',
            fontSize:12, transition:'all .2s',
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer(){
  return (
    <footer style={{ padding:'48px 32px 36px', borderTop:'1px solid var(--line)' }}>
      <div style={{ maxWidth:1440, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:32, alignItems:'center' }}>
        <div className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.08em' }}>
          © 2026 GUILHERME URIARTE
        </div>
        <div style={{ textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', gap:8, color:'var(--fg-mute)', fontSize:12 }}>
          Feito com café, no Brasil
          <span style={{ width:5, height:5, borderRadius:99, background:'var(--accent)' }}></span>
        </div>
        <div className="mono" style={{ textAlign:'right', fontSize:11, color:'var(--fg-mute)', letterSpacing:'.08em' }}>
          ↑ <a href="#top" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'});}} style={{ borderBottom:'1px solid var(--line-2)', paddingBottom:2 }}>VOLTAR AO TOPO</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- helpers ---------- */
function SectionLabel({ num, label }){
  return (
    <div className="reveal" style={{ display:'flex', alignItems:'center', gap:14, color:'var(--fg-mute)' }}>
      <span className="mono" style={{ fontSize:11, letterSpacing:'.16em', color:'var(--accent)' }}>—— {num}</span>
      <span className="mono" style={{ fontSize:11, letterSpacing:'.16em', textTransform:'uppercase' }}>{label}</span>
    </div>
  );
}

/* expose to global */
Object.assign(window, { Nav, Hero, About, Services, Projects, Skills, Contact, Footer, useReveal });
