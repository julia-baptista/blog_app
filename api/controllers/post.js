// npm install jsonwebtoken


import {db} from "../db.js";
import jwt from "jsonwebtoken";

export const Test = (req, res) => {
  res.json("from controller")
}

export const getPosts = (req, res) => {
  const q = req.query.cat
  ? "SELECT * FROM posts  where CAT=?"
  : "SELECT * FROM posts"

  db.query(q, [req.query.cat], (err, data) => {
    if(err) return res.status(500).send(err)
    res.status(200).json(data)
  })
}

export const getPost = (req, res) => {

  const postId = req.params.id;
  const q = "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?"

  db.query(q, [postId], (err, data) => {
    if(err) return res.status(500).send(err)
      res.status(200).json(data[0])
  })
}

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("Not authenticated")

    jwt.verify(token, "jwtkey", (err, userInfo)=> {
      if(err) return res.status(403).json("Token is not valid!");

      const q = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)";

      const values = [
        req.body.title,
        req.body.desc,
        req.body.img,
        req.body.cat,
        req.body.date,
        userInfo.id
      ]

      // eslint-disable-next-line no-unused-vars
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json("Post has been created.")
      })
    })


}

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("Not authenticated")

    jwt.verify(token, "jwtkey", (err, userInfo)=> {
      if(err) return res.status(403).json("Token is not valid!");

      const postId = req.params.id;

      const q = "DELETE FROM posts WHERE `id` = ?  AND `uid`= ?"

      // eslint-disable-next-line no-unused-vars
      db.query(q, [postId, userInfo.id], (err, data) => {
        if (err) return res.status(403).json("You can delete only your post!")
        return res.status(204).json("Post has been deleted!")
      })

    })
    
  
}

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if(!token) return res.status(401).json("Not authenticated")

    jwt.verify(token, "jwtkey", (err, userInfo)=> {
      if(err) return res.status(403).json("Token is not valid!");

      const q = "UPDATE posts SET `title`=?, `desc`=?, `img`=IF(? = '', null, ?), `cat`=? WHERE `id`=? AND `uid`=?";

      const postId = req.params.id;

      const values = [
        req.body.title,
        req.body.desc,
        req.body.img,
        req.body.img,
        req.body.cat,
      ]

      // eslint-disable-next-line no-unused-vars
      db.query(q, [...values, postId, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json("Post has been updated.")
      })
    })

}