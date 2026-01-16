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
            <button class="btn-cancel" @click="cartStore.removeItem(item.id)">X</button>
          </div>

        </div>
          <div class="checkout-section">
            <h3>Checkout</h3>
            <br/>
            <br>
            <div class="QR bg-white p-10px">
              <img src="/public/image/QR.png" alt="">
            </div>
            <br>
            <br>
            <input type="file" @change="handleFileUpload" />
            <button class="pay-btn" @click="pay">Pay</button>
            <p class="note">*Note: I must submit your recipe in the box</p>

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
          <h4>Location</h4>
          <input
            v-model="storedLocation"
            type="text"
            placeholder="123 Main St, City, Country">
          <p>Upload Picture of your location</p>
          <input
            @change="handleLocationImageUpload"
            type="file"
            placeholder="picture of your location"
            accept="image/*">
          <a href="https://maps.app.goo.gl/pu5sbhKriyAf7pW2A?g_st=atm">Your Current location</a>

          <h4>Contact Number</h4>
          <input
            v-model="contactNumber"
            type="text"
            placeholder="+1234567890">
          <h4>Email</h4 >
          <input
            v-model="email"
            type="text"
            placeholder="welcomeourshop@gmail.com">
        </div>

      </div>
        <div class="checkout-actions">
          <button @click="goToCart" class="btn-back">Back to Cart</button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import type { CartItem } from "../stores/cart";

export default defineComponent({
  name: "CheckoutCart",

  props: {
    item: {
      type: Object as PropType<CartItem>,
      required: true,
    },
  },
  emits: ["update:qty", "update:size", "remove"],
  methods: {
    increaseQty() {
      this.$emit("update:qty", this.item.id, this.item.qty + 1);
    },
    decreaseQty() {
      if (this.item.qty > 1) {
        this.$emit("update:qty", this.item.id, this.item.qty - 1);
      }
    },
  },
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    const discount = computed(() => 0);
    const delivery = computed(() => 5.0);
    const total = computed(
      () => cartStore.subtotal - discount.value + delivery.value
    );

    // File inputs
    const uploadedFile = ref<File | null>(null);
    const locationImageFile = ref<File | null>(null);

    // Form fields
    const storedLocation = ref("");
    const contactNumber = ref("");
    const email = ref("");

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadedFile.value = file;
        alert(`Receipt file "${file.name}" selected.`);
      }
    };

    const handleLocationImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        locationImageFile.value = file;
        alert(`Location image "${file.name}" selected.`);
      }
    };

    const pay = async () => {
      if (!uploadedFile.value) {
        alert("Please upload payment receipt");
        return;
      }

      if (!storedLocation.value.trim()) {
        alert("Please enter location");
        return;
      }

      if (cartStore.items.length === 0) {
        alert("Cart is empty");
        return;
      }

      try {
        const firstItem = cartStore.items[0];

        // ✅ Ensure productId is a valid integer
        if (!firstItem.id || isNaN(Number(firstItem.id))) {
          alert("Invalid product ID");
          return;
        }

        // Build FormData payload
        const formData = new FormData();
        formData.append("receipt", uploadedFile.value);
        if (locationImageFile.value) {
          formData.append("locationImage", locationImageFile.value);
        }
        formData.append(
          "orderData",
          JSON.stringify({
            orderNumber: `ORD-${Date.now()}`, // ✅ unique order number
            userId: 1, // replace with logged-in user ID
            productId: Number(firstItem.id), // ✅ ensure integer
            quantity: firstItem.qty,
            total: total.value,
            paymentMethod: "QR Code",
            contactNumber: contactNumber.value,
            email: email.value,
            deliveryAddress: storedLocation.value,
          })
        );

        const response = await fetch(
          "http://localhost:5000/api/products/orders/create",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const order = await response.json();
          alert(`Payment submitted. Order Number: ${order.orderNumber}`);
          cartStore.clearCart();
          router.push({ name: "home" });
        } else {
          const errorText = await response.text();
          alert(`Error submitting order: ${errorText}`);
        }
      } catch (error) {
        console.error("Payment error:", error);
        alert("Error processing payment");
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
.location{
  margin-top: 25px;
  margin-left: 250px;
  background-color: #EFE9E3;
  height: 350px;
  border-radius: 20px;
  padding: 10px;
}
.location input{
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.location a{
  color: blue;
  text-decoration: none;
}

.location p{
  margin-top: 10px;
  font-size: smaller;
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

.btn-cancel {
  background: #dc3545;
  color: #fff;
  height: 40px;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 8px;
  cursor: pointer;
  font-weight: 700;

}

.btn-cancel:hover {
  opacity: 0.9;
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
.QR{
  background-color: white;
  img{
    width:200px;
    height:200px;
    padding:10px;
  }

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
