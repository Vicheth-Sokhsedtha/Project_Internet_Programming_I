<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="tab-btn"
      :class="{ active: activeTab === tab.name }"
      @click="handleCategorySelect(tab.name)"
    >
      {{ tab.name }}
    </button>
  </div>

  <!-- Hero Banner -->
  <section class="hero-banner">
    <img src="/image/promotion1 1.png" alt="Winter Collection" class="hero-image" />
    <div class="hero-content">
      <h2 class="hero-title">Winter Collection</h2>
      <p class="hero-subtitle">Up to 30% OFF</p>
      <router-link to="/product">
        <button class="hero-button">Shop Now</button>
      </router-link>
    </div>
  </section>

  <!-- Category Grid -->
  <div class="category-grid">
    <!-- Discount Category -->
    <div
      class="category-card"
      :class="{ active: activeTab === 'Discount' }"
      @click="handleCategorySelect('Discount')"
    >
      <img src="/image/discount 1.png" alt="Discount" class="category-img" />
      <h3>Discount</h3>
    </div>

    <!-- Other Categories -->
    <div
      v-for="tab in tabs"
      :key="tab.name"
      class="category-card"
      :class="{ active: activeTab === tab.name }"
      @click="handleCategorySelect(tab.name)"
    >
      <img :src="tab.image" :alt="tab.name" class="category-img" />
      <h3>{{ tab.name }}</h3>
    </div>
  </div>

  <!-- Product Sections -->
  <ProductSection
    v-if="activeTab === 'Discount'"
    title="Discount"
    :items="discountProducts"
  />
  <ProductSection
    v-else-if="activeTab"
    :title="activeTab"
    :items="filteredProducts"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductSection from "./ProductSection.vue";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category?: string;
}

const backendProducts = ref<Product[]>([]);
const activeTab = ref("");

const fetchProducts = async () => {
  const response = await fetch("http://localhost:5000/api/products/");
  backendProducts.value = await response.json();
};

const categoryImages: Record<string, string> = {
  Dresses: "/image/dress.png",
  Shirts: "/image/tshirt.png",
  Jackets: "/image/jacket.png",
  CropTop: "/image/croptop.png",
  Shorts: "/image/shorts.png",
  Skirts: "/image/skirts.png",
};

const tabs = computed(() => {
  const categories = [...new Set(
    backendProducts.value
      .map(p => p.category)
      .filter((c): c is string => !!c)
  )];
  return categories.map(c => ({
    name: c,
    image: categoryImages[c] || "/image/default.png"
  }));
});

function handleCategorySelect(category: string) {
  activeTab.value = category;
}

const discountProducts = computed(() =>
  backendProducts.value.filter(p => p.oldPrice && p.price < p.oldPrice)
);

const filteredProducts = computed(() =>
  backendProducts.value.filter(p => p.category === activeTab.value)
);

onMounted(fetchProducts);
</script>

<style scoped>
/* Hero Section */
.hero-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}
.hero-image {
  width: 420px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}
.hero-title {
  font-size: 3rem;
  font-family: serif;
  font-weight: bold;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: 2rem;
}
.hero-button {
  background-color: #2d3748;
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
}
.hero-button:hover {
  background-color: #4a5568;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(260px, 600px));
  gap: 24px;
  padding: 0 60px;
  margin-bottom: 40px;
}
.category-card {
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  background: #fff;
}
.category-card.active {
  border-color: #000;
  background: #f9f9f9;
}
.category-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 6px;
}
.category-label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}
.tab-btn {
  padding: 8px 20px;
  border: none;
  background: white;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.tab-btn:hover {
  background: #f0f0f0;
}
.tab-btn.active {
  background: #000;
  color: white;
}
</style>
