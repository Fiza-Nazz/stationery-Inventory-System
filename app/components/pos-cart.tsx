"use client";

import { useCart } from "@/hooks/useCart";

export default function PosCart() {
  const { items, removeItem, updateQuantity } = useCart();
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="border p-4">
      <h2 className="font-bold mb-2">Cart</h2>
      {items.map(i => (
        <div key={i._id} className="flex justify-between mb-2">
          <span>{i.name} x {i.quantity}</span>
          <input type="number" value={i.quantity} min={1} onChange={e => updateQuantity(i._id, parseInt(e.target.value))} className="w-16 border px-1" />
          <button onClick={() => removeItem(i._id)} className="text-red-500">Remove</button>
        </div>
      ))}
      <div className="mt-2 font-bold">Subtotal: ${subtotal}</div>
    </div>
  );
}
