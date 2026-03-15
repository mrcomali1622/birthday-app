import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { P } from "./theme";
import { Particles, TopBar, BottomBar, Corners, CenterGlow, NavBtn, PageLabel } from "./SharedUI";

function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 5,
      d: 5 + Math.random() * 6,
      size: 14 + Math.random() * 12,
    }))
  );
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          style={{ position: "absolute", left: `${h.x}%`, bottom: "-30px", fontSize: h.size }}
          animate={{ y: [0, -600], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: h.d, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          💜
        </motion.div>
      ))}
    </div>
  );
}

/* ── CLOSED CARD ──────────────────────────────────────────────────────── */
function CardClosed({ onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -10, boxShadow: `0 40px 100px rgba(124,58,237,0.28)` }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "relative",
        width: "clamp(250px,34vw,380px)",
        height: "clamp(340px,48vw,520px)",
        borderRadius: 24,
        background: "#fff",
        border: `1.5px solid ${P.pale}`,
        boxShadow: `0 16px 56px rgba(124,58,237,0.14), 0 2px 0 ${P.pale}`,
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(22px,3.5vw,38px)",
        userSelect: "none",
      }}
    >
      {/* Tint overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
        background: `linear-gradient(155deg,${P.xpale} 0%,transparent 55%)`,
      }} />
      {/* Decorative rings */}
      {[160, 115, 72].map((s, i) => (
        <div key={s} style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: s, height: s, borderRadius: "50%",
          border: `1px solid ${P.pale}`, opacity: 0.7 - i * 0.18,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <PageLabel>✦ A Special Message ✦</PageLabel>
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: "clamp(60px,10vw,90px)", lineHeight: 1 }}
        >🎂</motion.div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(24px,4vw,44px)",
          color: P.main, fontWeight: 700, lineHeight: 1.15, marginTop: 14,
          textShadow: `0 2px 22px ${P.pale}`,
        }}>
          Happy<br />Birthday!
        </div>

        <div style={{
          width: 46, height: 2, margin: "11px auto 0",
          background: `linear-gradient(90deg,transparent,${P.gold},transparent)`,
          borderRadius: 99,
        }} />
        <div style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(12px,1.8vw,18px)",
          color: P.main, fontStyle: "italic", marginTop: 8,
        }}>Swetha 💜</div>
      </div>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          position: "relative", zIndex: 1,
          fontFamily: "'Courier Prime', monospace",
          fontSize: "clamp(7px,0.9vw,10px)",
          color: P.light, letterSpacing: "0.3em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <span>✦</span><span>Click to open</span><span>✦</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Ruled paper lines ────────────────────────────────────────────── */
function RuledLines({ count = 14, color = "rgba(167,139,250,0.09)" }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 99 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: 18, right: 14,
          top: `${8 + i * (84 / count)}%`, height: "0.5px",
          background: color,
        }} />
      ))}
    </div>
  );
}

