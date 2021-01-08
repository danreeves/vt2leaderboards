const path = require("path");
const { existsSync, mkdirSync } = require("fs");
const { open } = require("fs").promises;

module.exports = async function ({ season, type }, data) {
  const archiveLocation = process.env.RENDER
    ? "/var/data"
    : path.join(__dirname, "/var-data");

  if (!existsSync(archiveLocation)) {
    mkdirSync(archiveLocation);
  }

  const fileName = `season_${season}_${type}_${data.lastUpdated}.json`;
  const filePath = path.join(archiveLocation, fileName);
  try {
    const file = await open(filePath, "wx");
    await file.write(JSON.stringify(data, 2));
    await file.close();
    console.log("[Archive] Written file:", filePath);
  } catch (error) {
    console.log("Failed to create file", fileName);
    console.log(error);
  }
};
