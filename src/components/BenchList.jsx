import { motion, AnimatePresence } from "framer-motion";

export default function BenchList({ players, onDragStart, onDrop, onDragOver, isDragOver, onTouchStart }) {
  return (
    <div
      data-slot-id="bench"
      className={`bench ${isDragOver ? "bench-drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver && onDragOver();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e);
      }}
    >
      <div className="bench-title">Substitutes Squad({players.length})</div>
      <div className="bench-grid">
        <AnimatePresence>
          {players.map((player) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bench-card"
              draggable
              onDragStart={(e) => onDragStart(e, player.id, "bench")}
              onTouchStart={(e) => onTouchStart && onTouchStart(e, player.id, "bench")}
              title={`${player.name} · ${player.pos} · ${player.rating}`}
            >
              <span className="bench-rating">{player.rating}</span>
              <span className="bench-pos">{player.pos}</span>
              <span className="bench-name">{player.name}</span>
              {player.nat && <span className="bench-flag">{player.nat}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}