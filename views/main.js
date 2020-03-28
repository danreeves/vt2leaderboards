var html = require("choo/html");
var css = require("sheetify");

var { title, seasons, types, upperCaseFirst } = require("../constants.js");

var Loading = require("../components/loading.js");
var Link = require("../components/link.js");
var Footer = require("../components/footer.js");
var List = require("../components/list.js");

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

var headerstyle = css`
  :host {
    background-image: url(/assets/weave.png);
    background-repeat: no-repeat;
    background-position: center right;
    background-size: contain;
    margin-left: auto;
    margin-right: auto;
    width: 600px;
    max-width: 100%;
  }
`;

module.exports = function view(state, emit) {
  var [season, type] = state.route.split("/");
  var leaderboard_state = state[season] && state[season][type];
  var pageTitle = `${title} - ${upperCaseFirst(type)}`;

  if (state.title !== pageTitle) emit(state.events.DOMTITLECHANGE, pageTitle);

  if (!leaderboard_state) {
    emit("get_list", season, type);
    leaderboard_state = { loading: true };
  }

  var seasonNav = seasons.map((s) =>
    Link(`/${s}/${type}`, `Season ${s}`, s === season, 1)
  );
  var typeNav = types.map((t) => Link(t, upperCaseFirst(t), t === type));

  return html`
    <body class="lh-copy h-100">
      <main class="ph3 cf center flex flex-column h-100">
        <header class="bg-white black-80 tc ${headerstyle}">
          <h1 class="mt1 mb0" style="height: 100px">
            <span class="${visuallyHidden}">Vermintide 2 Leaderboards</span>
            <a href="/">
              <img
                src="/assets/logo.png"
                title="Vermintide 2 Leaderboards"
                height="100"
              />
            </a>
          </h1>
          <h2 class=${visuallyHidden}>${upperCaseFirst(type)}</h2>
          <nav class="bb tc mw7 center">
            ${seasonNav}
          </nav>
          <nav class="bb tc mw7 center">
            ${typeNav}
          </nav>
        </header>
        <section class="flex overflow-scroll overflow-x-hidden ${sectioncss}">
          ${leaderboard_state.loading
            ? Loading()
            : List(leaderboard_state.data)}
        </section>
        ${Footer(leaderboard_state)}
      </main>
    </body>
  `;
};
