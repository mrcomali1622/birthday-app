import { useState, useEffect, useRef, useCallback } from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

const P = {
  deep: "#3B0764", dark: "#4C1D95", main: "#7C3AED", mid: "#8B5CF6",
  light: "#A78BFA", pale: "#EDE9FE", xpale: "#F5F3FF",
  rose: "#F9A8D4", gold: "#FCD34D",
};

/* ── SHARED ────────────────────────────────────────────────────────────── */
function Particles({ count = 18 }) {
  const [list] = useState(() => Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    s: Math.random() * 8 + 3, d: 5 + Math.random() * 9, delay: Math.random() * 7, shape: i % 3,
  })));
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {list.map(p => <motion.div key={p.id} style={{
      position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s,
      borderRadius: p.shape === 1 ? "3px" : "50%",
      background: p.shape === 2 ? "transparent" : `${P.mid}22`,
      border: p.shape === 2 ? `1.5px solid ${P.light}44` : "none",
    }} animate={{ y: [0, -60, 0], opacity: [0, 0.65, 0], rotate: [0, 180, 360] }}
      transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />)}
  </div>;
}
function TopBar() {
  return <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }} style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 4, zIndex: 10,
      background: `linear-gradient(90deg,${P.pale},${P.main},${P.mid},${P.rose},${P.pale})`, transformOrigin: "left"
    }} />;
}
function BottomBar() {
  return <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 10,
    background: `linear-gradient(90deg,transparent,${P.pale},transparent)`
  }} />;
}
function CenterGlow({ color }) {
  return <div style={{
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%",
    background: `radial-gradient(circle,${color || P.xpale} 0%,transparent 65%)`,
    pointerEvents: "none", zIndex: 0
  }} />;
}
function Corners() {
  return <>{["top-left", "top-right", "bottom-left", "bottom-right"].map(pos => {
    const top = pos.includes("top"), left = pos.includes("left");
    return <motion.div key={pos} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }} style={{
        position: "absolute",
        top: top ? 20 : "auto", bottom: !top ? 20 : "auto", left: left ? 20 : "auto", right: !left ? 20 : "auto",
        width: 36, height: 36, pointerEvents: "none",
        borderTop: top ? `2px solid ${P.pale}` : "none", borderBottom: !top ? `2px solid ${P.pale}` : "none",
        borderLeft: left ? `2px solid ${P.pale}` : "none", borderRight: !left ? `2px solid ${P.pale}` : "none",
        borderRadius: top && left ? "6px 0 0 0" : top ? "0 6px 0 0" : left ? "0 0 0 6px" : "0 0 6px 0"
      }} />;
  })}</>;
}
function NavBtn({ onClick, children, style = {} }) {
  return <motion.button onClick={onClick}
    whileHover={{ scale: 1.06, boxShadow: `0 12px 40px ${P.main}55` }} whileTap={{ scale: 0.95 }}
    style={{
      background: P.main, border: "none", color: "#fff", padding: "14px 44px", borderRadius: 12,
      fontFamily: "'Courier Prime','Courier New',monospace", fontSize: 13, letterSpacing: "0.28em",
      cursor: "pointer", textTransform: "uppercase", boxShadow: `0 4px 20px ${P.main}44`, fontWeight: 700, ...style
    }}>
    {children}</motion.button>;
}
function PageLabel({ children }) {
  return <div style={{
    fontFamily: "'Courier Prime','Courier New',monospace",
    fontSize: "clamp(8px,1vw,11px)", letterSpacing: "0.5em", textTransform: "uppercase", color: P.light, marginBottom: 10
  }}>
    {children}</div>;
}
function Confetti({ active }) {
  const [pieces] = useState(() => Array.from({ length: 60 }, (_, i) => ({
    id: i, x: 20 + Math.random() * 60, vx: (Math.random() - 0.5) * 700, vy: -(250 + Math.random() * 500),
    color: [P.main, P.mid, P.light, P.pale, "#C4B5FD", "#FCA5A5", P.rose, P.gold, "#6EE7B7"][i % 9],
    size: 6 + Math.random() * 9, shape: i % 3, delay: Math.random() * 0.4,
  })));
  return <AnimatePresence>{active && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 998, overflow: "hidden" }}>
    {pieces.map(p => <motion.div key={p.id}
      initial={{ x: `${p.x}vw`, y: "70vh", opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        x: `calc(${p.x}vw + ${p.vx}px)`, y: `calc(70vh + ${p.vy}px)`,
        opacity: [1, 1, 1, 0], rotate: Math.random() * 720 - 360, scale: [1, 1, 0.3]
      }}
      transition={{ duration: 1.6 + p.delay, delay: p.delay, ease: [0.2, 0.9, 0.4, 1] }}
      style={{
        position: "absolute", width: p.size, height: p.size * (p.shape === 0 ? 0.45 : 1),
        borderRadius: p.shape === 2 ? "50%" : "2px", background: p.color
      }} />)}
  </div>}</AnimatePresence>;
}
function Fireworks({ active }) {
  const bursts = [{ x: 18, y: 22, c: P.main }, { x: 78, y: 18, c: P.rose }, { x: 50, y: 12, c: P.gold }, { x: 85, y: 42, c: P.mid }, { x: 12, y: 48, c: "#6EE7B7" }];
  return <AnimatePresence>{active && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 997, overflow: "hidden" }}>
    {bursts.map((b, bi) => Array.from({ length: 14 }, (_, i) => {
      const ang = (i / 14) * Math.PI * 2, dist = 80 + Math.random() * 60;
      return <motion.div key={`${bi}-${i}`}
        initial={{ left: `${b.x}%`, top: `${b.y}%`, opacity: 1, scale: 0 }}
        animate={{
          left: `calc(${b.x}% + ${Math.cos(ang) * dist}px)`, top: `calc(${b.y}% + ${Math.sin(ang) * dist}px)`,
          opacity: [0, 1, 1, 0], scale: [0, 1.4, 1, 0]
        }}
        transition={{ duration: 1.2, delay: bi * 0.3 + Math.random() * 0.2, ease: [0.2, 0.8, 0.6, 1], repeat: Infinity, repeatDelay: 1.5 }}
        style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: b.c, boxShadow: `0 0 8px ${b.c}` }} />;
    }))}
  </div>}</AnimatePresence>;
}

