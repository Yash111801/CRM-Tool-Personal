const fs = require("fs");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const db = require("../../models");
const Study = db.study;
const StudyUserAccess = db.studyuseraccess;
const StudyExcelData = db.studyexceldata;
const Division = db.divisions;
const Logs = db.logs;
const Users = db.users;
const {
  calculateStatus,
  validateData,
  logAction,
} = require("../../utils/Helper");

const getStudyList = async (req, res) => {
  try {
     const user = req?.user;
     const query = {};
     if (user.role !== "ADMIN") {
      const accessRecords = await StudyUserAccess.find({
        user: user._id,
      }).select("study");
      const allowedStudyIds = accessRecords.map((access) => access.study);
      if (!allowedStudyIds.length) {
        return res.json({
          status: 200,
          data: {
            docs: [],
            totalDocs: 0,
            page,
            limit,
            totalPages: 0,
          },
          message: "No study access found for this user.",
        });
      }
      query._id = { $in: allowedStudyIds };
    }
    const studyData = await Study.find(query).select('_id title').sort({ title: 1 });
    return res.json({
      status: 200,
      data: studyData,
      message:"Study list fetched successfully."
    });
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while fetching users.",
    });
  }
}

const getStudies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField,
      sortOrder,
    } = req.body;
    const query = {};
    const user = req?.user;
    // If user is NOT admin, restrict to only allowed studies
    if (user.role !== "ADMIN") {
      const accessRecords = await StudyUserAccess.find({
        user: user._id,
      }).select("study");

      const allowedStudyIds = accessRecords.map((access) => access.study);

      if (!allowedStudyIds.length) {
        return res.json({
          status: 200,
          data: {
            docs: [],
            totalDocs: 0,
            page,
            limit,
            totalPages: 0,
          },
          message: "No study access found for this user.",
        });
      }

      query._id = { $in: allowedStudyIds };
    }
    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { studyId: { $regex: searchRegex } },
        { title: { $regex: searchRegex } },
      ];
    }
    // sort
    const sort =
      sortField && sortOrder ? { [sortField]: sortOrder } : { createdAt: -1 };
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        {
          path: "company",
          select: "companyName",
        },
        {
          path: "division",
          select: "divisionName",
        },
      ],
      lean: true,
      sort: sort,
    };
    Study.paginate(query, options, async (error, result) => {
      if (error) {
        return res.json({
          status: 201,
          message: error.message,
        });
      } else {
        // Fetch users for each study
        const updatedDocs = await Promise.all(
          result.docs.map(async (study) => {
            const studyUsers = await StudyUserAccess.find({
              study: study._id,
            }).populate({
              path: "user",
              select: "name role",
            });
            const userData = [];
            if (studyUsers && studyUsers.length > 0) {
              studyUsers.forEach((data) => {
                userData.push({
                  _id: new ObjectId(data?.user?._id),
                  name: data?.user?.name,
                  role: data?.user?.role,
                });
              });
            }
            return {
              ...study,
              users: userData,
              userCount: studyUsers.length,
              studyAccessId: studyUsers._id,
            };
          })
        );
        return res.json({
          status: 200,
          data: {
            ...result,
            docs: updatedDocs,
          },
          message:
            result.docs.length > 0
              ? "Studies fetched successfully with users."
              : "No studies found",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while fetching users.",
    });
  }
};

const createStudy = async (req, res) => {
  const {
    studyId,
    title,
    drugName,
    company,
    division,
    protocolNo,
    studyType,
    users,
  } = req.body;
  try {
    const existingStudy = await Study.findOne({ studyId: studyId });
    if (existingStudy) {
      return res.status(400).json({
        message: `Study ${studyId} already added. Please add new one.`,
      });
    }
    const newStudy = new Study({
      studyId,
      title,
      drugName,
      company,
      division,
      protocolNo,
      studyType,
    });
    const studySave = await newStudy.save();
    if (studySave && studySave._id) {
      // Map users to StudyUserAccess entries
      const accessList = users.map((user) => ({
        user: user._id,
        study: studySave._id,
        role: user.role,
      }));
      // Save all at once
      await StudyUserAccess.insertMany(accessList);
      res.json({
        status: 200,
        message: "study added successfully.",
      });
    } else {
      res.json({
        status: 201,
        message: "Some error occurred while adding study.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while adding study.",
    });
  }
};

const updateStudy = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      studyId,
      title,
      drugName,
      company,
      division,
      protocolNo,
      studyType,
      users,
    } = req.body;
    // Check if study exist for another user
    const existingStudy = await Study.findOne({ _id: { $ne: id }, studyId });
    if (existingStudy) {
      return res.status(400).json({
        message: `Study ${studyId} already added. Please add new one.`,
      });
    }
    const updatedStudy = await Study.findByIdAndUpdate(
      id,
      {
        studyId,
        title,
        drugName,
        company,
        division,
        protocolNo,
        studyType,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (updatedStudy && updatedStudy._id) {
      // Remove old user access
      await StudyUserAccess.deleteMany({ study: updatedStudy._id });
      // Add new user access
      const accessList = users.map((user) => ({
        user: user._id,
        study: updatedStudy._id,
        role: user.role,
      }));
      await StudyUserAccess.insertMany(accessList);
      res.json({
        status: 200,
        message: "Study updated successfully.",
      });
    } else {
      return res.json({
        status: 201,
        message: `Cannot update study with id=${id}. Maybe study was not found!`,
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while update user.",
    });
  }
};

const updateStudyStatus = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { isActive } = req.body;
    const studyupdate = await Study.findByIdAndUpdate(
      { _id: id },
      { isActive },
      { new: true }
    );
    if (studyupdate) {
      res.json({
        status: 200,
        message: `Study ${
          isActive ? "activated" : "deactivated"
        } successfully.`,
      });
    } else {
      res.json({
        status: 201,
        message: "Study not found.",
      });
    }
  } catch (error) {
    res.json({
      status: 201,
      message: error.message || "Some error occurred while remove study.",
    });
  }
};

