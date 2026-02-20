function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card glass">
      <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
      <div className="product-body">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>${product.price.toFixed(2)}</strong>
          <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
