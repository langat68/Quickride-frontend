import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Car, CreditCard, Phone } from 'lucide-react';
import { useAppSelector } from '../../redux';
import '../Styling/Dashboard.scss';

interface ApiBooking {
  id: number;
  userId: number;
  carId: number;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalAmount: string;
  status: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
  car: {
    id: number;
    name: string;
    category: string;
    pricePerDay: string;
    seats: number;
    fuelType: string;
    transmission: string;
    description: string | null;
    imageUrl: string;
    location: string;
    isAvailable: boolean;
  };
  payments: ApiPayment[];
}

interface ApiPayment {
  id: number;
  bookingId: number;
  amount: string;
  paymentMethod: string;
  phoneNumber: string;
  paymentStatus: string;
  transactionId: string | null;
  paymentDate: string | null;
  createdAt: string;
  bookingReference?: string;
}

interface PaymentsResponse {
  success: boolean;
  data: ApiPayment[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

const Dashboard = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings and payments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch bookings
        const bookingsResponse = await fetch('http://localhost:3000/bookings');

        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const bookingsData: ApiBooking[] = await bookingsResponse.json();

        // Fetch payments
        const paymentsResponse = await fetch('http://localhost:3000/payments');

        if (!paymentsResponse.ok) {
          throw new Error('Failed to fetch payments');
        }

        const paymentsData: PaymentsResponse = await paymentsResponse.json();

        // Filter bookings for current user
        const userBookings = user ? bookingsData.filter(booking => booking.userId === user.id) : [];
        
        // Get booking IDs for the current user
        const userBookingIds = userBookings.map(booking => booking.id);
        
        // Filter payments to only show payments for the current user's bookings
        const userPayments = paymentsData.data.filter(payment => 
          userBookingIds.includes(payment.bookingId)
        );
        
        setBookings(userBookings);
        setPayments(userPayments);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDuration = (pickupDate: string, returnDate: string) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const getTotalPaid = () => {
    return payments
      .filter(payment => payment.paymentStatus === 'completed')
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  };

  const handleCancelBooking = async (bookingId: number, bookingReference: string) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to cancel booking ${bookingReference}? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Remove the booking from local state
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.id !== bookingId)
      );

      // Also remove any payments associated with this booking
      setPayments(prevPayments => 
        prevPayments.filter(payment => payment.bookingId !== bookingId)
      );

      alert('Booking cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__header">
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Here's an overview of your QuickRide bookings</p>
        </div>

        <div className="dashboard__stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              KSh {getTotalPaid().toLocaleString()}
            </div>
            <div className="stat-label">Total Paid</div>
          </div>
        </div>

        <div className="dashboard__bookings">
          <h2>Your Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <Car size={48} />
              <h3>No bookings yet</h3>
              <p>Your booking history will appear here once you make your first reservation.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card__header">
                    <div className="booking-info">
                      <h3>{booking.car.name}</h3>
                      <span className="car-category">{booking.car.category}</span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <div className="booking-price">
                      KSh {parseFloat(booking.totalAmount).toLocaleString()}
                    </div>
                  </div>

                  <div className="booking-card__details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <div>
                        <div className="location-from">Pickup: {booking.pickupLocation}</div>
                        <div className="location-to">Car Location: {booking.car.location}</div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>
                        {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{calculateDuration(booking.pickupDate, booking.returnDate)}</span>
                    </div>

                    <div className="detail-item">
                      <Car size={16} />
                      <span>
                        {booking.car.seats} seats • {booking.car.fuelType} • {booking.car.transmission}
                      </span>
                    </div>
                  </div>

                  <div className="booking-reference">
                    <small>Booking Reference: {booking.bookingReference}</small>
                  </div>

                  {booking.payments && booking.payments.length > 0 && (
                    <div className="booking-payments">
                      <h4>Payments:</h4>
                      {booking.payments.map((payment) => (
                        <div key={payment.id} className="payment-item">
                          <CreditCard size={14} />
                          <span>
                            KSh {parseFloat(payment.amount).toLocaleString()} - {payment.paymentMethod} 
                            ({payment.paymentStatus})
                          </span>
                          {payment.transactionId && (
                            <small>Ref: {payment.transactionId}</small>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <div className="booking-card__actions">
                      <button className="btn btn-outline">Modify</button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleCancelBooking(booking.id, booking.bookingReference)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {payments.length > 0 && (
          <div className="dashboard__payments">
            <h2>Recent Payments</h2>
            <div className="payments-list">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="payment-card">
                  <div className="payment-info">
                    <CreditCard size={20} />
                    <div>
                      <div className="payment-amount">
                        KSh {parseFloat(payment.amount).toLocaleString()}
                      </div>
                      <div className="payment-method">
                        {payment.paymentMethod} • {payment.phoneNumber}
                      </div>
                      {payment.bookingReference && (
                        <div className="payment-reference">
                          Booking: {payment.bookingReference}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="payment-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(payment.paymentStatus) }}
                    >
                      {getStatusText(payment.paymentStatus)}
                    </span>
                    <small>{formatDate(payment.createdAt)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;