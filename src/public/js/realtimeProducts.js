
const socket = io();

socket.on('connect', () => {
  console.log('Bienvenido ! Conectado al servidor de sockets');
});

const createProductForm = document.getElementById('createProductForm');

createProductForm.addEventListener('submit', event => {
  event.preventDefault();
// const title = form.elements.title.value;
let title = createProductForm.elements.title.value;
let description =createProductForm.elements.description.value;
let code = createProductForm.elements.code.value;
let price = createProductForm.elements.price.value;
let stock =createProductForm.elements.stock.value;

const product = {
  title: title,
  description: description,
  code: code,
  price: price,
  stock: stock,
};
console.log(product)
socket.emit('createProduct', product);
createProductForm.reset();
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


