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
                <th>customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Location</th>
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
              <template v-if="currentTab === 'orders'">
                 <!-- <tr v-for="(item, index) in filteredData" :key="index" v-if="currentTab === 'orders'"> -->
                  <td><span class="order-id">{{ item.orderNumber }}</span></td>
                   <td>{{ item.User?.username }}</td>

                  <td>{{ formatDate(item.createdAt) }}</td>
                  <td>${{ item.total }}</td>
                  <td><span :class="['status', item.status.toLowerCase()]">{{ item.status }}</span></td>
                  <td>{{ item.deliveryAddress }}</td>
                  <td>
                    <a v-if="item.paymentProof" :href="item.paymentProof" target="_blank">View Receipt</a>
                    <span v-else>No file</span>
                  </td>
                  <!-- <td>
                    <button class="edit" @click="editItem(item)">Edit</button>
                    <button class="delete" @click="deleteItem(item)">Delete</button>
                  </td> -->

              </template>



            <template v-else-if="currentTab === 'users'">
              <td>{{ item.username }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td>{{ new Date(item.createdAt).toLocaleDateString() }}</td>

            </template>



              <template v-else-if="currentTab === 'products'">
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>${{ item.price }}</td>
                <td>{{ item.stock }} units</td>
              </template>

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
// import axios from "axios";


const router = useRouter();

/* NAVIGATION */
const currentTab = ref("users");
const tabs = [
  { id: "orders", name: "Order List" },
  { id: "users", name: "User Info" },   // ✅ renamed to users
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
const db = ref<any>({ orders: [], users: [], products: []});
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





onMounted(loadData);
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
