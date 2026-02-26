import { Routes, Route, useLocation, Navigate } from "react-router";
import LandingPage from "./pages/landing";
import OverviewPage from "./pages/overview";
import ReviewQueuePage from "./pages/review";
import BriefsPage from "./pages/briefs";
import ResultsPage from "./pages/results";
import ThreatDatabasePage from "./pages/threat-database";
import SystemControlsPage from "./pages/system-controls";
import ResultsDataPage from "./pages/results-data";
import NotFound from "./pages/not-found";
import { Navbar } from "./components/Navbar";

export default function App() {
  const location = useLocation();
  const useDashboard =
    location.pathname === "/" ||
    location.pathname === "/upload" ||
    location.pathname === "/review" ||
    location.pathname === "/briefs" ||
    location.pathname.startsWith("/results/");

  return (
    <div className="relative min-h-screen flex flex-col">
      {!useDashboard && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<OverviewPage />} />
          <Route path="/live-feeds" element={<Navigate to="/upload" replace />} />
          <Route path="/results/:batchId" element={<ResultsPage />} />
          <Route path="/results/:batchId/data" element={<ResultsDataPage />} />
          <Route path="/review" element={<ReviewQueuePage />} />
          <Route path="/briefs" element={<BriefsPage />} />
          <Route path="/reference" element={<ThreatDatabasePage />} />
          <Route path="/config" element={<SystemControlsPage />} />
          {/* CRITICAL: ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
