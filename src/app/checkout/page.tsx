"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const SHEET_API_URL = "https://v1.nocodeapi.com/hasan10882/google_sheets/XqEwfbmmhMrXOA...UAH?tabId=MyOrders";
; 
export default function Checkout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      data: [
        [
          user?.email || "guest",
          name,
          email,
          address,
          JSON.stringify(cart),
          new Date().toISOString(),
          "Pending",
        ],
      ],
    };

    try {
      const res = await fetch(SHEET_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API response error:", errorText);
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to submit order:", error);
      alert("Order submission failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Please log in first</h1>
        <a href="/login" className="text-blue-600 underline">
          Go to Login
        </a>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Order placed!</h1>
        <p>Thank you, {name}. We'll process your order shortly.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="px-4 py-2 border rounded"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Your Items</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="border p-3 mb-2 bg-white rounded">
              <p>
                <strong>{item.name}</strong> - #{item.number}
              </p>
              <p>
                Color:{" "}
                <span style={{ color: item.color }}>{item.color}</span>
              </p>
              <p>Size: {item.size}</p>
              {item.logo && (
                <img
                  src={item.logo}
                  alt="logo"
                  className="w-12 h-12 mt-2 object-contain"
                />
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
