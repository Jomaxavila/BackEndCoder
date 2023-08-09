const form = document.getElementById('registerForm');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch('/api/sessions/register', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'content-type': 'application/json'
      }
    });

    if (response.ok) {
      form.reset();
      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'Usuario registrado exitosamente.',
        icon: 'success',
        position: 'center',
        timer: 3000
      }).then(() => {
        // Redirección después de cerrar el SweetAlert
        window.location.replace('/login');
      });
    } else {
      const responseData = await response.json();
      Swal.fire({
        title: 'Error',
        text: responseData.error || 'Ocurrió un error al registrar al usuario. Por favor, intenta de nuevo más tarde.',
        icon: 'error',
        position: 'center',
        timer: 3000
      });
    }
  } catch (error) {
    console.error('Error al realizar el registro:', error);
    Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al registrar al usuario. Por favor, intenta de nuevo más tarde.',
      icon: 'error',
      position: 'center',
      timer: 3000
    });
  }
});