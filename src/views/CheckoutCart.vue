<template>
  <div class="checkout-cart">
    <h2>Items</h2>
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>No items in cart</p>
      <button @click="goToProductPage" class="btn-add-products">Add Products</button>
    </div>
    <div v-else>

      <div class="items-checkout">
        <div class="summary-product">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img :src="item.image" alt="Dress" class="thumb" />
            <div class="details">
              <p><strong>{{ item.name }}</strong></p>
              <p>Size: {{ item.size }}</p>

              <div class="quantity">
                <span>Quantity: {{ item.qty }}</span>
              </div>
              <p class="price">${{ (item.price * item.qty).toFixed(2) }}</p>
            </div>
          </div>
        </div>
          <div class="checkout-section">
            <h3>Checkout</h3>
            <input type="file" @change="handleFileUpload" />
            <button class="pay-btn" @click="pay">Pay</button>
            <p class="note">*Note: I must submit your recipe in the box</p>
          </div>

      </div>
        <h3>Order Summary</h3>
        <div class="summary">
          <div class="summary-row">
            <span class="label">Subtotal:</span>
            <span class="value">${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span class="label">Discount:</span>
            <span class="value">-${{ discount.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span class="label">Delivery:</span>
            <span class="value">${{ delivery.toFixed(2) }}</span>
          </div>

          <div class="summary-total">
            <span class="label">Total:</span>
            <span class="total-value">${{ total.toFixed(2) }}</span>
          </div>
        </div>


        <div class="checkout-actions">
          <button @click="goToCart" class="btn-back">Back to Cart</button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

export default defineComponent({
  name: 'CheckoutCart',
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    const discount = computed(() => 0);
    const delivery = computed(() => 5.0);
    const total = computed(() => cartStore.subtotal - discount.value + delivery.value);

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`File "${file.name}" uploaded.`);
      }
    };

    const pay = () => {
      alert(`Payment submitted. Total: $${total.value.toFixed(2)}`);
      // Clear cart after payment
      cartStore.clearCart();
      router.push({ name: 'ProductDetail' });
    };

    const goToCart = () => {
      router.push({ name: 'Cart' });
    };

    const goToProductPage = () => {
      router.push({ name: 'product' });
    };

    return {
      cartStore,
      discount,
      delivery,
      total,
      handleFileUpload,
      pay,
      goToCart,
      goToProductPage
    };
  }
});
</script>

<style scoped>
.checkout-cart {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  background:  #D9CFC7;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.items-checkout{
  display: flex;
}
.summary-product{
  background-color: #EFE9E3;
  border-radius: 20px;
}

.btn-add-products {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
}

.cart-item {
  display: flex;
  width: 570px;
  height: 180px;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  border: 1px;
  background-color: rgba(243, 173, 173, 0.18);
  border-radius: 25px;
  margin: 20px;

}

.thumb {
  width: 100px;
  height: 80%;
  border-radius: 8px;
  margin: 20px;
}

.details {
  flex: 1;
  margin: 15px;
}

.quantity {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 8px 0;
}

.price {
  font-weight: bold;
  color: #063364;
}

.checkout-section {
  margin-top: 2px;
  background-color: #EFE9E3;
  margin-left: 10px;
  height: 450px;
  border-radius: 20px;
  text-align: center;
}

.pay-btn {
  background: green;
  color: white;
  font-weight: bolder;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  display: block;
  width: 100px;
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
  width: 200px;
}

.summary h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row .label {
  font-size: 14px;
  color: #666;
}

.summary-row .value {
  font-size: 14px;
  font-weight: 500;
  color: #333;

}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #333;
}

.summary-total .label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.summary-total .total-value {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}

.checkout-actions {
  margin-top: 2rem;
  text-align: center;
}

.btn-back {
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-back:hover,
.btn-add-products:hover {
  opacity: 0.9;
}
</style>
