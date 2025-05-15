module.exports = (mongoose) => {
  const StudyUserAccess = mongoose.model(
    "studyuseraccess",
    mongoose.Schema(
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        study: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "study",
          required: true,
        },
        role: {
          type: String,
          enum: ["CRM", "CMT"],
          required: true,
        },
        isFrozen: {
          type: Boolean,
          default: false,
        }
      },
      { timestamps: true }
    )
  );
  return StudyUserAccess;
};
