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
                // Siempre ejecuta este bloque si la respuesta es exitosa

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
                // Si la respuesta no es exitosa, muestra el mensaje de error
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


// cart.js

// Función para actualizar la cantidad del producto
function updateQuantity(productId, newQuantity) {
    // Validar que la cantidad esté entre 1 y 5
    if (newQuantity >= 1 && newQuantity <= 5) {
      // Implementa lógica para actualizar la cantidad del producto con el ID proporcionado
      // Puedes hacer una solicitud AJAX a tu servidor para manejar la actualización
      console.log(`Actualizar cantidad del producto con ID ${productId} a ${newQuantity}`);
    } else {
      // Muestra un mensaje de error o realiza alguna acción para indicar que la cantidad es inválida
      console.log('La cantidad debe estar entre 1 y 5');
    }
  }
  
  // Función para eliminar un producto
  function removeProduct(productId) {
    // Implementa lógica para eliminar el producto con el ID proporcionado
    // Puedes hacer una solicitud AJAX a tu servidor para manejar la eliminación
    console.log(`Eliminar producto con ID: ${productId}`);
  }
  