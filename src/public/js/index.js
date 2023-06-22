// Escuchar eventos de clic en los botones de eliminación
const deleteProductButtons = document.getElementsByClassName('deleteProductBtn');
Array.from(deleteProductButtons).forEach(button => {
  button.addEventListener('click', event => {
    const productId = event.target.dataset.productId;
    deleteProduct(productId);
  });
});

// Función para enviar la solicitud de eliminación de producto al servidor
function deleteProduct(productId) {
  fetch(`/api/products/${productId}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      console.log('Producto eliminado:', productId);
      // Realiza las acciones necesarias para actualizar la lista de productos
    } else {
      console.log('Error al eliminar el producto');
    }
  })
  .catch(error => {
    console.error('Error al eliminar el producto:', error);
  });
}
