const { sheets, spreadsheetId } = require("./google");

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Registration"; // Change if your tab name differs

async function appendRegistration(data) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [data],
    },
  });
}

async function getAllRegistrations() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:M`,
  });

  return response.data.values || [];
}

async function appendPlayers(rows) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Players!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows,
    },
  });
}
async function getAllPlayers() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Players!A:D",
  });

  return response.data.values || [];
}

module.exports = {
  appendRegistration,
  appendPlayers,
  getAllRegistrations,
  getAllPlayers,
};