require("dotenv").config();
var bankai = require("bankai/http");
var http = require("http");
var path = require("path");
var merry = require("merry");
var fetch = require("node-fetch");
var TimedCache = require("timed-cache");
var getAuthorization = require("./authentication.js");

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
var CAREER_ID_LOOKUP = [
  "dr_ranger",
  "dr_slayer",
  "dr_ironbreaker",
  "we_waywatcher",
  "we_shade",
  "we_maidenguard",
  "es_huntsman",
  "es_mercenary",
  "es_knight",
  "bw_adept",
  "bw_scholar",
  "bw_unchained",
  "wh_captain",
  "wh_bountyhunter",
  "wh_zealot",
];

function convertWeaveScore(weave_score) {
  var value = weave_score + 2147483648.0;
  var career_index = Math.round((value / 100 - Math.floor(value / 100)) * 100);
  var careerName = CAREER_ID_LOOKUP[career_index - 1];
  value = Math.floor(value / 100);
  var score = Math.round(
    (value / 100000 - Math.floor(value / 100000)) * 100000
  );
  value = Math.floor(value / 100000);
  var tier = value;

  return { tier, score, careerName };
}

function chunkTeams(players, teamSize) {
  var teams = [];
  var currentTeam = [];
  var lastPlayer = null;
  for (var player of players) {
    if (!lastPlayer) {
      currentTeam.push(player);
    } else {
      if (player.score === lastPlayer.score) {
        currentTeam.push(player);
      } else {
        if (currentTeam.length !== 0) {
          teams.push(currentTeam);
        }
        currentTeam = [player];
      }
    }
    if (currentTeam.length === teamSize) {
      teams.push(currentTeam);
      currentTeam = [];
    }
    lastPlayer = player;
  }
  return teams;
}

async function fetchLeaderboard(type) {
  var numPlayers = TYPE_TO_NUM[type];
  var statisticName = `s2_weave_score_${numPlayers}_players`;
  var authorization = cache.get("authorization");
  if (!authorization) {
    authorization = await getAuthorization();
    // PlayFab sessions last 24 hours, this is 20 hours
    cache.put("authorization", authorization, { ttl: 20 * 3600 * 1000 });
  }
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
      "X-Authorization": authorization,
    },
  });
  if (response.ok) {
    var leaderboardData = await response.json();
    var players = leaderboardData.data.Leaderboard.map((position) => {
      const { tier, score, careerName } = convertWeaveScore(position.StatValue);
      return {
        position: position.Position,
        tier: tier,
        score: score,
        careerName: careerName,
        username: position.Profile.LinkedAccounts[0].Username, // @TODO: make this cross platform and reliable, see game code,
      };
    });
    var teams = chunkTeams(players, numPlayers);
    return { data: teams, lastUpdated: new Date().toISOString() };
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
