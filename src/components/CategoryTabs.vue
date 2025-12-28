<template>
  <div class="tabs">
    <button v-for="tab in tabs" :key="tab" class="tab-btn">
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
const tabs = ["Dress", "T-shirts", "Shirts", "Jacket", "More"];
</script>

<style scoped>
.tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}
.tab-btn {
  padding: 8px 20px;
  border: none;
  background: white;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
