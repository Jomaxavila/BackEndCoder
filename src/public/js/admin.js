

const createProductForm = document.getElementById('createProductForm');

createProductForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = createProductForm.elements.title.value;
  const description = createProductForm.elements.description.value;
  const code = createProductForm.elements.code.value;
  const price = createProductForm.elements.price.value;
  const category = createProductForm.elements.category.value;
  const quantity = createProductForm.elements.quantity.value;
  const thumbnail = createProductForm.elements.thumbnail.value;

  const product = {
    title,
    description,
    code,
    price,
    category,
    quantity,
    thumbnail,
  };

  try {
    const response = await fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); 
      createProductForm.reset(); 
    } else {
      console.error('Error al enviar la solicitud:', response.statusText);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
  }
});