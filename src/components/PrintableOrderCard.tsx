"use client";

import { useRef } from "react";
import ReactToPrint from "react-to-print";

export default function PrintableOrderCard({ order }: { order: any }) {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border p-4 mb-6 rounded bg-white shadow">
      <div ref={componentRef}>
        <p><strong>Name:</strong> {order[1]}</p>
        <p><strong>Email:</strong> {order[2]}</p>
        <p><strong>Address:</strong> {order[3]}</p>

        <p><strong>Items:</strong></p>
        <ul className="list-disc ml-5">
          {Array.isArray(JSON.parse(order[4])) ? (
            JSON.parse(order[4]).map((item: any, i: number) => (
              <li key={i}>
                {item.name} #{item.number} – {item.size} –{" "}
                <span style={{ color: item.color }}>{item.color}</span>
              </li>
            ))
          ) : (
            <li>{order[4]}</li> // fallback if items are not parsed
          )}
        </ul>

        <p><strong>Date:</strong> {new Date(order[5]).toLocaleString()}</p>
        <p><strong>Status:</strong> {order[6] || "Pending"}</p>
      </div>

      <ReactToPrint
        trigger={() => (
          <button className="mt-2 text-sm text-blue-600 underline">
            Download Invoice
          </button>
        )}
        content={() => componentRef.current}
      />
    </div>
  );
}
