import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function CartPage() {
  const { items, loading, subtotal, updateQuantity, removeItem } = useCart();

  if (loading) return <p>Loading cart...</p>;

  return (
    <section className="stack">
      <h1>Your Cart</h1>
      {!items.length ? (
        <p>
          Your cart is empty. <Link to="/shop">Go shopping</Link>
        </p>
      ) : (
        <>
          <div className="stack">
            {items.map((item) => (
              <article className="cart-item glass" key={item.id}>
                <img src={item.products?.image} alt={item.products?.title} />
                <div>
                  <h3>{item.products?.title}</h3>
                  <p>${item.products?.price.toFixed(2)}</p>
                </div>
                <div className="qty-group">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="ghost-btn" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
          <div className="checkout-summary glass">
            <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
            <Link to="/checkout" className="cta-btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default CartPage;
