const title = "VT2 Leaderboards";

const types = ["quartet", "trio", "duo", "solo"];

const seasons = ["1", "2", "3"];

const defaultSeason = seasons[seasons.length - 1];
const defaultType = "quartet";

/* eslint-disable camelcase */
const careerNameLookup = {
  dr_ranger: "Ranger Veteran",
  dr_slayer: "Slayer",
  dr_ironbreaker: "Iron Breaker",
  we_waywatcher: "Waystalker",
  we_shade: "Shade",
  we_maidenguard: "Handmaiden",
  es_huntsman: "Huntsman",
  es_mercenary: "Mercenary",
  es_knight: "Foot Knight",
  es_questingknight: "Grail Knight",
  bw_adept: "Battle Wizard",
  bw_scholar: "Pyromancer",
  bw_unchained: "Unchained",
  wh_captain: "Witch Hunter Captain",
  wh_bountyhunter: "Bounty Hunter",
  wh_zealot: "Zealot",
};
/* eslint-enable camelcase */

function upperCaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1, string.length);
}

module.exports = {
  title,
  types,
  seasons,
  defaultSeason,
  defaultType,
  upperCaseFirst,
  careerNameLookup,
};
