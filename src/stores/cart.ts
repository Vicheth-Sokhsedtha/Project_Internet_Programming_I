import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  qty: number;
  image: string;
  quality?: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const existingItem = items.value.find(i =>
      i.name === item.name && i.size === item.size
    );

    if (existingItem) {
      existingItem.qty += item.qty;
    } else {
      const newItem = {
        ...item,
        id: Date.now()
      };
      items.value.push(newItem);
    }
  };

  const updateQty = (id: number, qty: number) => {
    const item = items.value.find(i => i.id === id);
    if (item) {
      if (qty > 0) {
        item.qty = qty;
      } else {
        removeItem(id);
      }
    }
  };

  const removeItem = (id: number) => {
    const index = items.value.findIndex(i => i.id === id);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
  );

  const itemCount = computed(() =>
    items.value.reduce((count, item) => count + item.qty, 0)
  );

  return {
    items,
    subtotal,
    itemCount,
    addItem,
    updateQty,
    removeItem,
    clearCart
  };
});
