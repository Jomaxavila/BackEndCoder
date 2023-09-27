const form = document.getElementById('restartPasswordForm');
const restartPasswordButton = document.getElementById('restartPasswordButton');

restartPasswordButton.addEventListener('click', async () => {
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch('/api/session/restartPassword', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const responseData = await response.json();

      Swal.fire({
        title: 'Contraseña restaurada',
        text: responseData.message,
        icon: 'success',
        position: 'center',
        timer: 3000,
      }).then(() => {
        window.location.href = '/login';
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al restaurar la contraseña. Inténtalo de nuevo.',
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
