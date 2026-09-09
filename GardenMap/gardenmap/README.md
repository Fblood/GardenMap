# GardenMap

A local-first app for mapping garden beds, logging plantings, and attaching
real cultivar data (via [Trefle](https://trefle.io)) for record-keeping and
crop planning. No accounts, no cloud — your data stays on your machine.

## Setup

1. `npm install`
2. Get a free Trefle API token at [trefle.io/users/sign_up](https://trefle.io/users/sign_up)
3. `cp server/config.example.json server/config.json` and paste your token into it
4. Run both processes (two terminals):
   - `npm start` — the app, at [http://localhost:3000](http://localhost:3000)
   - `npm run server` — the local API (persistence + Trefle proxy), on port 4001

Garden data is stored in `server/data/garden-data.json` — back that file up
if you want to keep your records; it's gitignored, so it never leaves your
machine unless you copy it yourself.

## What it does

- **Map beds** — lay out beds on a grid, drag to arrange.
- **Log plantings** — plant name, variety, date, notes, per bed.
- **Cultivar lookup** — search Trefle for a plant, attach its scientific
  name/family/image to a planting.
- **Print / export** — a clean, printable garden report for offline
  record-keeping.

## Roadmap

Task calendar generation from cultivar growth data, crop-rotation history
across seasons, and seed-catalog-informed planning are planned next.
