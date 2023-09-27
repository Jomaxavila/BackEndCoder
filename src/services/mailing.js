import mailer from "nodemailer";
import config from "../config/config.js";

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: config.MAILING_SERVICE,
      port: 587,
      auth: {
        user: config.MAILING_USER,
        pass: config.MAILING_PASSWORD,
      },
    });
  }

  sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
    let result;
    try {
      result = await this.client.sendMail({
        from,
        to,
        subject, 
        html,
        attachments,
      });
      return result;
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      return false;
    }
  };
}
