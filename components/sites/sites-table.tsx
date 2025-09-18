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
import { Edit, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { EditSiteDialog } from "./edit-site-dialog";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

interface Site {
  id: string;
  name: string;
  code: string;
  type: '2G' | '3G' | '4G' | '5G';
  status: 'active' | 'inactive' | 'maintenance' | 'fault';
  address?: string;
  city?: string;
  region?: string;
  created_at: string;
}

interface SitesTableProps {
  sites: Site[];
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", 
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  fault: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const typeColors = {
  '2G': "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  '3G': "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  '4G': "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  '5G': "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
};

export function SitesTable({ sites }: SitesTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const deleteSite = async (siteId: string) => {
    setIsDeleting(siteId);
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('Error deleting site. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sites ({sites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {site.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[site.type]}>
                      {site.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[site.status]}>
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {site.city && site.region ? `${site.city}, ${site.region}` : 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <EditSiteDialog site={site}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditSiteDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSite(site.id)}
                        disabled={isDeleting === site.id}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sites.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No sites found. Add your first site to get started.
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