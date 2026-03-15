import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { P } from "./theme";
import { Particles, TopBar, BottomBar, Corners, CenterGlow, PageLabel } from "./SharedUI";

// ⚡ Set your real birthday date/time here (IST = UTC+5:30)
const TARGET_MS = new Date("2026-03-22T00:00:00+05:30").getTime();

/* ─────────────────────────────────────────────────────────────────────
   TAMPER-PROOF CLOCK
   
   Strategy:
     1. On mount, fetch real UTC time from a server API.
     2. Record:
          serverMs       = real unix ms from server
          perfSnapshot   = performance.now() at that moment  (monotonic)
     3. Every tick, compute:
          realNow = serverMs + (performance.now() - perfSnapshot)
   
   performance.now() is a monotonic clock — it CANNOT be changed by
   the user adjusting their system date/time. Even if the phone's
   clock jumps to March 22, performance.now() keeps counting from
   the moment the page loaded. So the countdown stays correct.
──────────────────────────────────────────────────────────────────────── */

// Anchor set once when server time is fetched
let _anchor = null; // { serverMs, perfSnapshot }

function getRealNow() {
  // if (!_anchor) return Date.now(); // fallback before fetch completes
  return _anchor?.serverMs + (performance.now() - _anchor.perfSnapshot);
}

// function computeLeft() {
//   const HOUR = 3_600_000, MIN = 60_000;
//   const d = Math.max(0, TARGET_MS - getRealNow());
//   return {
//     days: Math.floor(d / (24 * HOUR)),
//     hours: Math.floor((d / HOUR) % 24),
//     minutes: Math.floor((d / MIN) % 60),
//     seconds: Math.floor((d / 1000) % 60),
//     done: d <= 0,
//   };
// }

function computeLeft(offset) {
  const HOUR = 3600000;
  const MIN = 60000;

  const OFFSET = (5 * HOUR) + (30 * MIN);

  const d = Math.max(0, TARGET_MS - getRealNow() - OFFSET);

  return {
    days: Math.floor(d / (24 * HOUR)),
    hours: Math.floor((d / HOUR) % 24),
    minutes: Math.floor((d / MIN) % 60),
    seconds: Math.floor((d / 1000) % 60),
    done: d <= 0,
  };
}


// ── 4 fallback time APIs ──────────────────────────────────────────────
const TIME_APIS = [
  {
    url: "https://timeapi.io/api/time/current/zone?timeZone=UTC",
    parse: (j) => new Date(j.dateTime).getTime(),
  },
  {
    url: "https://worldtimeapi.org/api/timezone/Etc/UTC",
    parse: (j) => j.unixtime * 1000,
  },
  {
    url: "https://timeapi.io/api/time/current/ip?ipAddress=1.1.1.1",
    parse: (j) => new Date(j.dateTime).getTime(),
  },
  {
    url: "https://worldclockapi.com/api/json/utc/now",
    parse: (j) => new Date(j.currentDateTime).getTime(),
  },
];

async function fetchAndAnchor() {
  const localBefore = performance.now();

  for (const api of TIME_APIS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch(api.url, { cache: "no-store", signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) continue;

      const data = await res.json();
      const serverMs = api.parse(data);
      if (!serverMs || isNaN(serverMs)) continue;

      // latency compensation: assume half round-trip elapsed
      const latency = (performance.now() - localBefore) / 2;
      const perfSnapshot = performance.now();

      // store anchor — from this point on we use monotonic clock
      _anchor = { serverMs: serverMs + latency, perfSnapshot };
      return true;
    } catch {
      continue;
    }
  }
  return false; // all APIs failed
}

// ── Digit flip card ───────────────────────────────────────────────────
function Digit({ val, label }) {
  const s = String(val).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{
        position: "relative",
        width: "clamp(64px,10vw,118px)", height: "clamp(80px,12vw,144px)",
        perspective: 600,
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16,
          background: "#fff", border: `1.5px solid ${P.pale}`,
          boxShadow: `0 2px 0 ${P.pale},0 8px 32px rgba(124,58,237,0.11)`,
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
          background: `linear-gradient(165deg,${P.xpale} 0%,transparent 55%)`,
        }} />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={s}
            initial={{ rotateX: -80, opacity: 0, y: -8 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: 80, opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "absolute", inset: 0, borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Bebas Neue','Impact',sans-serif",
              fontSize: "clamp(38px,6.5vw,82px)",
              color: P.main, userSelect: "none",
              textShadow: `0 2px 16px rgba(124,58,237,0.2)`,
            }}
          >{s}</motion.div>
        </AnimatePresence>
        <div style={{
          position: "absolute", left: "10%", right: "10%", top: "50%",
          height: 1, transform: "translateY(-50%)", pointerEvents: "none",
          background: `linear-gradient(90deg,transparent,${P.pale},transparent)`,
        }} />
      </div>
      <span style={{
        fontFamily: "'Courier Prime',monospace",
        fontSize: "clamp(8px,1vw,11px)", letterSpacing: "0.28em",
        textTransform: "uppercase", color: P.light, fontWeight: 700,
      }}>{label}</span>
    </div>
  );
}

