
const socket = io();

socket.on('connect', () => {
  console.log('Conectado al servidor de sockets maldicion sjnbsdn');
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

const DeleteProduct = document.getElementById("deleteProductBtn")
