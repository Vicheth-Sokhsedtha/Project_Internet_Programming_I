<template>
  <div class="section">
    <h2 class="title" v-if="title">{{ title }}</h2>

    <div class="grid">
      <ProductCard
        v-for="item in displayedItems"
        :key="item.id"
        v-bind="item"
      />
    </div>

    <div class="more" v-if="!showAll && items.length > limit">
      <button class="see-more-btn" @click="showAll = true">
        See more →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed } from "vue";
import ProductCard from "./ProductCard.vue";


interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category?: string;
}

const props = defineProps<{
  title: string;
  items: Product[];
}>();

const limit = 8; // 2 rows
const showAll = ref(false);

const displayedItems = computed(() =>
  showAll.value ? props.items : props.items.slice(0, limit)
);
</script>

<style scoped>
.section {
  padding: 60px 0;
  margin-top: 40px;
}

.title {
  text-align: center;
  font-size: 32px;
  font-family: "Playfair Display", serif;
  font-weight: 700;
  margin-bottom: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 281px);
  justify-content: center;
  gap: 40px 32px;
  padding: 0 120px;
}

.more {
  text-align: right;
  padding-right: 120px;
  margin-top: 25px;
}

.see-more-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.see-more-btn:hover {
  opacity: 1;
}
</style>
