require("dotenv").config();
var SteamUser = require("steam-user");
var { PlayFabClient } = require("playfab-sdk");

var VT2_APP_ID = "552500"; // Steam
var VT2_TITLE_ID = "5107"; // PlayFab

PlayFabClient.settings.titleId = VT2_TITLE_ID;

module.exports = function getAuthorization() {
  return new Promise((resolve, reject) => {
    var steam = new SteamUser();

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
        if (!err) {
          console.log("[Steam] got sessionTicket");
          var request = {
            CreateAccount: true,
            TitleId: VT2_TITLE_ID,
            SteamTicket: steamTicket.toString("hex"),
            InfoRequestParameters: {
              GetReadOnlyData: true,
              GetTitleData: true,
              GetUserData: true,
            },
          };
          PlayFabClient.LoginWithSteam(request, (err, result) => {
            if (!err) {
              console.log("[PlayFab] got sessionTicket");
              resolve(result.data.SessionTicket);
              cancelSteamTicketAndLogout();
            } else {
              console.log("[PlayFab] error logging in with steam", err);
              cancelSteamTicketAndLogout();
            }
          });
        } else {
          console.log("[Steam] error getting sessionTicket");
          cancelSteamTicketAndLogout();
        }
      });
    });

    steam.on("disconnected", (e, msg) => {
      console.log("[Steam] logged off");
      reject();
    });
  });
};
