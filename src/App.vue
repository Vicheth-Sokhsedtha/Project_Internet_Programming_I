<template>
  <header>
    <nav>
      <router-link to="/Product">Home</router-link>
      <router-link to="/cart">Cart</router-link>
      <router-link to="/checkout">Checkout</router-link>
    </nav>
  </header>

  <router-view />
</template>

<style>
  body{
    background-color: rgba(217, 207, 199, 1);
    /* align-items: start; */
    justify-items: start;
  }

</style>
