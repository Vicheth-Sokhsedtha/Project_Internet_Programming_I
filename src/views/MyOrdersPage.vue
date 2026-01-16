<template>
  <div class="my-orders-container">
    <div class="orders-header">
      <h1>My Orders</h1>
      <button class="back-btn" @click="goBack">← Back to Home</button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <p>Loading your orders...</p>
    </div>

    <!-- No Orders State -->
    <div v-else-if="orders.length === 0" class="no-orders">
      <p>No orders yet</p>
      <button class="shop-btn" @click="goShopping">Continue Shopping</button>
    </div>

    <!-- Orders List -->
    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <!-- Order Header -->
        <div class="order-header">
          <div class="order-info">
            <h3 class="order-number">Order #{{ order.orderNumber }}</h3>
            <span :class="['status-badge', order.status.toLowerCase()]">
              {{ order.status }}
            </span>
          </div>
          <p class="order-date">{{ formatDate(order.createdAt) }}</p>
        </div>

        <!-- Product Details -->
        <div class="product-section">
          <img :src="order.product?.image" :alt="order.product?.name" class="product-image" />
          <div class="product-details">
            <h4>{{ order.product?.name }}</h4>
            <p class="category">{{ order.product?.category }}</p>
            <div class="qty-price">
              <span>Qty: {{ order.quantity }}</span>
              <span class="price">${{ order.total }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="payment-info">
          <h5>Payment Method</h5>
          <p>{{ order.paymentMethod }}</p>
        </div>

        <!-- Delivery Address -->
        <div class="delivery-info">
          <h5>Delivery Address</h5>
          <p>{{ order.deliveryAddress }}</p>
        </div>

        <!-- Receipt Section -->
        <div class="receipt-section">
          <h5>Payment Receipt</h5>
          <div v-if="order.paymentProof" class="receipt-container">
            <img :src="order.paymentProof" :alt="`Receipt for ${order.orderNumber}`" class="receipt-image" />
            <div class="receipt-actions">
              <button class="download-btn" @click="downloadReceipt(order)">Download Receipt</button>
              <button class="view-btn" @click="viewReceiptFull(order)">View Full Size</button>
            </div>
          </div>
          <div v-else class="no-receipt">
            <p>Receipt pending verification</p>
          </div>
        </div>

        <!-- QR Code Display (if available) -->
        <div v-if="order.qrCode" class="qr-section">
          <h5>Payment QR Code</h5>
          <img :src="order.qrCode" :alt="`QR Code for ${order.orderNumber}`" class="qr-code" />
        </div>

        <!-- Action Buttons -->
        <div class="order-actions">
          <button class="cancel-btn" v-if="order.status === 'Pending'" @click="cancelOrder(order.id)">
            Cancel Order
          </button>
          <button class="track-btn" @click="trackOrder(order.id)">
            Track Order
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Full View Modal -->
    <div v-if="showReceiptModal" class="modal-overlay" @click="closeReceiptModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeReceiptModal">×</button>
        <img v-if="selectedReceipt" :src="selectedReceipt" :alt="'Full Receipt'" class="full-receipt-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
  quantity: number;
  total: number;
  paymentMethod: string;
  paymentProof: string;
  deliveryAddress: string;
  qrCode: string;
  product: {
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

const orders = ref<Order[]>([]);
const isLoading = ref(true);
const showReceiptModal = ref(false);
const selectedReceipt = ref<string | null>(null);

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fetch user orders
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const userId = localStorage.getItem('userId') || '1'; // Get from auth

    const response = await fetch(`http://localhost:5000/api/products/orders/user/${userId}`);
    if (response.ok) {
      orders.value = await response.json();
    } else {
      console.error('Failed to fetch orders');
      orders.value = [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Download receipt
const downloadReceipt = (order: Order) => {
  const link = document.createElement('a');
  link.href = order.paymentProof;
  link.download = `receipt-${order.orderNumber}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// View receipt in full size
const viewReceiptFull = (order: Order) => {
  selectedReceipt.value = order.paymentProof;
  showReceiptModal.value = true;
};

// Close receipt modal
const closeReceiptModal = () => {
  showReceiptModal.value = false;
  selectedReceipt.value = null;
};

// Cancel order
const cancelOrder = async (orderId: number) => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      const response = await fetch(`http://localhost:5000/api/products/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Order cancelled successfully');
        await fetchOrders();
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  }
};

// Track order
const trackOrder = (orderId: number) => {
  router.push(`/order-tracking/${orderId}`);
};

// Navigation
const goBack = () => {
  router.back();
};

const goShopping = () => {
  router.push('/product');
};

// Initialize
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.my-orders-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  background: #f5f0eb;
  min-height: 100vh;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.orders-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0;
}

.back-btn {
  background: #c9b59c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #b8a78b;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #999;
}

/* No Orders State */
.no-orders {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.no-orders p {
  font-size: 18px;
  color: #999;
  margin-bottom: 20px;
}

.shop-btn {
  background: #c9b59c;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background 0.3s;
}

.shop-btn:hover {
  background: #b8a78b;
}

/* Orders Grid */
.orders-grid {
  display: grid;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #c9b59c;
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0d7d0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-number {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: bold;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-date {
  color: #999;
  font-size: 14px;
  margin: 0;
}

/* Product Section */
.product-section {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e0d7d0;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.product-details {
  flex: 1;
}

.product-details h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.category {
  color: #999;
  font-size: 13px;
  margin: 5px 0;
}

.qty-price {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-weight: bold;
}

.price {
  color: #c9b59c;
  font-size: 18px;
}

/* Payment Info */
.payment-info,
.delivery-info {
  margin-bottom: 15px;
  padding: 10px 0;
}

.payment-info h5,
.delivery-info h5 {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-info p,
.delivery-info p {
  margin: 0;
  color: #333;
  font-size: 14px;
}

/* Receipt Section */
.receipt-section {
  margin-bottom: 15px;
  padding: 15px;
  background: #f9f7f4;
  border-radius: 8px;
}

.receipt-section h5 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.receipt-container {
  text-align: center;
}

.receipt-image {
  max-width: 100%;
  height: auto;
  max-height: 300px;
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.receipt-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.download-btn,
.view-btn {
  background: #c9b59c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background 0.3s;
}

.download-btn:hover,
.view-btn:hover {
  background: #b8a78b;
}

.no-receipt {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* QR Code Section */
.qr-section {
  margin-bottom: 15px;
  padding: 15px;
  background: #f9f7f4;
  border-radius: 8px;
  text-align: center;
}

.qr-section h5 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qr-code {
  width: 150px;
  height: 150px;
  border-radius: 6px;
}

/* Order Actions */
.order-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0d7d0;
}

.cancel-btn,
.track-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #d32f2f;
}

.track-btn {
  background: #c9b59c;
  color: white;
}

.track-btn:hover {
  background: #b8a78b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: #f44336;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #d32f2f;
}

.full-receipt-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .product-section {
    flex-direction: column;
  }

  .order-actions {
    flex-direction: column;
  }

  .receipt-actions {
    flex-direction: column;
  }

  .download-btn,
  .view-btn {
    width: 100%;
  }
}
</style>
