import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BALL_OFFSETS = [
  { dx: 0, dy: -34, delay: 0 },
  { dx: 26, dy: -14, delay: 0.03 },
  { dx: 22, dy: 20, delay: 0.06 },
  { dx: -22, dy: 20, delay: 0.03 },
  { dx: -26, dy: -14, delay: 0.06 },
  { dx: 0, dy: 30, delay: 0.09 },
];

export default function SwapBurst({ bursts }) {
  return (
    <AnimatePresence>
      {bursts.map((b) => (
        <div key={b.key} className="burst-wrap" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          <motion.div
            className="shock-ring"
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className="shine-flash"
            initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.6, 2], rotate: 90 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
          {BALL_OFFSETS.map((o, i) => (
            <motion.span
              key={i}
              className="burst-ball"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
              animate={{
                x: o.dx,
                y: o.dy,
                opacity: 0,
                scale: 1,
                rotate: 360,
              }}
              transition={{ duration: 0.7, delay: o.delay, ease: "easeOut" }}
            >
              ⚽
            </motion.span>
          ))}
        </div>
      ))}
    </AnimatePresence>
  );
}
