console.log("home está cargado");

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

document.getElementById("deleteProductForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const productId = document.getElementById("Delete").value;
  deleteProduct(productId);
});
