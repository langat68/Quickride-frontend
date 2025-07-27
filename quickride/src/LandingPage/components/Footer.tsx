import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import "../Styling/Footer.scss";

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <Car size={20} />
              </div>
              <span className="logo-text">QuickRide</span>
            </div>
            <p className="footer-description">
              Your trusted partner for premium car rentals. Fast, reliable, and always ready for your next adventure.
            </p>
            <div className="footer-socials">
              <div className="social-icon"><Facebook size={18} /></div>
              <div className="social-icon"><Twitter size={18} /></div>
              <div className="social-icon"><Instagram size={18} /></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#cars">Our Fleet</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Locations</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-links">
            <h3>Services</h3>
            <ul>
              <li><a href="#">Short-term Rental</a></li>
              <li><a href="#">Long-term Rental</a></li>
              <li><a href="#">Corporate Packages</a></li>
              <li><a href="#">Airport Pickup</a></li>
              <li><a href="#">Chauffeur Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <Phone size={16} />
              <span> (+254) 123-4567</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>info@quickride.com</span>
            </div>
            <div className="contact-item address">
              <MapPin size={16} />
              <span>
  Yaya Centre, Argwings Kodhek Road<br />
  Kilimani, Nairobi 00100
</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 QuickRide. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
