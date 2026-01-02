<template>
  <div class="page">


    <!-- Hero Section 1 -->
    <section class="hero1">
      <div class="hero-text">
        <h1 class="hero-title">Made For Your</h1>
        <h1 class="hero-title bold">Everyday Look</h1>
        <p class="hero-subtitle">Comfortable fashion designed to suit your lifestyle.</p>
        <router-link to="/product">
          <button class="hero-btn">Explore collections</button>
        </router-link>
      </div>
      <div class="hero-image-container">
        <img src="/image/landingPicture-removebg 1.png" class="hero-img" />
      </div>
    </section>

    <!-- Explore Collections Title -->
    <div class="collections-section">
      <h2 class="section-title">Explore Collections</h2>
    </div>

    <SearchBar @search="handleSearch" />

    <!-- Show search results only when searching -->
    <div v-if="searchQuery">
      <div class="search-results-header">
        <h3>Search Results for "{{ searchQuery }}" ({{ filteredProducts.length }} items)</h3>
      </div>

      <ProductSection
        v-if="filteredProducts.length > 0"
        title="Search Results"
        :items="filteredProducts"
      />
      <div v-else class="no-results">
        <p>No products found for "{{ searchQuery }}"</p>
      </div>
    </div>

    <!-- Show normal page only when NOT searching -->
    <div v-else>
      <!-- Main Categories with Winter Banner -->
      <div class="main-categories-wrapper">
        <MainCategory
          :discountProducts="discountProducts"
          :dress="dress"
          :tshirts="tshirts"
          :jacket="jacket"
          :cropTop="cropTop"
          :shorts="shorts"
          :skirts="skirts"
          @selectCategory="handleCategorySelect"
        />
      </div>



      <!-- Discount Bar -->
      <div class="discount-bar">
        <h2 class="discount-title">Up to 50% Discount</h2>
      </div>

      <!-- Product Sections -->
      <ProductSection title="" :items="discountProducts" />
      <!-- <ProductSection title="Dress" :items="dress" /> -->
    </div>

    <!-- About Us Section -->
     <div class="discount-bar">
        <h2 class="section-title">About Us</h2>
      </div>
    <section class="about-section">


      <div class="about-content">
        <div class="about-images">
          <img src="/image/Rectangle 10.png" class="about-img img-midle">
          <img src="/image/Rectangle 9.png" class="about-img img-offset" />
          <img src="/image/Rectangle 8.png" class="about-img" />
        </div>
        <div class="about-text">
          <p class="about-quote">"This is our history and main purpose that own the store."</p>
          <p class="about-description">
            Our main purpose is to help save your time and make you more and more comfortable
            with fashion that suits your lifestyle and personality.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
      <div class="discount-bar">
      <h2 class="section-title">Contact us</h2>
    </div>
    <section class="contact-section">

      <!-- Contact Form -->
      <div class="contact-form-container">
        <div class="contact-form">
          <h3 class="form-title">Send us a message</h3>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Name"
            class="form-input"
          />
          <input
            v-model="formData.email"
            type="email"
            placeholder="Email"
            class="form-input"
          />
          <textarea
            v-model="formData.message"
            placeholder="Message"
            rows="4"
            class="form-textarea"
          ></textarea>
          <button @click="submitForm" class="form-submit">Submit</button>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="contact-info">
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <h4 class="contact-label">Visit us</h4>
          <p class="contact-detail">Tool kork, Phnom penh</p>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📞</span>
          <h4 class="contact-label">Call us</h4>
          <p class="contact-detail">+855 98 214 5218</p>
        </div>
        <div class="contact-item">
          <span class="contact-icon">✉️</span>
          <h4 class="contact-label">Email</h4>
          <p class="contact-detail">sjdstyle@gmail.com</p>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <h3 class="map-title">📍 Our location</h3>
        <div class="map-container">
          <!-- <img src="/image/map.png" class="map-img" /> -->
        </div>
      </div>
    </section>


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SearchBar from "../components/SearchBar.vue";
import MainCategory from "../components/MainCategory.vue";
import CategoryTabs from "../components/CategoryTabs.vue";
import ProductSection from "../components/ProductSection.vue";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
}

// Product data arrays
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

// Form data
const formData = ref({
  name: "",
  email: "",
  message: ""
});

// --- Search state ---
const searchQuery = ref("");

// Handle search event
function handleSearch(query: string) {
  searchQuery.value = query;
}

// Handle category tab selection
function handleCategorySelect(category: string) {
  searchQuery.value = category;
}

// Combine ALL products from ALL categories for searching
const allProducts = computed(() => {
  return [
    ...discountProducts,
    ...dress,
  ];
});

// Filter products from ALL categories based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return allProducts.value.filter(product =>
    product.name.toLowerCase().includes(query)
  );
});

