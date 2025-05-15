module.exports = (mongoose) => {
    const Companies = mongoose.model(
      "companies",
      mongoose.Schema(
        {
          companyName: {
            type: String,
            required: true
          },
          isActive: {
            type: Boolean,
            default: true, // true = active, false = inactive
          },
        },
        { timestamps: true }
      )
    );
    return Companies;
  };
  