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
      <button class="addTocart" @click="addToCart">Add to Cart</button>

    </div>


  </div>
</template>

<script lang="ts">

export default {
  name: 'ProductCard',
  data() {
    return {
      product: {
        name: 'Summer Dress',
        price: 25.0,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        image: '../public/image/popupar 15.png'

      },
      selectedSize: 'M',
      quantity: 1
    };
  },
  computed: {
    totalPrice() {
      return this.product.price * this.quantity;
    }
  },
  methods: {
    increaseQty() {
      this.quantity++;
    },
    decreaseQty() {
      if (this.quantity > 1) this.quantity--;
    },
    addToCart() {
      alert(`Added ${this.quantity} ${this.product.name}(s) - Size ${this.selectedSize} to cart.`);
    }
  }
};
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

/* ✅ Size selector styled like a box */
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

/* ✅ Quantity and total price on same line */
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

.totalprice {
  font-weight: bold;
  font-size: 16px;
}

/* ✅ Center Add to Cart button */
.addTocart {
  background-color: green;
  color: white;
  font-weight: bold;
  width: 150px;
  height: 40px;
  border-radius: 10px;
  display: block;
  margin: 20px auto; /* centers horizontally */
  text-align: center;
  cursor: pointer;
}
</style>

