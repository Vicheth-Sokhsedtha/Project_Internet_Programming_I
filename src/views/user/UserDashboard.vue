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
    <img
      class="avatar"
        :src="userData.avatar || '/image/picUser.png'"
        alt="User Avatar"
    />
    <input
      type="file"
      accept="image/*"
      hidden
      @change="handleAvatarChange"
  />
</label>

        <h3 class="username">{{ userData.username }}</h3>

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
            <input v-model="userData.username" type="text" placeholder="Username" disabled />
          </div>

          <div class="field">
            <label>Email</label>
            <input v-model="userData.email" type="email" placeholder="Email" disabled />
          </div>

          <!-- Editable fields -->
          <div class="section-title">Personal Information (Editable)</div>

          <div class="field">
            <label>Phone Number</label>
            <input v-model="userData.phone" type="text" placeholder="Phone" />
          </div>

          <div class="field">
            <label>Address</label>
            <input v-model="userData.address" type="text" placeholder="Address" />
          </div>

          <div class="field">
            <label>City</label>
            <input v-model="userData.city" type="text" placeholder="City" />
          </div>

          <div class="field">
            <label>Postal Code</label>
            <input v-model="userData.postalCode" type="text" placeholder="Postal Code" />
          </div>

          <div class="field">
            <label>Country</label>
            <input v-model="userData.country" type="text" placeholder="Country" />
          </div>

          <button class="confirm" @click="updateProfile" :disabled="updating">
            {{ updating ? 'Updating...' : 'Save Changes' }}
          </button>
        </section>

        <!-- CHANGE PASSWORD -->
        <section v-else-if="currentTab === 'password'" class="card">
          <h2>Change Password</h2>

          <div class="field">
            <label>Current Password</label>
            <input v-model="passwordData.currentPassword" type="password" placeholder="Enter current password" />
          </div>

          <div class="field">
            <label>New Password</label>
            <input v-model="passwordData.newPassword" type="password" placeholder="Enter new password" />
          </div>

          <div class="field">
            <label>Confirm Password</label>
            <input v-model="passwordData.confirmPassword" type="password" placeholder="Confirm new password" />
          </div>

          <button class="confirm" @click="changePassword" :disabled="updating">
            {{ updating ? 'Updating...' : 'Change Password' }}
          </button>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentTab = ref<"profile" | "password" | "orders">("profile");
const loading = ref(true);
const updating = ref(false);
const error = ref("");
const successMessage = ref("");

const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  const userId = getUserId();
  const token = getAuthToken();

  if (!userId) {
    error.value = "Please login again.";
    redirectToLogin();
    return;
  }

  // preview (temporary)
  const previewUrl = URL.createObjectURL(file);
  userData.value.avatar = previewUrl;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/avatar`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }

    console.log("Upload result:", result);

    // update avatar URL
    userData.value.avatar = result.avatarUrl;

    successMessage.value = "Profile image updated!";
    setTimeout(() => (successMessage.value = ""), 3000);
  } catch (err) {
    console.error(err);
    error.value = err instanceof Error ? err.message : "Failed to upload image";
  } finally {
    // cleanup preview
    URL.revokeObjectURL(previewUrl);

    // reset input so user can re-upload same file again
    (event.target as HTMLInputElement).value = "";
  }
};



const userData = ref({
  id: null,
  username: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  avatar: "",
});

const passwordData = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const orders = ref<any[]>([]);

// Get auth token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem("authToken");
  return token;
};

// Get user ID from localStorage or token
const getUserId = (): string | null => {
  return localStorage.getItem("userId");
};

// Fetch user data from backend
const fetchUserData = async () => {
  try {
    loading.value = true;
    error.value = "";
    const userId = getUserId();
    const token = getAuthToken();

    if (!userId) {
      error.value = "User ID not found. Please log in again.";
      setTimeout(redirectToLogin, 2000);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        error.value = "Session expired. Please log in again.";
        setTimeout(redirectToLogin, 2000);
        return;
      }
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    userData.value = {
      id: data.id,
      username: data.username || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      postalCode: data.postalCode || "",
      country: data.country || "",
      avatar: data.avatar || "",
    };

    // Fetch orders for this user
    await fetchUserOrders();
  } catch (err) {
    console.error("Error fetching user data:", err);
    error.value = "Failed to load profile. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Fetch user orders
const fetchUserOrders = async () => {
  try {
    const userId = getUserId();
    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:5000/api/orders/user/${userId}`,
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
  try {
    updating.value = true;
    error.value = "";
    successMessage.value = "";

    const userId = getUserId();
    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:5000/api/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          phone: userData.value.phone,
          address: userData.value.address,
          city: userData.value.city,
          postalCode: userData.value.postalCode,
          country: userData.value.country,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    successMessage.value = "Profile updated successfully!";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err) {
    console.error("Error updating profile:", err);
    error.value = "Failed to update profile. Please try again.";
  } finally {
    updating.value = false;
  }
};

// Change password
const changePassword = async () => {
  try {
    if (!passwordData.value.currentPassword || !passwordData.value.newPassword) {
      error.value = "All password fields are required.";
      return;
    }

    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
      error.value = "New password and confirm password do not match.";
      return;
    }

    updating.value = true;
    error.value = "";
    successMessage.value = "";

    const userId = getUserId();
    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:5000/api/users/${userId}/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          currentPassword: passwordData.value.currentPassword,
          newPassword: passwordData.value.newPassword,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to change password");
    }

    successMessage.value = "Password changed successfully!";
    passwordData.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err) {
    console.error("Error changing password:", err);
    error.value = err instanceof Error ? err.message : "Failed to change password.";
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
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  router.push("/login");
}

// Redirect to login
const redirectToLogin = () => {
  router.push("/login");
};

// Load data on mount
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.avatar-wrapper {
  cursor: pointer;
  position: relative;
}

.avatar-wrapper::after {
  content: "Change";
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 10px;
  padding: 4px 6px;
  border-radius: 6px;
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
