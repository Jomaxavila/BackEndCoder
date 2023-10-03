import mailer from "nodemailer";
import CONFIG from "../config/config.js";

export default class MailingService {
  
  constructor() {
    this.client = mailer.createTransport({
      service: CONFIG.MAILING_SERVICE,
      port: 587,
      auth: {
        user: CONFIG.MAILING_USER,
        pass: CONFIG.MAILING_PASSWORD,
      },
    });
  }

  sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
    try {
      const result = await this.client.sendMail({
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
