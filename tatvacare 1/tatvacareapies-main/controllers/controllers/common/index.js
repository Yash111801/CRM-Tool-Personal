const db = require("../../models");
const Company = db.companies;
const Division = db.divisions;
const Study = db.study;
const User = db.users;

const companiesList = async (req, res) => {
  try {
    const companies = await Company.find({
      isActive: true,
    }).select("_id companyName");
    return res.json({
      status: 200,
      data: companies,
      message: "Companies fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: 201,
      message:
        error.message || "Internal server error while fetching companies.",
    });
  }
};

const divisionsByCompany = async (req, res) => {
  const { companyId } = req.body;
  try {
    const devisions = await Division.find({
      company: companyId,
      isActive: true,
    }).select("_id divisionName");
    return res.json({
      status: 200,
      data: devisions,
      message: "Division fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: 201,
      message:
        error.message || "Internal server error while fetching divisions.",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const query = {
      role: { $in: ["CRM", "CMT"] },
      isActive: true
    };
    const users = await User.find(query).select("_id name role");
    return res.json({
      status: 200,
      data: users,
      message: "Users fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: 201,
      message:
        error.message || "Internal server error while fetching users.",
    });
  }
}

module.exports = {
  companiesList,
  divisionsByCompany,
  getAllUsers
};
