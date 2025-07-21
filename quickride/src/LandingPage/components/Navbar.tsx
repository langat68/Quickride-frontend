import { Car, Menu, Phone } from "lucide-react";
import "../Styling/Navbar.scss";

const Navbar = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__inner">
          {/* Logo */}
          <div className="header__logo">
            <div className="header__logo-icon">
              <Car className="icon" />
            </div>
            <span className="header__logo-text">QuickRide</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="header__nav">
            <a href="#cars">Cars</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="header__cta">
            <button className="btn btn-outline">
              <Phone className="icon-sm" />
              Call Us
            </button>
            <button className="btn btn-primary">Book Now</button>
          </div>

          {/* Mobile Menu */}
          <button className="header__mobile-btn">
            <Menu className="icon-sm" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
