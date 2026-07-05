const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const validateRegistration = require("../middleware/validateRegistration");
const registerController = require("../controllers/registerController");

// Generate upload fields for 12 player photos
const playerFields = Array.from({ length: 12 }, (_, i) => ({
  name: `playerPhoto${i + 1}`,
  maxCount: 1,
}));

router.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "payment", maxCount: 1 },
    ...playerFields,
  ]),
  validateRegistration,
  registerController.register
);

module.exports = router;