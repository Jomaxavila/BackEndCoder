const socket = io();

socket.on('connect', () => {
  console.log('Bienvenido! Conectado al servidor de sockets');
});

const createProductForm = document.getElementById('createProductForm');

createProductForm.addEventListener('submit', event => {
  event.preventDefault();
  
  const title = createProductForm.elements.title.value;
  const description = createProductForm.elements.description.value;
  const code = createProductForm.elements.code.value;
  const price = createProductForm.elements.price.value;
  const stock = createProductForm.elements.stock.value;
  const thumbnail = createProductForm.elements.thumbnail.value;

  const product = {
    title,
    description,
    code,
    price,
    stock,
    thumbnail,
  };

  console.log(product);
  socket.emit('createProduct', product);
  createProductForm.reset();
});

socket.on('refresh-products', data => {
  console.log('refresh-products', data);
  window.location.reload();
});


function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((err) => console.log(err));
}


const deleteProductForm = document.getElementById('deleteProductForm');

deleteProductForm.addEventListener('submit', event => {
  event.preventDefault();

  const productId = document.getElementById('Delete').value;

  deleteProduct(productId);
});
