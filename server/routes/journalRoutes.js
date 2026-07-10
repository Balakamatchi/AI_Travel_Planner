const express = require("express");
const { body } = require("express-validator");
const {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { uploadJournalPhotos } = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getJournals)
  .post(
    uploadJournalPhotos.array("photos", 6),
    [
      body("trip").notEmpty().withMessage("Trip id is required"),
      body("title").notEmpty().withMessage("Title is required"),
      body("content").notEmpty().withMessage("Content is required"),
    ],
    validate,
    createJournal
  );

router
  .route("/:id")
  .get(getJournalById)
  .put(uploadJournalPhotos.array("photos", 6), updateJournal)
  .delete(deleteJournal);

module.exports = router;
