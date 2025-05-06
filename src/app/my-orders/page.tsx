"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import PrintableOrderCard from "../../components/PrintableOrderCard";

const SHEET_API_URL =
  "https://v1.nocodeapi.com/hasan10882/google_sheets/YOUR_API_KEY_HERE?tabId=MyOrders"; // Replace with your real API

export default function MyOrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(SHEET_API_URL);
        const data = await res.json();
        const rows = data.data;

        if (!Array.isArray(rows)) {
          console.error("Google Sheet returned no data.");
          setOrders([]);
          return;
        }

        const userOrders = rows.filter((row: any) => row[0] === user.email);
        setOrders(userOrders);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <main className="p-6">Loading...</main>;
  }

  if (!user) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">Please log in to see your orders</h1>
        <a href="/login" className="text-blue-600 underline">Go to Login</a>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        orders.map((order, i) => (
          <PrintableOrderCard key={i} order={order} />
        ))
      )}
    </main>
  );
}
