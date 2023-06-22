const socket = io();

socket.on('connection', () => {
  console.log('Conectado al servidor de sockets');
});

const createProductForm = document.getElementById('createProductForm');

socket.on('productCreated', data => {
  console.log("Nuevo producto agregado a la lista");
});

createProductForm.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(createProductForm);
  const product = Object.fromEntries(formData.entries());

  socket.emit('createProduct', product);
});

const deleteProductButtons = document.getElementsByClassName('deleteProductBtn');
Array.from(deleteProductButtons).forEach(button => {
  button.addEventListener('click', event => {
    const productId = event.target.dataset.productId;
    socket.emit('deleteProduct', productId);
  });
});

socket.on('productDeleted', productId => {
  console.log('Producto eliminado:', productId);
});
