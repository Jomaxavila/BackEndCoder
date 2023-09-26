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
  }})

  document.addEventListener("DOMContentLoaded", () => {
    const resetPasswordButton = document.getElementById("resetPasswordButton");

    if (resetPasswordButton) {
      resetPasswordButton.addEventListener("click", () => {
        // Aquí puedes realizar una solicitud AJAX o enviar un formulario al servidor
        // para enviar el correo de restablecimiento de contraseña.
        // Por ejemplo:
        fetch("/api/session/forgotPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "correo_del_usuario@example.com" }), // Reemplaza con el correo del usuario
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              alert("Correo de restablecimiento enviado con éxito.");
            } else {
              alert("Error al enviar el correo de restablecimiento.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }
  });