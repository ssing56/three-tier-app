import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <h1>ThreeTier Store</h1>
        <span>DevOps Learning Project</span>
      </header>

      <main className="container">
        <section className="hero">
          <p className="eyebrow">WELCOME TO OUR STORE</p>
          <h2>Products for everyday life</h2>
          <p>
            A three-tier application powered by React, Node.js,
            MongoDB and Docker.
          </p>
        </section>

        <section className="products-section">
          <h2>Our Products</h2>

          {loading && <p>Loading products...</p>}

          {error && <p className="error">Error: {error}</p>}

          {!loading && !error && products.length === 0 && (
            <p>No products found.</p>
          )}

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-icon">
                  {product.category === "Electronics" ? "💻" : "🎧"}
                </div>
                <p className="category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    window.alert(`${product.name} selected`)
                  }
                >
                  View Product
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        ThreeTier Store · Built for DevOps practice
      </footer>
    </div>
  );
}

export default App;
