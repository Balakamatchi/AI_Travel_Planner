const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `ai-travel-planner/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, crop: "limit" }],
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

exports.uploadAvatar = multer({
  storage: makeStorage("avatars"),
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

exports.uploadTripCover = multer({
  storage: makeStorage("trip-covers"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadJournalPhotos = multer({
  storage: makeStorage("journal-photos"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
