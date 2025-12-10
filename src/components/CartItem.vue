<template>
  <div class="cart-item">
    <img :src="item.image" alt="Dress" class="thumb" />
    <div class="info">
      <p class="name">{{ item.name }}</p>
      <p>Size: {{ item.size }}</p>

      <p class="price">${{ item.price.toFixed(2) }} each</p>
    </div>
    <div class="controls">
      <div class="qty">
        <p>Quality: {{ item.quality  }}</p>
        <div class="qty-box">
          <button class="qty-btn" @click="decreaseQty">-</button>
          <span class="qty-value">{{ item.qty }}</span>
          <button class="qty-btn" @click="increaseQty">+</button>
        </div>


      </div>
      <p class="total">${{ (item.price * item.qty).toFixed(2) }}</p>
      <button class="btn-cancel" @click="$emit('remove', item.id)">Remove</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { CartItem } from '../stores/cart';

export default defineComponent({
  name: 'CartItem',
  props: {
    item: {
      type: Object as PropType<CartItem>,
      required: true
    }
  },
  emits: ['update:qty', 'remove'],
  methods: {
    increaseQty() {
      this.$emit('update:qty', this.item.id, this.item.qty + 1);
    },
    decreaseQty() {
      if (this.item.qty > 1) {
        this.$emit('update:qty', this.item.id, this.item.qty - 1);
      }
    }
  }
});
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fafafa;
  color: black;
  align-items: center;
  background-color: rgba(243, 173, 173, 0.19);
}

.thumb {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-weight: 700;
  margin-bottom: 4px;
}

.price {
  color: #555;
  margin: 4px 0;
}

.controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.qty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qty-box{
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-weight: 700;
}

.qty-value {
  min-width: 20px;
  text-align: center;
  font-weight: 700;
}

.total {
  font-weight: 700;
  min-width: 80px;
  text-align: right;
}

.btn-cancel {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
}
.btn-cancel:hover {
  opacity: 0.9;
}
</style>
