import { Car, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux";
import { logout } from "../../redux";
import "../Styling/Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Extract initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2); // Take only first 2 initials
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

          {/* CTA Button or User Avatar */}
          <div className="header__cta">
            {isAuthenticated ? (
              <div className="user-avatar-container">
                <div className="user-avatar">
                  <span className="user-initials">
                    {user ? getInitials(user.name) : 'U'}
                  </span>
                </div>
                <div className="user-dropdown">
                  <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started
              </button>
            )}
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