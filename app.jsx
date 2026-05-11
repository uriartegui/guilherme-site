/* App shell — orchestrates portfolio + tweaks */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#F59E0B",
  "headingScale": "cinematic",
  "bgTone": "warm",
  "motion": true,
  "fontPair": "jakarta"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = ['#F59E0B', '#EA580C', '#FB923C', '#FFB454'];
const BG_TONES = {
  warm:    { '--bg':'#0A0908', '--bg-2':'#121110', '--bg-3':'#1A1817', '--line':'#232120', '--line-2':'#2E2C2A' },
  neutral: { '--bg':'#0B0B0C', '--bg-2':'#131315', '--bg-3':'#1B1B1E', '--line':'#222226', '--line-2':'#2C2C30' },
  ink:     { '--bg':'#080806', '--bg-2':'#0F0E0C', '--bg-3':'#171513', '--line':'#1F1D1A', '--line-2':'#2A2725' },
};
const FONT_PAIRS = {
  jakarta: { sans: "'Plus Jakarta Sans', system-ui, sans-serif" },
  inter:   { sans: "'Inter Tight', 'Inter', system-ui, sans-serif" },
  serif:   { sans: "'Instrument Serif', 'Plus Jakarta Sans', serif" },
};

function applyTweaks(t){
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  // derive a darker accent-2
  root.style.setProperty('--accent-2', t.accent === '#F59E0B' ? '#EA580C' : t.accent);
  // bg
  const tone = BG_TONES[t.bgTone] || BG_TONES.warm;
  Object.entries(tone).forEach(([k,v])=> root.style.setProperty(k,v));
  // font
  const pair = FONT_PAIRS[t.fontPair] || FONT_PAIRS.jakarta;
  document.body.style.fontFamily = pair.sans;
  // motion
  document.body.classList.toggle('no-motion', !t.motion);
  // heading scale handled via class
  document.body.classList.toggle('scale-restrained', t.headingScale === 'restrained');
}

