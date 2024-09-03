import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
let currentUserId = 1


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


db.connect()

async function listPerUser() {
  const result = await db.query("SELECT * FROM users JOIN items ON users.id = user_id WHERE user_id = $1;", [currentUserId]);
  return result.rows;
}

async function  currentUser() {
  const result = await db.query("SELECT * FROM users");     
  return result.rows;
}


app.get("/", async (req, res) => {
  let users = await currentUser()
  items = await listPerUser()
  console.log(users)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
    users: users
  });
  

});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title, user_id) VALUES ($1, $2);", [item, currentUserId]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const title = (req.body.updatedItemTitle);
  const id = req.body.updatedItemId
  await db.query("UPDATE items SET title = ($1) WHERE id = $2;", [title, id]);
  res.redirect("/");
});

app.post("/user", (req, res) => {
  currentUserId = req.body.user;
  console.log("hello");  
  res.redirect("/");
})
  
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId
  await db.query("DELETE FROM items WHERE id = $1;", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
