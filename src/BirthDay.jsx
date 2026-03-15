/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const CANDLE_COUNT = 7;
const CANDLE_COLORS = ["#FF6B9D", "#FF9F43", "#54A0FF", "#A29BFE", "#00D2D3", "#FF6B6B", "#FECA57"];

const milestones = [
  { year: "2018", title: "First Meeting ✨", desc: "That awkward-but-perfect first hello. Neither of us knew this would be the start of something incredible.", emoji: "🤝", color: "#FF6B9D", photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=280&fit=crop" },
  { year: "2019", title: "First Road Trip 🚗", desc: "We got lost three times, sang every song on the playlist, and somehow made it the best trip ever.", emoji: "🗺️", color: "#FF9F43", photo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=280&fit=crop" },
  { year: "2020", title: "Through the Chaos 💙", desc: "When the world went sideways, our friendship grew stronger. Late-night calls that lasted till sunrise.", emoji: "🌙", color: "#54A0FF", photo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=280&fit=crop" },
  { year: "2021", title: "The Big Wins 🏆", desc: "Celebrated every milestone together — big and small. Your cheerleader, always and forever.", emoji: "🏆", color: "#A29BFE", photo: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=280&fit=crop" },
  { year: "2022", title: "Adventures Abound 🌍", desc: "New cities, new memories. Laughing till our stomachs hurt in places we'd never been before.", emoji: "✈️", color: "#00D2D3", photo: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=280&fit=crop" },
  { year: "2023", title: "Growing Together 🌱", desc: "Watched each other evolve, stumble, and rise. Still the first call for everything that matters.", emoji: "💫", color: "#FF6B9D", photo: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=280&fit=crop" },
  { year: "2024", title: "Right Now 🎂", desc: "Here we are — another year, another reason to celebrate YOU. The best is absolutely yet to come.", emoji: "🎈", color: "#FF9F43", photo: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=280&fit=crop" },
];

/* ─── Custom cursor + heart trail ─── */
function CustomCursor() {
  const cx = useMotionValue(-100), cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 500, damping: 35 }), sy = useSpring(cy, { stiffness: 500, damping: 35 });
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(0), lastRef = useRef(0);
  useEffect(() => {
    const fn = (e) => {
      cx.set(e.clientX - 10); cy.set(e.clientY - 10);
      const now = Date.now();
      if (now - lastRef.current > 90) {
        lastRef.current = now;
        const id = idRef.current++;
        setHearts(h => [...h.slice(-18), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setHearts(h => h.filter(hh => hh.id !== id)), 950);
      }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (<>
    <motion.div style={{ position: "fixed", top: 0, left: 0, x: sx, y: sy, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(circle,#FF6B9D,#FF9F43)", pointerEvents: "none", zIndex: 99999, boxShadow: "0 0 12px #FF6B9D88", mixBlendMode: "screen" }} />
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998 }}>
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div key={h.id} initial={{ opacity: 1, scale: 0.4, x: h.x - 8, y: h.y - 8 }} animate={{ opacity: 0, scale: 1.3, x: h.x - 8, y: h.y - 42 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ position: "fixed", fontSize: 14, userSelect: "none", pointerEvents: "none" }}>❤️</motion.div>
        ))}
      </AnimatePresence>
    </div>
  </>);
}

function Stars() {
  const stars = useRef(Array.from({ length: 90 }, (_, i) => ({ left: `${(i * 137.5) % 100}%`, top: `${(i * 97.3) % 100}%`, size: i % 7 === 0 ? 3 : 1.5, dur: 2 + i % 3, del: (i % 4) * 0.7 }))).current;
  return (<>{stars.map((s, i) => (
    <div key={i} style={{ position: "fixed", left: s.left, top: s.top, width: s.size, height: s.size, background: "white", borderRadius: "50%", animation: `starTwinkle ${s.dur}s ${s.del}s infinite`, pointerEvents: "none", zIndex: 0 }} />
  ))}</>);
}

function FireworkBurst({ x, y, color, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 500 }}>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * 360, d = 55 + Math.random() * 45;
        return (<motion.div key={i} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: d * Math.cos(a * Math.PI / 180), y: d * Math.sin(a * Math.PI / 180), opacity: 0, scale: 0.3 }} transition={{ duration: 0.85 + Math.random() * 0.3, ease: "easeOut" }} style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />);
      })}
    </div>
  );
}
function Fireworks({ active }) {
  const [bursts, setBursts] = useState([]);
  const idRef = useRef(0);
  useEffect(() => {
    if (!active) return;
    let c = 0;
    const colors = ["#FF6B9D", "#FF9F43", "#FECA57", "#54A0FF", "#00D2D3", "#A29BFE", "#FF6B6B", "#48DBFB"];
    const go = () => {
      if (c >= 28) return; c++;
      const id = idRef.current++;
      setBursts(b => [...b, { id, color: colors[Math.floor(Math.random() * colors.length)], x: 80 + Math.random() * (window.innerWidth - 160), y: 60 + Math.random() * (window.innerHeight * 0.65) }]);
      setTimeout(go, 150 + Math.random() * 220);
    }; go();
  }, [active]);
  const rm = useCallback((id) => setBursts(b => b.filter(bb => bb.id !== id)), []);
  return (<div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 499 }}>{bursts.map(b => <FireworkBurst key={b.id} {...b} onDone={() => rm(b.id)} />)}</div>);
}

