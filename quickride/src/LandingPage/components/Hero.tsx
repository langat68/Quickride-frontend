import { useEffect, useState } from "react";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import "../Styling/Hero.scss";

// three Unsplash car images
const carImages = [
  // Parked car 1
  "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // Parked car 2
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // Car on the road
  "https://images.unsplash.com/photo-1566009002888-a8e15b0e1650?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];


const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carImages.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {/* Background */}
      <div className="hero__bg">
        <img src={carImages[currentImage]} alt="Premium car rental" />
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__text">
          <h1>
            Premium Cars for <span>Every Journey</span>
          </h1>
          <p>
            Experience the freedom of the road with our premium fleet. Fast booking, reliable service, competitive prices.
          </p>

          {/* Search Card */}
          <div className="search-card">
            <div className="search-grid">
              {/* Pickup Location */}
              <div className="field">
                <label>
                  <MapPin className="icon" />
                  Pickup Location
                </label>
                <select>
                  <option>Select location</option>
                  <option value="airport">Airport</option>
                  <option value="downtown">Downtown</option>
                  <option value="hotel">Hotel District</option>
                </select>
              </div>

              {/* Pickup Date */}
              <div className="field">
                <label>
                  <Calendar className="icon" />
                  Pickup Date
                </label>
                <input type="date" />
              </div>

              {/* Return Date */}
              <div className="field">
                <label>
                  <Clock className="icon" />
                  Return Date
                </label>
                <input type="date" />
              </div>

              {/* Search Button */}
              <div className="field search-btn">
                <button>
                  <Search className="icon" />
                  Find Cars
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            <div>
              <div className="stat-value">500+</div>
              <div className="stat-label">Premium Cars</div>
            </div>
            <div>
              <div className="stat-value">50+</div>
              <div className="stat-label">Locations</div>
            </div>
            <div>
              <div className="stat-value">10k+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
