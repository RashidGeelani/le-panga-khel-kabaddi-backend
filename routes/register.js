const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const validateRegistration = require("../middleware/validateRegistration");
const registerController = require("../controllers/registerController");



router.post(
  "/",
  upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "payment", maxCount: 1 },
  { name: "captainPhoto", maxCount: 1 },
]),
  validateRegistration,
  registerController.register
);

module.exports = router;