const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendRegistrationEmail({
  email,
  captainName,
  teamName,
  registrationId,
}) {
  const { data, error } = await resend.emails.send({
    from: "Le Panga Khel Kabaddi <register@lepangakhelkabaddi.in>",
    replyTo: "muzamilmushtaq5321@gmail.com",
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

      <p>Our committee will verify your payment shortly.</p>

      <br>
      <p>Check teams page, your team will be listed after payment verification,</p>
      <br>
      <p>if it is taking longer reply to this mail.</p>
      <br>


      <b>Le Panga Khel Kabaddi</b>
      <br>
      <b>President: Jalal Uddin Qadir</b>
    `,
  });
  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data?.id);
}




async function notifyOrganizer({
  registrationId,
  teamName,
  captainName,
  phone,
  district,
}) {
const { data, error } =  await resend.emails.send({
    from: "Le Panga Khel Kabaddi <register@lepangakhelkabaddi.in>",
    to: process.env.ADMIN_EMAIL,

    subject: `🚨 New Registration - ${teamName}`,

    html: `
      <h2>New Registration</h2>

      <p><b>Registration ID:</b> ${registrationId}</p>

      <p><b>Team:</b> ${teamName}</p>

      <p><b>Captain:</b> ${captainName}</p>

      <p><b>Phone:</b> ${phone}</p>

      <p><b>District:</b> ${district}</p>
    `,
  });
  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }
  console.log("Email sent:", data?.id);
}




module.exports = {
  sendRegistrationEmail,
  notifyOrganizer,
};