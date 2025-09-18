"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function SitesTable({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);

  async function deleteSite(id: number) {
    if (!confirm("Delete site?")) return;
    const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
    if (res.ok) setData(d => d.filter(s => s.id !== id));
    else {
      const body = await res.json();
      alert("Delete failed: " + (body?.error ?? res.statusText));
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Address</th>
            <th className="p-2">Type</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s: any) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.id}</td>
              <td className="p-2">{s.address ?? JSON.stringify(s.coordinates)}</td>
              <td className="p-2">{s.type}</td>
              <td className="p-2">{new Date(s.created_at).toLocaleString()}</td>
              <td className="p-2">
                <Link href={`/sites/${s.id}`} className="mr-3 underline">View</Link>
                <button onClick={() => deleteSite(s.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No sites found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
