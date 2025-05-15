const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  companiesList,
  divisionsByCompany,
  getAllUsers,
} = require("../controllers/common");
const { changeProfile } = require("../controllers/users");
const uploadImagePath = path.join(__dirname, "../public");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadImagePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    console.log(ext);
    const base = path
      .basename(file.originalname, ext)
      .trim()
      .replace(/\s+/g, "_");
    console.log(base);
    const uniqueName = `${base}-${Date.now()}${ext}`;
    console.log(uniqueName);
    cb(null, uniqueName);
  },
});

const uploadImage = multer({ storage });

router.get("/companies-list", async (req, res) => {
  await companiesList(req, res);
});

router.get("/study-list", async (req, res) => {
  await study(req, res);
});

router.post("/division-list", async (req, res) => {
  await divisionsByCompany(req, res);
});

router.get("/user-list", async (req, res) => {
  await getAllUsers(req, res);
});

router.post(
  "/user/:id/profile",
  uploadImage.single("file"),
  async (req, res) => {
    await changeProfile(req, res);
  }
);

module.exports = router;
