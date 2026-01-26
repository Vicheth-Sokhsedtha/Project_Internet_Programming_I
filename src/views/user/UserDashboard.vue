<template>
  <div class="dashboard">
    <!-- LOADING STATE -->
    <div v-if="loading" class="loading">
      <p>Loading your profile...</p>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="redirectToLogin" class="error-btn">Go to Login</button>
    </div>

    <!-- DASHBOARD -->
    <div v-else class="dashboard-container">
      <!-- SIDEBAR -->
      <div class="sidebar">
        <div class="user-info">
          <div class="avatar-container">
            <label class="avatar-label">
              <img
                :src="avatarUrl"
                :key="avatarUrl"
                alt="User Avatar"
                class="avatar"
              />
              <input
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                style="display: none"
              />
              <span class="avatar-edit">✏️</span>
            </label>
            <p class="avatar-note">Click to change photo</p>
          </div>

          <h2 class="username">{{ userStore.user.username }}</h2>
          <p class="user-email">{{ userStore.user.email }}</p>
        </div>

        <nav class="nav-menu">
          <button
            @click="currentTab = 'profile'"
            :class="{ active: currentTab === 'profile' }"
          >
             Profile
          </button>
          <button
            @click="currentTab = 'password'"
            :class="{ active: currentTab === 'password' }"
          >
             Password
          </button>
          <button
            @click="currentTab = 'orders'"
            :class="{ active: currentTab === 'orders' }"
          >
             Orders
          </button>
        </nav>

        <button @click="logout" class="logout-btn">
          Logout
        </button>
      </div>

      <!-- MAIN CONTENT -->
      <div class="main-content">
        <!-- MESSAGES -->
        <div v-if="successMessage" class="alert success">
          ✅ {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert error">
          ❌ {{ errorMessage }}
        </div>

        <!-- PROFILE TAB -->
        <div v-if="currentTab === 'profile'" class="profile-section">
          <h2>Profile Settings</h2>

          <div class="form-group">
            <label>Username</label>
            <input
              v-model="userStore.user.username"
              type="text"
              disabled
              class="disabled-input"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="userStore.user.email"
              type="email"
              disabled
              class="disabled-input"
            />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="userStore.user.phone" type="text" placeholder="Enter phone number" />
          </div>

          <div class="form-group">
            <label>Address</label>
            <input v-model="userStore.user.address" type="text" placeholder="Enter address" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>City</label>
              <input v-model="userStore.user.city" type="text" placeholder="City" />
            </div>
            <div class="form-group">
              <label>Postal Code</label>
              <input v-model="userStore.user.postalCode" type="text" placeholder="Postal code" />
            </div>
          </div>

          <div class="form-group">
            <label>Country</label>
            <input v-model="userStore.user.country" type="text" placeholder="Country" />
          </div>

          <button @click="updateProfile" :disabled="updating" class="save-btn">
            {{ updating ? 'Saving...' : ' Save Changes' }}
          </button>
        </div>

        <!-- PASSWORD TAB -->
        <div v-else-if="currentTab === 'password'" class="password-section">
          <h2>Change Password</h2>

          <div class="form-group">
            <label>Current Password</label>
            <input
              v-model="passwordData.currentPassword"
              type="password"
              placeholder="Enter current password"
            />
          </div>

          <div class="form-group">
            <label>New Password</label>
            <input
              v-model="passwordData.newPassword"
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <div class="form-group">
            <label>Confirm New Password</label>
            <input
              v-model="passwordData.confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <button @click="changePassword" :disabled="updating" class="save-btn">
            {{ updating ? 'Updating...' : ' Change Password' }}
          </button>
        </div>

        <!-- ORDERS TAB -->
        <div v-else-if="currentTab === 'orders'" class="orders-section">
          <h2>My Orders</h2>

          <div v-if="ordersLoading" class="loading">
            <p>Loading orders...</p>
          </div>

          <div v-else-if="orders.length === 0" class="no-orders">
            <p v-if="errorMessage">{{ errorMessage }}</p>
            <p v-else>No orders yet</p>

            <div class="order-actions">
              <button @click="fetchUserOrders" class="retry-btn">
                Retry Loading Orders
              </button>
              <button @click="$router.push('/product')" class="shop-btn">
                 Start Shopping
              </button>
            </div>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-card">
              <div class="order-header">
                <div class="order-id">Order #{{ order.orderNumber || order.id }}</div>
                <div :class="['order-status', order.status?.toLowerCase()]">
                  {{ order.status || 'Pending' }}
                </div>
              </div>

              <div class="order-date">
                {{ formatDate(order.date || order.createdAt) }}
              </div>

              <div class="order-total">
                Total: ${{ order.total?.toFixed(2) || '0.00' }}
              </div>

              <div class="order-items">
                <div v-if="order.items && order.items.length > 0">
                  <div v-for="(item, index) in order.items" :key="index" class="order-item">
                    <img
                      :src="item.image || '/image/default-product.jpg'"
                      :alt="item.productName"
                      @error="handleImageError"
                      class="item-image"
                    />
                    <div class="item-info">
                      <strong>{{ item.productName }}</strong>
                      <div class="item-details">
                        <span>Size: {{ item.size || 'N/A' }}</span>
                        <span>Qty: {{ item.quantity }}</span>
                        <span>${{ (item.price || 0).toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="order.productName" class="order-item">
                  <img
                    :src="order.productImage || '/image/default-product.jpg'"
                    :alt="order.productName"
                    @error="handleImageError"
                    class="item-image"
                  />
                  <div class="item-info">
                    <strong>{{ order.productName }}</strong>
                    <div class="item-details">
                      <span>Size: {{ order.productSize || 'N/A' }}</span>
                      <span>Qty: {{ order.quantity }}</span>
                      <span>${{ (order.price || 0).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-actions">
                <button
                  v-if="order.status === 'Pending'"
                  @click="cancelOrder(order.id)"
                  class="cancel-btn"
                >
                  Cancel
                </button>
                <button @click="contactSupport(order)" class="support-btn">
                  Contact Support
                </button>
                <button
                  v-if="order.receiptUrl || order.hasReceipt"
                  @click="viewReceipt(order.id)"
                  class="receipt-btn"
                >
                  View Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="receipt-modal">
      <div class="modal-overlay" @click="closeReceiptModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Order Receipt</h3>
          <button @click="closeReceiptModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <img
            v-if="selectedReceipt"
            :src="selectedReceipt"
            alt="Receipt"
            class="receipt-image"
            @error="handleImageError"
          />
          <p v-else>Receipt not available</p>
        </div>
        <div class="modal-footer">
          <button @click="closeReceiptModal" class="modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";

const router = useRouter();
const userStore = useUserStore();
const currentTab = ref<"profile" | "password" | "orders">("profile");
const loading = ref(true);
const ordersLoading = ref(false);
const updating = ref(false);
const error = ref("");
const errorMessage = ref("");
const successMessage = ref("");

// Add receipt modal state
const showReceiptModal = ref(false);
const selectedReceipt = ref<string | null>(null);

// TypeScript interfaces
interface OrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  size?: string;
  productSize?: string;
  quantity?: number;
  price?: number;
  image?: string;
  qty?: number;
}

interface Order {
  id: number;
  orderNumber?: string;
  date?: string;
  createdAt?: string;
  total?: number;
  status?: string;
  paymentProof?: string;
  receiptUrl?: string;
  hasReceipt?: boolean;
  items?: OrderItem[];
  productName?: string;
  productImage?: string;
  productSize?: string;
  quantity?: number;
  price?: number;
  username?: string;
  userId?: number;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordData = ref<PasswordData>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const orders = ref<Order[]>([]);

// Computed property for avatar URL
const avatarUrl = computed(() => {
  if (userStore.user?.avatar) {
    return `http://localhost:5000/uploads/${userStore.user.avatar}?t=${Date.now()}`;
  }
  return '/image/default-avatar.png';
});

// Handle avatar change
const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = "Please select a valid image file (JPEG, PNG, GIF, or WebP)";
    return;
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "File size must be less than 5MB";
    return;
  }

  updating.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = userStore.token || localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/users/avatar", {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = "Profile picture updated successfully!";
      if (data.user) {
        userStore.setUser(data.user);
      }
      target.value = "";
    } else {
      errorMessage.value = data.error || "Failed to upload avatar";
    }
  } catch (err) {
    errorMessage.value = "Failed to upload avatar. Please try again.";
    console.error("Avatar upload error:", err);
  } finally {
    updating.value = false;
    setTimeout(() => {
      successMessage.value = "";
      errorMessage.value = "";
    }, 3000);
  }
};



// Fetch user orders
const fetchUserOrders = async () => {
  ordersLoading.value = true;
  errorMessage.value = "";

  try {
    const token = userStore.token || localStorage.getItem("token");

    if (!token) {
      errorMessage.value = "Authentication required. Please login again.";
      ordersLoading.value = false;
      return;
    }

    // Use the correct endpoint
    const endpoint = `http://localhost:5000/api/orders/user-history`;

    console.log("Fetching orders from:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Orders data received:", data);

      // Process orders with proper structure
      orders.value = data.map((order: any) => {
        // Calculate total from items if available
        let total = order.total || 0;
        if (order.items && order.items.length > 0) {
          total = order.items.reduce((sum: number, item: OrderItem) => {
            return sum + ((item.price || 0) * (item.quantity || 0));
          }, 0);
        }

        return {
          id: order.id,
          orderNumber: order.orderNumber || `ORD-${order.id}`,
          date: order.date || order.createdAt || new Date().toISOString(),
          status: order.status || 'Pending',
          total: total,
          items: order.items || [],
          paymentProof: order.paymentProof,
          // Add receipt info
          receiptUrl: order.paymentProof ? `http://localhost:5000/uploads/${order.paymentProof}` : null,
          hasReceipt: !!order.paymentProof
        };
      }).sort((a: Order, b: Order) => {
        const dateA = new Date(a.date || "").getTime();
        const dateB = new Date(b.date || "").getTime();
        return dateB - dateA; // Newest first
      });

      console.log("Processed orders:", orders.value);
    } else {
      if (response.status === 401 || response.status === 403) {
        errorMessage.value = "Session expired. Please login again.";
        userStore.logout();
        router.push("/login");
      } else {
        const errorData = await response.json();
        errorMessage.value = errorData.error || "Failed to load orders";
      }
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    errorMessage.value = "Network error. Please check your connection.";
  } finally {
    ordersLoading.value = false;
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
};



// View receipt image
const viewReceipt = async (orderId: number) => {
  try {
    // Find the order
    const order = orders.value.find(o => o.id === orderId);

    if (order?.receiptUrl) {
      selectedReceipt.value = order.receiptUrl;
      showReceiptModal.value = true;
    } else if (order?.paymentProof) {
      selectedReceipt.value = `http://localhost:5000/uploads/${order.paymentProof}`;
      showReceiptModal.value = true;
    } else {
      errorMessage.value = "No receipt available for this order";
      setTimeout(() => errorMessage.value = "", 3000);
    }
  } catch (err) {
    console.error("Error loading receipt:", err);
    errorMessage.value = "Error loading receipt. Please try again.";
    setTimeout(() => errorMessage.value = "", 3000);
  }
};

// Close receipt modal
const closeReceiptModal = () => {
  showReceiptModal.value = false;
  selectedReceipt.value = null;
};

// Update profile
const updateProfile = async () => {
  updating.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const token = userStore.token || localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        phone: userStore.user.phone,
        address: userStore.user.address,
        city: userStore.user.city,
        postalCode: userStore.user.postalCode,
        country: userStore.user.country,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = "Profile updated successfully!";
      if (data.user) {
        userStore.setUser(data.user);
      }
    } else {
      errorMessage.value = data.error || "Failed to update profile";
    }
  } catch (err) {
    errorMessage.value = "Failed to update profile. Please try again.";
    console.error("Profile update error:", err);
  } finally {
    updating.value = false;
    setTimeout(() => {
      successMessage.value = "";
      errorMessage.value = "";
    }, 3000);
  }
};

