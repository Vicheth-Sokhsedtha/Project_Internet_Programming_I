<template>
  <div class="product-card">
    <div>
      <img :src="product.image" alt="Summer Dress" />
    </div>

    <div class="Detail-product">
      <h2 class="nameproduct">{{ product.name }}</h2>

      <p class="price">Price: ${{ product.price.toFixed(2) }}</p>

      <label class="size" for="size">Size:</label>
      <select v-model="selectedSize">
        <option v-for="size in product.sizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <div class="quantiyAndtotal">
        <div class="quantity-control">
          <button @click="decreaseQty">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQty">+</button>
        </div>

        <p class="totalprice">Total: ${{ totalPrice.toFixed(2) }}</p>
      </div>

      <div class="button-group">
        <button class="addTocart" @click="addToCart">Add to Cart</button>
        <button class="view-cart-btn" @click="goToCart">View Cart ({{ cartStore.itemCount }})</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

export default defineComponent({
  name: 'ProductDetail',
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    const product = {
      name: 'Summer Dress',
      price: 25.0,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      image: '/image/popupar 15.png'
    };

    const selectedSize = ref('M');
    const quantity = ref(1);

    const totalPrice = computed(() => product.price * quantity.value);

    const increaseQty = () => {
      quantity.value++;
    };

    const decreaseQty = () => {
      if (quantity.value > 1) quantity.value--;
    };

    const addToCart = () => {
      cartStore.addItem({
        name: product.name,
        price: product.price,
        size: selectedSize.value,
        qty: quantity.value,
        image: product.image,
        quality: 1
      });

      alert(`Added ${quantity.value} ${product.name}(s) - Size ${selectedSize.value} to cart.`);
      // Reset quantity after adding to cart
      quantity.value = 1;
    };

    const goToCart = () => {
      router.push({ name: 'Cart' });
    };

    return {
      product,
      selectedSize,
      quantity,
      totalPrice,
      cartStore,
      increaseQty,
      decreaseQty,
      addToCart,
      goToCart
    };
  }
});
</script>

<style scoped>
.product-card {
  width: 1340px;
  border: 1px solid #ccc;
  padding: 5rem;
  border-radius: 8px;
  background-color: rgba(243, 173, 173, 0.19);
  display: flex;
  color: black;
  gap: 50px;
}

.Detail-product {
  margin: 25px;
  flex-direction: column;
  width: 500px;
}

.nameproduct {
  font-weight: bolder;
  padding: 10px;
  text-align: center;
}

.price {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.size {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

select {
  width: 120px;
  padding: 8px;
  border: 1px solid #888;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
  cursor: pointer;
}

.quantiyAndtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}

.quantity-control {
  display: flex;
  gap: 10px;
  align-items: center;
}

.quantity-control button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-weight: 700;
}

.totalprice {
  font-weight: bold;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 20px;
}

.addTocart {
  background-color: green;
  color: white;
  font-weight: bold;
  width: 150px;
  height: 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.view-cart-btn {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  width: 150px;
  height: 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.addTocart:hover, .view-cart-btn:hover {
  opacity: 0.9;
}
</style>
