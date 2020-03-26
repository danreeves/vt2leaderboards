var html = require("choo/html");

var TITLE = "VT2 Leaderboards";

var leaderboards = [
  { label: "Quartet", route: "/", key: "quartet" },
  { label: "Trio", route: "/trio", key: "trio" },
  { label: "Duo", route: "/duo", key: "duo" },
  { label: "Solo", route: "/solo", key: "solo" }
];

function getLeaderboardByRoute(route) {
  return leaderboards.find(lb => lb.route === route);
}

function link(to, label, active) {
  return html`<a
    class="fw7 f5-l link dim black dib pa3 ph4-l ${active && "i"}"
    href="${to}">
      ${label}
    </a>`;
}

module.exports = function view(state, emit) {
  if (state.title !== TITLE)
    emit(state.events.DOMTITLECHANGE, TITLE);

  var route = state.route.startsWith("/") ? state.route : `/${state.route}`;
  var leaderboard = getLeaderboardByRoute(route);

  var leaderboard_state = state[leaderboard.key];
  if (!leaderboard_state) {
    emit("get_list", leaderboard.key);
    leaderboard_state = { loading: true };
  }

  var nav = leaderboards.map(
    leaderboard =>
      link(leaderboard.route, leaderboard.label, leaderboard.route === route)
  );

  return html`
    <body class="avenir lh-copy">
      <main class="pa3 cf center">
        <header class="bg-white black-80 tc">
          <h1 class="mt2 mb0 f6 fw4 ttu tracked">VT2 Leaderboards</h1>
          <h2 class="mt0 mb0 i fw1 f1">${leaderboard.label}</h2>
          <nav class="bt bb tc mw7 center">
            ${nav}
          </nav>
        </header>
        <section>
            <ul class="list pl0 measure center">
              <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">Orange</li>
              <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">Apple</li>
              <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">Peach</li>
              <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">Grape</li>
              <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">Grapefruit</li>
              <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">Kiwi</li>
            </ul>
        </section>
      </main>
    </body>
  `;
};