/* ── 1. COUNTDOWN ──────────────────────────────────────────────────────── */
const TARGET = new Date(Date.now() + 8000);
function getLeft() {
  const d = Math.max(0, TARGET - Date.now()); return {
    days: Math.floor(d / 86400000), hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60), seconds: Math.floor((d / 1000) % 60), done: d === 0
  };
}
function Digit({ val, label }) {
  const s = String(val).padStart(2, "0");
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ position: "relative", width: "clamp(60px,9.5vw,112px)", height: "clamp(74px,11.5vw,138px)", perspective: 600 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16, background: "#fff",
        border: `1.5px solid ${P.pale}`, boxShadow: `0 2px 0 ${P.pale},0 8px 32px rgba(124,58,237,0.11)`
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
        background: `linear-gradient(165deg,${P.xpale} 0%,transparent 55%)`
      }} />
      <AnimatePresence mode="popLayout">
        <motion.div key={s} initial={{ rotateX: -80, opacity: 0, y: -8 }} animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 80, opacity: 0, y: 8 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "absolute", inset: 0, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(36px,6vw,78px)",
            color: P.main, userSelect: "none", textShadow: `0 2px 16px rgba(124,58,237,0.2)`
          }}>{s}</motion.div>
      </AnimatePresence>
      <div style={{
        position: "absolute", left: "10%", right: "10%", top: "50%", height: 1,
        transform: "translateY(-50%)", pointerEvents: "none",
        background: `linear-gradient(90deg,transparent,${P.pale},transparent)`
      }} />
    </div>
    <span style={{
      fontFamily: "'Courier Prime','Courier New',monospace", fontSize: "clamp(8px,1vw,11px)",
      letterSpacing: "0.28em", textTransform: "uppercase", color: P.light, fontWeight: 700
    }}>{label}</span>
  </div>;
}
function Sep() {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 500); return () => clearInterval(t); }, []);
  return <div style={{
    display: "flex", flexDirection: "column", gap: "clamp(7px,1.2vw,14px)", alignItems: "center",
    paddingBottom: "clamp(22px,3.5vw,38px)", opacity: on ? 1 : 0.18, transition: "opacity 0.08s"
  }}>
    {[0, 1].map(i => <div key={i} style={{
      width: "clamp(4px,0.6vw,7px)", height: "clamp(4px,0.6vw,7px)",
      borderRadius: "50%", background: P.main, boxShadow: `0 0 8px ${P.main}88`
    }} />)}
  </div>;
}
function CountdownPage() {
  const [t, setT] = useState(getLeft()); const [bursting, setBursting] = useState(false); const nav = useNavigate();
  useEffect(() => {
    const id = setInterval(() => {
      const tl = getLeft(); setT(tl);
      if (tl.done) { clearInterval(id); setBursting(true); setTimeout(() => nav("/card"), 1100); }
    }, 1000);
    return () => clearInterval(id);
  }, [nav]);
  const segs = [{ v: t.days, l: "Days" }, { v: t.hours, l: "Hours" }, { v: t.minutes, l: "Minutes" }, { v: t.seconds, l: "Seconds" }];
  return <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
    <Particles /><CenterGlow /><TopBar /><BottomBar /><Corners />
    <AnimatePresence>{bursting && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 7, opacity: [0, 0.3, 0] }}
      transition={{ duration: 1, ease: "easeOut" }} style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", width: 260, height: 260, borderRadius: "50%",
        background: `radial-gradient(circle,${P.pale},${P.mid}55,transparent 70%)`,
        pointerEvents: "none", zIndex: 999
      }} />}</AnimatePresence>
    <div style={{
      position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", height: "100%", gap: "clamp(20px,4vh,50px)"
    }}>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }} style={{ textAlign: "center" }}>
        <PageLabel>✦ Countdown to ✦</PageLabel>
        <div style={{
          fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(30px,5.5vw,70px)",
          color: P.main, letterSpacing: "0.08em", lineHeight: 1, textShadow: `0 4px 30px ${P.pale}`
        }}>The Big Reveal</div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.7vw,19px)", color: `${P.light}BB`, fontStyle: "italic", marginTop: 8 }}>
          Something magical is on its way…</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{ display: "flex", alignItems: "flex-end", gap: "clamp(4px,1.2vw,16px)", flexWrap: "wrap", justifyContent: "center" }}>
        {segs.map((s, i) => <div key={s.l} style={{ display: "flex", alignItems: "flex-end", gap: "clamp(4px,1.2vw,16px)" }}>
          <Digit val={s.v} label={s.l} />{i < segs.length - 1 && <Sep />}</div>)}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 7 }}>
          {[0, 1, 2].map(i => <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, delay: i * 0.22, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: P.light }} />)}
        </div>
        <p style={{
          fontFamily: "'Courier Prime','Courier New',monospace", color: `${P.light}88`,
          letterSpacing: "0.22em", fontSize: "clamp(7px,0.9vw,10px)", textTransform: "uppercase"
        }}>Auto-reveal when timer ends</p>
      </motion.div>
    </div>
  </div>;
}

