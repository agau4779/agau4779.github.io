/*
 * Crop data for Fields of Mistria.
 *
 * All numbers are taken from the wiki's crop infoboxes (fieldsofmistria.wiki.gg).
 * Seed prices are General Store prices only -- Balor's Wagon marks seeds up, and
 * foraged / Seed Maker crops (Lilac, Chickpea, Snowdrop Anemone, herbs, ...) are
 * left out entirely since they have no store price.
 *
 *   seedPrice     cost of one seed at the General Store, in tesserae
 *   sellPrice     base (no-star) sell value of one harvested item
 *   growthTime    days from planting until the first harvest
 *   regrowTime    days between harvests after the first (omitted = single harvest)
 *   yieldPerPlant items produced per plant per harvest (fruit trees give 3)
 *   postRepair    seed only stocked after the "Repair the General Store" quest
 */

const SEASON_LENGTH = 28;

const SEASONS = [
  { id: 'spring', name: 'Spring', emoji: '🌸' },
  { id: 'summer', name: 'Summer', emoji: '🌞' },
  { id: 'fall', name: 'Fall', emoji: '🍂' },
  { id: 'winter', name: 'Winter', emoji: '❄️' },
];

const CROPS = [
  // ---------------------------------------------------------------- Spring
  { id: 'daffodil',   name: 'Daffodil',   season: 'spring', image: 'Daffodil.png',   seedPrice: 15,  sellPrice: 25,  growthTime: 4 },
  { id: 'tulip',      name: 'Tulip',      season: 'spring', image: 'Tulip.png',      seedPrice: 20,  sellPrice: 30,  growthTime: 6 },
  { id: 'turnip',     name: 'Turnip',     season: 'spring', image: 'Turnip.png',     seedPrice: 25,  sellPrice: 40,  growthTime: 4 },
  { id: 'potato',     name: 'Potato',     season: 'spring', image: 'Potato.png',     seedPrice: 40,  sellPrice: 75,  growthTime: 6 },
  { id: 'carrot',     name: 'Carrot',     season: 'spring', image: 'Carrot.png',     seedPrice: 40,  sellPrice: 80,  growthTime: 6, postRepair: true },
  { id: 'cabbage',    name: 'Cabbage',    season: 'spring', image: 'Cabbage.png',    seedPrice: 70,  sellPrice: 180, growthTime: 9 },
  { id: 'strawberry', name: 'Strawberry', season: 'spring', image: 'Strawberry.png', seedPrice: 300, sellPrice: 125, growthTime: 5, regrowTime: 3 },
  { id: 'peas',       name: 'Peas',       season: 'spring', image: 'Peas.png',       seedPrice: 300, sellPrice: 135, growthTime: 5, regrowTime: 3, postRepair: true },
  { id: 'cherry',     name: 'Cherry',     season: 'spring', image: 'Cherry.png',     seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },
  { id: 'lemon',      name: 'Lemon',      season: 'spring', image: 'Lemon.png',      seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },

  // ---------------------------------------------------------------- Summer
  { id: 'daisy',       name: 'Daisy',        season: 'summer', image: 'Daisy.png',        seedPrice: 10,  sellPrice: 15,  growthTime: 4 },
  { id: 'catmint',     name: 'Catmint',      season: 'summer', image: 'Catmint.png',      seedPrice: 20,  sellPrice: 30,  growthTime: 6 },
  { id: 'cosmos',      name: 'Cosmos',       season: 'summer', image: 'Cosmos.png',       seedPrice: 20,  sellPrice: 30,  growthTime: 6, postRepair: true },
  { id: 'sunflower',   name: 'Sunflower',    season: 'summer', image: 'Sunflower.png',    seedPrice: 20,  sellPrice: 30,  growthTime: 6 },
  { id: 'cucumber',    name: 'Cucumber',     season: 'summer', image: 'Cucumber.png',     seedPrice: 25,  sellPrice: 40,  growthTime: 4 },
  { id: 'chili',       name: 'Chili Pepper', season: 'summer', image: 'Chili_pepper.png', seedPrice: 40,  sellPrice: 75,  growthTime: 6 },
  { id: 'sugarcane',   name: 'Sugar Cane',   season: 'summer', image: 'Sugar_cane.png',   seedPrice: 40,  sellPrice: 80,  growthTime: 6, postRepair: true },
  { id: 'watermelon',  name: 'Watermelon',   season: 'summer', image: 'Watermelon.png',   seedPrice: 70,  sellPrice: 180, growthTime: 9 },
  { id: 'corn',        name: 'Corn',         season: 'summer', image: 'Corn.png',         seedPrice: 300, sellPrice: 125, growthTime: 5, regrowTime: 3 },
  { id: 'tomato',      name: 'Tomato',       season: 'summer', image: 'Tomato.png',       seedPrice: 300, sellPrice: 125, growthTime: 5, regrowTime: 3 },
  { id: 'tea',         name: 'Tea',          season: 'summer', image: 'Tea.png',          seedPrice: 300, sellPrice: 135, growthTime: 5, regrowTime: 3, postRepair: true },
  { id: 'peach',       name: 'Peach',        season: 'summer', image: 'Peach.png',        seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },
  { id: 'pear',        name: 'Pear',         season: 'summer', image: 'Pear.png',         seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },

  // ------------------------------------------------------------------ Fall
  { id: 'celosia',       name: 'Celosia',       season: 'fall', image: 'Celosia.png',       seedPrice: 15,  sellPrice: 25,  growthTime: 4 },
  { id: 'chrysanthemum', name: 'Chrysanthemum', season: 'fall', image: 'Chrysanthemum.png', seedPrice: 20,  sellPrice: 30,  growthTime: 6 },
  { id: 'sweetpotato',   name: 'Sweet Potato',  season: 'fall', image: 'Sweet_potato.png',  seedPrice: 25,  sellPrice: 40,  growthTime: 4 },
  { id: 'broccoli',      name: 'Broccoli',      season: 'fall', image: 'Broccoli.png',      seedPrice: 40,  sellPrice: 75,  growthTime: 6 },
  { id: 'pumpkin',       name: 'Pumpkin',       season: 'fall', image: 'Pumpkin.png',       seedPrice: 70,  sellPrice: 180, growthTime: 9 },
  { id: 'cranberry',     name: 'Cranberry',     season: 'fall', image: 'Cranberry.png',     seedPrice: 300, sellPrice: 125, growthTime: 5, regrowTime: 3 },
  { id: 'onion',         name: 'Onion',         season: 'fall', image: 'Onion.png',         seedPrice: 300, sellPrice: 135, growthTime: 5, regrowTime: 3, postRepair: true },
  { id: 'wheat',         name: 'Wheat',         season: 'fall', image: 'Wheat.png',         seedPrice: 300, sellPrice: 150, growthTime: 9, regrowTime: 3 },
  { id: 'rice',          name: 'Rice Stalk',    season: 'fall', image: 'Rice_stalk.png',    seedPrice: 300, sellPrice: 150, growthTime: 9, regrowTime: 3, postRepair: true },
  { id: 'apple',         name: 'Apple',         season: 'fall', image: 'Apple.png',         seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },
  { id: 'orange',        name: 'Orange',        season: 'fall', image: 'Orange.png',        seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },

  // ---------------------------------------------------------------- Winter
  { id: 'frostlily',   name: 'Frost Lily',    season: 'winter', image: 'Frost_lily.png',    seedPrice: 15,  sellPrice: 25,  growthTime: 4 },
  { id: 'poinsettia',  name: 'Poinsettia',    season: 'winter', image: 'Poinsettia.png',    seedPrice: 20,  sellPrice: 30,  growthTime: 6 },
  { id: 'beet',        name: 'Beet',          season: 'winter', image: 'Beet.png',          seedPrice: 25,  sellPrice: 40,  growthTime: 4 },
  { id: 'cauliflower', name: 'Cauliflower',   season: 'winter', image: 'Cauliflower.png',   seedPrice: 40,  sellPrice: 75,  growthTime: 6 },
  { id: 'daikon',      name: 'Daikon Radish', season: 'winter', image: 'Daikon_radish.png', seedPrice: 70,  sellPrice: 180, growthTime: 9 },
  { id: 'snowpeas',    name: 'Snow Peas',     season: 'winter', image: 'Snow_peas.png',     seedPrice: 300, sellPrice: 125, growthTime: 5, regrowTime: 3 },
  { id: 'pomegranate', name: 'Pomegranate',   season: 'winter', image: 'Pomegranate.png',   seedPrice: 400, sellPrice: 45,  growthTime: 14, regrowTime: 3, yieldPerPlant: 3, tree: true },
];
