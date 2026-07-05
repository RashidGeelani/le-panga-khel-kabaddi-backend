require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const registerRoute = require("./routes/register");
const teamRoute = require("./routes/teams");
const teamRoutes = require("./routes/teamRoutes");

app.use("/api/teams", teamRoutes);
app.use("/api/register", registerRoute);
app.use("/api/teams", teamRoute);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LPKK Registration API Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
});