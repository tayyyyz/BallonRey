import React from "react";

function ratingTier(rating) {
  if (rating >= 88) return "tier-icon";
  if (rating >= 82) return "tier-gold";
  if (rating >= 77) return "tier-silver";
  return "tier-bronze";
}

export default function PlayerToken({
  player,
  x,
  y,
  slotId,
  isFlashing,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onTouchStart,
  captain,
}) {
  return (
    <div
      data-slot-id={slotId}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "grab",
        userSelect: "none",
        pointerEvents: "auto",
        touchAction: "none",
      }}
      draggable
      onDragStart={(e) => onDragStart(e, player.id, slotId)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver && onDragOver(slotId);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, slotId);
      }}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart && onTouchStart(e, player.id, slotId)}
      title={`${player.name} · ${player.pos} · ${player.rating}`}
    >
      <div
        className={`${ratingTier(player.rating)} ${isFlashing ? "flashing" : ""} ${
          isDragOver ? "drag-over" : ""
        }`}
        style={{
          position: "relative",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
        }}
      >
        {captain && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              backgroundColor: "#fbbf24",
              color: "#0f172a",
              fontSize: "10px",
              fontWeight: "900",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 35,
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            C
          </span>
        )}

        <div
          style={{
            position: "absolute",
            top: "-7px",
            left: "-7px",
            backgroundColor: "#0f172a",
            color: "#fbbf24",
            fontSize: "10px",
            fontWeight: "bold",
            padding: "1px 4px",
            borderRadius: "4px",
            border: "1px solid #334155",
            zIndex: 35,
          }}
        >
          {player.rating}
        </div>

        <span
          style={{
            fontWeight: "800",
            fontSize: "14px",
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {player.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
      </div>

      <div
        style={{
          marginTop: "4px",
          backgroundColor: "rgba(11, 15, 25, 0.85)",
          color: "#f8fafc",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        }}
      >
        {player.name}
      </div>
    </div>
  );
}