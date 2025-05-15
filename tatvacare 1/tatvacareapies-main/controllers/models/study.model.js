module.exports = (mongoose) => {
    const Study = mongoose.model(
      "study",
      mongoose.Schema(
        {
          studyId: {
            type: String,
            required: true,
            unique: true
          },
          title: {
            type: String,
            required: true,
          },
          drugName: {
            type: String,
            required: true,
          },
          company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
            required: true,
          },
          division: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "divisions",
            required: true,
          },
          protocolNo: {
            type: String,
            required: true,
          },
          studyType: {
            type: String,
            enum: ["Normal", "Milestone"],
            required: true,
          },
          isActive: {
            type: Boolean,
            default: true, // true = active, false = inactive
          },
        },
        { timestamps: true }
      )
    );
    return Study;
  };
  