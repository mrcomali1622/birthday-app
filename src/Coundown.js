import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// const TARGET_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 33 * 60 * 1000 + 20 * 1000);
const TARGET_DATE = new Date("3/22/2026");
function getTimeLeft() {
    const diff = Math.max(0, TARGET_DATE - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#A78BFA";
const PURPLE_PALE = "#EDE9FE";
const PURPLE_MID = "#8B5CF6";
const PURPLE_DARK = "#5B21B6";

function DigitFlip({ value, label }) {
    const [prev, setPrev] = useState(value);

    useEffect(() => {
        if (value !== prev) {
            const t = setTimeout(() => setPrev(value), 300);
            return () => clearTimeout(t);
        }
    }, [value, prev]);

    const display = String(value).padStart(2, "0");

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div
                style={{
                    position: "relative",
                    width: "clamp(72px, 12vw, 130px)",
                    height: "clamp(88px, 14vw, 160px)",
                    perspective: "600px",
                }}
            >
                {/* Card shadow + border */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "18px",
                        background: "#fff",
                        border: `1.5px solid ${PURPLE_PALE}`,
                        boxShadow: `0 4px 32px rgba(124,58,237,0.10), 0 1px 4px rgba(124,58,237,0.06)`,
                    }}
                />

                {/* Subtle top tint */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "18px",
                        background: `linear-gradient(160deg, ${PURPLE_PALE}55 0%, transparent 60%)`,
                        pointerEvents: "none",
                    }}
                />

                {/* Flip digit */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={display}
                        initial={{ rotateX: -90, opacity: 0, y: -10 }}
                        animate={{ rotateX: 0, opacity: 1, y: 0 }}
                        exit={{ rotateX: 90, opacity: 0, y: 10 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                            fontSize: "clamp(42px, 7vw, 90px)",
                            color: PURPLE,
                            letterSpacing: "0.02em",
                            transformOrigin: "center center",
                            userSelect: "none",
                            textShadow: `0 2px 18px rgba(124,58,237,0.18)`,
                        }}
                    >
                        {display}
                    </motion.div>
                </AnimatePresence>

                {/* Center divider line */}
                <div
                    style={{
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        top: "50%",
                        height: "1px",
                        background: `linear-gradient(90deg, transparent, ${PURPLE_PALE}, transparent)`,
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                    }}
                />
            </div>

            <span
                style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "clamp(9px, 1.2vw, 12px)",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: PURPLE_LIGHT,
                    fontWeight: 700,
                }}
            >
                {label}
            </span>
        </div>
    );
}

function Separator() {
    const [blink, setBlink] = useState(true);
    useEffect(() => {
        const t = setInterval(() => setBlink((b) => !b), 500);
        return () => clearInterval(t);
    }, []);

    return (
        <motion.div
            animate={{ opacity: blink ? 1 : 0.2 }}
            transition={{ duration: 0.1 }}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px, 1.5vw, 16px)",
                alignItems: "center",
                paddingBottom: "clamp(28px, 4vw, 44px)",
            }}
        >
            {[0, 1].map((i) => (
                <div
                    key={i}
                    style={{
                        width: "clamp(5px, 0.7vw, 8px)",
                        height: "clamp(5px, 0.7vw, 8px)",
                        borderRadius: "50%",
                        background: PURPLE,
                        boxShadow: `0 0 10px ${PURPLE}88`,
                    }}
                />
            ))}
        </motion.div>
    );
}

