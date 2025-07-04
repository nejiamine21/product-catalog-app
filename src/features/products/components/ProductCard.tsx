import type { Product } from "../types";

interface Props {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductCard = ({ product, isFavorite, onToggleFavorite }: Props) => {
  const renderStars = (rate: number) => {
    const full = Math.floor(rate);
    return (
      <div className="text-warning mb-2">
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </div>
    );
  };

  return (
    <div className="card h-100 position-relative">
      <button
        className="btn position-absolute top-0 end-0 m-2 p-0 bg-white rounded-circle"
        onClick={onToggleFavorite}
        title={isFavorite ? "Unfavorite" : "Favorite"}
        style={{ width: "32px", height: "32px" }}
      >
        <i
          className={`bi ${isFavorite ? "bi-heart-fill text-danger" : "bi-heart text-dark"}`}
          style={{ fontSize: "1.2rem" }}
        />
      </button>

      <img
        src={product.image}
        alt={product.title}
        className="card-img-top p-3"
        style={{ height: "250px", objectFit: "contain" }}
      />

      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.title}</h6>
        <p className="card-text text-muted">{product.category}</p>
        {renderStars(product.rating?.rate || 0)}
        <p className="card-text fw-bold mt-auto">${product.price}</p>
      </div>
    </div>
  );
};
