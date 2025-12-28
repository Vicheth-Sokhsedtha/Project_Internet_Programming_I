// src/data/products.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  sizes: string[];
  image: string;
  category: string;
}

export const allProducts: Product[] = [
  // Discount Products
  { id: 1, name: "Working Dress", oldPrice: 30.00, price: 15.00, image: "/image/popupar 81.png", sizes: ['XS', 'S', 'M', 'L', 'XL'], category: 'discount' },
  { id: 2, name: "T-shirt Coffee", oldPrice: 20.00, price: 10.00, image: "/image/popupar 37.png", sizes: ['S', 'M', 'L', 'XL'], category: 'discount' },
  { id: 3, name: "Summer Dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 37.png", sizes: ['XS', 'S', 'M', 'L'], category: 'discount' },
  { id: 4, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 45.png", sizes: ['S', 'M', 'L', 'XL'], category: 'discount' },
  { id: 5, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/popupar 37.png", sizes: ['S', 'M', 'L', 'XL'], category: 'discount' },
  { id: 6, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 37.png", sizes: ['S', 'M', 'L', 'XL'], category: 'discount' },
  { id: 7, name: "Brown Coat", oldPrice: 40.00, price: 25.00, image: "/image/popupar 37.png", sizes: ['S', 'M', 'L', 'XL'], category: 'discount' },
  { id: 8, name: "Skirt Flower", oldPrice: 25.00, price: 15.00, image: "/image/popupar 37.png", sizes: ['XS', 'S', 'M', 'L'], category: 'discount' },

  // Dresses
  { id: 9, name: "Elegant Evening Dress", oldPrice: 30.00, price: 15.00, image: "/image/popupar 23.png", sizes: ['XS', 'S', 'M', 'L'], category: 'dress' },
  { id: 10, name: "Cheries Dress", oldPrice: 20.00, price: 14.00, image: "/image/popupar 25.png", sizes: ['S', 'M', 'L'], category: 'dress' },
  { id: 11, name: "Casual Summer Dress", oldPrice: 15.00, price: 10.00, image: "/image/popupar 27.png", sizes: ['XS', 'S', 'M', 'L', 'XL'], category: 'dress' },
  { id: 12, name: "Floral Print Dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 29.png", sizes: ['S', 'M', 'L'], category: 'dress' },
  { id: 13, name: "Red Floral Dress", oldPrice: 35.00, price: 20.00, image: "/image/popupar 31.png", sizes: ['XS', 'S', 'M', 'L'], category: 'dress' },
  { id: 14, name: "Beige Dress", oldPrice: 20.00, price: 15.00, image: "/image/popupar 33.png", sizes: ['S', 'M', 'L', 'XL'], category: 'dress' },
  { id: 15, name: "Winter Coat Dress", oldPrice: 40.00, price: 25.00, image: "/image/popupar 64.png", sizes: ['S', 'M', 'L'], category: 'dress' },
  { id: 16, name: "Professional Dress", oldPrice: 20.00, price: 15.00, image: "/image/popupar 35.png", sizes: ['XS', 'S', 'M', 'L', 'XL'], category: 'dress' },

  // Add more products for other categories...
];

export const getProductById = (id: number): Product | undefined => {
  return allProducts.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter(p => p.category === category);
};
