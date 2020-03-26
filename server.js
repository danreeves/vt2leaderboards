var bankai = require("bankai/http");
var http = require("http");
var path = require("path");
var merry = require("merry");

var compiler = bankai(path.join(__dirname, "index.js"));
var app = merry();

app.route("GET", "/api", function (req, res, ctx) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ hello: "world" }));
  res.end();
});

app.route("default", function (req, res, ctx) {
  compiler(req, res, function () {
    res.statusCode = 404;
    res.end("not found");
  });
});

app.listen(parseInt(process.env.PORT) || 8080);

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
    "X-Authorization": "",
    "Content-Type": "application/json"
  }
});
*/
