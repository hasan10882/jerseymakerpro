"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import Papa from "papaparse";
import { Pie } from "react-chartjs-2";
import ReactToPrint from "react-to-print";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SHEET_API_URL =
  "https://v1.nocodeapi.com/hasan10882/google_sheets/XqEwfbmmhMrXOA...UAH?tabId=MyOrders";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  // Auth + admin-claim check
  useEffect(() => {
    const unsub = onAuthStateChanged(async (u) => {
      if (u) {
        const token = await getIdTokenResult(u, true);
        if (token.claims.admin) {
          setUser(u);
          setIsAdmin(true);
        } else {
          alert("Access denied. Admins only.");
          window.location.href = "/";
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch orders once we know they're an admin
  useEffect(() => {
    if (!user || !isAdmin) return;

    fetch(SHEET_API_URL)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.data || []);
        setLastUpdated(new Date().toLocaleString());
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  }, [user, isAdmin]);

  // Handle status change
  const handleStatusChange = async (i: number, newStatus: string) => {
    const payload = { row: i + 2, cell: "G", value: newStatus };
    try {
      const res = await fetch(SHEET_API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const next = [...orders];
      next[i][6] = newStatus;
      setOrders(next);
      setLastUpdated(new Date().toLocaleString());
    } catch {
      alert("Failed to update status");
    }
  };

  // Filters & summary
  const filteredOrders = orders
    .filter((o) => statusFilter === "All" || o[6] === statusFilter)
    .filter((o) =>
      [o[1], o[2], o[4]]
        .some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

  const summary = {
    total: orders.length,
    Pending: orders.filter((o) => o[6] === "Pending").length,
    Processing: orders.filter((o) => o[6] === "Processing").length,
    Shipped: orders.filter((o) => o[6] === "Shipped").length,
    Delivered: orders.filter((o) => o[6] === "Delivered").length,
  };

  const chartData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Order Statuses",
        data: [
          summary.Pending,
          summary.Processing,
          summary.Shipped,
          summary.Delivered,
        ],
        backgroundColor: ["#facc15", "#38bdf8", "#4ade80", "#a78bfa"],
        borderWidth: 1,
      },
    ],
  };

  // CSV download helper
  const downloadCSV = (data: any[]) => {
    const rows = data.map((o) => ({
      firebaseEmail: o[0],
      name:          o[1],
      email:         o[2],
      address:       o[3],
      items:         o[4],
      date:          o[5],
      status:        o[6] || "Pending",
    }));
    const csvBlob = Papa.unparse(rows);
    const blob = new Blob([csvBlob], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `orders-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <main className="p-6">Checking admin access…</main>;
  if (!user || !isAdmin)
    return <main className="p-6 text-red-500">Access Denied.</main>;

  return (
    <main className="p-4 sm:p-6 space-y-6">
      {/* Header & print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
        <ReactToPrint
          trigger={() => (
            <button className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
              🖨️ Print Summary
            </button>
          )}
          content={() => summaryRef.current}
        />
      </div>

      {/* Summary + chart */}
      <div ref={summaryRef}>
        <div className="text-sm bg-white p-4 rounded shadow space-y-1 max-w-md">
          <p><strong>Total Orders:</strong> {summary.total}</p>
          <p><strong>Pending:</strong> {summary.Pending}</p>
          <p><strong>Processing:</strong> {summary.Processing}</p>
          <p><strong>Shipped:</strong> {summary.Shipped}</p>
          <p><strong>Delivered:</strong> {summary.Delivered}</p>
        </div>
        <div className="max-w-sm mt-4">
          <Pie data={chartData} />
        </div>
      </div>

      {/* Filters & CSV Export */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <input
          type="text"
          placeholder="Search name/email/item"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-2 py-1 rounded w-full sm:w-64"
        />

        <button
          onClick={() => downloadCSV(filteredOrders)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <p className="text-sm text-gray-500">
          No matching orders found.
        </p>
      ) : (
        filteredOrders.map((order, i) => (
          <div
            key={i}
            className="border p-4 mb-4 rounded bg-white shadow text-sm"
          >
            <p><strong>Firebase Email:</strong> {order[0]}</p>
            <p><strong>Name:</strong> {order[1]}</p>
            <p><strong>Email:</strong> {order[2]}</p>
            <p><strong>Address:</strong> {order[3]}</p>
            <p><strong>Items:</strong> {order[4]}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order[5]).toLocaleString()}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <label><strong>Status:</strong></label>
              <span
                className={`inline-block px-2 py-1 text-xs rounded font-semibold ${
                  order[6] === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order[6] === "Processing"
                    ? "bg-blue-100 text-blue-800"
                    : order[6] === "Shipped"
                    ? "bg-green-100 text-green-800"
                    : order[6] === "Delivered"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {order[6] || "Pending"}
              </span>

              <select
                value={order[6] || "Pending"}
                onChange={(e) =>
                  handleStatusChange(i, e.target.value)
                }
                className="ml-auto border px-2 py-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