function Particles() {
    const particles = Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        duration: 5 + Math.random() * 9,
        delay: Math.random() * 6,
        shape: i % 3 === 0 ? "circle" : i % 3 === 1 ? "square" : "ring",
    }));

    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: p.shape === "square" ? "3px" : "50%",
                        background: p.shape === "ring" ? "transparent" : `${PURPLE}33`,
                        border: p.shape === "ring" ? `1.5px solid ${PURPLE}44` : "none",
                    }}
                    animate={{ y: [0, -50, 0], opacity: [0, 0.7, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

function RevealPage({ onBack }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            <Particles />

            {/* Burst circle */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 4, opacity: [0, 0.12, 0] }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${PURPLE}66, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            {/* Decorative ring */}
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    position: "absolute",
                    width: "420px",
                    height: "420px",
                    borderRadius: "50%",
                    border: `1.5px solid ${PURPLE_PALE}`,
                    pointerEvents: "none",
                }}
            />
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    position: "absolute",
                    width: "520px",
                    height: "520px",
                    borderRadius: "50%",
                    border: `1px solid ${PURPLE_PALE}88`,
                    pointerEvents: "none",
                }}
            />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                style={{ textAlign: "center", zIndex: 1 }}
            >
                <motion.div
                    animate={{ rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "clamp(11px, 1.5vw, 15px)",
                        letterSpacing: "0.45em",
                        color: PURPLE_LIGHT,
                        marginBottom: "18px",
                        textTransform: "uppercase",
                    }}
                >
                    ✦ Revealed ✦
                </motion.div>

                <div
                    style={{
                        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                        fontSize: "clamp(52px, 10vw, 120px)",
                        color: PURPLE,
                        letterSpacing: "0.06em",
                        lineHeight: 1,
                        textShadow: `0 4px 40px ${PURPLE}33`,
                    }}
                >
                    THE FUTURE
                    <br />
                    IS NOW
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        fontFamily: "'Courier New', monospace",
                        color: PURPLE_LIGHT,
                        letterSpacing: "0.22em",
                        fontSize: "clamp(10px, 1.4vw, 14px)",
                        marginTop: "24px",
                        textTransform: "uppercase",
                    }}
                >
                    Something extraordinary has arrived
                </motion.p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onBack}
                whileHover={{ scale: 1.05, background: PURPLE_PALE }}
                whileTap={{ scale: 0.97 }}
                style={{
                    position: "absolute",
                    bottom: "40px",
                    background: "transparent",
                    border: `1.5px solid ${PURPLE_PALE}`,
                    color: PURPLE_LIGHT,
                    padding: "10px 28px",
                    borderRadius: "8px",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.22em",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "background 0.2s",
                }}
            >
                ← Back to Countdown
            </motion.button>
        </motion.div>
    );
}