function Confetti({ active }) {
  const pieces = useRef(Array.from({ length: 100 }, (_, i) => ({ id: i, x: Math.random() * 100, color: `hsl(${Math.random() * 360},90%,60%)`, size: Math.random() * 10 + 5, xd: (Math.random() - 0.5) * 320, ye: Math.random() * 180 + 90, rot: Math.random() * 720 - 360, del: Math.random() * 0.9, dur: Math.random() * 1.5 + 1.2, sh: Math.random() > 0.5 ? "circle" : "rect" }))).current;
  return (
    <AnimatePresence>
      {active && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 300, overflow: "hidden" }}>
          {pieces.map(p => (
            <motion.div key={p.id} initial={{ x: `${p.x}vw`, y: "-5vh", opacity: 1, rotate: 0, scale: 0 }} animate={{ x: `calc(${p.x}vw + ${p.xd}px)`, y: `${p.ye}vh`, opacity: 0, rotate: p.rot, scale: 1 }} transition={{ duration: p.dur, delay: p.del, ease: [0.23, 1, 0.32, 1] }} style={{ position: "absolute", top: 0, width: p.size, height: p.sh === "circle" ? p.size : p.size * 0.5, background: p.color, borderRadius: p.sh === "circle" ? "50%" : 2 }} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Real Greeting Card ─── */
function GreetingCard({ onOpen }) {
  const [state, setState] = useState("closed"); // closed | opening | open
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || state === "open") return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setMousePos({ x, y });
  };

  const handleClick = () => {
    if (state !== "closed") return;
    setState("opening");
    setTimeout(() => setState("open"), 900);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "20px", perspective: "1400px" }}>

      {/* Table surface */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "38vh", background: "linear-gradient(to top,#0d0020,#160030)", borderTop: "1px solid rgba(255,107,157,0.08)", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "38vh", left: 0, right: 0, height: 1, background: "linear-gradient(to right,transparent,rgba(255,107,157,0.15),transparent)", zIndex: 0 }} />

      <AnimatePresence mode="wait">

        {/* CLOSED STATE */}
        {state === "closed" && (
          <motion.div key="closed"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            onClick={handleClick}
            initial={{ opacity: 0, y: 60, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateY: mousePos.x, rotateX: -mousePos.y }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{
              width: "clamp(300px,85vw,440px)",
              cursor: "pointer",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            {/* Card shadow on table */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scaleX: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ position: "absolute", bottom: -20, left: "10%", right: "10%", height: 30, background: "rgba(255,107,157,0.15)", borderRadius: "50%", filter: "blur(12px)", zIndex: -1 }}
            />

            {/* ENVELOPE BACK */}
            <div style={{ width: "100%", borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
              {/* Envelope flap */}
              <div style={{
                width: "100%", height: 0,
                borderLeft: "220px solid transparent",
                borderRight: "220px solid transparent",
                borderTop: "120px solid #1a0035",
                position: "relative",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
              }}>
                <div style={{ position: "absolute", top: -115, left: -30, right: -30, textAlign: "center", fontSize: 22, pointerEvents: "none" }}>💌</div>
              </div>
            </div>

            {/* CARD BODY */}
            <div style={{
              background: "linear-gradient(145deg,#1e0038,#2a0050,#1a0038)",
              borderRadius: "0 0 8px 8px",
              padding: "44px 40px 48px",
              border: "1px solid rgba(255,107,157,0.25)",
              borderTop: "none",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Paper texture lines */}
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${12 + i * 11}%`, height: 1, background: "rgba(255,255,255,0.025)" }} />
              ))}

              {/* Shimmer sweep */}
              <motion.div animate={{ x: [-400, 500] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                style={{ position: "absolute", top: 0, left: 0, width: 100, height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)", pointerEvents: "none" }} />

              {/* Wax seal */}
              <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#FF9F43,#e05010)", boxShadow: "0 4px 16px rgba(224,80,16,0.6),inset 0 -2px 4px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "3px solid #2a0050", zIndex: 5 }}>🌟</div>

              {/* Decorative border inside */}
              <div style={{ position: "absolute", inset: 10, border: "1px solid rgba(255,107,157,0.12)", borderRadius: 6, pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 14, border: "1px solid rgba(255,107,157,0.06)", borderRadius: 4, pointerEvents: "none" }} />

              {/* Corner flourishes */}
              {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos, i) => (
                <div key={i} style={{ position: "absolute", ...(pos.includes("top") ? { top: 18 } : { bottom: 18 }), ...(pos.includes("left") ? { left: 18 } : { right: 18 }), fontSize: 14, opacity: 0.35, color: "#FF9F43" }}>✦</div>
              ))}

              <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                {/* Floral decoration */}
                <div style={{ fontSize: 11, letterSpacing: "0.5em", color: "rgba(255,159,67,0.6)", marginBottom: 18, textTransform: "uppercase" }}>— ✿ —</div>

                <motion.div animate={{ y: [0, -6, 0], filter: ["drop-shadow(0 0 8px #FF6B9D)", "drop-shadow(0 0 20px #FF9F43)", "drop-shadow(0 0 8px #FF6B9D)"] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ fontSize: 56, marginBottom: 20, display: "block" }}>🎂</motion.div>

                <div style={{ fontSize: "clamp(10px,1.8vw,12px)", letterSpacing: "0.45em", color: "rgba(255,159,67,0.7)", textTransform: "uppercase", marginBottom: 14 }}>A Birthday Wish</div>

                <h2 style={{ fontSize: "clamp(22px,5vw,36px)", fontWeight: 400, fontStyle: "italic", margin: "0 0 18px", color: "white", lineHeight: 1.35, textShadow: "0 0 30px rgba(255,107,157,0.3)" }}>
                  Wishing you a day<br />as wonderful as you are
                </h2>

                {/* Hand-written style quote */}
                <div style={{ margin: "0 0 24px", padding: "16px 20px", borderLeft: "2px solid rgba(255,107,157,0.4)", borderRight: "2px solid rgba(255,107,157,0.4)", position: "relative" }}>
                  <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", background: "#2a0050", padding: "0 8px", fontSize: 14 }}>❝</div>
                  <p style={{ fontSize: "clamp(12px,1.9vw,14px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.9, fontStyle: "italic", margin: 0 }}>
                    Some people make the world more beautiful<br />just by being in it.
                  </p>
                  <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", background: "#2a0050", padding: "0 8px", fontSize: 14, transform: "translateX(-50%) rotate(180deg)" }}>❝</div>
                </div>

                <motion.div animate={{ opacity: [0.5, 1, 0.5], y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,rgba(255,107,157,0.15),rgba(255,159,67,0.15))", border: "1px solid rgba(255,107,157,0.35)", borderRadius: 50, padding: "10px 24px", fontSize: 12, color: "#FF9F43", letterSpacing: "0.2em" }}>
                  ✦ Click to open ✦
                </motion.div>
              </div>
            </div>

            {/* Ribbon */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 2, height: "100%", background: "linear-gradient(to bottom,rgba(255,107,157,0.6),transparent)", pointerEvents: "none" }} />
          </motion.div>
        )}

        {/* OPENING ANIMATION */}
        {state === "opening" && (
          <motion.div key="opening"
            initial={{ rotateY: 0, scale: 1 }}
            animate={{ rotateY: [-5, -15, -25], scale: [1, 1.02, 0.96], opacity: [1, 1, 0] }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
            style={{ width: "clamp(300px,85vw,440px)", height: 500, background: "linear-gradient(145deg,#1e0038,#2a0050)", borderRadius: 12, border: "1px solid rgba(255,107,157,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}
          >
            💌
          </motion.div>
        )}

        {/* OPEN STATE — real card spread */}
        {state === "open" && (
          <motion.div key="open"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 0, width: "clamp(340px,94vw,860px)", position: "relative" }}
          >
            {/* Card top edge / spine */}
            <div style={{ height: 8, background: "linear-gradient(to right,#1a0035,#2d0055,#1a0035)", borderRadius: "12px 12px 0 0", boxShadow: "0 -4px 20px rgba(255,107,157,0.15)" }} />

            <div style={{ display: "flex", minHeight: "clamp(380px,65vh,540px)", borderRadius: "0 0 12px 12px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.75),0 0 0 1px rgba(255,107,157,0.15)" }}>

              {/* LEFT PANEL — photo side */}
              <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                style={{ flex: "0 0 48%", position: "relative", overflow: "hidden", background: "#0d0020" }}>
                <motion.img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=700&fit=crop" alt="friendship"
                  initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.72 }} />

                {/* Overlay gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(26,0,53,0.5) 0%,transparent 60%,rgba(26,0,53,0.7) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,0,32,0.95) 0%,transparent 45%)" }} />

                {/* Decorative frame */}
                <div style={{ position: "absolute", inset: 12, border: "1px solid rgba(255,107,157,0.2)", borderRadius: 4, pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 16, border: "1px solid rgba(255,107,157,0.08)", borderRadius: 2, pointerEvents: "none" }} />

                {/* Corner roses */}
                {["top-left", "top-right"].map((pos, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                    style={{ position: "absolute", ...(pos.includes("top") ? { top: 20 } : { bottom: 20 }), ...(pos.includes("left") ? { left: 20 } : { right: 20 }), fontSize: 18, opacity: 0.5, filter: "drop-shadow(0 0 6px #FF6B9D)" }}>🌸</motion.div>
                ))}

                {/* Bottom text */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
                  style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "rgba(255,159,67,0.7)", textTransform: "uppercase", marginBottom: 8 }}>Friends Since</div>
                  <div style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 300, fontStyle: "italic", color: "white", textShadow: "0 0 20px rgba(255,107,157,0.5)", lineHeight: 1.2 }}>2018 — Present</div>
                  <div style={{ marginTop: 8, height: 1, width: 60, background: "linear-gradient(to right,#FF6B9D,transparent)" }} />
                </motion.div>
              </motion.div>

              {/* SPINE line */}
              <div style={{ width: 3, background: "linear-gradient(to bottom,#2d0055,rgba(255,107,157,0.3),#2d0055)", flexShrink: 0 }} />

              {/* RIGHT PANEL — message */}
              <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                style={{ flex: 1, background: "linear-gradient(160deg,#1e0040,#160030,#200045)", padding: "clamp(28px,4vw,48px) clamp(24px,4vw,44px)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>

                {/* Paper lines */}
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${8 + i * 9}%`, height: 1, background: "rgba(255,255,255,0.022)" }} />
                ))}

                {/* Shimmer */}
                <motion.div animate={{ x: [-300, 400] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }} style={{ position: "absolute", top: 0, left: 0, width: 80, height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)", pointerEvents: "none" }} />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <div style={{ height: 1, flex: 1, background: "linear-gradient(to right,rgba(255,107,157,0.4),transparent)" }} />
                      <span style={{ fontSize: 20 }}>🎀</span>
                      <div style={{ height: 1, flex: 1, background: "linear-gradient(to left,rgba(255,107,157,0.4),transparent)" }} />
                    </div>
                    <div style={{ fontSize: "clamp(9px,1.6vw,11px)", letterSpacing: "0.45em", color: "rgba(255,159,67,0.65)", textTransform: "uppercase", marginBottom: 12 }}>A special message for you</div>
                    <h3 style={{ fontSize: "clamp(18px,3.5vw,28px)", fontWeight: 400, fontStyle: "italic", margin: "0 0 18px", color: "white", lineHeight: 1.4, textShadow: "0 0 20px rgba(255,107,157,0.25)" }}>
                      To the one who makes<br />every day brighter,
                    </h3>
                  </motion.div>

                  {/* Handwritten-feel message */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} style={{ position: "relative" }}>
                    {/* Pen nib decoration */}
                    <div style={{ position: "absolute", left: -10, top: 0, width: 3, height: "100%", background: "linear-gradient(to bottom,rgba(255,107,157,0.4),transparent)", borderRadius: 2 }} />
                    <p style={{ fontSize: "clamp(12px,1.85vw,14.5px)", lineHeight: 2.05, color: "rgba(255,255,255,0.72)", fontStyle: "italic", marginBottom: 18, paddingLeft: 14 }}>
                      From that very first hello to every adventure since — you've been the kind of friend that stories are made of.
                    </p>
                    <p style={{ fontSize: "clamp(12px,1.85vw,14.5px)", lineHeight: 2.05, color: "rgba(255,255,255,0.72)", fontStyle: "italic", marginBottom: 0, paddingLeft: 14 }}>
                      The kind that shows up, stays up, and never gives up. Today every candle we light carries a wish — that your life stays as beautiful as the joy you bring.
                    </p>
                  </motion.div>
                </div>

                {/* Signature area */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,107,157,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", marginBottom: 6 }}>With love,</div>
                        <div style={{ fontSize: "clamp(16px,3vw,26px)", fontStyle: "italic", color: "#FF9F43", fontWeight: 300, textShadow: "0 0 12px rgba(255,159,67,0.4)" }}>Your Friend 💝</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["🌸", "💕", "✨"].map((e, i) => (
                          <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} style={{ fontSize: 20 }}>{e}</motion.span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(255,107,157,0.5)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={onOpen}
                      style={{ width: "100%", background: "linear-gradient(135deg,#FF6B9D,#FF9F43)", border: "none", borderRadius: 50, padding: "14px 32px", fontSize: "clamp(13px,2vw,15px)", fontWeight: 700, color: "white", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'Georgia',serif", boxShadow: "0 4px 24px rgba(255,107,157,0.4)" }}
                    >
                      🎂 Let the Celebration Begin →
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Card bottom shadow */}
            <div style={{ height: 6, background: "linear-gradient(to right,rgba(255,107,157,0.08),rgba(255,159,67,0.12),rgba(255,107,157,0.08))", borderRadius: "0 0 8px 8px" }} />
            <div style={{ height: 4, background: "rgba(0,0,0,0.4)", margin: "0 12px", borderRadius: "0 0 8px 8px", filter: "blur(4px)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── 3D Candle ─── */
function Candle3D({ index, lit, smoking }) {
  const color = CANDLE_COLORS[index % CANDLE_COLORS.length];
  const [puffs, setPuffs] = useState([]);
  const puffId = useRef(0);
  useEffect(() => {
    if (!smoking) return;
    setPuffs([]);
    const iv = setInterval(() => {
      const id = puffId.current++;
      setPuffs(p => [...p.slice(-8), { id, ox: (Math.random() - 0.5) * 10 }]);
      setTimeout(() => setPuffs(p => p.filter(pp => pp.id !== id)), 1800);
    }, 160);
    const t = setTimeout(() => { clearInterval(iv); }, 2400);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [smoking]);
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", top: -44, left: "50%", width: 0, height: 0 }}>
        <AnimatePresence>
          {puffs.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0.7, scale: 0.2, x: p.ox, y: 0 }} animate={{ opacity: 0, scale: 2.8, x: p.ox + (Math.random() - 0.5) * 22, y: -52 }} exit={{ opacity: 0 }} transition={{ duration: 1.4, ease: "easeOut" }} style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,200,200,0.65),transparent)", pointerEvents: "none", marginLeft: -9, marginTop: -9 }} />
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {lit && (
          <motion.div key="fl" initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} exit={{ scaleY: 0, opacity: 0 }} style={{ transformOrigin: "bottom center", marginBottom: -1 }}>
            <motion.div animate={{ scaleX: [1, 0.7, 1, 0.85, 1], scaleY: [1, 1.25, 1, 1.1, 1], rotate: [-3, 3, -1, 2, -2] }} transition={{ duration: 0.35, repeat: Infinity }} style={{ width: 9, height: 20, background: `radial-gradient(ellipse at 50% 100%,${color},#FFF9C4 45%,transparent)`, borderRadius: "50% 50% 20% 20%", filter: `drop-shadow(0 0 7px ${color}) drop-shadow(0 0 2px #fff)` }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ width: 2, height: 6, background: lit ? "#666" : "#aaa", borderRadius: 1, marginBottom: -1, zIndex: 3 }} />
      <div style={{ position: "relative", width: 13, height: 42 }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right,${color}70 0%,${color} 35%,rgba(255,255,255,0.25) 60%,${color}90 100%)`, borderRadius: "4px 4px 2px 2px", boxShadow: lit ? `0 0 14px ${color}77` : "none", transition: "box-shadow 0.4s" }} />
        <div style={{ position: "absolute", right: -4, top: 2, width: 7, height: 38, background: `${color}40`, borderRadius: "0 4px 4px 0", transform: "skewY(-1deg)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 5, background: "rgba(255,255,255,0.15)", borderRadius: "4px 4px 0 0" }} />
      </div>
    </div>
  );
}

/* ─── 3D Cake ─── */
function Cake3D({ onClick, allBlown, cakeClicked }) {
  const tiers = [
    { w: 200, bw: 220, h: 65, top: "#FF6B9D", side: "#D44875", dots: 8 },
    { w: 265, bw: 285, h: 74, top: "#FF9F43", side: "#D47B25", dots: 10 },
    { w: 330, bw: 352, h: 82, top: "#FECA57", side: "#C8A020", dots: 12 },
  ];
  return (
    <motion.div onClick={onClick} animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "relative", cursor: allBlown ? "default" : "pointer" }}>
      {!allBlown && !cakeClicked && (
        <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ position: "absolute", inset: -16, borderRadius: 24, border: "2px solid rgba(255,159,67,0.4)", pointerEvents: "none", zIndex: 10 }} />
      )}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 3, marginBottom: 0 }}>
        {Array.from({ length: CANDLE_COUNT }, (_, i) => <Candle3D key={i} index={i} lit={!allBlown && !cakeClicked} smoking={cakeClicked && i < CANDLE_COUNT} />)}
      </div>
      {tiers.map((t, ti) => (
        <div key={ti} style={{ margin: "0 auto", width: t.bw, position: "relative" }}>
          {/* Top frosting */}
          <div style={{ width: t.w, height: 20, background: "linear-gradient(to bottom,#fff 0%,#f5f5f5 60%,#e8e8e8 100%)", borderRadius: "50%", margin: "0 auto", position: "relative", zIndex: 3, boxShadow: "0 -3px 10px rgba(0,0,0,0.12)" }}>
            {Array.from({ length: t.dots }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: `${(i / (t.dots - 1)) * 84 + 6}%`, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", background: ["#FF6B9D", "#FF9F43", "#54A0FF", "#FECA57", "#00D2D3"][i % 5], boxShadow: `0 0 4px ${["#FF6B9D", "#FF9F43", "#54A0FF", "#FECA57", "#00D2D3"][i % 5]}88` }} />
            ))}
          </div>
          {/* Front face */}
          <div style={{ width: t.w, height: t.h, background: `linear-gradient(170deg,${t.top} 0%,${t.side} 100%)`, margin: "0 auto", position: "relative", zIndex: 2, boxShadow: "inset -10px 0 20px rgba(0,0,0,0.18),inset 10px 0 20px rgba(255,255,255,0.08)" }}>
            {ti === 0 && <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.2em", fontStyle: "italic" }}>for you ♡</div>}
            {ti === 1 && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 17, whiteSpace: "nowrap", letterSpacing: 4 }}>🌸 🎀 🌸</div>}
            {ti === 2 && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 11, fontWeight: "bold", color: "rgba(0,0,0,0.45)", letterSpacing: "0.18em", whiteSpace: "nowrap" }}>HAPPY BIRTHDAY!</div>}
            {/* Side depth */}
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 16, background: "rgba(0,0,0,0.15)", borderRadius: "0 2px 2px 0" }} />
          </div>
          {/* Bottom depth shadow */}
          <div style={{ width: t.bw, height: 12, background: `linear-gradient(to bottom,${t.side},rgba(0,0,0,0.35))`, margin: "0 auto", borderRadius: "0 0 6px 6px", transform: "scaleY(0.45) translateY(-3px)", zIndex: 1 }} />
        </div>
      ))}
      {/* Plate */}
      <div style={{ position: "relative", margin: "0 auto", width: 390 }}>
        <div style={{ height: 16, background: "linear-gradient(to bottom,#ddd,#bbb)", borderRadius: "50% / 80%", boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }} />
        <div style={{ height: 8, background: "linear-gradient(to bottom,#bbb,#999)", margin: "0 14px", borderRadius: "0 0 50% 50%" }} />
      </div>
    </motion.div>
  );
}

/* ─── Milestone Card ─── */
function MilestoneCard({ m, index, isLeft }) {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  const [photo, setPhoto] = useState(m.photo);
  const [imgErr, setImgErr] = useState(false);
  const ref = useRef(null);
  const fRef = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", marginBottom: 60, position: "relative" }}>
      <motion.div animate={{ boxShadow: [`0 0 8px ${m.color}`, `0 0 20px ${m.color}`, `0 0 8px ${m.color}`] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", left: "50%", top: 36, width: 16, height: 16, borderRadius: "50%", background: m.color, transform: "translate(-50%,-50%)", border: "3px solid #080012", zIndex: 2 }} />
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -70 : 70 }}
        animate={vis ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -70 : 70 }}
        transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1], delay: index * 0.05 }}
        onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        whileHover={{ y: -6 }}
        style={{ width: "clamp(260px,43%,410px)", background: "rgba(255,255,255,0.045)", border: `1px solid ${m.color}55`, borderRadius: 22, overflow: "hidden", backdropFilter: "blur(14px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      >
        <div style={{ position: "relative", height: 180, overflow: "hidden", cursor: "pointer" }} onClick={() => fRef.current.click()}>
          {!imgErr
            ? <motion.img src={photo} alt={m.title} onError={() => setImgErr(true)} animate={{ scale: hov ? 1.08 : 1 }} transition={{ duration: 0.5 }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${m.color}22,${m.color}55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{m.emoji}</div>
          }
          <motion.div animate={{ opacity: hov ? 1 : 0.25 }} style={{ position: "absolute", inset: 0, background: `linear-gradient(to top,${m.color}99 0%,transparent 55%)`, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "10px 12px" }}>
            <motion.span animate={{ opacity: hov ? 1 : 0 }} style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "white" }}>📸 Change</motion.span>
            <div style={{ background: `${m.color}cc`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "white" }}>{m.year}</div>
          </motion.div>
        </div>
        <input ref={fRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setPhoto(URL.createObjectURL(f)); setImgErr(false); } }} />
        <div style={{ padding: "18px 22px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22, filter: `drop-shadow(0 0 5px ${m.color})` }}>{m.emoji}</span>
            <h3 style={{ fontSize: "clamp(14px,2.2vw,17px)", fontWeight: 700, margin: 0, color: "white" }}>{m.title}</h3>
          </div>
          <p style={{ fontSize: "clamp(11px,1.7vw,13px)", lineHeight: 1.8, color: "#ffffffaa", margin: 0, fontStyle: "italic" }}>{m.desc}</p>
          <motion.div animate={{ width: hov ? "100%" : "35%" }} transition={{ duration: 0.5 }} style={{ marginTop: 14, height: 2, borderRadius: 2, background: `linear-gradient(to right,${m.color},transparent)` }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Panda Screen ─── */
function PandaScreen() {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);
  const [confettiOn, setConfettiOn] = useState(false);
  const moveNo = () => {
    setNoPos({ x: (Math.random() - 0.5) * Math.min(window.innerWidth - 140, 360), y: (Math.random() - 0.5) * Math.min(window.innerHeight - 80, 280) });
  };
  const handleYes = () => { setYesClicked(true); setConfettiOn(true); setTimeout(() => setConfettiOn(false), 3500); };
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", position: "relative", zIndex: 1, textAlign: "center" }}>
      <Confetti active={confettiOn} />
      <AnimatePresence mode="wait">
        {!yesClicked ? (
          <motion.div key="q" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div style={{ position: "relative", height: 110, width: 200, marginBottom: 0 }}>
              {[{ x: -65, y: 14, s: 0.85, r: -14, d: 0.3 }, { x: 65, y: 14, s: 0.85, r: 14, d: 0.5 }, { x: 0, y: 0, s: 1.2, r: 0, d: 0 }].map((p, i) => (
                <motion.div key={i} animate={{ y: [0, -10, 0], rotate: [p.r - 4, p.r + 4, p.r - 4] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: p.d }}
                  style={{ position: "absolute", left: "50%", top: 0, fontSize: i === 2 ? 70 : 50, transform: `translateX(calc(-50% + ${p.x}px)) translateY(${p.y}px) scale(${p.s})`, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>🐼</motion.div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "clamp(10px,1.8vw,12px)", letterSpacing: "0.4em", color: "#FF9F43", textTransform: "uppercase", marginBottom: 12 }}>🐼 The pandas want to know 🐼</div>
              <h2 style={{ fontSize: "clamp(22px,5vw,46px)", fontWeight: 400, fontStyle: "italic", color: "white", margin: "0 0 10px", lineHeight: 1.35 }}>
                Did you enjoy this<br />
                <span style={{ background: "linear-gradient(135deg,#FF6B9D,#FF9F43,#FECA57)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>birthday surprise? 🎂</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(12px,1.9vw,14px)", fontStyle: "italic", margin: "10px 0 0" }}>🐼 The pandas worked very hard on this...</p>
            </div>
            <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap", minHeight: 90 }}>
              <motion.button whileHover={{ scale: 1.1, boxShadow: "0 0 40px #FF6B9D99" }} whileTap={{ scale: 0.92 }} onClick={handleYes}
                style={{ background: "linear-gradient(135deg,#FF6B9D,#FF9F43)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 17, fontWeight: 700, color: "white", letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'Georgia',serif", boxShadow: "0 0 20px #FF6B9D55" }}>
                🐼 Yes! I loved it!
              </motion.button>
              <motion.button onHoverStart={moveNo} onFocus={moveNo} animate={{ x: noPos.x, y: noPos.y }} transition={{ type: "spring", stiffness: 320, damping: 18 }}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 50, padding: "15px 44px", fontSize: 17, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", cursor: "not-allowed", fontFamily: "'Georgia',serif", whiteSpace: "nowrap" }}>
                😅 No...
              </motion.button>
            </div>
            <motion.p animate={{ opacity: [0.25, 0.65, 0.25] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.2em", fontStyle: "italic" }}>
              🐼 the "no" button has legs apparently 🐼
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="y" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, maxWidth: 540 }}>
            <motion.div animate={{ rotate: [0, 12, -12, 12, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.9, repeat: 2 }} style={{ fontSize: 80 }}>🐼</motion.div>
            <h2 style={{ fontSize: "clamp(26px,6vw,50px)", fontWeight: 400, fontStyle: "italic", color: "white", margin: 0, lineHeight: 1.3, textAlign: "center" }}>
              Yayyy! The pandas<br />
              <span style={{ background: "linear-gradient(135deg,#FF6B9D,#FF9F43,#FECA57)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>are SO happy! 🎉</span>
            </h2>
            <p style={{ fontSize: "clamp(13px,2.5vw,16px)", lineHeight: 1.9, color: "rgba(255,255,255,0.7)", fontStyle: "italic", textAlign: "center" }}>
              You made our day! 🐼💕 Now go celebrate —<br />you deserve all the bamboo… err, birthday cake!
            </p>
            <div style={{ display: "flex", gap: 10, fontSize: 34 }}>
              {["🐼", "🎂", "🐼", "🎉", "🐼"].map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -12, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>{e}</motion.span>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.35em", textTransform: "uppercase" }}>Made with ❤️ &amp; 🐼 energy — just for you</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══ MAIN APP ══ */
export default function BirthdayApp() {
  const [screen, setScreen] = useState(1);
  const [litCandles, setLitCandles] = useState(() => new Set(Array.from({ length: CANDLE_COUNT }, (_, i) => i)));
  const [smokingCandles, setSmokingCandles] = useState(new Set());
  const [allBlown, setAllBlown] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [cakeClicked, setCakeClicked] = useState(false);
  const [poppers, setPoppers] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(true);
  const timelineRef = useRef(null);
  const wishRef = useRef(null);

  /* Lock/unlock body scroll */
  useEffect(() => {
    if (screen === 2 && scrollLocked) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => { document.body.style.overflow = ""; document.body.style.touchAction = ""; };
  }, [scrollLocked, screen]);

  const blowAll = useCallback(() => {
    if (allBlown || cakeClicked) return;
    setCakeClicked(true);
    Array.from({ length: CANDLE_COUNT }, (_, i) => i).forEach(i => {
      setTimeout(() => {
        setLitCandles(p => { const n = new Set(p); n.delete(i); return n; });
        setSmokingCandles(p => { const n = new Set(p); n.add(i); return n; });
        setTimeout(() => setSmokingCandles(p => { const n = new Set(p); n.delete(i); return n; }), 1600);
      }, i * 130);
    });
    setTimeout(() => {
      setAllBlown(true);
      setScrollLocked(false);
      setFireworks(true);
      setTimeout(() => setFireworks(false), 5500);
    }, CANDLE_COUNT * 130 + 600);
  }, [allBlown, cakeClicked]);

  /* Wheel / touch guard while locked */
  useEffect(() => {
    if (screen !== 2) return;
    const block = (e) => { if (scrollLocked) { e.preventDefault(); e.stopPropagation(); } };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => { window.removeEventListener("wheel", block); window.removeEventListener("touchmove", block); };
  }, [scrollLocked, screen]);

  useEffect(() => {
    if (!wishRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPoppers(true); setTimeout(() => setPoppers(false), 3500); }
    }, { threshold: 0.5 });
    obs.observe(wishRef.current);
    return () => obs.disconnect();
  }, [screen]);

  return (
    <div style={{ fontFamily: "'Georgia',serif", background: "#080012", minHeight: "100vh", color: "white", overflowX: "hidden" }}>
      <style>{`
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes starTwinkle{0%,100%{opacity:0.12;transform:scale(1)}50%{opacity:0.85;transform:scale(1.4)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
      `}</style>

      <CustomCursor />
      <Stars />
      {screen === 2 && <><Fireworks active={fireworks} /><Confetti active={poppers} /></>}

      <AnimatePresence mode="wait">

        {/* ── Screen 1 ── */}
        {screen === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -80, transition: { duration: 0.45 } }}>
            <GreetingCard onOpen={() => { setScreen(2); setScrollLocked(true); }} />
          </motion.div>
        )}

        {/* ── Screen 2 ── */}
        {screen === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }}>

            {/* Scroll lock overlay hint */}
            <AnimatePresence>
              {scrollLocked && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(255,107,157,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,107,157,0.3)", borderRadius: 50, padding: "10px 24px", fontSize: 12, color: "rgba(255,159,67,0.9)", letterSpacing: "0.2em", zIndex: 200, whiteSpace: "nowrap", pointerEvents: "none" }}>
                  🎂 Blow out the candles to scroll
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero */}
            <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "40px 20px", zIndex: 1 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} style={{ textAlign: "center", marginBottom: 36 }}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ fontSize: "clamp(11px,2vw,13px)", letterSpacing: "0.45em", color: "#FF9F43", textTransform: "uppercase", marginBottom: 12 }}>✦ make a wish ✦</motion.div>
                <h1 style={{ fontSize: "clamp(40px,9vw,88px)", fontWeight: 400, fontStyle: "italic", margin: 0, lineHeight: 1.1, background: "linear-gradient(135deg,#FF6B9D,#FF9F43,#FECA57,#FF6B9D)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>Happy Birthday</h1>
                <h2 style={{ fontSize: "clamp(26px,7vw,64px)", fontWeight: 700, margin: "8px 0 0", color: "white", textShadow: "0 0 40px #FF6B9D55" }}>Dear Friend 🎂</h2>
              </motion.div>

              <AnimatePresence>
                {!allBlown && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: "#FF9F43cc", fontSize: "clamp(13px,2.5vw,15px)", marginBottom: 24, letterSpacing: "0.12em", textAlign: "center", animation: "pulse 2s infinite" }}>
                    🎂 Click the cake to blow out the candles! 🎂
                  </motion.p>
                )}
              </AnimatePresence>

              <Cake3D onClick={blowAll} allBlown={allBlown} cakeClicked={cakeClicked} />

              <AnimatePresence>
                {allBlown && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} style={{ marginTop: 44, textAlign: "center" }}>
                    <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ fontSize: "clamp(18px,4vw,34px)", fontStyle: "italic", color: "#FECA57", marginBottom: 22 }}>🌟 Make a wish! 🌟</motion.div>
                    <motion.button whileHover={{ scale: 1.07, boxShadow: "0 0 40px #FF6B9D99" }} whileTap={{ scale: 0.95 }} onClick={() => timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      style={{ background: "linear-gradient(135deg,#FF6B9D,#FF9F43)", border: "none", borderRadius: 50, padding: "13px 36px", fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'Georgia',serif", boxShadow: "0 0 20px #FF6B9D55" }}>
                      ✨ Reveal Our Story ✨
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!allBlown && (
                <motion.div animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", bottom: 28, color: "#ffffff44", fontSize: 12, letterSpacing: "0.2em" }}>
                  🎂 click the cake first 🎂
                </motion.div>
              )}
            </section>

            {/* Timeline */}
            <section ref={timelineRef} style={{ padding: "80px 20px 60px", position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto" }}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: 72 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.4em", color: "#54A0FF", textTransform: "uppercase", marginBottom: 14 }}>✦ our journey ✦</div>
                <h2 style={{ fontSize: "clamp(28px,7vw,54px)", fontWeight: 400, fontStyle: "italic", margin: "0 0 12px", color: "white" }}>Milestones &amp; Memories</h2>
                <p style={{ color: "#ffffff44", fontSize: 12, letterSpacing: "0.15em", margin: 0 }}>📸 Click any photo to replace with your own</p>
              </motion.div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#FF6B9D,#FF9F43,#54A0FF,#A29BFE,#00D2D3,#FF6B9D,#FF9F43)", transform: "translateX(-50%)", opacity: 0.3 }} />
                {milestones.map((m, i) => <MilestoneCard key={i} m={m} index={i} isLeft={i % 2 === 0} />)}
              </div>
            </section>

            {/* Wish */}
            <section ref={wishRef} style={{ minHeight: "55vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px 80px", position: "relative", zIndex: 1, textAlign: "center" }}>
              <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} style={{ maxWidth: 620 }}>
                <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 56, marginBottom: 22 }}>🎈</motion.div>
                <h2 style={{ fontSize: "clamp(26px,6vw,48px)", fontWeight: 400, fontStyle: "italic", color: "white", marginBottom: 18, lineHeight: 1.3 }}>
                  Here's to you,<br />
                  <span style={{ background: "linear-gradient(135deg,#FF6B9D,#FF9F43,#FECA57)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>today and always.</span>
                </h2>
                <p style={{ fontSize: "clamp(14px,2.5vw,16px)", lineHeight: 2, color: "#ffffffaa", fontStyle: "italic", marginBottom: 40 }}>
                  Of all the people I've met in this lifetime, you are one of the rarest. Not just because of how much you give, but because of who you simply <em>are</em>. Thank you for existing. May this year bring you everything you deserve — and you deserve <em>everything.</em>
                </p>
                <motion.button whileHover={{ scale: 1.07, boxShadow: "0 0 40px #A29BFE88" }} whileTap={{ scale: 0.95 }} onClick={() => setScreen(3)}
                  style={{ background: "linear-gradient(135deg,#A29BFE,#FF6B9D)", border: "none", borderRadius: 50, padding: "14px 40px", fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'Georgia',serif", boxShadow: "0 0 20px #A29BFE44" }}>
                  🐼 Continue →
                </motion.button>
              </motion.div>
            </section>
          </motion.div>
        )}

        {/* ── Screen 3 ── */}
        {screen === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
            <PandaScreen />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}