const getUsersByStudyId = async (req, res) => {
  try {
    const { studyId } = req.body;
    const users = await StudyUserAccess.find({
      study: new ObjectId(studyId),
    })
      .select("user isFrozen")
      .populate({
        path: "user",
        select: "name role",
      });
    const usersData = users.map((item) => {
      return {
        _id: item._id,
        name: item?.user?.name,
        role: item?.user?.role,
        isFrozen: item.isFrozen,
      };
    });
    return res.json({
      status: 200,
      data: usersData,
      message: "Users fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: 201,
      message:
        error.message || "Internal server error while fetching users by study.",
    });
  }
};

const freezeUsersByStudy = async (req, res) => {
  try {
    const studyId = req.params.id;
    const { users } = req.body;

    if (!studyId || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Study ID and users array are required.",
      });
    }
    const bulkOps = users.map((user) => ({
      updateOne: {
        filter: {
          _id: new ObjectId(user._id),
          study: new ObjectId(studyId),
        },
        update: { isFrozen: user.isFrozen },
      },
    }));
    const result = await StudyUserAccess.bulkWrite(bulkOps);
    if (result) {
      return res.json({
        status: 200,
        message: "Users status updated successfully.",
      });
    }
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while freeze user.",
    });
  }
};

const uploadXlsxFileByStudy = async (req, res) => {
  try {
    if (!req.file)
      return res.json({ status: 400, message: "No file uploaded" });
    const { id } = req.params;
    const user = req?.user;
    const study = await Study.findById(id);
    if (!study) return res.status(404).json({ message: "Study not found" });
    if (user.role !== "ADMIN") {
      const hasAccess = await StudyUserAccess.findOne({
        study: id,
        user: user._id,
        isFrozen: false,
      });
      if (!hasAccess) return res.status(403).json({ message: "Access denied" });
    }
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    if (study.studyType === "Normal") {
      const firstRow = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
      })[0];
      const hasMilestone = Object.keys(firstRow).some((key) =>
        key.includes("Milestone")
      );
      if (hasMilestone)
        return res.json({
          status: 201,
          data: [],
          message:
            "The uploaded Excel file contains Milestone-related data, which is not supported.",
        });

      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
      });
      const jsonData = await Promise.resolve(
        data.filter((row) => row.some((cell) => cell !== ""))
      );
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        for (const row of jsonData) {
          const doctorData = {
            study: study._id,
            uploadedBy: user._id,
            uploaderRole: user.role,
            studyType: study.studyType,
            Doctor_Name: row["Dr. Name (As Per PAN)"],
            Doctor_Code: row["Frontline MCR Code (Doctor's Unique ID)"],
            address:
              row["Clinic Address (Clinic Name, Complete Address with City)"],
            Pincode: row["Pin Code"],
            SAP_Vendor_Code: row["SAP Vendor Code"],
            Email_ID: row["Email ID"],
            Mobile_No: parseInt(row["Mobile Number"]),
            PAN_No: row["PAN Number"],
            Patient_No: row["Assigned No. of Patients"],
            Amount: row["Per Patient Fees"],
            region: row["Region"],
            division: row["Division"],
            User_ID: row.User_ID || null,
            Password: row.Password || null,
            vendorName: row["Vendor Name"],
            speciality: row["Speciality"],
            mrcRegistrationNumber: row["MRC/MCI Registration Number"],
            gstNo: row["GST Number (If Available)"],
            docQualification: row["Doctor's Qualification (Degree)"],
            docExperience: row["Doctor's Experience (In Years)"],
            totalHonorariumAmount:
              row["Total Honorarium Amount  (Min 5,000 - Max 1,00,000)"],
            zone: row["Zone"],
            area: row["Area"],
            HQ: row["HQ"],
            month: row["month"],
          };
          doctorData.status = calculateStatus(doctorData, study.studyType);
          // Check if record with PAN_No + studyAccess exists
          const existing = await StudyExcelData.findOne({
            PAN_No: doctorData.PAN_No,
            study: study._id,
            deletedAt: false,
          });
          if (existing) {
            await StudyExcelData.findByIdAndUpdate(
              { _id: existing._id, deletedAt: false },
              doctorData,
              {
                new: true,
                runValidators: true,
              }
            );
          } else {
            await new StudyExcelData(doctorData).save();
          }
        }
        await logAction({
          action: "UPLOAD",
          module: "StudyExcelData",
          studyId: study._id,
          performedBy: user._id,
          role: user.role,
        });
        fs.unlinkSync(filePath);
        res.json({
          status: 200,
          data: {
            id: study._id,
          },
          message: "File uploaded and data saved/updated successfully.",
        });
      } else {
        res.json({
          status: 201,
          message: "No data found!",
        });
      }
    } else {
      const firstRow = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
      })[0];
      const hasMilestone = Object.keys(firstRow).some((key) =>
        key.includes("Milestone")
      );
      if (!hasMilestone)
        return res.json({
          status: 201,
          data: [],
          message: "No Milestone fields were found in the uploaded Excel file.",
        });

      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
        defval: "",
      });
      const jsonData = await Promise.resolve(
        data.filter((row) => row.some((cell) => cell !== ""))
      );
      const processedData = await processMilestoneData(jsonData);
      if (Array.isArray(processedData) && processedData.length > 0) {
        for (const row of processedData) {
          const milestoneData = {
            study: study._id,
            uploadedBy: user._id,
            uploaderRole: user.role,
            studyType: study.studyType,
            Doctor_Name: row["Dr. Name(As Per PAN)"],
            Doctor_Code:
              row["Frontline MCR Code\r\n(Doctor's unique ID)"] ||
              row["Frontline MCR Code\n(Doctor's unique ID)"] ||
              row["Frontline MCR Code (Doctor's unique ID)"] ||
              row["Frontline MCR Code(Doctor's unique ID)"],
            address: row["Clinic Address"],
            Pincode: row["Pin code"],
            SAP_Vendor_Code: row["SAP Vendor Code"],
            Email_ID: row["Email ID"],
            Mobile_No: parseInt(row["Mobile number"]),
            PAN_No: row["PAN Number"],
            Patient_No: row["Assigned no of Patients "],
            Amount: row["Total Honorarium Amount (₹)"],
            region: row["REGION"],
            division: row["Division"],
            User_ID: row.User_ID || null,
            Password: row.Password || null,
            vendorName: row["Vendor name"],
            speciality: row["Speciality(if available)"],
            mrcRegistrationNumber: row["MRC/MCI Registration number"],
            gstNo: row["GST Number (If Available)"],
            zone: row["ZONE"],
            area: row["AREA"],
            HQ: row["HQ"],
            month: row["Month"],
            activityProjectID: row["Activity/ Project ID"],
            agreementID: row["Unique Agreement ID"],
            nykron: row["Nykron"],
            milestoneData: row["milestones"],
          };
          milestoneData.status = calculateStatus(
            milestoneData,
            study.studyType
          );
          // Check if record with PAN_No + studyAccess exists
          const existing = await StudyExcelData.findOne({
            PAN_No: milestoneData.PAN_No,
            study: study._id,
            deletedAt: false,
          });
          if (existing) {
            await StudyExcelData.findByIdAndUpdate(
              { _id: existing._id, deletedAt: false },
              milestoneData,
              {
                new: true,
                runValidators: true,
              }
            );
          } else {
            await new StudyExcelData(milestoneData).save();
          }
        }
        await logAction({
          action: "UPLOAD",
          module: "StudyExcelData",
          studyId: study._id,
          performedBy: user._id,
          role: user.role,
        });
        fs.unlinkSync(filePath);
        res.json({
          status: 200,
          data: {
            id: study._id,
          },
          message: "File uploaded and data saved/updated successfully.",
        });
      } else {
        res.json({
          status: 201,
          message: "No data found!",
        });
      }
    }
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while upload xlsx file.",
    });
  }
};

