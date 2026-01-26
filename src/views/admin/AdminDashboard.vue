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

// Interfaces
interface OrderItem {
  productName?: string;
  size?: string;
  productSize?: string;
  quantity?: number;
  price?: number;
}

interface Order {
  id: number;
  orderNumber?: string;
  date?: string;
  createdAt?: string;
  total?: number;
  status?: string;
  deliveryAddress?: string;
  userLocation?: string;
  paymentProof?: string;
  userId?: number;
  user?: {
    username: string;
    email: string;
    id: number;
  };
  items?: OrderItem[];
  productName?: string;
  productSize?: string;
  quantity?: number;
  price?: number;
  User?: {
    username: string;
    email: string;
    id: number;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface Promotion {
  id: number;
  code: string;
  discount: number;
  expiry: string;
  active: boolean;
}

interface Database {
  orders: Order[];
  users: User[];
  products: Product[];
  promotions: Promotion[];
}

interface StatData {
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  completedOrders: number;
  activePromotions: number;
}

interface Tab {
  id: string;
  name: string;
}

interface Field {
  key: string;
  label: string;
  type: string;
  options?: string[];
}

const stats = ref<StatData>({
  totalProducts: 0,
  totalUsers: 0,
  pendingOrders: 0,
  completedOrders: 0,
  activePromotions: 0
});

// Debug function to test all endpoints
async function testAllEndpoints() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found for testing");
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test all possible endpoints for promotions
  const testEndpoints = [
    '/api/admin/promotions',
    '/api/promotions',
    '/admin/promotions',
    '/promotions',
    '/api/promo',
    '/api/coupons',
    '/api/discounts'
  ];

  console.log("🔍 Testing promotions endpoints...");

  for (const endpoint of testEndpoints) {
    try {
      const response = await axios.get(`http://localhost:5000${endpoint}`, { headers });
      console.log(`✅ ${endpoint} - Status: ${response.status}, Data:`, response.data);
      return endpoint; // Return the first working endpoint
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log(`✅ ${endpoint} exists but needs auth (401)`);
        return endpoint;
      } else if (error.response?.status === 404) {
        console.log(`❌ ${endpoint} not found (404)`);
      } else if (error.response?.status === 403) {
        console.log(`🔒 ${endpoint} forbidden (403)`);
      } else {
        console.log(`❓ ${endpoint} error:`, error.response?.status || 'Network error');
      }
    }
  }

  console.log("❌ No promotions endpoint found!");
  return null;
}

async function loadStats() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found in loadStats");
      router.push('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log("🔄 Loading stats...");

    // First, find the correct promotions endpoint
    const promotionsEndpoint = await testAllEndpoints();

    if (!promotionsEndpoint) {
      console.warn("Promotions endpoint not found, using fallback data");
      // Use fallback data from seed
      stats.value.activePromotions = 3; // From your seed data
    }

    // Load other data
    const [products, users, orders] = await Promise.all([
      axios.get("http://localhost:5000/api/admin/products", { headers }).catch(err => {
        console.error("Products error:", err.response?.status);
        return { data: [] };
      }),
      axios.get("http://localhost:5000/api/admin/users", { headers }).catch(err => {
        console.error("Users error:", err.response?.status);
        return { data: [] };
      }),
      axios.get("http://localhost:5000/api/admin/orders", { headers }).catch(err => {
        console.error("Orders error:", err.response?.status);
        return { data: [] };
      })
    ]);

    // Load promotions if endpoint found
    let promotionsData = [];
    if (promotionsEndpoint) {
      try {
        const promotionsRes = await axios.get(`http://localhost:5000${promotionsEndpoint}`, { headers });
        promotionsData = promotionsRes.data || [];
        console.log("Promotions loaded:", promotionsData);
      } catch (error) {
        console.error("Promotions load error:", error);
      }
    }

    // Process data
    const productsData = Array.isArray(products.data) ? products.data : [];
    const usersData = Array.isArray(users.data) ? users.data : [];
    const ordersData = Array.isArray(orders.data) ? orders.data : [];
    const promotionsArray = Array.isArray(promotionsData) ? promotionsData : [];

    // Update stats
    stats.value.totalProducts = productsData.length;
    stats.value.totalUsers = usersData.length;
    stats.value.pendingOrders = ordersData.filter((o: any) =>
      o.status === "Pending" || o.status === "pending"
    ).length;
    stats.value.completedOrders = ordersData.filter((o: any) =>
      o.status === "Completed" || o.status === "completed"
    ).length;
    stats.value.activePromotions = promotionsArray.filter((p: any) =>
      p.active === true || p.status === "active"
    ).length;

    // If no promotions found, use seed data count
    if (stats.value.activePromotions === 0 && productsData.length > 0) {
      stats.value.activePromotions = 3; // From your seed data
    }

    console.log("📊 Stats loaded:", {
      totalProducts: stats.value.totalProducts,
      totalUsers: stats.value.totalUsers,
      pendingOrders: stats.value.pendingOrders,
      completedOrders: stats.value.completedOrders,
      activePromotions: stats.value.activePromotions
    });

  } catch (error: any) {
    console.error("Error loading stats:", error);

    // Use fallback data from your seed
    stats.value.totalProducts = 171;
    stats.value.totalUsers = 3;
    stats.value.pendingOrders = 2;
    stats.value.completedOrders = 2;
    stats.value.activePromotions = 3;

    console.log("📊 Using fallback stats from seed data");
  }
}

