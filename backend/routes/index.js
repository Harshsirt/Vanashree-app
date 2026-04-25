const express = require("express")
const passport = require("passport")
const nodemailer = require("nodemailer")
const multer = require("multer")
const path = require("path")
const User = require("../views/user.js")
const Post = require("../views/post.js")

const router = express.Router()
let otpStore = {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

router.post("/sendotp", async (req, res) => {
  const { email } = req.body
  const otp = Math.floor(1000 + Math.random() * 9000)
  otpStore[email] = { otp, expiresAt: Date.now() + 60 * 1000 }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    })
    await transporter.sendMail({
      from: `Vanashree App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Vanashree",
      text: `Your OTP is ${otp}. Valid for 1 minute.`
    })
    res.json({ msg: "OTP sent" })
  } catch (err) {
    res.json({ msg: "Failed to send OTP", error: err.message })
  }
})

router.post("/verifyOtp", (req, res) => {
  const { email, otp } = req.body
  const record = otpStore[email]
  if (!record) return res.json({ msg: "No OTP found" })
  if (Date.now() > record.expiresAt) return res.json({ msg: "OTP has expired" })
  if (String(record.otp) !== String(otp)) return res.json({ msg: "Wrong OTP" })
  record.verified = true
  res.json({ msg: "OTP verified" })
})

router.post("/register", upload.single("photo"), (req, res) => {
  const { name, phone, email, password } = req.body
  const record = otpStore[email]
  if (!record?.verified) return res.json({ msg: "Please verify OTP first" })
  const photoPath = req.file ? `/uploads/${req.file.filename}` : ""
  User.register(
    new User({ name, phone, email, verified: true, photo: photoPath }),
    password,
    (err, user) => {
      if (err) return res.json({ msg: "Error registering", error: err.message })
      delete otpStore[email]
      res.json({ msg: "Registered" })
    }
  )
})

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.json({ msg: "Server error" })
    if (!user) return res.json({ msg: "Invalid email or password" })
    req.logIn(user, (err) => {
      if (err) return res.json({ msg: "Login failed" })
      if (!user.verified) return res.json({ msg: "Not verified" })
      return res.json({ msg: "Login success", user })
    })
  })(req, res, next)
})

router.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8
  const skip = (page - 1) * limit
  const totalPosts = await Post.countDocuments()
  const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
  res.json({ posts, totalPosts, totalPages: Math.ceil(totalPosts / limit), currentPage: page })
})

router.get("/posts/user/:userId", async (req, res) => {
  const posts = await Post.find({ postedBy: req.params.userId }).sort({ createdAt: -1 })
  res.json(posts)
})

router.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.json({ msg: "Post not found" })
  res.json(post)
})

router.post("/posts", upload.single("image"), async (req, res) => {
   if (!req.user) {
    return res.status(401).json({ msg: "Login for plant tree" })
  }
  const { title, species, location, lat, lng, description, health, postedBy } = req.body
  const imagePath = req.file ? `/uploads/${req.file.filename}` : ""
  const post = new Post({ title, species, location, lat, lng, description, health, image: imagePath, postedBy: postedBy || null })
  await post.save()
  res.json({ msg: "Post created", post })
})

router.post("/posts/:id/like", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Login required" })
  }
  const { userId } = req.body
  const post = await Post.findById(req.params.id)
  if (!post) return res.json({ msg: "Post not found" })
  const alreadyLiked = post.likes.includes(userId)
  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id.toString() !== userId)
  } else {
    post.likes.push(userId)
  }
  await post.save()
  res.json({ msg: alreadyLiked ? "Unliked" : "Liked", likes: post.likes.length })
})

router.post("/posts/:id/update", upload.single("image"), async (req, res) => {
  const { caption, postedBy, postedByName } = req.body
  const post = await Post.findById(req.params.id)
  if (!post) return res.json({ msg: "Post not found" })

  if (post.postedBy.toString() !== postedBy) {
    return res.json({ msg: "Only the tree owner can post updates" })
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : ""
  post.updates.push({ caption, image: imagePath, postedBy, postedByName })
  await post.save()
  res.json({ msg: "Update added", post })
})

router.get("/updates/recent", async (req, res) => {
  const posts = await Post.find({ "updates.0": { $exists: true } }).sort({ updatedAt: -1 }).limit(20)
  const allUpdates = []
  posts.forEach(post => {
    post.updates.forEach(update => {
      allUpdates.push({
        treeId: post._id,
        treeTitle: post.title,
        caption: update.caption,
        image: update.image,
        postedByName: update.postedByName,
        createdAt: update.createdAt
      })
    })
  })
  allUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json(allUpdates.slice(0, 15))
})

router.get("/volunteers/count", async (req, res) => {
  const count = await User.countDocuments()
  res.json({ count })
})

module.exports = router