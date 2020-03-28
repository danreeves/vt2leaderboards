var html = require("choo/html");
var css = require("sheetify");
var { upperCaseFirst } = require("../constants.js");

var active = css`
  :host {
    position: relative;
    font-style: italic;
  }

  :host:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-bottom: solid 6px #000;
    border-left: solid 6px transparent;
    border-right: solid 6px transparent;
  }
`;

module.exports = function Link(to, label, isActive, padding = 2) {
  return html`<a
    class="fw7 f3 link dim black dib pa${padding} ph4-l ${isActive && active}"
    href=${to}
  >
    ${label}
  </a>`;
};
