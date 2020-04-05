const { defaultSeason, defaultType } = require("../constants.js");
const main = require("./main.js");

module.exports = function (state, emit) {
  emit(state.events.REPLACESTATE, [defaultSeason, defaultType].join("/"));
  return main(state, emit);
};
