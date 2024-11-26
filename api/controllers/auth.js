// npm install bcriptjs
// npm install jsonwebtoken

import {db} from "../db.js";
import bcrypt from "bcryptjs"; // ES module syntax
import jwt from 'jsonwebtoken';

// const bcrypt = require('bcryptjs');

/* app.get('/users/:userId', (req, res) => {
  console.log(req.params.userId); // Retrieves "userId" from the URL path
}); */


/* URL: /search?q=books
app.get('/search', (req, res) => {
  console.log(req.query.q); // Retrieves the query parameter "q"
}); */

export const register = (req, res) => {

  //CHECK EXISTING USER
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  db.query(q, [email, username], (err, data) => {
    if(err) return res.json(err);
    if(data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const q = "INSERT into users(`username`, `email`, `password`) values (?)"
    const values = [
      username,
      email,
      hash
    ]
    
    // eslint-disable-next-line no-unused-vars
    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been created");
    })
    
  });
};

export const login = (req, res) => {
  //CHECK USER

  const q = "SELECT * FROM users WHERE username = ?"

  db.query(q, [req.body.username], (err,data)=> {
    if (err) return res.json(err)
    if(data.length === 0) return res.status(404).json("User not found!")

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

    if(!isPasswordCorrect) return res.status(400).json("Wrong username or password!")

    const token = jwt.sign({id: data[0].id}, "jwtkey");
    // eslint-disable-next-line no-unused-vars
    const {password, ...other} = data[0];

    res.cookie("access_token", token, {
      httpOnly:true,
      secure: false, // Coloque true se estiver usando HTTPS
      sameSite: 'lax', // 'lax' ou 'none' para permitir cookies em navegadores modernos
    }).status(200).json(other)

  })
}

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false, // Coloque true se estiver usando HTTPS
    sameSite: 'lax', // 'lax' ou 'none' para permitir cookies em navegadores modernos
  }).status(200).json("User has been logged out.")
}
