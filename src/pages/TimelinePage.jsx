import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { P } from "./theme";
import { TopBar, BottomBar, NavBtn, PageLabel, Particles } from "./SharedUI";
import { MEMORIES } from "./memories";

// /* Photo box — shows real image if provided, emoji fallback otherwise */
// function MemoryPhoto({ memory }) {
//   const [imgErr, setImgErr] = useState(false);
//   const showImg = memory.photo && !imgErr;

//   return (
//     <div style={{
//       width: "100%",
//       height: "clamp(130px,16vw,190px)",
//       borderRadius: 12,
//       marginBottom: 14,
//       border: `1px solid ${P.pale}`,
//       overflow: "hidden",
//       position: "relative",
//       background: `linear-gradient(135deg, ${memory.color}, ${P.pale})`,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     }}>
//       {showImg ? (
//         <img
//           src={memory.photo}
//           alt={memory.title}
//           onError={() => setImgErr(true)}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             objectPosition: "center",
//             display: "block",
//           }}
//         />
//       ) : (
//         <>
//           <span style={{
//             fontSize: "clamp(38px,6vw,60px)",
//             filter: "drop-shadow(0 2px 10px rgba(124,58,237,0.22))",
//           }}>
//             {memory.emoji}
//           </span>
//           {/* <div style={{
//             position: "absolute", bottom: 6, right: 9,
//             fontFamily: "'Courier Prime', monospace",
//             fontSize: 7, color: `${P.light}99`,
//             letterSpacing: "0.18em", textTransform: "uppercase",
//           }}>Add your photo</div> */}
//         </>
//       )}
//       {/* Vignette on real photos */}
//       {showImg && (
//         <div style={{
//           position: "absolute", inset: 0, pointerEvents: "none",
//           background: "linear-gradient(to bottom, transparent 55%, rgba(124,58,237,0.18))",
//         }} />
//       )}
//     </div>
//   );
// }

// function TimelineItem({ memory, index }) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { root: true, margin: "-80px" });
//   const isLeft = index % 2 === 0;

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 30 }}
//       animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
//       transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: isLeft ? "flex-end" : "flex-start",
//         paddingLeft: isLeft ? 0 : "calc(50% + 24px)",
//         paddingRight: isLeft ? "calc(50% + 24px)" : 0,
//         marginBottom: "clamp(32px,5vh,56px)",
//         position: "relative",
//       }}
//     >
//       {/* Dot on spine */}
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={inView ? { scale: 1 } : {}}
//         transition={{ duration: 0.4, delay: 0.2 }}
//         style={{
//           position: "absolute",
//           left: "49.2%",
//           top: 20,
//           transform: "translateX(-50%)",
//           width: 16, height: 16, borderRadius: "50%",
//           background: P.main,
//           border: "3px solid #fff",
//           boxShadow: `0 0 0 3px ${P.pale},0 4px 12px ${P.main}55`,
//           zIndex: 2,
//         }}
//       />

//       {/* Card */}
//       <div style={{
//         background: "#fff",
//         border: `1.5px solid ${P.pale}`,
//         borderRadius: 20,
//         padding: "clamp(18px,2.5vw,28px)",
//         boxShadow: `0 4px 32px rgba(124,58,237,0.09)`,
//         maxWidth: "clamp(260px,38vw,420px)",
//         width: "100%",
//         position: "relative",
//         overflow: "hidden",
//       }}>
//         {/* Top tint */}
//         <div style={{
//           position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
//           background: `linear-gradient(155deg,${memory.color}AA 0%,transparent 55%)`,
//         }} />

//         {/* Photo */}
//         <MemoryPhoto memory={memory} />

//         <div style={{ position: "relative", zIndex: 1 }}>
//           <div style={{
//             fontFamily: "'Courier Prime',monospace",
//             fontSize: "clamp(8px,0.9vw,10px)",
//             letterSpacing: "0.3em", textTransform: "uppercase",
//             color: P.light, marginBottom: 4,
//           }}>{memory.date}</div>
//           <div style={{
//             fontFamily: "'Playfair Display',serif",
//             fontSize: "clamp(16px,2.2vw,22px)",
//             color: P.main, fontWeight: 700, marginBottom: 8, lineHeight: 1.2,
//           }}>{memory.title}</div>
//           <p style={{
//             fontFamily: "'Crimson Pro',serif",
//             fontSize: "clamp(13px,1.5vw,16px)",
//             color: "#5B3A8C", lineHeight: 1.7, fontStyle: "italic",
//           }}>{memory.description}</p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default function TimelinePage() {
//   const nav = useNavigate();

