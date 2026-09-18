import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { TEAM_MAP } from "./data/players";
import { FORMATIONS } from "./data/formations";
import { buildDefaultLineup, getPlayerById, teamRating } from "./utils/lineupUtils";
import Controls from "./components/Controls";
import Pitch from "./components/Pitch";
import BenchList from "./components/BenchList";
import "./App.css";

export default function App() {
  const [teamId, setTeamId] = useState("rma");
  const [formationId, setFormationId] = useState("4-3-3");
  const team = TEAM_MAP[teamId];
  const formation = FORMATIONS[formationId];

  const [isBenchOpen, setIsBenchOpen] = useState(false);

  const initial = useMemo(() => buildDefaultLineup(team, formationId), [team, formationId]);
  const [lineup, setLineup] = useState(initial.lineup);
  const [bench, setBench] = useState(initial.bench);
  const [captainId, setCaptainId] = useState(initial.lineup["st"] || Object.values(initial.lineup)[0]);

  const [dragSource, setDragSource] = useState(null);
  const [dragOverSlotId, setDragOverSlotId] = useState(null);
  const [dragOverBench, setDragOverBench] = useState(false);
  const [flashIds, setFlashIds] = useState(new Set());
  const [bursts, setBursts] = useState([]);
  const [exporting, setExporting] = useState(false);

  const [touchDrag, setTouchDrag] = useState(null);

  const captureRef = useRef(null);
  const burstKey = useRef(0);

  const getPlayer = useCallback((id) => getPlayerById(team, id), [team]);

  const rebuild = useCallback((tId, fId) => {
    const t = TEAM_MAP[tId];
    const built = buildDefaultLineup(t, fId);
    setLineup(built.lineup);
    setBench(built.bench);
    setCaptainId(built.lineup["st"] || Object.values(built.lineup)[0]);
    setDragSource(null);
    setBursts([]);
  }, []);

  const handleTeamChange = (newTeamId) => {
    setTeamId(newTeamId);
    rebuild(newTeamId, formationId);
  };

  const handleFormationChange = (newFormationId) => {
    setFormationId(newFormationId);
    rebuild(teamId, newFormationId);
  };

  const handleReset = () => rebuild(teamId, formationId);

  const fireBurst = useCallback(
    (slotIds) => {
      const entries = slotIds
        .map((sid) => formation.slots.find((s) => s.id === sid))
        .filter(Boolean)
        .map((slot) => ({ key: `b${burstKey.current++}`, x: slot.x, y: slot.y }));
      setBursts((prev) => [...prev, ...entries]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => !entries.some((e) => e.key === b.key)));
      }, 750);
    },
    [formation]
  );

  const flashPlayers = useCallback((ids) => {
    setFlashIds(new Set(ids.filter(Boolean)));
    setTimeout(() => setFlashIds(new Set()), 650);
  }, []);

  const performSlotDrop = useCallback(
    (sourcePlayerId, sourceSlotId, targetSlotId) => {
      if (sourceSlotId === targetSlotId) return;

      if (sourceSlotId === "bench") {
        const targetPlayerId = lineup[targetSlotId] || null;
        setLineup((prev) => ({ ...prev, [targetSlotId]: sourcePlayerId }));
        setBench((prev) => {
          let next = prev.filter((id) => id !== sourcePlayerId);
          if (targetPlayerId) next = [targetPlayerId, ...next];
          return next;
        });
        fireBurst([targetSlotId]);
        flashPlayers([sourcePlayerId, targetPlayerId]);
      } else {
        const targetPlayerId = lineup[targetSlotId] || null;
        setLineup((prev) => ({
          ...prev,
          [sourceSlotId]: targetPlayerId,
          [targetSlotId]: sourcePlayerId,
        }));
        fireBurst([sourceSlotId, targetSlotId]);
        flashPlayers([sourcePlayerId, targetPlayerId]);
      }
    },
    [lineup, fireBurst, flashPlayers]
  );

  const performBenchDrop = useCallback((playerId, sourceSlotId) => {
    if (sourceSlotId === "bench") return;
    setLineup((prev) => ({ ...prev, [sourceSlotId]: null }));
    setBench((prev) => [playerId, ...prev]);
  }, []);

  const handleDragStart = (e, playerId, sourceSlotId) => {
    setDragSource({ playerId, slotId: sourceSlotId });
    try {
      e.dataTransfer.setData("text/plain", playerId);
      e.dataTransfer.effectAllowed = "move";
    } catch (err) {
    }
  };

  const handleDragOverSlot = (slotId) => setDragOverSlotId(slotId);

  const handleSlotDrop = (e, targetSlotId) => {
    setDragOverSlotId(null);
    if (!dragSource) return;
    performSlotDrop(dragSource.playerId, dragSource.slotId, targetSlotId);
    setDragSource(null);
  };

  const handleBenchDragOver = () => setDragOverBench(true);

  const handleBenchDrop = () => {
    setDragOverBench(false);
    setDragOverSlotId(null);
    if (!dragSource) return;
    performBenchDrop(dragSource.playerId, dragSource.slotId);
    setDragSource(null);
  };

  const handleTouchStart = useCallback(
    (e, playerId, sourceSlotId) => {
      const touch = e.touches[0];
      const player = getPlayer(playerId);
      setTouchDrag({ playerId, sourceSlotId, x: touch.clientX, y: touch.clientY, player });
    },
    [getPlayer]
  );

  useEffect(() => {
    if (!touchDrag) return;

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      setTouchDrag((prev) => (prev ? { ...prev, x: touch.clientX, y: touch.clientY } : prev));

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const target = el ? el.closest("[data-slot-id]") : null;
      const slotId = target ? target.getAttribute("data-slot-id") : null;

      if (slotId === "bench") {
        setDragOverBench(true);
        setDragOverSlotId(null);
      } else if (slotId) {
        setDragOverBench(false);
        setDragOverSlotId(slotId);
      } else {
        setDragOverBench(false);
        setDragOverSlotId(null);
      }
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const target = el ? el.closest("[data-slot-id]") : null;
      const slotId = target ? target.getAttribute("data-slot-id") : null;

      if (slotId === "bench") {
        performBenchDrop(touchDrag.playerId, touchDrag.sourceSlotId);
      } else if (slotId && slotId !== touchDrag.sourceSlotId) {
        performSlotDrop(touchDrag.playerId, touchDrag.sourceSlotId, slotId);
      }

      setTouchDrag(null);
      setDragOverSlotId(null);
      setDragOverBench(false);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [touchDrag, performSlotDrop, performBenchDrop]);

  const handleExport = async () => {
    if (!captureRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0b3d24",
      });
      const link = document.createElement("a");
      link.download = `${team.short}-${formationId}-alineacion.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error exportando imagen", err);
    } finally {
      setExporting(false);
    }
  };

  const rating = teamRating(team, lineup);

  return (
    <div
      className="app-shell relative min-h-screen"
      style={{
        "--primary": team.colors.primary,
        "--secondary": team.colors.secondary,
        "--txt": team.colors.text,
        "--accent": team.colors.accent,
      }}
    >
      <button
        onClick={() => setIsBenchOpen((prev) => !prev)}
        type="button"
        className={`btn-bench ${isBenchOpen ? "btn-bench-active" : ""}`}
      >
        <span
          className="btn-bench-icon"
          style={{
            transform: isBenchOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        <span>{isBenchOpen ? "Hide Bench" : "View Bench"}</span>
      </button>

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "320px",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(16px)",
          padding: "20px",
          paddingTop: "90px",
          zIndex: 998,
          boxShadow: "20px 0 30px rgba(0,0,0,0.5)",
          transform: isBenchOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            🛡️ Sub Bench
          </h2>
          <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "9999px", backgroundColor: "#1e293b", color: "#94a3b8" }}>
            {bench.length} avail.
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
          <BenchList
            players={bench.map(getPlayer).filter(Boolean)}
            onDragStart={handleDragStart}
            onDrop={handleBenchDrop}
            onDragOver={handleBenchDragOver}
            isDragOver={dragOverBench}
            onTouchStart={handleTouchStart}
          />
        </div>
      </aside>

      <header className="app-header">
        <div className="logo-badge">⚽</div>
        <div>
          <h1>BallonRey</h1>
          <p>Build your ideal XI with real transfers for the 2026/27 season :D</p>
        </div>
      </header>

      <Controls
        teamId={teamId}
        formationId={formationId}
        onTeamChange={handleTeamChange}
        onFormationChange={handleFormationChange}
        onReset={handleReset}
        onExport={handleExport}
        exporting={exporting}
        rating={rating}
      />

      <div className="capture-area max-w-sm mx-auto my-2 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-2xl" ref={captureRef}>
        <div className="capture-header mb-2 flex items-center justify-between px-1" data-team={teamId}>
          <div className="capture-team flex items-center gap-1.5">
            <span className="capture-dot w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{ backgroundColor: team.colors.primary }} />
            <strong className="text-white text-xs font-bold">{team.name}</strong>
            <span className="capture-coach text-[11px] text-slate-400">DT: {team.coach}</span>
          </div>
          <div className="capture-formation text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700/50">{formation.label}</div>
        </div>

        <div className="w-full">
          <Pitch
            formation={formation}
            lineup={lineup}
            getPlayer={getPlayer}
            onDragStart={handleDragStart}
            onSlotDrop={handleSlotDrop}
            onDragOverSlot={handleDragOverSlot}
            dragOverSlotId={dragOverSlotId}
            flashIds={flashIds}
            bursts={bursts}
            captainId={captainId}
            onTouchStart={handleTouchStart}
          />
        </div>

        <div className="capture-footer mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Rating: <strong className="text-emerald-400 font-semibold">{rating}</strong></span>
          <span>BallonRey</span>
        </div>
      </div>

      <footer className="hint pb-4 text-center text-xs text-slate-500">
        Drag a player over another to swap positions.
      </footer>
      
      {touchDrag && (
        <div
          className="touch-ghost-token"
          style={{ left: touchDrag.x, top: touchDrag.y }}
        >
          <span>
            {touchDrag.player?.name
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}