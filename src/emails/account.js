// jshint esversion: 9
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "devdafe@gmail.com",
    subject: `${name}, Thanks for signing up`,
    text: `Welcome to the app ${name}. Let me know how you get along with the app.`
  });
};

const sendDeleteEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "devdafe@gmail.com",
    subject: `${name}, We are Sad to let you go!`,
    text: `Hey, ${name}. It really saddens us to see you leave our service. Is there anything about our service that you dont like? Let us know how we can improve. You call alway check back`
  });
};
module.exports = {
  sendWelcomeEmail,
  sendDeleteEmail
};
