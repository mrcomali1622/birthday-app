import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomBar, CenterGlow, Confetti, Corners, NavBtn, PageLabel, Particles, TopBar } from "./SharedUI";
import { motion, AnimatePresence } from "framer-motion";
import { P } from "./theme";
import confetti from "canvas-confetti";

const GIFT_IMAGE_URL = require("../assets/gift.png");
// const GIFT_IMAGE_URL = null;

function FloatingHeartsActive({ active }) {
    const [h] = useState(() => Array.from({ length: 14 }, (_, i) => ({
        id: i, x: 5 + Math.random() * 90, delay: Math.random() * 3,
        d: 4 + Math.random() * 5, size: 14 + Math.random() * 14,
        e: ["💜", "💝", "💖", "💞", "💕", "❣️", "🩷", "🧡", "💛", "💚", "💙", "🩵", "🤍"][i % 7]
    })));
    return (
        <AnimatePresence>
            {active && (
                <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
                    {h.map(x => (
                        <motion.div key={x.id}
                            style={{ position: "absolute", left: `${x.x}%`, bottom: "-30px", fontSize: x.size }}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -800, opacity: [0, 1, 1, 0] }}
                            transition={{ duration: x.d, delay: x.delay, repeat: Infinity, ease: "linear" }}
                        >{x.e}</motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}

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

/* ── Lightbox overlay ─────────────────────────────────────────────── */
function Lightbox({ src, imgErr, onClose }) {
    return (
        <AnimatePresence>
            {src && (
                <motion.div
                    key="lightbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={onClose}
                    style={{
                        position: "fixed", inset: 0, zIndex: 9999,
                        background: "rgba(0,0,0,0.90)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "zoom-out",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                    }}
                >
                    {/* Close ✕ */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.18, type: "spring", stiffness: 260, damping: 20 }}
                        onClick={onClose}
                        style={{
                            position: "absolute", top: 18, right: 18,
                            width: 44, height: 44, borderRadius: "50%",
                            background: "rgba(255,255,255,0.13)",
                            border: "1.5px solid rgba(255,255,255,0.28)",
                            color: "#fff", fontSize: 22, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 10001, lineHeight: 1,
                        }}
                    >✕</motion.button>

                    {/* Image */}
                    <motion.img
                        src={src}
                        alt="Surprise!"
                        initial={{ scale: 0.55, opacity: 0, y: 32, rotate: -4 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                        exit={{ scale: 0.65, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 210, damping: 22 }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            maxWidth: "90vw", maxHeight: "86vh",
                            objectFit: "contain",
                            borderRadius: 16,
                            boxShadow: `0 30px 100px rgba(124,58,237,0.45), 0 0 0 2px ${P.pale}44`,
                            cursor: "default",
                            display: "block",
                        }}
                    />

                    {/* Hint */}
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            position: "absolute", bottom: 18, left: "50%",
                            transform: "translateX(-50%)",
                            fontFamily: "'Courier Prime',monospace",
                            fontSize: 10, letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.38)",
                            whiteSpace: "nowrap", margin: 0,
                        }}
                    >Tap anywhere to close</motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ── Main gift component ──────────────────────────────────────────── */
function GiftBox({ setShowNext }) {
    const [phase, setPhase] = useState("idle"); // idle | shaking | opening | open
    const [burst, setBurst] = useState(false);
    const [imgErr, setImgErr] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const handleClick = () => {
        if (phase !== "idle") return;
        setPhase("shaking");
        setTimeout(() => {
            setPhase("opening");
            setBurst(true);
            setTimeout(() => { setBurst(false); setShowNext(true); }, 900);
            setTimeout(() => setPhase("open"), 550);
        }, 600);
    };

    const canLightbox = GIFT_IMAGE_URL && !imgErr;

    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <GiftBurst active={burst} />
            <Confetti active={confetti} />
            <FloatingHeartsActive active={true} />

            {/* Lightbox */}
            <Lightbox
                src={lightboxOpen && canLightbox ? GIFT_IMAGE_URL : null}
                imgErr={imgErr}
                onClose={() => setLightboxOpen(false)}
            />

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
                        <motion.div
                            animate={phase === "idle" ? { y: [0, -8, 0], rotate: [0, -3, 3, 0] } : {}}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                fontSize: "clamp(90px,18vw,140px)", lineHeight: 1,
                                filter: "drop-shadow(0 8px 28px rgba(124,58,237,0.24))",
                                position: "relative", zIndex: 1, display: "block"
                            }}
                        >🎁</motion.div>
                        {phase === "idle" && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                style={{
                                    textAlign: "center", marginTop: 14,
                                    fontFamily: "'Courier Prime','Courier New',monospace",
                                    fontSize: "clamp(9px,1.1vw,12px)",
                                    color: `${P.light}BB`, letterSpacing: "0.28em", textTransform: "uppercase"
                                }}>
                                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
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
                        {/* ── Clickable photo thumbnail ── */}
                        <motion.div
                            whileHover={canLightbox ? { scale: 1.04, boxShadow: `0 0 0 4px ${P.mid}55` } : {}}
                            whileTap={canLightbox ? { scale: 0.97 } : {}}
                            onClick={() => canLightbox && setLightboxOpen(true)}
                            style={{
                                width: "clamp(170px,26vw,300px)",
                                height: "clamp(150px,24vw,220px)",
                                overflow: "hidden",
                                border: `5px solid #fff`,
                                borderRadius: 14,
                                boxShadow: `0 0 0 3px ${P.pale},0 16px 60px rgba(124,58,237,0.30)`,
                                background: `linear-gradient(135deg,${P.pale},${P.mid})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, position: "relative",
                                cursor: canLightbox ? "zoom-in" : "default",
                                transition: "box-shadow 0.2s",
                            }}
                        >
                            {canLightbox ? (
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

                            {/* 🔍 zoom badge — only when there's a real image */}
                            {canLightbox && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7, type: "spring" }}
                                    style={{
                                        position: "absolute", bottom: 8, right: 8,
                                        background: "rgba(0,0,0,0.48)",
                                        borderRadius: 20, padding: "3px 9px",
                                        fontFamily: "'Courier Prime',monospace",
                                        fontSize: 9, color: "#fff",
                                        letterSpacing: "0.14em", textTransform: "uppercase",
                                        display: "flex", alignItems: "center", gap: 4,
                                        backdropFilter: "blur(4px)",
                                    }}
                                >🔍 tap to enlarge</motion.div>
                            )}
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            style={{
                                textAlign: "center", width: "100%", padding: "0 16px",
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
                                A little something for you 🎀
                            </div>
                            <p style={{
                                fontFamily: "Georgia,serif",
                                fontSize: "clamp(13px,1.5vw,17px)",
                                color: "#6B3FA0", fontStyle: "italic", lineHeight: 1, margin: 0
                            }}>
                                This image may be created by AI today, but one day I truly hope we'll recreate this moment in real life. I'm waiting for that day.<br /><br />
                                My promise to you is simple — I won't walk away, no matter the situation. I will always stand by you and be there for you.<br /><br />
                                This small image is just a little birthday gift from my heart.<br />
                                Once again, Happy Birthday. 💜
                                {/* "This gift carries all the love words<br />
                                can't quite hold. I hope it makes<br />
                                you smile as wide as you make me. 💜" */}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function GiftPage() {
    const nav = useNavigate();
    const [showNext, setShowNext] = useState(false);
    return (
        <div style={{ position: "fixed", inset: 0, background: "#fff", overflow: "hidden" }}>
            <Particles />
            <CenterGlow />
            <TopBar />
            <BottomBar />
            <Corners />
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
                    <GiftBox setShowNext={setShowNext} />
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