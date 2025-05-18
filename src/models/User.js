import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    accountStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "ACTIVE", "TEMPORARY_BAN", "BAN", "DELETE"],
      default: "PENDING",
    },
    role: {
      type: String,
      required: true,
      enum: ["MEMBER", "ADMIN", "SUPER_ADMIN"],
      default: "MEMBER",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastLoginTime: {
      type: Date,
    },
    address: {
      type: {
        location: String,
        phone: String,
        postalCode: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