// Change password
const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    errorMessage.value = "New passwords do not match";
    return;
  }

  if (passwordData.value.newPassword.length < 6) {
    errorMessage.value = "New password must be at least 6 characters long";
    return;
  }

  updating.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const token = userStore.token || localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = "Password changed successfully!";
      passwordData.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    } else {
      errorMessage.value = data.error || "Failed to change password";
    }
  } catch (err) {
    errorMessage.value = "Failed to change password. Please try again.";
    console.error("Password change error:", err);
  } finally {
    updating.value = false;
    setTimeout(() => {
      successMessage.value = "";
      errorMessage.value = "";
    }, 3000);
  }
};

// Cancel order
const cancelOrder = async (orderId: number) => {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    const token = userStore.token || localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (response.ok) {
      successMessage.value = "Order cancelled successfully!";
      await fetchUserOrders();
    } else {
      errorMessage.value = "Failed to cancel order";
    }
  } catch (err) {
    errorMessage.value = "Failed to cancel order. Please try again.";
    console.error("Cancel order error:", err);
  } finally {
    setTimeout(() => {
      successMessage.value = "";
      errorMessage.value = "";
    }, 3000);
  }
};

// Contact support
const contactSupport = (order: Order) => {
  const subject = `Support Request for Order #${order.orderNumber || order.id}`;
  const body = `Hello Support Team,\n\nI need assistance with my order:\n\nOrder ID: ${order.orderNumber || order.id}\nDate: ${formatDate(order.date || order.createdAt || '')}\nStatus: ${order.status}\nTotal: $${order.total?.toFixed(2) || '0.00'}\n\nIssue description:\n`;
  window.location.href = `mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// Format date
const formatDate = (date: string): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Handle image error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/image/default-product.jpg';
};

// Logout
const logout = () => {
  userStore.logout();
  router.push("/login");
};

// Redirect to login
const redirectToLogin = () => {
  router.push("/login");
};

// Check if user is admin
const isAdmin = computed(() => {
  return userStore.user?.role === 'admin' || userStore.user?.role === 'Admin';
});

// Get display username (for admin view)
const getDisplayUsername = (order: Order) => {
  // For admin: show the actual customer username
  // For customer: show their own username
  if (isAdmin.value && order.username) {
    return order.username; // This should be the customer's username from backend
  }
  return userStore.user?.username || 'Customer';
};

// Load data on mount
onMounted(async () => {
  try {
    if (!userStore.user?.id) {
      await userStore.fetchUserData();
    }
    await fetchUserOrders();
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    error.value = "Failed to load your profile. Please try again.";

    // Try to fetch orders anyway
    setTimeout(() => {
      fetchUserOrders();
    }, 1000);
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
/* Base Styles */
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #cb93c0 0%, #6b3e60 100%);
  padding: 20px;
}

.dashboard-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 80vh;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #d38fb1 0%, #c692b3 100%);
  color: white;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-container {
  position: relative;
  margin-bottom: 15px;
}

.avatar-label {
  display: block;
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
  transition: transform 0.3s;
}

.avatar-label:hover .avatar {
  transform: scale(1.05);
}

.avatar-edit {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white;
  color: #667eea;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.avatar-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8px;
}

.username {
  font-size: 22px;
  margin: 10px 0 5px;
  font-weight: 600;
}

.user-email {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
}

/* Navigation */
.nav-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.nav-menu button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-menu button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.nav-menu button.active {
  background: white;
  color: #667eea;
  font-weight: 500;
}

.logout-btn {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
  color: white;
  padding: 12px 25px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn:hover {
  background: white;
  color: #667eea;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 30px;
  background: #f8fafc;
  min-height: 80vh;
}

/* Alerts */
.alert {
  padding: 12px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

.alert.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Sections */
.profile-section,
.password-section,
.orders-section {
  animation: fadeIn 0.5s ease;
}

h2 {
  color: #1e293b;
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: 600;
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.disabled-input {
  background: #f1f5f9 !important;
  color: #64748b;
  cursor: not-allowed;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

/* Buttons */
.save-btn {
  background: linear-gradient(135deg, #95677c 0%, #da93b7 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Orders Section */
.no-orders {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.shop-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s;
}

.shop-btn:hover {
  transform: translateY(-2px);
}

.retry-btn {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 10px;
}

.retry-btn:hover {
  background: #d97706;
  color: white;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-id {
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.order-status.pending {
  background: #fff7ed;
  color: #ea580c;
}

.order-status.completed {
  background: #f0fdf4;
  color: #16a34a;
}

.order-status.cancelled {
  background: #fef2f2;
  color: #dc2626;
}

.order-date {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.order-total {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 15px;
  font-size: 16px;
}

.order-items {
  margin: 15px 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info strong {
  display: block;
  margin-bottom: 5px;
  color: #1e293b;
}

.item-details {
  display: flex;
  gap: 15px;
  color: #64748b;
  font-size: 13px;
}

.order-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #dc2626;
  color: white;
}

.support-btn {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.support-btn:hover {
  background: #0369a1;
  color: white;
}

.receipt-btn {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.receipt-btn:hover {
  background: #0369a1;
  color: white;
}

/* Receipt Modal Styles */
.receipt-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #dc2626;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.receipt-image {
  width: 100%;
  max-height: 50vh;
  object-fit: contain;
  border-radius: 8px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e2e8f0;
  text-align: right;
}

.modal-close-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.modal-close-btn:hover {
  background: #5a6fd8;
}

/* Loading States */
.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

.error-container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  max-width: 400px;
  margin: 100px auto;
}

.error-message {
  color: #dc2626;
  margin-bottom: 20px;
}

.error-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 20px;
  }

  .main-content {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .order-actions {
    flex-direction: column;
  }
}
</style>
