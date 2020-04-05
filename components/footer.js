const html = require("choo/html");

module.exports = function (data) {
  if (data.lastUpdated) {
    return html`<footer class="f7 glow o-30 pv3 center code">
      Last updated: ${data.lastUpdated}. Updates every hour.
      <a href="https://raindi.sh/" class="link black bold fw9 nowrap"
        ><span class="red">♡</span> raindish.</a
      >
    </footer>`;
  }

  return null;
};
