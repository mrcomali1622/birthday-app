import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BottomBar, NavBtn, PageLabel, Particles, TopBar } from "./SharedUI";
import { P } from "./theme";
import { ALBUM } from "./memories";

/* Single polaroid card */
function AlbumCard({ item, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [imgErr, setImgErr] = useState(false);
    const [hovered, setHovered] = useState(false);

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
                width: "100%", aspectRatio: "1 / 1", borderRadius: 2,
                overflow: "hidden",
                background: `linear-gradient(135deg, ${P.xpale}, ${P.pale})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
            }}>
                {item.photo && !imgErr ? (
                    <img
                        src={item.photo} alt={item.caption}
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
                        <div style={{
                            position: "absolute", bottom: 5, right: 6,
                            fontFamily: "'Courier Prime',monospace",
                            fontSize: "clamp(6px,0.7vw,8px)",
                            color: `${P.light}88`, letterSpacing: "0.15em",
                            textTransform: "uppercase",
                        }}>add photo</div>
                    </>
                )}
                <motion.div
                    animate={{ opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        background: `linear-gradient(135deg, transparent 40%, rgba(167,139,250,0.15))`,
                    }}
                />
            </div>

            {/* Caption strip */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "clamp(6px,0.9vw,10px) clamp(8px,1.2vw,14px)",
                display: "flex", flexDirection: "column", gap: 2,
            }}>
                <div style={{
                    fontFamily: "'Courier Prime',monospace",
                    fontSize: "clamp(6px,0.75vw,9px)",
                    color: P.light, letterSpacing: "0.2em", textTransform: "uppercase",
                }}>{item.date}</div>
                <div style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(9px,1.1vw,13px)",
                    color: P.deep, fontWeight: 700, lineHeight: 1.2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{`${item.caption} ${item.emoji}`}</div>
            </div>

            {/* Tape strip */}
            <div style={{
                position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                width: "clamp(32px,5vw,52px)", height: "clamp(14px,2vw,20px)",
                background: `${P.pale}CC`, borderRadius: 2,
                boxShadow: `0 1px 4px rgba(124,58,237,0.10)`,
            }} />
        </motion.div>
    );
}

function AlbumSparkles() {
    const [dots] = useState(() => Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 3,
        dur: 2.5 + Math.random() * 2,
    })));
    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
            {dots.map(d => (
                <motion.div key={d.id}
                    animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
                        width: d.size, height: d.size, borderRadius: "50%", background: P.light,
                    }}
                />
            ))}
        </div>
    );
}

export default function AlbumPage() {
    const nav = useNavigate();
    const [showBtn, setShowBtn] = useState(false);

    // ── Scroll to top immediately when this page mounts ──
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setShowBtn(true), 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#fff", position: "relative" }}>
            <Particles />
            <AlbumSparkles />
            <TopBar />

            <div style={{
                position: "relative", zIndex: 1,
                padding: "clamp(56px,9vh,90px) clamp(16px,4vw,48px) clamp(60px,10vh,100px)",
            }}>

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

                {/* Gallery — masonry-style staggered offsets */}
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
                        <div key={item.id} style={{
                            // subtle vertical offset for masonry feel — capped small so it doesn't push layout down
                            marginTop: i % 3 === 1
                                ? "clamp(12px,1.8vw,24px)"
                                : i % 3 === 2
                                    ? "clamp(6px,0.9vw,12px)"
                                    : 0,
                        }}>
                            <AlbumCard item={item} index={i} />
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    viewport={{ once: true }}
                    style={{
                        height: 1, maxWidth: 500,
                        margin: "clamp(40px,7vh,80px) auto clamp(24px,4vh,48px)",
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
                                <NavBtn onClick={() => nav("/gift")}>Small Surprise →</NavBtn>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <BottomBar />
        </div>
    );
}