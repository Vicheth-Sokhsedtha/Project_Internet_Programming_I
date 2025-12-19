<template>
  <header class="header">
    <div class="logo">S3DStyle</div>

    <nav class="nav">
      <a class="link">Home</a>
      <a class="link active">Product</a>
      <a class="link">About</a>
      <a class="link">Contact</a>
    </nav>

    <div class="right">
      <span class="cart"></span>
      <button class="login">Login</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  background: #C9B59C;         /* your exact beige color */
  padding: 22px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}

/* Logo */
.logo {
  font-size: 40px;
  font-family: "Playfair Display", semibold;
  font-weight: 600;
  color: #fff;                
}
.nav {
  display: flex;
  gap: 55px;                  
}

.link {
  font-size: 22px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
}
.active {
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
}
.right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.login {
  padding: 6px 18px;
  background: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.cart {
  font-size: 20px;
  width: 40px;
  height: 40px;
  background-image: url('/imgs/Shopping Cart.png'); /* change filename */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