// ── Blinking colon ────────────────────────────────────────────────────
function Sep() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: "clamp(7px,1.2vw,14px)", alignItems: "center",
      paddingBottom: "clamp(24px,3.5vw,38px)",
      opacity: on ? 1 : 0.18, transition: "opacity 0.08s",
    }}>
      {[0, 1].map(i => (
        <div key={i} style={{
          width: "clamp(4px,0.6vw,7px)", height: "clamp(4px,0.6vw,7px)",
          borderRadius: "50%", background: P.main,
          boxShadow: `0 0 8px ${P.main}88`,
        }} />
      ))}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: 40, height: 40, borderRadius: "50%",
          border: `3px solid ${P.pale}`, borderTopColor: P.main,
        }}
      />
      <p style={{
        fontFamily: "'Courier Prime',monospace",
        color: `${P.light}88`, letterSpacing: "0.22em",
        fontSize: "clamp(7px,0.9vw,10px)", textTransform: "uppercase",
      }}>Syncing time…</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function CountdownPage() {
  const [loading, setLoading] = useState(true);
  const [t, setT] = useState(null);
  const [bursting, setBursting] = useState(false);
  const nav = useNavigate();
  const tickRef = useRef(null);

  // Step 1 — fetch server time and store anchor
  useEffect(() => {
    fetchAndAnchor().finally(() => {
      // Whether fetch succeeded or failed, start ticking.
      // If failed, _anchor stays null and we fall back to Date.now()
      // (still better than nothing, and very rare with 4 APIs).
      setLoading(false);
    });
  }, []);

  // Step 2 — start ticking once loading is done
  useEffect(() => {
    if (loading) return;

    const tick = () => {
      if (_anchor) {
        const tl = computeLeft();
        setT(tl);
        if (tl.done) {
          clearInterval(tickRef.current);
          setBursting(true);
          setTimeout(() => nav("/card"), 1100);
        }
      }
    };

    tick(); // immediate render
    tickRef.current = setInterval(tick, 1000);
    return () => clearInterval(tickRef.current);
  }, [loading, nav]);

  const segs = t ? [
    { v: t.days, l: "Days" },
    { v: t.hours, l: "Hours" },
    { v: t.minutes, l: "Minutes" },
    { v: t.seconds, l: "Seconds" },
  ] : [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
      <Particles />
      <CenterGlow />
      <TopBar />
      <BottomBar />
      <Corners />

      {/* Burst overlay on zero */}
      <AnimatePresence>
        {bursting && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 7, opacity: [0, 0.3, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 260, height: 260, borderRadius: "50%",
              background: `radial-gradient(circle,${P.pale},${P.mid}55,transparent 70%)`,
              pointerEvents: "none", zIndex: 999,
            }}
          />
        )}
      </AnimatePresence>

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100%", gap: "clamp(20px,4vh,50px)",
      }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center" }}
        >
          <PageLabel>✦ Countdown to ✦</PageLabel>
          <div style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: "clamp(30px,5.5vw,70px)",
            color: P.main, letterSpacing: "0.08em", lineHeight: 1,
            textShadow: `0 4px 30px ${P.pale}`,
          }}>Special Moment</div>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{
              fontFamily: "'Crimson Pro',serif",
              fontSize: "clamp(14px,1.8vw,20px)",
              color: `${P.light}BB`, fontStyle: "italic", marginTop: 8,
            }}
          >Something magical is on its way…</motion.div>
        </motion.div>

        {/* Spinner while syncing */}
        {loading && <Spinner />}

        {/* Countdown digits */}
        {!loading && t && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              display: "flex", alignItems: "flex-end",
              gap: "clamp(4px,1.2vw,16px)",
              flexWrap: "wrap", justifyContent: "center",
            }}
          >
            {segs.map((s, i) => (
              <div key={s.l} style={{
                display: "flex", alignItems: "center",
                gap: "clamp(4px,1.2vw,16px)",
              }}>
                <Digit val={s.v} label={s.l} />
                {i < segs.length - 1 && <Sep />}
              </div>
            ))}
          </motion.div>
        )}

        {/* Footer dots */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, delay: i * 0.22, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: P.light }}
                />
              ))}
            </div>
            <p style={{
              fontFamily: "'Courier Prime',monospace",
              color: `${P.light}88`, letterSpacing: "0.22em",
              fontSize: "clamp(7px,0.9vw,10px)", textTransform: "uppercase",
            }}>Auto-reveal when timer ends</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}