export default function CountdownReveal() {
    const [time, setTime] = useState(getTimeLeft());
    const [revealed, setRevealed] = useState(false);
    const [exploding, setExploding] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTime(getTimeLeft()), 1000);
        return () => clearInterval(t);
    }, []);

    const handleReveal = () => {
        setExploding(true);
        setTimeout(() => setRevealed(true), 700);
    };

    const segments = [
        { value: time.days, label: "Days" },
        { value: time.hours, label: "Hours" },
        { value: time.minutes, label: "Minutes" },
        { value: time.seconds, label: "Seconds" },
    ];

    return (
        <div style={{ fontFamily: "sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

            <AnimatePresence mode="wait">
                {revealed ? (
                    <RevealPage key="reveal" onBack={() => { setRevealed(false); setExploding(false); }} />
                ) : (
                    <motion.div
                        key="countdown"
                        initial={{ opacity: 1 }}
                        exit={{ scale: 1.25, opacity: 0, filter: "blur(8px)" }}
                        transition={{ duration: 0.55, ease: [0.7, 0, 1, 1] }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        <Particles />

                        {/* Soft purple radial glow center */}
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "800px",
                                height: "800px",
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${PURPLE_PALE}CC 0%, transparent 65%)`,
                                pointerEvents: "none",
                            }}
                        />

                        {/* Top accent bar */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "4px",
                                background: `linear-gradient(90deg, ${PURPLE_PALE}, ${PURPLE}, ${PURPLE_MID}, ${PURPLE_PALE})`,
                                transformOrigin: "left",
                            }}
                        />

                        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(24px, 5vh, 56px)" }}>

                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                                style={{ textAlign: "center" }}
                            >
                                <div
                                    style={{
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: "clamp(9px, 1.1vw, 12px)",
                                        letterSpacing: "0.5em",
                                        textTransform: "uppercase",
                                        color: PURPLE_LIGHT,
                                        marginBottom: "14px",
                                    }}
                                >
                                    ✦ Countdown to ✦
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                                        fontSize: "clamp(34px, 6vw, 76px)",
                                        color: PURPLE,
                                        letterSpacing: "0.08em",
                                        lineHeight: 1,
                                        textShadow: `0 4px 30px ${PURPLE}22`,
                                    }}
                                >
                                    Special moment
                                </div>
                            </motion.div>

                            {/* Timer */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "clamp(6px, 1.5vw, 18px)",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                }}
                            >
                                {segments.map((seg, i) => (
                                    <div key={seg.label} style={{ display: "flex", alignItems: "flex-end", gap: "clamp(6px, 1.5vw, 18px)" }}>
                                        <DigitFlip value={seg.value} label={seg.label} />
                                        {i < segments.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
                            >
                                <p
                                    style={{
                                        fontFamily: "'Courier New', monospace",
                                        color: `${PURPLE_LIGHT}BB`,
                                        letterSpacing: "0.18em",
                                        fontSize: "clamp(9px, 1.1vw, 12px)",
                                        textTransform: "uppercase",
                                        textAlign: "center",
                                        maxWidth: "340px",
                                        lineHeight: 1.9,
                                    }}
                                >
                                    Can't wait? Peek at what's coming
                                </p>

                                <motion.button
                                    onClick={handleReveal}
                                    whileHover={{
                                        scale: 1.04,
                                        boxShadow: `0 8px 32px ${PURPLE}44`,
                                        background: PURPLE_DARK,
                                    }}
                                    whileTap={{ scale: 0.96 }}
                                    animate={exploding ? { scale: [1, 1.18, 0], opacity: [1, 1, 0] } : {}}
                                    transition={exploding ? { duration: 0.6 } : { background: { duration: 0.2 } }}
                                    style={{
                                        background: PURPLE,
                                        border: "none",
                                        color: "#fff",
                                        padding: "clamp(12px, 1.8vh, 18px) clamp(28px, 5vw, 56px)",
                                        borderRadius: "10px",
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: "clamp(11px, 1.3vw, 14px)",
                                        letterSpacing: "0.28em",
                                        cursor: "pointer",
                                        textTransform: "uppercase",
                                        boxShadow: `0 4px 20px ${PURPLE}33`,
                                        fontWeight: 700,
                                    }}
                                >
                                    Reveal Now →
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Corner brackets */}
                        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => {
                            const isTop = pos.includes("top");
                            const isLeft = pos.includes("left");
                            return (
                                <motion.div
                                    key={pos}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 }}
                                    style={{
                                        position: "absolute",
                                        top: isTop ? "28px" : "auto",
                                        bottom: !isTop ? "28px" : "auto",
                                        left: isLeft ? "28px" : "auto",
                                        right: !isLeft ? "28px" : "auto",
                                        width: "36px",
                                        height: "36px",
                                        borderTop: isTop ? `2px solid ${PURPLE_PALE}` : "none",
                                        borderBottom: !isTop ? `2px solid ${PURPLE_PALE}` : "none",
                                        borderLeft: isLeft ? `2px solid ${PURPLE_PALE}` : "none",
                                        borderRight: !isLeft ? `2px solid ${PURPLE_PALE}` : "none",
                                        borderRadius: isTop && isLeft ? "6px 0 0 0" : isTop ? "0 6px 0 0" : isLeft ? "0 0 0 6px" : "0 0 6px 0",
                                        pointerEvents: "none",
                                    }}
                                />
                            );
                        })}

                        {/* Bottom accent bar */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: `linear-gradient(90deg, transparent, ${PURPLE_PALE}, transparent)`,
                                transformOrigin: "center",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}