const purchaseButtons = document.querySelectorAll(".add-to-cart-button");

purchaseButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const cid = button.dataset.cid;

        try {
            const response = await fetch(`/api/carts/${cid}/purchase`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
              
                if (data.error) {
                    // Muestra una alerta de error en caso de falta de stock
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo completar la compra debido a la falta de stock.',
                        icon: 'error',
                        timer: 3000,
                        position: 'center',
                    });
                } else {
                    Swal.fire({
                        title: 'Compra Exitosa, revisa tu correo para más detalles',
                        text: data.message, 
                        icon: 'success',
                        timer: 3000,
                        position: 'center',
                    }).then(() => {
                        // Redirige o realiza alguna acción adicional
                        location.reload(); 
                        window.location.href = 'products'; // Recarga la página
                    });
                }
            } else {
        
                Swal.fire({
                    title: 'Error',
                    text: 'Sin stock temportalmente. Inténtalo de nuevo más tarde.',
                    icon: 'error',
                    timer: 3000,
                    position: 'center',
                });
            }
        } catch (error) {
            console.error("Error al comprar el carrito:", error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al comprar el carrito. Inténtalo de nuevo más tarde.',
                icon: 'error',
                timer: 3000,
                position: 'center',
            });
        }
    });
});
