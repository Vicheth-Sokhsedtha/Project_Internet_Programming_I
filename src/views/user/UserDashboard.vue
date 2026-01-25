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
    <div v-else class="dashboard-content">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <label class="avatar-wrapper">
    <!-- Alternative: Direct interpolation -->
  <!-- filepath: d:\I4 courses\Internet Programming I\Project\Main\Project_Internet_Programming_I\src\views\user\UserDashboard.vue -->
  <img
    class="avatar"
    :src="avatarUrl"
    :key="avatarUrl"
    alt="User Avatar"
  />
    <input
      type="file"
      accept="image/*"
      @change="handleAvatarChange"
      style="display: none;"
    />
</label>

        <h3 class="username">{{ userStore.user.username }}</h3>

        <nav>
          <button
            :class="{ active: currentTab === 'profile' }"
            @click="currentTab = 'profile'"
          >
            Person Info
          </button>
          <button
            :class="{ active: currentTab === 'password' }"
            @click="currentTab = 'password'"
          >
            Change Password
          </button>
          <button
            :class="{ active: currentTab === 'orders' }"
            @click="currentTab = 'orders'"
          >
            My Orders
          </button>
        </nav>

        <button class="logout" @click="logout">Log Out</button>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="content">
        <!-- SUCCESS MESSAGE -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- PROFILE -->
        <section v-if="currentTab === 'profile'" class="card">
          <h2>Profile Information</h2>

          <!-- Read-only fields -->
          <div class="section-title">Account Information (Auto-filled)</div>

          <div class="field">
            <label>Username</label>
            <input v-model="userStore.user.username" type="text" placeholder="Username" disabled />
          </div>

          <div class="field">
            <label>Email</label>
            <input v-model="userStore.user.email" type="email" placeholder="Email" disabled />
          </div>

          <!-- Editable fields -->
          <div class="section-title">Personal Information</div>

          <div class="field">
            <label>Phone Number</label>
            <input v-model="userStore.user.phone" type="text" placeholder="Phone" />
          </div>

          <div class="field">
            <label>Address</label>
            <input v-model="userStore.user.address" type="text" placeholder="Address" />
          </div>

          <div class="field">
            <label>City</label>
            <input v-model="userStore.user.city" type="text" placeholder="City" />
          </div>

          <div class="field">
            <label>Postal Code</label>
            <input v-model="userStore.user.postalCode" type="text" placeholder="Postal Code" />
          </div>

          <div class="field">
            <label>Country</label>
            <input v-model="userStore.user.country" type="text" placeholder="Country" />
          </div>

          <button type="button" @click="updateProfile" :disabled="updating" class="btn-primary">
            {{ updating ? "Updating..." : "Update Profile" }}
          </button>

          <!-- SUCCESS MESSAGE -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <!-- ERROR MESSAGE -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </section>

        <!-- CHANGE PASSWORD -->
        <section v-else-if="currentTab === 'password'" class="card">
          <h2>Change Password</h2>

          <form @submit.prevent="changePassword" class="password-form">
            <div class="field">
              <label for="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                v-model="passwordData.currentPassword"
                type="password"
                placeholder="Enter current password"
                required
              />
            </div>

            <div class="field">
              <label for="newPassword">New Password</label>
              <input
                id="newPassword"
                v-model="passwordData.newPassword"
                type="password"
                placeholder="Enter new password"
                required
              />
            </div>

            <div class="field">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                v-model="passwordData.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" :disabled="updating" class="btn-primary">
              {{ updating ? "Updating..." : "Change Password" }}
            </button>
          </form>

          <!-- ERROR MESSAGE -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </section>

        <!-- MY ORDERS -->
        <section v-else-if="currentTab === 'orders'" class="card">
          <h2>My Orders</h2>
          <div v-if="orders.length === 0" class="empty-state">
            <p>No orders yet</p>
          </div>
          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-item">
              <p><strong>Order ID:</strong> {{ order.id }}</p>
              <p><strong>Status:</strong> {{ order.status }}</p>
              <p><strong>Total:</strong> ${{ order.total }}</p>
              <p><strong>Date:</strong> {{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
        </section>
      </main>
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
const updating = ref(false);
const error = ref("");
const successMessage = ref("");

const passwordData = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const orders = ref<any[]>([]);

// Computed property for avatar URL
const avatarUrl = computed(() => {
  console.log('userStore.user.avatar:', userStore.user.avatar);
  if (userStore.user.avatar) {
    const url = `http://localhost:5000/${userStore.user.avatar}?t=${Date.now()}`;
    console.log('Avatar URL:', url);
    return url;
  }
  console.log('Using default avatar');
  // Use a reliable placeholder
  return 'https://via.placeholder.com/100x100/ccc/000?text=No+Image';
});

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    error.value = "Please select a valid image file (JPEG, PNG, or GIF)";
    return;
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    error.value = "File size must be less than 5MB";
    return;
  }

  updating.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = userStore.token;
    const response = await fetch("http://localhost:5000/api/users/avatar", {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      successMessage.value = "Avatar uploaded successfully!";
      // Update the user store with the response data
      if (data.user) {
        userStore.setUser(data.user);
      }
    } else {
      const errorData = await response.json();
      error.value = errorData.error || "Failed to upload avatar";
    }
  } catch (err) {
    error.value = "Failed to upload avatar. Please try again.";
    console.error("Avatar upload error:", err);
  } finally {
    updating.value = false;
  }
};





