const { ObjectId } = require("mongoose").Types;
const db = require("../../models");
const Company = db.companies;

const getCompanies = (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sortField, sortOrder } = req.body;
    const query = {};
    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { companyName: { $regex: searchRegex } }
      ];
    }
    // sort
    let sort = {};
    if (sortField && sortOrder) {
      sort[sortField] = sortOrder;
    } else {
      sort['createdAt'] = -1;
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
    };
    Company.paginate(query, options, (error, result) => {
      if (error) {
        return res.json({
          status: 201,
          message: error.message,
        });
      } else {
        return res.json({
          status: 200,
          data: result,
          message:
            result.docs.length > 0
              ? "Companies fetched successfully."
              : "No companies found",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while fetching companies.",
    });
  }
};

// create new user CRM, CMT
const createCompany = async (req, res) => {
  const { companyName } = req.body;
  try {
    const newCompany = new Company({
      companyName,
    });
    const company = await newCompany.save();
    if (
      company._id !== null &&
      company._id !== undefined &&
      company._id !== ""
    ) {
      res.json({
        status: 200,
        message: "Company added successfully.",
      });
    } else {
      res.json({
        status: 201,
        message: "Some error occurred while adding company.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while adding company.",
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const updateCompany = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });
    if (!updateCompany) {
      return res.json({
        status: 201,
        message: `Cannot update company with id=${id}. Maybe company was not found!`,
      });
    }
    res.json({
      status: 200,
      message: "Company updated successfully.",
    });
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while update company.",
    });
  }
};

const updateCompanyStatus = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { isActive } = req.body;
    const user = await Company.findByIdAndUpdate(
      { _id: id },
      { isActive },
      { new: true }
    );
    if (user) {
      res.json({
        status: 200,
        message: `Compnay ${isActive ? "activated" : "deactivated"} successfully.`,
      });
    } else {
      res.json({
        status: 201,
        message: "Compnay not found.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while remove company.",
    });
  }
};

module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  updateCompanyStatus
};
