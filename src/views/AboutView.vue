<template>
   <section class="about-section">


      <div class="about-content">
        <div class="about-images">
          <img src="/image/Rectangle 10.png" class="about-img img-midle">
          <img src="/image/Rectangle 9.png" class="about-img img-offset" />
          <img src="/image/Rectangle 8.png" class="about-img" />
        </div>
        <div class="about-text">
          <p class="about-quote">"This is our history and main purpose that own the store."</p>
          <p class="about-description">
            Our main purpose is to help save your time and make you more and more comfortable
            with fashion that suits your lifestyle and personality.
          </p>
        </div>
      </div>
    </section>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

/* About Section */
.about-section {
  padding: 80px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.about-content {
  display: flex;
  gap: 80px;
  align-items: center;
  margin-top: 40px;
}

.about-images {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

.about-img {
  width: 100%;
  height: 360px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s;
}

.about-img:hover {
  transform: scale(1.03);
}

.img-offset {
  margin-top: 40px;
}

.about-text {
  flex: 1;
}

.about-quote {
  font-family: "Playfair Display", serif;
  font-size: 26px;
  font-style: italic;
  margin-bottom: 28px;
  line-height: 1.6;
  color: #000;
}

.about-description {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
}
</style>
