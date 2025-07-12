import { MailtrapClient } from "mailtrap";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const TOKEN = process.env.MAIL_TRAP_TOKEN ?? ""

const INBOX_ID = process.env.MAIL_TRAP_INBOX_ID?? ""

const mailtrap = new MailtrapClient({
    token: TOKEN,
    testInboxId: Number.parseInt(INBOX_ID)
})


export default mailtrap