<template>
  <div class="home-page">
    <div class="welcome-container">
      <h2>Welcome to S3DStyle!</h2>
      <p>You are now logged in and can browse our products.</p>

      <!-- Add your product listing or dashboard content here -->
      <div class="dashboard-content">
        <h3>Your Dashboard</h3>
        <div class="dashboard-cards">
          <div class="card">
            <h4>Products</h4>
            <p>Browse our 3D style products</p>
          </div>
          <div class="card">
            <h4>Cart</h4>
            <p>Manage your shopping cart</p>
          </div>
          <div class="card">
            <h4>Orders</h4>
            <p>View your order history</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// You can add home page logic here
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-container {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 2rem;
}

.welcome-container h2 {
  color: #42b983;
  margin-bottom: 1rem;
}

.welcome-container p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.dashboard-content {
  margin-top: 3rem;
  text-align: left;
}

.dashboard-content h3 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  font-size: 0.9rem;
}
</style>
