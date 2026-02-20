import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { pushToast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) pushToast('Failed to load products', 'error');
      setProducts(data ?? []);
      setLoading(false);
    };
    loadProducts();
  }, [pushToast]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
      .filter((item) => {
        if (priceFilter === 'under50') return item.price < 50;
        if (priceFilter === '50to150') return item.price >= 50 && item.price <= 150;
        if (priceFilter === 'over150') return item.price > 150;
        return true;
      });
  }, [products, search, priceFilter]);

  const handleAddToCart = async (id) => {
    const { error } = await addToCart(id);
    if (error) pushToast(error, 'error');
    else pushToast('Added to cart', 'success');
  };

  return (
    <section className="stack">
      <h1>Shop</h1>
      <div className="filters glass">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
        />
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="under50">Under $50</option>
          <option value="50to150">$50 - $150</option>
          <option value="over150">Over $150</option>
        </select>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid-products">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ShopPage;
