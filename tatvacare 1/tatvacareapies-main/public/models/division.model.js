module.exports = (mongoose) => {
  const Division = mongoose.model(
    "divisions",
    mongoose.Schema(
      {
        divisionName: {
          type: String,
          required: true,
        },
        company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "companies",
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
  return Division;
};
