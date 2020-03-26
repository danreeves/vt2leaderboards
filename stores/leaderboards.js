var fetch = window.fetch || require("node-fetch");
var url = "";

var data = {
  MaxResultsCount: 100,
  StatisticName: "s2_weave_score_1_players",
  StartPosition: 0,
  ProfileConstraints: { ShowLinkedAccounts: true }
};

/*
fetch("https://5107.playfabapi.com/Client/GetLeaderboard", {
  method: "POST",
  body: JSON.stringify({
    MaxResultsCount: 100,
    StatisticName: "s2_weave_score_1_players",
    StartPosition: 0,
    ProfileConstraints: { ShowLinkedAccounts: true }
  }),
  headers: {
    "X-Authorization": "756038C3ED6A36AC-76561198032229961-C99462E9697AB991-5107-8D7D11D6C4BA588-MZUkJrLIXupUKXPNNw5lSPxv7VJme+vvTk9mjI+OQhk=",
    "Content-Type": "application/json"
  }
});
*/
module.exports = function store(state, emitter) {
  emitter.on("get_list", async function(key) {
    state[key] = { loading: true };
    emitter.emit(state.events.RENDER);
    // await fetch("")
    // emitter.emit(state.events.RENDER)
  });
};