//   return (
//     <div style={{ minHeight: "100vh", background: "#fff", position: "relative" }}>
//       <TopBar />

//       {/* Spine line */}
//       <div style={{
//         position: "absolute", left: "50%", top: 120, bottom: 120,
//         width: 2, transform: "translateX(-50%)",
//         background: `linear-gradient(to bottom,transparent,${P.pale} 8%,${P.pale} 92%,transparent)`,
//         zIndex: 0,
//       }} />

//       <div style={{ padding: "clamp(60px,10vh,100px) clamp(16px,4vw,40px) clamp(40px,6vh,80px)" }}>

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.9 }}
//           style={{ textAlign: "center", marginBottom: "clamp(40px,7vh,80px)", position: "relative", zIndex: 1 }}
//         >
//           <PageLabel>✦ Our Story ✦</PageLabel>
//           <div style={{
//             fontFamily: "'Bebas Neue','Impact',sans-serif",
//             fontSize: "clamp(30px,5vw,64px)",
//             color: P.main, letterSpacing: "0.08em",
//           }}>Memories We've Made</div>
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
//             style={{
//               fontFamily: "'Crimson Pro',serif",
//               fontSize: "clamp(14px,1.8vw,20px)",
//               color: `${P.light}BB`, fontStyle: "italic", marginTop: 8,
//             }}
//           >Scroll through the moments that made us</motion.div>
//         </motion.div>

//         {/* Timeline items */}
//         <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
//           {MEMORIES.map((m, i) => (
//             <TimelineItem key={m.id} memory={m} index={i} />
//           ))}
//         </div>

//         {/* End of timeline */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true, margin: "-50px" }}
//           style={{
//             textAlign: "center", marginTop: "clamp(20px,4vh,48px)",
//             display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
//             position: "relative", zIndex: 1,
//           }}
//         >
//           <div style={{ display: "flex", gap: 8, fontSize: "clamp(18px,2.5vw,28px)" }}>
//             {["💜", "🌟", "💜", "🌟", "💜"].map((e, i) => (
//               <motion.span key={i}
//                 animate={{ y: [0, -6, 0] }}
//                 transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}
//               >{e}</motion.span>
//             ))}
//           </div>
//           <p style={{
//             fontFamily: "'Crimson Pro',serif",
//             fontSize: "clamp(14px,1.8vw,20px)",
//             color: "#6B3FA0", fontStyle: "italic", maxWidth: 400, lineHeight: 1.7,
//           }}>
//             And this is just the beginning of all<br />the beautiful chapters ahead of us.
//           </p>
//           <NavBtn onClick={() => nav("/question")}>One Last Thing →</NavBtn>
//         </motion.div>
//       </div>

//       <BottomBar />
//     </div>
//   );
// }

