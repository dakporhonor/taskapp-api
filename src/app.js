// jshint esversion: 8

const express = require("express");
const path = require("path");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

// load routes
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const app = express();

const port = process.env.PORT;

app.use(express.json());

// Use Routes
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