const processStudyData = async (req, res) => {
  try {
    const { id } = req.body;
    const user = req?.user;
    if (user.role !== "ADMIN") {
      const access = await StudyUserAccess.findOne({
        study: id,
        user: user._id,
        isFrozen: false,
      });
      if (!access) {
        return res
          .status(403)
          .json({ message: "Access denied: No permission for this study." });
      }
    }
    const studyData = await StudyExcelData.find({
      study: new ObjectId(id),
      deletedAt: false,
    }).lean();
    if (Array.isArray(studyData) && studyData.length > 0) {
      const validatedData = await validateData(studyData);
      const allStatuses = ["readyToCreate", "discrimination", "completed"];
      const groupedData = validatedData.reduce((acc, curr) => {
        const { status } = curr;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(curr);
        return acc;
      }, {});
      allStatuses.forEach((status) => {
        if (!groupedData[status]) {
          groupedData[status] = [];
        }
      });
      return res.json({
        status: 200,
        data: groupedData,
        message: "Data process successfully.",
      });
    } else {
      res.json({
        status: 201,
        message: "Study data not found.",
      });
    }
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while process.",
    });
  }
};

const getProcessedStudyData = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, all } = req.body;
    const { id } = req.params;
    const user = req?.user;
    if (user.role !== "ADMIN") {
      const hasAccess = await StudyUserAccess.findOne({
        study: id,
        user: user._id,
        isFrozen: false,
      });
      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "Access denied: No permission for this study." });
      }
    }
    const query = {
      study: new ObjectId(id),
      deletedAt: false,
      ...(status && { status }),
    };
    if (all) {
      const allDocs = await StudyExcelData.find(query)
        .select("-_id -createdAt -updatedAt -deletedAt -__v")
        .sort({ createdAt: 1 })
        .lean();
      const validatedDocs = await validateData(allDocs);
      return res.json({
        status: 200,
        data: { docs: validatedDocs, totalDocs: validatedDocs.length },
        message:
          validatedDocs.length > 0
            ? "All data fetched successfully."
            : "No data found.",
      });
    } else {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        lean: true,
      };
      const result = await StudyExcelData.paginate(query, options);
      if (result && result.docs.length > 0) {
        const validatedDocs = await validateData(result.docs);
        result.docs = validatedDocs;
        return res.json({
          status: 200,
          data: result,
          message:
            validatedDocs.length > 0
              ? "Data fetched successfully."
              : "No Data found",
        });
      } else {
        return res.json({
          status: 200,
          data: result,
          message: "Data not found!",
        });
      }
    }
  } catch (error) {
    return res.json({
      status: 201,
      message:
        error.message || "Internal server error while get processed data.",
    });
  }
};
// Delete Process Data
const processDataDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req?.user;
    if (!id) {
      return res.json({ status: 400, message: "ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ status: 400, message: "Invalid ID format." });
    }
    const existingRecord = await StudyExcelData.findOne({
      _id: id,
      deletedAt: false,
    });
    if (!existingRecord) {
      return res.json({ status: 201, message: "Not found" });
    }
    const studyId = existingRecord.study;
    const result = await StudyExcelData.findByIdAndUpdate(
      id,
      { deletedAt: true },
      { new: true, runValidators: true }
    );
    if (result) {
      await logAction({
        action: "DELETE",
        module: "StudyExcelData",
        recordId: result._id,
        studyId: studyId,
        performedBy: user._id,
        role: user.role,
      });
      res.json({ status: 200, message: "Deleted successfully" });
    } else {
      res.json({ status: 201, message: "Not found" });
    }
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while delete data.",
    });
  }
};

const processDataUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req?.user;
    const updatePayload = req.body;
    if (updatePayload?.created) {
      delete updatePayload.created;
      updatePayload.uploadedBy = user?._id;
      updatePayload.uploaderRole = user?.role;
      updatePayload.status = calculateStatus(
        updatePayload,
        updatePayload?.studyType
      );
      const newStudyExcelData = new StudyExcelData(updatePayload);
      const studySave = await newStudyExcelData.save();
      if (studySave && studySave?._id) {
        await logAction({
          action: "CREATE",
          module: "StudyExcelData",
          recordId: studySave?._id,
          studyId: updatePayload.study,
          performedBy: user._id,
          role: user.role,
        });
        return res.json({
          status: 200,
          data: studySave,
          message: "New data added successfully",
        });
      } else {
        return res.json({
          status: 201,
          message: "Error while save study excel data",
        });
      }
    } else {
      if (!id) {
        return res.json({ status: 400, message: "ID is required." });
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({ status: 400, message: "Invalid ID format." });
      }
      const existingRecord = await StudyExcelData.findOne({
        _id: id,
        deletedAt: false,
      });
      if (!existingRecord) {
        return res.json({ status: 201, message: "Not found" });
      }
      const studyId = existingRecord.study;
      const original = existingRecord.toObject();
      const mergedData = { ...original, ...updatePayload };
      const newStatus = calculateStatus(mergedData, mergedData.studyType);
      updatePayload.status = newStatus;
      const updatedData = await StudyExcelData.findByIdAndUpdate(
        { _id: id, deletedAt: false },
        updatePayload,
        { new: true, runValidators: true }
      ).lean();
      if (updatedData) {
        await logAction({
          action: "UPDATE",
          module: "StudyExcelData",
          recordId: updatedData._id,
          studyId: studyId,
          performedBy: user._id,
          role: user.role,
        });
        return res.json({
          status: 200,
          data: updatedData,
          message: "process data updated successfully",
        });
      } else {
        return res.json({
          status: 201,
          message: "Error while process data update",
        });
      }
    }
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while update data.",
    });
  }
};

