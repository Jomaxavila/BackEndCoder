import { faker } from '@faker-js/faker';

export const generateProduct = () => {
  const totalProducts = faker.number.int({ min: 10, max: 100 });
  const products = [];

  for (let i = 0; i < totalProducts; i++) {
    const product = {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      stock: faker.number.int({ min: 10, max: 100 }),
      image: faker.image.avatarGitHub(),
      description: faker.commerce.productDescription(),
    };
    products.push(product);
  }

  return products;
};