function injectFonts(pair){
  const id = `font-${pair}`;
  if(document.getElementById(id)) return;
  const map = {
    jakarta: 'Plus+Jakarta+Sans:wght@300;400;500;600;700;800',
    inter:   'Inter+Tight:wght@300;400;500;600;700;800',
    serif:   'Instrument+Serif:ital,wght@0,400;1,400',
  };
  if(!map[pair]) return;
  const link = document.createElement('link');
  link.id = id; link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${map[pair]}&display=swap`;
  document.head.appendChild(link);
}

function App(){
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, ()=>{}];
  const formRef = useRef(null);

  useEffect(()=>{
    applyTweaks(tweaks);
    injectFonts(tweaks.fontPair);
  },[tweaks]);

  // restrained scale via injected style
  useEffect(()=>{
    let style = document.getElementById('__scale_style');
    if(!style){ style = document.createElement('style'); style.id='__scale_style'; document.head.appendChild(style); }
    style.textContent = tweaks.headingScale === 'restrained' ? `
      h1 { font-size: clamp(44px, 6.4vw, 88px) !important; }
      h2 { font-size: clamp(32px, 3.8vw, 52px) !important; }
      #contact h2 { font-size: clamp(48px, 8vw, 110px) !important; }
    ` : '';
  },[tweaks.headingScale]);

  // GSAP ScrollTrigger animations
  useEffect(()=>{
    if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if(!tweaks.motion) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax — headline e sub deslocam enquanto saem da tela
    gsap.to('#heroH1', {
      yPercent: -22, ease:'none',
      scrollTrigger:{ trigger:'#top', start:'top top', end:'bottom top', scrub:1.2 },
    });
    gsap.to('#top .hero-sub', {
      yPercent: -12, opacity:0, ease:'none',
      scrollTrigger:{ trigger:'#top', start:'30% top', end:'bottom top', scrub:1 },
    });

    // Aurora blob parallax
    const b1 = document.getElementById('hero-blob1');
    const b2 = document.getElementById('hero-blob2');
    const b3 = document.getElementById('hero-blob3');
    if(b1) gsap.to(b1,{ yPercent:30, ease:'none', scrollTrigger:{ trigger:'#top', start:'top top', end:'bottom top', scrub:true }});
    if(b2) gsap.to(b2,{ yPercent:-25, ease:'none', scrollTrigger:{ trigger:'#top', start:'top top', end:'bottom top', scrub:true }});
    if(b3) gsap.to(b3,{ yPercent:50, xPercent:-20, ease:'none', scrollTrigger:{ trigger:'#top', start:'top top', end:'bottom top', scrub:true }});

    // Section labels entram com clip horizontal
    gsap.utils.toArray('.gsap-label').forEach(el=>{
      gsap.from(el, {
        clipPath:'inset(0 100% 0 0)', opacity:0, duration:1,
        ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' },
      });
    });

    // Section h2 com stagger de palavras
    gsap.utils.toArray('.gsap-title').forEach(el=>{
      gsap.from(el, {
        y:60, opacity:0, duration:1.1, ease:'power4.out',
        scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none none' },
      });
    });

    return ()=>{ ScrollTrigger.getAll().forEach(t=>t.kill()); };
  },[tweaks.motion]);

  // Reveal-on-scroll observer (re-runs as new sections mount)
  useEffect(()=>{
    if(!tweaks.motion) {
      document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{ threshold:.12, rootMargin:'0px 0px -6% 0px' });
    const all = document.querySelectorAll('.reveal');
    all.forEach(el=>io.observe(el));
    return ()=> io.disconnect();
  },[tweaks.motion]);

  const goContact = ()=> {
    const el = document.getElementById('contact');
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav onContact={goContact} />
      <main>
        <Hero />
        <Marquee items={['Fullstack Developer','Brasil','2026','Disponível','Código Preciso','Produto que Funciona']} speed={40} />
        <About />
        <Marquee items={['Sites & Apps','APIs & Sistemas','IA & Automação','React','Next.js','Node.js','FastAPI','Flutter']} speed={34} reverse />
        <Services />
        <Marquee items={['Projetos Selecionados','Startups','SaaS','Apps Mobile','Agentes IA','WhatsApp','Fintech','Healthtech']} speed={42} />
        <Projects />
        <Marquee items={['TypeScript','Next.js','PostgreSQL','Supabase','Docker','Vercel','Claude API','Groq','Spring Boot','Flutter']} speed={36} reverse />
        <Skills />
        <Contact formRef={formRef} />
      </main>
      <Footer />

      <PortfolioTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

function PortfolioTweaks({ tweaks, setTweak }){
  if(!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle, TweakSelect } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Cor de destaque">
        <TweakColor
          value={tweaks.accent}
          onChange={(v)=>setTweak('accent', v)}
          options={ACCENT_OPTIONS}
        />
      </TweakSection>
      <TweakSection title="Fundo">
        <TweakRadio
          value={tweaks.bgTone}
          onChange={(v)=>setTweak('bgTone', v)}
          options={[
            { value:'warm', label:'Quente' },
            { value:'neutral', label:'Neutro' },
            { value:'ink', label:'Tinta' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Escala dos títulos">
        <TweakRadio
          value={tweaks.headingScale}
          onChange={(v)=>setTweak('headingScale', v)}
          options={[
            { value:'cinematic', label:'Cinematográfica' },
            { value:'restrained', label:'Contida' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Tipografia">
        <TweakSelect
          value={tweaks.fontPair}
          onChange={(v)=>setTweak('fontPair', v)}
          options={[
            { value:'jakarta', label:'Plus Jakarta (padrão)' },
            { value:'inter', label:'Inter Tight' },
            { value:'serif', label:'Instrument Serif' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Movimento">
        <TweakToggle
          value={tweaks.motion}
          onChange={(v)=>setTweak('motion', v)}
          label="Animações ativadas"
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