function TItem({ m, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { root: true, margin: "-70px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1], delay: index * 0.06 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isLeft ? "flex-end" : "flex-start",
        paddingLeft: isLeft ? 0 : "calc(50% + 28px)",
        paddingRight: isLeft ? "calc(50% + 28px)" : 0,
        marginBottom: "clamp(24px,4vh,44px)",
        position: "relative",
      }}
    >
      {/* spine dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.35, delay: index * 0.06 + 0.15 }}
        style={{
          position: "absolute", left: "50%", top: 22,
          transform: "translateX(-50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: `linear-gradient(135deg,${P.main},${P.mid})`,
          border: "3px solid #fff", zIndex: 2,
          boxShadow: `0 0 0 3px ${P.pale},0 4px 14px ${P.main}55`,
        }}
      />
      {/* connector line segment from dot to card */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.06 + 0.2 }}
        style={{
          position: "absolute", top: 28,
          [isLeft ? "right" : "left"]: "calc(50% + 14px)",
          width: "clamp(14px,2vw,28px)",
          height: 2,
          background: `linear-gradient(${isLeft ? "to left" : "to right"},${P.pale},${P.mid}66)`,
          transformOrigin: isLeft ? "right center" : "left center",
        }}
      />

      {/* card */}
      <motion.div
        whileHover={{ y: -3, boxShadow: `0 12px 44px rgba(124,58,237,0.14)` }}
        transition={{ duration: 0.2 }}
        style={{
          background: "#fff",
          border: `1.5px solid ${P.pale}`,
          borderRadius: 18,
          padding: "clamp(18px,2.4vw,28px)",
          maxWidth: "clamp(240px,34vw,390px)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 4px 28px rgba(124,58,237,0.08)`,
        }}
      >
        {/* tint */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none",
          background: `linear-gradient(145deg,${P.xpale} 0%,transparent 50%)`,
        }} />

        {/* left accent bar */}
        <div style={{
          position: "absolute",
          [isLeft ? "right" : "left"]: 0,
          top: 16, bottom: 16, width: 3,
          background: `linear-gradient(to bottom,${P.mid},${P.pale})`,
          borderRadius: 99,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* date */}
          <div style={{
            fontFamily: "'Courier Prime','Courier New',monospace",
            fontSize: "clamp(7px,0.85vw,10px)",
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: P.light, marginBottom: 6,
          }}>{m.date}</div>

          {/* title */}
          <div style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(15px,1.9vw,22px)",
            color: P.main, fontWeight: 700,
            lineHeight: 1.2, marginBottom: 10,
          }}>{m.title}</div>

          {/* divider */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg,${P.pale},${P.mid}44,transparent)`,
            marginBottom: 10,
            borderRadius: 99,
          }} />

          {/* description */}
          <p style={{
            fontFamily: "Georgia,serif",
            fontSize: "clamp(12px,1.35vw,15px)",
            color: "#5B3A8C", lineHeight: 1.78,
            fontStyle: "italic", margin: 0,
          }}>{m.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: "relative" }}>
      <Particles /><TopBar />

      {/* vertical spine */}
      <div style={{
        position: "absolute", left: "50%", top: 100, bottom: 100, width: 2,
        transform: "translateX(-50%)",
        background: `linear-gradient(to bottom,transparent,${P.pale} 6%,${P.pale} 94%,transparent)`,
        zIndex: 0,
      }} />

      <div style={{ padding: "clamp(56px,9vh,96px) clamp(16px,4vw,40px) clamp(40px,6vh,80px)" }}>

        {/* header */}
        <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          style={{ textAlign: "center", marginBottom: "clamp(36px,6vh,72px)", position: "relative", zIndex: 1 }}>
          <PageLabel>✦ Our Story ✦</PageLabel>
          <div style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: "clamp(28px,4.8vw,62px)", color: P.main, letterSpacing: "0.08em"
          }}>
            Memories We've Made</div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{
              fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.6vw,18px)",
              color: `${P.light}BB`, fontStyle: "italic", marginTop: 8
            }}>
            Scroll through the moments that made us</motion.p>
        </motion.div>

        {/* items */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto" }}>
          {MEMORIES.map((m, i) => <TItem key={m.id} m={m} index={i} />)}
        </div>

        {/* footer */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} viewport={{ root: true, margin: "-50px" }}
          style={{
            textAlign: "center", marginTop: "clamp(20px,4vh,52px)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            position: "relative", zIndex: 1
          }}>
          <div style={{ display: "flex", gap: 8, fontSize: "clamp(16px,2.5vw,26px)" }}>
            {["💜", "🌟", "💜", "🌟", "💜"].map((e, i) => (
              <motion.span key={i} animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}>{e}</motion.span>
            ))}
          </div>
          <p style={{
            fontFamily: "Georgia,serif", fontSize: "clamp(13px,1.7vw,18px)",
            color: "#6B3FA0", fontStyle: "italic", maxWidth: 400, lineHeight: 1.7
          }}>
            And this is just the beginning of all<br />the beautiful chapters ahead of us.</p>
          <NavBtn onClick={() => nav("/album")}>Our Album →</NavBtn>
        </motion.div>
      </div>
      <BottomBar />
    </div>
  );
}
