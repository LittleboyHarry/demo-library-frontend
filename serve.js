const express = require("express");
const app = express();
const port = 8080;
const fs = require("fs");
const formData = require("express-form-data");

let bookDataSet = {
  1: {
    name: "JS 红宝书",
    author: "美 J.S.",
    category: "T",
    press: "IT press",
    isbn: "434121",
    borrowed: false,
  },
  2: {
    name: "春节礼仪",
    author: "雷梅",
    category: "G",
    press: "文明出版社",
    isbn: "121111",
    borrowed: true,
  },
  3: {
    name: "茶艺术",
    author: "汉东大学",
    category: "J",
    press: "汉东大学出版社",
    isbn: "77755",
    borrowed: false,
  },
};

let bookNextIndex = 0;

const dataFileName = "books.json";

if (fs.existsSync(dataFileName))
  bookDataSet = JSON.parse(fs.readFileSync(dataFileName));

app.use(formData.parse()).use(
  "/api",
  express
    .Router()
    .get("/books", (req, res) => {
      const { name } = req.query;
      res.json(
        !name
          ? Object.entries(bookDataSet).map(([id, props]) => {
              return { id, ...props };
            })
          : [
              {
                id: 1,
                name,
                author: "尚未开发",
                category: "J",
                press: "尚未开发",
                isbn: 1,
              },
            ]
      );
    })
    .get("/books/:id", (req, res) => {
      res.json(bookDataSet[req.params.id]);
    })
    .post("/books", (req, res) => {
      while (bookDataSet[++bookNextIndex]);
      bookDataSet[bookNextIndex] = req.body;
      res.json(true);
    })
    .put("/books/:id", (req, res) => {
      bookDataSet[req.params.id] = {
        ...bookDataSet[req.params.id],
        ...req.body,
      };
      bookDataSet[req.params.id].borrowed = req.body.borrowed === "true";
      res.json(true);
    })
    .delete("/books/:id", (req, res) => {
      delete bookDataSet[req.params.id];
      res.json(true);
    })
);

app.listen(port, () => {
  console.log(`图书馆微后台已启动 http://localhost:${port}/api`);
});
