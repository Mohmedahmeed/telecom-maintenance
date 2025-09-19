"use client";

import { Button } from "../ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface ExportButtonsProps {
  data: {
    sites: any[] | null;
    equipment: any[] | null;
    interventions: any[] | null;
    alerts: any[] | null;
  };
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = (dataArray: any[], filename: string) => {
    if (!dataArray || dataArray.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(dataArray[0]).join(",");
    const csvContent = [
      headers,
      ...dataArray.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = async () => {
    setIsExporting(true);
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        summary: {
          totalSites: data.sites?.length || 0,
          activeSites: data.sites?.filter(s => s.status === 'active').length || 0,
          totalEquipment: data.equipment?.length || 0,
          operationalEquipment: data.equipment?.filter(e => e.status === 'operational').length || 0,
          totalInterventions: data.interventions?.length || 0,
          completedInterventions: data.interventions?.filter(i => i.status === 'completed').length || 0,
          totalAlerts: data.alerts?.length || 0,
          activeAlerts: data.alerts?.filter(a => a.status === 'active').length || 0,
        },
        sites: data.sites || [],
        equipment: data.equipment || [],
        interventions: data.interventions || [],
        alerts: data.alerts || []
      };

      const jsonContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `network-report-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(data.sites || [], "sites-report")}
        disabled={!data.sites?.length}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Sites CSV
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(data.equipment || [], "equipment-report")}
        disabled={!data.equipment?.length}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Equipment CSV
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(data.interventions || [], "interventions-report")}
        disabled={!data.interventions?.length}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Maintenance CSV
      </Button>
      
      <Button
        onClick={generateReport}
        disabled={isExporting}
        className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
      >
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? "Generating..." : "Full Report"}
      </Button>
    </div>
  );
}