const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folders
const logoDir = path.join(__dirname, "../uploads/logos");
const paymentDir = path.join(__dirname, "../uploads/payments");
const playerDir = path.join(__dirname, "../uploads/players");

fs.mkdirSync(logoDir, { recursive: true });
fs.mkdirSync(paymentDir, { recursive: true });
fs.mkdirSync(playerDir, { recursive: true });

// Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "logo") {
      return cb(null, logoDir);
    }

    if (file.fieldname === "payment") {
      return cb(null, paymentDir);
    }

   if (file.fieldname === "captainPhoto") {
  return cb(null, playerDir);
}

    return cb(new Error(`Invalid file field: ${file.fieldname}`));
  },

  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});