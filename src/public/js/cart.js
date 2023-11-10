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

            const data = await response.json();

            if (response.ok) {
                if (data.productsNotPurchased.length > 0) {
                    // Al menos un producto se pudo comprar
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
                } else {
                    // Ningún producto se pudo comprar
                    Swal.fire({
                        title: 'Error',
                        text: 'No hay productos con suficiente stock para completar la compra.',
                        icon: 'error',
                        timer: 3000,
                        position: 'center',
                    });
                }
            } else {
                // La compra falló por otro motivo
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al comprar el carrito. Inténtalo de nuevo más tarde.',
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
