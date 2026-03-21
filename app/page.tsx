"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Image paths ─── */
const IMG = {
  hero: "/images/hero.jpg",
  story1: "/images/story-1.jpg",
  story2: "/images/story-2.jpg",
  story3: "/images/story-3.jpg",
  highlight: "/images/highlight.jpg",
  gallery1: "/images/gallery-1.jpg",
  gallery2: "/images/gallery-2.jpg",
  gallery3: "/images/gallery-3.jpg",
  gallery4: "/images/gallery-4.jpg",
};

/* ─── Colors ─── */
const C = {
  bg: "#FFFEF9", ivory: "#FAF8F0", gold: "#B8924A", goldLight: "#D4B978",
  goldFaint: "rgba(184,146,74,0.08)", sage: "#7A8B6F", sageLight: "#A3B396",
  blush: "#F0E6DC", text: "#3A3A32", muted: "#7A7A6E", white: "#FFFFFF",
};

/* ─── Inject global styles once ─── */
if (typeof window !== "undefined" && !document.getElementById("wstyles")) {
  const s = document.createElement("style");
  s.id = "wstyles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Nunito+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Nunito Sans', system-ui, sans-serif; background: ${C.bg}; color: ${C.text}; -webkit-tap-highlight-color: transparent; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: ${C.goldLight}; border-radius: 2px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slowZoom { 0% { transform:scale(1); } 100% { transform:scale(1.08); } }
    @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes float1 { 0%,100% { transform:translate(0,0) rotate(0deg); } 50% { transform:translate(12px,-18px) rotate(8deg); } }
    @keyframes float2 { 0%,100% { transform:translate(0,0) rotate(0deg); } 50% { transform:translate(-10px,14px) rotate(-6deg); } }
    @keyframes pulse { 0%,100% { opacity:.45; } 50% { opacity:.75; } }
    .anim-fu { animation: fadeUp .9s cubic-bezier(.22,1,.36,1) both; }
    .anim-fi { animation: fadeIn 1.2s ease both; }
    .rv { opacity:0; transform:translateY(28px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
    .rl { opacity:0; transform:translateX(-36px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
    .rr { opacity:0; transform:translateX(36px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
    .vis { opacity:1!important; transform:translateY(0) translateX(0)!important; }
    .gs { background:linear-gradient(90deg,${C.gold} 0%,${C.goldLight} 40%,${C.gold} 80%); background-size:200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 4s linear infinite; }
    img { display: block; }
  `;
  document.head.appendChild(s);
}

/* ─── Hooks ─── */
function useReveal(cls = "rv") {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("vis"); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Shared inline style helpers ─── */
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'Nunito Sans', system-ui, sans-serif";

/* ─── Components ─── */
function Reveal({ children, dir = "up", className = "" }: { children: React.ReactNode; dir?: "up"|"left"|"right"; className?: string }) {
  const ref = useReveal();
  const cls = dir === "left" ? "rl" : dir === "right" ? "rr" : "rv";
  return <div ref={ref} className={`${cls} ${className}`}>{children}</div>;
}

function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, margin:"18px auto 0", width:120 }}>
      <span style={{ flex:1, height:1, background:`linear-gradient(90deg, transparent, ${C.goldLight})` }} />
      <span style={{ color:C.gold, fontSize:10 }}>✦</span>
      <span style={{ flex:1, height:1, background:`linear-gradient(90deg, ${C.goldLight}, transparent)` }} />
    </div>
  );
}

function STitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:32 }}>
      <h2 style={{ fontFamily:serif, fontSize:"clamp(28px,6vw,40px)", fontWeight:500, color:C.text, lineHeight:1.2 }}>{children}</h2>
      {sub && <p style={{ color:C.muted, fontSize:14, marginTop:8, letterSpacing:2, textTransform:"uppercase" }}>{sub}</p>}
      <Divider />
    </div>
  );
}

function Btn({ children, onClick, href, outline, style: s }: { children: React.ReactNode; onClick?: () => void; href?: string; outline?: boolean; style?: React.CSSProperties }) {
  const base: React.CSSProperties = outline
    ? { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:500, cursor:"pointer", textDecoration:"none", transition:"all .3s ease", minWidth:160, fontFamily:sans, letterSpacing:.5, border:`1.5px solid ${C.gold}`, background:"transparent", color:C.gold, ...s }
    : { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px 32px", borderRadius:50, fontSize:14, fontWeight:500, cursor:"pointer", textDecoration:"none", transition:"all .3s ease", minWidth:160, fontFamily:sans, letterSpacing:.5, border:"none", background:C.gold, color:C.white, boxShadow:`0 4px 20px ${C.gold}33`, ...s };
  if (href) return <a href={href} target="_blank" rel="noopener" style={base}>{children}</a>;
  return <button onClick={onClick} style={base}>{children}</button>;
}


function Card({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background:C.white, borderRadius:20, padding:"36px 28px", boxShadow:"0 2px 24px rgba(0,0,0,.04)", border:`1px solid ${C.goldFaint}`, ...s }}>{children}</div>;
}

function WeddingImage({ src, alt, style: s }: { src: string; alt: string; style?: React.CSSProperties }) {
  return <img src={src} alt={alt} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", ...s }} />;
}

function StoryMoment({ imgSrc, title, text, reverse }: { imgSrc: string; title: string; text: string; reverse?: boolean }) {
  return (
    <Reveal dir={reverse ? "right" : "left"}>
      <div style={{ display:"flex", flexDirection:"column", gap:24, alignItems:"center", marginBottom:48 }}>
        <div style={{ width:"100%", maxWidth:320, aspectRatio:"3/4", borderRadius:20, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,.08)", order: 1 }}>
          <WeddingImage src={imgSrc} alt={title} />
        </div>
        <div style={{ textAlign:"center", order: 2 }}>
          <p style={{ fontFamily:serif, fontSize:"clamp(20px,5vw,26px)", color:C.text, fontWeight:500, lineHeight:1.3, marginBottom:12 }}>{title}</p>
          <div style={{ width:32, height:1.5, background:C.gold, margin:"0 auto 14px", opacity:.6 }} />
          <p style={{ fontSize:"clamp(13px,3vw,15px)", color:C.muted, lineHeight:1.8 }}>{text}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Lightbox({ images, index, onClose }: { images: string[]; index: number|null; onClose: () => void }) {
  if (index === null) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,.92)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, animation:"fadeIn .3s ease" }}>
      <button onClick={onClose} style={{ position:"absolute", top:20, right:20, width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.12)", border:"none", color:"#fff", fontSize:20, cursor:"pointer" }}>✕</button>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth:520, maxHeight:"80vh", borderRadius:16, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,.4)" }}>
        <img src={images[index]} alt="Gallery" style={{ width:"100%", height:"auto", maxHeight:"80vh", objectFit:"contain", display:"block" }} />
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [rsvp, setRsvp] = useState({ name:"", attend:"", guests:"1", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);
  const [lb, setLb] = useState<number|null>(null);

  useEffect(() => { setTimeout(() => setLoaded(true), 800); }, []);

  const handleRsvp = useCallback(() => {
    console.log("RSVP:", rsvp);
    setSubmitted(true); setToast(true);
    setTimeout(() => setToast(false), 4000);
  }, [rsvp]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const gal = [IMG.gallery1, IMG.gallery2, IMG.gallery3, IMG.gallery4];

  if (!loaded) return (
    <div style={{ position:"fixed", inset:0, background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <p className="gs" style={{ fontFamily:serif, fontSize:32, fontWeight:400 }}>J & L</p>
      <p style={{ fontSize:12, color:C.muted, marginTop:12, letterSpacing:3, textTransform:"uppercase" }}>April 2026</p>
      <div style={{ width:28, height:28, border:`2px solid ${C.goldFaint}`, borderTopColor:C.gold, borderRadius:"50%", animation:"spin 1s linear infinite", marginTop:24 }} />
    </div>
  );

  const label: React.CSSProperties = { display:"block", fontSize:12, fontWeight:600, color:C.muted, marginBottom:8, letterSpacing:1, textTransform:"uppercase", fontFamily:sans };
  const input: React.CSSProperties = { width:"100%", padding:"14px 16px", borderRadius:12, fontSize:14, border:`1.5px solid ${C.goldFaint}`, background:C.bg, color:C.text, fontFamily:sans, outline:"none", boxSizing:"border-box" };

  return (
    <main style={{ background:C.bg, color:C.text, position:"relative", minHeight:"100vh", overflowX:"hidden" }}>

      {/* Floating petals */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {[
          { top:"8%",left:"5%",s:18,a:"float1 7s ease-in-out infinite",c:C.goldLight,o:.18 },
          { top:"15%",right:"8%",s:14,a:"float2 9s ease-in-out infinite",c:C.sageLight,o:.14 },
          { top:"35%",left:"3%",s:12,a:"float2 8s ease-in-out infinite",c:C.gold,o:.12 },
          { top:"55%",right:"4%",s:16,a:"float1 7s ease-in-out infinite",c:C.goldLight,o:.16 },
          { top:"72%",left:"7%",s:10,a:"float1 6s ease-in-out infinite",c:C.sageLight,o:.13 },
        ].map((p,i) => <div key={i} style={{ position:"absolute", top:p.top, left:(p as any).left, right:(p as any).right, width:p.s, height:p.s, borderRadius:"50% 0 50% 50%", background:p.c, opacity:p.o, animation:`${p.a}, pulse 4s ease-in-out infinite`, transform:`rotate(${i*45}deg)` }} />)}
      </div>

      {/* Music */}
      <button onClick={() => setMusicOn(!musicOn)} style={{ position:"fixed", top:16, right:16, zIndex:100, width:40, height:40, borderRadius:"50%", background:`${C.white}dd`, border:`1px solid ${C.goldFaint}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)", boxShadow:"0 2px 12px rgba(0,0,0,.06)", fontSize:16, color:C.gold }}>
        {musicOn ? "♫" : "♪"}
      </button>

      {/* ═══ HERO ═══ */}
      <section style={{ position:"relative", minHeight:"100dvh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <img src={IMG.hero} alt="Jebin and Lenah" style={{ width:"100%", height:"100%", objectFit:"cover", animation:"slowZoom 20s ease-in-out infinite alternate" }} />
          <div style={{ position:"absolute", inset:0, zIndex:1, background:"radial-gradient(ellipse at center, transparent 40%, rgba(20,18,14,0.35) 100%), linear-gradient(to bottom, rgba(255,254,249,0.15) 0%, rgba(20,18,14,0.42) 35%, rgba(20,18,14,0.58) 65%, rgba(20,18,14,0.72) 100%)" }} />
        </div>
        <div style={{ position:"relative", zIndex:2, padding:"60px 24px 100px" }}>
          <div className="anim-fu" style={{ animationDelay:".3s", display:"inline-flex", padding:"8px 22px", borderRadius:50, background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(12px)", marginBottom:28 }}>
            <span style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,.9)", fontWeight:600 }}>Save the Date</span>
          </div>
          <p className="anim-fu" style={{ animationDelay:".45s", fontFamily:serif, fontSize:"clamp(14px,3.5vw,18px)", color:"rgba(255,255,255,.75)", fontStyle:"italic", fontWeight:300, marginBottom:14 }}>A Promise of Forever</p>
          <h1 className="anim-fu" style={{ animationDelay:".6s", fontFamily:serif, fontSize:"clamp(42px,11vw,72px)", fontWeight:400, lineHeight:1.1, color:"#fff", textShadow:"0 2px 20px rgba(0,0,0,.15)", marginBottom:2 }}>Jebin Joice</h1>
          <p className="anim-fu" style={{ animationDelay:".7s", fontFamily:serif, fontSize:"clamp(22px,5vw,32px)", color:C.goldLight, fontStyle:"italic", fontWeight:300, margin:"6px 0" }}>&</p>
          <h1 className="anim-fu" style={{ animationDelay:".8s", fontFamily:serif, fontSize:"clamp(42px,11vw,72px)", fontWeight:400, lineHeight:1.1, color:"#fff", textShadow:"0 2px 20px rgba(0,0,0,.15)", marginBottom:28 }}>Lenah Annie</h1>
          <p className="anim-fu" style={{ animationDelay:".95s", fontSize:"clamp(14px,3.2vw,16px)", color:"rgba(255,255,255,.7)", maxWidth:400, lineHeight:1.75, margin:"0 auto 36px" }}>Together with their families, joyfully invite you to celebrate the beginning of their forever.</p>
          <div className="anim-fu" style={{ animationDelay:"1.1s", display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center" }}>
            <Btn onClick={() => go("wedding")} style={{ background:"rgba(255,255,255,.15)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.25)", color:"#fff" }}>View Invitation</Btn>
            <Btn outline onClick={() => go("reception")} style={{ borderColor:"rgba(255,255,255,.3)", color:"rgba(255,255,255,.9)" }}>Reception Details</Btn>
          </div>
        </div>
        <div className="anim-fi" style={{ animationDelay:"2s", position:"absolute", bottom:28, zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,.5)" }}>Scroll</span>
          <div style={{ width:1, height:28, background:"linear-gradient(rgba(255,255,255,.4), transparent)" }} />
        </div>
      </section>

      {/* ═══ WEDDING ═══ */}
      <section id="wedding" style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal><STitle sub="Holy Matrimony">Wedding Ceremony</STitle>
        <Card>
          <div style={{ textAlign:"center" }}>
            <p style={{ fontFamily:serif, fontSize:"clamp(18px,4.5vw,22px)", color:C.gold, fontWeight:500, marginBottom:6 }}>Saturday, April 11, 2026</p>
            <p style={{ fontSize:14, color:C.muted, marginBottom:20 }}>At 4:00 PM in the Evening</p>
            <div style={{ width:40, height:1, background:C.goldLight, margin:"0 auto 20px", opacity:.5 }} />
            <p style={{ fontFamily:serif, fontSize:"clamp(17px,4vw,20px)", color:C.text, fontWeight:500, marginBottom:6 }}>St. Michael&apos;s Church</p>
            <p style={{ fontSize:14, color:C.muted, marginBottom:24 }}>Chembumukku, Kochi</p>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:28, maxWidth:380, marginLeft:"auto", marginRight:"auto" }}>We would be honoured to have you join us as we exchange our vows and begin this sacred journey of love, faith, and togetherness.</p>
            <Btn href="https://www.google.com/maps/place/286C%2B82P+St.+Michael's+Parish+Hall,+Civil+Line+Rd,+Chembumukku,+Vazhakkala,+Kochi,+Kerala+682021/@10.0108366,76.3200793,16z/data=!4m6!3m5!1s0x3b080cfdac4525c7:0x594bec58ee0b1e9b!8m2!3d10.0108366!4d76.3200793!16s%2Fg%2F11b6vb34nb/Indriya+Sands/data=!4m2!3m1!1s0x3b0810d04957ef35:0x2d35f94def1e5a74?sa=X&ved=1t:242&ictx=111" outline style={{ fontSize:13, padding:"12px 24px" }}>📍 Open Location</Btn>
          </div>
        </Card></Reveal>
      </section>

      {/* ═══ RECEPTION ═══ */}
      <section id="reception" style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal><STitle sub="Dinner & Celebration">Wedding Reception</STitle>
        <Card>
          <div style={{ textAlign:"center" }}>
            <p style={{ fontFamily:serif, fontSize:"clamp(18px,4.5vw,22px)", color:C.gold, fontWeight:500, marginBottom:6 }}>Sunday, April 12, 2026</p>
            <p style={{ fontSize:14, color:C.muted, marginBottom:20 }}>From 6:00 PM Onwards</p>
            <div style={{ width:40, height:1, background:C.goldLight, margin:"0 auto 20px", opacity:.5 }} />
            <p style={{ fontFamily:serif, fontSize:"clamp(17px,4vw,20px)", color:C.text, fontWeight:500, marginBottom:6 }}>Indriya Sands</p>
            <p style={{ fontSize:14, color:C.muted, marginBottom:24 }}>Kochi</p>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:28, maxWidth:380, marginLeft:"auto", marginRight:"auto" }}>An evening of warmth, laughter, and delicious food awaits. Come celebrate love, life, and new beginnings with us under the stars.</p>
            <Btn href="https://www.google.com/maps/place/Indriya+Sands/@10.1083988,76.1883682,17z/data=!3m1!4b1!4m9!3m8!1s0x3b0810d04957ef35:0x2d35f94def1e5a74!5m2!4m1!1i2!8m2!3d10.1083988!4d76.1883682!16s%2Fg%2F11b6s_k00htps://maps.google.com" outline style={{ fontSize:13, padding:"12px 24px" }}>📍 Open Location</Btn>
          </div>
        </Card></Reveal>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section id="story" style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal><STitle sub="Moments that matter">Our Story</STitle></Reveal>
        <StoryMoment imgSrc={IMG.story1} title="The First Hello" text="Some conversations change everything. Ours began with a quiet ease — the kind where silences feel comfortable and laughter comes naturally. From the very first hello, something felt like home." />
        <StoryMoment imgSrc={IMG.story2} title="Growing Together" text="Through sunsets and long drives, late-night conversations and shared dreams, we found in each other a partner for every season. Love wasn't just a feeling — it became a choice we made every day." reverse />
        <StoryMoment imgSrc={IMG.story3} title="A Promise Made" text="And then came the moment we both knew — this is it. This is forever. A quiet knowing, a whispered prayer, and a promise to walk hand in hand through all that life brings our way." />
      </section>

      {/* ═══ HIGHLIGHT ═══ */}
      <section style={{ maxWidth:900, margin:"0 auto", padding:"0 16px" }}>
        <Reveal>
          <div style={{ position:"relative", borderRadius:24, overflow:"hidden", aspectRatio:"16/9", minHeight:280 }}>
            <img src={IMG.highlight} alt="Jebin and Lenah" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
            <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to top, rgba(20,18,14,.6) 0%, rgba(20,18,14,.2) 40%, transparent 100%)" }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:2, padding:"40px 32px 36px", textAlign:"center" }}>
              <p style={{ fontFamily:serif, fontSize:"clamp(20px,5vw,30px)", color:"#fff", fontStyle:"italic", fontWeight:300, lineHeight:1.4, textShadow:"0 2px 16px rgba(0,0,0,.2)" }}>&ldquo;In all the world, there is no heart for me like yours.&rdquo;</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,.6)", marginTop:12, letterSpacing:2, textTransform:"uppercase" }}>Maya Angelou</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal>
          <STitle sub="Captured Moments">Memories</STitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:12, maxWidth:500, margin:"0 auto" }}>
            {gal.map((img, i) => (
              <div key={i} onClick={() => setLb(i)} style={{ position:"relative", borderRadius:16, overflow:"hidden", cursor:"pointer", aspectRatio: i===0||i===3 ? "3/4" : "1/1" }}>
                <img src={img} alt={`Photo ${i+1}`} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s ease" }} onMouseOver={e=>(e.target as HTMLImageElement).style.transform="scale(1.06)"} onMouseOut={e=>(e.target as HTMLImageElement).style.transform="scale(1)"} />
              </div>
            ))}
          </div>
          <p style={{ textAlign:"center", fontSize:13, color:C.muted, marginTop:20 }}>Tap to view</p>
        </Reveal>
      </section>

      {/* ═══ FAMILIES ═══ */}
      <section style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal>
          <STitle sub="With Blessings From">Our Families</STitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { t:"The Groom", n:"Jebin Joice", d:"Son of", p:"Joice George & Jain Joice" },
              { t:"The Bride", n:"Lenah Annie", d:"Daughter of", p:"Juby Antony & Gigi Juby" },
            ].map((f,i) => (
              <Card key={i} style={{ textAlign:"center", padding:"28px 16px" }}>
                <p style={{ fontSize:11, letterSpacing:2.5, textTransform:"uppercase", color:C.gold, fontWeight:600, marginBottom:10 }}>{f.t}</p>
                <p style={{ fontFamily:serif, fontSize:"clamp(18px,4.5vw,22px)", color:C.text, fontWeight:500, marginBottom:14 }}>{f.n}</p>
                <div style={{ width:24, height:1, background:C.goldLight, margin:"0 auto 14px", opacity:.5 }} />
                <p style={{ fontSize:12, color:C.muted, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4 }}>{f.d}</p>
                <p style={{ fontFamily:serif, fontSize:"clamp(14px,3.5vw,16px)", color:C.text, fontWeight:400, lineHeight:1.5 }}>{f.p}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ MESSAGE ═══ */}
      <section style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal>
          <div style={{ textAlign:"center", padding:"48px 20px", borderRadius:24, background:`linear-gradient(135deg, ${C.goldFaint}, ${C.blush}44, ${C.goldFaint})`, border:`1px solid ${C.goldLight}18` }}>
            <span style={{ fontSize:28, display:"block", marginBottom:16 }}>♡</span>
            <h2 style={{ fontFamily:serif, fontSize:"clamp(22px,5vw,30px)", fontWeight:400, color:C.text, fontStyle:"italic", lineHeight:1.35, marginBottom:24 }}>A love rooted in faith, growing in grace</h2>
            <p style={{ fontSize:"clamp(14px,3.2vw,15px)", color:C.muted, lineHeight:1.85, maxWidth:440, margin:"0 auto", fontWeight:300 }}>As we step into this new chapter, we carry with us the blessings of our families, the warmth of our friends, and a promise to choose each other — every single day. Your presence at our wedding would mean the world to us.</p>
            <div style={{ display:"flex", justifyContent:"center", marginTop:24 }}><Divider /></div>
          </div>
        </Reveal>
      </section>

      {/* ═══ RSVP ═══ */}
      <section id="rsvp" style={{ padding:"72px 24px", maxWidth:720, margin:"0 auto" }}>
        <Reveal>
          <STitle sub="We'd love to hear from you">RSVP</STitle>
          {submitted ? (
            <Card style={{ textAlign:"center", padding:"48px 28px" }}>
              <span style={{ fontSize:36, display:"block", marginBottom:16 }}>💌</span>
              <h3 style={{ fontFamily:serif, fontSize:24, color:C.text, fontWeight:500, marginBottom:12 }}>Thank You!</h3>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>Your response means the world to us.<br />We can&apos;t wait to celebrate with you!</p>
            </Card>
          ) : (
            <Card>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div><label style={label}>Your Name</label><input value={rsvp.name} onChange={e=>setRsvp(d=>({...d,name:e.target.value}))} placeholder="Enter your name" style={input} /></div>
                <div>
                  <label style={label}>Will you attend?</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {["Wedding","Reception","Both","Sorry, can't make it"].map(o => (
                      <button key={o} onClick={()=>setRsvp(d=>({...d,attend:o}))} style={{ padding:"12px 8px", borderRadius:12, fontSize:13, cursor:"pointer", border:`1.5px solid ${rsvp.attend===o?C.gold:C.goldFaint}`, background:rsvp.attend===o?C.goldFaint:C.white, color:rsvp.attend===o?C.gold:C.muted, fontFamily:sans, fontWeight:rsvp.attend===o?600:400, transition:"all .2s ease" }}>{o}</button>
                    ))}
                  </div>
                </div>
                <div><label style={label}>Number of Guests</label>
                  <select value={rsvp.guests} onChange={e=>setRsvp(d=>({...d,guests:e.target.value}))} style={{...input,cursor:"pointer"}}>
                    {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} {n===1?"Guest":"Guests"}</option>)}
                  </select>
                </div>
                <div><label style={label}>Your Message (optional)</label><textarea value={rsvp.message} onChange={e=>setRsvp(d=>({...d,message:e.target.value}))} placeholder="Share your wishes..." rows={3} style={{...input,resize:"vertical" as const,minHeight:80}} /></div>
                <Btn onClick={handleRsvp} style={{ width:"100%", marginTop:4 }}>Send RSVP</Btn>
              </div>
            </Card>
          )}
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ textAlign:"center", padding:"48px 24px 120px", position:"relative", zIndex:1 }}>
        <p className="gs" style={{ fontFamily:serif, fontSize:"clamp(24px,6vw,32px)", fontWeight:400, marginBottom:8 }}>With Love,</p>
        <p style={{ fontFamily:serif, fontSize:"clamp(20px,5vw,26px)", color:C.text, fontWeight:400, marginBottom:16 }}>Jebin & Lenah</p>
        <Divider />
        <p style={{ fontSize:12, color:C.muted, marginTop:24 }}>April 2026 · Kochi, Kerala</p>
        <p style={{ fontSize:11, color:`${C.muted}88`, marginTop:8 }}>Made with ♡</p>
      </footer>

      {/* STICKY CTA */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:90, padding:"32px 16px 16px", display:"flex", gap:10, background:`linear-gradient(transparent, ${C.bg}ee 30%)` }}>
        <Btn onClick={()=>go("rsvp")} style={{ flex:1, fontSize:13, padding:"13px 16px" }}>💌 RSVP Now</Btn>
        <Btn outline onClick={()=>go("wedding")} style={{ flex:1, fontSize:13, padding:"13px 16px", background:`${C.white}ee`, backdropFilter:"blur(8px)" }}>📍 Venue</Btn>
      </div>

      {toast && <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", zIndex:200, background:C.sage, color:C.white, padding:"14px 28px", borderRadius:50, fontSize:14, fontWeight:500, boxShadow:"0 8px 32px rgba(0,0,0,.15)", animation:"fadeUp .4s ease", fontFamily:sans }}>✓ RSVP sent successfully!</div>}

      <Lightbox images={gal} index={lb} onClose={()=>setLb(null)} />
    </main>
  );
}