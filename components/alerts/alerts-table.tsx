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
import { Edit, Trash2, MapPin, User, Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'equipment_fault' | 'maintenance_due' | 'security_breach' | 'power_failure' | 'network_issue';
  severity: 'info' | 'warning' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  site_id?: string;
  equipment_id?: string;
  acknowledged_by?: string;
  resolved_by?: string;
  created_at: string;
  sites?: {
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

interface AlertsTableProps {
  alerts: Alert[];
  sites: any[];
  equipment: any[];
}

const statusColors = {
  active: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  acknowledged: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const severityColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  warning: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const typeColors = {
  equipment_fault: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  maintenance_due: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  security_breach: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  power_failure: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  network_issue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
};

export function AlertsTable({ alerts, sites, equipment }: AlertsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAcknowledging, setIsAcknowledging] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const acknowledgeAlert = async (alertId: string) => {
    setIsAcknowledging(alertId);
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'acknowledged',
          acknowledged_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', alertId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert('Error acknowledging alert. Please try again.');
    } finally {
      setIsAcknowledging(null);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'resolved',
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', alertId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Error resolving alert. Please try again.');
    }
  };

  const deleteAlert = async (alertId: string) => {
    setIsDeleting(alertId);
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting alert:', error);
      alert('Error deleting alert. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>System Alerts ({alerts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-slate-500 max-w-xs truncate">
                        {alert.message}
                      </div>
                      {alert.equipment && (
                        <div className="text-xs text-slate-400">
                          Equipment: {alert.equipment.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[alert.type]}>
                      {alert.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={severityColors[alert.severity]}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[alert.status]}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {alert.sites && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">
                          {alert.sites.name} ({alert.sites.code})
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {alert.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          disabled={isAcknowledging === alert.id}
                          className="hover:bg-yellow-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="hover:bg-green-50"
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        disabled={isDeleting === alert.id}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No alerts found. Your system is running smoothly! 🎉
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