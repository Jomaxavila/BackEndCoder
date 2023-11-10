import nodemailer from 'nodemailer';
import CONFIG from '../config/config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.MAILING_USER,
    pass: CONFIG.MAILING_PASSWORD,
  },
});

export function sendDeletionEmail(userEmail, userName) {
  const mailOptions = {
    from: CONFIG.MAILING_USER,
    to: userEmail,
    subject: 'Notificación de eliminación de cuenta',
    text: `Hola ${userName},\n\nTu cuenta ha sido eliminada por inactividad.\n\nSaludos,\nEl equipo de soporte`,
  };

  return transporter.sendMail(mailOptions);
}

export function sendExpirationEmail(userEmail, userName) {
  const mailOptions = {
    from: CONFIG.MAILING_USER,
    to: userEmail,
    subject: 'Notificación de expiración de sesión',
    text: `Hola ${userName},\n\nTu sesión ha expirado. Por favor, inicia sesión de nuevo si deseas continuar utilizando el servicio.\n\nSaludos,\nEl equipo de soporte`,
  };

  return transporter.sendMail(mailOptions);
}

export function sendPurchaseConfirmationEmail({ infoUser, nameUser, userCart, cartTotalAmount }) {
  const { email: userEmail } = infoUser;  
  const mailOptions = {
    from: CONFIG.MAILING_USER,
    to: userEmail,  // Usar userEmail directamente
    subject: 'Confirmación de compra',
    text: `Hola ${nameUser},\n\nGracias por tu compra. Aquí están los detalles de tu compra:\n\n${JSON.stringify({ infoUser, nameUser, userCart, cartTotalAmount })}\n\nSaludos,\nEl equipo de soporte`,
  };
  
  return transporter.sendMail(mailOptions);
}