/* ── 2. GREETING CARD ──────────────────────────────────────────────────── */
function FloatingHeartsAmbient() {
  const [h] = useState(() => Array.from({ length: 10 }, (_, i) => ({ id: i, x: 10 + Math.random() * 80, delay: Math.random() * 5, d: 5 + Math.random() * 6, size: 14 + Math.random() * 12 })));
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
    {h.map(x => <motion.div key={x.id} style={{ position: "absolute", left: `${x.x}%`, bottom: "-30px", fontSize: x.size }}
      animate={{ y: [0, -600], opacity: [0, 0.8, 0.8, 0] }} transition={{ duration: x.d, delay: x.delay, repeat: Infinity, ease: "linear" }}>💜</motion.div>)}
  </div>;
}
function CardClosed({ onClick }) {
  return <motion.div onClick={onClick} whileHover={{ y: -10, boxShadow: `0 40px 100px rgba(124,58,237,0.26)` }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{
      position: "relative", width: "clamp(240px,32vw,360px)", height: "clamp(320px,46vw,500px)",
      borderRadius: 24, background: "#fff", border: `1.5px solid ${P.pale}`,
      boxShadow: `0 16px 56px rgba(124,58,237,0.14),0 2px 0 ${P.pale}`,
      cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "clamp(22px,3.5vw,38px)", userSelect: "none"
    }}>
    <div style={{
      position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
      background: `linear-gradient(155deg,${P.xpale} 0%,transparent 55%)`
    }} />
    {[155, 112, 70].map((s, i) => <div key={s} style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)", width: s, height: s, borderRadius: "50%",
      border: `1px solid ${P.pale}`, opacity: 0.7 - i * 0.18, pointerEvents: "none"
    }} />)}
    <div style={{ position: "relative", zIndex: 1 }}><PageLabel>✦ A Special Message ✦</PageLabel></div>
    <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }} transition={{ duration: 3, repeat: Infinity }}
        style={{ fontSize: "clamp(56px,9vw,84px)", lineHeight: 1 }}>🎂</motion.div>
      <div style={{
        fontFamily: "Georgia,serif", fontSize: "clamp(22px,3.8vw,42px)",
        color: P.main, fontWeight: 700, lineHeight: 1.15, marginTop: 14, textShadow: `0 2px 22px ${P.pale}`
      }}>
        Happy<br />Birthday!</div>
    </div>
    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
      style={{
        position: "relative", zIndex: 1, fontFamily: "'Courier Prime','Courier New',monospace",
        fontSize: "clamp(7px,0.9vw,10px)", color: P.light, letterSpacing: "0.3em", textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 6
      }}>
      <span>✦</span><span>Click to open</span><span>✦</span>
    </motion.div>
  </motion.div>;
}
function CardOpen({ onCelebrate }) {
  const [coverDone, setCoverDone] = useState(false);

  // Fire coverDone after the flip animation finishes (1s) — doesn't rely on onAnimationComplete
  useEffect(() => {
    const t = setTimeout(() => setCoverDone(true), 1050);
    return () => clearTimeout(t);
  }, []);

  const HW = "clamp(200px,27vw,320px)"; const CH = "clamp(360px,50vw,540px)";

  // CSS transition helper — simple opacity/transform, no framer conditionals
  const fade = (delay = 0, extra = {}) => ({
    opacity: coverDone ? 1 : 0,
    transform: coverDone ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    ...extra,
  });

  return <div style={{ display: "flex", position: "relative", boxShadow: `0 24px 80px rgba(124,58,237,0.15)` }}>

    {/* ── LEFT: photo panel ─────────────────────────── */}
    <div style={{
      width: HW, height: CH, flexShrink: 0, overflow: "hidden", position: "relative", zIndex: 1,
      borderRadius: "20px 0 0 20px",
      background: `linear-gradient(145deg,${P.xpale} 0%,${P.pale} 50%,#DDD6FE 100%)`,
      border: `1.5px solid ${P.pale}`, borderRight: "none",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24,
    }}>
      {/* spine shadow */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 16, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to left,rgba(124,58,237,0.12),transparent)"
      }} />

      {/* Avatar — replace YOUR_PHOTO_URL with your image link */}
      <div style={{
        ...fade(0),
        width: "clamp(100px,16vw,150px)", height: "clamp(100px,16vw,150px)",
        borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        boxShadow: `0 8px 32px rgba(124,58,237,0.26)`, border: "4px solid #fff",
        background: `linear-gradient(135deg,${P.pale},${P.mid})`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <img
          src="YOUR_PHOTO_URL"
          alt="Birthday person"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          onError={e => { e.target.replaceWith(Object.assign(document.createTextNode("🙂"))) }}
        />
      </div>

      <div style={fade(0.15)}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: "clamp(15px,2.2vw,22px)", color: P.main, fontWeight: 700, textAlign: "center" }}>Your Name</div>
        <div style={{
          fontFamily: "'Courier Prime','Courier New',monospace", fontSize: 8, color: P.light,
          letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4, textAlign: "center"
        }}>Replace with your photo</div>
      </div>

      <div style={{ ...fade(0.28), display: "flex", gap: 10 }}>
        {["🌸", "💜", "🌸"].map((e, i) => (
          <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: i * 0.35, repeat: Infinity }}
            style={{ fontSize: "clamp(16px,2.2vw,24px)" }}>{e}</motion.span>
        ))}
      </div>
    </div>

    {/* ── RIGHT: message panel ──────────────────────── */}
    <div style={{
      width: HW, height: CH, flexShrink: 0, overflow: "hidden", position: "relative", zIndex: 1,
      borderRadius: "0 20px 20px 0",
      background: "#fff",
      border: `1.5px solid ${P.pale}`, borderLeft: "none",
      display: "flex", flexDirection: "column",
      padding: "clamp(20px,3vw,34px)", gap: "clamp(10px,1.6vw,18px)",
      boxShadow: `10px 0 44px rgba(124,58,237,0.10)`,
    }}>
      {/* tint */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "0 20px 20px 0", pointerEvents: "none",
        background: `linear-gradient(155deg,${P.xpale} 0%,transparent 50%)`
      }} />

      {/* Header */}
      <div style={{ ...fade(0), position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: "'Courier Prime','Courier New',monospace", fontSize: "clamp(8px,1vw,11px)",
          letterSpacing: "0.45em", textTransform: "uppercase", color: P.light, marginBottom: 6
        }}>✦ With Love ✦</div>
        <div style={{
          fontFamily: "Georgia,serif", fontSize: "clamp(20px,3.2vw,34px)",
          color: P.main, fontWeight: 700, lineHeight: 1.1
        }}>Happy<br />Birthday! 🎉</div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1, position: "relative", zIndex: 1,
        background: `linear-gradient(90deg,${P.pale},${P.mid}66,transparent)`,
        transformOrigin: "left",
        transform: coverDone ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 0.6s ease 0.2s",
      }} />

      {/* Message */}
      <div style={{ ...fade(0.3), position: "relative", zIndex: 1, flex: 1 }}>
        <p style={{
          fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.6vw,17px)",
          color: "#4B3080", lineHeight: 1.85, fontStyle: "italic"
        }}>
          "Every year with you is a gift.<br />
          May this day overflow with<br />
          all the joy you bring to mine. 🌸"
        </p>
      </div>

      {/* Emoji row */}
      <div style={{ ...fade(0.42), display: "flex", gap: 6, position: "relative", zIndex: 1 }}>
        {["🌟", "💜", "🎂", "💜", "🌟"].map((e, i) => (
          <motion.span key={i} animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, delay: i * 0.12, repeat: Infinity }}
            style={{ fontSize: "clamp(14px,1.9vw,22px)" }}>{e}</motion.span>
        ))}
      </div>

      {/* Celebrate button */}
      <div style={{ ...fade(0.54), position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
        <NavBtn onClick={onCelebrate}>🎉 Celebrate</NavBtn>
      </div>
    </div>

    {/* ── COVER — absolute overlay on left half, flips open ── */}
    <div style={{
      position: "absolute", top: 0, left: 0, width: HW, height: CH,
      perspective: 1400, zIndex: 20, pointerEvents: coverDone ? "none" : "auto"
    }}>
      <motion.div
        initial={{ rotateY: 0 }} animate={{ rotateY: -180 }}
        transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: "100%", height: "100%", transformOrigin: "right center",
          transformStyle: "preserve-3d", position: "relative"
        }}>
        {/* front face */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "20px 0 0 20px",
          backfaceVisibility: "hidden",
          background: `linear-gradient(145deg,${P.xpale},${P.pale},#DDD6FE)`,
          border: `1.5px solid ${P.pale}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14
        }}>
          <div style={{ fontSize: "clamp(44px,7vw,72px)" }}>🎂</div>
          <div style={{
            fontFamily: "Georgia,serif", fontSize: "clamp(18px,3vw,30px)",
            color: P.main, fontWeight: 700, textAlign: "center"
          }}>Happy<br />Birthday!</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["💜", "🌸", "💜"].map((e, i) => <span key={i} style={{ fontSize: "clamp(15px,2vw,22px)" }}>{e}</span>)}
          </div>
        </div>
        {/* back face — plain white so it looks clean when flipping */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "20px 0 0 20px",
          backfaceVisibility: "hidden", transform: "rotateY(180deg)",
          background: `linear-gradient(135deg,${P.xpale},#fff)`,
          border: `1.5px solid ${P.pale}`
        }} />
      </motion.div>
    </div>
  </div>;
}
function GreetingCardPage() {
  const [opened, setOpened] = useState(false); const nav = useNavigate();
  return <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
    <Particles /><FloatingHeartsAmbient /><CenterGlow /><TopBar /><BottomBar /><Corners />
    <div style={{
      position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", height: "100%", gap: "clamp(16px,3vh,30px)", padding: "clamp(16px,3vw,40px)"
    }}>
      <motion.div initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} style={{ textAlign: "center" }}>
        <PageLabel>✦ The Wait Is Over ✦</PageLabel>
        <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(24px,4.5vw,56px)", color: P.main, letterSpacing: "0.08em" }}>
          A Surprise Just For You</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.84 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
        <AnimatePresence mode="wait">
          {!opened ? <motion.div key="closed" exit={{ scale: 0.82, opacity: 0 }} transition={{ duration: 0.3 }}>
            <CardClosed onClick={() => setOpened(true)} /></motion.div>
            : <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <CardOpen onCelebrate={() => nav("/cake")} /></motion.div>}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{!opened && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          fontFamily: "'Courier Prime','Courier New',monospace", color: `${P.light}88`,
          letterSpacing: "0.22em", fontSize: "clamp(7px,0.9vw,10px)", textTransform: "uppercase"
        }}>
        Tap the card to open it</motion.p>}</AnimatePresence>
    </div>
  </div>;
}

