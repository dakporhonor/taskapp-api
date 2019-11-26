// jshint esversion: 8

const express = require("express");
const path = require("path");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

// load routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const app = express();

const port = process.env.PORT || 5000;

// app.use((req, res, next) => {
//   if (req.method) {
//     res.status(503).send('Maitainace mode')
//   } else {
//     next()
//   }
// })

app.use(express.json());

// Use Routes
app.use(userRoutes);
app.use(taskRoutes);



app.listen(port, () => console.log(`Server is running on port ${port}`));


// const main = async () => {
//   const task = await Task.findById('5ddae16938b47101d87c26e5');
//   await task.populate('owner').execPopulate();
//   console.log(task.owner);
// };

// main();