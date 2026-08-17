import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});




export const sendMail = async (to: string, subject: string, html: string) => {

  const text = html.replace(/<[^>]*>?/gm, '');
  try {
    const info = await transporter.sendMail({
      from: `"SnapCart App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
       text ,
      html,
    });
    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    throw error; 
  }
};