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
      { name: 'Working Dress Mixed', category: 'Dresses', price: 15.00, oldPrice: 30.00, image: '/image/dresses/dress1.png', color: 'Mixed', size: 'M', stock: 10, isActive: true },
      { name: 'T-shirt Coffee', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt14.jpg', color: 'Brown', size: 'S', stock: 20, isActive: true },
      { name: 'Summer Dress Blue', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/dresses/dress11.jpg', color: 'Blue', size: 'M', stock: 15, isActive: true },
      { name: 'Black Jeans Classic', category: 'Jackets_Hoodies', price: 20.00, oldPrice: 22.00, image: '/image/jackets_hoodies/jacket1.png', color: 'Black', size: 'M', stock: 25, isActive: true },
      { name: 'Working Pants Khaki', category: 'Jeans_Pants', price: 15.00, oldPrice: 20.00, image: '/image/pants_jeans/pants1.png', color: 'Khaki', size: 'M', stock: 12, isActive: true },
      { name: 'Hoodie Gray', category: 'Jackets_Hoodies', price: 10.00, oldPrice: 18.00, image: '/image/jackets_hoodies/hoodie2.png', color: 'Gray', size:'L' , stock :18 , isActive:true },
      { name : "Brown Coat Classic", category : "Jackets_Hoodies", price : 25.00, oldPrice : 40.00, image : "/image/jackets_hoodies/jacket4.png", color : "Brown", size : "L", stock : 8, isActive : true },
      { name: 'Skirt Flower Multicolor', category: 'Skirts', price: 15.00, oldPrice: 25.00, image: '/image/skirts/skirt7.png', color: 'Multicolor', size: 'S', stock: 14, isActive: true },

      // Dresses
      { name: 'Pink&Blue dressie', category: 'Dresses', price: 19.00, oldPrice: 20.00, image: '/image/dresses/dress2.png', color: 'Pink', size: 'S', stock: 16, isActive: true },
      { name: 'Summer Short White', category: 'Dresses', price: 18.00, oldPrice: 25.00, image: '/image/dresses/dress3.png', color: 'Flower', size: 'XS', stock: 22, isActive: true },
      { name: 'Summer Dress Pink', category: 'Dresses', price: 25.00, oldPrice: 30.00, image: '/image/dresses/dress4.png', color: 'White', size: 'M', stock: 13, isActive: true },
      { name: 'Green Floral Dress', category: 'Dresses', price: 20.00, oldPrice: 35.00, image: '/image/dresses/dress5.png', color: 'Green', size: 'M', stock: 9, isActive: true },
      { name: 'Beige Dress', category: 'Dresses', price: 15.00, oldPrice: 20.00, image: '/image/dresses/dress6.png', color: 'White', size: 'L', stock: 11, isActive: true },
      { name: 'Red Floral Dress', category: 'Dresses', price: 25.00, oldPrice: 40.00, image: '/image/dresses/dress7.png', color: 'Red', size: 'L', stock: 7, isActive: true },
      { name: 'Working Pants Black', category: 'Dresses', price: 15.00, oldPrice: 20.00, image: '/image/dresses/dress8.png', color: '', size: 'M', stock: 14, isActive: true },
      { name: 'Short Chill Dress', category: 'Dresses', price: 15.00, oldPrice: 20.00, image: '/image/dresses/dress9.png', color: 'Red', size: 'M', stock: 14, isActive: true },
      { name: 'Pink Summer Dress', category: 'Dresses', price: 20.00, oldPrice: 10.00, image: '/image/dresses/dress10.png', color: 'Red', size: 'M', stock: 14, isActive: true },
      { name: 'Light Blue Summer Dress', category: 'Dresses', price: 20.00, oldPrice: 10.00, image: '/image/dresses/dress11.png', color: 'Red', size: 'M', stock: 14, isActive: true },
      { name: 'Black Vintage Dress', category: 'Dresses', price: 20.00, oldPrice: 10.00, image: '/image/dresses/dress12.png', color: 'Red', size: 'M', stock: 14, isActive: true },
      { name: 'White Cutie Dress', category: 'Dresses', price: 20.00, oldPrice: 10.00, image: '/image/dresses/dress13.png', color: 'Red', size: 'M', stock: 14, isActive: true },

      // T-Shirts & Shirts
      { name: 'YellowBlack Zebra T-Shirt', category: 'T-Shirts_Shirts', price: 15.00, oldPrice: 30.00, image: '/image/shirts_tshirts/tshirt1.jpg', color: 'Navy', size: 'M', stock: 10, isActive: true },
      { name: 'Cherries T-Shirt Chic', category: 'T-Shirts_Shirts', price: 14.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt2.jpg', color: 'Red', size: 'M', stock: 18, isActive: true },
      { name: 'Gray Fruit of Spirit', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 18.00, image: '/image/shirts_tshirts/tshirt3.jpg', color: 'Blue', size: 'XS', stock: 20, isActive: true },
      { name: 'Pink Zebra T-shirt', category: 'T-Shirts_Shirts', price: 25.00, oldPrice: 30.00, image: '/image/shirts_tshirts/tshirt4.jpg', color: 'Yellow', size: 'M', stock: 12, isActive: true },
      { name: 'Blue Zebra T-shirt', category:'T-Shirts_Shirts' , price :25.00 , oldPrice :35.00 , image:'/image/shirts_tshirts/tshirt5.jpg' , color:'Black' , size:'M' , stock :24 , isActive:true },
      { name: 'White Working Shirt' , category:'T-Shirts_Shirts' , price :15.00 , oldPrice :25.00 , image:'/image/shirts_tshirts/shirt1.jpg' , color:'Olive' , size:'L' , stock :13 , isActive:true },
      { name: 'Yellow Working Shirt', category: 'T-Shirts_Shirts', price: 20.00, oldPrice: 22.00, image: '/image/shirts_tshirts/shirt2.jpg', color: 'Black', size: 'M', stock: 26, isActive: true },
      { name: 'Blue Working Shirt', category: 'T-Shirts_Shirts', price: 15.00, oldPrice: 20.00, image: '/image/shirts_tshirts/shirt3.jpg', color: 'Gray', size: 'L', stock: 17, isActive: true },
      { name: 'Short White Working Shirt', category: 'T-Shirts_Shirts', price: 25.00, oldPrice: 30.00, image: '/image/shirts_tshirts/shirt4.jpg', color: 'White', size: 'M', stock: 15, isActive: true },
      { name: 'Brown Shirt', category: 'T-Shirts_Shirts', price: 15.00, oldPrice: 20.00, image: '/image/shirts_tshirts/shirt5.jpg', color: 'Blue', size: 'M', stock: 19, isActive: true },
      { name: 'White Cute Shirt', category:'T-Shirts_Shirts' , price :10.00 , oldPrice :18.00 , image:'/image/shirts_tshirts/shirt6.jpg' , color:'Light Blue' , size:'S' , stock :22 , isActive:true },
      { name: 'Black Short Shirt', category: 'T-Shirts_Shirts', price: 20.00, oldPrice: 25.00, image: '/image/shirts_tshirts/shirt7.jpg', color: 'Denim', size: 'M', stock: 14, isActive: true },
      { name: 'Denim Shirt', category: 'T-Shirts_Shirts', price: 15.00, oldPrice: 20.00, image: '/image/shirts_tshirts/shirt8.jpg', color: 'Denim', size: 'L', stock: 16, isActive: true },
      { name: 'Pink Ribbon Shirt', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 15.00, image: '/image/shirts_tshirts/shirt9.jpg', color: 'White', size: 'S', stock: 12, isActive: true },
      { name: 'WhitePink Heart Shirt', category:'T-Shirts_Shirts' , price :20.00 , oldPrice :22.00 , image:'/image/shirts_tshirts/shirt10.jpg' , color:'Blue' , size:'M' , stock :20 , isActive:true },
      { name: 'Croptop Brown Shirt' , category:'T-Shirts_Shirts' , price :15.00 , oldPrice :20.00 , image:'/image/shirts_tshirts/shirt11.jpg' , color:'Light Blue' , size:'S' , stock :18 , isActive:true },
      { name: 'Swag White Shirt', category: 'T-Shirts_Shirts', price: 25.00, oldPrice: 30.00, image: '/image/shirts_tshirts/shirt12.jpg', color: 'Blue', size: 'M', stock: 15, isActive: true },
      { name: 'Red Pink T-shirt', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt6.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Western T-Shirt', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt7.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Black Cat White T-Shirt', category:'T-Shirts_Shirts' , price :10.00 , oldPrice :20.00 , image:'/image/shirts_tshirts/tshirt8.jpg' , color:'Blue' , size:'S' , stock :18 , isActive:true },
      { name: 'Black Cat Black T-Shirt', category:'T-Shirts_Shirts' , price :10.00 , oldPrice :20.00 , image:'/image/shirts_tshirts/tshirt9.jpg' , color:'Blue' , size:'S' , stock :18 , isActive:true },
      { name: 'Born T-Shirt', category: 'T-Shirts_Shirts', price: 15.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt10.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Long White T-Shirt', category: 'T-Shirts_Shirts', price: 17.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt11.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Home Yellow T-Shirt', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 20.00, image: '/image/shirts_tshirts/tshirt12.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Home Purple T-Shirt', category:'T-Shirts_Shirts' , price :15.00 , oldPrice :25.00 , image:'/image/shirts_tshirts/tshirt13.jpg' , color:'Purple' , size:'S' , stock :25 , isActive:true },
      { name:'Ribbon black White Shirt' , category:'T-Shirts_Shirts' , price :25.00 , oldPrice :35.00 , image:'/image/shirts_tshirts/shirt13.jpg' , color:'White' , size:'S' , stock :25 , isActive:true },
      { name: 'Working White Shirt', category: 'T-Shirts_Shirts', price: 18.00, oldPrice: 20.00, image: '/image/shirts_tshirts/shirt14.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Working Pink Shirt', category: 'T-Shirts_Shirts', price: 17.00, oldPrice: 20.00, image: '/image/shirts_tshirts/shirt15.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Brown Shirt', category: 'T-Shirts_Shirts', price: 10.00, oldPrice: 20.00, image: '/image/shirts_tshirts/shirt16.jpg', color: 'Blue', size: 'S', stock: 18, isActive: true },
      { name: 'Red Shirt', category:'T-Shirts_Shirts' , price :20.00 , oldPrice :25.00 , image:'/image/shirts_tshirts/shirt17.jpg' , color:'Blue' , size:'S' , stock :18 , isActive:true },
      { name:'Classic Shirt' , category:'T-Shirts_Shirts' , price :18.00 , oldPrice :22.00 , image:'/image/shirts_tshirts/shirt18.jpg' , color:'Blue' , size:'S' , stock :18 , isActive:true },


      // Jackets & Hoodies
      { name: 'Brown Coat Casual', category: 'Jackets_Hoodies', price: 25.00, image: '/image/jackets_hoodies/jacket1.png', color: 'Brown', size: 'L', stock: 10, isActive: true },
      { name: 'Denim Jacket Blue', category: 'Jackets_Hoodies', price: 20.00, oldPrice: 25.00, image: '/image/jackets_hoodies/jacket3.png', color: 'Blue', size: 'M', stock: 20, isActive: true },
      { name: 'Working Dress Maroon', category: 'Jackets_Hoodies', price: 30.00, oldPrice: 30.00, image: '/image/jackets_hoodies/jacket4.png', color: 'Maroon', size: 'M', stock: 8, isActive: true },
      { name: 'Cherries T-Shirt Pink', category: 'Jackets_Hoodies', price: 14.00, oldPrice: 20.00, image: '/image/jackets_hoodies/hoodie1.png', color: 'Pink', size: 'S', stock: 19, isActive: true },
      { name: 'Hoodie Gray', category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/hoodie2.png' , color:'Denim' , size:'XS' , stock :21 , isActive:true },
      { name:'Summer Dress Green' , category:'Jackets_Hoodies' , price :25.00 , oldPrice :35.00 , image:'/image/jackets_hoodies/hoodie3.png' , color:'Green' , size:'M' , stock :11 , isActive:true },
      { name: 'Black Jeans Slim', category: 'Jackets_Hoodies', price: 20.00, oldPrice: 22.00, image: '/image/jackets_hoodies/jacket5.jpg', color: 'Black', size: 'L', stock: 23, isActive:true },
      { name: 'Hoodie White', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket6.jpg', color: 'White', size: 'M', stock: 16, isActive: true },
      { name: 'Brown Coat Winter', category: 'Jackets_Hoodies', price: 25.00, oldPrice: 30.00, image: '/image/jackets_hoodies/jacket7.jpg', color: 'Brown', size: 'L', stock: 9, isActive: true },
      { name: 'Yellow Hoodie', category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/hoodie4.jpg' , color:'Tan' , size:'M' , stock :15 , isActive:true },
      { name:'Hoodie Soft' , category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/hoodie5.jpg' , color:'Tan' , size:'M' , stock :15 , isActive:true },
      { name: 'Colourful Hoodie', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/hoodie6.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Cat Blue Hoodie', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/hoodie7.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Red Casual Jacket', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket8.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Brown Casual Jacket', category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/jacket9.jpg' , color:'Tan' , size:'M' , stock :15 , isActive:true },
      { name:'Brown Casual Jacket' , category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/jacket10.jpg' , color:'Tan' , size:'M' , stock :15 , isActive:true },
      { name: 'White Casual Jacket', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket11.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'WhiteBrown Casual Jacket', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket12.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Brown Classic coat', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket13.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Light Blue jackets', category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/jacket14.jpg' , color:'Tan' , size:'M' , stock :15 , isActive:true },
      { name:'White Coat' , category:'Jackets_Hoodies' , price :15.00 , oldPrice :25.00 , image:'/image/jackets_hoodies/jacket15.jpg' , color:'Tan' , size:'M' , stock :15 , isActive:true },
      { name: 'Black Coat', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket16.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Pink Coat', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket17.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },
      { name: 'Light Pink Coat', category: 'Jackets_Hoodies', price: 15.00, oldPrice: 20.00, image: '/image/jackets_hoodies/jacket18.jpg', color: 'Tan', size: 'M', stock: 15, isActive: true },


      // Crop Top
      { name: 'Crop Top White', category: 'CropTop', price: 30.00, oldPrice: 30.00, image: '/image/croptops/croptop1.png', color: 'White', size: 'XS', stock: 8, isActive: true },
      { name: 'Crop Top Light Blue', category: 'CropTop', price: 14.00, oldPrice: 20.00, image: '/image/croptops/croptop2.png', color: 'Black', size: 'XS', stock: 20, isActive: true },
      { name: 'Black Crop Top', category: 'CropTop', price: 10.00, oldPrice: 18.00, image: '/image/croptops/croptop3.png', color: 'Purple', size: 'XS', stock: 19, isActive: true },
      { name: 'Flower Crop Top', category: 'CropTop', price: 25.00, oldPrice: 30.00, image: '/image/croptops/croptop4.png', color: 'Orange', size: 'S', stock: 14, isActive: true },
      { name: 'RedPink Crop Top', category: 'CropTop', price: 20.00, oldPrice: 22.00, image: '/image/croptops/croptop5.png', color: 'Black', size: 'M', stock: 25, isActive: true },
      { name: 'Ribbon Crop Top', category: 'CropTop', price: 15.00, oldPrice: 20.00, image: '/image/croptops/croptop6.png', color: 'Cream', size: 'S', stock: 18, isActive: true },
      { name: 'Ribbon Tulip', category: 'CropTop', price: 25.00, oldPrice: 30.00, image: '/image/croptops/croptop7.png', color: 'Brown', size: 'M', stock: 10, isActive: true },
      { name: 'Black Crop Top', category: 'CropTop', price: 15.00, oldPrice: 20.00, image: '/image/croptops/croptop8.png', color: 'Gray', size: 'M', stock: 13, isActive: true },
      { name: 'Black Crop Top', category: 'CropTop', price: 15.00, oldPrice: 20.00, image: '/image/croptops/croptop10.jpg', color: 'Gray', size: 'M', stock: 13, isActive: true },
      { name: 'Gray Star Croptop', category: 'CropTop', price: 15.00, oldPrice: 20.00, image: '/image/croptops/croptop11.jpg', color: 'Gray', size: 'M', stock: 13, isActive: true },
      { name: 'White Croptop', category: 'CropTop', price: 15.00, oldPrice: 20.00, image: '/image/croptops/croptop12.jpg', color: 'Gray', size: 'M', stock: 13, isActive: true },

      // Shorts
      { name: 'Shorts Denim', category: 'Shorts', price: 30.00, oldPrice: 30.00, image: '/image/shorts/short1.png', color: 'Denim', size: 'S', stock: 9, isActive: true },
      { name: 'Brown Shorts', category: 'Shorts', price: 14.00, oldPrice: 20.00, image: '/image/shorts/short2.png', color: 'Red', size: 'M', stock: 21, isActive: true },
      { name: 'Woman Short Light blue', category: 'Shorts', price: 10.00, oldPrice: 18.00, image: '/image/shorts/short3.png', color: 'Black', size: 'XS', stock: 18, isActive: true },
      { name: 'Summer Light Blue', category: 'Shorts', price: 25.00, oldPrice: 30.00, image: '/image/shorts/short4.png', color: 'White', size: 'S', stock: 13, isActive: true },
      { name: 'Blue Jeans Stretch', category: 'Shorts', price: 20.00, oldPrice: 22.00, image: '/image/shorts/short5.png', color: 'Black', size: 'M', stock: 22, isActive:true },
      { name:'Short Light Yellow' , category:'Shorts' , price :15.00 , oldPrice :20.00 , image:'/image/shorts/short6.png' , color:'Blue' , size:'L' , stock :15 , isActive:true },
      { name: 'Red Shorts', category: 'Shorts', price: 25.00, oldPrice: 30.00, image: '/image/shorts/short7.png', color: 'Tan', size: 'L', stock: 8, isActive: true },
      { name: 'Shorts Olive', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short8.png', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'WhiteJean Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short9.png', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Sleep Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short10.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Summer Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short11.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Yellow Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short12.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Brown Belt Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short13.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Flower Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short14.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Flower Pink Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short15.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Ribbon Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short16.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Jean Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short17.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Black Jean Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short18.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Black Jeans Butterfly Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short19.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },
      { name: 'Star Jean Shorts', category: 'Shorts', price: 15.00, oldPrice: 20.00, image: '/image/shorts/short20.jpg', color: 'Olive', size: 'M', stock: 12, isActive: true },

      // Skirts
      { name: 'Long Skirt Brown', category: 'Skirts', price: 30.00, oldPrice: 30.00, image: '/image/skirts/skirt1.png', color: 'Black', size: 'S', stock: 7, isActive: true },
      { name: 'Short Skirt Jeans', category: 'Skirts', price: 14.00, oldPrice: 20.00, image: '/image/skirts/skirt2.png', color: 'Red', size: 'M', stock: 17, isActive: true },
      { name: 'Short Skirt Ribbon', category: 'Skirts', price: 10.00, oldPrice: 18.00, image: '/image/skirts/skirt3.png', color: 'White', size: 'XS', stock: 16, isActive: true },
      { name: 'Pink Skirt', category: 'Skirts', price: 25.00, oldPrice: 30.00, image: '/image/skirts/skirt4.png', color: 'Floral', size: 'M', stock: 10, isActive: true },
      { name: 'Skirt with Belt', category: 'Skirts', price: 20.00, oldPrice: 22.00, image: '/image/skirts/skirt5.png', color: 'Black', size: 'M', stock: 20, isActive:true },
      { name:'Long Skirt WhiteBlue' , category:'Skirts' , price :15.00 , oldPrice :20.00 , image:'/image/skirts/skirt6.png' , color:'Purple' , size:'S' , stock :14 , isActive:true },
      { name: 'Skirt Casual', category: 'Skirts', price: 25.00, oldPrice: 30.00, image: '/image/skirts/skirt7.png', color: 'Brown', size: 'M', stock: 6, isActive: true },
      { name: 'Skirt Navy', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt8.png', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Short Brown Belt Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt9.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Short Brown Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt10.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Short Pink Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt11.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Pink Arrow Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt12.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Jean Long Skirts', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt13.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Plan Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt14.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Colourful Flowers Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt15.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Rose Yellow Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt16.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Orange Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt17.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'ROses Pink Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt18.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },
      { name: 'Soft Skirt', category: 'Skirts', price: 15.00, oldPrice: 20.00, image: '/image/skirts/skirt19.jpg', color: 'Navy', size: 'M', stock: 11, isActive: true },


      //Jeans & Pants
      { name: 'Black Swag Jeans', category: 'Jeans_Pants', price: 25.00, oldPrice: 30.00, image: '/image/pants_jeans/jeans1.jpg', color: 'Blue', size: 'M', stock: 12, isActive: true },
      { name: 'Pink Swag Jeans', category: 'Jeans_Pants', price: 14.00, oldPrice: 20.00, image: '/image/pants_jeans/jeans2.jpg', color: 'Black', size: 'L', stock: 22, isActive: true },
      { name: 'Light Green Stars Swag Jeans', category: 'Jeans_Pants', price: 14.00, oldPrice: 20.00, image: '/image/pants_jeans/jeans3.jpg', color: 'Black', size: 'L', stock: 22, isActive: true },
      { name: 'Black Star Swag Jeans', category: 'Jeans_Pants', price: 14.00, oldPrice: 20.00, image: '/image/pants_jeans/jeans4.jpg', color: 'Black', size: 'L', stock: 22, isActive: true },
      { name: 'Working Pants', category: 'Jeans_Pants', price: 10.00, oldPrice: 18.00, image: '/image/pants_jeans/pants1.png', color: 'Light Blue', size: 'S', stock: 19, isActive: true },
      { name: 'Red Pants', category:'Jeans_Pants' , price :25.00 , oldPrice :30.00 , image:'/image/pants_jeans/pants2.jpg' , color:'Dark Blue' , size:'M' , stock :14 , isActive:true },
      { name: 'Casual Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 22.00, image: '/image/pants_jeans/pants3.jpg', color: 'Black', size: 'M', stock: 24, isActive:true },
      { name:'Green Flowers Pants' , category:'Jeans_Pants' , price :15.00 , oldPrice :20.00 , image:'/image/pants_jeans/pants4.png' , color:'Navy' , size:'L' , stock :16 , isActive:true },
      { name: 'White Casual Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 25.00, image: '/image/pants_jeans/pants5.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Heart Colourful Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 23.00, image: '/image/pants_jeans/pants6.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'BackPink Casual Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 22.00, image: '/image/pants_jeans/pants7.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Pink Working Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 25.00, image: '/image/pants_jeans/pants8.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Blue Normal Jeans', category: 'Jeans_Pants', price: 20.00, oldPrice: 24.00, image: '/image/pants_jeans/jeans5.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Blue Baggy Jeans', category: 'Jeans_Pants', price: 20.00, oldPrice: 20.00, image: '/image/pants_jeans/jeans6.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Dark Blue Jeans', category: 'Jeans_Pants', price: 20.00, oldPrice: 20.00, image: '/image/pants_jeans/jeans7.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Light Brown Baggy Jeans', category: 'Jeans_Pants', price: 20.00, oldPrice: 22.00, image: '/image/pants_jeans/jeans8.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Pink Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 23.00, image: '/image/pants_jeans/pants9.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Purple Working Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 22.00, image: '/image/pants_jeans/pants10.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Red Working Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 22.00, image: '/image/pants_jeans/pants11.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Green Working Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 28.00, image: '/image/pants_jeans/pants12.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Blue Casual Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 25.00, image: '/image/pants_jeans/pants13.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Yellow Sport Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 20.00, image: '/image/pants_jeans/pants14.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Swag Sport Pants', category: 'Jeans_Pants', price: 22.00, oldPrice: 27.00, image: '/image/pants_jeans/pants15.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
      { name: 'Brown Casual Pants', category: 'Jeans_Pants', price: 20.00, oldPrice: 25.00, image: '/image/pants_jeans/pants16.jpg', color: 'Gray', size: 'M', stock: 18, isActive:true },
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
