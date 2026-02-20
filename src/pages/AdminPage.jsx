import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';

const initialForm = {
  title: '',
  price: '',
  description: '',
  image: '',
};

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { pushToast } = useToast();

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data ?? []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filename = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from('product-images').upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      pushToast('Image upload failed', 'error');
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(filename);

    setForm((prev) => ({ ...prev, image: publicUrl }));
    setUploading(false);
    pushToast('Image uploaded', 'success');
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      price: Number(form.price),
      description: form.description,
      image: form.image,
    };

    const query = editingId
      ? supabase.from('products').update(payload).eq('id', editingId)
      : supabase.from('products').insert(payload);

    const { error } = await query;
    if (error) return pushToast('Failed to save product', 'error');

    setForm(initialForm);
    setEditingId(null);
    pushToast(editingId ? 'Product updated' : 'Product created', 'success');
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return pushToast('Failed to delete product', 'error');
    pushToast('Product deleted', 'success');
    loadProducts();
  };

  return (
    <section className="stack">
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSave} className="glass stack admin-form">
        <input
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Price"
          required
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
        />
        <textarea
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <input type="file" accept="image/*" onChange={handleUploadImage} />
        {form.image && <img src={form.image} alt="Preview" className="preview-image" />}
        <button disabled={uploading}>{uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <div className="stack">
        {products.map((product) => (
          <article className="glass admin-item" key={product.id}>
            <div>
              <h3>{product.title}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
            <div className="row">
              <button className="ghost-btn" onClick={() => handleEdit(product)}>
                Edit
              </button>
              <button className="ghost-btn" onClick={() => handleDelete(product.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminPage;
