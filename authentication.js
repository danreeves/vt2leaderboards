require("dotenv").config();
const SteamUser = require("steam-user");
const { PlayFabClient } = require("playfab-sdk");

const VT2_APP_ID = "552500"; // Steam
const VT2_TITLE_ID = "5107"; // PlayFab

PlayFabClient.settings.titleId = VT2_TITLE_ID;

module.exports = function () {
  return new Promise((resolve, reject) => {
    const steam = new SteamUser();

    steam.logOn({
      accountName: process.env.STEAM_USERNAME,
      password: process.env.STEAM_PASSWORD,
    });

    function cancelSteamTicketAndLogout() {
      steam.cancelAuthTicket(VT2_APP_ID, () => {
        console.log("[Steam] cancelled sessionTicket");
        steam.logOff();
      });
    }

    steam.on("loggedOn", () => {
      console.log("[Steam] logged in");
      steam.getAuthSessionTicket(VT2_APP_ID, (err, steamTicket) => {
        if (err) {
          console.log("[Steam] error getting sessionTicket");
          cancelSteamTicketAndLogout();
        } else {
          console.log("[Steam] got sessionTicket");
          const request = {
            CreateAccount: true,
            TitleId: VT2_TITLE_ID,
            SteamTicket: steamTicket.toString("hex"),
            InfoRequestParameters: {
              GetReadOnlyData: true,
              GetTitleData: true,
              GetUserData: true,
            },
          };

          // eslint-disable-next-line new-cap
          PlayFabClient.LoginWithSteam(request, (err, result) => {
            if (err) {
              console.log("[PlayFab] error logging in with steam", err);
              cancelSteamTicketAndLogout();
            } else {
              console.log("[PlayFab] got sessionTicket");
              resolve(result.data.SessionTicket);
              cancelSteamTicketAndLogout();
            }
          });
        }
      });
    });

    steam.on("disconnected", () => {
      console.log("[Steam] logged off");
      reject();
    });
  });
};
