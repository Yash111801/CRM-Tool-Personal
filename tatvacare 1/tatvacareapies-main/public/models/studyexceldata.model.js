module.exports = (mongoose) => {
  const StudyExcelData = mongoose.model(
    "studyexceldata",
    mongoose.Schema(
      {
        study: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "study",
          required: true,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        uploaderRole: {
          type: String,
          enum: ["ADMIN", "CRM", "CMT"],
          required: true,
        },
        studyType: {
          type: String,
          enum: ["Normal", "Milestone"],
          required: true,
          default: "Normal"
        },
        // required fields
        Doctor_Name: {
          type: String,
          required: true
        },
        Doctor_Code: {
          type: String,
          required: true
        },
        address: {
          type: String,
          required: true
        },
        Pincode: {
          type: Number,
          required: true
        },
        SAP_Vendor_Code: {
          type: String,
          required: true
        },
        Email_ID: {
          type: String,
          required: true
        },
        Mobile_No: {
          type: Number,
          required: true
        },
        PAN_No: {
          type: String,
          required: true
        },
        Patient_No: {
          type: Number,
          required: true
        },
        Amount: {
          type: Number,
          required: true
        },
        region: {
          type: String,
          // required: true
        },
        Division: {
          type: String
        },
        User_ID: {
          type: String,
        },
        Password: {
          type: String,
        },
        status: {
          type: String,
          enum: ["readyToCreate", "completed", "discrimination"],
          default: "discrimination",
        },
        // milestone study fields
        milestoneData: [
          {
            numberOfPatients: { type: Number, required: true },
            honorariumAmount: { type: Number, required: true },
          }
        ],
        // common optional fields
        vendorName: {
          type: String
        },
        speciality: {
          type: String
        },
        mrcRegistrationNumber: {
          type: String
        },
        gstNo: {
          type: String
        },
        docQualification: {
          type: String
        },
        docExperience: {
          type: Number
        },
        totalHonorariumAmount: {
          type: Number,
          min: [5000, 'Amount must be at least 5000'],
          max: [100000, 'Amount must not exceed 100000']
        },
        zone: {
          type: String
        },
        area: {
          type: String
        },
        HQ: {
          type: String
        },
        month: {
          type: String
        },
        // milestone study optional fields
        activityProjectID: { type: String },
        agreementID: { type: String },
        nykron: {
          type: Number
        },
        deletedAt: {
          type: Boolean,
          default: false
        }
      },
      { timestamps: true }
    )
  );
  return StudyExcelData;
};
