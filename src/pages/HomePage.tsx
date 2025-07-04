import ProductList from "../features/products";

const HomePage = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mt-4">Product Catalog</h1>
      <ProductList />
    </main>
  );
};

export default HomePage;
