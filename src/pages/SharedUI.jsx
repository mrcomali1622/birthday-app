/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { P } from "./theme";

export function Particles({ count = 18 }) {
  const [list] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 8 + 3,
      d: 5 + Math.random() * 9,
      delay: Math.random() * 7,
      shape: i % 3,
    }))
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {list.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            borderRadius: p.shape === 1 ? "3px" : "50%",
            background: p.shape === 2 ? "transparent" : `${P.mid}22`,
            border: p.shape === 2 ? `1.5px solid ${P.light}44` : "none",
          }}
          animate={{ y: [0, -60, 0], opacity: [0, 0.65, 0], rotate: [0, 180, 360] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function TopBar() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4, zIndex: 10,
        background: `linear-gradient(90deg,${P.pale},${P.main},${P.mid},${P.rose},${P.pale})`,
        transformOrigin: "left",
      }}
    />
  );
}

export function BottomBar() {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 10,
      background: `linear-gradient(90deg,transparent,${P.pale},transparent)`,
    }} />
  );
}

export function CenterGlow({ color }) {
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      width: 900, height: 900, borderRadius: "50%",
      background: `radial-gradient(circle,${color || P.xpale} 0%,transparent 65%)`,
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

export function Corners() {
  return (
    <>
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => {
        const top = pos.includes("top"), left = pos.includes("left");
        return (
          <motion.div
            key={pos}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              position: "absolute",
              top: top ? 20 : "auto", bottom: !top ? 20 : "auto",
              left: left ? 20 : "auto", right: !left ? 20 : "auto",
              width: 36, height: 36, pointerEvents: "none",
              borderTop: top ? `2px solid ${P.pale}` : "none",
              borderBottom: !top ? `2px solid ${P.pale}` : "none",
              borderLeft: left ? `2px solid ${P.pale}` : "none",
              borderRight: !left ? `2px solid ${P.pale}` : "none",
              borderRadius: top && left ? "6px 0 0 0" : top ? "0 6px 0 0" : left ? "0 0 0 6px" : "0 0 6px 0",
            }}
          />
        );
      })}
    </>
  );
}

export function NavBtn({ onClick, children, style = {} }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06, boxShadow: `0 12px 40px ${P.main}55` }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: P.main,
        border: "none", color: "#fff",
        padding: "14px 44px",
        borderRadius: 12,
        fontFamily: "'Courier Prime',monospace",
        fontSize: 13, letterSpacing: "0.28em",
        cursor: "pointer", textTransform: "uppercase",
        boxShadow: `0 4px 20px ${P.main}44`,
        fontWeight: 700, ...style,
      }}
    >{children}</motion.button>
  );
}

export function PageLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Courier Prime',monospace",
      fontSize: "clamp(8px,1vw,11px)",
      letterSpacing: "0.5em", textTransform: "uppercase",
      color: P.light, marginBottom: 10,
    }}>{children}</div>
  );
}

export function Confetti({ active }) {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 700,
      vy: -(250 + Math.random() * 500),
      color: [P.main, P.mid, P.light, P.pale, "#C4B5FD", "#FCA5A5", P.rose, P.gold, "#6EE7B7"][i % 9],
      size: 6 + Math.random() * 9,
      shape: i % 3,
      delay: Math.random() * 0.4,
    }))
  );
  return (
    <AnimatePresence>
      {active && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 998, overflow: "hidden" }}>
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: "70vh", opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                x: `calc(${p.x}vw + ${p.vx}px)`,
                y: `calc(70vh + ${p.vy}px)`,
                opacity: [1, 1, 1, 0],
                rotate: Math.random() * 720 - 360,
                scale: [1, 1, 0.3],
              }}
              transition={{ duration: 1.6 + p.delay, delay: p.delay, ease: [0.2, 0.9, 0.4, 1] }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size * (p.shape === 0 ? 0.45 : 1),
                borderRadius: p.shape === 2 ? "50%" : "2px",
                background: p.color,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export function Fireworks({ active }) {
  const bursts = [
    { x: 20, y: 25, color: P.main },
    { x: 75, y: 20, color: P.rose },
    { x: 50, y: 15, color: P.gold },
    { x: 85, y: 40, color: P.mid },
    { x: 15, y: 45, color: "#6EE7B7" },
  ];
  return (
    <AnimatePresence>
      {active && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 997, overflow: "hidden" }}>
          {bursts.map((b, bi) =>
            Array.from({ length: 14 }, (_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const dist = 80 + Math.random() * 60;
              return (
                <motion.div
                  key={`${bi}-${i}`}
                  initial={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    opacity: 1,
                    scale: 0,
                  }}
                  animate={{
                    left: `calc(${b.x}% + ${Math.cos(angle) * dist}px)`,
                    top: `calc(${b.y}% + ${Math.sin(angle) * dist}px)`,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.4, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: bi * 0.3 + Math.random() * 0.2,
                    ease: [0.2, 0.8, 0.6, 1],
                    repeat: active ? Infinity : 0,
                    repeatDelay: 1.5,
                  }}
                  style={{
                    position: "absolute",
                    width: 6, height: 6,
                    borderRadius: "50%",
                    background: b.color,
                    boxShadow: `0 0 8px ${b.color}`,
                  }}
                />
              );
            })
          )}
        </div>
      )}
    </AnimatePresence>
  );
}


// ── AudioPlayer component ─────────────────────────────────────────────
// Add this ONCE near the top of the file (above the page components)


export function AudioPlayer({ src, volume = 0.4 }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [started, setStarted] = useState(true);

  useEffect(() => {
    console.log(started);

    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;

    // Auto-play on mount (needs user gesture on some browsers)
    const tryPlay = () => {
      audio.play()
        .then(() => { setPlaying(true); setStarted(true); })
        .catch(() => {
          // Blocked by browser — wait for first click/touch anywhere
          const unlock = () => {
            audio.play().then(() => { setPlaying(true); setStarted(true); });
            window.removeEventListener("click", unlock);
            window.removeEventListener("touchend", unlock);
          };
          window.addEventListener("click", unlock, { once: true });
          window.addEventListener("touchend", unlock, { once: true });
        });
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Floating mute/unmute button — bottom-right corner */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        title={playing ? "Mute music" : "Play music"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          width: 44, height: 44, borderRadius: "50%",
          background: "#fff",
          border: `1.5px solid ${P.pale}`,
          boxShadow: `0 4px 20px rgba(124,58,237,0.18)`,
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}
      >
        {playing ? "🔊" : "🔇"}
      </motion.button>
    </>
  );
}

/*
  Drips — measures the actual rendered width of the tier div,
  then fills it evenly with drip drops. Re-measures on resize.
  dripW = drip width px, gap = spacing between drip centers
*/
export function Drips({ tierRef, dripW = 9, dripH = 13, color, borderColor, offsetTop = -6 }) {
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