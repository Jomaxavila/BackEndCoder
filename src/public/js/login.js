// login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form'); // Reemplaza con el ID de tu formulario

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const data = new FormData(form);
    const loginPayload = Object.fromEntries(data);

    try {
      const response = await fetch('/api/session/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      console.log('Fetch response:', response);

      if (response.status === 200) {
        // ... Código de éxito aquí ...
      } else if (response.status === 401) {
        // ... Código de credenciales incorrectas aquí ...
      } else {
        // ... Código de otros errores aquí ...
      }
    } catch (error) {
      console.error('Error en la solicitud al servidor:', error);

      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error en la solicitud al servidor. Inténtalo de nuevo más tarde.',
        icon: 'error',
        position: 'center',
        timer: 3000,
      });
    }
  });

  const forgotPasswordButton = document.getElementById('forgotPasswordButton');

  forgotPasswordButton?.addEventListener('click', async (event) => {
    event.preventDefault();

    // Usa una promesa para esperar a que el usuario ingrese su correo electrónico
    const userEmail = await new Promise((resolve) => {
      Swal.fire({
        title: 'Restablecer contraseña',
        input: 'jomaxavila@gmail.com',
        inputLabel: 'Ingresa tu dirección de correo electrónico',
        inputPlaceholder: 'Correo electrónico',
        showCancelButton: true,
        confirmButtonText: 'Enviar correo',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Por favor, ingresa tu dirección de correo electrónico';
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value); // Resuelve la promesa con el valor ingresado por el usuario
        }
      });
    });

    // Verifica si el usuario hizo clic en "Enviar correo"
    if (userEmail) {
      try {
        console.log('Enviando solicitud al servidor para restablecer la contraseña...');
        const response = await fetch('/api/send-reset-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });

        console.log('Fetch response for reset email:', response);

        if (response.ok) {
          Swal.fire({
            title: 'Correo Enviado',
            text: 'Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña.',
            icon: 'success',
            position: 'center',
            timer: 3000,
          });
        } else {
          console.error('Error al enviar el correo electrónico');
          Swal.fire({
            title: 'Error',
            text: 'Se produjo un error al enviar el correo electrónico. Por favor, inténtelo nuevamente.',
            icon: 'error',
            position: 'center',
            timer: 3000,
          });
        }
      } catch (error) {
        console.error('Error al enviar la solicitud al servidor:', error);
        Swal.fire({
          title: 'Error',
          text: 'Se produjo un error al enviar la solicitud al servidor. Por favor, inténtelo nuevamente.',
          icon: 'error',
          position: 'center',
          timer: 3000,
        });
      }
    }
  });
});
