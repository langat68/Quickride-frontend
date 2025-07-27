import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { logout } from "../../redux";
import "../Styling/Navbar.scss";

// Import your logo image
import logo from "../../assets/1.png"; // Adjust path/filename as needed

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleUserIconClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleDashboard = () => {
    // ✅ Redirect based on user role
    const role = user?.role;
    if (role === 'admin') {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }
    setIsDropdownOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__inner">
          {/* Logo and Brand */}
          <div className="header__logo">
            <img src={logo} alt="Quickride Logo" className="logo-img" />
            <span className="brand-name">Quickride</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="header__nav">
            <a href="#fleet">Our Fleet</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* User Icon */}
          <div className="header__cta">
            {isAuthenticated ? (
              <div className="user-avatar-container" ref={dropdownRef}>
                <div
                  className="user-avatar"
                  onClick={handleUserIconClick}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  <span className="user-initials">
                    {user ? getInitials(user.name) : "U"}
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
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="user-icon-container">
                <User 
                  size={24} 
                  className="user-icon" 
                  onClick={handleUserIconClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;