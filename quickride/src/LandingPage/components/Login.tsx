import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux';
import '../Styling/auth-form.scss';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    setMessage(null);

    try {
      const res = await fetch('https://quickride-backend-6.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Login failed');
      }

      dispatch(loginSuccess(data));
      setMessage('✅ Login successful!');

      // ✅ Redirect all users to homepage after login
      navigate('/');
    } catch (err: any) {
      dispatch(loginFailure());
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      {message && <p className="login-message">{message}</p>}

      <p className="register-link">
        Don't have an account?{' '}
        <Link to="/register" className="link-no-underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;