// Submit form
function submitForm() {
  if (formData.value.name && formData.value.email && formData.value.message) {
    alert("Message sent successfully!");
    formData.value = { name: "", email: "", message: "" };
  } else {
    alert("Please fill in all fields");
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  width: 100vw;
  min-height: 100vh;
  background: #D9CFC7;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  color: #000000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Header */
.header {
  background: #C5B8AD;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 60px;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  font-family: "Playfair Display", serif;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #555;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #000;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.header-icons {
  display: flex;
  gap: 20px;
  font-size: 22px;
}

.icon {
  cursor: pointer;
  transition: transform 0.2s;
}

.icon:hover {
  transform: scale(1.15);
}

/* Hero Section 1 */
.hero1 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 80px;
}

.hero-text {
  flex: 1;
  max-width: 520px;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: 64px;
  font-weight: 600;
  line-height: 1.1;
  color: #ffffff;
  margin-bottom: 8px;
}

.hero-title.bold {
  color: #000000;
}

.hero-subtitle {
  font-size: 18px;
  color: #333;
  margin: 24px 0 32px;
  line-height: 1.6;
}

.hero-btn {
  background: #333;
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hero-btn:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.hero-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-img {
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}

/* Collections Section */
.collections-section {
  background: white;
  padding: 60px 40px 40px;
}

.section-title {
  text-align: center;
  font-family: "Playfair Display", serif;
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #000;
}

.main-categories-wrapper {
  /* background: white; */
  padding: 0 40px 60px;
}

/* Hero Section 2 - Promotion */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.hero .hero-text h1 {
  font-family: "Playfair Display", serif;
  font-size: 64px;
  font-weight: 600;
  line-height: 1.05;
  margin: 0;
}

.hero .hero-text h1:first-child {
  color: #ffffff;
}

.hero .hero-text .bold {
  color: #000000;
}

.image-1-img {
  width: 720px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}

/* Discount Bar */
.discount-bar {
  width: 100%;
  background: white;
  padding: 50px 0;
}

.discount-title {
  text-align: center;
  font-size: 48px;
  font-weight: 600;
  font-family: "Playfair Display", serif;
  color: #000000;
  margin: 0;
}

/* Search results styles */
.search-results-header {
  text-align: center;
  padding: 40px 20px 20px;
  font-family: "Playfair Display", serif;
  font-size: 28px;
  color: #333;
  background: white;
}

.no-results {
  text-align: center;
  padding: 80px 40px;
  font-family: "Playfair Display", serif;
  font-size: 24px;
  color: #666;
  background: white;
}

/* About Section */
.about-section {
  padding: 80px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.about-content {
  display: flex;
  gap: 80px;
  align-items: center;
  margin-top: 40px;
}

.about-images {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

.about-img {
  width: 100%;
  height: 360px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s;
}

.about-img:hover {
  transform: scale(1.03);
}

.img-offset {
  margin-top: 40px;
}

.about-text {
  flex: 1;
}

.about-quote {
  font-family: "Playfair Display", serif;
  font-size: 26px;
  font-style: italic;
  margin-bottom: 28px;
  line-height: 1.6;
  color: #000;
}

.about-description {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
}

/* Contact Section */
.contact-section {
  /* background: white; */
  padding: 80px 40px;
}

.contact-form-container {
  max-width: 800px;
  margin: 40px auto 60px;
}

.contact-form {
  background: #F5F1ED;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.hero-image {
  max-width: 300px;
  border-radius: 8px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}



.form-title {
  font-family: "Playfair Display", serif;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #000;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: white;
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #C5B8AD;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-submit {
  background: #C5B8AD;
  color: #000;
  border: none;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-submit:hover {
  background: #B5A89D;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto 60px;
  text-align: center;
}

.contact-icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: block;
}

.contact-label {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #000;
}

.contact-detail {
  font-size: 14px;
  color: #666;
}

/* Map Section */
.map-section {
  max-width: 1200px;
  margin: 0 auto;
}

.map-title {
  font-family: "Playfair Display", serif;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.map-container {
  background: #E5E5E5;
  border-radius: 20px;
  height: 400px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Footer */
.footer {
  background: #C5B8AD;
  padding: 60px 40px 24px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  margin-bottom: 40px;
}

.footer-logo {
  font-family: "Playfair Display", serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #000;
}

.footer-heading {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #000;
}

.footer-text {
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 16px;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #000;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #555;
}

.social-icons {
  display: flex;
  gap: 16px;
  font-size: 24px;
}

.social-icons a {
  transition: transform 0.2s;
  text-decoration: none;
}

.social-icons a:hover {
  transform: scale(1.15);
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #333;
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-menu {
    display: none;
  }

  .hero1,
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 60px 40px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero .hero-text h1 {
    font-size: 48px;
  }

  .image-1-img {
    width: 100%;
    max-width: 500px;
  }

  .about-content {
    flex-direction: column;
    gap: 40px;
  }

  .contact-info {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 36px;
  }

  .section-title {
    font-size: 32px;
  }

  .hero {
    padding: 40px 20px;
  }

  .hero .hero-text h1 {
    font-size: 36px;
  }

  .discount-title {
    font-size: 32px;
  }

  .about-images {
    grid-template-columns: 1fr;
  }

  .img-offset {

    margin-top: 0;
  }
  .img-midle {
    margin-top: 24px;
  }

  .contact-form {
    padding: 32px 24px;
  }
}
</style>
