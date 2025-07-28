import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux';
import '../Styling/auth-form.scss';

// Google Sign-In types
declare global {
  interface Window {
    google: any;
  }
}

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  // Google Client ID
  const GOOGLE_CLIENT_ID = '796180283133-2kg93nfumm80p6nvuvsosch6eqrh6gnq.apps.googleusercontent.com';

  // Load Google Sign-In script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
          }
        );
      }
    };

    loadGoogleScript();
  }, []);

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
      navigate('/');
    } catch (err: any) {
      dispatch(loginFailure());
      setMessage(err.message || 'Something went wrong');
    }
  };

  const handleGoogleResponse = async (response: any) => {
    dispatch(loginStart());
    setMessage(null);

    try {
      const res = await fetch('https://quickride-backend-6.onrender.com/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          googleToken: response.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Google login failed');
      }

      dispatch(loginSuccess(data));
      setMessage('✅ Google login successful!');
      navigate('/');
    } catch (err: any) {
      dispatch(loginFailure());
      setMessage(err.message || 'Google login failed');
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

      {/* OR Divider */}
      <div className="auth-divider">
        <span>OR</span>
      </div>

      {/* Google Sign-In Button */}
      <div id="google-signin-button" className="google-signin-container"></div>

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