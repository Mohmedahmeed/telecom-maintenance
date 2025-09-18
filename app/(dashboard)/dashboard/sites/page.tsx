import { createClient } from "../../../../lib/supabase/server";
import { SitesTable } from "../../../../components/sites/sites-table";
import { AddSiteDialog } from "../../../../components/sites/add-site-dialog";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";

export default async function SitesPage() {
  const supabase = await createClient();
  
  const { data: sites, error } = await supabase
    .from("sites")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sites:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Sites Management</h2>
          <p className="text-muted-foreground">
            Gestion des stations de base du réseau mobile
          </p>
        </div>
        <AddSiteDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Button>
        </AddSiteDialog>
      </div>

      <SitesTable sites={sites || []} />
    </div>
  );
}