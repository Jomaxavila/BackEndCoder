
const socket = io();

socket.on('connect', () => {
  console.log('Bienvenido ! Conectado al servidor de sockets');
});

const createProductForm = document.getElementById('createProductForm');

createProductForm.addEventListener('submit', event => {
  event.preventDefault();

let title = document.getElementById('title')
let description = document.getElementById('description')
let code = document.getElementById('code')
let price = document.getElementById('price')
let status = document.getElementById('status')
let stock = document.getElementById('stock')

const product = {
  title: title.value,
  description: description.value,
  code: code.value,
  price: price.value,
  status: status.value,
  stock: stock.value
};

socket.emit('createProduct', product);

});
const deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", event => {
  event.preventDefault();

  const productId = document.getElementById("deleteProductBtn").value;
  socket.emit("deleteProduct", productId);
});

socket.on("productDeleted", productId => {
  console.log("Producto eliminado:", productId);
});


