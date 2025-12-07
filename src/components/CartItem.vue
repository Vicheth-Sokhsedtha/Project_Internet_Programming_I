<template>
  <div class="cart-item">
    <div class="info">
      <span class="name">{{ item.name }}</span>
      <span class="price">${{ item.price.toFixed(2) }}</span>
    </div>

    <div class="controls">
      <div class="qty">
        <button class="qty-btn" @click="decrease">-</button>
        <span class="qty-value">{{ item.qty }}</span>
        <button class="qty-btn" @click="increase">+</button>
      </div>

      <span class="total">${{ (item.price * item.qty).toFixed(2) }}</span>

      <button class="btn-cancel" @click="$emit('remove', item.id)">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'CartItem',
  props: {
    item: {
      type: Object as PropType<{ id: number; name: string; price: number; qty: number }>,
      required: true
    }
  },
  emits: ['update:qty', 'remove'],
  setup(props, { emit }) {
    const increase = () => emit('update:qty', props.item.id, props.item.qty + 1);
    const decrease = () => emit('update:qty', props.item.id, Math.max(1, props.item.qty - 1));
    return { increase, decrease };
  }
});
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fafafa;
  color: black;
}

.info {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.name {
  font-weight: 700;
}

.price {
  color: #555;
}

.controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.qty {
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
}

.btn-cancel {
  background: #dc3545; /* red */
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
