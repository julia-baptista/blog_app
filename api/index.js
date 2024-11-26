// npm init -y
// npm install express mysql nodemon dotenv bcriptjs axios cors jsonwebtoken cookie-parser multer
// package.json: "start": "nodemon index.js" and after main: "type": "module",
// npm multer: https://www.npmjs.com/package/multer

import express from "express";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/posts.js"
import cors from 'cors';
import cookieParser from "cookie-parser"
import multer from "multer";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
})

const upload = multer({ storage: storage })



app.post("/api/upload", upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)




// app.get("/test", (req, res) => {
//   res.json("It works!")
// })


app.listen(8800, () => {
  console.log("Connected!")

})