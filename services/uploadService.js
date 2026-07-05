const cloudinary = require("./cloudinary");
const fs = require("fs");

async function uploadImage(file, folder) {
  if (!file) return null;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
      unique_filename: true,
    });

    // Delete local file after successful upload
    fs.unlinkSync(file.path);

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (err) {
    // Delete temp file even if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    throw err;
  }
}

module.exports = {
  uploadImage,
};