import nodemailer from "nodemailer";
import config from "../../../config";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.reset_pass.email,
    pass: config.reset_pass.email_password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const emailSender = async (email: string, html: any) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Health Care" <${config.reset_pass.email}>`, // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Reset Password Link", // Subject line
    text: "Hello world?", // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
export default emailSender;
