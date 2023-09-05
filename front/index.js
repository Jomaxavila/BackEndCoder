fetch('http://localhost:8080/api/orders')
  .then(response => response.json())
  .then(orders => {
    const fragment = document.createDocumentFragment();

    orders.forEach(order => {
      const div = document.createElement('div');
      const priceParagraph = document.createElement('p');
      const statusParagraph = document.createElement('p');
      const numberParagraph = document.createElement('p');

      priceParagraph.textContent = `Total: ${order.total_price}`;
      statusParagraph.textContent = `Estatus: ${order.status}`;
      numberParagraph.textContent = `Número de orden: ${order.order_number}`;

      div.appendChild(numberParagraph);
      div.appendChild(priceParagraph);
      div.appendChild(statusParagraph);

      fragment.appendChild(div);
    });

    const ordersContainer = document.getElementById('orders'); // Reemplaza 'orders' con el ID correcto de tu contenedor
    ordersContainer.appendChild(fragment);
  })
  .catch(error => {
    console.error('Error al obtener los datos', error);
  });
