import { useState, useEffect } from 'react';
import { Users, Car, CreditCard, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
//import '../Styling/AdminDashboard.scss';

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  createdAt: string;
}

interface Payment {
  id: number;
  bookingId: number;
  amount: string;
  paymentMethod: string;
  phoneNumber: string;
  paymentStatus: string;
  transactionId: string | null;
  paymentDate: string | null;
  createdAt: string;
  bookingReference: string;
}

interface Car {
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
  createdAt: string;
  updatedAt: string;
}

interface Booking {
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
  car: Car;
  user: User;
  payments: Payment[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, paymentsRes, bookingsRes, carsRes] = await Promise.all([
        fetch('http://localhost:3000/users', { credentials: 'include' }),
        fetch('http://localhost:3000/payments', { credentials: 'include' }),
        fetch('http://localhost:3000/bookings', { credentials: 'include' }),
        fetch('http://localhost:3000/cars', { credentials: 'include' })
      ]);

      if (!usersRes.ok || !paymentsRes.ok || !bookingsRes.ok || !carsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [usersData, paymentsData, bookingsData, carsData] = await Promise.all([
        usersRes.json(),
        paymentsRes.json(),
        bookingsRes.json(),
        carsRes.json()
      ]);

      setUsers(usersData.data || usersData);
      setPayments(paymentsData.data || paymentsData);
      setBookings(bookingsData.data || bookingsData);
      setCars(carsData.data || carsData);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string) => {
    return `KSh ${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'status-badge status-completed',
      pending: 'status-badge status-pending',
      confirmed: 'status-badge status-confirmed',
      cancelled: 'status-badge status-cancelled'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge';
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <Calendar size={24} />
            <div>
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <CreditCard size={24} />
            <div>
              <h3>{payments.length}</h3>
              <p>Total Payments</p>
            </div>
          </div>
          <div className="stat-card">
            <Car size={24} />
            <div>
              <h3>{cars.length}</h3>
              <p>Total Cars</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={20} />
          Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <CreditCard size={20} />
          Payments
        </button>
        <button 
          className={`tab-button ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          <Car size={20} />
          Cars
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'users' && (
          <div className="table-section">
            <h2>Users Management</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view-btn">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn edit-btn">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn delete-btn">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="table-section">
            <h2>Bookings Management</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Pickup Date</th>
                    <th>Return Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.bookingReference}</td>
                      <td>{booking.user.name}</td>
                      <td>{booking.car.name}</td>
                      <td>{formatDate(booking.pickupDate)}</td>
                      <td>{formatDate(booking.returnDate)}</td>
                      <td>{formatCurrency(booking.totalAmount)}</td>
                      <td>
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view-btn">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn edit-btn">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="table-section">
            <h2>Payments Management</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Booking Ref</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                    <th>Payment Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.bookingReference}</td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td className="payment-method">{payment.paymentMethod}</td>
                      <td>{payment.phoneNumber}</td>
                      <td>
                        <span className={getStatusBadge(payment.paymentStatus)}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td>{payment.transactionId || 'N/A'}</td>
                      <td>{payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view-btn">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="table-section">
            <h2>Cars Management</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price/Day</th>
                    <th>Location</th>
                    <th>Seats</th>
                    <th>Fuel</th>
                    <th>Transmission</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id}>
                      <td>
                        <img 
                          src={car.imageUrl} 
                          alt={car.name}
                          className="car-thumbnail"
                        />
                      </td>
                      <td>{car.name}</td>
                      <td>{car.category}</td>
                      <td>{formatCurrency(car.pricePerDay)}</td>
                      <td>{car.location}</td>
                      <td>{car.seats}</td>
                      <td>{car.fuelType}</td>
                      <td>{car.transmission}</td>
                      <td>
                        <span className={`availability-badge ${car.isAvailable ? 'available' : 'unavailable'}`}>
                          {car.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view-btn">
                            <Eye size={16} />
                          </button>
                          <button className="action-btn edit-btn">
                            <Edit size={16} />
                          </button>
                          <button className="action-btn delete-btn">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;