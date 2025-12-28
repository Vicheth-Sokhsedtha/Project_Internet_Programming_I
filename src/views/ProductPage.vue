<template>
  <div class="page">


    <SearchBar />
    <CategoryTabs />

    <section class="hero">
  <div class="hero-text">
    <h1>Make you look</h1>
    <h1 class="bold">Beautiful and</h1>
    <h1 class="bold">Dignified.</h1>
  </div>

  <img src="/image/image 1.png" class="image-1-img" />
</section>


    <div class="discount-bar">
    <h2 class="discount-title">Up to 50% Discount</h2>
    </div>


    <ProductSection title="" :items="discountProducts" />
    <ProductSection title="Dress" :items="dress" />
    <ProductSection title="T-Shirts & Shirt" :items="tshirts" />
    <ProductSection title="Jacket & Hoodie" :items="jacket" />
    <ProductSection title="Crop Top" :items="cropTop" />
    <ProductSection title="Shorts" :items="shorts" />
    <ProductSection title="Skirts" :items="skirts" />




  </div>
</template>

<script setup lang="ts">

import SearchBar from "../components/SearchBar.vue";
import CategoryTabs from "../components/CategoryTabs.vue";
import ProductSection from "../components/ProductSection.vue";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
}
const discountProducts: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 15.00, image: "/image/popupar 37.png" },
  { id: 2, name: "T-shirt Coffee", oldPrice: 20.00, price: 10.00, image: "/image/popupar 37.png" },
  { id: 3, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 37.png" },
  { id: 4, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 37.png" },
  { id: 5, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/popupar 37.png" },
  { id: 6, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 37.png" },
  { id: 7, name: "Brown Coat", oldPrice: 40.00, price: 25.00, image: "/image/popupar 37.png" },
  { id: 8, name: "Skirt Flower", oldPrice: 25.00, price: 15.00, image: "/image/popupar 37.png" },
];

const dress: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 15.00, image: "/image/popupar 23.png" },
  { id: 2, name: "Cheries T-Shirt", oldPrice: 20.00, price: 14.00, image: "/image/popupar 25.png" },
  { id: 3, name: "Woman Short", oldPrice: 15.00, price: 10.00, image: "/image/popupar 27.png" },
  { id: 4, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 29.png" },
  { id: 5, name: "Red Floral Dress", oldPrice: 35.00, price: 20.00, image: "/image/popupar 31.png" },
  { id: 6, name: "Beige Dress", oldPrice: 20.00, price: 15.00, image: "/image/popupar 33.png" },
  { id: 7, name: "Brown Coat", oldPrice: 40.00, price: 25.00, image: "/image/popupar 64.png" },
  { id: 8, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/popupar 35.png" },
];

const tshirts: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 15.00, image: "/image/popupar 95.png" },
  { id: 2, name: "Cherries T-Shirt", oldPrice: 20.00, price: 14.00, image: "/image/popupar 39.png" },
  { id: 3, name: "Woman Short", oldPrice: 18.00, price: 10.00, image: "/image/tShirt6 1.png" },
  { id: 4, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/tShirt11 3.png" },
  { id: 5, name: "Black Jeans", oldPrice: 25.00, price: 20.00, image: "/image/popupar 45.png" },
  { id: 6, name: "Working Pants", oldPrice: 25.00, price: 15.00, image: "/image/tShirt11 2.png" },
  { id: 7, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 65.png" },
  { id: 8, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 66.png" },
];

const jacket: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 30.00, image: "/image/popupar 51.png" },
  { id: 2, name: "Cherries T-Shirt", oldPrice: 20.00, price: 14.00, image: "/image/popupar 53.png" },
  { id: 3, name: "Woman Short", oldPrice: 18.00, price: 10.00, image: "/image/popupar 55.png" },
  { id: 4, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 57.png" },
  { id: 5, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 59.png" },
  { id: 6, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 61.png" },
  { id: 7, name: "Brown Coat", oldPrice: 30.00, price: 25.00, image: "/image/popupar 63.png" },
  { id: 8, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/hoodie7 1.png" },
];

const cropTop: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 30.00, image: "/image/popupar 67.png" },
  { id: 2, name: "Cherries T-Shirt", oldPrice: 20.00, price: 14.00, image: "/image/popupar 68.png" },
  { id: 3, name: "Woman Short", oldPrice: 18.00, price: 10.00, image: "/image/popupar 69.png" },
  { id: 4, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 70.png" },
  { id: 5, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 71.png" },
  { id: 6, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 72.png" },
  { id: 7, name: "Brown Coat", oldPrice: 30.00, price: 25.00, image: "/image/hoodie7 2.png" },
  { id: 8, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/popupar 73.png" },
];

const shorts: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 30.00, image: "/image/popupar 81.png" },
  { id: 2, name: "Cherries T-Shirt", oldPrice: 20.00, price: 14.00, image: "/image/popupar 82.png" },
  { id: 3, name: "Woman Short", oldPrice: 18.00, price: 10.00, image: "/image/popupar 83.png" },
  { id: 4, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 84.png" },
  { id: 5, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 85.png" },
  { id: 6, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 86.png" },
  { id: 7, name: "Brown Coat", oldPrice: 30.00, price: 25.00, image: "/image/popupar 87.png" },
  { id: 8, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/hoodie7 4.png" },
];

const skirts: Product[] = [
  { id: 1, name: "Working dress", oldPrice: 30.00, price: 30.00, image: "/image/popupar 88.png" },
  { id: 2, name: "Cherries T-Shirt", oldPrice: 20.00, price: 14.00, image: "/image/popupar 89.png" },
  { id: 3, name: "Woman Short", oldPrice: 18.00, price: 10.00, image: "/image/popupar 90.png" },
  { id: 4, name: "Summer dress", oldPrice: 30.00, price: 25.00, image: "/image/popupar 91.png" },
  { id: 5, name: "Black Jeans", oldPrice: 22.00, price: 20.00, image: "/image/popupar 92.png" },
  { id: 6, name: "Hoodie", oldPrice: 20.00, price: 15.00, image: "/image/popupar 93.png" },
  { id: 7, name: "Brown Coat", oldPrice: 30.00, price: 25.00, image: "/image/popupar 94.png" },
  { id: 8, name: "Working Pants", oldPrice: 20.00, price: 15.00, image: "/image/popupar 95.png" },
];

</script>

<style scoped>
.page {
  width: 100vw;
  min-height: 100vh;
  background: #D9CFC7;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  color: #000000;

}


/* HERO SECTION (Make you look beautiful...) */
.hero {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 120px; /* bigger like your Figma */
  box-sizing: border-box;
}

/* Left Text */
.hero-text {
  max-width: 520px;
}

.hero-text h1 {
  font-family: "Playfair Display", serif;
  font-size: 64px;
  font-weight: 600;
  line-height: 1.05;
  margin: 0;
}

.hero-text h1:first-child {
  color: #ffffff; /* First line white */
}

.hero-text .bold {
  color: #000000; /* Other lines black */
}

/* Models Image */
.image-1-img {
  width: 720px; /* Bigger like your Figma */
  height: auto;
  object-fit: contain;
}
.discount-bar {
  width: 100%;
  background: white;
  padding: 40px 0;
}
.discount-title {
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  font-family: "Playfair Display", serif;
  color: #000000;
  margin: 2px 0 2px;
}


/* Make everything scale nicely */
@media (max-width: 1000px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }

  .image-1-img {
    width: 90%;
  }
}
.full-footer {
  background: #d1bfa9;
  padding: 60px 80px;
  font-family: "Playfair Display", serif;
}

.footer-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 40px;
}

.footer-logo {
  font-size: 34px;
  font-weight: 600;
}

.footer-text {
  margin-top: 15px;
  font-size: 16px;
  line-height: 1.5;
  max-width: 280px;
}

.footer-copy {
  margin-top: 50px;
  font-size: 14px;
}

.footer-links h3,
.footer-message h3 {
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 600;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin: 6px 0;
  cursor: pointer;
}

.msg-box {
  width: 180px;
  height: 140px;
  background: #e0d8d0;
  border-radius: 10px;
  margin-bottom: 20px;
}

.footer-icons img {
  width: 28px;
  margin-right: 10px;
  cursor: pointer;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #b5a999;
  font-size: 14px;
}


</style>
