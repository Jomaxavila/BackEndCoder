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
        if (responseData.payload.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/products'; 
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

const restorePasswordButton = document.getElementById('restorePasswordButton');

restorePasswordButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/session/sendPasswordResetEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: document.getElementById('email').value }), // Obtén el email del input
    });

    if (response.status === 200) {
      Swal.fire({
        title: 'Correo enviado',
        text: 'Se ha enviado un correo electrónico con un enlace para restablecer la contraseña.',
        icon: 'success',
        position: 'center',
        timer: 3000,
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al enviar el correo electrónico. Inténtalo de nuevo.',
        icon: 'error',
        position: 'center',
        timer: 3000,
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
      timer: 3000,
    });
  }
});
