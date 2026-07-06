const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

async function sendRegistrationEmail({
  email,
  captainName,
  teamName,
  registrationId,
}) {
  await transporter.sendMail({
    from: `"LPKK Tournament" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🏆 LPKK Tournament Registration Received",
    html: `
      <h2>Registration Successful</h2>

      <p>Hello <strong>${captainName}</strong>,</p>

      <p>Your team has been registered successfully.</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><strong>Registration ID</strong></td>
          <td>${registrationId}</td>
        </tr>
        <tr>
          <td><strong>Team</strong></td>
          <td>${teamName}</td>
        </tr>
        <tr>
          <td><strong>Status</strong></td>
          <td>Pending Verification</td>
        </tr>
      </table>

      <br>

      <p>Our team will verify your payment and contact you soon.</p>

      <br>

      <b>LPKK Tournament Committee</b>
    `,
  });
}

async function notifyOrganizer({
  registrationId,
  teamName,
  captainName,
  phone,
  district,
}) {
  await transporter.sendMail({
    from: `"LPKK Tournament" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 New Registration - ${teamName}`,
    html: `
      <h2>New Team Registered</h2>

      <p><b>Registration ID:</b> ${registrationId}</p>
      <p><b>Team:</b> ${teamName}</p>
      <p><b>Captain:</b> ${captainName}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>District:</b> ${district}</p>
    `,
  });
}

module.exports = {
  sendRegistrationEmail,
  notifyOrganizer,
};