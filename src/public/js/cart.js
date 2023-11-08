const removeButtons = document.querySelectorAll("#removeProductCartButton");

removeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const cid = button.dataset.cid;
        const pid = button.dataset.productid;

        fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            Toastify({
                text: 'Producto eliminado del carrito',
                duration: 3000,
                destination: 'right',
                gravity: "bottom",
                close: true,
            }).showToast();
            // Puedes recargar la página o actualizar la lista de productos en el carrito aquí
        })
        .catch((error) => {
            console.error("Fetch catch, Error al eliminar del carrito:", error);
        });
    });
});