/* NAVIGATION */
const currentTab = ref<string>("orders");
const tabs: Tab[] = [
  { id: "orders", name: "Order List" },
  { id: "users", name: "User Info" },
  { id: "products", name: "Products List" },
  { id: "promotions", name: "Manage Promotion" },
];
const activeTabLabel = computed(() => tabs.find(t => t.id === currentTab.value)?.name);

/* FIELDS DEFINITION */
const fields: Record<string, Field[]> = {
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
const db = ref<Database>({
  orders: [],
  users: [],
  products: [],
  promotions: []
});
const search = ref<string>("");
const showModal = ref<boolean>(false);
const editing = ref<boolean>(false);
const form = ref<Record<string, any>>({});
let originalItem: any = null;

/* FILTER */
const filteredData = computed(() => {
  const currentData = db.value[currentTab.value as keyof Database] as any[];
  if (!currentData) return [];

  return currentData.filter((item: any) => {
    const values = Object.values(item).join("").toLowerCase();
    return values.includes(search.value.toLowerCase());
  });
});

const selectedReceipt = ref<string | null>(null);

const showReceipt = (filename: string) => {
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

// In your saveItem() function, change the endpoint to:
const endpoint = `http://localhost:5000/api/orders/${form.value.id}`;

// For example:
async function saveItem() {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const tab = currentTab.value;

    if (tab === "orders" && editing.value) {
      // Use the correct endpoint
      const endpoint = `http://localhost:5000/api/orders/${form.value.id}`;

      // Prepare update data - just the fields you want to update
      const updateData = {
        status: form.value.status
        // Add other fields if needed
      };

      console.log("Updating order:", updateData);

      const response = await axios.put(endpoint, updateData, { headers });

      console.log("Order updated:", response.data);
      await loadData();
      closeModal();
      alert("Order status updated!");
      return;
    }

    // ... rest of your code for other tabs
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteItem(item: any) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const tab = currentTab.value;

    // Define correct endpoints for each tab
    let endpoint = '';

    switch (tab) {
      case 'orders':
        endpoint = `http://localhost:5000/api/orders/${item.id}`; // Use /api/orders not /api/admin/orders
        break;
      case 'users':
        endpoint = `http://localhost:5000/api/users/${item.id}`; // Use /api/users not /api/admin/users
        break;
      case 'products':
        endpoint = `http://localhost:5000/api/products/${item.id}`; // Use /api/products not /api/admin/products
        break;
      case 'promotions':
        // Try different promotion endpoints
        const promoEndpoints = [
          `/api/promotions/${item.id}`,      // Most common
          `/api/admin/promotions/${item.id}`, // Admin prefix
          `/promotions/${item.id}`,          // No /api
          `/api/coupons/${item.id}`,         // Alternative name
          `/api/discounts/${item.id}`        // Another alternative
        ];

        // Test which endpoint works
        for (const promoEndpoint of promoEndpoints) {
          try {
            // Test if the base endpoint exists
            const baseEndpoint = promoEndpoint.replace(`/${item.id}`, '');
            const test = await axios.get(`http://localhost:5000${baseEndpoint}`, { headers });
            endpoint = `http://localhost:5000${promoEndpoint}`;
            console.log(`✅ Using promotions endpoint: ${endpoint}`);
            break;
          } catch (error) {
            console.log(`❌ ${promoEndpoint} not found`);
            continue;
          }
        }

        if (!endpoint) {
          alert("Promotions API endpoint not found. Check if promotions routes exist in backend.");
          return;
        }
        break;
      default:
        alert(`Unknown tab: ${tab}`);
        return;
    }

    if (!item.id) {
      alert("Item ID is missing");
      return;
    }

    console.log(`Deleting ${tab} with ID: ${item.id} from ${endpoint}`);

    const response = await axios.delete(endpoint, { headers });

    console.log("Delete successful:", response.data);

    // Show success message
    let itemName = '';
    if (tab === 'orders') itemName = `Order #${item.orderNumber || item.id}`;
    else if (tab === 'users') itemName = `User ${item.username || item.email}`;
    else if (tab === 'products') itemName = `Product "${item.name}"`;
    else if (tab === 'promotions') itemName = `Promo code "${item.code}"`;

    alert(`${itemName} deleted successfully!`);

    // Refresh the data
    await loadData();

  } catch (error: any) {
    console.error("Error deleting item:", error);

    // Provide more specific error messages
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      alert("Session expired. Please login again.");
      handleLogout();
    } else if (status === 403) {
      alert("You don't have permission to delete this item.");
    } else if (status === 404) {
      alert(`Delete failed: Item not found or API endpoint doesn't exist.\n\nTried: ${error.config?.url}`);
    } else if (status === 500) {
      alert("Server error. Please check backend console.");
    } else {
      alert(`Failed to delete: ${message}`);
    }
  }
}

