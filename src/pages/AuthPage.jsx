import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;
    setLoading(false);

    if (error) return pushToast(error.message, 'error');

    pushToast(mode === 'login' ? 'Welcome back!' : 'Account created. Check your email to verify.', 'success');
    navigate(location.state?.from?.pathname || '/');
  };

  return (
    <section className="auth-card glass">
      <h1>{mode === 'login' ? 'Login' : 'Create Account'}</h1>
      <form onSubmit={handleSubmit} className="stack">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      <button className="ghost-btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
    </section>
  );
}

export default AuthPage;
