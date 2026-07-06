const generateRegistrationId = require("../utils/generateRegistrationId");
const { uploadImage } = require("../services/uploadService");
const {
  appendRegistration,
  appendPlayers,
  getAllRegistrations,
} = require("../services/sheetsService");

const {
  sendRegistrationEmail,
  notifyOrganizer,
} = require("../services/emailService");


const MAX_TEAMS = 32;

exports.register = async (req, res) => {


  try {
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
    const playerList = typeof players === "string" ? JSON.parse(players) : players;
    // ===============================
    // Duplicate & Capacity Check
    // ===============================

    const registrations = await getAllRegistrations();

    // Remove header row
    const rows = registrations.slice(1);

    if (rows.length >= MAX_TEAMS) {
      return res.status(400).json({
        success: false,
        message: "Registration is closed. Maximum teams reached.",
      });
    }

    const duplicate = rows.find((row) => {
      const existingTeam = (row[2] || "").trim().toLowerCase();
      const existingPhone = (row[6] || "").trim();
      const existingEmail = (row[7] || "").trim().toLowerCase();

      return (
        existingTeam === teamName.trim().toLowerCase() ||
        existingPhone === phone.trim() ||
        existingEmail === email.trim().toLowerCase()
      );
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "A registration already exists with this Team Name, Phone Number or Email.",
      });
    }

    // ===============================
    // Registration ID
    // ===============================

    const registrationId = generateRegistrationId();

    // ===============================
    // Upload Images
    // ===============================

    let logoUrl = "";
    let paymentUrl = "";

    if (req.files?.logo?.length) {
      const uploadedLogo = await uploadImage(
        req.files.logo[0],
        "lpkk/logos"
      );

      logoUrl = uploadedLogo.url;
    }

    if (req.files?.payment?.length) {
      const uploadedPayment = await uploadImage(
        req.files.payment[0],
        "lpkk/payments"
      );

      paymentUrl = uploadedPayment.url;
    }

    let captainPhotoUrl = "";

if (req.files?.captainPhoto?.length) {
  const uploadedCaptain = await uploadImage(
    req.files.captainPhoto[0],
    "lpkk/captains"
  );

  captainPhotoUrl = uploadedCaptain.url;
}




    // ===============================
    // Save Registration
    // ===============================

    await appendRegistration([
  registrationId,
  new Date().toLocaleString(),

  teamName,
  captainName,
  captainPhotoUrl,

  managerName,

  phone,

  email,

  district,

  altPhone,

  playerList.join(", "),

  logoUrl,

  paymentUrl,

  "Pending",
]);

    const playerRows = playerList.map((name, index) => [
  registrationId,
  index + 1,
  name,
]);

await appendPlayers(playerRows);

    

  await sendRegistrationEmail({
  email,
  captainName,
  teamName,
  registrationId,
});
console.log("📧 Sending confirmation email...");
await notifyOrganizer({
  registrationId,
  teamName,
  captainName,
  phone,
  district,
});
console.log("📧 Sending confirmation email  organisor ...");




    return res.status(201).json({
      success: true,
      registrationId,
      message: "Registration submitted successfully.",
    });

  } catch (err) {
    console.error("Registration Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }


};