const getLogsByStudyId = (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({ status: 400, message: "ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ status: 400, message: "Invalid ID format." });
    }
    const {
      page = 1,
      limit = 10,
      search = "",
      sortField,
      sortOrder,
    } = req.body;
    const query = {};
    query.studyId = id;
    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ action: { $regex: searchRegex } }];
    }
    const sort =
      sortField && sortOrder ? { [sortField]: sortOrder } : { createdAt: -1 };
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        {
          path: "performedBy",
          select: "name role",
        },
        {
          path: "recordId",
          select: "Doctor_Name",
        },
      ],
      lean: true,
      sort: sort,
    };
    Logs.paginate(query, options, async (error, result) => {
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
              ? "Logs fetched successfully."
              : "No Logs found",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while get logs data.",
    });
  }
};

const processMilestoneData = async (jsonData) => {
  const headerRow = jsonData[1];
  const dataRows = jsonData.slice(2);
  const headerCount = {};
  const uniqueHeaders = headerRow.map((header) => {
    if (!header) return "";
    if (headerCount[header]) {
      headerCount[header]++;
      return `${header}_${headerCount[header]}`;
    } else {
      headerCount[header] = 1;
      if (
        header.includes("No. of patients") ||
        header.includes("Honorarium (₹)")
      ) {
        return `${header}_1`;
      }
      return header;
    }
  });
  const jsonData1 = await Promise.all(
    dataRows.map(async (row) => {
      const obj = {};
      let milestoneData = [];
      for (let index = 0; index < uniqueHeaders.length; index++) {
        const header = uniqueHeaders[index];
        if (header) {
          if (
            header.includes("No. of patients") ||
            header.includes("Honorarium (₹)")
          ) {
            const milestoneIndex = header.split("_")[1];
            if (milestoneIndex) {
              if (header.includes("No. of patients")) {
                if (!milestoneData[milestoneIndex])
                  milestoneData[milestoneIndex] = {};
                milestoneData[milestoneIndex]["numberOfPatients"] = row[index];
              }
              if (header.includes("Honorarium (₹)")) {
                if (!milestoneData[milestoneIndex])
                  milestoneData[milestoneIndex] = {};
                milestoneData[milestoneIndex]["honorariumAmount"] = row[index];
              }
            }
          } else {
            obj[header] = row[index];
          }
        }
      }
      obj["milestones"] = milestoneData.filter(
        (milestone) => Object.keys(milestone).length > 0
      );
      return obj;
    })
  );
  return jsonData1;
};

