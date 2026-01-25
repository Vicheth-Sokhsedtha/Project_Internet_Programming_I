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



  const addItem = (item: CartItem) => {
    const existingItem = items.value.find(
      i => i.id === item.id && i.size === item.size
    );

    if (existingItem) {
      existingItem.qty += item.qty;
    } else {
      items.value.push(item); // ✅ use the DB id directly
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

  // ✅ New: update size
  const updateSize = (id: number, size: string) => {
    const item = items.value.find(i => i.id === id);
    if (item) {
      item.size = size;
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
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  const itemCount = computed(() =>
    items.value.reduce((count, item) => count + item.qty, 0)
  );

  const getProductById = (id: number) =>
    items.value.find(p => p.id === id);

  const findByName = (name: string) =>
    items.value.filter(i =>
      i.name.toLowerCase().includes(name.toLowerCase())
    );

  return {
    items,
    subtotal,
    itemCount,
    addItem,
    updateQty,
    updateSize,   // ✅ expose new action
    removeItem,
    clearCart,
    getProductById,
    findByName
  };
});
