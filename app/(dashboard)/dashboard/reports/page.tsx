import { createClient } from "../../../../lib/supabase/server";
import { ReportsOverview } from "../../../../components/reports/reports-overview";
import { SiteStatusChart } from "../../../../components/reports/site-status-chart";
import { EquipmentStatusChart } from "../../../../components/reports/equipment-status-chart";
import { MaintenanceChart } from "../../../../components/reports/maintenance-chart";
import { AlertsChart } from "../../../../components/reports/alerts-chart";
import { ExportButtons } from "../../../../components/reports/export-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { FileBarChart, TrendingUp, Activity, Calendar } from "lucide-react";

export default async function ReportsPage() {
  const supabase = await createClient();

  // Fetch data for reports
  const [
    { data: sites },
    { data: equipment },
    { data: interventions },
    { data: alerts },
    { data: recentMaintenanceData }
  ] = await Promise.all([
    supabase.from("sites").select("id, name, status, type, created_at"),
    supabase.from("equipment").select("id, name, status, type, site_id, created_at"),
    supabase.from("interventions").select(`
      id, title, status, type, priority, scheduled_date, completed_date, created_at,
      sites(name), equipment(name)
    `),
    supabase.from("alerts").select("id, severity, status, type, created_at"),
    supabase.from("interventions").select(`
      id, status, scheduled_date, completed_date, type,
      sites(name)
    `).order("created_at", { ascending: false }).limit(50)
  ]);

  // Calculate statistics
  const stats = {
    totalSites: sites?.length || 0,
    activeSites: sites?.filter(s => s.status === 'active').length || 0,
    totalEquipment: equipment?.length || 0,
    operationalEquipment: equipment?.filter(e => e.status === 'operational').length || 0,
    totalInterventions: interventions?.length || 0,
    completedInterventions: interventions?.filter(i => i.status === 'completed').length || 0,
    totalAlerts: alerts?.length || 0,
    activeAlerts: alerts?.filter(a => a.status === 'active').length || 0
  };

  // Prepare chart data
  const siteStatusData = [
    { name: 'Active', value: sites?.filter(s => s.status === 'active').length || 0, color: '#22c55e' },
    { name: 'Maintenance', value: sites?.filter(s => s.status === 'maintenance').length || 0, color: '#eab308' },
    { name: 'Inactive', value: sites?.filter(s => s.status === 'inactive').length || 0, color: '#6b7280' },
    { name: 'Fault', value: sites?.filter(s => s.status === 'fault').length || 0, color: '#ef4444' }
  ];

  const equipmentStatusData = [
    { name: 'Operational', value: equipment?.filter(e => e.status === 'operational').length || 0, color: '#22c55e' },
    { name: 'Maintenance', value: equipment?.filter(e => e.status === 'maintenance').length || 0, color: '#eab308' },
    { name: 'Faulty', value: equipment?.filter(e => e.status === 'faulty').length || 0, color: '#ef4444' },
    { name: 'Offline', value: equipment?.filter(e => e.status === 'offline').length || 0, color: '#6b7280' }
  ];

  const alertsSeverityData = [
    { name: 'Info', value: alerts?.filter(a => a.severity === 'info').length || 0, color: '#3b82f6' },
    { name: 'Warning', value: alerts?.filter(a => a.severity === 'warning').length || 0, color: '#f59e0b' },
    { name: 'Critical', value: alerts?.filter(a => a.severity === 'critical').length || 0, color: '#ef4444' }
  ];

  // Monthly maintenance data (last 6 months)
  const monthlyMaintenanceData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthInterventions = interventions?.filter(int => {
      const intDate = new Date(int.created_at);
      return intDate >= monthStart && intDate <= monthEnd;
    }) || [];

    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      scheduled: monthInterventions.filter(i => i.status === 'scheduled').length,
      completed: monthInterventions.filter(i => i.status === 'completed').length,
      total: monthInterventions.length
    };
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-2">
            <FileBarChart className="h-8 w-8 text-purple-500" />
            <span>Network Analytics & Reports</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Comprehensive insights and analytics for your telecom network
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Generated: {new Date().toLocaleDateString()}
          </div>
          <ExportButtons data={{ sites, equipment, interventions, alerts }} />
        </div>
      </div>

      {/* Overview Stats */}
      <ReportsOverview stats={stats} />

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-slate-600">Network Uptime</p>
                <p className="text-2xl font-bold text-green-600">
                  {((stats.activeSites / (stats.totalSites || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500">Sites operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-slate-600">Equipment Health</p>
                <p className="text-2xl font-bold text-blue-600">
                  {((stats.operationalEquipment / (stats.totalEquipment || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500">Equipment operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-slate-600">Maintenance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((stats.completedInterventions / (stats.totalInterventions || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500">Tasks completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SiteStatusChart data={siteStatusData} />
        <EquipmentStatusChart data={equipmentStatusData} />
        <AlertsChart data={alertsSeverityData} />
        <MaintenanceChart data={monthlyMaintenanceData} />
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Network Summary Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalSites}</div>
              <div className="text-sm text-slate-600">Total Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalEquipment}</div>
              <div className="text-sm text-slate-600">Equipment Units</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalInterventions}</div>
              <div className="text-sm text-slate-600">Maintenance Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalAlerts}</div>
              <div className="text-sm text-slate-600">System Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}