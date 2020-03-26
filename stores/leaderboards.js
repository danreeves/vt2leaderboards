var fetch = window.fetch || require("node-fetch");
var url =
  process.env.NODE_ENV === "production"
    ? "https://vt2leaderboards.onrender.com"
    : "http://localhost:8080";

var data = {
  MaxResultsCount: 100,
  StatisticName: "s2_weave_score_1_players",
  StartPosition: 0,
  ProfileConstraints: { ShowLinkedAccounts: true },
};


module.exports = function store(state, emitter) {
  emitter.on("get_list", async function (key) {
    state[key] = { loading: true };
    emitter.emit(state.events.RENDER);
    var res = await fetch(`${url}/api`);
    var data = await res.json();
    console.log(data);
    // emitter.emit(state.events.RENDER)
  });
};
