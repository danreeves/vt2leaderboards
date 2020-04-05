require("dotenv").config();
const bankai = require("bankai/http");
const path = require("path");
const merry = require("merry");
const TimedCache = require("timed-cache");
const { types } = require("./constants.js");
const fetchLeaderboard = require("./leaderboards.js");

// 1 hour cache
const cache = new TimedCache({ defaultTtl: 3600 * 1000 });

const PROD = process.env.NODE_ENV === "production";

const compiler = bankai(path.join(__dirname, "index.js"), {
  quiet: PROD,
  watch: !PROD,
});

compiler.compiler.on("error", function (nodeName, edgeName, error) {
  console.log("[BANKAI ERROR]", nodeName, edgeName);
  console.error(error);
});

const app = merry();

app.route("GET", "/health-check", function (_, response) {
  response.writeHead(200).end();
});

app.route("GET", "/api/:season/:type", async function (
  _request,
  _response,
  context,
) {
  const {
    params: { season, type },
  } = context;
  if (!types.includes(type)) {
    context.send(404, {
      error: true,
      message: "Invalid type",
    });
  }

  let data = cache.get({ season, type });
  if (!data) {
    data = await fetchLeaderboard(season, type);
    if (data.error) {
      context.log.error(`${data.status} - ${data.statusText}`);
      context.send(500, {
        error: true,
        message: "Couldn’t fetch data",
      });
      return;
    }

    cache.put({ season, type }, data);
  }

  context.send(200, data);
});

app.route("default", function (request, response) {
  compiler(request, response, function () {
    response.statusCode = 404;
    response.end("not found");
  });
});

app.listen(parseInt(process.env.PORT, 10) || 8080);
