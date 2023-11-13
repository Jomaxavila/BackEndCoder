form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const loginPayload = Object.fromEntries(data);

  try {
    const response = await fetch('/api/session/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginPayload)  
    });

    if (response.status === 200) {
      const responseData = await response.json();

      Swal.fire({
        title: '¡Bienvenido!',
        text: `¡Bienvenido, ${responseData.payload.name}! ${responseData.message}`,
        icon: 'success',
        position: 'center',
        timer: 3000
      });
      setTimeout(() => {
        if (responseData.payload.role === 'usuario' || responseData.payload.role === 'premium') {
          window.location.href = '/products';
        } else {
          window.location.href = '/getviews'; 
        }
      }, 3000);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Credenciales incorrectas. Inténtalo de nuevo.',
        icon: 'error',
        position: 'center',
        timer: 3000
      });
    }
  } catch (error) {
    console.error('Error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    
    Swal.fire({
      title: 'Error',
      text: 'Ha ocurrido un error. Inténtalo de nuevo más tarde.',
      icon: 'error',
      position: 'center',
      timer: 3000
    });
  }
});


const forgotPasswordButton = document.getElementById('sendEmail');

forgotPasswordButton?.addEventListener('click', async (event) => {
  event.preventDefault();

  const userEmail = await new Promise((resolve) => {
    Swal.fire({
      title: 'Restablecer contraseña',
      input: 'email',
      inputLabel: 'Ingresa tu dirección de correo electrónico',
      inputPlaceholder: 'jomaxavila@gmail.com',
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
        resolve(result.value);
      }
    });
  });

  if (userEmail) {
    console.log(userEmail)
    try {
      console.log('Enviando solicitud al servidor para restablecer la contraseña...');
      const response = await fetch('/api/sendEmail', { 
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
          text: 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.',
          icon: 'success',
          position: 'center',
          timer: 3000,
        });
      } else {
        console.error('Error en la respuesta del servidor:', response.status);
        Swal.fire({
          title: 'Error',
          text: 'Se produjo un error en la respuesta del servidor. Por favor, inténtalo nuevamente.',
          icon: 'error',
          position: 'center',
          timer: 3000,
        });
      }
    } catch (error) {
      console.error('Error al enviar la solicitud al servidor:', error);
      Swal.fire({
        title: 'Error',
        text: 'Se produjo un error al enviar la solicitud al servidor. Por favor, inténtalo nuevamente.',
        icon: 'error',
        position: 'center',
        timer: 3000,
      });
    }
  }
});