"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  category: string;
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  unit: string;
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleUpdate = async () => {
    if (!product) return;
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/inventory");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found!</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <div className="flex flex-col gap-2 w-1/2">
        <input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} placeholder="Name" />
        <input value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })} placeholder="Category" />
        <input type="number" value={product.costPrice} onChange={e => setProduct({ ...product, costPrice: Number(e.target.value) })} placeholder="Cost Price" />
        <input type="number" value={product.retailPrice} onChange={e => setProduct({ ...product, retailPrice: Number(e.target.value) })} placeholder="Retail Price" />
        <input type="number" value={product.wholesalePrice} onChange={e => setProduct({ ...product, wholesalePrice: Number(e.target.value) })} placeholder="Wholesale Price" />
        <input type="number" value={product.stock} onChange={e => setProduct({ ...product, stock: Number(e.target.value) })} placeholder="Stock" />
        <input value={product.unit} onChange={e => setProduct({ ...product, unit: e.target.value })} placeholder="Unit" />
        <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Update Product</button>
      </div>
    </div>
  );
}
