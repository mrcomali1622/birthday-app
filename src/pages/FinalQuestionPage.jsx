import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { P } from "./theme";
import { Particles, TopBar, BottomBar, Corners, CenterGlow, PageLabel, Confetti, Fireworks } from "./SharedUI";

function FloatingHearts({ active }) {
  const [hearts] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i, x: 5 + Math.random() * 90,
      delay: Math.random() * 3, d: 4 + Math.random() * 5,
      size: 14 + Math.random() * 16,
      emoji: ["💜", "💜", "🌸", "🌟", "✨", "💕", "🥰"][i % 7],
    }))
  );
  return (
    <AnimatePresence>
      {active && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          {hearts.map(h => (
            <motion.div key={h.id}
              style={{ position: "absolute", left: `${h.x}%`, bottom: "-30px", fontSize: h.size }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -800, opacity: [0, 1, 1, 0] }}
              transition={{ duration: h.d, delay: h.delay, repeat: Infinity, ease: "linear" }}
            >{h.emoji}</motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

function YesCelebration() {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ fontSize: "clamp(60px,10vw,100px)", lineHeight: 1 }}
      >🥰</motion.div>

      <div style={{
        fontFamily: "'Bebas Neue','Impact',sans-serif",
        fontSize: "clamp(28px,5vw,62px)",
        color: P.main, letterSpacing: "0.06em",
      }}>I knew it! 🎉</div>

      <div style={{
        fontFamily: "'Playfair Display',serif",
        fontSize: "clamp(16px,2vw,24px)",
        color: P.deep, fontWeight: 700, lineHeight: 1.3,
      }}>You mean the world to me.</div>

      <div style={{
        fontFamily: "'Crimson Pro',serif",
        fontSize: "clamp(14px,1.7vw,20px)",
        color: "#6B3FA0", fontStyle: "italic",
        maxWidth: 440, lineHeight: 1.75,
      }}>
        "There's no one else I'd rather celebrate with.<br />
        Thank you for being exactly who you are — beautiful,<br />
        kind, and endlessly wonderful. Happy Birthday, truly."
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {["💜", "🌟", "🎂", "🌟", "💜"].map((e, i) => (
          <motion.span key={i}
            animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.4, delay: i * 0.18, repeat: Infinity }}
            style={{ fontSize: "clamp(20px,3vw,32px)" }}
          >{e}</motion.span>
        ))}
      </div>

      <div style={{
        marginTop: 8,
        fontFamily: "'Courier Prime',monospace",
        fontSize: "clamp(9px,1.1vw,12px)",
        color: P.light, letterSpacing: "0.3em", textTransform: "uppercase",
      }}>✦ Always & forever ✦</div>
    </motion.div>
  );
}

