// import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FONTS } from "./pages/theme";
import CountdownPage from "./pages/CountdownPage";
// import GreetingCardPage from "./pages/GreetingCardPage";
// import CakeCelebrationPage from "./pages/CakeCelebrationPage";
// import TimelinePage from "./pages/TimelinePage";
// import FinalQuestionPage from "./pages/FinalQuestionPage";
import { HashRouter, Route, Routes } from "react-router-dom";
// import AlbumPage from "./pages/AlbumPage";
// import GiftPage from "./pages/GiftPage";

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
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<CountdownPage />} />
            <Route path="/greetingcard" element={<><div>Summa page</div></>} />
            {/* <Route path="/greetingcard" element={<GreetingCardPage />} />
            <Route path="/cakecut" element={<CakeCelebrationPage />} />
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/memories" element={<TimelinePage />} />
            <Route path="/gift" element={<GiftPage />} />
            <Route path="/question" element={<FinalQuestionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} /> */}
            {/* <Route path="/gift" element={<Navigate to="/question" replace />} /> */}

          </Routes>
        </AnimatePresence>
      </HashRouter>
    </>
  );
}
