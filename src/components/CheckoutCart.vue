<template>
  <div class="checkout-cart">
    <h2>Items</h2>
    <div v-for="item in cart" :key="item.id" class="cart-item">
      <img :src="item.image" alt="Dress" class="thumb" />
      <div class="details">
        <p><strong>{{ item.name }}</strong></p>
        <p>Size: {{ item.size }}</p>
        <p>Quality: {{ item.quality }}</p>
        <div class="quantity">
          <button @click="decreaseQty(item.id)">-</button>
          <span>{{ item.qty }}</span>
          <button @click="increaseQty(item.id)">+</button>
        </div>
        <p class="price">${{ item.price.toFixed(2) }}</p>
        <button class="remove-btn" @click="removeItem(item.id)">❌</button>
      </div>
    </div>

    <div class="checkout-section">
      <h3>Checkouts</h3>
      <input type="file" @change="handleFileUpload" />
      <button class="pay-btn" @click="pay">Pay</button>
      <p class="note">*Note: I must submit your recipe in the box</p>
    </div>

    <div class="summary">
      <h3>Order Summary</h3>
      <p>Subtotal: ${{ subtotal.toFixed(2) }}</p>
      <p>Discount: ${{ discount.toFixed(2) }}</p>
      <p>Delivery: ${{ delivery.toFixed(2) }}</p>
      <p><strong>Total: ${{ total.toFixed(2) }}</strong></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  name: 'CheckoutCart',
  setup() {
    const cart = reactive([
      {
        id: 1,
        name: 'Summer dress',
        size: 'M',
        quality: 1,
        qty: 1,
        price: 25.0,
        image: '/image/purple-dress.png'
      },
      {
        id: 2,
        name: 'Summer dress',
        size: 'M',
        quality: 1,
        qty: 1,
        price: 25.0,
        image: '/image/purple-dress.png'
      }
    ]);

    const discount = computed(() => 0);
    const delivery = computed(() => 5.0);
    const subtotal = computed(() =>
      cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    );
    const total = computed(() => subtotal.value - discount.value + delivery.value);

    const increaseQty = (id: number) => {
      const item = cart.find((i) => i.id === id);
      if (item) item.qty++;
    };

    const decreaseQty = (id: number) => {
      const item = cart.find((i) => i.id === id);
      if (item && item.qty > 1) item.qty--;
    };

    const removeItem = (id: number) => {
      const index = cart.findIndex((i) => i.id === id);
      if (index !== -1) cart.splice(index, 1);
    };

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`File "${file.name}" uploaded.`);
      }
    };

    const pay = () => {
      alert(`Payment submitted. Total: $${total.value.toFixed(2)}`);
    };

    return {
      cart,
      subtotal,
      discount,
      delivery,
      total,
      increaseQty,
      decreaseQty,
      removeItem,
      handleFileUpload,
      pay
    };
  }
});
</script>

<style scoped>
.checkout-cart {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.thumb {
  width: 100px;
  height: auto;
  border-radius: 8px;
}

.details {
  flex: 1;
}

.quantity {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 8px 0;
}

.quantity button {
  width: 28px;
  height: 28px;
  font-weight: bold;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
}

.price {
  font-weight: bold;
}

.remove-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: red;
}

.checkout-section {
  margin-top: 30px;
}

.pay-btn {
  background: green;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.note {
  font-size: 12px;
  color: #555;
  margin-top: 8px;
}

.summary {
  margin-top: 30px;
  border-top: 1px dashed #ccc;
  padding-top: 20px;
}

.summary p {
  margin: 6px 0;
}
</style>
