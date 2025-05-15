const router = require("express").Router();
const multer = require("multer");
const { clientAuth } = require("../middlewares/auth.middleware");
const { authorizeRole } = require("../middlewares/role.middleware");
const {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  updateUserProfile,
} = require("../controllers/users");
const {
  createCompany,
  getCompanies,
  updateCompany,
  updateCompanyStatus,
} = require("../controllers/companies");
const {
  createDivision,
  getDivisions,
  updateDivision,
  updateDivisionStatus,
} = require("../controllers/division");
const {
  createStudy,
  updateStudy,
  getStudies,
  getStudyList,
  updateStudyStatus,
  getUsersByStudyId,
  freezeUsersByStudy,
  uploadXlsxFileByStudy,
  processStudyData,
  getProcessedStudyData,
  processDataDelete,
  processDataUpdate,
  getLogsByStudyId,
  getStudyByDivision,
  getStudyById,
  getDashboardData
} = require("../controllers/study");
const path = require("path");
const uploadPath = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .trim()
      .replace(/\s+/g, "_");
    const uniqueName = `${base}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Example protected route
router.post("/users", clientAuth, authorizeRole("ADMIN"), async (req, res) => {
  await getUsers(req, res);
});
router.post(
  "/create-user",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await createUser(req, res);
  }
);
router.post(
  "/update-user/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateUser(req, res);
  }
);
router.post(
  "/profile/:id",
  clientAuth,
  authorizeRole("ADMIN", "CRM", "CMT"),
  async (req, res) => {
    await updateUserProfile(req, res);
  }
);
router.post(
  "/update-user-status/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateUserStatus(req, res);
  }
);

// companies
router.post(
  "/companies",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await getCompanies(req, res);
  }
);
router.post(
  "/create-company",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await createCompany(req, res);
  }
);
router.post(
  "/update-company/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateCompany(req, res);
  }
);
router.post(
  "/update-company-status/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateCompanyStatus(req, res);
  }
);

// Division
router.post(
  "/divisions",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await getDivisions(req, res);
  }
);
router.post(
  "/create-division",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await createDivision(req, res);
  }
);
router.post(
  "/update-division/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateDivision(req, res);
  }
);
router.post(
  "/update-division-status/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateDivisionStatus(req, res);
  }
);

// Study
router.get(
  "/study-list",
  clientAuth,
  authorizeRole("ADMIN", "CRM", "CMT"),
  async (req, res) => {
    await getStudyList(req, res);
  }
);
router.post(
  "/studies",
  clientAuth,
  authorizeRole("ADMIN", "CRM", "CMT"),
  async (req, res) => {
    await getStudies(req, res);
  }
);
router.post(
  "/create-study",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await createStudy(req, res);
  }
);
router.get(
  "/study/:id",
  clientAuth,
  authorizeRole("ADMIN", "CRM", "CMT"),
  async (req, res) => {
    await getStudyById(req, res);
  }
);
router.post(
  "/update-study/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateStudy(req, res);
  }
);
router.post(
  "/update-study-status/:id",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await updateStudyStatus(req, res);
  }
);
router.post(
  "/usersby-study",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await getUsersByStudyId(req, res);
  }
);
router.post(
  "/study/:id/users/freeze",
  clientAuth,
  authorizeRole("ADMIN"),
  async (req, res) => {
    await freezeUsersByStudy(req, res);
  }
);

router.post("/study/:id/upload", clientAuth, authorizeRole("ADMIN", "CRM", "CMT"), upload.single("file"), async (req, res) => {
  await uploadXlsxFileByStudy(req, res);
});

router.post('/study/:id/process-study-data', clientAuth, authorizeRole("ADMIN", "CRM", "CMT"), async (req, res) => {
  await processStudyData(req, res);
});

router.post('/study/:id/get-process-data', clientAuth, authorizeRole("ADMIN", "CRM", "CMT"), async (req, res) => {
  await getProcessedStudyData(req, res);
});

router.post('/processdata/delete/:id', clientAuth, authorizeRole("ADMIN", "CMT"), async (req, res) => {
  await processDataDelete(req, res);
});

router.post('/processdata/update/:id', clientAuth, authorizeRole("ADMIN","CMT"), async (req, res) => {
  await processDataUpdate(req, res);
});

router.post("/logs/:id", clientAuth, authorizeRole("ADMIN","CMT"), async (req, res) => {
  await getLogsByStudyId(req, res);
});

router.post("/study-by-division", clientAuth, authorizeRole("ADMIN","CMT", "CRM"), async (req, res) => {
  await getStudyByDivision(req, res);
});

router.post("/dashboard-analytics", clientAuth, authorizeRole("ADMIN","CMT", "CRM"), async (req, res) => {
  await getDashboardData(req, res);
});

module.exports = router;
