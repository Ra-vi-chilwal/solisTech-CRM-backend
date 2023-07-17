const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profile: { type: String },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
}, { collection: "users", timestamps: true });
const Users = mongoose.model("Users", userSchema);
module.exports = { Users, userSchema }