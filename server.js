require("dotenv").config();
var bankai = require("bankai/http");
var http = require("http");
var path = require("path");
var merry = require("merry");
var TimedCache = require("timed-cache");
var { types } = require("./constants.js");
var fetchLeaderboard = require("./leaderboards.js");

// 1 hour cache
var cache = new TimedCache({ defaultTtl: 3600 * 1000 });

var PROD = process.env.NODE_ENV === "production";

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

app.route("GET", "/api/:season/:type", async function (req, res, ctx) {
  var {
    params: { season, type },
  } = ctx;
  if (!types.includes(type)) {
    ctx.send(404, {
      error: true,
      message: "Invalid type",
    });
  }
  var data = cache.get({ season, type });
  if (!data) {
    data = await fetchLeaderboard(season, type);
    if (data.error) {
      ctx.log.error(`${data.status} - ${data.statusText}`);
      ctx.send(500, {
        error: true,
        message: "Couldn't fetch data",
      });
      return;
    }
    cache.put({ season, type }, data);
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
