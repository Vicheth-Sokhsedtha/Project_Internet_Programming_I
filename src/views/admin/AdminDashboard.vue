<template>
  <div class="dashboard">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <img class="avatar" src="/public/image/picAdmin.png" />
      <h3>Admin</h3>

      <nav>
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </nav>

      <button class="logout" @click="handleLogout">Log Out</button>
    </aside>

    <!-- MAIN -->
    <main class="main">
      <input
        class="search"
        v-model="search"
        :placeholder="'Search ' + activeTabLabel"
      />
      <!-- Add after the search input in AdminDashboard.vue -->
        <div class="stats-cards">
          <div class="stat-card">
            <h3>{{ stats.totalProducts || 0 }}</h3>
            <p>Total Products</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.totalUsers || 0 }}</h3>
            <p>Total Users</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.pendingOrders || 0 }}</h3>
            <p>Pending Orders</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.completedOrders || 0 }}</h3>
            <p>Completed Orders</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.activePromotions || 0 }}</h3>
            <p>Active Promotions</p>
          </div>
        </div>

      <div class="card">
        <div class="card-header">
          <h2>{{ activeTabLabel }}</h2>
          <button
            v-if="currentTab !== 'users'"
            class="add-btn"
            @click="openAddModal"
          >
            + Add New
          </button>
        </div>

        <table>
          <thead>
            <tr v-if="currentTab === 'orders'">
              <th>ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Location</th>
              <th>Products</th>
              <th>Payment File</th>
              <th>Action</th>
            </tr>
            <tr v-else-if="currentTab === 'users'">
              <th>Username</th><th>Email</th><th>Role</th><th>Created At</th><th>Action</th>
            </tr>
            <tr v-else-if="currentTab === 'products'">
              <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th>
            </tr>
            <tr v-else-if="currentTab === 'promotions'">
              <th>Code</th><th>Discount</th><th>Expiry</th><th>Status</th><th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in filteredData" :key="index">
              <!-- ORDERS -->
              <template v-if="currentTab === 'orders'">
                <td><span class="order-id">{{ item.orderNumber || item.id }}</span></td>
                <td>
                  <div v-if="item.user">
                    <strong>{{ item.user.username }}</strong><br>
                    <small>{{ item.user.email }}</small>
                  </div>
                  <div v-else-if="item.userId">
                    User ID: {{ item.userId }}
                  </div>
                  <span v-else>Guest</span>
                </td>
                <td>{{ formatDate(item.date || item.createdAt) }}</td>
                <td>${{ item.total?.toFixed(2) || '0.00' }}</td>
                <td>
                  <span :class="['status', item.status?.toLowerCase()]">
                    {{ item.status || 'Pending' }}
                  </span>
                </td>
                <td>{{ item.deliveryAddress || item.userLocation || 'N/A' }}</td>
                <td>
                  <!-- Display product names and quantities -->
                  <div v-if="item.items && item.items.length">
                    <div v-for="(prod, idx) in item.items" :key="idx" class="product-item">
                      <strong>{{ prod.productName || 'Product' }}</strong><br>
                      Size: {{ prod.size || prod.productSize || 'N/A' }}
                      × {{ prod.quantity || 1 }}<br>
                      <small>${{ (prod.price || 0).toFixed(2) }} each</small>
                    </div>
                  </div>
                  <div v-else-if="item.productName">
                    <!-- For backward compatibility with single product orders -->
                    <strong>{{ item.productName }}</strong><br>
                    Size: {{ item.productSize || 'N/A' }}
                    × {{ item.quantity || 1 }}<br>
                    <small>${{ (item.price || 0).toFixed(2) }} each</small>
                  </div>
                  <span v-else class="no-products">No products</span>
                </td>
                <td>
                  <a
                    v-if="item.paymentProof"
                    :href="'/uploads/' + item.paymentProof"
                    target="_blank"
                    class="receipt-link"
                  >
                    View Receipt
                  </a>
                  <span v-else class="no-receipt">No file</span>
                </td>
                <!-- <td>
                  <button class="edit" @click="editItem(item)">Edit</button>
                  <button class="delete" @click="deleteItem(item)">Delete</button>
                </td> -->
              </template>

              <!-- USERS -->
              <template v-else-if="currentTab === 'users'">
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.role }}</td>
                <td>{{ new Date(item.createdAt).toLocaleDateString() }}</td>
              </template>

              <!-- PRODUCTS -->
              <template v-else-if="currentTab === 'products'">
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>${{ item.price }}</td>
                <td>{{ item.stock }} units</td>
              </template>

              <!-- PROMOTIONS -->
              <template v-else-if="currentTab === 'promotions'">
                <td>{{ item.code }}</td>
                <td>{{ item.discount }}%</td>
                <td>{{ item.expiry }}</td>
                <td><span :class="['status', item.active ? 'completed' : 'pending']">{{ item.active ? 'Active' : 'Expired' }}</span></td>
              </template>

              <td>
                <button class="edit" @click="editItem(item)">Edit</button>
                <button class="delete" @click="deleteItem(item)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- MODAL -->
    <div v-if="showModal" class="modal">
      <div class="modal-box">
        <h3>{{ editing ? 'Edit' : 'Add' }} {{ activeTabLabel }}</h3>
        <p style="font-size: 12px; color: #666;">(Fill all fields)</p>

        <div v-for="field in fields[currentTab]" :key="field.key" class="modal-field">
          <label>{{ field.label }}</label>

          <template v-if="field.type === 'select'">
            <select v-model="form[field.key]">
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </template>

          <template v-else-if="field.type === 'checkbox'">
            <input type="checkbox" v-model="form[field.key]" />
          </template>

          <template v-else>
            <input :type="field.type" v-model="form[field.key]" />
          </template>
        </div>

        <div class="modal-actions">
          <button class="save" @click="saveItem">Save</button>
          <button class="delete" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const stats = ref({
  totalProducts: 0,
  totalUsers: 0,
  pendingOrders: 0,
  completedOrders: 0,
  activePromotions: 0
});

