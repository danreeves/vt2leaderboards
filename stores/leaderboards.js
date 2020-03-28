var fetch = window.fetch || require("node-fetch");
var url =
  process.env.NODE_ENV === "production"
    ? "https://vt2leaderboards.onrender.com"
    : "http://localhost:8080";

module.exports = function store(state, emitter) {
  emitter.on("get_list", async function (season, type) {
    state[season] = state[season] || {};
    state[season][type] = { loading: true };
    emitter.emit(state.events.RENDER);
    var res = await fetch(`${url}/api/${season}/${type}`);
    var data = await res.json();
    state[season][type] = Object.assign({}, data, { loading: false });
    emitter.emit(state.events.RENDER);
  });
};
