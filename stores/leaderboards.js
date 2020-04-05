const url =
  process.env.NODE_ENV === "production"
    ? "https://leaderboards.verminti.de"
    : "http://localhost:8080";

module.exports = function (state, emitter) {
  emitter.on("get_list", async function (season, type) {
    state[season] = state[season] || {};
    state[season][type] = { loading: true };
    emitter.emit(state.events.RENDER);
    const response = await fetch(`${url}/api/${season}/${type}`);
    const data = await response.json();
    state[season][type] = Object.assign({}, data, { loading: false });
    emitter.emit(state.events.RENDER);
  });
};
