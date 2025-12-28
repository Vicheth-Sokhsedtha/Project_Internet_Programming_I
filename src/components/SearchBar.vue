<template>
  <div class="search-box">
    <input type="text" placeholder="Search" />
    <span class="icon">🔍</span>
  </div>
</template>

<style scoped>
.search-box {
  width: 60%;
  display: flex;
  justify-content: space-between;
  background: #C9B59C;
  padding: 10px 18px;
  border-radius: 28px;
  margin: 22px auto;
}
input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
}
.icon {
  font-size: 20px;
}
</style>
