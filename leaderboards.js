const fetch = require("node-fetch");
const TimedCache = require("timed-cache");
const getAuthorization = require("./authentication.js");

// 20 hour cache
const cache = new TimedCache({ defaultTtl: 20 * 3600 * 1000 });

const TYPE_TO_NUM = {
  solo: 1,
  duo: 2,
  trio: 3,
  quartet: 4,
};
const API_ENDPOINT = "https://5107.playfabapi.com/Client/GetLeaderboard";
const CAREER_ID_LOOKUP = [
  "dr_ranger",
  "dr_slayer",
  "dr_ironbreaker",
  "we_waywatcher",
  "we_shade",
  "we_maidenguard",
  "es_huntsman",
  "es_mercenary",
  "es_knight",
  "bw_adept",
  "bw_scholar",
  "bw_unchained",
  "wh_captain",
  "wh_bountyhunter",
  "wh_zealot",
  "es_questingknight",
];

function convertWeaveScore(weaveScore) {
  let value = weaveScore + 2147483648;
  const careerIndex = Math.round((value / 100 - Math.floor(value / 100)) * 100);
  const careerName = CAREER_ID_LOOKUP[careerIndex - 1];
  value = Math.floor(value / 100);
  const score = Math.round(
    (value / 100000 - Math.floor(value / 100000)) * 100000,
  );
  value = Math.floor(value / 100000);
  const tier = value;

  return { tier, score, careerName };
}

function chunkTeams(players, teamSize) {
  const teams = [];
  let currentTeam = [];
  let lastPlayer = null;
  for (const player of players) {
    if (!lastPlayer) {
      currentTeam.push(player);
    } else if (player.score === lastPlayer.score) {
      currentTeam.push(player);
    } else {
      if (currentTeam.length !== 0) {
        teams.push(currentTeam);
      }

      currentTeam = [player];
    }

    if (currentTeam.length === teamSize) {
      teams.push(currentTeam);
      currentTeam = [];
    }

    lastPlayer = player;
  }

  return teams;
}

function getStatisticName(season, numberPlayers) {
  const seasonName = season === "1" ? "season_1" : `s${season}`;
  return `${seasonName}_weave_score_${numberPlayers}_players`;
}

async function getPage({ pageNumber, statisticName, authorization }) {
  const startPosition = pageNumber * 100;
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      MaxResultsCount: 100,
      StatisticName: statisticName,
      StartPosition: startPosition,
      ProfileConstraints: { ShowLinkedAccounts: true },
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": authorization,
    },
  });

  if (response.ok) {
    const leaderboardData = await response.json();
    const players = leaderboardData.data.Leaderboard.map((position) => {
      const { tier, score, careerName } = convertWeaveScore(position.StatValue);
      return {
        position: position.Position,
        tier,
        score,
        careerName,
        username: position.Profile.LinkedAccounts[0].Username, // @TODO: make this cross platform and reliable, see game code,
      };
    });
    return players;
  }

  throw response;
}

module.exports = async function (season, type) {
  const numberPlayers = TYPE_TO_NUM[type];
  const statisticName = getStatisticName(season, numberPlayers);
  let authorization = cache.get("authorization");
  if (!authorization) {
    authorization = await getAuthorization();
    // PlayFab sessions last 24 hours, this is 20 hours
    cache.put("authorization", authorization);
  }

  try {
    const pages = Array.from({ length: numberPlayers }).map((_, pageNumber) => {
      return getPage({
        pageNumber,
        statisticName,
        authorization,
      });
    }, []);

    await Promise.all(pages);

    let players = [];
    for (const page of pages) {
      const pageData = await page; // eslint-disable-line no-await-in-loop
      players = players.concat(pageData);
    }

    const teams = chunkTeams(players, numberPlayers).slice(0, 100);

    return { data: teams, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      status: error.status,
      statusText: error.statusText,
    };
  }
};
