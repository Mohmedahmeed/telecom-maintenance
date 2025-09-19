// app/sites/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SitesTable from "@/components/SitesTable";

export default async function SitesPage() {
  const supabase = await createClient();
  const { data: sites } = await supabase
    .from("sites")
    .select("id,address,coordinates,type,created_at")
    .order("id", { ascending: false })
    .limit(500);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sites</h1>
        <Link href="/sites/new" className="rounded bg-black text-white px-4 py-2">Nouveau site</Link>
      </div>
      <SitesTable initialData={sites ?? []} />
    </div>
  );
}
