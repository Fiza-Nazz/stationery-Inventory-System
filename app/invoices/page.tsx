"use client";
import { useEffect, useState } from "react";

type SaleItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type Sale = {
  _id: string;
  items: SaleItem[];
  totalAmount: number;
  totalProfit: number;
  paymentMethod: string;
};

export default function InvoicePage({ searchParams }: { searchParams: { saleId: string } }) {
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (!searchParams.saleId) return;
    fetch(`/api/sales/${searchParams.saleId}`)
      .then(res => res.json())
      .then(data => setSale(data.sale))
      .catch(err => console.error(err));
  }, [searchParams.saleId]);

  if (!sale) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      <p><strong>Sale ID:</strong> {sale._id}</p>
      <p><strong>Payment Method:</strong> {sale.paymentMethod}</p>
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Profit</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map(item => (
            <tr key={item.productId}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">{item.price}</td>
              <td className="border px-2 py-1">{(item.price - 0) * item.quantity}</td> {/* future: replace 0 with costPrice */}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4"><strong>Total Amount:</strong> {sale.totalAmount}</p>
      <p><strong>Total Profit:</strong> {sale.totalProfit}</p>
    </div>
  );
}
