const form = document.getElementById('registerForm')

form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {}
  data.forEach((value, key) => obj[key] = value);

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
      console.log("Usuario registrado exitosamente");
    } else {
      const data = await response.json();
      console.log("Error al registrar usuario:", data.error || "Ocurrió un error al registrar al usuario. Por favor, intenta de nuevo más tarde.");
    }
  } catch (error) {
    console.error('Error al realizar el registro:', error);
    console.log("Ocurrió un error al registrar al usuario. Por favor, intenta de nuevo más tarde.");
  }
});
