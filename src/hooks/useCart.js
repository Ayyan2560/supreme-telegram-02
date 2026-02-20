import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('cart')
      .select('id, quantity, product_id, products(id, title, price, image, description)')
      .eq('user_id', user.id);

    setItems(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId) => {
    if (!user) return { error: 'Please log in first.' };

    const existing = items.find((item) => item.product_id === productId);
    if (existing) {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
      await loadCart();
      return { error };
    }

    const { error } = await supabase
      .from('cart')
      .insert({ user_id: user.id, product_id: productId, quantity: 1 });
    await loadCart();
    return { error };
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) return removeItem(cartId);
    await supabase.from('cart').update({ quantity }).eq('id', cartId);
    await loadCart();
  };

  const removeItem = async (cartId) => {
    await supabase.from('cart').delete().eq('id', cartId);
    await loadCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('cart').delete().eq('user_id', user.id);
    await loadCart();
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.products?.price ?? 0) * item.quantity, 0),
    [items],
  );

  return {
    items,
    loading,
    subtotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: loadCart,
  };
}
