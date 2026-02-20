import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

function Navbar() {
  const { user, isAdmin } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    pushToast('Logged out successfully', 'success');
    navigate('/');
  };

  return (
    <header className="nav-wrap">
      <nav className="navbar">
        <Link to="/" className="brand">
          BlackLuxe
        </Link>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {user ? (
            <button className="ghost-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/auth">Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
