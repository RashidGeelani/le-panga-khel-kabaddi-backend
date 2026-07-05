const { getAllRegistrations,
        getAllPlayers,
    } = require("../services/sheetsService");

exports.getTeams = async (req, res) => {
  try {
    const rows = await getAllRegistrations();
    console.log("ALL REGISTRATIONS");
console.log(rows);
    // remove header
    rows.shift();

    const teams = rows
      .filter((row) => row[12] === "Approved")
      .map((row, index) => ({
        id: index + 1,

        registrationId: row[0],

        teamName: row[2],

        captainName: row[3],

        managerName: row[4],

        phone: row[5],

        email: row[7],

        district: row[8],

        players: row[9]
          ? row[9].split(",").map((p) => p.trim())
          : [],

        logo: row[10],

        payment: row[11],

        status: row[12],
      }));
      
    res.json({
      success: true,
      total: teams.length,
      teams,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registrations = await getAllRegistrations();
    registrations.shift();

    const row = registrations.find(
      (r) => r[0] === registrationId && r[12] === "Approved"
    );

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    const playersSheet = await getAllPlayers();
    playersSheet.shift();

    const players = playersSheet
      .filter((p) => p[0] === registrationId)
      .map((p) => ({
        number: Number(p[1]),
        name: p[2],
        photo: p[3],
      }));

    return res.json({
      success: true,
      team: {
        registrationId: row[0],
        teamName: row[2],
        captainName: row[3],
        managerName: row[4],
        phone: row[5],
        email: row[7],
        district: row[8],
        logo: row[10],
        status: row[12],
        players,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};