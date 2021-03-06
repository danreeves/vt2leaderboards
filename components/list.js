const html = require("choo/html");
const css = require("sheetify");
const { careerNameLookup } = require("../constants.js");

function teamMember(data, last) {
  return html`<div class="flex flex-row items-center ${!last && "mb1"}">
    <img
      src="/assets/careers/${data.careerName}.png"
      alt=${careerNameLookup[data.careerName]}
      title=${careerNameLookup[data.careerName]}
      height="50"
      class="fl mr1"
    /><span>${data.username}</span>
  </div>`;
}

const teambox = css`
  :host {
    width: 500px;
    max-width: 100%;
    margin-bottom: 1.5em;
    margin: 0.5em;
    padding: 0.5em;
  }
`;

const scoreRow = css`
  :host {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  :host > div {
    display: flex;
    flex-basis: 20%;
  }
  :host > .rank {
    flex-basis: 15%;
  }
  :host > .name {
    flex-basis: 65%;
  }
`;

const teamCol = css`
  :host {
    flex-direction: column;
  }
`;

const evenTeam = css`
  :host {
    background: #f9f9f9;
  }
`;

function team(teamMembers, i) {
  const firstMember = teamMembers[0];
  const { tier, score } = firstMember;
  return html`<li class="${teambox} ${i % 2 === 0 && evenTeam}">
    <div class=${scoreRow}>
      <div class="rank">${i + 1}</div>
      <div class="name ${teamCol}">
        ${teamMembers.map((item, i) =>
          teamMember(item, i === teamMembers.length - 1),
        )}
      </div>
      <div>${tier}</div>
      <div>${score}</div>
    </div>
  </li>`;
}

module.exports = function (teams) {
  if (teams.length === 0) {
    return html` <div class="center pa5">No leaderboard data</div> `;
  }

  const firstTeam = teams[0];
  const numberPlayers = firstTeam.length;
  return html`
    <ul class="list pl0 center flex flex-column mw-100">
      <div class="fw6 ${scoreRow} ${teambox}">
        <div class="rank">Rank</div>
        <div class="name">${numberPlayers === 1 ? "Player" : "Team"}</div>
        <div>Tier</div>
        <div>Score</div>
      </div>
      ${teams.map((item, i) => team(item, i))}
    </ul>
  `;
};
