import { FORMATIONS, POS_GROUP } from "../data/formations";


export function buildDefaultLineup(team, formationId) {
  const formation = FORMATIONS[formationId];
  const pool = [...team.players].sort((a, b) => b.rating - a.rating);
  const used = new Set();
  const lineup = {};


  formation.slots.forEach((slot) => {
    const match = pool.find((pl) => !used.has(pl.id) && pl.pos === slot.pos);
    if (match) {
      lineup[slot.id] = match.id;
      used.add(match.id);
    }
  });


  formation.slots.forEach((slot) => {
    if (lineup[slot.id]) return;
    const group = POS_GROUP[slot.pos];
    const match = pool.find((pl) => !used.has(pl.id) && POS_GROUP[pl.pos] === group);
    if (match) {
      lineup[slot.id] = match.id;
      used.add(match.id);
    }
  });


  formation.slots.forEach((slot) => {
    if (lineup[slot.id]) return;
    const match = pool.find((pl) => !used.has(pl.id));
    if (match) {
      lineup[slot.id] = match.id;
      used.add(match.id);
    }
  });

  const bench = team.players.filter((pl) => !used.has(pl.id)).map((pl) => pl.id);
  return { lineup, bench };
}

export function getPlayerById(team, id) {
  return team.players.find((p) => p.id === id);
}

export function teamRating(team, lineup) {
  const ids = Object.values(lineup).filter(Boolean);
  if (!ids.length) return 0;
  const total = ids.reduce((sum, id) => {
    const pl = getPlayerById(team, id);
    return sum + (pl ? pl.rating : 0);
  }, 0);
  return Math.round(total / ids.length);
}
