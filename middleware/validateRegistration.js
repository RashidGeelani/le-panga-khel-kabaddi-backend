function validateRegistration(req, res, next) {
  const {
    teamName,
    captainName,
    managerName,
    phone,
    altPhone,
    email,
    district,
    players,
  } = req.body;

  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!teamName?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Team name is required.",
    });
  }

  if (!captainName?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Captain name is required.",
    });
  }

  if (!phoneRegex.test(phone || "")) {
    return res.status(400).json({
      success: false,
      message: "Invalid phone number.",
    });
  }

  if (altPhone && !phoneRegex.test(altPhone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid alternate phone number.",
    });
  }

  if (altPhone && phone === altPhone) {
    return res.status(400).json({
      success: false,
      message: "Phone and alternate phone cannot be the same.",
    });
  }

  if (!emailRegex.test(email || "")) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  if (!district?.trim()) {
    return res.status(400).json({
      success: false,
      message: "District is required.",
    });
  }

  let playerList = [];

  try {
    playerList =
      typeof players === "string"
        ? JSON.parse(players)
        : players;
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid player list.",
    });
  }

  if (!Array.isArray(playerList)) {
    return res.status(400).json({
      success: false,
      message: "Players must be an array.",
    });
  }

  if (playerList.length < 7 || playerList.length > 12) {
    return res.status(400).json({
      success: false,
      message: "Team must have between 7 and 12 players.",
    });
  }

  const cleanedPlayers = playerList
    .map((p) => p.trim())
    .filter(Boolean);

  const uniquePlayers = new Set(
    cleanedPlayers.map((p) => p.toLowerCase())
  );

  if (uniquePlayers.size !== cleanedPlayers.length) {
    return res.status(400).json({
      success: false,
      message: "Duplicate player names are not allowed.",
    });
  }

  req.body.players = cleanedPlayers;

  next();
}

module.exports = validateRegistration;