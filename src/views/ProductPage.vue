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
      <!-- <section class="hero">
        <div class="hero-text">
          <h1>Make you look</h1>
          <h1 class="bold">Beautiful and</h1>
          <h1 class="bold">Dignified.</h1>
        </div>
        <img src="/image/image 1.png" class="image-1-img" />
      </section> -->

      <div>
        <CategoryTabs
          :discountProducts="discountProducts"
          :dress="dress"
          :tshirts="shirt"
          :jacket="jacket"
          :cropTop="cropTop"
          :shorts="shorts"
          :skirts="skirts"
          :pants="pants"
          @selectCategory="handleCategorySelect"
        />
      </div>

      <div class="discount-bar">
        <h2 class="discount-title">Up to 50% Discount</h2>
      </div>

      <ProductSection title="" :items="discountProducts" />
      <ProductSection title="Dress" :items="dress" />
      <ProductSection title="Shirts_T-shirts" :items="shirt" />
      <ProductSection title="Jackets_Hoodies" :items="jacket" />
      <ProductSection title="Crop Top" :items="cropTop" />
      <ProductSection title="Shorts" :items="shorts" />
      <ProductSection title="Skirts" :items="skirts" />
      <ProductSection title="Jeans_Pants" :items="pants" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import ProductSection from '../components/ProductSection.vue'

interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  image: string
  category?: string
  description?: string
}

// Backend products
const backendProducts = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

// Fetch products
const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:5000/api/products/')
    backendProducts.value = await response.json()
  } catch (err) {
    error.value = 'Failed to load products from server'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Discount: only 2 rows visible in ProductSection
const discountProducts = computed(() =>
  backendProducts.value.filter(p => p.oldPrice && p.price < p.oldPrice)
);

const dress = computed(() => backendProducts.value.filter(p => p.category === "Dresses"));
const shirt = computed(() => backendProducts.value.filter(p => p.category === "T-Shirts_Shirts"));
const jacket = computed(() => backendProducts.value.filter(p => p.category === "Jackets_Hoodies"));
const cropTop = computed(() => backendProducts.value.filter(p => p.category === "CropTop"));
const shorts = computed(() => backendProducts.value.filter(p => p.category === "Shorts"));
const skirts = computed(() => backendProducts.value.filter(p => p.category === "Skirts"));
const pants = computed(() => backendProducts.value.filter(p => p.category === "Jeans_Pants"));
const searchQuery = ref('')

function handleSearch(query: string) {
  searchQuery.value = query
}

function handleCategorySelect(category: string) {
  searchQuery.value = category
}

const filteredProducts = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()

  return backendProducts.value.filter(
    (product) =>
      product.name.toLowerCase().includes(query) || product.category?.toLowerCase().includes(query),
  )
})

onMounted(fetchProducts)
</script>

<style scoped>
.page {
  width: 100vw;
  min-height: 100vh;
  background: #d9cfc7;
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
  font-family: 'Playfair Display', serif;
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
  font-family: 'Playfair Display', serif;
  color: #000000;
  margin: 2px 0 2px;
}

/* Search results styles */
.search-results-header {
  text-align: center;
  padding: 40px 20px 20px;
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  color: #333;
}

.no-results {
  text-align: center;
  padding: 80px 40px;
  font-family: 'Playfair Display', serif;
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