const getStudyById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {};
    const user = req?.user;
    // If user is NOT admin, restrict to only allowed studies
    if (user.role !== "ADMIN") {
      const accessRecords = await StudyUserAccess.find({
        user: user._id,
      }).select("study");
      const allowedStudyIds = accessRecords.map((access) => access.study);
      if (!allowedStudyIds.length) {
        return res.json({
          status: 200,
          data: [],
          message: "No study access found for this user.",
        });
      }
      query._id = { $in: allowedStudyIds };
    }
    if (id) {
      if (query._id) {
        // If already has $in condition, intersect with studyId
        query._id = {
          $in: query._id.$in.filter((uId) => uId.toString() === id.toString()),
        };
      } else {
        query._id = id;
      }
    }
    if (query._id && Array.isArray(query._id.$in) && query._id.$in.length === 0) {
      return res.json({
        status: 200,
        data: [],
        message: "No matching study found.",
      });
    }

    const study = await Study.findOne(query)
    .populate([
      { path: "company", select: "companyName" },
      { path: "division", select: "divisionName" },
    ])
    .lean();

    if (!study) {
      return res.json({
        status: 404,
        message: "Study not found",
      });
    }
    // Get associated users
    const studyUsers = await StudyUserAccess.find({ study: study._id }).populate({
      path: "user",
      select: "name role",
    });

    const userData = studyUsers.map((data) => ({
      _id: new ObjectId(data?.user?._id),
      name: data?.user?.name,
      role: data?.user?.role,
    }));

    return res.json({
      status: 200,
      data: {
        ...study,
        users: userData,
        userCount: userData.length,
      },
      message: "Study fetched successfully with users.",
    });
  } catch (error){
    return res.json({
      status: 201,
      message: error.message || "Internal server error while get study.",
    });
  }
}

