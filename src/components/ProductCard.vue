<template>
  <div class="card">
    <img :src="image" class="product-img" />

    <div class="info">
      <div class="name">{{ name }}</div>

      <div class="price-row">
        <span class="old-price" v-if="oldPrice">
          ${{ oldPrice.toFixed(2) }}
        </span>

        <span class="new-price">
          ${{ price.toFixed(2) }}
        </span>

        <button class="add-btn">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  price: number;
  oldPrice?: number;  // optional
  image: string;
}>();

</script>

<style scoped>
.card {
  width: 281px;
  height: 409px;
  background: #ffffff;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* Product Image */
.product-img {
  width: 100%;
  height: 260px;
  object-fit: contain;
}

/* Info Section */
.info {
  margin-top: 10px;
}

/* Product Name */
.name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

/* Price Row */
.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Pricing */
.old-price {
  color: red;
  text-decoration: line-through;
  font-size: 15px;
  margin-right: 5px;
}

.new-price {
  font-size: 16px;
  font-weight: 600;
}

/* Add Button */
.add-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
}
</style>
