require("dotenv").config();
var bankai = require("bankai/http");
var http = require("http");
var path = require("path");
var merry = require("merry");
var fetch = require("node-fetch");
var TimedCache = require("timed-cache");

// 1 hour cache
var cache = new TimedCache({ defaultTtl: 3600 * 1000 });

var PROD = process.env.NODE_ENV === "production";
var TYPES = ["solo", "duo", "trio", "quartet"];
var TYPE_TO_NUM = {
  solo: 1,
  duo: 2,
  trio: 3,
  quartet: 4,
};
var API_ENDPOINT = "https://5107.playfabapi.com/Client/GetLeaderboard";

async function fetchLeaderboard(type) {
  var numPlayers = TYPE_TO_NUM[type];
  var statisticName = `s2_weave_score_${numPlayers}_players`;
  var response = await fetch(API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      MaxResultsCount: 100,
      StatisticName: statisticName,
      StartPosition: 0,
      ProfileConstraints: { ShowLinkedAccounts: true },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": process.env.authorization,
    },
  });
  if (response.ok) {
    var leaderboardData = await response.json();
    var data = leaderboardData.data.Leaderboard.map((position) => {
      return {
        position: position.Position,
        score: position.StatValue, // @TODO: conver this to display, see game code,
        username: position.Profile.LinkedAccounts[0].Username, // @TODO: make this cross platform and reliable, see game code,
      };
    });
    return { data, lastUpdated: Date() };
  }
  return {
    error: true,
    status: response.status,
    statusText: response.statusText,
  };
}

var compiler = bankai(path.join(__dirname, "index.js"), {
  quiet: PROD,
  watch: !PROD,
});

compiler.compiler.on("error", function (nodeName, edgeName, error) {
  console.log("[BANKAI ERROR]", nodeName, edgeName);
  console.error(error);
});

var app = merry();

app.route("GET", "/health-check", function (req, res, ctx) {
  res.writeHead(200).end();
});

app.route("GET", "/api/:type", async function (req, res, ctx) {
  var {
    params: { type },
  } = ctx;
  if (!TYPES.includes(type)) {
    ctx.send(404, {
      error: true,
      message: "Invalid type",
    });
  }
  var data = cache.get(type);
  if (!data) {
    data = await fetchLeaderboard(type);
    if (data.error) {
      ctx.log.error(`${data.status} - ${data.statusText}`);
      ctx.send(500, {
        error: true,
        message: "Couldn't fetch data",
      });
      return;
    }
    cache.put(type, data);
  }
  ctx.send(200, data);
});

app.route("default", function (req, res, ctx) {
  compiler(req, res, function () {
    res.statusCode = 404;
    res.end("not found");
  });
});

app.listen(parseInt(process.env.PORT) || 8080);
