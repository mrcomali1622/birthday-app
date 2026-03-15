import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BirthdayCard({ onOpen }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleOpen = () => {
        if (!isOpened) {
            setIsOpened(true);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080012",
            fontFamily: "'Georgia', serif",
            perspective: "1500px", // Key for 3D effect
            overflow: "hidden"
        }}>
            {/* Background elements */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "60vw",
                height: "60vw",
                background: "radial-gradient(circle, rgba(255,107,157,0.15) 0%, transparent 60%)",
                pointerEvents: "none",
                zIndex: 0
            }} />

            <div style={{
                position: "relative",
                width: "clamp(300px, 80vw, 400px)",
                height: "500px",
                zIndex: 1,
                cursor: isOpened ? "default" : "pointer"
            }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleOpen}
            >
                {/* ── CARD BACK (Inside Right) ── */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                    textAlign: "center",
                    zIndex: 1
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <h2 style={{
                            fontSize: "28px",
                            color: "#FF6B9D",
                            marginBottom: "20px",
                            fontStyle: "italic"
                        }}>
                            Happy Birthday!
                        </h2>
                        <p style={{
                            fontSize: "16px",
                            color: "#555",
                            lineHeight: 1.6,
                            marginBottom: "40px"
                        }}>
                            Wishing you a day filled with love, laughter, and all your favorite things.
                        </p>
                        
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #FF6B9D66" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent re-triggering card open
                                onOpen(); // Navigate to main site
                            }}
                            style={{
                                background: "linear-gradient(135deg, #FF6B9D, #FF9F43)",
                                border: "none",
                                borderRadius: "30px",
                                padding: "12px 32px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "white",
                                cursor: "pointer",
                                boxShadow: "0 5px 15px rgba(255,107,157,0.4)"
                            }}
                        >
                            See Your Surprise ✨
                        </motion.button>
                    </motion.div>
                </div>

                {/* ── CARD INSIDE LEFT ── */}
                <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: isOpened ? -180 : 0 }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                        zIndex: 2,
                    }}
                >
                    {/* Inner side of the flap (Faces user when opened) */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "#fdfdfd",
                        borderRadius: "16px",
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.1)",
                        transform: "rotateY(180deg)", // Flips it to back of the flap
                        backfaceVisibility: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        borderRight: "1px solid #eee", // Crease line
                    }}>
                       <div style={{
                           width: "100%",
                           height: "70%",
                           background: "#ffeaf0",
                           borderRadius: "12px",
                           border: "8px solid white",
                           boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           overflow: "hidden",
                           position: "relative"
                       }}>
                           {/* Placeholder Photo */}
                            <img 
                                src="https://images.unsplash.com/photo-1530103862676-de8892bc952f?w=600&h=800&fit=crop" 
                                alt="Memory"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                            {/* Photo corner accents */}
                            <div style={{ position: "absolute", top: 10, left: 10, width: 20, height: 20, borderTop: "2px solid rgba(255,255,255,0.8)", borderLeft: "2px solid rgba(255,255,255,0.8)"}} />
                            <div style={{ position: "absolute", bottom: 10, right: 10, width: 20, height: 20, borderBottom: "2px solid rgba(255,255,255,0.8)", borderRight: "2px solid rgba(255,255,255,0.8)"}} />
                       </div>
                       <p style={{ marginTop: "24px", color: "#888", fontStyle: "italic", fontSize: "14px" }}>
                           A special memory...
                       </p>
                    </div>

                    {/* ── CARD FRONT (Faces user when closed) ── */}
                    <motion.div
                        animate={{ 
                            boxShadow: isHovered && !isOpened 
                                ? "10px 10px 30px rgba(0,0,0,0.6)" 
                                : "5px 5px 20px rgba(0,0,0,0.4)" 
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(135deg, #1e0036, #0A0015)",
                            borderRadius: "16px",
                            backfaceVisibility: "hidden", // Hides when flipped
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(255,107,157,0.3)",
                            overflow: "hidden"
                        }}
                    >
                        {/* Decorative Front Elements */}
                        <div style={{
                            position: "absolute",
                            inset: "16px",
                            border: "2px dashed rgba(255,107,157,0.4)",
                            borderRadius: "12px",
                            pointerEvents: "none"
                        }} />
                        
                        <motion.div
                             animate={{ y: [0, -10, 0] }}
                             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                             style={{ fontSize: "64px", marginBottom: "24px" }}
                        >
                            💌
                        </motion.div>

                        <h1 style={{
                            fontSize: "32px",
                            color: "white",
                            fontStyle: "italic",
                            marginBottom: "16px",
                            textShadow: "0 2px 10px rgba(255,107,157,0.8)"
                        }}>
                            For You
                        </h1>

                        <AnimatePresence>
                            {!isOpened && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{
                                        color: "#FF9F43",
                                        letterSpacing: "0.2em",
                                        fontSize: "12px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    Click to open
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
