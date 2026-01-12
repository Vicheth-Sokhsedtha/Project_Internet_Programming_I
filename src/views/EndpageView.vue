<template>
  <footer class="full-footer">
  <div class="footer-container">

    <!-- LEFT SECTION -->
    <div class="footer-left">
      <h2 class="footer-logo">S3DStyle</h2>
      <p class="footer-text">
        Choose your style look with S3DStyle to make you more beautiful,
        confident, elegant, powerful, and easy.
      </p>

      <p class="footer-copy">© 2025 S3DStyle. All rights reserved.</p>
    </div>

    <!-- CENTER QUICK LINKS -->
    <div class="footer-links">
      <h3>Quick Links</h3>
      <ul>
        <li>Home</li>
        <li>Blog/Story</li>
        <li>Explore</li>
        <li>About Us</li>
        <li>Contact</li>
      </ul>
    </div>

    <!-- RIGHT SECTION -->
    <div class="footer-message">
      <h3>Send Us Message</h3>

      <div class="msg-box"></div>

      <div class="footer-icons">
        <img src="/image/image 27.png" />
        <img src="/image/image 29.png" />
        <img src="/image/image 28.png" />
      </div>
    </div>

  </div>

  <div class="footer-bottom">
    Made with ❤️ by owner.
  </div>
</footer>
</template>

<style>

  .full-footer {
  background: #d1bfa9;
  padding: 60px 80px;
  font-family: "Playfair Display", serif;
}

.footer-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 40px;
}

.footer-logo {
  font-size: 34px;
  font-weight: 600;
}

.footer-text {
  margin-top: 15px;
  font-size: 16px;
  line-height: 1.5;
  max-width: 280px;
}

.footer-copy {
  margin-top: 50px;
  font-size: 14px;
}

.footer-links h3,
.footer-message h3 {
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 600;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin: 6px 0;
  cursor: pointer;
}

.msg-box {
  width: 180px;
  height: 140px;
  background: #e0d8d0;
  border-radius: 10px;
  margin-bottom: 20px;
}

.footer-icons img {
  width: 28px;
  margin-right: 10px;
  cursor: pointer;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #b5a999;
  font-size: 14px;
}
</style>
