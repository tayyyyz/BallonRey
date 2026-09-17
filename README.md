# Lineup Builder for B144 & 215

This app was made in order to build your favorite lineup for your favorite team in the upcoming season.

## How to make it work

```bash
npm install
npm run dev
```
## Features
- 9 real-life teams: Real Madrid, Barcelona, Atlético de Madrid (LaLiga), Manchester City,
  Manchester United, Liverpool (Premier League), AC Milan, Inter, Juventus (Serie A).
- Squads featuring signings from the 2026 summer transfer window and EA FC 27-style ratings.
- 5 formations: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 3-4-3.
- Drag and drop players onto the pitch to swap positions (with
  FIFA-style animation: flash + burst of balls).
- Drag players from the bench to make substitutions.
- ‘Download image’ button to export your line-up as a PNG and share it.

## Structure
```
src/
  data/players.js       -> templates and ratings
  data/formations.js    -> coordinates for each formation
  utils/lineupUtils.js  -> logic for assembling the default starting XI
  components/           -> Pitch, PlayerToken, BenchList, Controls, SwapBurst, PitchLines
  App.jsx               -> global state, drag & drop, export to image
```

## Notes on the data
Squad lists and transfers are based on publicly available information from the
2026 summer transfer window (Fabrizio Romano, OneFootball, sports press) as at 25 August 2026.
The ratings are editorial estimates in the style of EA FC, not official EA data.