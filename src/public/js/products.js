const addButton = document.querySelectorAll("#addToCart");

addButton.forEach(button => {
    button.addEventListener("click", () => {
        const cid = button.dataset.cid;
        const pid = button.dataset.productid;

        fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            Toastify({
                text: 'Producto agregado al carrito',
                duration: 3000,
                destination: 'right',
                gravity: "bottom",
                close: true,
            }).showToast();
        })
        .catch((error) => {
            console.error("Fetch catch, Error al agregar al carrito:", error);
        });
    });
});
