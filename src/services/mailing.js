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

export async function sendPurchaseConfirmationEmail({ infoUser, nameUser, userCart, cartTotalAmount, cartTotalWithoutStock, productsNotPurchased, cartDetails }) {
  try {
      const { email: userEmail } = infoUser;

      const emailContent = `
          Hola ${nameUser},

          Gracias por tu compra en nuestro sitio.

          Detalles de la compra:
          - Número de carrito: ${userCart}
          - Total de la compra (con stock): $${cartTotalAmount}
          - Total de la compra (sin stock): $${cartTotalWithoutStock}

          Productos no comprados debido a stock insuficiente:
          ${productsNotPurchased.map(productId => `- Producto con ID ${productId}`).join('\n')}

          Detalles de los productos comprados:
          ${cartDetails.map(detail => `
            - Producto: ${detail.title}
              Descripción: ${detail.description}
              Precio: $${detail.price}
              Cantidad: ${detail.quantity}`).join('\n')}

          ¡Gracias por elegirnos!
      `;

      const mailOptions = {
          from: CONFIG.MAILING_USER,
          to: userEmail,
          subject: 'Confirmación de compra',
          text: emailContent,
      };

      await transporter.sendMail(mailOptions);

      console.log('Correo electrónico de confirmación de compra enviado con éxito.');
  } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      // Puedes manejar el error de envío de correo electrónico según sea necesario
  }
}
