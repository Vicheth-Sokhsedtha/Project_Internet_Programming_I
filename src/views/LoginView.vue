<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

interface LoginData {
  username: string;
  email: string;
  password: string;
}

const loginData = ref<LoginData>({
  username: "",
  email: "",
  password: "",
});

const submitted = ref(false);
const passwordVisible = ref(false);

const isFormValid = computed(() => {
  return (loginData.value.username.trim() !== "" || loginData.value.email.trim() !== "") && loginData.value.password.trim() !== "";
});

const handleLogin = async () => {
  submitted.value = true;
  if (!isFormValid.value) return;

  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginData.value.username || undefined,
        email: loginData.value.email || undefined,
        password: loginData.value.password
      }),
    });

    const result = await response.json();
    console.log("LOGIN RESPONSE:", result);

    if (!response.ok) {
      alert(result.error || "Invalid credentials!");
      return;
    }

    // Store authentication data
    userStore.setToken(result.token);
    userStore.setUser(result.user);

    // Store in localStorage
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("userId", result.user.id);
    localStorage.setItem("userRole", result.user.role);

    console.log("User role:", result.user.role);
    console.log("Stored user:", result.user);

    // REDIRECT with debugging
    if (result.user.role === "admin") {
      console.log("Redirecting admin to dashboard...");

      // Try multiple possible paths
      const adminPaths = [ '/adminDashboard'];
      let redirectSuccessful = false;

      for (const path of adminPaths) {
        try {
          await router.push(path);
          console.log(`Successfully redirected to ${path}`);
          redirectSuccessful = true;
          break;
        } catch (routerError: any) {
          console.log(`Path ${path} failed:`, routerError.message);
          continue;
        }
      }

      if (!redirectSuccessful) {
        // Show current routes for debugging
        const routes = router.getRoutes();
        console.log("Available routes:", routes.map((r: any) => r.path));
        alert("Admin dashboard not found. Please check the route configuration.");
        router.push("/"); // Fallback to home
      }
    } else {
      console.log("Redirecting regular user to dashboard...");
      router.push("/user/dashboard");
    }
  } catch (err: any) {
    console.error("Login error:", err);
    alert("Server error, please try again later.");
  }
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const goToSignup = () => {
  router.push("/signup");
};
</script>


<template>
  <div class="login-page-container">
    <div class="welcome-section">
      <h2 class="welcome-title">Welcome back!</h2>
      <p class="welcome-text">Log in to continue enjoying exclusive offers, rewards, and discounts.</p>
    </div>

    <div class="form-section">
      <h2>Log In</h2>
      <form @submit.prevent="handleLogin">
        <label>Username</label>
        <input v-model="loginData.username" type="text" placeholder="Enter username" />

        <label>Email</label>
        <input v-model="loginData.email" type="email" placeholder="Enter email" />

        <label>Password</label>
        <div class="password-input-wrapper">
          <input
            v-model="loginData.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Enter password"
          />
          <span class="password-toggle" @click="togglePasswordVisibility"></span>
        </div>

        <p v-if="submitted && !isFormValid" class="error-message">
          ⚠️ Please fill in all fields.
        </p>

        <button type="submit" class="submit-button">Log In</button>
      </form>

      <p class="signup-link">
        Don't have an account?
        <a href="#" @click.prevent="goToSignup">Sign Up</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page-container {
  display: flex;
  max-width: 800px;
  margin: 40px auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: #fff;
}
.welcome-section {
  flex: 1;
  padding: 40px;
  background-color: #c9b59c;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 10px;
}


.form-section {
  flex: 1;
  padding: 40px;
}

.form-section input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: contain;
}

/* Eye Open (show password) */
.password-toggle.icon-open {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0a0a0'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z'/%3E%3C/svg%3E");
}

/* Eye Closed (hide password) */
.password-toggle.icon-closed {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0a0a0'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.72-2.89 3.49-4.8c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16c.57-.23 1.18-.36 1.83-.36zm-8.82 8.82L3 18.28l-1.44-1.44-.73-.73 1.44-1.44 2.37-2.37L1 5.27l1.41-1.41 18.3 18.3-1.41 1.41-4.9-4.9c-1.02.37-2.16.6-3.35.6-5 0-9.27-3.11-11-7.5 1.09-2.72 3.55-4.81 6.38-5.71l-1.42-1.42c-2.88 1.02-5.45 3.1-7.44 5.71L1 12l2.18 2.18zM12 10.15c-.48 0-.91.13-1.29.35l2.49 2.49c.22-.38.35-.81.35-1.29 0-1.38-1.12-2.5-2.5-2.5z'/%3E%3C/svg%3E");
}

/* Dynamically apply open/closed */
.password-toggle {
  background-image: url("");
}

.password-input-wrapper input:focus + .password-toggle {
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #d4a267;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #c49463;
}

.error-message {
  color: #d9534f;
  font-size: 14px;
}

.signup-link {
  text-align: center;
  margin-top: 10px;
}

.signup-link a {
  color: #d8a776;
  text-decoration: none;
  font-weight: 500;
}
</style>
