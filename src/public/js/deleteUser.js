document.querySelectorAll('.btn-eliminar-usuario').forEach(button => {
    button.addEventListener('click', async () => {
        var email = button.getAttribute('data-email');

        try {
            const response = await fetch('/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            if (response.ok) {
                console.log('Usuario eliminado');
                window.location.href = window.location.href;
            } else {
                console.log('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Hubo un problema con la operación fetch: ' + error.message);
        }
    });
});


const changeButton = document.querySelectorAll("#changeRole");

changeButton.forEach(button => {
    button.addEventListener("click", async () => {
        const form = button.closest('form');
        const userId = form.querySelector('[name="userId"]').value;
        const newRole = form.querySelector('[name="newRole"]').value;

        try {
            const response = await fetch(`http://localhost:8080/api/users/changeRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    newRole: newRole
                }),
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Rol de usuario cambiado con éxito',
                    icon: 'success',
                    timer: 3000,
                    position: 'center',
                }).then(() => {
                    location.reload();
                    window.location.href = 'getviews';
                });
            } else {
                Swal.fire({
                    title: 'Error al cambiar el rol del usuario',
                    text: 'Hubo un problema al realizar la operación',
                    icon: 'error',
                    timer: 3000,
                    position: 'center',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema con la operación fetch: ' + error.message,
                icon: 'error',
                timer: 3000,
                position: 'center',
            });
        }
    });
});

