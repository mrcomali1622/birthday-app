/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useState, useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FONTS } from "./pages/theme";

/* ── Lazy-loaded routes ─────────────────────────────────────────────
   Each page bundle is only downloaded when that route is first visited.
   While the JS + images for the next page are loading, a full-screen
   shimmer covers the screen so the user never sees a half-loaded page.
─────────────────────────────────────────────────────────────────────── */
const CountdownPage = lazy(() => import("./pages/CountdownPage"));
const GreetingCardPage = lazy(() => import("./pages/GreetingCardPage"));
const CakeCelebrationPage = lazy(() => import("./pages/CakeCelebrationPage"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const GiftPage = lazy(() => import("./pages/GiftPage"));
const FinalQuestionPage = lazy(() => import("./pages/FinalQuestionPage"));

/* ── Full-screen shimmer shown while a page chunk loads ─────────────── */
function PageLoader() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#fff",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 20, zIndex: 9999,
    }}>
      {/* Spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: 48, height: 48, borderRadius: "50%",
          border: "3px solid #EDE9FE",
          borderTopColor: "#7C3AED",
        }}
      />
      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#A78BFA",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Image-preloader for pages that have critical assets ─────────────
   Pass an array of image src strings. Returns true once ALL are loaded.
   The page stays hidden (PageLoader shown) until every image resolves.
─────────────────────────────────────────────────────────────────────── */
function useImagesReady(srcs = []) {
  const [ready, setReady] = useState(srcs.length === 0);

  useEffect(() => {
    if (srcs.length === 0) { setReady(true); return; }

    let loaded = 0;
    const total = srcs.length;

    const onDone = () => {
      loaded += 1;
      if (loaded >= total) setReady(true);
    };

    srcs.forEach(src => {
      if (!src) { onDone(); return; }
      const img = new Image();
      img.onload = onDone;
      img.onerror = onDone; // count errors too — don't hang forever
      img.src = src;
    });
  }, []); // only once on mount

  return ready;
}

/* ── Wrapper that blocks render until critical images are ready ───────
   Wrap any page component with this and pass its key images.
   The page's JS is already loaded (Suspense handled that); this waits
   for the actual image bytes before revealing the page.
─────────────────────────────────────────────────────────────────────── */
function WithImages({ srcs, children }) {
  const ready = useImagesReady(srcs);
  if (!ready) return <PageLoader />;
  return children;
}

/* ── Animated route wrapper ──────────────────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: "relative" }}
      >
        <Routes location={location}>

          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              {/* No critical images on countdown — show immediately */}
              <CountdownPage />
            </Suspense>
          } />

          <Route path="/wish" element={
            <Suspense fallback={<PageLoader />}>
              <WithImages srcs={[require("./assets/profile.jpeg")]}>
                <GreetingCardPage />
              </WithImages>
            </Suspense>
          } />

          <Route path="/cakecut" element={
            <Suspense fallback={<PageLoader />}>
              <CakeCelebrationPage />
            </Suspense>
          } />

          <Route path="/album" element={
            <Suspense fallback={<PageLoader />}>
              {/* Album has many photos — lazy-load inside the page itself,
                  so we just wait for the page JS here */}
              <AlbumPage />
            </Suspense>
          } />

          <Route path="/memories" element={
            <Suspense fallback={<PageLoader />}>
              <TimelinePage />
            </Suspense>
          } />

          <Route path="/gift" element={
            <Suspense fallback={<PageLoader />}>
              <WithImages srcs={[require("./assets/gift.png")]}>
                <GiftPage />
              </WithImages>
            </Suspense>
          } />

          <Route path="/question" element={
            <Suspense fallback={<PageLoader />}>
              <FinalQuestionPage />
            </Suspense>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── App root ─────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F5F3FF; }
        ::-webkit-scrollbar-thumb { background: #A78BFA; border-radius: 8px; }
      `}</style>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </>
  );
}