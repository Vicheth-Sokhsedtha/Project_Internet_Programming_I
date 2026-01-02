<template>
  <div class="page">
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
      <section class="hero">
        <div class="hero-text">
          <h1>Make you look</h1>
          <h1 class="bold">Beautiful and</h1>
          <h1 class="bold">Dignified.</h1>
        </div>
        <img src="/image/image 1.png" class="image-1-img" />
      </section>

      <div>
        <CategoryTabs
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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

// --- Search state ---
const searchQuery = ref("");

// Handle search event
function handleSearch(query: string) {
  searchQuery.value = query;
}

// Handle category tab selection
function handleCategorySelect(category: string) {
  // When selecting a category, show those products as "search results"
  searchQuery.value = category;
}

// Combine ALL products from ALL categories for searching
const allProducts = computed(() => {
  return [
    ...discountProducts,
    ...dress,
    ...tshirts,
    ...jacket,
    ...cropTop,
    ...shorts,
    ...skirts
  ];
});

// Filter products from ALL categories based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return [];

  const query = searchQuery.value.toLowerCase();

  // Search in ALL products from ALL categories
  return allProducts.value.filter(product =>
    product.name.toLowerCase().includes(query)
  );
});
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

.hero {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 120px;
  box-sizing: border-box;
}

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
  color: #ffffff;
}

.hero-text .bold {
  color: #000000;
}

.image-1-img {
  width: 720px;
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

/* Search results styles */
.search-results-header {
  text-align: center;
  padding: 40px 20px 20px;
  font-family: "Playfair Display", serif;
  font-size: 28px;
  color: #333;
}

.no-results {
  text-align: center;
  padding: 80px 40px;
  font-family: "Playfair Display", serif;
  font-size: 24px;
  color: #666;
}

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
</style>
