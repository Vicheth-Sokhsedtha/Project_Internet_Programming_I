<template>
  <div class="section">
    <h2 class="title">{{ title }}</h2>

    <div class="grid" >
      <ProductCard
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :price="item.price"
        :oldPrice="item.oldPrice"
        :image="item.image"
      />

    </div>

    <div class="more">see more →</div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from "./ProductCard.vue";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
}

defineProps<{
  title: string;
  items: Product[];
}>();

</script>


<style scoped>
.section {
  padding: 60px 0;               /* more breathing like Figma */
  margin-top: 40px;
}

.title {
  text-align: center;
  font-size: 32px;
  font-family: "Playfair Display", serif;
  font-weight: 700;
  margin-bottom: 40px;
}

/* Perfect Figma 4-column grid */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 281px); /* exact card width */
  justify-content: center;
  gap: 40px 32px; /* row-gap, column-gap */
  padding: 0 120px;
}


/* “see more →” bottom right */
.more {
  text-align: right;
  padding-right: 120px;          /* align with grid */
  margin-top: 25px;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;
}
.more:hover {
  opacity: 1;
}

</style>
