
const deleteProductForm = document.getElementById('deleteProductForm');

deleteProductForm.addEventListener('submit', event => {
  event.preventDefault();

  const productId = document.getElementById('Delete').value;

  deleteProductForm(productId);
});

