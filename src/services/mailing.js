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

export async function sendPurchaseConfirmationEmail({ infoUser, nameUser, userCart, cartTotalAmount, cartDetails }) {
  try {
      const { email: userEmail } = infoUser;

      const emailContent = `
          Hola ${nameUser},

          Gracias por tu compra en nuestro sitio.

          Detalles de la compra:

          - Número de carrito: ${userCart}
          

          Productos comprados:
          ${cartDetails.map(detail => `
            - Producto: ${detail.title}
              Descripción: ${detail.description}
              Precio: $${detail.price}
              Cantidad: ${detail.quantity}`).join('\n')}


             - Total de la compra: $${cartTotalAmount}
          ¡Gracias por elegirnos!
      `;

      const mailOptions = {
          from: CONFIG.MAILING_USER,
          to: userEmail,
          subject: 'Confirmación de compra',
          text: emailContent,
      };

      await transporter.sendMail(mailOptions);

  } catch (error) {
  
  }
}


export function sendDeletionProducts(userEmail, owner, product) {
  const { first_name, last_name } = owner;
  
  const { title, description, price, code, category, thumbnail, quantity } = product;

  const mailOptions = {
    from: CONFIG.MAILING_USER,
    to: userEmail,
    subject: 'Notificación de eliminación de producto',
    text: `Hola ${first_name} ${last_name},\n\nTu producto ha sido eliminado:\n\nDetalles de tu producto:\n\nTítulo: ${title}\nDescripción: ${description}\nPrecio: ${price}\nCódigo: ${code}\nCategoría: ${category}\nThumbnail: ${thumbnail}\nCantidad: ${quantity}\n\nSaludos,\nEl equipo de soporte`,
  };

  return transporter.sendMail(mailOptions);
}