export default function FinalQuestionPage() {
  const [answered, setAnswered] = useState(false);
  const [noPos, setNoPos] = useState(null); // null = not yet moved
  const [noMoves, setNoMoves] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const noBtnRef = useRef(null);

  const handleYes = () => {
    setAnswered(true);
    setConfetti(true);
    setFireworks(true);
    setTimeout(() => setConfetti(false), 3500);
  };

  const handleNoHover = useCallback(() => {
    setNoMoves(m => m + 1);
    const BW = 140, BH = 52, pad = 20;
    const x = pad + Math.random() * (window.innerWidth - BW - pad * 2);
    const y = pad + Math.random() * (window.innerHeight - BH - pad * 2);
    setNoPos({ x, y });
  }, []);

  const noLabel =
    noMoves === 0 ? "No 🙅" :
      noMoves < 3 ? "Nope 😅" :
        noMoves < 6 ? "Catch me! 😂" :
          noMoves < 10 ? "Never! 🏃" : "Give up! 😂";

  const hintText =
    noMoves < 3 ? "That button keeps running away 😂" :
      noMoves < 6 ? "It knows the truth! 💜" :
        noMoves < 10 ? "You can't catch it! 🏃" :
          "There's only one answer here! 🎉";

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
      <Particles />
      <CenterGlow />
      <TopBar />
      <BottomBar />
      <Corners />
      <Confetti active={confetti} />
      <Fireworks active={fireworks} />
      <FloatingHearts active={answered} />

      {/* ── NO button — fixed to viewport, guaranteed on-screen ── */}
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
            background: P.main,
            border: `1.5px solid ${P.pale}`,
            color: "#fff",
            padding: "14px 28px",
            borderRadius: 12,
            fontFamily: "'Courier Prime',monospace",
            fontSize: 13, letterSpacing: "0.2em",
            cursor: "not-allowed", textTransform: "uppercase",
            whiteSpace: "nowrap",
            boxShadow: `0 4px 16px rgba(124,58,237,0.08)`,
          }}
        >
          {/* Animated label swap on each move */}
          <AnimatePresence mode="wait">
            <motion.span key={noLabel}
              initial={{ opacity: 0, y: -8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              style={{ display: "inline-block" }}
            >{noLabel}</motion.span>
          </AnimatePresence>
        </motion.button>
      )}

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", gap: "clamp(20px,4vh,44px)",
        padding: "clamp(16px,3vw,40px)",
      }}>
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(18px,3vh,36px)" }}
            >
              <div style={{ textAlign: "center" }}>
                <PageLabel>✦ Final Question ✦</PageLabel>
                <div style={{
                  fontFamily: "'Bebas Neue','Impact',sans-serif",
                  fontSize: "clamp(26px,4.8vw,58px)",
                  color: P.main, letterSpacing: "0.06em",
                }}>Did You Like This?</div>
              </div>

              {/* Bouncy face */}
              <motion.div
                animate={{ scale: [1, 1.08, 1, 1.05, 1], rotate: [0, -3, 3, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "clamp(100px,16vw,150px)", height: "clamp(100px,16vw,150px)",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${P.xpale},${P.pale},#DDD6FE)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(50px,8vw,80px)",
                  border: `3px solid ${P.pale}`,
                  boxShadow: `0 8px 40px rgba(124,58,237,0.16)`,
                }}
              >🥺</motion.div>

              <p style={{
                fontFamily: "'Crimson Pro',serif",
                fontSize: "clamp(14px,1.7vw,20px)",
                color: "#6B3FA0", fontStyle: "italic",
                textAlign: "center", maxWidth: 380, lineHeight: 1.7,
              }}>
                "I put my whole heart into this.<br />I really hope it made you smile. 💜"
              </p>

              {/* YES + inline NO (shown only before first hover) */}
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <motion.button
                  onClick={handleYes}
                  whileHover={{ scale: 1.08, boxShadow: `0 12px 40px ${P.main}55`, fontWeight: 800 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    background: "transparent",
                    border: `1.5px solid ${P.main}`, color: P.main,
                    padding: "16px 32px", borderRadius: 12,
                    fontFamily: "'Courier Prime',monospace",
                    fontSize: 13, letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >Yes 💜</motion.button>

                {/* Inline No — disappears after first hover (teleports to fixed) */}
                {noPos === null && (
                  <motion.button
                    onMouseEnter={handleNoHover}
                    onTouchStart={handleNoHover}
                    whileHover={{ scale: 1.04 }}
                    style={{
                      background: P.main, border: "none", color: "#fff",
                      padding: "16px 48px", borderRadius: 12,
                      fontFamily: "'Courier Prime',monospace",
                      fontSize: 14, letterSpacing: "0.28em", textTransform: "uppercase",
                      boxShadow: `0 4px 24px ${P.main}44`, fontWeight: 700,
                      cursor: "not-allowed",
                    }}

                  >No 🙅</motion.button>
                )}
              </div>

              {/* Hint text — updates with animated swap each move */}
              <AnimatePresence>
                {noMoves > 0 && (
                  <motion.div key="hint"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      fontFamily: "'Courier Prime',monospace",
                      fontSize: "clamp(8px,1vw,11px)",
                      color: P.light, letterSpacing: "0.2em",
                      textTransform: "uppercase", textAlign: "center",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span key={hintText}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22 }}
                        style={{ display: "inline-block" }}
                      >{hintText}</motion.span>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ) : (
            <motion.div key="yes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <YesCelebration />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}