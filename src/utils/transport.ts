import nodemailer from "nodemailer"
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const pw = process.env.MAIL_TRAP_PW ?? ''
const user = process.env.MAIL_TRAP_USER ?? ''

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: user,
        pass: pw
    }
})

export default transport