require("regenerator-runtime/runtime");
var css = require("sheetify");
var choo = require("choo");
var { seasons, types } = require("./constants.js");

css("tachyons");
css("./font.css");

css`
  html {
    height: 100%;
    font-family: "IM Fell English", serif;
  }
  body {
    height: 100%;
    font-family: "IM Fell English", serif;
  }
`;

var app = choo();
if (process.env.NODE_ENV !== "production") {
  app.use(require("choo-devtools")());
} else {
  app.use(require("choo-service-worker")());
}

app.use(require("./stores/leaderboards"));

app.route("/", require("./views/redirectToDefault"));

// We need to generate routes because choojs/wayfarer
// doesn't support /:nested/:partials
var main = require("./views/main.js");
seasons.forEach((season) => {
  types.forEach((type) => {
    var route = `/${season}/${type}`;
    app.route(route, main);
  });
});

app.route("/*", require("./views/404"));

// Redirect to cool url
if (document.location.hostname === "vt2leaderboards.onrender.com") {
  document.location =
    "https://leaderboards.verminti.de" + document.location.pathname;
}

window.app = app;

module.exports = app.mount("body");
