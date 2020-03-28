var { defaultSeason, defaultType } = require("../constants.js");
var main = require("./main.js");
module.exports = function (state, emit) {
  emit(state.events.REPLACESTATE, [defaultSeason, defaultType].join("/"));
  return main(state, emit);
};
