"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSite() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("macro");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      address,
      coordinates: { lat: 0, lon: 0 },
      type,
      access_type: true,
      category: "A",
      provider_type: "vendorX",
    };
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) router.push("/sites");
    else {
      const b = await res.json();
      alert("Create failed: " + (b?.error ?? "unknown"));
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-medium">Créer un site</h2>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded" />
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded">
          <option value="macro">Macro</option>
          <option value="micro">Micro</option>
        </select>
        <div className="flex gap-2">
          <button className="rounded bg-black text-white px-4 py-2">Create</button>
        </div>
      </form>
    </div>
  );
}
