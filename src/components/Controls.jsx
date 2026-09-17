import { TEAMS } from "../data/players";
import { FORMATIONS } from "../data/formations";

const LEAGUES = ["LaLiga", "Premier League", "Serie A"];

export default function Controls({
  teamId,
  formationId,
  onTeamChange,
  onFormationChange,
  onReset,
  onExport,
  exporting,
  rating,
}) {
  return (
    <div className="controls glass">
      <div className="controls-row">
        <div className="control-group">
          <label>Team</label>
          <select value={teamId} onChange={(e) => onTeamChange(e.target.value)}>
            {LEAGUES.map((league) => (
              <optgroup label={league} key={league}>
                {TEAMS.filter((t) => t.league === league).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Line-Up</label>
          <select value={formationId} onChange={(e) => onFormationChange(e.target.value)}>
            {Object.entries(FORMATIONS).map(([id, f]) => (
              <option key={id} value={id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group rating-badge">
          <label>Team's overall</label>
          <div className="rating-value">{rating}</div>
        </div>

        <div className="control-group buttons">
          <button className="btn-secondary" onClick={onReset} type="button">
            ↺ Reset Line-Up
          </button>
          <button className="btn-primary" onClick={onExport} type="button" disabled={exporting}>
            {exporting ? "Generating…" : "📸 Download Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
