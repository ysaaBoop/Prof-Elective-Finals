import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password.trim().length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Registration successful. You can now log in.');
    navigate('/login');
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Register</h1>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && (
          <div className="message-box" style={{ marginTop: '16px' }}>
            {message}
          </div>
        )}

        <p className="auth-helper">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;