/* ── OPEN CARD ────────────────────────────────────────────────────────── */
/*
  Layout: a fixed-size book sitting centred on screen.
  The book has two equal halves side by side.
  Left half = photo panel (always visible, static).
  Right half = message panel (always visible, static).
  On top of the LEFT half sits the cover page which rotates
  away (rotateY: 0 → -180) from the RIGHT spine edge,
  revealing the left photo panel underneath.
*/
function CardOpen({ onCelebrate }) {
  const [coverDone, setCoverDone] = useState(false);

  // Trigger reveal after cover flip completes (1s) — reliable without framer onAnimationComplete
  useEffect(() => {
    const t = setTimeout(() => setCoverDone(true), 1050);
    return () => clearTimeout(t);
  }, []);

  const HALF_W = "clamp(200px,28vw,340px)";
  const CARD_H = "clamp(360px,50vw,540px)";

  // CSS transition helper — avoids broken framer conditional animate
  const fade = (delay = 0, extra = {}) => ({
    opacity: coverDone ? 1 : 0,
    transform: coverDone ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    ...extra,
  });

  return (
    <div style={{ display: "flex", position: "relative", boxShadow: `0 24px 80px rgba(124,58,237,0.15)` }}>

      {/* ── LEFT: photo panel ── */}
      <div style={{
        width: HALF_W, height: CARD_H, flexShrink: 0, overflow: "hidden",
        position: "relative", zIndex: 1,
        borderRadius: "20px 0 0 20px",
        background: `linear-gradient(145deg, ${P.xpale} 0%, ${P.pale} 50%, #DDD6FE 100%)`,
        border: `1.5px solid ${P.pale}`, borderRight: "none",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 16, padding: 24,
      }}>
        {/* spine shadow */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 16,
          zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to left, rgba(124,58,237,0.12), transparent)",
        }} />

        {/* Avatar — replace YOUR_PHOTO_URL with your image link */}
        <div style={{
          ...fade(0),
          width: "clamp(100px,16vw,150px)", height: "clamp(100px,16vw,150px)",
          borderRadius: "50%", overflow: "hidden", flexShrink: 0,
          boxShadow: `0 8px 32px rgba(124,58,237,0.26)`, border: "4px solid #fff",
          background: `linear-gradient(135deg, ${P.pale}, ${P.mid})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src={require("../assets/profile.jpeg")}
            alt="Birthday person"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            onError={e => { e.target.replaceWith(Object.assign(document.createTextNode("🙂"))) }}
          />
        </div>

        <div style={fade(0.18)}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(15px,2.2vw,22px)",
            color: P.main, fontWeight: 700, textAlign: "center",
          }}>Swetha Devi💜</div>
          <div style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: 9, color: P.light, letterSpacing: "0.22em",
            fontWeight: 800,
            textTransform: "uppercase", marginTop: 4, textAlign: "center",
          }}>a name that feels as beautiful as the heart behind it. 🌹</div>
        </div>

        <div style={{ ...fade(0.32), display: "flex", gap: 10 }}>
          {["🌸", "💜", "🌸"].map((e, i) => (
            <motion.span key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, delay: i * 0.35, repeat: Infinity }}
              style={{ fontSize: "clamp(16px,2.2vw,24px)" }}
            >{e}</motion.span>
          ))}
        </div>
      </div>

      {/* ── RIGHT: message panel ── */}
      <div style={{
        width: HALF_W, height: CARD_H, flexShrink: 0, overflow: "hidden",
        position: "relative", zIndex: 999,
        borderRadius: "0 20px 20px 0",
        background: "#fff",
        border: `1.5px solid ${P.pale}`, borderLeft: "none",
        display: "flex", flexDirection: "column",
        padding: "clamp(20px,3vw,34px)", gap: "clamp(10px,1.6vw,18px)",
        boxShadow: `10px 0 44px rgba(124,58,237,0.10)`,
      }}>
        <RuledLines />
        {/* tint */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "0 20px 20px 0",
          pointerEvents: "none",
          background: `linear-gradient(155deg, ${P.xpale} 0%, transparent 50%)`,
        }} />

        {/* Header */}
        <div style={{ ...fade(0), position: "relative", zIndex: 1, }}>
          <PageLabel>✦ With Love ✦</PageLabel>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(20px,3.2vw,34px)",
            color: P.main, fontWeight: 700, lineHeight: 1.1,
          }}>Happy<br />Birthday! 🎉</div>
        </div>

        {/* Divider — CSS scale transition */}
        <div style={{
          height: "1px", position: "relative", zIndex: 1,
          background: `linear-gradient(90deg,${P.pale},${P.mid}55,transparent)`,
          transformOrigin: "left center",
          transform: coverDone ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.7s cubic-bezier(0.23,1,0.32,1) 0.18s",
        }} />

        {/* Message */}
        <div style={{ ...fade(0.3), position: "relative", zIndex: 1, flex: 1 }}>
          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "clamp(13px,1.6vw,18px)",
            color: "#4B3080", lineHeight: 1.85, fontStyle: "italic",
          }}>
            "Every day with you is a gift.<br />
            May this day overflow with<br />
            all the joy you bring to mine. 🌸"
          </p>
        </div>

        {/* Emoji row */}
        <div style={{ ...fade(0.44), display: "flex", gap: 6, position: "relative", zIndex: 1, justifyContent: 'center' }}>
          {["🌟", "💜", "🎂", "💜", "🌟"].map((e, i) => (
            <motion.span key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, delay: i * 0.12, repeat: Infinity }}
              style={{ fontSize: "clamp(14px,1.9vw,22px)" }}
            >{e}</motion.span>
          ))}
        </div>

        {/* Celebrate button */}
        <div style={{ ...fade(0.56), position: "relative", zIndex: 99, display: "flex", justifyContent: "center" }}>
          <NavBtn onClick={onCelebrate}>🎉 Celebrate</NavBtn>
        </div>
      </div>

      {/* ── COVER — absolute on left half, flips open like real card ── */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: HALF_W, height: CARD_H,
        perspective: 1400, zIndex: 20,
        pointerEvents: coverDone ? "none" : "auto",
      }}>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -180 }}
          transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
          style={{
            width: "100%", height: "100%",
            transformOrigin: "right center",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Front face */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "20px 0 0 20px",
            backfaceVisibility: "hidden",
            background: `linear-gradient(145deg, ${P.xpale}, ${P.pale}, #DDD6FE)`,
            border: `1.5px solid ${P.pale}`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 14,
          }}>
            <div style={{ fontSize: "clamp(44px,7vw,72px)" }}>🎂</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(18px,3vw,30px)",
              color: P.main, fontWeight: 700, textAlign: "center",
            }}>Happy<br />Birthday!</div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {["💜", "🌸", "💜"].map((e, i) => (
                <span key={i} style={{ fontSize: "clamp(15px,2vw,22px)" }}>{e}</span>
              ))}
            </div>
          </div>
          {/* Back face */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "20px 0 0 20px",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${P.xpale}, #fff)`,
            border: `1.5px solid ${P.pale}`,
          }} />
        </motion.div>
      </div>
    </div>
  );
}

/* ── PAGE ─────────────────────────────────────────────────────────────── */
export default function GreetingCardPage() {
  const [opened, setOpened] = useState(false);
  const nav = useNavigate();

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
      <Particles />
      <FloatingHearts />
      <CenterGlow />
      <TopBar />
      <BottomBar />
      <Corners />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%",
        gap: "clamp(18px,3vh,32px)",
        padding: "clamp(16px,3vw,40px)",
      }}>
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center" }}
        >
          <PageLabel>✦ The wait is over ✦</PageLabel>
          <div style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: "clamp(26px,4.8vw,58px)",
            color: P.main, letterSpacing: "0.08em",
          }}>A Surprise For You</div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="closed"
                exit={{ scale: 0.82, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardClosed onClick={() => setOpened(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CardOpen onCelebrate={() => nav("/cakecut")} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hint */}
        <AnimatePresence>
          {!opened && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "'Courier Prime', monospace",
                color: `${P.light}88`,
                letterSpacing: "0.22em",
                fontSize: "clamp(7px,0.9vw,10px)",
                textTransform: "uppercase",
              }}
            >
              Tap the card to open it
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {/* <AudioPlayer src={require("../assets/mp3/greetcard.mp3")} volume={0.35} /> */}
    </div>
  );
}