<template>
  <section class="contact-section">

      <!-- Contact Form -->
      <div class="contact-form-container">
        <div class="contact-form">
          <h3 class="form-title">Send us a message</h3>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Name"
            class="form-input"
          />
          <input
            v-model="formData.email"
            type="email"
            placeholder="Email"
            class="form-input"
          />
          <textarea
            v-model="formData.message"
            placeholder="Message"
            rows="4"
            class="form-textarea"
          ></textarea>
          <button @click="submitForm" class="form-submit">Submit</button>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="contact-info">
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <h4 class="contact-label">Visit us</h4>
          <p class="contact-detail">Tool kork, Phnom penh</p>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📞</span>
          <h4 class="contact-label">Call us</h4>
          <p class="contact-detail">+855 98 214 5218</p>
        </div>
        <div class="contact-item">
          <span class="contact-icon">✉️</span>
          <h4 class="contact-label">Email</h4>
          <p class="contact-detail">sjdstyle@gmail.com</p>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <h3 class="map-title">📍
          <a href="https://maps.app.goo.gl/pu5sbhKriyAf7pW2A?g_st=atm">
          Our location</a>
        </h3>
        <div class="map-container">
          <img src="/image/location.png" class="map-img" />
        </div>
      </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const formData = ref({
  name: '',
  email: '',
  message: ''
});
const submitForm = () => {
  // Handle form submission logic here
  console.log('Form submitted:', formData.value);
  // Clear form after submission
  formData.value = { name: '', email: '', message: '' };
};
</script>
<style scoped>
  /* Contact Section */
.contact-section {
  /* background: white; */
  padding: 80px 40px;
}

.contact-form-container {
  max-width: 800px;
  margin: 40px auto 60px;
}

.contact-form {
  background: #F5F1ED;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.hero-image {
  max-width: 300px;
  border-radius: 8px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}



.form-title {
  font-family: "Playfair Display", serif;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #000;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 16px 20px;
  margin-bottom: 20px;
  background: white;
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #C5B8AD;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-submit {
  background: #C5B8AD;
  color: #000;
  border: none;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-submit:hover {
  background: #B5A89D;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto 60px;
  text-align: center;
}

.contact-icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: block;
}

.contact-label {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #000;
}

.contact-detail {
  font-size: 14px;
  color: #666;
}

/* Map Section */
.map-section {
  max-width: 1200px;
  margin: 0 auto;
}

.map-title {
  font-family: "Playfair Display", serif;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.map-container {
  background: #E5E5E5;
  border-radius: 20px;
  height: 400px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
