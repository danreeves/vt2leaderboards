var title = "VT2 Leaderboards";

var types = ["quartet", "trio", "duo", "solo"];

var seasons = ["1", "2"];

var defaultSeason = seasons[seasons.length - 1];
var defaultType = "quartet";

var careerNameLookup = {
  dr_ranger: "Ranger Veteran",
  dr_slayer: "Slayer",
  dr_ironbreaker: "Iron Breaker",
  we_waywatcher: "Waystalker",
  we_shade: "Shade",
  we_maidenguard: "Handmaiden",
  es_huntsman: "Huntsman",
  es_mercenary: "Mercenary",
  es_knight: "Foot Knight",
  bw_adept: "Battle Wizard",
  bw_scholar: "Pyromancer",
  bw_unchained: "Unchained",
  wh_captain: "Witch Hunter Captain",
  wh_bountyhunter: "Bounty Hunter",
  wh_zealot: "Zealot",
};

function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);
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
