var html = require("choo/html");
var LoadingIcon = require("./loading-icon.js");

module.exports = function Loading() {
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
};