async function loadStats() {
  try {
    const [products, users, orders, promotions] = await Promise.all([
      axios.get("http://localhost:5000/api/admin/products"),
      axios.get("http://localhost:5000/api/admin/users"),
      axios.get("http://localhost:5000/api/admin/orders"),
      axios.get("http://localhost:5000/api/admin/promotions")
    ]);

    stats.value.totalProducts = products.data.length;
    stats.value.totalUsers = users.data.length;
    stats.value.pendingOrders = orders.data.filter(o => o.status === 'Pending').length;
    stats.value.completedOrders = orders.data.filter(o => o.status === 'Completed').length;
    stats.value.activePromotions = promotions.data.filter(p => p.active).length;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

/* NAVIGATION */

const currentTab = ref("users");
const tabs = [
  { id: "orders", name: "Order List" },
  { id: "users", name: "User Info" },
  { id: "products", name: "Products List" },
  { id: "promotions", name: "Manage Promotion" },
];
const activeTabLabel = computed(() => tabs.find(t => t.id === currentTab.value)?.name);

/* FIELDS DEFINITION */
const fields: Record<string, Array<{ key: string; label: string; type: string; options?: string[] }>> = {
  orders: [
    { key: "id", label: "Order ID", type: "text" },
    { key: "date", label: "Order Date", type: "date" },
    { key: "total", label: "Total Amount", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["Pending", "Completed"] },
    { key: "deliveryAddress", label: "Delivery Address", type: "text" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "paymentProof", label: "Payment Proof", type: "text" },

  ],
  users: [
    { key: "username", label: "Username", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "role", label: "Role", type: "select", options: ["user", "admin"] },
    { key: "createdAt", label: "Created At", type: "date" },
  ],
  products: [
    { key: "name", label: "Product Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "price", label: "Price", type: "number" },
    { key: "stock", label: "Stock", type: "number" },
  ],
  promotions: [
    { key: "code", label: "Promo Code", type: "text" },
    { key: "discount", label: "Discount (%)", type: "number" },
    { key: "expiry", label: "Expiry Date", type: "date" },
    { key: "active", label: "Status", type: "checkbox" },
  ],
};

/* STATE */
const db = ref<any>({ orders: [], users: [], products: [] });
const search = ref("");
const showModal = ref(false);
const editing = ref(false);
const form = ref<any>({});
let originalItem: any = null;

/* FILTER */
const filteredData = computed(() => {
  const currentData = db.value[currentTab.value] || [];
  return currentData.filter((item: any) =>
    Object.values(item).join("").toLowerCase().includes(search.value.toLowerCase())
  );
});


const selectedReceipt = ref(null);

const showReceipt = (filename) => {
  if (selectedReceipt.value === filename) {
    selectedReceipt.value = null;
  } else {
    selectedReceipt.value = filename;
  }
};

/* CRUD */
function openAddModal() {
  editing.value = false;
  form.value = {};
  showModal.value = true;
}

function editItem(item: any) {
  editing.value = true;
  originalItem = item;
  form.value = { ...item };
  showModal.value = true;
}

async function saveItem() {
  try {
    const tab = currentTab.value;
    if (editing.value) {
      await axios.put(`http://localhost:5000/api/admin/${tab}/${form.value.id}`, form.value);
    } else {
      await axios.post(`http://localhost:5000/api/admin/${tab}`, form.value);
    }
    await loadData();
    closeModal();
  } catch (error) {
    console.error("Error saving item:", error);
    alert("Failed to save. Check console for details.");
  }
}

async function deleteItem(item: any) {
  try {
    const tab = currentTab.value;
    if (!item.id) {
      alert("Item ID is missing");
      return;
    }
    await axios.delete(`http://localhost:5000/api/admin/${tab}/${item.id}`);
    await loadData();
  } catch (error) {
    console.error("Error deleting item:", error);
    alert("Failed to delete. Check console for details.");
  }
}

async function loadData() {
  try {
    for (const tab of tabs) {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/${tab.id}`);
        console.log(`Loaded ${tab.id}:`, res.data);
        db.value[tab.id] = res.data || [];
      } catch (error) {
        console.warn(`Failed to load ${tab.id}:`, error);
        db.value[tab.id] = [];
      }
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}


function closeModal() {
  showModal.value = false;
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function handleLogout() {
  localStorage.removeItem("user");
  router.push("/login");
}





onMounted(async () => {
  await loadData();
  await loadStats();
});
</script>



<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #e7dfd8;
  font-family: 'Segoe UI', sans-serif;
}


/* SIDEBAR */
.sidebar {
  width: 220px;
  background: #f6f1eb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

/* Add to AdminDashboard.vue styles */
.product-item {
  margin-bottom: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-item small {
  color: #666;
  font-size: 12px;
}

.no-products {
  color: #999;
  font-style: italic;
}

.receipt-link {
  color: #007bff;
  text-decoration: none;
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 13px;
}

.receipt-link:hover {
  background: #007bff;
  color: white;
  text-decoration: none;
}

.no-receipt {
  color: #999;
  font-style: italic;
}
.stat-card h3 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.stat-card p {
  color: #666;
  font-size: 14px;
}
.avatar {
  width: 110px;
  border-radius: 50%;
  margin-bottom: 10px;
  margin-top:70px;
}

nav {
  width: 100%;
  margin-top: 30px;
}

nav button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

nav .active {
  background: #ddd;
}

.logout {
  margin-top: auto;
  background: #e53935;
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

/* MAIN */
.main {
  flex: 1;
  padding: 30px;
}

.search {
  width: 300px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-bottom: 20px;
}

/* CARD */
.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;   /* same padding for all */
  text-align: left; /* optional: aligns text same in both */
  border-bottom: 1px solid #eee;
  margin: 0;
}

.order-id {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

/* STATUS */
.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.completed {
  background: #c8e6c9;
}

.pending {
  background: #ffe0b2;
}

/* ACTIONS */
.edit {
  background: #2196f3;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  margin-right: 6px;
}

.delete {
  background: #f44336;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: white;
  padding: 20px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 14px;
}

.modal-box input,
.modal-box select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.save {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
}
</style>
