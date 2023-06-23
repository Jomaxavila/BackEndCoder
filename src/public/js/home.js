console.log("home está cargado");

const deleteProductForm = document.getElementById('deleteProductForm');

deleteProductForm.addEventListener('submit', event => {
  event.preventDefault();

  const productId = document.getElementById('Delete').value;
  deleteProduct(productId);
});

function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        console.log("Producto eliminado");
        window.location.reload(); // Recargar la página
      } else {
        throw new Error("Error al eliminar el producto");
      }
    })
    .catch((err) => console.log(err));
}
