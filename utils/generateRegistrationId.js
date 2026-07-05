const { v4: uuid } = require("uuid");

function generateRegistrationId() {
  const year = new Date().getFullYear();
  return `LPKK-${year}-${uuid().substring(0, 8).toUpperCase()}`;
}

module.exports = generateRegistrationId;