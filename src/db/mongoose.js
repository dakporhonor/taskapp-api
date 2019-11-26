// jshint esversion: 2015
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/taskdb", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connected"));