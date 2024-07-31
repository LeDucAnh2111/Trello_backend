// import express from "express";
const express = require("express");

const app = express();

const PORT = 3000;
const URL = "localhost";

app.get("/", (req, res) => {
  res.send("<h1>Hello word</h1>");
});

app.listen(PORT, URL, () => {
  console.log(`server đã chạy với đường dẫn : http://${URL}:${PORT}/`);
});
