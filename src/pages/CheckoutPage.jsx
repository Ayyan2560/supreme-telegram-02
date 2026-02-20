import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!items.length) return pushToast('Your cart is empty', 'error');

    const { error } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total_price: subtotal, status: 'placed' });

    if (error) return pushToast('Failed to place order', 'error');

    await clearCart();
    pushToast('Order placed successfully!', 'success');
    navigate('/orders');
  };

  return (
    <section className="checkout-summary glass stack">
      <h1>Checkout</h1>
      <p>Items: {items.length}</p>
      <p>Total: ${subtotal.toFixed(2)}</p>
      <button onClick={placeOrder}>Place Order</button>
    </section>
  );
}

export default CheckoutPage;