const getStudyByDivision = async (req, res) => {
  try {
     const { divisionId } = req.body;
     const user = req?.user;
     const query = {};
     if (user.role !== "ADMIN") {
      const accessRecords = await StudyUserAccess.find({
        user: user._id,
      }).select("study");
      const allowedStudyIds = accessRecords.map((access) => access.study);
      if (!allowedStudyIds.length) {
        return res.json({
          status: 200,
          data: [],
          message: "No study access found for this user.",
        });
      }
      query._id = { $in: allowedStudyIds };
    }
    if (divisionId) {
      query.division = divisionId;
    }
    console.log("query", query);
    const studyData = await Study.find(query).select('_id title').sort({ title: 1 });
    return res.json({
      status: 200,
      data: studyData,
      message:"Study list fetched successfully."
    });
  } catch (error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while get study.",
    });
  }
}

const getDashboardData = async (req, res) => {
  try {
    const {
      companyId,
      divisionId,
      studyId,
      startDate,
      endDate,
      selectedYear
    } = req.body;
      const user = req?.user;
      const query = {};
      if (user.role !== "ADMIN") {
      const accessRecords = await StudyUserAccess.find({
        user: user._id,
      }).select("study");
      const allowedStudyIds = accessRecords.map((access) => access.study);
      if (!allowedStudyIds.length) {
        return res.json({
          status: 200,
          data: [],
          message: "No study access found for this user.",
        });
      }
      query._id = { $in: allowedStudyIds };
    }
    const results = await Users.aggregate([
      {
        $match: {
          role: { $in: ["CRM", "CMT"] }
        }
      },
      {
        $group: {
          _id: {
            role: "$role",
            isActive: "$isActive"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.role",
          counts: {
            $push: {
              k: { $cond: [ "$_id.isActive", "active", "inactive" ] },
              v: "$count"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          counts: {
            $arrayToObject: {
              $concatArrays: [
                [ { k: "active", v: 0 }, { k: "inactive", v: 0 } ],
                "$counts"
              ]
            }
          }
        }
      }
    ]);
    const frozenCounts = await StudyUserAccess.aggregate([
      {
        $match: { isFrozen: true }
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
    const divisions = await Division.countDocuments();
    const studies = await Study.countDocuments(query);
    const frozenMap = Object.fromEntries(
      frozenCounts.map(({ _id, count }) => [_id, count])
    );
    const finalObject = results.reduce((acc, { role, counts }) => {
      acc[role] = {
        ...counts,
        frozen: frozenMap[role] || 0
      };
      return acc;
    }, {});
    let dashboardData = {
      "divisions": divisions,
      "studies": studies,
      ...finalObject
    }
    res.json({
      status: 200,
      data: dashboardData,
      message: "Dashboard data fetched successfully."
    })
  } catch(error) {
    return res.json({
      status: 201,
      message: error.message || "Internal server error while get dashboard data.",
    });
  }
}

module.exports = {
  getStudyList,
  getStudies,
  createStudy,
  updateStudy,
  updateStudyStatus,
  getUsersByStudyId,
  freezeUsersByStudy,
  uploadXlsxFileByStudy,
  processStudyData,
  getProcessedStudyData,
  processDataDelete,
  processDataUpdate,
  getLogsByStudyId,
  getStudyById,
  getStudyByDivision,
  getDashboardData
};
