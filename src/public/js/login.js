const form = document.getElementById('loginForm');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch('/api/sessions/login', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
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
        window.location.replace('/products');
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
    Swal.fire({
      title: 'Error',
      text: 'Ha ocurrido un error. Inténtalo de nuevo más tarde.',
      icon: 'error',
      position: 'center',
      timer: 3000
    });
  }
});