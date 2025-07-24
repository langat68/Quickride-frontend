// Fleet.tsx
import { useEffect, useState } from 'react';
import BookingModal from './BookingModal';
import '../Styling/Fleet.scss';

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

const Fleet = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleBook = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleBookingSuccess = () => {
    setSuccessMessage('Booking created successfully! You will receive a confirmation email shortly.');
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const dismissSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <div className="fleet-container">
      <h2>Available Fleet</h2>

      {loading && <p>Loading cars...</p>}
      {error && <p className="error">{error}</p>}

      {/* Success Message */}
      {successMessage && (
        <div className="success-message" onClick={dismissSuccessMessage}>
          {successMessage}
          <button className="dismiss-button" onClick={dismissSuccessMessage}>
            &times;
          </button>
        </div>
      )}

      <div className="car-list">
        {cars.map((car) => (
          <div className="car-card" key={car.id}>
            <img
              src={car.imageUrl || '/placeholder.jpg'}
              alt={car.name}
              className="car-image"
            />
            <div className="car-details">
              <h3>{car.name}</h3>
              <p>Category: {car.category}</p>
              <p>Fuel: {car.fuelType}</p>
              <p>Transmission: {car.transmission}</p>
              <p>Seats: {car.seats}</p>
              <p>Location: {car.location}</p>
              <p>Price per Day: <strong>KES {car.pricePerDay}</strong></p>

              <button className="book-button" onClick={() => handleBook(car)}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <BookingModal
        car={selectedCar}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Fleet;