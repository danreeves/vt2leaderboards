const getAuth = require("./authentication.js");
const fetch = require("node-fetch");

const API_ENDPOINT = "https://5107.playfabapi.com/Client/GetStoreItems";

async function main() {
  const authorization = await getAuth();
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      StoreId: "Store",
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": authorization,
    },
  });
  const data = await response.json();
  console.log(data.data.Store.slice(1, 4));
}

main();
