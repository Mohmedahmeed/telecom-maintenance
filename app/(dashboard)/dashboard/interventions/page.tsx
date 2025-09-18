// app/(dashboard)/dashboard/interventions/page.tsx
import { createClient } from "../../../../lib/supabase/server";
import { InterventionsTable } from "../../../../components/interventions/interventions-table";
import { AddInterventionDialog } from "../../../../components/interventions/add-intervention-dialog";
import { Button } from "../../../../components/ui/button";
import { Plus, Wrench, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export default async function InterventionsPage() {
  const supabase = await createClient();
  
  // Fetch interventions with related data
  const { data: interventions, error } = await supabase
    .from("interventions")
    .select(`
      *,
      sites(name, code),
      equipment(name),
      profiles(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
  console.error("Error fetching interventions:", error.message, error.details, error.hint);
}  

  // Fetch sites
  const { data: sites } = await supabase
    .from("sites")
    .select("id, name, code")
    .eq("status", "active")
    .order("name");

  // Fetch equipment
  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, name, site_id, status")
    .in("status", ["operational", "maintenance"]) // Only show operational or maintenance equipment
    .order("name");

  // Fetch users with appropriate roles
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("role", ["technician", "engineer", "admin"])
    .order("full_name");

  if (error) {
    console.error("Error fetching interventions:", error);
  }

  // Quick stats
  const total = interventions?.length || 0;
  const scheduled = interventions?.filter(i => i.status === 'scheduled').length || 0;
  const inProgress = interventions?.filter(i => i.status === 'in_progress').length || 0;
  const completed = interventions?.filter(i => i.status === 'completed').length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-500" />
            <span>Maintenance & Interventions</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Schedule and track maintenance activities across the network
          </p>
        </div>
        <AddInterventionDialog 
          sites={sites || []} 
          equipment={equipment || []} 
          users={users || []}
        >
          <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Intervention
          </Button>
        </AddInterventionDialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Scheduled</p>
                <p className="text-2xl font-bold text-yellow-600">{scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-purple-600">{total}</p>
              </div>
              <Wrench className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <InterventionsTable 
        interventions={interventions || []} 
        sites={sites || []} 
        equipment={equipment || []}
        users={users || []}
      />
    </div>
  );
}