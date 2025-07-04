import { useEffect, useState } from "react";
import { useProducts } from "./hooks/useProduct";
import { ProductCard } from "./components/ProductCard";

const FAVORITE_KEY = "favoriteProductIds";

const ProductList = () => {
  const { products, loading, error } = useProducts();

  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);

  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITE_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    setCategories(unique);

    const prices = products.map((p) => p.price);
    const max = Math.ceil(Math.max(...prices));
    setMaxPrice(max);
    setPriceRange([0, max]);
  }, [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, sortOrder, priceRange]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products
    .filter(
      (p) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category)
    )
    .filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center mt-4">Error: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-3 mb-4">
          <h5>Categories</h5>
          {categories.map((cat) => (
            <div key={cat} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <label className="form-check-label" htmlFor={`cat-${cat}`}>
                {cat}
              </label>
            </div>
          ))}

          <hr />
          <h5 className="mt-3">Price Range</h5>
          <p>
            ${priceRange[0]} - ${priceRange[1]}
          </p>

          <label className="form-label">Min Price</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />

          <label className="form-label">Max Price</label>
          <input
            type="range"
            className="form-range"
            min={priceRange[0]}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>

        <div className="col-lg-9">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="form-select w-auto"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "asc" | "desc")
              }
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          <div className="row">
            {paginatedProducts.map((product) => (
              <div
                className="col-lg-4 col-md-6 col-sm-6 mb-4"
                key={product.id}
              >
                <ProductCard
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
