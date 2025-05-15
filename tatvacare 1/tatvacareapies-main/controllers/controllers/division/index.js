const { ObjectId } = require("mongoose").Types;
const db = require("../../models");
const Division = db.divisions;

const getDivisions = (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField,
      sortOrder,
    } = req.body;
    const query = {};
    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ divisionName: { $regex: searchRegex } }];
    }
    // sort
    let sort = {};
    if (sortField && sortOrder) {
      sort[sortField] = sortOrder;
    } else {
      sort["createdAt"] = -1;
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: {
        path: "company",
        select: "companyName",
      },
      sort: sort,
    };
    Division.paginate(query, options, (error, result) => {
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
              ? "Divisions fetched successfully."
              : "No divisions found",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 201,
      message:
        error.message || "Internal server error while fetching divisions.",
    });
  }
};

const createDivision = async (req, res) => {
  const { divisionName, company } = req.body;
  try {
    const newDivision = new Division({
      divisionName,
      company,
    });
    const division = await newDivision.save();
    if (
      division._id !== null &&
      division._id !== undefined &&
      division._id !== ""
    ) {
      res.json({
        status: 200,
        message: "Division added successfully.",
      });
    } else {
      res.json({
        status: 201,
        message: "Some error occurred while adding division.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while adding division.",
    });
  }
};

const updateDivision = async (req, res) => {
  try {
    const id = req.params.id;
    const updateDivision = await Division.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });
    if (!updateDivision) {
      return res.json({
        status: 201,
        message: `Cannot update division with id=${id}. Maybe division was not found!`,
      });
    }
    res.json({
      status: 200,
      message: "Division updated successfully.",
    });
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while update company.",
    });
  }
};

const updateDivisionStatus = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { isActive } = req.body;
    const division = await Division.findByIdAndUpdate(
      { _id: id },
      { isActive },
      { new: true }
    );
    if (division) {
      res.json({
        status: 200,
        message: `Division ${
          isActive ? "activated" : "deactivated"
        } successfully.`,
      });
    } else {
      res.json({
        status: 201,
        message: "Division not found.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while remove division.",
    });
  }
};

module.exports = {
  getDivisions,
  createDivision,
  updateDivision,
  updateDivisionStatus,
};