// Get auth token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem("authToken");
  return token;
};

// Get user ID from localStorage or token
const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

// Fetch user orders
const fetchUserOrders = async () => {
  try {
    const userId = userStore.user.id;
    const token = userStore.token;

    const response = await fetch(
      `http://localhost:5000/api/products/orders/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (response.ok) {
      orders.value = await response.json();
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};

// Update profile
const updateProfile = async () => {
  updating.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const token = userStore.token;
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

    if (response.ok) {
      const data = await response.json();
      successMessage.value = "Profile updated successfully!";
      // Update the user store with the response data
      if (data.user) {
        userStore.setUser(data.user);
      }
    } else {
      const errorData = await response.json();
      error.value = errorData.error || "Failed to update profile";
    }
  } catch (err) {
    error.value = "Failed to update profile. Please try again.";
    console.error("Profile update error:", err);
  } finally {
    updating.value = false;
  }
};

// Change password
const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    error.value = "New passwords do not match";
    return;
  }

  if (passwordData.value.newPassword.length < 6) {
    error.value = "New password must be at least 6 characters long";
    return;
  }

  updating.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const token = userStore.token;
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

    if (response.ok) {
      const data = await response.json();
      successMessage.value = "Password changed successfully!";
      // Clear the form
      passwordData.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    } else {
      const errorData = await response.json();
      error.value = errorData.error || "Failed to change password";
    }
  } catch (err) {
    error.value = "Failed to change password. Please try again.";
    console.error("Password change error:", err);
  } finally {
    updating.value = false;
  }
};

// Format date
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Logout
function logout() {
  userStore.logout();
  router.push("/login");
}

// Redirect to login
const redirectToLogin = () => {
  router.push("/login");
};

// Load data on mount
onMounted(async () => {
  await userStore.fetchUserData();
  await fetchUserOrders();
  loading.value = false;
});
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
  border-radius: 50%;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover {
  opacity: 0.8;
}

.avatar-wrapper::after {
  content: "Click to change avatar";
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}

.avatar-wrapper:hover::after {
  opacity: 1;
}

/* PAGE */
.dashboard {
  display: flex;
  min-height: calc(100vh - 70px);
  background: #e9e1d9;
  font-family: "Segoe UI", sans-serif;
}

.dashboard-content {
  display: flex;
  width: 100%;
}

.loading,
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 70px);
  font-size: 18px;
  color: #333;
}

.error-message {
  color: #e53935;
  font-weight: 500;
  margin-bottom: 20px;
}

.error-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.success-message {
  background-color: #4caf50;
  color: white;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: #f6f1eb;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 20px;
  object-fit: cover;
}

.username {
  margin: 15px 0 30px;
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

nav {
  width: 100%;
}

nav button {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  font-size: 14px;
  transition: all 0.3s ease;
}

nav button:hover {
  background: #e0d8cf;
}

nav button.active {
  background: #d4ccc3;
  font-weight: 500;
}

.logout {
  margin-top: auto;
  background: #e53935;
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout:hover {
  background: #c62828;
}

/* CONTENT */
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
  overflow-y: auto;
}

/* CARD */
.card {
  width: 100%;
  max-width: 520px;
  background: #fdf8f2;
  padding: 40px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.card h2 {
  margin-bottom: 30px;
  color: #333;
}

/* FORM */
.field {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #42b983;
}

input:disabled {
  background-color: #f5f5f5;
  color: #888;
  cursor: not-allowed;
  border-color: #e0e0e0;
}

/* SECTION TITLE */
.section-title {
  margin: 25px 0 15px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

/* BUTTON */
.confirm {
  background: #3b7f2c;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.confirm:hover:not(:disabled) {
  background: #2d6620;
}

.confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ORDERS */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.order-item:hover {
  border-color: #42b983;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.1);
}

.order-item p {
  margin: 5px 0;
  color: #555;
}

.order-item strong {
  color: #333;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #ddd;
  }

  .content {
    padding: 20px 10px;
  }

  .card {
    max-width: 100%;
    padding: 20px;
  }
}
</style>
