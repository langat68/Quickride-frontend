import { Search, MapPin, Calendar, Clock } from "lucide-react";
import heroImage from "../../assets/vadym-kudriavtsev-Yv2sZDSnlZY-unsplash.jpg";
import "../Styling/Hero.scss";

const Hero = () => {
  return (
    <section className="hero">
      {/* Background */}
      <div className="hero__bg">
        <img src={heroImage} alt="Premium car rental" />
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__text">
          <h1>
            Premium Cars for
            <span>Every Journey</span>
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
