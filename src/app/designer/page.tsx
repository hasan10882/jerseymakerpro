"use client";

import { useState } from "react";
import Image from "next/image";

export default function Designer() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [color, setColor] = useState("#1e3a8a");
  const [font, setFont] = useState("font-sans");
  const [logo, setLogo] = useState<string | null>(null);
  const [size, setSize] = useState("M");

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      name,
      number,
      color,
      font,
      size,
      logo,
    };

    cart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Jersey added to cart!");
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Customize Your Jersey</h1>

      {/* Jersey Preview */}
      <div
        className="w-64 h-80 mb-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-white text-center relative"
        style={{ backgroundColor: color }}
      >
        <div className={`text-2xl font-bold ${font}`}>{name || "Player Name"}</div>
        <div className={`text-6xl font-bold ${font}`}>{number || "00"}</div>

        {logo && (
          <Image
            src={logo}
            alt="Team Logo"
            width={60}
            height={60}
            className="absolute top-4 right-4"
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-64">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 rounded border"
        />
        <input
          type="text"
          placeholder="Enter Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="px-4 py-2 rounded border"
        />

        {/* Font Selector */}
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="font-sans">Sans (default)</option>
          <option value="font-serif">Serif</option>
          <option value="font-mono">Mono</option>
        </select>

        {/* Size Selector */}
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="S">Size: S</option>
          <option value="M">Size: M</option>
          <option value="L">Size: L</option>
          <option value="XL">Size: XL</option>
        </select>

        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10"
        />

        {/* Logo Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setLogo(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </main>
  );
}
