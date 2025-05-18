import mongoose from "mongoose";

const schema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
  },
  permission: {
    type: String,
    required: true,
    enum: ["CREATE", "UPDATE", "DELETE", "READ"],
  },
});

export default mongoose.model("Permission", schema);
