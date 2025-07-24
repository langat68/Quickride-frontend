import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux';
import '../Styling/auth-form.scss';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Signup failed');

      // Auto-login after successful registration
      const loginRes = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        dispatch(loginSuccess(loginData));
        setMessage('🎉 Registration successful! Logging you in...');
        navigate('/');
      } else {
        dispatch(loginFailure());
        setMessage('🎉 Registration successful! Please log in manually.');
      }

      setForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      dispatch(loginFailure());
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="password-input-wrapper">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-btn"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

export default Register;