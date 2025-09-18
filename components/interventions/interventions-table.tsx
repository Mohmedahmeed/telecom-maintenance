// components/interventions/interventions-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash2, MapPin, User, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { EditInterventionDialog } from "./edit-intervention-dialog";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

interface Intervention {
  id: string;
  title: string;
  description?: string;
  type: 'preventive' | 'corrective' | 'installation' | 'replacement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date?: string;
  completed_date?: string;
  estimated_duration?: number;
  site_id: string;
  equipment_id?: string;
  assigned_to?: string;
  sites: {
    name: string;
    code: string;
  };
  equipment?: {
    name: string;
  };
  profiles?: {
    full_name: string;
  };
}

interface InterventionsTableProps {
  interventions: Intervention[];
  sites: any[];
  equipment: any[];
  users: any[];
}

const statusColors = {
  scheduled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const typeColors = {
  preventive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  corrective: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  installation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  replacement: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
};

export function InterventionsTable({ interventions, sites, equipment, users }: InterventionsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const deleteIntervention = async (interventionId: string) => {
    setIsDeleting(interventionId);
    try {
      const { error } = await supabase
        .from('interventions')
        .delete()
        .eq('id', interventionId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting intervention:', error);
      alert('Error deleting intervention. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Maintenance Tasks ({interventions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions.map((intervention) => (
                <TableRow key={intervention.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{intervention.title}</div>
                      {intervention.description && (
                        <div className="text-sm text-slate-500 max-w-xs truncate">
                          {intervention.description}
                        </div>
                      )}
                      {intervention.equipment && (
                        <div className="text-xs text-slate-400">
                          Equipment: {intervention.equipment.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[intervention.type]}>
                      {intervention.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[intervention.priority]}>
                      {intervention.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[intervention.status]}>
                      {intervention.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">
                        {intervention.sites.name} ({intervention.sites.code})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">
                        {intervention.profiles?.full_name || 'Unassigned'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {intervention.scheduled_date && (
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(intervention.scheduled_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {intervention.estimated_duration && (
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{intervention.estimated_duration}h est.</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <EditInterventionDialog 
                        intervention={intervention} 
                        sites={sites}
                        equipment={equipment}
                        users={users}
                      >
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditInterventionDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteIntervention(intervention.id)}
                        disabled={isDeleting === intervention.id}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {interventions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No interventions scheduled. Create your first maintenance task to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}