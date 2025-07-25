import { Car, Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { logout } from "../../redux";
import "../Styling/Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get auth state from Redux
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsDropdownOpen(false);
  };

  // Extract initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2); // Take only first 2 initials
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              <div className="user-avatar-container" ref={dropdownRef}>
                <div 
                  className="user-avatar"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  <span className="user-initials">
                    {user ? getInitials(user.name) : 'U'}
                  </span>
                </div>
                
                {isDropdownOpen && (
                  <div 
                    className="user-dropdown"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button className="dropdown-item" onClick={handleDashboard}>
                      <User size={16} />
                      My Dashboard
                    </button>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
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