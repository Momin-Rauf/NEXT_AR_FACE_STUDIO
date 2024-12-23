
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_EMAIL_PASSWORD,
  },
});

transporter.verify(function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;