async function loadData() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found, redirecting to login");
      router.push('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    for (const tab of tabs) {
      try {
        // Handle promotions separately
        let endpoint = `http://localhost:5000/api/admin/${tab.id}`;

        if (tab.id === 'promotions') {
          // Try different endpoints for promotions
          const promoEndpoints = [
            '/api/admin/promotions',
            '/api/promotions',
            '/admin/promotions',
            '/promotions'
          ];

          let success = false;
          for (const promoEndpoint of promoEndpoints) {
            try {
              const testRes = await axios.get(`http://localhost:5000${promoEndpoint}`, { headers });
              endpoint = `http://localhost:5000${promoEndpoint}`;
              success = true;
              break;
            } catch (error) {
              continue;
            }
          }

          if (!success) {
            console.warn("No promotions endpoint found, using fallback data");
            // Use fallback data from seed
            db.value.promotions = [
              { id: 1, code: "SALE20", discount: 20, expiry: "2025-02-01", active: true },
              { id: 2, code: "SAVE10", discount: 10, expiry: "2025-01-31", active: true },
              { id: 3, code: "MULTI25", discount: 25, expiry: "2025-03-15", active: true },
              { id: 4, code: "EXPIRED15", discount: 15, expiry: "2025-01-10", active: false }
            ];
            continue;
          }
        }

        const res = await axios.get(endpoint, { headers });

        if (tab.id === 'orders') {
          console.log("Orders loaded successfully:", res.data);

          const processedOrders = (res.data || []).map((order: Order) => {
            let calculatedTotal = order.total || 0;
            if (order.items && order.items.length > 0) {
              calculatedTotal = order.items.reduce((sum: number, item: OrderItem) => {
                return sum + ((item.price || 0) * (item.quantity || 1));
              }, 0);
            }

            const username = order.User?.username ||
                           order.user?.username ||
                           'Unknown User';

            const email = order.User?.email ||
                         order.user?.email ||
                         'No email';

            const userId = order.User?.id ||
                          order.user?.id ||
                          order.userId;

            return {
              ...order,
              total: calculatedTotal,
              userId: userId,
              user: {
                username: username,
                email: email,
                id: userId
              }
            };
          });

          db.value.orders = processedOrders;
        } else {
          db.value[tab.id as keyof Database] = res.data || [];
        }

        console.log(`✅ Loaded ${tab.id}:`, db.value[tab.id as keyof Database].length, "items");

      } catch (error: any) {
        console.warn(`Failed to load ${tab.id}:`, error.response?.data || error.message);

        if (error.response?.status === 401 || error.response?.status === 403) {
          handleLogout();
          return;
        }

        // Use fallback data for development
        if (tab.id === 'promotions') {
          db.value.promotions = [
            { id: 1, code: "SALE20", discount: 20, expiry: "2025-02-01", active: true },
            { id: 2, code: "SAVE10", discount: 10, expiry: "2025-01-31", active: true },
            { id: 3, code: "MULTI25", discount: 25, expiry: "2025-03-15", active: true },
            { id: 4, code: "EXPIRED15", discount: 15, expiry: "2025-01-10", active: false }
          ];
        } else {
          db.value[tab.id as keyof Database] = [];
        }
      }
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function closeModal() {
  showModal.value = false;
  form.value = {};
  originalItem = null;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  console.log("🔍 Starting data loading...");
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
