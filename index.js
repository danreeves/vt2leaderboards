require("regenerator-runtime/runtime"); // eslint-disable-line import/no-unassigned-import
const css = require("sheetify");
const choo = require("choo");
const { seasons, types } = require("./constants.js");

css("tachyons");
css("./font.css");

// eslint-disable-next-line no-unused-expressions
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

const app = choo();
if (process.env.NODE_ENV === "production") {
  app.use(require("choo-service-worker")());
} else {
  app.use(require("choo-devtools")());
}

app.use(require("./stores/leaderboards"));

app.route("/", require("./views/redirect-to-default"));

// We need to generate routes because choojs/wayfarer
// doesn't support /:nested/:partials
const main = require("./views/main.js");
seasons.forEach((season) => {
  types.forEach((type) => {
    const route = `/${season}/${type}`;
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
