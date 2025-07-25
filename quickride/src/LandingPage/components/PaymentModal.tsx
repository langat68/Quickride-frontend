// PaymentModal.tsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import  type { BookingData } from './BookingModal';
import '../Styling/PaymentModal.scss';

interface PaymentModalProps {
  bookingData: BookingData | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onBackToBooking: () => void;
}

const PaymentModal = ({ bookingData, isOpen, onClose, onPaymentSuccess, onBackToBooking }: PaymentModalProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!bookingData || !user) {
      setError('Booking data not available');
      return;
    }

    // Validate phone number
    if (!phoneNumber) {
      setError('Please enter your M-Pesa phone number');
      return;
    }

    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid phone number (format: 254XXXXXXXXX)');
      return;
    }

    setLoading(true);
    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create booking first
      const bookingResponse = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: bookingData.userId,
          carId: bookingData.carId,
          pickupDate: bookingData.pickupDate,
          returnDate: bookingData.returnDate,
          pickupLocation: bookingData.pickupLocation,
          totalAmount: bookingData.totalAmount,
          bookingReference: bookingData.bookingReference
        })
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
        // If payment initiation fails, delete the booking
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
        onPaymentSuccess();
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
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isOpen || !bookingData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Complete Payment</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="payment-container">
          {!processing ? (
            <>
              {/* Booking Summary */}
              <div className="payment-summary">
                <h4>Booking Summary</h4>
                <div className="summary-item">
                  <span>Car:</span>
                  <span>{bookingData.carName}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{bookingData.days} day{bookingData.days !== 1 ? 's' : ''}</span>
                </div>
                <div className="summary-item">
                  <span>Pickup Date:</span>
                  <span>{formatDate(bookingData.pickupDate)}</span>
                </div>
                <div className="summary-item">
                  <span>Return Date:</span>
                  <span>{formatDate(bookingData.returnDate)}</span>
                </div>
                <div className="summary-item">
                  <span>Pickup Location:</span>
                  <span>{bookingData.pickupLocation}</span>
                </div>
                <div className="summary-item">
                  <span>Price per day:</span>
                  <span>KES {bookingData.pricePerDay}</span>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span>KES {bookingData.totalAmount}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="payment-method">
                <h4>Payment Method</h4>
                
                <div className="phone-input">
                  <label htmlFor="phoneNumber">M-Pesa Phone Number:</label>
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

                <div className="payment-option">
                  <div className="payment-icon">📱</div>
                  <div className="payment-details">
                    <span className="payment-name">M-Pesa</span>
                    <span className="payment-description">Secure mobile payment</span>
                  </div>
                </div>
                
                {phoneNumber && (
                  <div className="payment-note">
                    <p>You will receive an M-Pesa prompt on <strong>{phoneNumber}</strong></p>
                    <p>Complete the transaction to confirm your booking</p>
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              {/* Actions */}
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={onBackToBooking} 
                  className="back-button"
                  disabled={loading}
                >
                  Back to Booking
                </button>
                <button 
                  type="button" 
                  onClick={handlePayment} 
                  className="pay-button"
                  disabled={loading || !phoneNumber}
                >
                  {loading ? 'Processing...' : `Pay KES ${bookingData.totalAmount}`}
                </button>
              </div>
            </>
          ) : (
            /* Processing State */
            <div className="processing-payment">
              <div className="processing-spinner"></div>
              <h4>Processing Payment...</h4>
              <div className="processing-steps">
                <p>✓ Booking created</p>
                <p>⏳ Sending M-Pesa prompt...</p>
                <p className="highlight">Check your phone for M-Pesa notification</p>
                <p className="highlight">Enter your PIN to complete payment</p>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;