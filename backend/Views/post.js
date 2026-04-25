const mongoose = require("mongoose")

const updateSchema = new mongoose.Schema({
  caption: { type: String },
  image: { type: String },
  postedBy: { type: String },
  postedByName: { type: String }
}, { timestamps: true })

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  species: { type: String, required: true },
  location: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  description: { type: String },
  health: { type: String, default: "good" },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updates: [updateSchema]
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema, "posts")