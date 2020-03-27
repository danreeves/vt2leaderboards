require("regenerator-runtime/runtime");
var css = require("sheetify");
var choo = require("choo");

css("tachyons");
css("./font.css");

var app = choo();
if (process.env.NODE_ENV !== "production") {
  app.use(require("choo-devtools")());
} else {
  app.use(require("choo-service-worker")());
}

app.use(require("./stores/leaderboards"));

var main = require("./views/main");

app.route("/", main);
app.route("/trio", main);
app.route("/duo", main);
app.route("/solo", main);
app.route("/*", require("./views/404"));

module.exports = app.mount("body");
