import express from "express";
import { Test, getPosts, getPost, addPost, deletePost, updatePost} from "../controllers/post.js";

const router = express.Router()


router.get("/test", Test)
router.get("/", getPosts)
router.get("/:id", getPost)
router.post("/", addPost)
router.delete("/:id", deletePost)
router.put("/:id", updatePost)



export default router;