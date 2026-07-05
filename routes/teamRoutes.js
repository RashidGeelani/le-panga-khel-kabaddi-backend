const express = require("express");
const router = express.Router();

const {
  getTeams,
  getTeamById,
} = require("../controllers/teamController");

router.get("/", getTeams);
router.get("/:registrationId", getTeamById);

module.exports = router;