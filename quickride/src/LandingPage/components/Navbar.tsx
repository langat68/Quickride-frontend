import { Car, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Styling/Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

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
            <a href="#fleet">Our Fleet</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* CTA Button */}
          <div className="header__cta">
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Get Started
            </button>
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