/* ── 3. CAKE ───────────────────────────────────────────────────────────── */
function Candle({ blown, onClick }) {
  return <motion.div onClick={!blown ? onClick : undefined} style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", cursor: blown ? "default" : "pointer", position: "relative"
  }} whileHover={!blown ? { scale: 1.06 } : {}}>
    <AnimatePresence>{!blown && <motion.div key="flame" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0, y: -20 }} transition={{ duration: 0.4 }} style={{ position: "relative", marginBottom: -4 }}>
      <motion.div animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.6, 0.8, 0.5, 0.7, 0.6] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%",
          background: `radial-gradient(circle,${P.gold}88,transparent 70%)`
        }} />
      <motion.div animate={{ scaleX: [1, 0.85, 1.1, 0.9, 1], scaleY: [1, 1.1, 0.95, 1.05, 1], rotate: [-3, 4, -4, 3, -2] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 18, height: 28, background: `radial-gradient(ellipse at 50% 80%,${P.gold},#F97316,#EF4444)`,
          borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%", filter: "drop-shadow(0 0 8px #FCD34D)"
        }} />
    </motion.div>}</AnimatePresence>
    <AnimatePresence>{blown && <motion.div key="smoke" initial={{ opacity: 0.8, y: 0, scaleX: 1 }} animate={{ opacity: 0, y: -40, scaleX: 2.5 }}
      transition={{ duration: 1.2 }} style={{
        position: "absolute", top: 0, width: 6, height: 20, borderRadius: 6,
        background: "rgba(0,0,0,0.12)", filter: "blur(4px)"
      }} />}</AnimatePresence>
    <div style={{
      width: 16, height: 60, background: `linear-gradient(to right,${P.pale},${P.light},${P.pale})`,
      borderRadius: "4px 4px 2px 2px", boxShadow: `0 4px 16px ${P.light}44`, position: "relative"
    }}>
      <div style={{ position: "absolute", top: 8, left: -2, width: 6, height: 14, background: P.pale, borderRadius: "0 0 50% 50%" }} />
    </div>
    {!blown && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
      style={{
        position: "absolute", bottom: -28, fontFamily: "'Courier Prime','Courier New',monospace",
        fontSize: 9, color: P.light, letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap"
      }}>Click to blow!</motion.div>}
  </motion.div>;
}
/*
  Drips — measures the actual rendered width of the tier div,
  then fills it evenly with drip drops. Re-measures on resize.
  dripW = drip width px, gap = spacing between drip centers
*/
function Drips({ tierRef, dripW = 9, dripH = 13, color, borderColor, offsetTop = -6 }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const measure = () => {
      if (!tierRef.current) return;
      const w = tierRef.current.offsetWidth;
      const spacing = dripW + 6; // drip width + gap between drips
      const count = Math.floor(w / spacing);
      const leftover = w - count * spacing;
      const startPad = leftover / 2; // center the row
      setPositions(Array.from({ length: count }, (_, i) => startPad + i * spacing));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tierRef, dripW]);

  return <>
    {positions.map((x, i) => (
      <div key={i} style={{
        position: "absolute",
        top: offsetTop,
        left: x,
        width: dripW,
        height: dripH,
        background: color,
        borderRadius: "0 0 50% 50%",
        border: borderColor ? `1px solid ${borderColor}` : "none",
        pointerEvents: "none",
      }} />
    ))}
  </>;
}

function Cake({ blown, onBlow }) {
  const topRef = useRef(null);
  const midRef = useRef(null);
  const botRef = useRef(null);

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, position: "relative" }}
    >
      <Candle blown={blown} onClick={onBlow} />

      {/* ── Top tier ── */}
      <div style={{ position: "relative" }}>
        <div ref={topRef} style={{
          width: "clamp(110px,17vw,170px)", height: "clamp(40px,6vw,62px)",
          background: `linear-gradient(135deg,${P.pale},#DDD6FE,${P.light}55)`,
          borderRadius: "12px 12px 0 0",
          border: `1.5px solid ${P.pale}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 -4px 20px rgba(124,58,237,0.08)`,
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["💜", "💜", "💜"].map((e, i) => (
              <span key={i} style={{ fontSize: "clamp(11px,1.7vw,17px)" }}>{e}</span>
            ))}
          </div>
        </div>
        <Drips tierRef={topRef} dripW={9} dripH={13} color="#fff" borderColor={P.pale} offsetTop={-6} />
      </div>

      {/* ── Middle tier ── */}
      <div style={{ position: "relative" }}>
        <div ref={midRef} style={{
          width: "clamp(150px,22vw,225px)", height: "clamp(48px,7vw,74px)",
          background: `linear-gradient(135deg,${P.xpale},${P.pale},#C4B5FD44)`,
          border: `1.5px solid ${P.pale}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 20px rgba(124,58,237,0.08)`,
        }}>
          <span style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(12px,1.7vw,19px)",
            color: P.main, fontStyle: "italic", fontWeight: 700,
          }}>Happy Birthday</span>
        </div>
        <Drips tierRef={midRef} dripW={8} dripH={11} color={P.pale} offsetTop={-5} />
      </div>

      {/* ── Bottom tier ── */}
      <div style={{ position: "relative" }}>
        <div ref={botRef} style={{
          width: "clamp(190px,28vw,280px)", height: "clamp(54px,8vw,84px)",
          background: `linear-gradient(135deg,${P.pale},${P.xpale},${P.pale})`,
          borderRadius: "0 0 14px 14px",
          border: `1.5px solid ${P.pale}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 32px rgba(124,58,237,0.10)`,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["🌸", "🌟", "🎂", "🌟", "🌸"].map((e, i) => (
              <span key={i} style={{ fontSize: "clamp(13px,1.9vw,21px)" }}>{e}</span>
            ))}
          </div>
        </div>
        <Drips tierRef={botRef} dripW={9} dripH={12} color={P.light} offsetTop={-5} />
        {/* plate */}
        <div style={{
          position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
          width: "115%", height: 12,
          background: `linear-gradient(to right,transparent,${P.pale},${P.mid}33,${P.pale},transparent)`,
          borderRadius: "0 0 50% 50%",
        }} />
      </div>
    </motion.div>
  );
}
function CakeCelebrationPage() {
  const [blown, setBlown] = useState(false); const [confetti, setConfetti] = useState(false);
  const [fw, setFw] = useState(false); const [showNext, setShowNext] = useState(false); const nav = useNavigate();
  const handleBlow = () => {
    setBlown(true); setTimeout(() => { setConfetti(true); setFw(true); }, 300);
    setTimeout(() => setConfetti(false), 3200); setTimeout(() => setShowNext(true), 1800);
  };
  return <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
    <Particles /><CenterGlow color={blown ? "#FEF3C7" : P.xpale} /><TopBar /><BottomBar /><Corners />
    <Confetti active={confetti} /><Fireworks active={fw} />
    <div style={{
      position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", height: "100%", gap: "clamp(14px,2.5vh,28px)", padding: "clamp(16px,3vw,40px)"
    }}>
      <motion.div initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: "center" }}>
        <PageLabel>✦ Make a Wish ✦</PageLabel>
        <AnimatePresence mode="wait">
          {blown ? <motion.div key="b" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(26px,4.8vw,60px)", color: P.main, letterSpacing: "0.06em" }}>🎉 Happy Birthday! 🎉</div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontFamily: "Georgia,serif", fontSize: "clamp(12px,1.6vw,19px)", color: "#6B3FA0", fontStyle: "italic", marginTop: 6, maxWidth: 420, margin: "8px auto 0" }}>
              "You are the reason ordinary days feel like celebrations."</motion.div>
          </motion.div>
            : <motion.div key="u" exit={{ opacity: 0, y: -10 }}>
              <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(26px,4.8vw,60px)", color: P.main, letterSpacing: "0.06em" }}>Make a Wish!</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: "clamp(12px,1.5vw,17px)", color: `${P.light}BB`, fontStyle: "italic", marginTop: 4 }}>Blow out the candle to celebrate 🕯️</div>
            </motion.div>}
        </AnimatePresence>
      </motion.div>
      <Cake blown={blown} onBlow={handleBlow} />
      <AnimatePresence>{blown && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
        style={{ textAlign: "center", maxWidth: 400, fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.6vw,18px)", color: "#6B3FA0", fontStyle: "italic", lineHeight: 1.7 }}>
        Every candle blown is a year of memories<br />we've woven together. Here's to many more. 💜
      </motion.div>}</AnimatePresence>
      <AnimatePresence>{showNext && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <NavBtn onClick={() => nav("/album")}>Our Album →</NavBtn>
      </motion.div>}</AnimatePresence>
      {!blown && <p style={{
        fontFamily: "'Courier Prime','Courier New',monospace", color: `${P.light}88`,
        letterSpacing: "0.22em", fontSize: "clamp(7px,0.9vw,10px)", textTransform: "uppercase"
      }}>Click the candle flame to blow it out</p>}
    </div>
  </div>;
}

