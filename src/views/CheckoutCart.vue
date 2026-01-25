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
            <img :src="item.image" alt="Product" class="thumb" />
            <div class="details">
              <p><strong>{{ item.name }}</strong></p>
              <p>Size: {{ item.size }}</p>
              <div class="quantity">
                <span>Quantity: {{ item.qty }}</span>
              </div>
              <p class="price">${{ (item.price * item.qty).toFixed(2) }}</p>
            </div>
            <button class="btn-cancel" @click="cartStore.removeItem(item.id)">X</button>
          </div>
        </div>

        <div class="checkout-section">
          <h3>Checkout</h3>
          <br />
          <div class="QR bg-white p-10px">
            <img src="/image/QR.png" alt="QR Code" />
          </div>
          <br />
          <label class="file-label">
            Upload Payment Receipt *
            <input
              ref="receiptInput"
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              required
            />
          </label>
          <button
            class="pay-btn"
            @click="pay"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Processing...' : 'Pay' }}
          </button>
          <p class="note">*Note: You must submit your receipt in the box</p>
        </div>
      </div>

      <div class="items-checkout">
        <div class="summary">
          <h3>Order Summary</h3>
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

        <div class="location">
          <h4>Location *</h4>
          <input
            v-model="storedLocation"
            type="text"
            placeholder="123 Main St, City, Country"
            required
          />
          <p>Upload Picture of your location (optional)</p>
          <input
            ref="locationInput"
            @change="handleLocationImageUpload"
            type="file"
            accept="image/*"
          />
          <a href="https://maps.app.goo.gl/pu5sbhKriyAf7pW2A?g_st=atm" target="_blank">
            Your Current location
          </a>

          <h4>Contact Number *</h4>
          <input
            v-model="contactNumber"
            type="tel"
            placeholder="+1234567890"
            required
          />

          <h4>Email *</h4>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div class="checkout-actions">
        <button @click="goToCart" class="btn-back">Back to Cart</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useCartStore } from "../stores/cart"; // adjust path if needed

export default defineComponent({
  name: "CheckoutCart",
  setup() {
    const cartStore = useCartStore();

    const receiptFile = ref<File | null>(null);
    const locationFile = ref<File | null>(null);
    const isProcessing = ref(false);

    const storedLocation = ref("");
    const contactNumber = ref("");
    const email = ref("");

    const discount = computed(() => 0);
    const delivery = computed(() => 5);
    const total = computed(
      () => cartStore.subtotal - discount.value + delivery.value
    );

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        receiptFile.value = target.files[0];
      }
    };

    const handleLocationImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        locationFile.value = target.files[0];
      }
    };

    const pay = async () => {
      if (!receiptFile.value) {
        alert("⚠️ Payment receipt is required. Please upload your receipt before proceeding.");
        return;
      }
      if (!storedLocation.value) {
        alert("📍 Location is required. Please enter your delivery address.");
        return;
      }
      if (!contactNumber.value) {
        alert("📞 Contact number is required. Please provide a valid phone number.");
        return;
      }
      if (!email.value) {
        alert("✉️ Email address is required. Please enter your email.");
        return;
      }

      isProcessing.value = true;
      try {
        const formData = new FormData();
        formData.append("receipt", receiptFile.value);
        if (locationFile.value) formData.append("locationImage", locationFile.value);
        formData.append("storedLocation", storedLocation.value);
        formData.append("contactNumber", contactNumber.value);
        formData.append("email", email.value);
        formData.append("items", JSON.stringify(cartStore.items));
        formData.append("total", total.value.toString());

        await fetch("/api/orders", {
          method: "POST",
          body: formData,
        });

        alert("✅ Payment submitted successfully! Thank you for your order.");
        cartStore.clearCart();
      } catch (err) {
        console.error(err);
        alert("❌ Something went wrong while submitting your payment. Please try again.");
      } finally {
        isProcessing.value = false;
      }
    };

    const goToProductPage = () => {
      window.location.href = "/products";
    };

    const goToCart = () => {
      window.location.href = "/cart";
    };

    return {
      cartStore,
      discount,
      delivery,
      total,
      storedLocation,
      contactNumber,
      email,
      isProcessing,
      handleFileUpload,
      handleLocationImageUpload,
      pay,
      goToProductPage,
      goToCart,
    };
  },
});
</script>

<style scoped>
.checkout-cart {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  background: #d9cfc7;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.items-checkout {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.summary-product {
  background-color: #efe9e3;
  border-radius: 20px;
  padding: 10px;
  flex: 1;
}

.btn-add-products {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
}

.btn-add-products:hover {
  background: #0056b3;
}

.location {
  background-color: #efe9e3;
  border-radius: 20px;
  padding: 20px;
  min-width: 300px;
}

.location h4 {
  margin-top: 15px;
  margin-bottom: 8px;
  font-weight: 600;
}

.location input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.location a {
  color: #007bff;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

.location a:hover {
  text-decoration: underline;
}

.location p {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
}

.cart-item {
  display: flex;
  gap: 16px;
  margin-bottom: 15px;
  padding: 15px;
  background-color: rgba(243, 173, 173, 0.18);
  border-radius: 15px;
  align-items: center;
}

.btn-cancel {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
  min-width: 40px;
  height: 40px;
}

.btn-cancel:hover {
  background: #c82333;
}

.thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.details {
  flex: 1;
}

.details p {
  margin: 5px 0;
}

.quantity {
  margin: 8px 0;
  color: #666;
}

.price {
  font-weight: bold;
  color: #063364;
  font-size: 18px;
}

.checkout-section {
  background-color: #efe9e3;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  min-width: 280px;
}

.checkout-section h3 {
  margin-bottom: 20px;
  font-weight: 600;
}

.QR {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  display: inline-block;
  margin: 10px 0;
}

.QR img {
  width: 200px;
  height: 200px;
  display: block;
}

.file-label {
  display: block;
  margin: 15px 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.file-label input[type="file"] {
  display: block;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  font-size: 13px;
}

.pay-btn {
  background: #28a745;
  color: white;
  font-weight: bold;
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 15px;
  width: 100%;
  font-size: 16px;
  transition: background 0.3s;
}

.pay-btn:hover:not(:disabled) {
  background: #218838;
}

.pay-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.note {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
  font-style: italic;
}

.summary {
  background-color: #efe9e3;
  border-radius: 20px;
  padding: 20px;
  min-width: 250px;
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
  border-bottom: 1px solid #d0d0d0;
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
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
}

.btn-back:hover {
  background: #5a6268;
}
</style>
