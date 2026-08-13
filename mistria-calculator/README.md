# Mistria Crop Profit Calculator

A static, dependency-free site that works out what a planting of any *Fields of
Mistria* crop is worth by the last day of the season.

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## How the profit is worked out

A season is **28 days**. A crop planted on day `D` is ready on day
`D + growthTime` — so a Turnip (4 days) planted on day 1 is harvested on day 5
for 40t.

- **Single-harvest crops** are picked once, on `D + growthTime`.
- **Regrowing crops** keep producing every `regrowTime` days after that first
  harvest, for as long as the season lasts.
- **Fruit trees** take 14 days to mature, then drop **3 fruit** every 3 days.
- If the first harvest would land after day 28 the crop never gets picked, and
  the profit is the seed cost as a straight loss.

```
profit = (harvests × yieldPerPlant × quantity × sellPrice) − (quantity × seedPrice)
```

## Data

Growth times, regrow times and sell values come from each crop's infobox on the
[Fields of Mistria Wiki](https://fieldsofmistria.wiki.gg/wiki/Spring), read from
the raw wikitext rather than the rendered page.

Seed prices are **General Store prices only**. That means:

- Balor's Wagon prices (which are marked up) are not used.
- Crops whose seeds only come from foraging or the Seed Maker — Lilac, Chickpea,
  Snowdrop Anemone, and the herbs — are left out, because they have no store
  price to calculate against.
- Seeds marked ★ are only stocked after the *Repair the General Store* quest.

Sell prices are base (no-star) quality. Silver, gold and rainbow crops are worth
more, so the figures here are a floor.

Sprites in `assets/crops/` are the wiki's item icons (72×72 PNG).

## Caveats

- The calculator models **one planting**. It does not replant after a harvest.
- Fruit trees survive the season change and fruit again every year, so the
  single-season figure understates them. The result panel says so when a tree is
  selected.
- Watering is assumed. Un-watered crops do not advance a growth day.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Theme, light + dark, reduced-motion and forced-colors support |
| `data.js` | Crop table — prices, growth times, sprites |
| `app.js` | Profit maths, rendering, input handling |

Fields of Mistria is made by NPC Studio. This is an unofficial fan tool.