/* ── 4. ALBUM ──────────────────────────────────────────────────────────── */
/*
  Replace each photo value with your real image URL.
  e.g. photo: "/photos/trip.jpg"  OR  photo: "https://i.imgur.com/abc.jpg"
  Leave caption/date as you like. Add or remove entries freely.
*/
const ALBUM = [
  { id: 1, photo: null, caption: "First hello 👋", date: "Jan 2020", emoji: "🌟", rotate: -3 },
  { id: 2, photo: null, caption: "That crazy trip 🗺️", date: "Mar 2020", emoji: "🗺️", rotate: 2 },
  { id: 3, photo: null, caption: "Stargazing night 🌌", date: "Jul 2021", emoji: "🌌", rotate: -2 },
  { id: 4, photo: null, caption: "Best Christmas ever 🎄", date: "Dec 2021", emoji: "🎄", rotate: 3 },
  { id: 5, photo: null, caption: "Road trip vibes 🚗", date: "Apr 2022", emoji: "🚗", rotate: -1 },
  { id: 6, photo: null, caption: "Your birthday! 🎂", date: "Today ✨", emoji: "🎂", rotate: 2 },
  { id: 7, photo: null, caption: "Laughing until 2am 😂", date: "Aug 2022", emoji: "😂", rotate: -3 },
  { id: 8, photo: null, caption: "That concert night 🎶", date: "Sep 2022", emoji: "🎶", rotate: 1 },
  { id: 9, photo: null, caption: "Rainy day cuddles ☔", date: "Nov 2022", emoji: "☔", rotate: -2 },
  { id: 10, photo: null, caption: "New Year's magic 🎆", date: "Jan 2023", emoji: "🎆", rotate: 3 },
  { id: 11, photo: null, caption: "Beach day bliss 🌊", date: "May 2023", emoji: "🌊", rotate: -1 },
  { id: 12, photo: null, caption: "Always & forever 💜", date: "Always", emoji: "💜", rotate: 2 },
];

/* Single polaroid card */
function AlbumCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Stagger delay based on position
  const delay = (index % 4) * 0.08;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: item.rotate, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, rotate: item.rotate, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 10, boxShadow: `0 20px 60px rgba(124,58,237,0.22)` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 4,
        padding: "clamp(8px,1.2vw,14px)",
        paddingBottom: "clamp(36px,5vw,52px)",
        boxShadow: `0 4px 24px rgba(124,58,237,0.12), 0 1px 3px rgba(0,0,0,0.08)`,
        cursor: "pointer",
        position: "relative",
        transformOrigin: "center center",
        width: "clamp(130px,18vw,200px)",
        flexShrink: 0,
      }}
    >
      {/* Photo area */}
      <div style={{
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: 2,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${P.xpale}, ${P.pale})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {item.photo && !imgErr ? (
          <img
            src={item.photo}
            alt={item.caption}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <>
            <motion.span
              animate={{ scale: hovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{ fontSize: "clamp(28px,5vw,48px)", lineHeight: 1 }}
            >{item.emoji}</motion.span>
            {/* "Add photo" hint */}
            <div style={{
              position: "absolute", bottom: 5, right: 6,
              fontFamily: "'Courier Prime',monospace",
              fontSize: "clamp(6px,0.7vw,8px)",
              color: `${P.light}88`, letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>add photo</div>
          </>
        )}
        {/* Shimmer overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(135deg, transparent 40%, rgba(167,139,250,0.15))`,
          }}
        />
      </div>

      {/* Caption area — the polaroid bottom strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "clamp(6px,0.9vw,10px) clamp(8px,1.2vw,14px)",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <div style={{
          fontFamily: "'Courier Prime',monospace",
          fontSize: "clamp(6px,0.75vw,9px)",
          color: P.light, letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>{item.date}</div>
        <div style={{
          fontFamily: "Georgia,serif",
          fontSize: "clamp(9px,1.1vw,13px)",
          color: P.deep, fontWeight: 700,
          lineHeight: 1.2,
          whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{item.caption}</div>
      </div>

      {/* Tape strip at top */}
      <div style={{
        position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
        width: "clamp(32px,5vw,52px)", height: "clamp(14px,2vw,20px)",
        background: `${P.pale}CC`,
        borderRadius: 2,
        boxShadow: `0 1px 4px rgba(124,58,237,0.10)`,
      }} />
    </motion.div>
  );
}

/* Floating sparkle dots used as ambient decoration */
function AlbumSparkles() {
  const dots = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 3,
    dur: 2.5 + Math.random() * 2,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {dots.map(d => (
        <motion.div key={d.id}
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size,
            borderRadius: "50%",
            background: P.light,
          }}
        />
      ))}
    </div>
  );
}

function AlbumPage() {
  const nav = useNavigate();
  const [showBtn, setShowBtn] = useState(false);

  // Show the next button after user has had time to browse (4s)
  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: "relative" }}>
      <Particles />
      <AlbumSparkles />
      <TopBar />

      <div style={{ position: "relative", zIndex: 1, padding: "clamp(56px,9vh,90px) clamp(16px,4vw,48px) clamp(60px,10vh,100px)" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", marginBottom: "clamp(32px,5vh,60px)" }}
        >
          <PageLabel>✦ Our Photo Album ✦</PageLabel>
          <div style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: "clamp(30px,5vw,68px)",
            color: P.main, letterSpacing: "0.08em", lineHeight: 1,
          }}>Moments That Matter</div>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(13px,1.7vw,19px)",
              color: `${P.light}BB`, fontStyle: "italic", marginTop: 10,
            }}
          >Every picture holds a piece of my heart 💜</motion.div>
        </motion.div>

        {/* ── Gallery grid — masonry-style with offset rows ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(16px,2.5vw,32px)",
          justifyContent: "center",
          alignItems: "flex-start",
          maxWidth: 1100,
          margin: "0 auto",
        }}>
          {ALBUM.map((item, i) => (
            /* Every other card is nudged down to create a staggered look */
            <div key={item.id} style={{
              marginTop: i % 3 === 1 ? "clamp(20px,3vw,40px)" : i % 3 === 2 ? "clamp(10px,1.5vw,20px)" : 0,
            }}>
              <AlbumCard item={item} index={i} />
            </div>
          ))}
        </div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          style={{
            height: 1, maxWidth: 500, margin: "clamp(40px,7vh,80px) auto clamp(24px,4vh,48px)",
            background: `linear-gradient(90deg,transparent,${P.pale},${P.mid}44,${P.pale},transparent)`,
            transformOrigin: "center",
          }}
        />

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <div style={{ display: "flex", gap: 8, fontSize: "clamp(18px,2.8vw,30px)" }}>
            {["📸", "💜", "📷", "💜", "📸"].map((e, i) => (
              <motion.span key={i}
                animate={{ y: [0, -6, 0], rotate: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{ duration: 1.6, delay: i * 0.15, repeat: Infinity }}
              >{e}</motion.span>
            ))}
          </div>
          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(13px,1.7vw,19px)",
            color: "#6B3FA0", fontStyle: "italic",
            maxWidth: 420, lineHeight: 1.7,
          }}>
            Each photo is a chapter,<br />and the best ones are still being written.
          </p>

          <AnimatePresence>
            {showBtn && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <NavBtn onClick={() => nav("/timeline")}>Our Story →</NavBtn>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <BottomBar />
    </div>
  );
}

