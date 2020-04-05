const html = require("choo/html");
const loadingIcon = require("./loading-icon.js");

module.exports = function () {
  return html`
    <div class="mv7 center">
      <div class="flex flex-row justify-center v-mid fw7 i">
        <div class="animate rotate dib flex flex-column justify-center mr1">
          ${loadingIcon()}
        </div>
        Loading...
      </div>
    </div>
  `;
};
