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

interface BookingModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

interface BookingData {
  userId: number;
  carId: number;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalAmount: number;
  bookingReference: string;
}

type ModalStep = 'booking' | 'payment' | 'processing';

const BookingModal = ({ car, isOpen, onClose, onBookingSuccess }: BookingModalProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStep, setCurrentStep] = useState<ModalStep>('booking');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available pickup locations
  const locations = [
    'Nairobi CBD',
    'JKIA Airport',
    'Westlands',
    'Karen',
    'Kilimani',
    'Kiambu',
    'Thika',
    'Nakuru',
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
      setPhoneNumber('');
      setCurrentStep('booking');
      setBookingData(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !car) {
      setError('User not authenticated or car not selected');
      return;
    }

    if (!pickupDate || !returnDate || !pickupLocation || !phoneNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      setError('Return date must be after pickup date');
      return;
    }

    // Validate phone number (basic Kenya format)
    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid phone number (format: 254XXXXXXXXX)');
      return;
    }

    setError(null);

    // Prepare booking data and move to payment step
    const bookingDataTemp: BookingData = {
      userId: user.id,
      carId: car.id,
      pickupDate: new Date(pickupDate).toISOString(),
      returnDate: new Date(returnDate).toISOString(),
      pickupLocation,
      totalAmount: calculateTotal(),
      bookingReference: generateBookingReference()
    };

    setBookingData(bookingDataTemp);
    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    if (!bookingData || !user) {
      setError('Booking data not available');
      return;
    }

    setLoading(true);
    setCurrentStep('processing');
    setError(null);

    try {
      // Step 1: Create booking first (temporary)
      const bookingResponse = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await bookingResponse.json();
      const bookingId = booking.id || booking.bookingId;

      // Step 2: Initiate payment
      const paymentData = {
        bookingId: bookingId,
        amount: bookingData.totalAmount,
        paymentMethod: 'mpesa',
        phoneNumber: phoneNumber
      };

      const paymentResponse = await fetch(`http://localhost:3000/payments/initiate/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!paymentResponse.ok) {
        // If payment initiation fails, we should delete the booking
        await fetch(`http://localhost:3000/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        throw new Error('Failed to initiate payment');
      }

      const paymentResult = await paymentResponse.json();
      
      // Check if payment was successful based on your backend response
      if (paymentResult.success || paymentResult.status === 'success') {
        onBookingSuccess();
        onClose();
      } else {
        // Payment failed, delete the booking
        await fetch(`http://localhost:3000/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setError('Payment failed. Please try again.');
        setCurrentStep('payment');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setCurrentStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const renderBookingForm = () => (
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

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number (M-Pesa):</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="254XXXXXXXXX"
          required
        />
        <small>Enter your M-Pesa phone number (format: 254XXXXXXXXX)</small>
      </div>

      <div className="booking-summary">
        <p><strong>Duration:</strong> {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</p>
        <p><strong>Price per day:</strong> KES {car?.pricePerDay}</p>
        <p><strong>Total Amount:</strong> KES {calculateTotal()}</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="confirm-button">
          Proceed to Payment
        </button>
      </div>
    </form>
  );

  const renderPaymentForm = () => (
    <div className="payment-form">
      <div className="payment-summary">
        <h4>Payment Summary</h4>
        <div className="summary-item">
          <span>Car:</span>
          <span>{car?.name}</span>
        </div>
        <div className="summary-item">
          <span>Duration:</span>
          <span>{calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</span>
        </div>
        <div className="summary-item">
          <span>Pickup:</span>
          <span>{pickupDate}</span>
        </div>
        <div className="summary-item">
          <span>Return:</span>
          <span>{returnDate}</span>
        </div>
        <div className="summary-item">
          <span>Location:</span>
          <span>{pickupLocation}</span>
        </div>
        <div className="summary-item total">
          <span>Total Amount:</span>
          <span>KES {calculateTotal()}</span>
        </div>
      </div>

      <div className="payment-method">
        <h4>Payment Method</h4>
        <div className="payment-option selected">
          <img src="/mpesa-logo.png" alt="M-Pesa" className="payment-logo" />
          <span>M-Pesa</span>
        </div>
        <p className="payment-note">
          You will receive an M-Pesa prompt on <strong>{phoneNumber}</strong>
        </p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="modal-actions">
        <button 
          type="button" 
          onClick={() => setCurrentStep('booking')} 
          className="back-button"
        >
          Back
        </button>
        <button 
          type="button" 
          onClick={handlePayment} 
          className="pay-button"
        >
          Pay KES {calculateTotal()}
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="processing-payment">
      <div className="processing-spinner"></div>
      <h4>Processing Payment...</h4>
      <p>Please complete the payment on your phone</p>
      <p>Check your M-Pesa notifications and enter your PIN</p>
      {error && <p className="error-message">{error}</p>}
    </div>
  );

  if (!isOpen || !car) return null;

  const getModalTitle = () => {
    switch (currentStep) {
      case 'booking': return `Book ${car.name}`;
      case 'payment': return 'Complete Payment';
      case 'processing': return 'Processing...';
      default: return `Book ${car.name}`;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getModalTitle()}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        {currentStep === 'booking' && renderBookingForm()}
        {currentStep === 'payment' && renderPaymentForm()}
        {currentStep === 'processing' && renderProcessing()}
      </div>
    </div>
  );
};

export default BookingModal;