/* ── 5. TIMELINE ───────────────────────────────────────────────────────── */
const MEM = [
  {
    id: 1, date: "January 14, 2020", title: "The Day We Met",
    desc: "A chance encounter that changed everything. You walked in and the whole room felt warmer. I knew right then — this person is going to matter."
  },
  {
    id: 2, date: "March 22, 2020", title: "Our First Adventure",
    desc: "We got lost in the old town, laughed until our stomachs hurt, and found the tiny café that became our spot. Best kind of lost."
  },
  {
    id: 3, date: "July 4, 2021", title: "Stargazing Night",
    desc: "Lying on the grass, counting stars, sharing secrets we'd never told anyone. The sky felt infinite, and so did the moment."
  },
  {
    id: 4, date: "December 25, 2021", title: "The Best Holiday",
    desc: "Matching sweaters, terrible movies, hot cocoa, and the gift of just being together. You made it the most magical Christmas."
  },
  {
    id: 5, date: "April 10, 2022", title: "Road Trip to Nowhere",
    desc: "No GPS, no plan. Just two people and an open road. We ended up at the ocean and sat there in silence — the best kind."
  },
  {
    id: 6, date: "Today ✨", title: "Your Special Day",
    desc: "And now, on this beautiful day, I want you to know: every single one of these moments made my life infinitely richer. Happy Birthday."
  },
];

