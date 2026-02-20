import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';

function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { pushToast } = useToast();

  useEffect(() => {
    const loadFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      setFeatured(data ?? []);
      setLoading(false);
    };
    loadFeatured();
  }, []);

  const handleAddToCart = async (id) => {
    const { error } = await addToCart(id);
    if (error) pushToast(error, 'error');
    else pushToast('Added to cart', 'success');
  };

  return (
    <div className="stack">
      <section className="hero glass">
        <p className="hero-kicker">Premium Minimal Commerce</p>
        <h1>Luxury shopping experience in a powerful dark interface.</h1>
        <p>Discover curated products, smooth checkout, and secure Supabase-powered infrastructure.</p>
        <Link to="/shop" className="cta-btn">
          Explore Collection
        </Link>
      </section>

      <section>
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading featured products...</p>
        ) : (
          <div className="grid-products">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Categories</h2>
        <div className="category-grid">
          {['Accessories', 'Electronics', 'Lifestyle', 'Fashion'].map((category) => (
            <div key={category} className="glass category-card">
              {category}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
