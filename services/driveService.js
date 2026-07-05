const fs = require("fs");
const path = require("path");
const { drive } = require("./google");

const LOGO_FOLDER = process.env.GOOGLE_DRIVE_LOGO_FOLDER;
const PAYMENT_FOLDER = process.env.GOOGLE_DRIVE_PAYMENT_FOLDER;

async function uploadFile(file, type) {
  if (!file) return null;

  const folderId =
    type === "logo"
      ? LOGO_FOLDER
      : PAYMENT_FOLDER;

  const fileMetadata = {
    name: `${Date.now()}-${file.originalname}`,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const uploaded = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id,name,webViewLink,webContentLink",
  });

  // Make file public
  await drive.permissions.create({
    fileId: uploaded.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  const result = await drive.files.get({
    fileId: uploaded.data.id,
    fields: "id,name,webViewLink,webContentLink",
  });

  // Delete local temp file
  fs.unlinkSync(file.path);

  return {
    id: result.data.id,
    name: result.data.name,
    viewUrl: result.data.webViewLink,
    downloadUrl: result.data.webContentLink,
  };
}

module.exports = {
  uploadFile,
};