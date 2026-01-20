<template>
  <div class="dashboard">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <img class="avatar" src="/image/picUser.png" />
      <h3 class="username">Aok Sokunkanha</h3>

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
        <button>Help</button>
      </nav>

      <button class="logout" @click="logout">Log Out</button>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="content">
      <!-- PROFILE -->
      <section v-if="currentTab === 'profile'" class="card">
        <h2>Profile</h2>

        <div class="field">
          <label>Username</label>
          <input type="text" value="Aok Sokunkanha" />
        </div>

        <div class="field">
          <label>Email</label>
          <input type="email" value="kanha@gmail.com" />
        </div>

        <div class="field">
          <label>Phone Number</label>
          <input type="text" value="0123456678" />
        </div>
      </section>

      <!-- CHANGE PASSWORD -->
      <section v-else class="card">
        <h2>Change Password</h2>

        <div class="field">
          <label>Current Password</label>
          <input type="password" />
        </div>

        <div class="field">
          <label>New Password</label>
          <input type="password" />
        </div>

        <div class="field">
          <label>Confirm Password</label>
          <input type="password" />
        </div>

        <button class="confirm">Confirm</button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentTab = ref<"profile" | "password">("profile");

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}
</script>

<style scoped>
/* PAGE */
.dashboard {
  display: flex;
  min-height: calc(100vh - 70px);
  background: #e9e1d9;
  font-family: "Segoe UI", sans-serif;
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
}

nav button.active {
  background: #e0d8cf;
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
}

/* CONTENT */
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
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
}

/* FORM */
.field {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
}

/* BUTTON */
.confirm {
  background: #3b7f2c;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
