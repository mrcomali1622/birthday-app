import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { P } from "./theme";
import { Particles, TopBar, BottomBar, Corners, CenterGlow, NavBtn, PageLabel, Confetti, Fireworks, Drips } from "./SharedUI";

function Candle({ blown, onClick }) {
  return (
    <motion.div
      onClick={!blown ? onClick : undefined}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: blown ? "default" : "pointer", position: "relative" }}
      whileHover={!blown ? { scale: 1.05 } : {}}
    >
      {/* Flame */}
      <AnimatePresence>
        {!blown && (
          <motion.div
            key="flame"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ position: "relative", marginBottom: -4 }}
          >
            {/* outer glow */}
            <motion.div
              animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.6, 0.8, 0.5, 0.7, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 36, height: 36, borderRadius: "50%",
                background: `radial-gradient(circle,${P.gold}88,transparent 70%)`,
              }}
            />
            {/* flame shape */}
            <motion.div
              animate={{ scaleX: [1, 0.85, 1.1, 0.9, 1], scaleY: [1, 1.1, 0.95, 1.05, 1], rotate: [-3, 4, -4, 3, -2] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 18, height: 28,
                background: `radial-gradient(ellipse at 50% 80%,${P.gold},#F97316,#EF4444)`,
                borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
                filter: "drop-shadow(0 0 8px #FCD34D)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smoke after blow */}
      <AnimatePresence>
        {blown && (
          <motion.div
            key="smoke"
            initial={{ opacity: 0.8, y: 0, scaleX: 1 }}
            animate={{ opacity: 0, y: -40, scaleX: 2.5 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "absolute", top: 0,
              width: 6, height: 20, borderRadius: 6,
              background: "rgba(0,0,0,0.12)",
              filter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Candle stick */}
      <div style={{
        width: 16, height: 60,
        background: `linear-gradient(to right,${P.pale},${P.light},${P.pale})`,
        borderRadius: "4px 4px 2px 2px",
        boxShadow: `0 4px 16px ${P.light}44`,
        position: "relative",
      }}>
        {/* wax drips */}
        {/* <div style={{
          position: "absolute", top: 8, left: -2, width: 6, height: 14,
          background: P.pale, borderRadius: "0 0 50% 50%",
        }} /> */}
      </div>

      {!blown && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{
            position: "absolute", bottom: -28,
            fontFamily: "'Courier Prime',monospace",
            fontSize: 9, color: P.light, letterSpacing: "0.2em",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}
        >Click to blow!</motion.div>
      )}
    </motion.div>
  );
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
        <Drips tierRef={topRef} dripW={9} dripH={13} color={P.light} borderColor={P.pale} offsetTop={0} />
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
        <Drips tierRef={midRef} dripW={8} dripH={11} color={P.light} offsetTop={0} />
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
        <Drips tierRef={botRef} dripW={9} dripH={12} color={P.light} offsetTop={0} />
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

export default function CakeCelebrationPage() {
  const [blown, setBlown] = useState(false); const [confetti, setConfetti] = useState(false);
  const [fw, setFw] = useState(false); const [showNext, setShowNext] = useState(false); const nav = useNavigate();
  const handleBlow = () => {
    setBlown(true); setTimeout(() => { setConfetti(true); setFw(true); }, 300);
    setTimeout(() => setConfetti(false), 3200); setTimeout(() => setShowNext(true), 1800);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
      <Particles /><CenterGlow color={blown ? "#FEF3C7" : P.xpale} /><TopBar /><BottomBar /><Corners />
      <Confetti active={confetti} /><Fireworks active={fw} />
      <div style={{
        position: "relative", zIndex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", height: "100%", gap: "clamp(14px,2.5vh,28px)", padding: "clamp(16px,3vw,40px)"
      }}>
        <motion.div initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: "center" }}>
          <PageLabel>✦ 💜💜💜 ✦</PageLabel>
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
          <NavBtn onClick={() => nav("/memories")}>Our Memories →</NavBtn>
        </motion.div>}</AnimatePresence>
        {!blown && <p style={{
          fontFamily: "'Courier Prime','Courier New',monospace", color: `${P.light}88`,
          letterSpacing: "0.22em", fontSize: "clamp(7px,0.9vw,10px)", textTransform: "uppercase"
        }}>Click the candle flame to blow it out</p>}
      </div>
      {/* <AudioPlayer src={require("../assets/mp3/cakecut.mpeg")} volume={0.35} /> */}
    </div>
  )
}
