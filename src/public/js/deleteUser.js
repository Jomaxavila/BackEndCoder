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
        const userId = button.dataset.userId;
        const newRole = button.dataset.newRole;

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
                console.log('Rol de usuario cambiado con éxito');
                // Puedes agregar lógica adicional si es necesario
            } else {
                console.log('Error al cambiar el rol del usuario');
                // Puedes manejar el error de acuerdo a tus necesidades
            }
        } catch (error) {
            console.error('Hubo un problema con la operación fetch: ' + error.message);
            // Puedes manejar el error de acuerdo a tus necesidades
        }
    });
});