function TItem({ m, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1], delay: index * 0.06 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isLeft ? "flex-end" : "flex-start",
        paddingLeft: isLeft ? 0 : "calc(50% + 28px)",
        paddingRight: isLeft ? "calc(50% + 28px)" : 0,
        marginBottom: "clamp(24px,4vh,44px)",
        position: "relative",
      }}
    >
      {/* spine dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.35, delay: index * 0.06 + 0.15 }}
        style={{
          position: "absolute", left: "50%", top: 22,
          transform: "translateX(-50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: `linear-gradient(135deg,${P.main},${P.mid})`,
          border: "3px solid #fff", zIndex: 2,
          boxShadow: `0 0 0 3px ${P.pale},0 4px 14px ${P.main}55`,
        }}
      />
      {/* connector line segment from dot to card */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.06 + 0.2 }}
        style={{
          position: "absolute", top: 28,
          [isLeft ? "right" : "left"]: "calc(50% + 14px)",
          width: "clamp(14px,2vw,28px)",
          height: 2,
          background: `linear-gradient(${isLeft ? "to left" : "to right"},${P.pale},${P.mid}66)`,
          transformOrigin: isLeft ? "right center" : "left center",
        }}
      />

      {/* card */}
      <motion.div
        whileHover={{ y: -3, boxShadow: `0 12px 44px rgba(124,58,237,0.14)` }}
        transition={{ duration: 0.2 }}
        style={{
          background: "#fff",
          border: `1.5px solid ${P.pale}`,
          borderRadius: 18,
          padding: "clamp(18px,2.4vw,28px)",
          maxWidth: "clamp(240px,34vw,390px)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 4px 28px rgba(124,58,237,0.08)`,
        }}
      >
        {/* tint */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none",
          background: `linear-gradient(145deg,${P.xpale} 0%,transparent 50%)`,
        }} />

        {/* left accent bar */}
        <div style={{
          position: "absolute",
          [isLeft ? "right" : "left"]: 0,
          top: 16, bottom: 16, width: 3,
          background: `linear-gradient(to bottom,${P.mid},${P.pale})`,
          borderRadius: 99,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* date */}
          <div style={{
            fontFamily: "'Courier Prime','Courier New',monospace",
            fontSize: "clamp(7px,0.85vw,10px)",
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: P.light, marginBottom: 6,
          }}>{m.date}</div>

          {/* title */}
          <div style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(15px,1.9vw,22px)",
            color: P.main, fontWeight: 700,
            lineHeight: 1.2, marginBottom: 10,
          }}>{m.title}</div>

          {/* divider */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg,${P.pale},${P.mid}44,transparent)`,
            marginBottom: 10,
            borderRadius: 99,
          }} />

          {/* description */}
          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(12px,1.35vw,15px)",
            color: "#5B3A8C", lineHeight: 1.78,
            fontStyle: "italic", margin: 0,
          }}>{m.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TimelinePage() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: "relative" }}>
      <Particles /><TopBar />

      {/* vertical spine */}
      <div style={{
        position: "absolute", left: "50%", top: 100, bottom: 100, width: 2,
        transform: "translateX(-50%)",
        background: `linear-gradient(to bottom,transparent,${P.pale} 6%,${P.pale} 94%,transparent)`,
        zIndex: 0,
      }} />

      <div style={{ padding: "clamp(56px,9vh,96px) clamp(16px,4vw,40px) clamp(40px,6vh,80px)" }}>

        {/* header */}
        <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          style={{ textAlign: "center", marginBottom: "clamp(36px,6vh,72px)", position: "relative", zIndex: 1 }}>
          <PageLabel>✦ Our Story ✦</PageLabel>
          <div style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: "clamp(28px,4.8vw,62px)", color: P.main, letterSpacing: "0.08em"
          }}>
            Memories We've Made</div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{
              fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.6vw,18px)",
              color: `${P.light}BB`, fontStyle: "italic", marginTop: 8
            }}>
            Scroll through the moments that made us</motion.p>
        </motion.div>

        {/* items */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto" }}>
          {MEM.map((m, i) => <TItem key={m.id} m={m} index={i} />)}
        </div>

        {/* footer */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ once: true, margin: "-50px" }}
          style={{
            textAlign: "center", marginTop: "clamp(20px,4vh,52px)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            position: "relative", zIndex: 1
          }}>
          <div style={{ display: "flex", gap: 8, fontSize: "clamp(16px,2.5vw,26px)" }}>
            {["💜", "🌟", "💜", "🌟", "💜"].map((e, i) => (
              <motion.span key={i} animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}>{e}</motion.span>
            ))}
          </div>
          <p style={{
            fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.7vw,18px)",
            color: "#6B3FA0", fontStyle: "italic", maxWidth: 400, lineHeight: 1.7
          }}>
            And this is just the beginning of all<br />the beautiful chapters ahead of us.</p>
          <NavBtn onClick={() => nav("/gift")}>Continue →</NavBtn>
        </motion.div>
      </div>
      <BottomBar />
    </div>
  );
}

/* ── 6. GIFT PAGE ──────────────────────────────────────────────────────── */
/*
  Replace GIFT_IMAGE_URL with your real image URL.
  e.g. "/photos/special-moment.jpg"  or  "https://i.imgur.com/abc.jpg"
*/
const GIFT_IMAGE_URL = null; // ← replace with your image URL

function GiftBurst({ active }) {
  const pieces = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const dist = 90 + Math.random() * 80;
    const rad = angle * (Math.PI / 180);
    return {
      id: i, tx: Math.cos(rad) * dist, ty: Math.sin(rad) * dist,
      size: 7 + Math.random() * 9,
      color: [P.main, P.mid, P.light, P.rose, P.gold, "#FDE68A", "#C4B5FD"][i % 7],
      delay: Math.random() * 0.12,
      shape: i % 3 === 0 ? "50%" : i % 3 === 1 ? "3px" : "50% 0"
    };
  });
  return (
    <AnimatePresence>
      {active && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 30
        }}>
          {pieces.map(p => (
            <motion.div key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0, rotate: 360 }}
              transition={{ duration: 0.75, delay: p.delay, ease: "easeOut" }}
              style={{
                position: "absolute", width: p.size, height: p.size,
                borderRadius: p.shape, background: p.color,
                top: -p.size / 2, left: -p.size / 2
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

function GiftBox() {
  const [phase, setPhase] = useState("idle"); // idle | shaking | opening | open
  const [burst, setBurst] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("shaking");
    setTimeout(() => {
      setPhase("opening");
      setBurst(true);
      setTimeout(() => setBurst(false), 900);
      setTimeout(() => setPhase("open"), 550);
    }, 600);
  };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <GiftBurst active={burst} />

      {/* ── GIFT EMOJI BOX ── */}
      <AnimatePresence>
        {phase !== "open" && (
          <motion.div key="giftbox"
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={
              phase === "shaking"
                ? { scale: 1, opacity: 1, y: 0, rotate: [0, -10, 10, -8, 8, -5, 5, 0], x: [0, -6, 6, -5, 5, 0] }
                : phase === "opening"
                  ? { scale: [1, 1.18, 0], opacity: [1, 1, 0], y: [0, -20, -80], rotate: [0, 15, -20] }
                  : { scale: 1, opacity: 1, y: 0, rotate: 0, x: 0 }
            }
            transition={
              phase === "shaking" ? { duration: 0.6, ease: "easeInOut" }
                : phase === "opening" ? { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
                  : { duration: 0.7, ease: [0.23, 1, 0.32, 1] }
            }
            exit={{ scale: 0, opacity: 0, y: -60, transition: { duration: 0.4 } }}
            onClick={handleClick}
            style={{ cursor: "pointer", userSelect: "none", position: "relative" }}
          >
            {/* Idle pulse ring */}
            {phase === "idle" && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: -18, borderRadius: "50%",
                  background: `radial-gradient(circle,${P.pale},transparent 70%)`,
                  pointerEvents: "none", zIndex: 0
                }}
              />
            )}

            {/* 🎁 emoji */}
            <motion.div
              animate={phase === "idle" ? { y: [0, -8, 0], rotate: [0, -3, 3, 0] } : {}}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: "clamp(90px,18vw,140px)", lineHeight: 1,
                filter: "drop-shadow(0 8px 28px rgba(124,58,237,0.24))",
                position: "relative", zIndex: 1, display: "block",
              }}
            >🎁</motion.div>

            {/* Tap hint */}
            {phase === "idle" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  textAlign: "center", marginTop: 14,
                  fontFamily: "'Courier Prime','Courier New',monospace",
                  fontSize: "clamp(9px,1.1vw,12px)",
                  color: `${P.light}BB`, letterSpacing: "0.28em",
                  textTransform: "uppercase"
                }}>
                <motion.span animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}>
                  Tap to open 🎀
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REVEALED IMAGE ── */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div key="reveal"
            initial={{ scale: 0, opacity: 0, y: 40, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.05 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
          >
            {/* Photo circle */}
            <div style={{
              width: "clamp(150px,24vw,220px)", height: "clamp(150px,24vw,220px)",
              borderRadius: "50%", overflow: "hidden",
              border: `5px solid #fff`,
              boxShadow: `0 0 0 3px ${P.pale},0 16px 60px rgba(124,58,237,0.30)`,
              background: `linear-gradient(135deg,${P.pale},${P.mid})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, position: "relative",
            }}>
              {GIFT_IMAGE_URL && !imgErr ? (
                <img src={GIFT_IMAGE_URL} alt="Surprise!"
                  onError={() => setImgErr(true)}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    objectPosition: "center top", display: "block"
                  }} />
              ) : (
                <motion.span
                  animate={{ scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: "clamp(56px,10vw,88px)" }}>🥰</motion.span>
              )}
              {/* spinning shimmer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", inset: -3, borderRadius: "50%",
                  background: `conic-gradient(${P.main}44,transparent,${P.mid}44,transparent)`,
                  pointerEvents: "none"
                }}
              />
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{
                textAlign: "center", maxWidth: 360, padding: "0 16px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {["💜", "🌟", "🎁", "🌟", "💜"].map((e, i) => (
                  <motion.span key={i}
                    animate={{ y: [0, -6, 0], scale: [1, 1.18, 1] }}
                    transition={{ duration: 1.4, delay: i * 0.12, repeat: Infinity }}
                    style={{ fontSize: "clamp(16px,2.2vw,24px)" }}>{e}</motion.span>
                ))}
              </div>
              <div style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(17px,2.2vw,26px)",
                color: P.main, fontWeight: 700, lineHeight: 1.2
              }}>
                A little something for you 🎀</div>
              <p style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(13px,1.5vw,17px)",
                color: "#6B3FA0", fontStyle: "italic", lineHeight: 1.85, margin: 0
              }}>
                "This gift carries all the love words<br />
                can't quite hold. I hope it makes<br />
                you smile as wide as you make me. 💜"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GiftPage() {
  const nav = useNavigate();
  const [showNext, setShowNext] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowNext(true), 6000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
      <Particles /><CenterGlow /><TopBar /><BottomBar /><Corners />
      <div style={{
        position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", height: "100%",
        gap: "clamp(16px,3vh,28px)", padding: "clamp(16px,3vw,40px)", overflowY: "auto"
      }}>
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} style={{ textAlign: "center" }}>
          <PageLabel>✦ A Gift for You ✦</PageLabel>
          <div style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: "clamp(22px,4vw,52px)", color: P.main, letterSpacing: "0.07em"
          }}>
            Something Special</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
          <GiftBox />
        </motion.div>
        <AnimatePresence>
          {showNext && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <NavBtn onClick={() => nav("/question")}>One Last Thing →</NavBtn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


function FloatingHeartsActive({ active }) {
  const [h] = useState(() => Array.from({ length: 14 }, (_, i) => ({ id: i, x: 5 + Math.random() * 90, delay: Math.random() * 3, d: 4 + Math.random() * 5, size: 14 + Math.random() * 14, e: ["💜", "💜", "🌸", "🌟", "✨", "💕", "🥰"][i % 7] })));
  return <AnimatePresence>{active && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
    {h.map(x => <motion.div key={x.id} style={{ position: "absolute", left: `${x.x}%`, bottom: "-30px", fontSize: x.size }}
      initial={{ y: 0, opacity: 0 }} animate={{ y: -800, opacity: [0, 1, 1, 0] }} transition={{ duration: x.d, delay: x.delay, repeat: Infinity, ease: "linear" }}>{x.e}</motion.div>)}
  </div>}</AnimatePresence>;
}
function YesCelebration() {
  return <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}
    style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
    <motion.div animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.6, delay: 0.2 }}
      style={{ fontSize: "clamp(56px,9vw,96px)", lineHeight: 1 }}>🥰</motion.div>
    <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(26px,4.8vw,58px)", color: P.main, letterSpacing: "0.06em" }}>I knew it! 🎉</div>
    <div style={{ fontFamily: "Georgia,serif", fontSize: "clamp(15px,1.9vw,22px)", color: P.dark, fontWeight: 700, lineHeight: 1.3 }}>You mean the world to me.</div>
    <div style={{ fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.6vw,19px)", color: "#6B3FA0", fontStyle: "italic", maxWidth: 420, lineHeight: 1.75 }}>
      "There's no one else I'd rather celebrate with.<br />Thank you for being exactly who you are —<br />beautiful, kind, and endlessly wonderful.<br />Happy Birthday, truly."</div>
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      {["💜", "🌟", "🎂", "🌟", "💜"].map((e, i) => <motion.span key={i} animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.4, delay: i * 0.18, repeat: Infinity }} style={{ fontSize: "clamp(18px,2.8vw,30px)" }}>{e}</motion.span>)}
    </div>
    <div style={{ fontFamily: "'Courier Prime','Courier New',monospace", fontSize: "clamp(8px,1vw,11px)", color: P.light, letterSpacing: "0.3em", textTransform: "uppercase" }}>✦ Always & forever ✦</div>
  </motion.div>;
}
function FinalQuestionPage() {
  const [answered, setAnswered] = useState(false);
  const [noPos, setNoPos] = useState(null); // null = not moved yet
  const [noMoves, setNoMoves] = useState(0);
  const [confetti, setConfetti] = useState(false); const [fw, setFw] = useState(false);
  const noBtnRef = useRef(null);

  const handleYes = () => { setAnswered(true); setConfetti(true); setFw(true); setTimeout(() => setConfetti(false), 3500); };

  const handleNoHover = useCallback(() => {
    setNoMoves(m => m + 1);
    const BW = 130, BH = 52; // approx button size
    const pad = 20;
    // pick a random spot guaranteed to be fully inside viewport
    const x = pad + Math.random() * (window.innerWidth - BW - pad * 2);
    const y = pad + Math.random() * (window.innerHeight - BH - pad * 2);
    setNoPos({ x, y });
  }, []);

  const noLabel = noMoves === 0 ? "No 🙅" : noMoves < 3 ? "Nope 😅" : noMoves < 6 ? "Catch me! 😂" : noMoves < 10 ? "Never! 🏃" : "Give up! 😂";

  return <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
    <Particles /><CenterGlow /><TopBar /><BottomBar /><Corners />
    <Confetti active={confetti} /><Fireworks active={fw} /><FloatingHeartsActive active={answered} />

    {/* No button — fixed to viewport so it truly stays on screen */}
    {!answered && noPos && (
      <motion.button
        ref={noBtnRef}
        onMouseEnter={handleNoHover}
        onTouchStart={handleNoHover}
        animate={{ left: noPos.x, top: noPos.y }}
        initial={{ left: noPos.x, top: noPos.y }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        style={{
          position: "fixed", zIndex: 50,
          background: "transparent", border: `1.5px solid ${P.pale}`, color: P.light,
          padding: "14px 28px", borderRadius: 12,
          fontFamily: "'Courier Prime','Courier New',monospace",
          fontSize: 13, letterSpacing: "0.2em", cursor: "not-allowed",
          textTransform: "uppercase", whiteSpace: "nowrap",
          boxShadow: `0 4px 16px rgba(124,58,237,0.08)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span key={noLabel}
            initial={{ opacity: 0, y: -8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            transition={{ duration: 0.22 }}
            style={{ display: "inline-block" }}
          >{noLabel}</motion.span>
        </AnimatePresence>
      </motion.button>
    )}

    <div style={{
      position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", height: "100%", gap: "clamp(18px,3.5vh,40px)", padding: "clamp(16px,3vw,40px)"
    }}>
      <AnimatePresence mode="wait">
        {!answered ? <motion.div key="q" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.8 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(16px,3vh,32px)" }}>
          <div style={{ textAlign: "center" }}>
            <PageLabel>✦ Final Question ✦</PageLabel>
            <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: "clamp(24px,4.5vw,56px)", color: P.main, letterSpacing: "0.06em" }}>
              Did You Like This Surprise?</div>
          </div>

          {/* Bouncy face */}
          <motion.div animate={{ scale: [1, 1.08, 1, 1.05, 1], rotate: [0, -3, 3, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "clamp(90px,14vw,136px)", height: "clamp(90px,14vw,136px)", borderRadius: "50%",
              background: `linear-gradient(135deg,${P.xpale},${P.pale},#DDD6FE)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(44px,7.5vw,72px)",
              border: `3px solid ${P.pale}`, boxShadow: `0 8px 40px rgba(124,58,237,0.16)`
            }}>🥺</motion.div>

          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.6vw,19px)", color: "#6B3FA0", fontStyle: "italic", textAlign: "center", maxWidth: 360, lineHeight: 1.7 }}>
            "I put my whole heart into this.<br />I really hope it made you smile. 💜"</p>

          {/* YES + NO side by side — No is inline until first hover, then teleports to fixed */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <motion.button onClick={handleYes}
              whileHover={{ scale: 1.08, boxShadow: `0 12px 40px ${P.main}55` }} whileTap={{ scale: 0.94 }}
              style={{
                background: P.main, border: "none", color: "#fff",
                padding: "16px 48px", borderRadius: 12,
                fontFamily: "'Courier Prime','Courier New',monospace",
                fontSize: 14, letterSpacing: "0.28em", cursor: "pointer",
                textTransform: "uppercase", boxShadow: `0 4px 24px ${P.main}44`, fontWeight: 700
              }}>
              Yes 💜
            </motion.button>

            {/* Inline No — only shown before first hover */}
            {noPos === null && (
              <motion.button
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                whileHover={{ scale: 1.04 }}
                style={{
                  background: "transparent", border: `1.5px solid ${P.pale}`, color: P.light,
                  padding: "16px 32px", borderRadius: 12,
                  fontFamily: "'Courier Prime','Courier New',monospace",
                  fontSize: 13, letterSpacing: "0.2em", cursor: "not-allowed",
                  textTransform: "uppercase", whiteSpace: "nowrap"
                }}>
                No 🙅
              </motion.button>
            )}
          </div>

          {/* Hint message */}
          <AnimatePresence>
            {noMoves > 0 && <motion.p key="hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                fontFamily: "'Courier Prime','Courier New',monospace",
                fontSize: "clamp(8px,1vw,11px)", color: P.light, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center"
              }}>
              <AnimatePresence mode="wait">
                <motion.span key={noMoves}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "inline-block" }}
                >
                  {noMoves < 3 ? "That button keeps running away 😂" : noMoves < 6 ? "It knows the truth! 💜" : noMoves < 10 ? "You can't catch it! 🏃" : "There's only one answer here! 🎉"}
                </motion.span>
              </AnimatePresence>
            </motion.p>}
          </AnimatePresence>

        </motion.div>
          : <motion.div key="yes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <YesCelebration /></motion.div>}
      </AnimatePresence>
    </div>
  </div>;
}

/* ── APP ───────────────────────────────────────────────────────────────── */
export default function App() {
  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#fff;overflow-x:hidden;}
      ::-webkit-scrollbar{width:6px;}
      ::-webkit-scrollbar-track{background:#F5F3FF;}
      ::-webkit-scrollbar-thumb{background:#A78BFA;border-radius:8px;}
    `}</style>
    <HashRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<CountdownPage />} />
          <Route path="/card" element={<GreetingCardPage />} />
          <Route path="/cake" element={<CakeCelebrationPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/gift" element={<GiftPage />} />
          <Route path="/question" element={<FinalQuestionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </HashRouter>
  </>;
}