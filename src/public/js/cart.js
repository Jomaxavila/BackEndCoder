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

            console.log("Data received from the server:", data);
            console.log("Products not purchased:", data.productsNotPurchased);

            if (response.ok) {

                Swal.fire({
                    title: 'Compra Exitosa, revisa tu correo para más detalles',
                    text: data.message,
                    icon: 'success',
                    timer: 3000,
                    position: 'center',
                }).then(() => {
                    location.reload();
                    window.location.href = 'products'; 
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'Ha ocurrido un error al comprar el carrito. Inténtalo de nuevo más tarde.',
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



const deleteProducts = document.querySelectorAll(".deleteProd");

deleteProducts.forEach(button => {
    button.addEventListener("click", async () => {
        const cid = button.dataset.cid;
        const pid = button.dataset.productid;

        try {
            const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            console.log("Data received from the server:", data);
            console.log("Products not purchased:", data.productsNotPurchased);

            if (data.code === 202) {
                Toastify({
                    text: 'Producto eliminado del carrito',
                    duration: 3000,
                    destination: 'right',
                    gravity: "bottom",
                    close: true,
                }).showToast();

                location.reload();
            } else {
                console.error('Error al eliminar el producto del carrito:', data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });
});
