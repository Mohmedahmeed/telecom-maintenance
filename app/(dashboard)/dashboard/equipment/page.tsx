import { createClient } from "../../../../lib/supabase/server";
import { EquipmentTable } from "../../../../components/equipment/equipment-table";
import { AddEquipmentDialog } from "../../../../components/equipment/add-equipment-dialog";
import { Button } from "../../../../components/ui/button";
import { Plus, Cpu, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export default async function EquipmentPage() {
  const supabase = await createClient();
  
  const { data: equipment, error } = await supabase
    .from("equipment")
    .select(`
      *,
      sites(name, code)
    `)
    .order("created_at", { ascending: false });

  const { data: sites } = await supabase
    .from("sites")
    .select("id, name, code")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("Error fetching equipment:", error);
  }

  // Quick stats
  const totalEquipment = equipment?.length || 0;
  const operational = equipment?.filter(e => e.status === 'operational').length || 0;
  const faulty = equipment?.filter(e => e.status === 'faulty').length || 0;
  const maintenance = equipment?.filter(e => e.status === 'maintenance').length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-2">
            <Cpu className="h-8 w-8 text-blue-500" />
            <span>Equipment Management</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor and manage network equipment across all sites
          </p>
        </div>
        <AddEquipmentDialog sites={sites || []}>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </AddEquipmentDialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Equipment</p>
                <p className="text-2xl font-bold text-slate-900">{totalEquipment}</p>
              </div>
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Operational</p>
                <p className="text-2xl font-bold text-green-600">{operational}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Faulty</p>
                <p className="text-2xl font-bold text-red-600">{faulty}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{maintenance}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⚠</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EquipmentTable equipment={equipment || []} sites={sites || []} />
    </div>
  );
}