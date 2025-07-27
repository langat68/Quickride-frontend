import { useEffect, useState } from "react";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import BookingModal from './BookingModal';
import type { BookingData } from './BookingModal';
import PaymentModal from './PaymentModal';
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

interface Car {
  id: number;
  name: string;
  category: string;
  pricePerDay: number;
  fuelType: string;
  seats: number;
  transmission: string;
  imageUrl?: string;
  location: string;
}

const locations = [
  'JKIA Airport',
  'Nakuru',
  'Mombasa',
  'Kisumu'
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Fleet functionality states
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Search states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carImages.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch all cars on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:3000/cars');
        if (!res.ok) throw new Error('Failed to fetch cars');
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Could not load cars');
      }
    };

    fetchCars();
  }, []);

  const handleSearch = () => {
    if (!selectedLocation) {
      setError('Please select a pickup location');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Selected location:', selectedLocation);
    console.log('Available cars:', cars);
    console.log('Car locations:', cars.map(car => car.location));

    // Filter cars by selected location
    const filtered = cars.filter(car => 
      car.location.toLowerCase().trim() === selectedLocation.toLowerCase().trim()
    );

    console.log('Filtered cars:', filtered);

    setFilteredCars(filtered);
    setShowResults(true);
    setLoading(false);

    if (filtered.length === 0) {
      setError(`No cars available in ${selectedLocation}. Available locations: ${[...new Set(cars.map(car => car.location))].join(', ')}`);
    }
  };

  const handleBook = (car: Car) => {
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedCar(null);
  };

  const handleProceedToPayment = (data: BookingData) => {
    setBookingData(data);
    setIsBookingModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setBookingData(null);
  };

  const handleBackToBooking = () => {
    setIsPaymentModalOpen(false);
    setIsBookingModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setSuccessMessage('Payment successful! Your car has been booked. You will receive a confirmation email shortly.');
    setBookingData(null);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const dismissSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <>
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
              Welcome  to <span>Quickride</span>
            </h1>
            <p>
              From quick city trips to weekend getaways, we're here to make every mile memorable. Let's find your perfect ride.
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
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Date */}
                <div className="field">
                  <label>
                    <Calendar className="icon" />
                    Pickup Date
                  </label>
                  <input 
                    type="date" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Return Date */}
                <div className="field">
                  <label>
                    <Clock className="icon" />
                    Return Date
                  </label>
                  <input 
                    type="date" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Search Button */}
                <div className="field search-btn">
                  <button onClick={handleSearch}>
                    <Search className="icon" />
                    Find Cars
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="hero__stats">
              <div>
                <div className="stat-value">15+</div>
                <div className="stat-label">Premium Cars</div>
              </div>
              <div>
                <div className="stat-value">5+</div>
                <div className="stat-label">Locations</div>
              </div>
              <div>
                <div className="stat-value">100+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Results Section */}
      {showResults && (
        <div className="fleet-container" style={{ padding: '2rem', backgroundColor: '#f8f9fa' }}>
          <h2>Available Cars in {selectedLocation}</h2>

          {loading && <p>Loading cars...</p>}
          {error && <p className="error" style={{ color: 'red', padding: '1rem' }}>{error}</p>}

          {/* Success Message */}
          {successMessage && (
            <div className="success-message" 
                 style={{ 
                   backgroundColor: '#d4edda', 
                   color: '#155724', 
                   padding: '1rem', 
                   borderRadius: '5px', 
                   margin: '1rem 0',
                   position: 'relative',
                   cursor: 'pointer'
                 }}
                 onClick={dismissSuccessMessage}>
              {successMessage}
              <button className="dismiss-button" 
                      onClick={dismissSuccessMessage}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer'
                      }}>
                &times;
              </button>
            </div>
          )}

          <div className="car-list" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {filteredCars.map((car) => (
              <div className="car-card" key={car.id} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <img
                  src={car.imageUrl || '/placeholder.jpg'}
                  alt={car.name}
                  className="car-image"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
                <div className="car-details">
                  <h3 style={{ marginBottom: '1rem', color: '#333' }}>{car.name}</h3>
                  <p><strong>Category:</strong> {car.category}</p>
                  <p><strong>Fuel:</strong> {car.fuelType}</p>
                  <p><strong>Transmission:</strong> {car.transmission}</p>
                  <p><strong>Seats:</strong> {car.seats}</p>
                  <p><strong>Location:</strong> {car.location}</p>
                  <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    <strong>Price per Day: KES {car.pricePerDay}</strong>
                  </p>

                  <button 
                    className="book-button" 
                    onClick={() => handleBook(car)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      marginTop: '1rem',
                      width: '100%',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        car={selectedCar}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Payment Modal */}
      <PaymentModal
        bookingData={bookingData}
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        onBackToBooking={handleBackToBooking}
      />
    </>
  );
};

export default Hero;