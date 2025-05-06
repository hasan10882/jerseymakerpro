"use client";

import { useEffect, useState } from "react";

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item, index) => (
  <div key={index} className="border p-4 rounded shadow bg-gray-50">
    <p><strong>Name:</strong> {item.name}</p>
    <p><strong>Number:</strong> {item.number}</p>
    <p><strong>Color:</strong> <span style={{ color: item.color }}>{item.color}</span></p>
    <p><strong>Font:</strong> {item.font}</p>
    {item.logo && (
      <img src={item.logo} alt="Logo" className="w-16 h-16 mt-2" />
    )}

    <button
      onClick={() => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
      }}
      className="mt-4 text-sm text-red-600 hover:underline"
    >
      Remove
    </button>
  </div>
          ))}
        </div>
      )}
    </main>
  );
}
