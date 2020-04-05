const html = require("choo/html");
const css = require("sheetify");

const { title, seasons, types, upperCaseFirst } = require("../constants.js");

const loading = require("../components/loading.js");
const link = require("../components/link.js");
const footer = require("../components/footer.js");
const list = require("../components/list.js");

const sectioncss = css`
  :host {
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

const visuallyHidden = css`
  :host {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
`;

const headerstyle = css`
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

module.exports = function (state, emit) {
  const [season, type] = state.route.split("/");
  let leaderboardState = state[season] && state[season][type];
  const pageTitle = `${title} - ${upperCaseFirst(type)}`;

  if (state.title !== pageTitle) emit(state.events.DOMTITLECHANGE, pageTitle);

  if (!leaderboardState) {
    emit("get_list", season, type);
    leaderboardState = { loading: true };
  }

  const seasonNav = seasons.map((s) =>
    link(`/${s}/${type}`, `Season ${s}`, s === season, 1),
  );
  const typeNav = types.map((t) => link(t, upperCaseFirst(t), t === type));

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
          ${leaderboardState.loading ? loading() : list(leaderboardState.data)}
        </section>
        ${footer(leaderboardState)}
      </main>
    </body>
  `;
};
