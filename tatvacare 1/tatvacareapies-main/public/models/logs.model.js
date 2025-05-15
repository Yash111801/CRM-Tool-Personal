module.exports = (mongoose) => {
    const logs = mongoose.model(
      "logs",
      mongoose.Schema(
        {
          action: {
            type: String,
            enum: ["UPLOAD", "CREATE", "UPDATE", "DELETE"],
            required: true
          },
          module: {
            type: String,
            required: true
          },
          recordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "studyexceldata",
            required: false
          },
          studyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "study",
            required: true,
          },
          performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
          },
          role: {
            type: String,
            enum: ["ADMIN", "CRM", "CMT"],
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
        { timestamps: true }
      )
    );
    return logs;
  };
  