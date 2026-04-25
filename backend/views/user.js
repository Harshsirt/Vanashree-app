const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  phone: { type: Number, required: true },
  verified: { type: Boolean, default: false },
  photo: { type: String, default: "" }
}, { timestamps: true })

userSchema.plugin(plm, { usernameField: "email" })

module.exports = mongoose.model("User", userSchema,"user");