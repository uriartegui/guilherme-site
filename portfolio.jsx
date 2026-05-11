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

/* ---------- MARQUEE STRIP ---------- */
function Marquee({ items, speed = 38, reverse = false }){
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow:'hidden',
      borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)',
      padding:'13px 0', background:'var(--bg)',
    }}>
      <div style={{
        display:'flex', whiteSpace:'nowrap',
        animation:`${reverse ? 'marquee-rev' : 'marquee-fwd'} ${speed}s linear infinite`,
      }}>
        {doubled.map((item,i)=>(
          <span key={i} className="mono" style={{
            display:'inline-flex', alignItems:'center', gap:28,
            fontSize:11, letterSpacing:'.2em', textTransform:'uppercase',
            color:'var(--fg-mute)', padding:'0 28px',
          }}>
            {item}
            <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--accent)', flexShrink:0 }}/>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- CUSTOM CURSOR ---------- */
function CustomCursor(){
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(()=>{
    if(window.matchMedia('(pointer: coarse)').matches) return;
    if(document.body.classList.contains('no-motion')) return;

    document.body.classList.add('has-custom-cursor');

    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;
    let raf;

    const onMove = (e)=>{
      mx = e.clientX; my = e.clientY;
      if(dotRef.current)
        dotRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };

    const onOver = (e)=>{
      const over = !!e.target.closest('a,button,[role="button"],input,textarea,select');
      if(ringRef.current){
        ringRef.current.style.width  = over ? '56px' : '36px';
        ringRef.current.style.height = over ? '56px' : '36px';
        ringRef.current.style.borderColor = over ? 'rgba(245,158,11,.9)' : 'rgba(245,158,11,.5)';
        ringRef.current.style.background   = over ? 'rgba(245,158,11,.06)' : 'transparent';
      }
      if(dotRef.current) dotRef.current.style.opacity = over ? '0' : '1';
    };

    const tick = ()=>{
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if(ringRef.current)
        ringRef.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive:true });
    window.addEventListener('mouseover', onOver, { passive:true });
    raf = requestAnimationFrame(tick);

    return ()=>{
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  },[]);

  return (
    <>
      <div ref={dotRef} style={{
        position:'fixed', top:0, left:0, zIndex:10000,
        width:6, height:6, borderRadius:'50%',
        background:'var(--accent)', pointerEvents:'none',
        boxShadow:'0 0 12px rgba(245,158,11,.6)',
        willChange:'transform', transition:'opacity .15s',
        transform:`translate(${typeof window!=='undefined'?window.innerWidth/2:0}px,${typeof window!=='undefined'?window.innerHeight/2:0}px) translate(-50%,-50%)`,
      }}/>
      <div ref={ringRef} className="cursor-ring-el" style={{
        position:'fixed', top:0, left:0, zIndex:9999,
        width:36, height:36, borderRadius:'50%',
        border:'1px solid rgba(245,158,11,.5)',
        pointerEvents:'none', willChange:'transform',
        mixBlendMode:'difference',
        transition:'width .22s ease, height .22s ease, border-color .22s ease, background .22s ease',
      }}/>
    </>
  );
}

/* ---------- SCROLL PROGRESS ---------- */
function ScrollProgress(){
  const barRef = useRef(null);

  useEffect(()=>{
    const update = ()=>{
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if(barRef.current) barRef.current.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive:true });
    return ()=> window.removeEventListener('scroll', update);
  },[]);

  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, height:2, zIndex:200, background:'rgba(255,255,255,.04)' }}>
      <div ref={barRef} style={{
        height:'100%', width:'0%',
        background:'var(--accent)',
        boxShadow:'0 0 8px var(--accent), 0 0 18px rgba(245,158,11,.4)',
        transition:'width .08s linear',
      }}/>
    </div>
  );
}

