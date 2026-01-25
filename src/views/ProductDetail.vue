<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

interface Product {
  id: number
  name: string
  price: number
  oldPrice?: number
  image: string
  description?: string
  sizes?: string[]
}

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)

const selectedSize = ref('M')
const quantity = ref(1)

const fetchProduct = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${route.params.id}`)
    const data: Product = await res.json()
    product.value = data
    selectedSize.value = product.value?.sizes?.[0] ?? 'M'
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)

const totalPrice = computed(() => (product.value ? product.value.price * quantity.value : 0))

const increaseQty = () => quantity.value++
const decreaseQty = () => quantity.value > 1 && quantity.value--

const goBack = () => router.back()

// ✅ Correct Add to Cart function
const addToCart = () => {
  if (!product.value) return

  cartStore.addItem({
    id: product.value.id,   // ✅ allowed
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    size: selectedSize.value,
    qty: quantity.value,
  });


  router.push({ name: 'Cart' }) // navigate to Cart page
}

</script>

<template>
  <section v-if="loading" class="not-found">
    <p>Loading product...</p>
  </section>

  <section v-else-if="product" class="detail-section">
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
          <span class="current-price"> ${{ product.price.toFixed(2) }} </span>
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
          <p class="unit-price">Price per unit: ${{ product.price.toFixed(2) }}/1</p>
        </div>

        <!-- Unit Price -->
        <p class="totalprice">Total: ${{ totalPrice.toFixed(2) }}</p>

        <!-- Buttons -->
        <div class="button-group">
          <!-- ✅ Fix: lowercase click -->
          <button class="addTocart" @click="addToCart">Add to Cart</button>
          <button class="addTocart" style="background: #555" @click="goBack">Back</button>
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
  background: #d9cfc7;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
