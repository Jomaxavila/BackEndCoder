

document.addEventListener('DOMContentLoaded', () => {
	const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
  
	addToCartButtons.forEach((button) => {
	  button.addEventListener('click', async (event) => {
		event.preventDefault();
		
		// Obtén el productId desde el atributo "data-product-id" del botón
		const productId = button.dataset.productId;
  
		try {
		  const response = await fetch(`/api/cart/addProductInCart/${productId}`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
		  });
  
		  if (response.status === 200) {
			// Producto agregado exitosamente al carrito
			Swal.fire({
			  title: 'Producto agregado al carrito',
			  text: 'El producto se ha añadido al carrito exitosamente.',
			  icon: 'success',
			  position: 'center',
			  timer: 3000,
			});
		  } else {
			// Maneja errores aquí
			console.error('Error al agregar producto al carrito:', response.status, response.statusText);
			Swal.fire({
			  title: 'Error',
			  text: 'No se pudo agregar el producto al carrito. Inténtalo de nuevo.',
			  icon: 'error',
			  position: 'center',
			  timer: 3000,
			});
		  }
		} catch (error) {
		  // Maneja errores de red o solicitud
		  console.error('Error al agregar producto al carrito:', error);
		  Swal.fire({
			title: 'Error',
			text: 'Se produjo un error al intentar agregar el producto al carrito. Inténtalo de nuevo más tarde.',
			icon: 'error',
			position: 'center',
			timer: 3000,
		  });
		}
	  });
	});
  });
  