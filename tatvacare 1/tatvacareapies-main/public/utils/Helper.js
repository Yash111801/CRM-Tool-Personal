// generate jsonweb token
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const db = require("../models");
const Logs = db.logs;

const generateJsonwebtoken = async (user) => {
  let token = jwt.sign(
    {
      user_id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
    },
    SECRET,
    { expiresIn: "30d" }
  );
  return token;
};

function calculateStatus(data, type="Normal") {
  let requiredFields = [
    "Doctor_Name",
    "Doctor_Code",
    "address",
    "Pincode",
    "SAP_Vendor_Code",
    "Email_ID",
    "Mobile_No",
    "PAN_No",
    "Patient_No",
    "Amount",
    "region"
  ];
  if (type === "Milestone") {
    requiredFields = [...requiredFields, 'milestoneData'];
  }
  const hasAllRequiredFields = requiredFields.every(
    (key) => data[key] !== undefined && data[key] !== null && data[key] !== ""
  );
  const hasCredentials = !!data.User_ID && !!data.Password;
  if (hasAllRequiredFields && hasCredentials) return "completed";
  if (hasAllRequiredFields && !hasCredentials) return "readyToCreate";
  return "discrimination";
};

async function validateData(data) {
  const panSet = new Set();
  const doctorCodeSet = new Set();
  const emailSet = new Set();
  const sapCodeSet = new Set();
  const validated = data.map((item) => {
    const validation = [];
    if (item.status === "completed") return item;
    // For discrimination, check required and duplicates
    if (item.status === "discrimination") {
      const requiredFields = [
        "Doctor_Name", "Doctor_Code", "address", "Pincode", "SAP_Vendor_Code",
        "Email_ID", "Mobile_No", "PAN_No", "Patient_No", "Amount", "region",
        // "vendorName", "speciality", "mrcRegistrationNumber",
        // "gstNo", "docQualification", "docExperience", "totalHonorariumAmount",
        // "zone", "area", "HQ"
      ];
      for (const field of requiredFields) {
        if (item[field] === undefined || item[field] === null || item[field] === "") {
          validation.push(`${field} is missing`);
        }
      }
     // Duplicate checks
      if (item.PAN_No) {
        if (panSet.has(item.PAN_No)) {
          validation.push("Duplicate PAN_No found");
        } else {
          panSet.add(item.PAN_No);
        }
      }

      if (item.Doctor_Code) {
        if (doctorCodeSet.has(item.Doctor_Code)) {
          validation.push("Duplicate Doctor_Code found");
        } else {
          doctorCodeSet.add(item.Doctor_Code);
        }
      }

      if (item.Email_ID) {
        if (emailSet.has(item.Email_ID)) {
          validation.push("Duplicate Email_ID found");
        } else {
          emailSet.add(item.Email_ID);
        }
      }

      if (item.SAP_Vendor_Code) {
        if (sapCodeSet.has(item.SAP_Vendor_Code)) {
          validation.push("Duplicate SAP_Vendor_Code found");
        } else {
          sapCodeSet.add(item.SAP_Vendor_Code);
        }
      }

    } else if (item.status === "readyToCreate") {
      // Duplicate checks
      if (item.PAN_No) {
        if (panSet.has(item.PAN_No)) {
          validation.push("Duplicate PAN_No found");
        } else {
          panSet.add(item.PAN_No);
        }
      }

      if (item.Doctor_Code) {
        if (doctorCodeSet.has(item.Doctor_Code)) {
          validation.push("Duplicate Doctor_Code found");
        } else {
          doctorCodeSet.add(item.Doctor_Code);
        }
      }

      if (item.Email_ID) {
        if (emailSet.has(item.Email_ID)) {
          validation.push("Duplicate Email_ID found");
        } else {
          emailSet.add(item.Email_ID);
        }
      }

      if (item.SAP_Vendor_Code) {
        if (sapCodeSet.has(item.SAP_Vendor_Code)) {
          validation.push("Duplicate SAP_Vendor_Code found");
        } else {
          sapCodeSet.add(item.SAP_Vendor_Code);
        }
      }
    }
    return {
      ...item,
      validation: validation.length ? validation : null,
    };
  });

  return validated;
};

async function logAction({ action, module, recordId = null, studyId, performedBy, role }){
  try {
    await Logs.create({
      action,
      module,
      recordId,
      studyId,
      performedBy,
      role,
    });
  } catch (error) {
    console.log("Error logging action:", error);
  }
};

module.exports = {
  generateJsonwebtoken: generateJsonwebtoken,
  calculateStatus: calculateStatus,
  validateData: validateData,
  logAction: logAction
};
