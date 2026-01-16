<template>
  <div class="admin-orders-container">
    <div class="admin-header">
      <h1>Admin - Order Management</h1>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Orders</h3>
        <p class="stat-number">{{ orders.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Pending</h3>
        <p class="stat-number" style="color: #ff9800">{{ pendingCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Completed</h3>
        <p class="stat-number" style="color: #4caf50">{{ completedCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-section">
      <select v-model="filterStatus" class="filter-select">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search order number..."
        class="search-input"
      />
    </div>

    <!-- Orders Table -->
    <div class="orders-table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Receipt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="order-number-cell">{{ order.orderNumber }}</td>
            <td>{{ order.user?.username }}</td>
            <td>{{ order.product?.name }}</td>
            <td>${{ order.total }}</td>
            <td>
              <span :class="['status-badge', order.status.toLowerCase()]">
                {{ order.status }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button
                v-if="order.paymentProof"
                class="view-receipt-btn"
                @click="viewReceipt(order)"
              >
                View
              </button>
              <span v-else class="no-receipt">Pending</span>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  v-if="order.status === 'Pending' && order.paymentProof"
                  class="approve-btn"
                  @click="approveOrder(order.id)"
                >
                  Approve
                </button>
                <button
                  v-if="order.status !== 'Cancelled'"
                  class="cancel-btn"
                  @click="rejectOrder(order.id)"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <div v-if="selectedOrder" class="receipt-details">
          <h2>Order {{ selectedOrder.orderNumber }}</h2>

          <div class="order-info-grid">
            <div>
              <h4>Customer</h4>
              <p>{{ selectedOrder.user?.username }}</p>
              <p>{{ selectedOrder.user?.email }}</p>
            </div>
            <div>
              <h4>Product</h4>
              <p>{{ selectedOrder.product?.name }}</p>
              <p>${{ selectedOrder.product?.price }}</p>
            </div>
            <div>
              <h4>Amount</h4>
              <p style="font-size: 24px; font-weight: bold; color: #c9b59c">${{ selectedOrder.total }}</p>
            </div>
            <div>
              <h4>Status</h4>
              <span :class="['status-badge', selectedOrder.status.toLowerCase()]">
                {{ selectedOrder.status }}
              </span>
            </div>
          </div>

          <div class="receipt-image-container">
            <h4>Payment Receipt</h4>
            <img v-if="selectedOrder.paymentProof" :src="selectedOrder.paymentProof" :alt="'Receipt'" class="receipt-image" />
          </div>

          <div v-if="selectedOrder.qrCode" class="qr-image-container">
            <h4>QR Code</h4>
            <img :src="selectedOrder.qrCode" :alt="'QR Code'" class="qr-image" />
          </div>

          <div class="delivery-info-box">
            <h4>Delivery Address</h4>
            <p>{{ selectedOrder.deliveryAddress }}</p>
          </div>

          <div v-if="selectedOrder.status === 'Pending'" class="approval-buttons">
            <button class="approve-btn" @click="approveOrderAndClose">
              ✓ Approve Payment
            </button>
            <button class="reject-btn" @click="rejectOrderAndClose">
              ✗ Reject Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface User {
  username: string;
  email: string;
  address?: string;
  phone?: string;
  city?: string;
}

interface Product {
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  productId: number;
  quantity: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentProof: string;
  qrCode: string;
  deliveryAddress: string;
  createdAt: string;
  user?: User;
  product?: Product;
}

const orders = ref<Order[]>([]);
const showReceiptModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const filterStatus = ref('');
const searchQuery = ref('');

// Computed
const pendingCount = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const completedCount = computed(() => orders.value.filter(o => o.status === 'Completed').length);

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const statusMatch = !filterStatus.value || order.status === filterStatus.value;
    const searchMatch = !searchQuery.value || order.orderNumber.includes(searchQuery.value);
    return statusMatch && searchMatch;
  });
});

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fetch orders
const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products/orders/all');
    if (response.ok) {
      orders.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// View receipt
const viewReceipt = (order: Order) => {
  selectedOrder.value = order;
  showReceiptModal.value = true;
};

// Close modal
const closeModal = () => {
  showReceiptModal.value = false;
  selectedOrder.value = null;
};

// Approve order
const approveOrder = async (orderId: number) => {
  if (confirm('Approve this order?')) {
    try {
      const response = await fetch(`http://localhost:5000/api/products/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });

      if (response.ok) {
        alert('Order approved!');
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  }
};

// Approve order from modal
const approveOrderAndClose = async () => {
  if (selectedOrder.value) {
    await approveOrder(selectedOrder.value.id);
    closeModal();
  }
};

// Reject order
const rejectOrder = async (orderId: number) => {
  if (confirm('Reject this order?')) {
    try {
      const response = await fetch(`http://localhost:5000/api/products/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });

      if (response.ok) {
        alert('Order rejected!');
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order');
    }
  }
};

// Reject order from modal
const rejectOrderAndClose = async () => {
  if (selectedOrder.value) {
    await rejectOrder(selectedOrder.value.id);
    closeModal();
  }
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  router.push('/login');
};

// Initialize
onMounted(() => {
  fetchOrders();
  // Refresh orders every 30 seconds
  setInterval(fetchOrders, 30000);
});
</script>

<style scoped>
.admin-orders-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  background: #f5f0eb;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0;
}

.logout-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #d32f2f;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #999;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  margin: 0;
  font-size: 32px;
  font-weight: bold;
  color: #c9b59c;
}

/* Filters */
.filter-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-select,
.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e0d7d0;
  border-radius: 6px;
  font-size: 14px;
}

.filter-select {
  max-width: 200px;
}

.search-input::placeholder {
  color: #ccc;
}

/* Table */
.orders-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background: #f5f0eb;
  border-bottom: 2px solid #e0d7d0;
}

.orders-table th {
  padding: 15px;
  text-align: left;
  font-weight: bold;
  color: #666;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.orders-table td {
  padding: 15px;
  border-bottom: 1px solid #e0d7d0;
  font-size: 14px;
}

.orders-table tbody tr:hover {
  background: #f9f7f4;
}

.order-number-cell {
  font-weight: bold;
  color: #c9b59c;
}

.status-badge {
  display: inline-block;
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

.view-receipt-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background 0.3s;
}

.view-receipt-btn:hover {
  background: #1976d2;
}

.no-receipt {
  color: #999;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.approve-btn,
.reject-btn,
.cancel-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background 0.3s;
}

.approve-btn {
  background: #4caf50;
  color: white;
}

.approve-btn:hover {
  background: #45a049;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #da190b;
}

.reject-btn {
  background: #f44336;
  color: white;
}

.reject-btn:hover {
  background: #da190b;
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
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 15px;
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

.receipt-details h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0d7d0;
}

.order-info-grid h4 {
  margin: 0 0 8px 0;
  color: #999;
  font-size: 12px;
  text-transform: uppercase;
}

.order-info-grid p {
  margin: 0;
  color: #333;
  font-size: 14px;
}

.receipt-image-container,
.qr-image-container {
  margin-bottom: 20px;
  text-align: center;
}

.receipt-image-container h4,
.qr-image-container h4 {
  margin: 0 0 15px 0;
  color: #999;
  font-size: 12px;
  text-transform: uppercase;
}

.receipt-image,
.qr-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  max-height: 300px;
}

.delivery-info-box {
  background: #f9f7f4;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.delivery-info-box h4 {
  margin: 0 0 8px 0;
  color: #999;
  font-size: 12px;
  text-transform: uppercase;
}

.delivery-info-box p {
  margin: 0;
  color: #333;
}

.approval-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.approval-buttons button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .orders-table {
    font-size: 12px;
  }

  .orders-table th,
  .orders-table td {
    padding: 10px 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .filter-section {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
