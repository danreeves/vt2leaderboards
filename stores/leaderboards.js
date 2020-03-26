var fetch = window.fetch || require("node-fetch");
var url =
  process.env.NODE_ENV === "production"
    ? "https://vt2leaderboards.onrender.com"
    : "http://localhost:8080";

module.exports = function store(state, emitter) {
  emitter.on("get_list", async function (key) {
    state[key] = { loading: true };
    emitter.emit(state.events.RENDER);
    var res = await fetch(`${url}/api/${key}`);
    var data = await res.json();
    state[key] = Object.assign({}, data, { loading: false });
    emitter.emit(state.events.RENDER);
  });
};
