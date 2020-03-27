var html = require("choo/html");
var css = require("sheetify");
var LoadingIcon = require("../components/loading-icon.js");

css`
  html {
    height: 100%;
  }
  body {
    height: 100%;
  }
`;

var sectioncss = css`
  :host {
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

var visuallyHidden = css`
  :host {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
`;

var trackedOmega = css`
  :host {
    letter-spacing: 0.5em;
  }
`;

var active = css`
  :host {
    position: relative;
    font-style: italic;
  }

  :host:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-top: solid 6px #000;
    border-left: solid 6px transparent;
    border-right: solid 6px transparent;
  }
`;

var TITLE = "VT2 Leaderboards";

var leaderboards = [
  { label: "Quartet", route: "/", key: "quartet" },
  { label: "Trio", route: "/trio", key: "trio" },
  { label: "Duo", route: "/duo", key: "duo" },
  { label: "Solo", route: "/solo", key: "solo" },
];

function getLeaderboardByRoute(route) {
  return leaderboards.find((lb) => lb.route === route);
}

function link(to, label, isActive) {
  return html`<a
    class="fw7 f5-l link dim black dib pa3 ph4-l ${isActive && active}"
    href="${to}"
  >
    ${label}
  </a>`;
}

function loading() {
  return html`
    <div class="mv7 center">
      <div class="flex flex-row justify-center v-mid fw7 i">
        <div class="animate rotate dib flex flex-column justify-center mr1">
          ${LoadingIcon()}
        </div>
        Loading...
      </div>
    </div>
  `;
}

function teamMember(data) {
  return html`
    <div>
      <div>${data.username}</div>
      <div>${data.tier}</div>
      <div>${data.score}</div>
    </div>
  `;
}

function team(team, i) {
  return html`<li>
    <div>${i + 1}</div>
    ${team.map((item) => teamMember(item))}
  </li>`;
}

function list(teams) {
  return html`
    <ul class="list pl0 measure center">
      ${teams.map((item, i) => team(item, i))}
    </ul>
  `;
}

function footer(data) {
  if (data.lastUpdated) {
    return html`<footer class="f7 glow o-30 pv3 center">
      Last updated: ${data.lastUpdated}. Updates every hour.
      <a href="https://raindi.sh/" class="link black bold fw9"
        ><span class="red">♡</span> raindish.</a
      >
    </footer>`;
  }
  return null;
}

module.exports = function view(state, emit) {
  var route = state.route.startsWith("/") ? state.route : `/${state.route}`;
  var leaderboard = getLeaderboardByRoute(route);
  var leaderboard_state = state[leaderboard.key];
  var pageTitle = `${TITLE} - ${leaderboard.label}`;

  if (state.title !== pageTitle) emit(state.events.DOMTITLECHANGE, pageTitle);

  if (!leaderboard_state) {
    emit("get_list", leaderboard.key);
    leaderboard_state = { loading: true };
  }

  var nav = leaderboards.map((leaderboard) =>
    link(leaderboard.route, leaderboard.label, leaderboard.route === route)
  );

  return html`
    <body class="avenir helvetica lh-copy h-100">
      <main class="pa3 pb0 cf center flex flex-column h-100">
        <header class="bg-white black-80 tc">
          <h1 class="mv2 f6 fw9 ttu dark-red ${trackedOmega}">
            VT2 Leaderboards
          </h1>
          <h2 class=${visuallyHidden}>${leaderboard.label}</h2>
          <nav class="bb tc mw7 center">
            ${nav}
          </nav>
        </header>
        <section class="flex overflow-scroll overflow-x-hidden ${sectioncss}">
          ${leaderboard_state.loading
            ? loading()
            : list(leaderboard_state.data)}
        </section>
        ${footer(leaderboard_state)}
      </main>
    </body>
  `;
};
