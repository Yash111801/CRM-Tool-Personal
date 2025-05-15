module.exports = (mongoose) => {
  const Users = mongoose.model(
    "users",
    mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
          unique: true,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["ADMIN", "CRM", "CMT"],
          required: true,
        },
        lastAccess: {
          type: Date,
          default: null,
        },
        isActive: {
          type: Boolean,
          default: true, // true = active, false = inactive
        },
        profileImg: {
          type: String,
          default: "",
        },
      },
      { timestamps: true }
    )
  );
  return Users;
};
