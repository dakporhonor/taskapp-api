//jshint esversion: 8
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);

    const token = await user.generateAuthToken();

    res.status(200).send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {

    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });

    await req.user.save();
    res.send('Logged Out!');
  } catch (error) {
    res.status(500).send('Unable to log out. Try again!');
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {

  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send('Users logged out!');
  } catch (error) {
    res.status(500).send(error);
  }

})

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});



router.patch("/users/me", auth, async (req, res) => {

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send();
  }

  try {

    updates.forEach(update => req.user[update] = req.body[update]);

    await req.user.save();

    res.status("200").send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {

  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send('No User Found');
    // }
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;