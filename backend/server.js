if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const User = require("./views/user.js")


if (!fs.existsSync("uploads")) fs.mkdirSync("uploads")

mongoose.set("strictQuery", true)
mongoose.connect(process.env.MONGO_URI)

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vanashree-frontend.onrender.com",
    "https://vanashree-app.vercel.app/"
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const routes = require("./routes/index.js")

app.use("/api", routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})