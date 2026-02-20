import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  return (
    <section className="stack">
      <h1>Order History</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : !orders.length ? (
        <p>No orders yet.</p>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <article key={order.id} className="glass order-card">
              <p>Order #{order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total_price.toFixed(2)}</p>
              <p>Placed: {new Date(order.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
