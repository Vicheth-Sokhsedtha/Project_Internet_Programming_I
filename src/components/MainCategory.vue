<template>
  <div>
    <div class="tabs">

      <button
        v-for="tab in tabs1"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <!-- Hero Banner -->
    <section class="hero">
      <img src="/image/promotion1 1.png" class="hero-image" />
      <div class="hero-content">
        <h4 class="hero-title">
          Winter Collection<br />
          <span class="hero-subtitle">30% OFF</span>
        </h4>
        <router-link to="/product">
          <button class="hero-button">Shop Now</button>
        </router-link>
      </div>
    </section>

    <!-- Category Grid -->
    <div class="category-grid">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        class="category-card"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        <img :src="tab.image" :alt="tab.name" class="category-img" />
        <p class="category-label">{{ tab.name }}</p>
      </div>
    </div>

    <!-- Product Section -->
    <!-- <ProductSection
      v-if="activeTab"
      :title="activeTab"
      :items="getItems(activeTab)"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProductSection from "./ProductSection.vue";
import CategoryTabs from "./CategoryTabs.vue";

// interface Props {
//   discountProducts: any[];
//   dress: any[];
//   tshirts: any[];
//   jacket: any[];
//   cropTop: any[];
//   shorts: any[];
//   skirts: any[];
// }

// const props = defineProps<Props>();


// const activeTab = ref("All");

interface Product {
  id: number;
  name: string;
  image: string;
}

interface Props {
  discountProducts: Product[];
  dress: Product[];
  tshirts: Product[];
  jacket: Product[];
  cropTop: Product[];
  pants?: Product[];
  shorts: Product[];
  skirts: Product[];
}

const props = defineProps<Props>();
const tabs1 = ["All", "Dress", "T-shirts", "Shirts", "Jacket", "Shorts", "Skirts", "Crop Top"];
// Tabs with images (replace with your actual image paths)
const tabs = [
  { name: "Discount", image: "/image/discount 1.png" },
  { name: "Dress", image: "/image/popupar 22.png" },
  { name: "T-Shirt & Shirt", image: "/image/popupar 23.png" },
  { name: "Jacket & Hoodie", image: "/image/popupar 25.png" },
  { name: "Crop Top", image: "/image/popupar 33.png" },
  { name: "Jeans & Pants", image: "/image/popupar 27.png" },
  { name: "Shorts", image: "/image/popupar 29.png" },
  { name: "Skirt", image: "/image/popupar 31.png" },
];

const activeTab = ref("Discount");

// Map tab name → product list
function getItems(tab: string) {
  switch (tab) {
    case "Discount": return props.discountProducts;
    case "Dress": return props.dress;
    case "T-Shirt & Shirt": return props.tshirts;
    case "Jacket & Hoodie": return props.jacket;
    case "Crop Top": return props.cropTop;
    case "Jeans & Pants": return props.pants || [];
    case "Shorts": return props.shorts;
    case "Skirt": return props.skirts;
    default: return [];
  }
}


</script>

<style scoped>
/* Hero Section */
/* .hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
} */
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
  grid-template-columns: repeat(4, minmax(260px,600px));
  /* height: 300px; */
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

/* .image-1-img {
  width: 720px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
} */

.hero-title {
  font-size: 3rem; /* equivalent to text-5xl */
  font-family: serif;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 2rem; /* equivalent to text-4xl */
}

.hero-button {
  background-color: #2d3748; /* gray-800 */
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.hero-button:hover {
  background-color: #4a5568; /* gray-700 */
}
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
