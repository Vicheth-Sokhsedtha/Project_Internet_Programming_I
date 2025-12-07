<template>
  <div>
    <ProductCard />

  </div>
  <div>
    <CartView/>
  </div>
</template>

<script lang="ts">
import ProductCard from '../components/Detailpage.vue';
// import CartView from './CartView.vue';


export default {
  components: {
    ProductCard

  }

};
</script>
