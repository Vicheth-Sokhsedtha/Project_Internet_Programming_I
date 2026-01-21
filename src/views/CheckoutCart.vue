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
import { defineComponent, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";

export default defineComponent({
  name: "CheckoutCart",

  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    const discount = computed(() => 0);
    const delivery = computed(() => 5.0);
    const total = computed(
      () => cartStore.subtotal - discount.value + delivery.value
    );

    // Processing state
    const isProcessing = ref(false);

    // File inputs
    const uploadedFile = ref<File | null>(null);
    const locationImageFile = ref<File | null>(null);
    const receiptInput = ref<HTMLInputElement | null>(null);
    const locationInput = ref<HTMLInputElement | null>(null);

    // Form fields
    const storedLocation = ref("");
    const contactNumber = ref("");
    const email = ref("");

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("❌ File too large! Please upload an image smaller than 5MB.");
          if (receiptInput.value) receiptInput.value.value = "";
          return;
        }
        uploadedFile.value = file;
        console.log(`✅ Receipt file selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      }
    };

    const handleLocationImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("❌ File too large! Please upload an image smaller than 5MB.");
          if (locationInput.value) locationInput.value.value = "";
          return;
        }
        locationImageFile.value = file;
        console.log(`✅ Location image selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      }
    };

    const pay = async () => {
      // Prevent double submission
      if (isProcessing.value) {
        console.log("⏳ Already processing, please wait...");
        return;
      }

      console.log("🔍 Starting payment validation...");

      // ✅ Validation 1: Check if user is logged in
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert(
          "❌ LOGIN REQUIRED\n\nYou must login to checkout.\n\nPlease login to your account first."
        );
        router.push({ name: "login" });
        return;
      }
      console.log("✅ User ID:", userId);

      // ✅ Validation 2: Check if payment receipt is uploaded
      if (!uploadedFile.value) {
        alert(
          "❌ PAYMENT RECEIPT REQUIRED\n\nPlease upload your payment receipt (screenshot/photo of payment confirmation)."
        );
        return;
      }
      console.log("✅ Payment receipt uploaded");

      // ✅ Validation 3: Check if delivery location is provided
      if (!storedLocation.value.trim()) {
        alert(
          "❌ DELIVERY ADDRESS REQUIRED\n\nPlease enter your delivery address.\n\nExample: 123 Main St, City, Country"
        );
        return;
      }
      console.log("✅ Delivery address:", storedLocation.value);

      // ✅ Validation 4: Check contact number
      if (!contactNumber.value.trim()) {
        alert("❌ CONTACT NUMBER REQUIRED\n\nPlease enter your contact number.");
        return;
      }
      console.log("✅ Contact number:", contactNumber.value);

      // ✅ Validation 5: Check email
      if (!email.value.trim()) {
        alert("❌ EMAIL REQUIRED\n\nPlease enter your email address.");
        return;
      }
      console.log("✅ Email:", email.value);

      // ✅ Validation 6: Check if cart is empty
      if (cartStore.items.length === 0) {
        alert("❌ EMPTY CART\n\nYour cart is empty. Please add items before checkout.");
        return;
      }
      console.log("✅ Cart has", cartStore.items.length, "items");

      isProcessing.value = true;

      try {
        // Prepare items for bulk order
        const items = cartStore.items.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.qty),
          total: Number((item.price * item.qty).toFixed(2)),
        }));

        console.log("📦 Prepared items:", items);

        // Create orderData object
        const orderDataObj = {
          userId: Number(userId),
          items: items,
          paymentMethod: "QR Code",
          deliveryAddress: storedLocation.value.trim(),
          contactNumber: contactNumber.value.trim(),
          email: email.value.trim(),
        };

        console.log("📋 Order data object:", orderDataObj);

        // Build FormData payload
        const formData = new FormData();

        // Add receipt file (required)
        formData.append("receipt", uploadedFile.value);
        console.log("✅ Added receipt to FormData");

        // Add location image if provided
        if (locationImageFile.value) {
          formData.append("locationImage", locationImageFile.value);
          console.log("✅ Added location image to FormData");
        }

        // IMPORTANT: Convert orderData to JSON string
        const orderDataString = JSON.stringify(orderDataObj);
        formData.append("orderData", orderDataString);
        console.log("✅ Added orderData to FormData (stringified)");
        console.log("📤 Order data string:", orderDataString);

        // Log FormData contents
        console.log("\n📤 Sending FormData with:");
        formData.forEach((value, key) => {
          if (value instanceof File) {
            console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`  - ${key}: ${value}`);
          }
        });


        const apiUrl = "http://localhost:5000/api/orders/bulk";
        console.log(`\n🌐 Sending POST request to: ${apiUrl}`);

        // Send to backend
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - browser will set it automatically with boundary
        });

        console.log("📥 Response status:", response.status, response.statusText);

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Order created successfully:", result);

          alert(
            `✅ SUCCESS!\n\nYour payment has been submitted successfully.\n\n${result.orders.length} order(s) created.\n\nWe will review your receipt and confirm your order shortly.`
          );

          // Clear cart
          cartStore.clearCart();

          // Clear form
          storedLocation.value = "";
          contactNumber.value = "";
          email.value = "";
          uploadedFile.value = null;
          locationImageFile.value = null;

          // Clear file inputs
          if (receiptInput.value) receiptInput.value.value = "";
          if (locationInput.value) locationInput.value.value = "";

          // Redirect to home or orders page
          router.push({ name: "home" });
        } else {
          const errorText = await response.text();
          console.error("❌ Server error response:", errorText);

          let errorMessage = errorText;
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorText;
          } catch (e) {
            // errorText is not JSON, use as is
          }

          alert(
            `❌ ORDER SUBMISSION FAILED\n\nError: ${errorMessage}\n\nPlease check your information and try again.`
          );
        }
      } catch (error) {
        console.error("❌ Payment error:", error);
        alert(
          `❌ ERROR PROCESSING PAYMENT\n\nSomething went wrong while processing your order.\n\nError: ${error}\n\nPlease try again later.`
        );
      } finally {
        isProcessing.value = false;
        console.log("✅ Payment process completed");
      }
    };

    const goToCart = () => {
      router.push({ name: "Cart" });
    };

    const goToProductPage = () => {
      router.push({ name: "product" });
    };

    return {
      cartStore,
      discount,
      delivery,
      total,
      isProcessing,
      receiptInput,
      locationInput,
      handleFileUpload,
      handleLocationImageUpload,
      pay,
      goToCart,
      goToProductPage,
      storedLocation,
      contactNumber,
      email,
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