/* ---------- NAV ---------- */
function Nav({ onContact }){
  const y = useScrollY();
  const scrolled = y > 40;
  const [open,setOpen] = useState(false);
  const [clock,setClock] = useState('');
  const btnRef = useRef(null);

  useEffect(()=>{
    const tick = ()=>{
      const d = new Date();
      const h = String(d.getHours()).padStart(2,'0');
      const m = String(d.getMinutes()).padStart(2,'0');
      const s = String(d.getSeconds()).padStart(2,'0');
      setClock(`${h}:${m}:${s} BRT`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return ()=> clearInterval(id);
  },[]);

  const linkTo = (id)=> (e)=>{
    e.preventDefault();
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    setOpen(false);
  };

  const onBtnMove = (e)=>{
    const btn = btnRef.current;
    if(!btn || document.body.classList.contains('no-motion')) return;
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.28;
    const y = (e.clientY - r.top  - r.height/2) * 0.28;
    btn.style.transform = `translate(${x}px,${y}px)`;
    btn.style.boxShadow = '0 10px 32px -8px rgba(245,158,11,.75)';
  };
  const onBtnLeave = ()=>{
    const btn = btnRef.current;
    if(!btn) return;
    btn.style.transform = 'none';
    btn.style.boxShadow = 'none';
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

        {/* Clock */}
        {clock && (
          <span className="mono nav-clock" style={{ fontSize:11, letterSpacing:'.16em', color:'var(--fg-mute)', textTransform:'uppercase' }}>
            {clock}
          </span>
        )}

        {/* CTA */}
        <button ref={btnRef} onClick={onContact} style={{
          padding:'10px 20px', borderRadius:99,
          background:'var(--accent)', color:'#0A0908',
          fontSize:14, fontWeight:600, letterSpacing:'-.005em',
          transition:'transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s',
        }}
        onMouseMove={onBtnMove}
        onMouseLeave={onBtnLeave}>
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
      {/* Aurora background — top-left like Augen */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div id="hero-blob1" style={{
          position:'absolute', top:'-10%', left:'-8%',
          width:720, height:720, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(245,158,11,.85), transparent 70%)',
          filter:'blur(120px)', opacity:.5, willChange:'transform',
        }}/>
        <div id="hero-blob2" style={{
          position:'absolute', bottom:'-10%', right:'-6%',
          width:560, height:560, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(245,158,11,.4), transparent 70%)',
          filter:'blur(120px)', opacity:.35, willChange:'transform',
        }}/>
        <div id="hero-blob3" style={{
          position:'absolute', top:'30%', left:'38%',
          width:380, height:380, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,200,120,.3), transparent 70%)',
          filter:'blur(100px)', opacity:.3, willChange:'transform',
        }}/>
      </div>

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
            <span style={{ position:'relative', display:'inline-flex', width:6, height:6 }}>
              <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#22c55e', animation:'pulse-ring 2.4s ease-out infinite' }}></span>
              <span style={{ position:'relative', width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 10px #22c55e' }}></span>
            </span>
            Disponível p/ projetos
          </span>
        </div>

        {/* Massive headline */}
        <h1 id="heroH1" style={{
          fontSize:'clamp(72px, 11vw, 168px)', lineHeight:.88, letterSpacing:'-.048em',
          fontWeight:700, color:'var(--fg)',
        }}>
          {[['Construo'],['produtos','digitais'],['com','código','preciso.']].map((line,li)=>(
            <span key={li} className="hero-line">
              {line.map((w,wi)=>{
                const idx = li===0?wi:li===1?1+wi:3+wi;
                const isAmber = w==='preciso.';
                return (
                  <span key={wi} className="hero-word" style={{
                    marginRight:'.2em',
                    transform: idx < revealed ? 'translateY(0)' : 'translateY(110%)',
                    opacity: idx < revealed ? 1 : 0,
                    transition: `transform .9s cubic-bezier(.22,.61,.36,1) ${idx*.08}s, opacity .9s ease ${idx*.08}s`,
                    color: isAmber ? 'var(--accent)' : 'inherit',
                    fontStyle: isAmber ? 'italic' : 'normal',
                  }}>
                    {w}
                    {isAmber && (
                      <span style={{
                        display:'inline-block', width:'.07em', height:'.82em',
                        background:'var(--accent)', marginLeft:'.05em',
                        verticalAlign:'baseline', transform:'translateY(.1em)',
                        opacity: showCursor ? 1 : 0, transition:'opacity .12s',
                        boxShadow:'0 0 18px var(--accent)'
                      }}/>
                    )}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* sub */}
        <div className="hero-sub reveal d3" style={{ marginTop:56 }}>
          <p style={{ fontSize:'clamp(15px, 1.2vw, 18px)', color:'var(--fg-dim)', maxWidth:'46ch', lineHeight:1.6, marginBottom:48 }}>
            Engenheiro fullstack que transforma ideias em produtos reais — da interface ao banco de dados. Trabalho com startups que precisam de produto, não de PowerPoint.
          </p>
        </div>
      </div>

      {/* hero-bottom metadata row */}
      <div style={{ maxWidth:1440, margin:'0 auto', width:'100%', borderTop:'1px solid var(--line)', paddingTop:28, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
        {[
          ['[ ROLE ]','Senior Fullstack Engineer\nReact · Next.js · Node · Spring Boot'],
          ['[ FOCO ]','Interfaces editoriais, SaaS B2B,\nplataformas de IA e automação'],
          ['[ STATUS ]','Aceitando projetos\npara Q3—Q4 2026'],
        ].map(([k,v])=>(
          <div key={k} className="mono" style={{ fontSize:11 }}>
            <span style={{ display:'block', color:'var(--accent)', letterSpacing:'.16em', marginBottom:8, fontSize:10 }}>{k}</span>
            <span style={{ color:'var(--fg)', fontSize:12, letterSpacing:'.1em', lineHeight:1.7, whiteSpace:'pre-line' }}>{v}</span>
          </div>
        ))}
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
        <SectionLabel num="01" label="Sobre" aside="BIOGRAFIA · 2026" />

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
        <SectionLabel num="02" label="Serviços" aside="O QUE EU FAÇO" />

        <div className="reveal" style={{ marginTop:48, display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'end', marginBottom:80 }}>
          <h2 className="gsap-title" style={{ fontSize:'clamp(40px, 5.2vw, 72px)', lineHeight:1, letterSpacing:'-.04em', fontWeight:600 }}>
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
    'amber':     { accent:'var(--accent)',  tag:'rgba(245,158,11,.12)', tagBorder:'rgba(245,158,11,.25)' },
    'amber-dim': { accent:'#FB923C',        tag:'rgba(251,146,60,.1)',  tagBorder:'rgba(251,146,60,.2)'  },
    'ink':       { accent:'var(--fg)',      tag:'rgba(255,255,255,.06)',tagBorder:'rgba(255,255,255,.12)'},
    'warm':      { accent:'#E8B57A',        tag:'rgba(232,181,122,.1)', tagBorder:'rgba(232,181,122,.2)' },
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

  const SectionLabel = ({ children })=>(
    <div className="mono" style={{
      fontSize:10, letterSpacing:'.12em', textTransform:'uppercase',
      color:'var(--fg-mute)', marginBottom:14,
      display:'flex', alignItems:'center', gap:10,
    }}>
      <span style={{ width:18, height:1, background:'var(--line-2)', display:'inline-block' }}></span>
      {children}
    </div>
  );

  const stackTags = project.stack ? project.stack.split('·').map(s=>s.trim()) : [];

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.82)', backdropFilter:'blur(14px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, animation:'fadeIn .2s ease',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#141210', border:'1px solid #2a2520',
        borderRadius:22, padding:40, maxWidth:1160, width:'100%',
        maxHeight:'92vh', overflowY:'auto', position:'relative',
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

        {/* demo notice */}
        <div style={{
          display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
          marginBottom:28, padding:'9px 16px',
          background:'rgba(245,158,11,.05)', border:'1px solid rgba(245,158,11,.14)',
          borderRadius:10,
        }}>
          <span style={{ color:'var(--accent)', fontSize:11 }}>✦</span>
          <span className="mono" style={{ fontSize:11, color:'var(--fg-dim)', letterSpacing:'.04em' }}>
            demonstração interativa — prévia simplificada do sistema
          </span>
          <span style={{ marginLeft:'auto', fontSize:11, color:'var(--fg-mute)' }}>
            sistema completo disponível mediante contato
          </span>
        </div>

        {/* interactive demo or static preview */}
        {project.demo ? (
          <div style={{ marginBottom:36 }}>
            <project.demo />
          </div>
        ) : project.iframeUrl ? (
          <div style={{ borderRadius:14, overflow:'hidden', marginBottom:36, height:560, border:'1px solid var(--line)', position:'relative' }}>
            <iframe
              src={project.iframeUrl}
              title={project.title}
              style={{
                border:0, display:'block',
                transformOrigin:'top left',
                transform:'scale(0.84)',
                width: Math.round(1080/0.84),
                height: Math.round(560/0.84),
              }}
              loading="lazy"
            />
          </div>
        ) : project.slot && (
          <div style={{ borderRadius:14, overflow:'hidden', marginBottom:36, height:340 }}>
            <image-slot
              id={`proj-modal-${project.slot}`}
              src={project.preview}
              placeholder={`screenshot: ${project.title}`}
              radius="0"
              style={{ width:'100%', height:'100%', display:'block' }}
            ></image-slot>
          </div>
        )}

        {/* title block */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
            <span className="mono" style={{
              fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em',
              textTransform:'uppercase', padding:'3px 9px',
              background:'var(--bg-3)', borderRadius:6,
            }}>{project.year}</span>
            {stackTags.map((tag,i)=>(
              <span key={i} className="mono" style={{
                fontSize:11, color:accentColor, letterSpacing:'.04em',
                padding:'3px 9px', background:c.tag,
                border:`1px solid ${c.tagBorder}`, borderRadius:6,
              }}>{tag}</span>
            ))}
          </div>

          <h3 style={{ fontSize:'clamp(28px,4vw,44px)', letterSpacing:'-.03em', fontWeight:600, marginBottom:8, lineHeight:1.05, color:'var(--fg)' }}>
            {project.title}
            <span style={{ display:'inline-block', marginLeft:10, width:8, height:8, borderRadius:99, background:c.accent }}></span>
          </h3>
          <p style={{ fontSize:16, color:'var(--fg-dim)', lineHeight:1.5, marginBottom: project.desc ? 14 : 0 }}>{project.subtitle}</p>
          {project.desc && (
            <p style={{ fontSize:15, color:'var(--fg-mute)', lineHeight:1.7, maxWidth:'58ch' }}>{project.desc}</p>
          )}
        </div>

        <div style={{ height:1, background:'var(--line)', marginBottom:28 }}></div>

        {/* architecture */}
        {project.arch && (
          <div style={{ marginBottom:28 }}>
            <SectionLabel>Arquitetura</SectionLabel>
            <div className="mono" style={{
              fontSize:12, color:'var(--fg-dim)', lineHeight:1.8,
              padding:'14px 18px', background:'var(--bg-2)',
              border:'1px solid var(--line)', borderRadius:10,
              letterSpacing:'.02em',
            }}>
              {project.arch}
            </div>
          </div>
        )}

        {/* tech highlights */}
        {project.features && (
          <div style={{ marginBottom:28 }}>
            <SectionLabel>Destaques técnicos</SectionLabel>
            <ul style={{ listStyle:'none', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:10 }}>
              {project.features.map((f,i)=>(
                <li key={i} style={{
                  display:'flex', alignItems:'flex-start', gap:10,
                  fontSize:13.5, color:'var(--fg-dim)', lineHeight:1.55,
                  padding:'12px 14px', background:'var(--bg-2)',
                  border:'1px solid var(--line)', borderRadius:9,
                }}>
                  <span style={{ marginTop:5, width:5, height:5, borderRadius:99, background:accentColor, flexShrink:0 }}></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* footer */}
        <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
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
              {project.linkLabel || 'Ver no GitHub →'}
            </a>
          )}
          <span style={{ fontSize:12, color:'var(--fg-mute)' }}>
            Quer ver o sistema completo? <span style={{ color:accentColor }}>Entre em contato.</span>
          </span>
        </div>

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
        <SectionLabel num="03" label="Projetos selecionados" aside="SELECTED WORK · 2024—2026" />

        <div className="reveal" style={{ marginTop:48, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'end', marginBottom:64 }}>
          <h2 className="gsap-title" style={{ fontSize:'clamp(40px, 5.2vw, 72px)', lineHeight:1, letterSpacing:'-.04em', fontWeight:600, maxWidth:'12ch' }}>
            Um recorte do que construí.
          </h2>
          <a href="https://github.com/uriartegui" target="_blank" rel="noopener noreferrer"
            className="mono" style={{ fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--fg-dim)', borderBottom:'1px solid var(--line-2)', paddingBottom:4 }}>
            Ver GitHub →
          </a>
        </div>

        {/* ── Produtos SaaS ── */}
        <div className="reveal" style={{ marginBottom:14 }}>
          <span className="mono" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--fg-dim)' }}>
            01 — Produtos SaaS
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gridAutoRows:'minmax(200px, auto)', gap:16, marginBottom:56 }}>
          <ProjectCard
            span="span 4 / span 4" rows="span 2"
            tone="amber" featured
            year="2025" stack="Vite · Spring Boot · PostgreSQL"
            title="Qualyra" subtitle="SaaS de gestão da qualidade — da planilha ao processo rastreável"
            desc="Centraliza não-conformidades com fluxo estruturado, responsabilidades claras e trilha de auditoria completa. Multi-tenant, controle de acesso por papéis e dashboards em tempo real."
            link="https://github.com/uriartegui/qualyra"
            demo={window.QualyraDemo}
            slot="qualyra"
            preview="img/qualyra.svg"
            arch="React (Vite) → Spring Boot REST API → PostgreSQL · JWT Auth · RBAC"
            features={[
              'Fluxo de status OPEN → IN_PROGRESS → RESOLVED → CLOSED com histórico imutável',
              'Controle de acesso por papéis (RBAC) — admin, gestor, operador e visualizador',
              'Isolamento multi-tenant via row-level security no PostgreSQL',
              'Trilha de auditoria completa — cada mudança de estado é registrada com autor e timestamp',
              'Dashboards em tempo real com métricas de SLA, taxa de resolução e volume por categoria',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 2" rows="span 1"
            tone="amber-dim"
            year="2025" stack="Next.js · PostgreSQL · Vercel"
            title="Kanva" subtitle="Kanban board para times pequenos"
            desc="Gestão visual de tarefas com fluxo sprint, prioridades e times — sem overhead de ferramentas enterprise."
            slot="kanva" preview="img/kanva.svg"
            demo={window.KanvaDemo}
            arch="Next.js · React Server Components → PostgreSQL · Drizzle ORM → Vercel Edge"
            features={[
              'Atualizações otimistas — UI responde antes da confirmação do servidor, com rollback automático',
              'Sprints com datas, burndown e controle de capacidade por membro do time',
              'Drag-and-drop com estado persistido no banco — sem dessincronização entre abas',
              'Controle de acesso por workspace: admin, membro e visualizador com permissões granulares',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 2" rows="span 1"
            tone="warm"
            year="2025" stack="Next.js · Claude API · Vercel AI SDK"
            title="PulseAI" subtitle="Editor com IA para melhorar, resumir e expandir textos"
            desc="Quatro ações de IA em um clique: melhora estilo, resume, expande rascunhos e traduz instantaneamente."
            slot="pulseai" preview="img/pulseai.svg"
            demo={window.PulseAIDemo}
            arch="Next.js → Vercel AI SDK · streaming → Claude claude-opus-4-5 (Anthropic API)"
            features={[
              'Streaming token a token via Vercel AI SDK — latência percebida mínima, sem espera de resposta completa',
              'Histórico de undo/redo com até 20 estados preservados em memória por sessão',
              'Diff highlighting — visualize exatamente o que a IA alterou no texto original',
              '4 transforms em um clique: melhora estilo, resume, expande rascunho e traduz (PT ↔ EN)',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 6" rows="span 1"
            tone="warm"
            year="2025" stack="React Native · Expo · Supabase"
            title="FinFlow" subtitle="App de controle financeiro pessoal com sync em tempo real"
            slot="finflow" preview="img/finflow.svg"
            demo={window.FinFlowDemo}
            arch="React Native · Expo Router → Supabase Realtime → PostgreSQL (RLS)"
            features={[
              'Sincronização em tempo real com Supabase Realtime channels — sem pull manual',
              'Persistência offline-first com fila de retry automático ao reconectar',
              'Categorização automática de transações por análise de padrões de nome',
              'Relatórios mensais calculados via SQL functions no banco — sem processamento no cliente',
            ]}
            onOpen={setActive}
          />
        </div>

        {/* ── AI / Automação ── */}
        <div className="reveal" style={{ marginBottom:14 }}>
          <span className="mono" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--fg-dim)' }}>
            02 — AI / Automação
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gridAutoRows:'minmax(200px, auto)', gap:16, marginBottom:56 }}>
          <ProjectCard
            span="span 2" rows="span 1"
            tone="ink"
            year="2025" stack="Next.js · Anthropic API"
            title="Cozinhei" subtitle="App de receitas geradas por IA a partir dos ingredientes disponíveis"
            link="https://github.com/uriartegui/cozinhei"
            demo={window.CozinheiDemo}
            slot="cozinhei" artOverride="card-art-2"
            preview="img/cozinhei.svg"
            arch="Next.js App Router → Anthropic claude-opus-4-5 (streaming) → structured output parser"
            features={[
              'Streaming token a token — resposta aparece em tempo real, sem tela de espera',
              'Prompt estruturado com restrições dietéticas, porções e preferências do usuário',
              'Parser de markdown para exibir ingredientes e modo de preparo formatados',
              'Rate limiting por sessão para controle de custos de API',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 4" rows="span 1"
            tone="ink"
            year="2025" stack="Python · FastAPI · Groq · Evolution API"
            title="Agente de Locação IA" subtitle="Sistema white-label de atendimento via WhatsApp para locadoras de equipamentos"
            desc="Automatiza orçamento, coleta de dados e confirmação de pedidos direto no WhatsApp. Pronto para qualquer locadora — configurável por catálogo, sem desenvolvimento extra."
            slot="tanako" artOverride="card-art-6" preview="img/tanako.svg"
            demo={window.AgentLocacaoDemo}
            arch="FastAPI → Groq llama-3.3-70b (tool calling) → Evolution API (WhatsApp) · sessões persistidas em JSON"
            features={[
              'Catálogo configurável por locadora — preços e equipamentos editáveis sem tocar no código',
              'Tool calling estruturado para cálculo de orçamento por faixa (diária / semanal / mensal)',
              'Gestão de sessões por número de telefone — contexto preservado entre mensagens',
              'Webhook duplo: Evolution API (WhatsApp Business) + Kommo CRM para gestão de leads',
              'Dashboard admin para listagem, filtragem e atualização de status dos pedidos',
            ]}
            onOpen={setActive}
          />
        </div>

        {/* ── Sites / Cliente ── */}
        <div className="reveal" style={{ marginBottom:14 }}>
          <span className="mono" style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--fg-dim)' }}>
            03 — Sites / Cliente
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gridAutoRows:'minmax(200px, auto)', gap:16 }}>
          <ProjectCard
            span="span 4" rows="span 1"
            tone="warm"
            year="2026" stack="React 18 · Vite · Tailwind CSS · Framer Motion · Vercel"
            title="Hominum Saúde" subtitle="Site institucional para distribuidora de equipamentos médico-hospitalares"
            desc="Modernização completa do site — todas as páginas funcionando, catálogo de 8 marcas, seções de serviços, mapa de localização e formulário de contato. Projeto real, entregue via pitch presencial."
            slot="hominum" artOverride="card-art-5"
            link="https://hominum-site.vercel.app"
            linkLabel="Ver site ao vivo →"
            iframeUrl="https://hominum-site.vercel.app"
            arch="React 18 (Vite) → React Router DOM v6 → Tailwind CSS → Vercel (SPA rewrite)"
            features={[
              'Todas as rotas funcionando: 8 marcas representadas, 4 serviços, biblioteca e sobre',
              'Navbar com dropdowns animados (Framer Motion AnimatePresence) e drawer mobile',
              'Seção de localização com Google Maps embed e cards de contato',
              'Animações de entrada com Framer Motion e scroll-reveal via IntersectionObserver',
              'Deploy no Vercel com vercel.json para SPA routing correto em produção',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 2" rows="span 1"
            tone="ink"
            year="2025" stack="HTML · CSS · JavaScript · GSAP · Vercel"
            title="André Zapelini" subtitle="Portfólio de engenheiro civil — 18 anos, 142+ projetos"
            desc="Site profissional com animações de scroll avançadas, paralaxe e cursor personalizado. Projeto real entregue para engenheiro civil atuante em SC, PR e SP."
            link="https://andre-one-beryl.vercel.app"
            linkLabel="Ver site ao vivo →"
            iframeUrl="https://andre-one-beryl.vercel.app"
            arch="HTML · CSS · Vanilla JS → GSAP ScrollTrigger · Timeline → Vercel (static)"
            features={[
              'Animações de scroll com GSAP ScrollTrigger — timeline orquestrada por seção',
              'Cursor personalizado com efeito de paralaxe e tracking suave',
              'Loader animado com contador e reveal progressivo do conteúdo',
              'Contadores de estatísticas animados: 18 anos, 142+ projetos, 48k m² projetados',
              'Formulário de contato com integração WhatsApp direto pelo site',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 3" rows="span 1"
            tone="amber"
            year="2025" stack="HTML · CSS · JavaScript · Vercel"
            title="Buollo" subtitle="Site de confeitaria artesanal — Florianópolis, SC"
            desc="Site institucional para Buollo Doces Finos — bundt cakes, docinhos finos e bolos artísticos. Carrossel de receitas, galeria de produtos e formulário de pedidos. Projeto real entregue."
            link="https://buollo.vercel.app"
            linkLabel="Ver site ao vivo →"
            iframeUrl="https://buollo.vercel.app"
            arch="HTML · CSS · Vanilla JS → Vercel (static deploy)"
            features={[
              'Carrossel de receitas e inspirações com navegação por setas e swipe',
              'Galeria de 3 linhas de produtos com hover reveal e descrição',
              'Formulário de pedido com validação nativa e redirecionamento WhatsApp',
              'Navbar com scroll-aware transparência e comportamento sticky',
              'Seção de depoimentos de clientes com layout de cards responsivo',
            ]}
            onOpen={setActive}
          />
          <ProjectCard
            span="span 3" rows="span 1"
            tone="ink"
            year="2026" stack="HTML · CSS · JavaScript · Vercel"
            title="DJ Piriquita" subtitle="Site artístico para DJ brasileiro — Open Format, Funk, House, Mandelão"
            desc="Presença digital completa para DJ Piriquita: player Spotify-style com cards 3D, galeria com lightbox, equalizer animado e integração com Spotify, SoundCloud e YouTube. Artista com 1.4M+ streams."
            link="https://github.com/uriartegui/piriquita"
            linkLabel="Ver no GitHub →"
            arch="HTML · CSS · Vanilla JS → Vercel (static deploy)"
            features={[
              'Player de música Spotify-style com cards 3D, scrubber e controles de navegação',
              'Equalizer animado no hero sincronizado com a identidade visual do artista',
              'Galeria com lightbox, wipe animations e IntersectionObserver para reveal',
              'Preloader animado com barra de progresso e transição suave para o conteúdo',
              'Integrações diretas com Spotify, SoundCloud, YouTube e Instagram @agency.hey',
            ]}
            onOpen={setActive}
          />
        </div>
      </div>
    </section>
  );
}

const CARD_ARTS = { amber:'card-art-1', 'amber-dim':'card-art-4', ink:'card-art-6', warm:'card-art-3' };

function ProjectCard({ span, rows, tone, year, stack, title, subtitle, desc, features, arch, featured, slot, preview, demo, link, linkLabel, iframeUrl, onOpen, artOverride }){
  const [hover,setHover] = useState(false);
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const tiltRef = useRef({ rx:0, ry:0, tx:0, ty:0 });

  const tones = {
    'amber':       { bg:'#1F1408', border:'#3a2310', accent:'var(--accent)' },
    'amber-dim':   { bg:'#191210', border:'#2c1f17', accent:'#FB923C' },
    'ink':         { bg:'#121110', border:'#232120', accent:'var(--fg)' },
    'warm':        { bg:'#181513', border:'#27221e', accent:'#E8B57A' },
  };
  const c = tones[tone] || tones.ink;
  const artClass = artOverride || CARD_ARTS[tone] || 'card-art-2';

  const handleClick = ()=>{
    if(onOpen) onOpen({ tone, year, stack, title, subtitle, desc, features, arch, slot, preview, demo, link, linkLabel, iframeUrl });
  };

  const lerpLoop = ()=>{
    const t = tiltRef.current;
    t.rx += (t.ty - t.rx) * 0.14;
    t.ry += (t.tx - t.ry) * 0.14;
    if(cardRef.current)
      cardRef.current.style.transform = `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(${hover?8:0}px)`;
    if(Math.abs(t.rx-t.ty)>0.01 || Math.abs(t.ry-t.tx)>0.01)
      rafRef.current = requestAnimationFrame(lerpLoop);
    else rafRef.current = null;
  };

  const onMouseMove = (e)=>{
    if(document.body.classList.contains('no-motion')) return;
    const el = cardRef.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    tiltRef.current.tx = nx * -10;
    tiltRef.current.ty = ny * 10;
    if(!rafRef.current) rafRef.current = requestAnimationFrame(lerpLoop);
  };

  const onMouseLeave = ()=>{
    setHover(false);
    tiltRef.current.tx = 0; tiltRef.current.ty = 0;
    if(!rafRef.current) rafRef.current = requestAnimationFrame(lerpLoop);
  };

  useEffect(()=>()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); },[]);

  return (
    <article ref={cardRef} className="reveal"
      onMouseEnter={()=>setHover(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      style={{
        gridColumn: span, gridRow: rows,
        background: c.bg, border:`1px solid ${hover ? 'rgba(237,234,227,.18)' : c.border}`,
        borderRadius:18, padding: featured ? '36px' : '28px',
        position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column', justifyContent:'space-between',
        transformStyle:'preserve-3d', willChange:'transform',
        transition:'border-color .3s',
        cursor: onOpen ? 'pointer' : 'default',
      }}>
      {/* CSS art background */}
      <div className={artClass} aria-hidden="true"/>

      {/* meta row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:2 }}>
        <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.1em', textTransform:'uppercase' }}>
          {year}
        </span>
        <span className="mono" style={{ fontSize:11, color:'var(--fg-mute)', letterSpacing:'.06em', textAlign:'right', maxWidth:'60%' }}>
          {stack}
        </span>
      </div>


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
        <SectionLabel num="04" label="Stack técnica" aside="FERRAMENTAS · 2026" />

        <div className="reveal" style={{ marginTop:48, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'end', marginBottom:80 }}>
          <h2 className="gsap-title" style={{ fontSize:'clamp(40px, 5.2vw, 72px)', lineHeight:1, letterSpacing:'-.04em', fontWeight:600, maxWidth:'14ch' }}>
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
  const [state,setState] = useState({ name:'', email:'', phone:'', message:'', budget:'' });
  const [errors,setErrors] = useState({});
  const [sent,setSent] = useState(false);
  const [sending,setSending] = useState(false);

  const update = (k)=>(e)=> setState(s=>({ ...s, [k]: e.target.value }));

  const submit = async (e)=>{
    e.preventDefault();
    const errs = {};
    if(!state.name.trim()) errs.name = 'Diga seu nome';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errs.email = 'Email inválido';
    if(state.message.trim().length < 10) errs.message = 'Conte um pouco mais (10+ chars)';
    setErrors(errs);
    if(Object.keys(errs).length) return;
    setSending(true);
    try {
      const res = await fetch('https://formspree.io/f/mqenleob', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          phone: state.phone,
          budget: state.budget,
          message: state.message,
        }),
      });
      if(res.ok){ setSent(true); }
      else { alert('Erro ao enviar. Tente pelo email diretamente.'); }
    } catch(_) {
      alert('Erro de conexão. Tente pelo email diretamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" ref={formRef} style={{ padding:'200px 32px 120px', position:'relative' }}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>
        <SectionLabel num="05" label="Contato" aside="VAMOS CONVERSAR" />

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
                ['Email','guiuriartedev@gmail.com','mailto:guiuriartedev@gmail.com'],
                ['LinkedIn','/in/uriartegui19','https://www.linkedin.com/in/uriartegui19/'],
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
              <button onClick={()=>{ setSent(false); setState({ name:'', email:'', phone:'', message:'', budget:'' }); }} className="mono" style={{ alignSelf:'flex-start', marginTop:14, fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--fg-dim)', borderBottom:'1px solid var(--line-2)', paddingBottom:3 }}>
                ← Enviar outra
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:0 }} noValidate>
              <Field label="Nome" id="name" value={state.name} onChange={update('name')} error={errors.name} placeholder="Como devo te chamar?" />
              <Field label="Email" id="email" type="email" value={state.email} onChange={update('email')} error={errors.email} placeholder="email@empresa.com" />
              <Field label="WhatsApp" id="phone" type="tel" value={state.phone} onChange={update('phone')} placeholder="(00) 00000-0000 — opcional" />
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
function SectionLabel({ num, label, aside }){
  const barRef = useRef(null);
  useEffect(()=>{
    if(!barRef.current) return;
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        if(typeof gsap !== 'undefined')
          gsap.to(barRef.current,{ scaleX:1, duration:1.4, ease:'expo.out' });
        else
          barRef.current.style.transform = 'scaleX(1)';
        io.disconnect();
      }
    },{ threshold:.5 });
    io.observe(barRef.current);
    return ()=> io.disconnect();
  },[]);

  return (
    <div className="gsap-label" style={{ display:'flex', alignItems:'baseline', gap:18, color:'var(--fg-mute)', marginBottom:60 }}>
      <span className="mono" style={{ fontSize:11, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--accent)' }}>[ {num} ]</span>
      <span className="mono" style={{ fontSize:11, letterSpacing:'.22em', textTransform:'uppercase' }}>{label}</span>
      <span ref={barRef} className="section-bar" style={{ transition:'transform 1.4s cubic-bezier(.22,.61,.36,1)' }}/>
      {aside && <span className="mono" style={{ fontSize:11, letterSpacing:'.16em', textTransform:'uppercase', color:'var(--fg-mute)' }}>{aside}</span>}
    </div>
  );
}

/* expose to global */
Object.assign(window, { Nav, Hero, About, Services, Projects, Skills, Contact, Footer, Marquee, useReveal });
