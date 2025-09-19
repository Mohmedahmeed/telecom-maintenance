import { createClient } from "../../../../lib/supabase/server";
import { AlertsTable } from "../../../../components/alerts/alerts-table";
import { AddAlertDialog } from "../../../../components/alerts/add-alert-dialog";
import { Button } from "../../../../components/ui/button";
import { Plus, AlertTriangle, Shield, Zap, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export default async function AlertsPage() {
  const supabase = await createClient();
  
  // Fetch alerts with related data
  const { data: alerts, error } = await supabase
    .from("alerts")
    .select(`
      *,
      sites(name, code),
      equipment(name),
      profiles!alerts_acknowledged_by_fkey(full_name),
      resolved_profile:profiles!alerts_resolved_by_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching alerts:", error);
  }

  // Fetch sites for the add alert dialog
  const { data: sites } = await supabase
    .from("sites")
    .select("id, name, code")
    .eq("status", "active")
    .order("name");

  // Fetch equipment for the add alert dialog
  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, name, site_id")
    .order("name");

  // Quick stats
  const total = alerts?.length || 0;
  const active = alerts?.filter(a => a.status === 'active').length || 0;
  const critical = alerts?.filter(a => a.severity === 'critical').length || 0;
  const acknowledged = alerts?.filter(a => a.status === 'acknowledged').length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <span>System Alerts</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor and manage system alerts across the network
          </p>
        </div>
        <AddAlertDialog 
          sites={sites || []} 
          equipment={equipment || []}
        >
          <Button className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </AddAlertDialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{active}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Critical</p>
                <p className="text-2xl font-bold text-orange-600">{critical}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Acknowledged</p>
                <p className="text-2xl font-bold text-blue-600">{acknowledged}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Alerts</p>
                <p className="text-2xl font-bold text-green-600">{total}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertsTable 
        alerts={alerts || []} 
        sites={sites || []} 
        equipment={equipment || []}
      />
    </div>
  );
}