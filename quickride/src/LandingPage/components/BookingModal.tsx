// BookingModal.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import '../Styling/BookingModal.scss';

interface Car {
  id: number;
  name: string;
  pricePerDay: number;
}

export interface BookingData {
  userId: number;
  carId: number;
  carName: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalAmount: number;
  bookingReference: string;
  days: number;
  pricePerDay: number;
}

interface BookingModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (bookingData: BookingData) => void;
}

const BookingModal = ({ car, isOpen, onClose, onProceedToPayment }: BookingModalProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Available pickup locations
  const locations = [
    
    'JKIA Airport',
    'Naironi',
    'Mombasa',
    'Kisumu'
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 3);

      setPickupDate(tomorrow.toISOString().split('T')[0]);
      setReturnDate(dayAfter.toISOString().split('T')[0]);
      setPickupLocation('Nairobi CBD');
      setError(null);
    }
  }, [isOpen]);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = returnD.getTime() - pickup.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotal = () => {
    if (!car) return 0;
    return calculateDays() * car.pricePerDay;
  };

  const generateBookingReference = () => {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${random}${timestamp}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !car) {
      setError('User not authenticated or car not selected');
      return;
    }

    if (!pickupDate || !returnDate || !pickupLocation) {
      setError('Please fill in all fields');
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      setError('Return date must be after pickup date');
      return;
    }

    setError(null);

    // Prepare booking data for payment
    const bookingData: BookingData = {
      userId: user.id,
      carId: car.id,
      carName: car.name,
      pickupDate: new Date(pickupDate).toISOString(),
      returnDate: new Date(returnDate).toISOString(),
      pickupLocation,
      totalAmount: calculateTotal(),
      bookingReference: generateBookingReference(),
      days: calculateDays(),
      pricePerDay: car.pricePerDay
    };

    onProceedToPayment(bookingData);
  };

  if (!isOpen || !car) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Book {car.name}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date:</label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="returnDate">Return Date:</label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pickupLocation">Pickup Location:</label>
            <select
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>



          <div className="booking-summary">
            <p><strong>Duration:</strong> {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</p>
            <p><strong>Price per day:</strong> KES {car.pricePerDay}</p>
            <p><strong>Total Amount:</strong> KES {calculateTotal()}</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="confirm-button">
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;