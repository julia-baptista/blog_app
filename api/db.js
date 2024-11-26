import mysql from 'mysql';
import * as dotenv from 'dotenv';

dotenv.config()

export const db = mysql.createConnection ({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASS,
  database: 'blog'
})