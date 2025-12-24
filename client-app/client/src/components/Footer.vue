<template>
  <footer class="footer">
    <div class="footer-content">

      <!-- CONTACT SECTION -->
      <div class="footer-section">
        <h3>Contact Us</h3>
        <p>We’d love to hear from you! Reach us anytime.</p>
        <p><font-awesome-icon icon="fa-solids fa-location" style="color: var(--primary-blue);"/> 18 Asemota street airport Benin city</p>
        <p><font-awesome-icon icon="fa-solids fa-phone" /> +234 7063131606</p>
        <p><font-awesome-icon icon="fa-solids fa-phone" /> +234 7063131606</p>
        <div class="contact-icons">
          <a
            href="https://wa.me/2348012345678"
            target="_blank"
            aria-label="WhatsApp"
          >
        <font-awesome-icon class = "whatsapp" icon="fa-brands fa-whatsapp" />
          </a>
          <a href="mailto:support@gadgethub.com" aria-label="Email">
            <font-awesome-icon icon="fa-solid fa-envelope" />
          </a>
        </div>
      </div>

      <!-- QUICK LINKS -->
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><router-link to="/" class="link">Home</router-link></li>
          <li><router-link to="/shop" class="link">Shop</router-link></li>
          <li><router-link to="/contact" class="link">Contact</router-link></li>
          <!-- <li><router-link to="/about" class="link">About Us</router-link></li> -->
        </ul>
      </div>

      <!-- STORE HOURS -->
      <div class="footer-section">
        <h3>Store Hours</h3>
        <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
        <p>Sat: 10:00 AM - 6:00 PM</p>
        <p>Sun: Closed</p>
      </div>

    </div>

    <!-- SLOGAN -->
    <div class="footer-bottom">
      <p class="slogan">Your digital gadgets store</p>
      <p class="copyright">
        © {{ new Date().getFullYear() }} techbycas. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
}

.footer {
  background-color: #ffffff;
  color: var(--primary-black);
  padding: 50px 10% 30px;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 40px;
  justify-content: space-between;
  margin-bottom: 40px;
}

/* ========== Section Styling ========== */
.footer-section h3 {
  color: var(--primary-black);
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
  text-transform: uppercase;
}

.footer-section p {
  color: var(--secondary-white);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section .link {
  color: var(--secondary-white);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-section .link:hover {
  color: #00aeff;
}

/* ========== Contact Icons ========== */
.contact-icons {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.contact-icons a {
  font-size: 20px;
  border: 1px solid rgb(189, 187, 187);
  padding: 8px 13px;
  border-radius: 80%;
  background: rgb(228, 226, 226);
  text-decoration: none;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.contact-icons a:hover {
  transform: scale(1.15);
  opacity: 0.85;
}

.contact-icons .whatsapp {
  color: #25D366;
}
.contact-icons a.email {
  color: #00aeff;
}


/* ========== Bottom Section ========== */
.footer-bottom {
  border-top: 1px solid #eee;
  padding-top: 25px;
  text-align: center;
}

.footer-bottom .slogan {
  font-size: 15px;
  font-weight: 500;
  color: var(--secondary-black);
  margin-bottom: 6px;
  font-style: italic;
}

.footer-bottom .copyright {
  font-size: 13px;
  color: #777;
}

/* ========== Responsive ========== */
@media (max-width: 600px) {
  .footer {
    padding: 40px 6% 25px;
  }
  .footer-section h3 {
    font-size: 16px;
  }
  .footer-section p,
  .footer-section ul li a {
    font-size: 14px;
  }
}
</style>
