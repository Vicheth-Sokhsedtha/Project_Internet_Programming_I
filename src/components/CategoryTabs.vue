<template>
  <div>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <section class="hero">
        <div class="hero-text">
          <h1>Make you look</h1>
          <h1 class="bold">Beautiful and</h1>
          <h1 class="bold">Dignified.</h1>
        </div>
        <img src="/image/image 1.png" class="image-1-img" />
     </section>

    <!-- Show product sections based on active tab -->
    <ProductSection
      v-if="activeTab === 'All'"
      title=""
      :items="props.discountProducts"
    />
    <ProductSection
      v-if="activeTab === 'Dress'"
      title="Dress"
      :items="props.dress"
    />
    <ProductSection
      v-if="activeTab === 'T-shirts' || activeTab === 'Shirts'"
      title="T-Shirts & Shirt"
      :items="props.tshirts"
    />
    <ProductSection
      v-if="activeTab === 'Jacket'"
      title="Jacket & Hoodie"
      :items="props.jacket"
    />
    <ProductSection
      v-if="activeTab === 'Crop Top'"
      title="Crop Top"
      :items="props.cropTop"
    />
    <ProductSection
      v-if="activeTab === 'Shorts'"
      title="Shorts"
      :items="props.shorts"
    />
    <ProductSection
      v-if="activeTab === 'Skirts'"
      title="Skirts"
      :items="props.skirts"
    />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProductSection from './ProductSection.vue'; // Make sure to import ProductSection

// Define props to receive product data from parent
interface Props {
  discountProducts: any[];
  dress: any[];
  tshirts: any[];
  jacket: any[];
  cropTop: any[];
  shorts: any[];
  skirts: any[];
}

const props = defineProps<Props>();

const tabs = ["All", "Dress", "T-shirts", "Shirts", "Jacket", "Shorts", "Skirts", "Crop Top"];
const activeTab = ref("All");
</script>

<style scoped>
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
