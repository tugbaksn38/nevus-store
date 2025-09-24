// src/components/FakeStoreProductList.js
// src/components/FakeStoreProductList.js

export default function FakeStoreProductList({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg transition">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-contain mb-2"
            loading="lazy"
          />
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-green-600 font-bold">{product.price} $</p>
        </div>
      ))}
    </div>
  );
}