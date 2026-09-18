import React, { forwardRef } from "react";
import PitchLines from "./PitchLines";
import PlayerToken from "./PlayerToken";
import SwapBurst from "./SwapBurst";

const Pitch = forwardRef(function Pitch(
  {
    formation,
    lineup,
    getPlayer,
    onDragStart,
    onSlotDrop,
    onDragOverSlot,
    dragOverSlotId,
    flashIds,
    bursts,
    captainId,
    onTouchStart,
  },
  ref
) {
  return (
    <div className="pitch" ref={ref}>
      <div className="pitch-glow" />
      <PitchLines />

      {formation.slots.map((slot) => {
        const playerId = lineup[slot.id];
        const player = playerId ? getPlayer(playerId) : null;

        if (player) {
          return (
            <PlayerToken
              key={slot.id}
              player={player}
              x={slot.x}
              y={slot.y}
              slotId={slot.id}
              isFlashing={flashIds.has(player.id)}
              isDragOver={dragOverSlotId === slot.id}
              onDragStart={onDragStart}
              onDragOver={onDragOverSlot}
              onDrop={onSlotDrop}
              onTouchStart={onTouchStart}
              captain={player.id === captainId}
            />
          );
        }

        return (
          <div
            key={slot.id}
            data-slot-id={slot.id}
            className={`empty-slot ${dragOverSlotId === slot.id ? "drag-over" : ""}`}
            style={{
              position: "absolute",
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
            onDragOver={(e) => {
              e.preventDefault();
              onDragOverSlot(slot.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              onSlotDrop(e, slot.id);
            }}
          >
            <span>{slot.pos}</span>
          </div>
        );
      })}

      <SwapBurst bursts={bursts} />
    </div>
  );
});

export default Pitch;