<template>
  <div class="card">
    <RouterLink
      :to="{ name: 'ProductDetail', params: { id } }"
      class="product"
    >
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
        </div>
      </div>
    </RouterLink>

    <!-- Add to cart button outside RouterLink so click doesn't navigate -->
    <button class="add-btn" @click="addToCart">+</button>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'; // adjust path
const cartStore = useCartStore();

const props = defineProps<{
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
}>();

const addToCart = () => {
  cartStore.addItem({
    id: props.id,
    name: props.name,
    price: props.price,
    image: props.image,
    size: 'M',
    qty: 1
  });

  alert(`Added ${props.name} to cart.`);
};
</script>

<style scoped>
.product {
  text-decoration: none;
  color: inherit;
}
.card {
  width: 281px;
  height: 409px;
  background: #ffffff;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
}
.product-img {
  width: 100%;
  height: 260px;
  object-fit: contain;
}
.info {
  margin-top: 10px;
}
.name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}
.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
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
.add-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  bottom: 15px;
  right: 15px;
}
</style>
