<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProductById, Product } from '../data/product';
import { useCartStore } from '../stores/cart'; // adjust path if needed

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const productId = Number(route.params.id);
const product = getProductById(productId) as Product | undefined;

// reactive state
const selectedSize = ref(product?.sizes[0] ?? 'M');
const quantity = ref(1);

const totalPrice = computed(() => (product ? product.price * quantity.value : 0));

const increaseQty = () => {
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};

const addToCart = () => {
  if (!product) return;
  alert(`Added ${quantity.value} ${product.name}(s) - Size ${selectedSize.value} to cart.`);
  cartStore.addItem({
    ...product,
    size: selectedSize.value,
    qty: quantity.value,   // matches interface
  });

   router.push({ name: 'Cart' });
  // Reset quantity after adding to cart
  quantity.value = 1;
};

const goToCart = () => {
  router.push({ name: 'Cart' });
};
</script>

<template>
  <section v-if="product" class="detail-section">
    <div class="detail-container">
      <!-- Product Image -->
      <div class="image-box">
        <img :src="product.image" :alt="product.name" />
      </div>

      <!-- Product Info -->
      <div class="info-box">
        <h2 class="name">{{ product.name }}</h2>

        <!-- Prices -->
        <div class="price-row">
          <span v-if="product.oldPrice" class="old-price">
            ${{ product.oldPrice.toFixed(2) }}
          </span>
          <span class="current-price">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>

        <!-- Size Selector -->
        <div class="size-selector">
          <label>Size:</label>
          <div class="sizes">
            <button
              v-for="size in product.sizes"
              :key="size"
              :class="{ active: size === selectedSize }"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Quantity Selector -->
        <div class="quantity-row">
          <label>Quantity:</label>
          <div class="quantity-control">
            <button @click="decreaseQty">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQty">+</button>
          </div>

          <p class="totalprice">Total: ${{ totalPrice.toFixed(2) }}</p>
        </div>

        <!-- Unit Price -->
        <p class="unit-price">
          Price per unit: ${{ product.price.toFixed(2) }}/{{ quantity }}
        </p>

        <!-- Add to Cart -->
        <div class="button-group">
          <button class="addTocart" @click="addToCart" >Add to Cart</button>
          <!-- <button class="view-cart-btn" @click="goToCart">View Cart ({{ cartStore.itemCount }})</button> -->
        </div>
      </div>
    </div>
  </section>

  <section v-else class="not-found">
    <p>Product not found.</p>
  </section>
</template>

<style scoped>
.detail-section {
  padding: 60px 80px;
  background: #D9CFC7;
  display: flex;
  justify-content: center;
}

.detail-container {
  display: flex;
  gap: 60px;
  max-width: 1200px;
  width: 1000px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-box {
  flex: 1;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.old-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 22px;
  font-weight: 700;
  color: #e74c3c;
}

.size-selector {
  margin-bottom: 20px;
}

.sizes {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.sizes button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
}

.sizes button.active {
  background: black;
  color: white;
  border-color: black;
}

.quantity-row {
  margin-bottom: 20px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  font-size: 18px;
  border-radius: 50%;
  background: black;
  color: white;
  border: none;
  cursor: pointer;
}

.unit-price {
  font-size: 16px;
  margin-bottom: 20px;
}

.addTocart {
  width: 180px;
  padding: 12px;
  border-radius: 8px;
  background: green;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.addTocart:hover {
  background: darkgreen;
}

.not-found {
  padding: 60px;
  text-align: center;
}
</style>
