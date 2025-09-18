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
import { Edit, Trash2, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { EditEquipmentDialog } from "./edit-equipment-dialog";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  type: string;
  brand?: string;
  model?: string;
  status: 'operational' | 'faulty' | 'maintenance' | 'offline';
  installation_date?: string;
  sites: {
    name: string;
    code: string;
  };
}

interface Site {
  id: string;
  name: string;
  code: string;
}

interface EquipmentTableProps {
  equipment: Equipment[];
  sites: Site[];
}

const statusColors = {
  operational: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  faulty: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  offline: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
};

const typeColors = {
  antenna: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  transmitter: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  receiver: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  amplifier: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  power_supply: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  cooling: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
};

export function EquipmentTable({ equipment, sites }: EquipmentTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const deleteEquipment = async (equipmentId: string) => {
    setIsDeleting(equipmentId);
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', equipmentId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Error deleting equipment. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Equipment Inventory ({equipment.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site Location</TableHead>
                <TableHead>Installation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-slate-500">
                        SN: <code className="bg-slate-100 px-1 rounded">{item.serial_number}</code>
                      </div>
                      {item.brand && item.model && (
                        <div className="text-xs text-slate-400">
                          {item.brand} {item.model}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[item.type as keyof typeof typeColors] || typeColors.other}>
                      {item.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">
                        {item.sites.name} ({item.sites.code})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {item.installation_date 
                          ? new Date(item.installation_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <EditEquipmentDialog equipment={item} sites={sites}>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditEquipmentDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEquipment(item.id)}
                        disabled={isDeleting === item.id}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {equipment.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No equipment found. Add your first equipment to get started.
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