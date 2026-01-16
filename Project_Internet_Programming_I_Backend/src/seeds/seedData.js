const { User, Product, Order, Promotion } = require('../models');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    // Clear existing data
    // await User.destroy({ where: {} });
    // await Product.destroy({ where: {} });
    // await Order.destroy({ where: {} });
    // await Promotion.destroy({ where: {} });

    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password123', 10);
    const hashedPassword3 = await bcrypt.hash('admin123', 10);

    // Seed Users
    await User.bulkCreate([
      {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
        password: hashedPassword1,
        role: 'user'
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: hashedPassword2,
        role: 'user'
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        password: hashedPassword3,
        role: 'admin'
      }
    ]);

    // Seed Products
    const products = await Product.bulkCreate([
      // Discount Products
      { name: 'Working dress', category: 'Dresses', price: 15.00, oldPrice: 30.00, image: '/image/popupar 37.png', color: 'Mixed', size: 'M', stock: 10, isActive: true },
      { name: 'T-shirt Coffee', category: 'Shirts', price: 10.00, oldPrice: 20.00, image: '/image/popupar 37.png', color: 'Brown', size: 'S', stock: 20, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/popupar 37.png', color: 'Blue', size: 'M', stock: 15, isActive: true },
      { name: 'Black Jeans', category: 'Bottoms', price: 20.00, oldPrice: 22.00, image: '/image/popupar 37.png', color: 'Black', size: 'M', stock: 25, isActive: true },
      { name: 'Working Pants', category: 'Bottoms', price: 15.00, oldPrice: 20.00, image: '/image/popupar 37.png', color: 'Khaki', size: 'M', stock: 12, isActive: true },
      { name: 'Hoodie', category: 'Jackets', price: 15.00, oldPrice: 20.00, image: '/image/popupar 37.png', color: 'Gray', size: 'L', stock: 18, isActive: true },
      { name: 'Brown Coat', category: 'Jackets', price: 25.00, oldPrice: 40.00, image: '/image/popupar 37.png', color: 'Brown', size: 'L', stock: 8, isActive: true },
      { name: 'Skirt Flower', category: 'Skirts', price: 15.00, oldPrice: 25.00, image: '/image/popupar 37.png', color: 'Multicolor', size: 'S', stock: 14, isActive: true },

      // Dresses
      { name: 'Working dress', category: 'Dresses', price: 15.00, oldPrice: 30.00, image: '/image/popupar 23.png', color: 'Black', size: 'M', stock: 10, isActive: true },
      { name: 'Cheries T-Shirt', category: 'Shirts', price: 14.00, oldPrice: 20.00, image: '/image/popupar 25.png', color: 'Red', size: 'S', stock: 16, isActive: true },
      { name: 'Woman Short', category: 'Bottoms', price: 10.00, oldPrice: 15.00, image: '/image/popupar 27.png', color: 'White', size: 'XS', stock: 22, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/popupar 29.png', color: 'Pink', size: 'M', stock: 13, isActive: true },
      { name: 'Red Floral Dress', category: 'Dresses', price: 20.00, oldPrice: 35.00, image: '/image/popupar 31.png', color: 'Red', size: 'M', stock: 9, isActive: true },
      { name: 'Beige Dress', category: 'Dresses', price: 15.00, oldPrice: 20.00, image: '/image/popupar 33.png', color: 'Beige', size: 'L', stock: 11, isActive: true },
      { name: 'Brown Coat', category: 'Jackets', price: 25.00, oldPrice: 40.00, image: '/image/popupar 64.png', color: 'Brown', size: 'L', stock: 7, isActive: true },
      { name: 'Working Pants', category: 'Bottoms', price: 15.00, oldPrice: 20.00, image: '/image/popupar 35.png', color: 'Black', size: 'M', stock: 14, isActive: true },

      // T-Shirts
      { name: 'Working dress', category: 'Dresses', price: 15.00, oldPrice: 30.00, image: '/image/popupar 95.png', color: 'Navy', size: 'M', stock: 10, isActive: true },
      { name: 'Cherries T-Shirt', category: 'Shirts', price: 14.00, oldPrice: 20.00, image: '/image/popupar 39.png', color: 'Red', size: 'M', stock: 18, isActive: true },
      { name: 'Woman Short', category: 'Bottoms', price: 10.00, oldPrice: 18.00, image: '/image/tShirt6 1.png', color: 'Blue', size: 'XS', stock: 20, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/tShirt11 3.png', color: 'Yellow', size: 'M', stock: 12, isActive: true },
      { name: 'Black Jeans', category: 'Bottoms', price: 20.00, oldPrice: 25.00, image: '/image/popupar 45.png', color: 'Black', size: 'M', stock: 24, isActive: true },
      { name: 'Working Pants', category: 'Bottoms', price: 15.00, oldPrice: 25.00, image: '/image/tShirt11 2.png', color: 'Olive', size: 'L', stock: 13, isActive: true },
      { name: 'Black Jeans', category: 'Bottoms', price: 20.00, oldPrice: 22.00, image: '/image/popupar 65.png', color: 'Black', size: 'M', stock: 26, isActive: true },
      { name: 'Hoodie', category: 'Jackets', price: 15.00, oldPrice: 20.00, image: '/image/popupar 66.png', color: 'Gray', size: 'L', stock: 17, isActive: true },

      // Jackets
      { name: 'Working dress', category: 'Dresses', price: 30.00, oldPrice: 30.00, image: '/image/popupar 51.png', color: 'Maroon', size: 'M', stock: 8, isActive: true },
      { name: 'Cherries T-Shirt', category: 'Shirts', price: 14.00, oldPrice: 20.00, image: '/image/popupar 53.png', color: 'Pink', size: 'S', stock: 19, isActive: true },
      { name: 'Woman Short', category: 'Bottoms', price: 10.00, oldPrice: 18.00, image: '/image/popupar 55.png', color: 'Denim', size: 'XS', stock: 21, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/popupar 57.png', color: 'Green', size: 'M', stock: 11, isActive: true },
      { name: 'Black Jeans', category: 'Bottoms', price: 20.00, oldPrice: 22.00, image: '/image/popupar 59.png', color: 'Black', size: 'L', stock: 23, isActive: true },
      { name: 'Hoodie', category: 'Jackets', price: 15.00, oldPrice: 20.00, image: '/image/popupar 61.png', color: 'Navy', size: 'M', stock: 16, isActive: true },
      { name: 'Brown Coat', category: 'Jackets', price: 25.00, oldPrice: 30.00, image: '/image/popupar 63.png', color: 'Brown', size: 'L', stock: 9, isActive: true },
      { name: 'Working Pants', category: 'Bottoms', price: 15.00, oldPrice: 20.00, image: '/image/hoodie7 1.png', color: 'Tan', size: 'M', stock: 15, isActive: true },

      // Crop Top
      { name: 'Working dress', category: 'CropTop', price: 30.00, oldPrice: 30.00, image: '/image/popupar 67.png', color: 'White', size: 'XS', stock: 8, isActive: true },
      { name: 'Cherries T-Shirt', category: 'CropTop', price: 14.00, oldPrice: 20.00, image: '/image/popupar 68.png', color: 'Black', size: 'XS', stock: 20, isActive: true },
      { name: 'Woman Short', category: 'Bottoms', price: 10.00, oldPrice: 18.00, image: '/image/popupar 69.png', color: 'Purple', size: 'XS', stock: 19, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/popupar 70.png', color: 'Orange', size: 'S', stock: 14, isActive: true },
      { name: 'Black Jeans', category: 'Bottoms', price: 20.00, oldPrice: 22.00, image: '/image/popupar 71.png', color: 'Black', size: 'M', stock: 25, isActive: true },
      { name: 'Hoodie', category: 'Jackets', price: 15.00, oldPrice: 20.00, image: '/image/popupar 72.png', color: 'Cream', size: 'S', stock: 18, isActive: true },
      { name: 'Brown Coat', category: 'Jackets', price: 25.00, oldPrice: 30.00, image: '/image/hoodie7 2.png', color: 'Brown', size: 'M', stock: 10, isActive: true },
      { name: 'Working Pants', category: 'Bottoms', price: 15.00, oldPrice: 20.00, image: '/image/popupar 73.png', color: 'Gray', size: 'M', stock: 13, isActive: true },

      // Shorts
      { name: 'Working dress', category: 'Shorts', price: 30.00, oldPrice: 30.00, image: '/image/popupar 81.png', color: 'Denim', size: 'S', stock: 9, isActive: true },
      { name: 'Cherries T-Shirt', category: 'Shorts', price: 14.00, oldPrice: 20.00, image: '/image/popupar 82.png', color: 'Red', size: 'M', stock: 21, isActive: true },
      { name: 'Woman Short', category: 'Shorts', price: 10.00, oldPrice: 18.00, image: '/image/popupar 83.png', color: 'Black', size: 'XS', stock: 18, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/popupar 84.png', color: 'White', size: 'S', stock: 13, isActive: true },
      { name: 'Black Jeans', category: 'Bottoms', price: 20.00, oldPrice: 22.00, image: '/image/popupar 85.png', color: 'Black', size: 'M', stock: 22, isActive: true },
      { name: 'Hoodie', category: 'Jackets', price: 15.00, oldPrice: 20.00, image: '/image/popupar 86.png', color: 'Blue', size: 'L', stock: 15, isActive: true },
      { name: 'Brown Coat', category: 'Jackets', price: 25.00, oldPrice: 30.00, image: '/image/popupar 87.png', color: 'Tan', size: 'L', stock: 8, isActive: true },
      { name: 'Working Pants', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/hoodie7 4.png', color: 'Olive', size: 'M', stock: 12, isActive: true },

      // Skirts
      { name: 'Working dress', category: 'Skirts', price: 30.00, oldPrice: 30.00, image: '/image/popupar 88.png', color: 'Black', size: 'S', stock: 7, isActive: true },
      { name: 'Cherries T-Shirt', category: 'Skirts', price: 14.00, oldPrice: 20.00, image: '/image/popupar 89.png', color: 'Red', size: 'M', stock: 17, isActive: true },
      { name: 'Woman Short', category: 'Skirts', price: 10.00, oldPrice: 18.00, image: '/image/popupar 90.png', color: 'White', size: 'XS', stock: 16, isActive: true },
      { name: 'Summer dress', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/popupar 91.png', color: 'Floral', size: 'M', stock: 10, isActive: true },
      { name: 'Black Jeans', category: 'Skirts', price: 20.00, oldPrice: 22.00, image: '/image/popupar 92.png', color: 'Black', size: 'M', stock: 20, isActive: true },
      { name: 'Hoodie', category: 'Jackets', price: 15.00, oldPrice: 20.00, image: '/image/popupar 93.png', color: 'Purple', size: 'S', stock: 14, isActive: true },
      { name: 'Brown Coat', category: 'Skirts', price: 25.00, oldPrice: 30.00, image: '/image/popupar 94.png', color: 'Brown', size: 'M', stock: 6, isActive: true },
      { name: 'Working Pants', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/popupar 95.png', color: 'Navy', size: 'M', stock: 11, isActive: true }
    ]);

    // Seed Orders with user and product relationships
  await Order.bulkCreate([
  {
    orderNumber: "001",
    userId: 1,
    productId: products[0].id,
    quantity: 1,
    date: "2025-01-10",
    total: 49.99,
    status: "Completed",
    paymentMethod: "Credit Card",
    paymentProof: "/uploads/payment1.jpg",
    deliveryAddress: "123 Main St, Cityville"
  },
  {
    orderNumber: "002",
    userId: 2,
    productId: products[1].id,
    quantity: 1,
    date: "2025-01-12",
    total: 129.99,
    status: "Pending",
    paymentMethod: "Bank Transfer",
    paymentProof: "/uploads/payment2.jpg",
    deliveryAddress: "456 Market Ave, Townsville"
  },
  {
    orderNumber: "003",
    userId: 1,
    productId: products[2].id,
    quantity: 2,
    date: "2025-01-14",
    total: 39.98,
    status: "Completed",
    paymentMethod: "PayPal",
    paymentProof: "/uploads/payment3.jpg",
    deliveryAddress: "789 Broadway, Cityville"
  }
]);



    // order
    // await Order.create({
    //     orderNumber: "001",
    //     userId: 1,
    //     productId: 1,
    //     quantity: 1,
    //     location: "123 Main St, Cityville",
    //     total: 49.99,
    //     status: "Completed",
    //     paymentMethod: "Credit Card",
    //     paymentProof: "/uploads/payment1.jpg"
    // });



    // Seed Promotions
    await Promotion.bulkCreate([
      {
        code: 'SALE20',
        discount: 20,
        expiry: '2025-02-01',
        active: true
      },
      {
        code: 'SAVE10',
        discount: 10,
        expiry: '2025-01-31',
        active: true
      },
      {
        code: 'EXPIRED15',
        discount: 15,
        expiry: '2025-01-10',
        active: false
      }
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedData;
