import { createClient } from "../../../lib/supabase/server";
import { StatsCards } from "../../../components/dashboard/stats-cards";
import { RecentAlerts } from "../../../components/dashboard/recent-alerts";
import { SiteStatusChart } from "../../../components/dashboard/site-status-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Activity, Zap, Shield, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch dashboard data
  const [
    { count: totalSites },
    { count: activeSites },
    { count: totalEquipment },
    { count: activeAlerts },
    { data: recentAlerts }
  ] = await Promise.all([
    supabase.from("sites").select("*", { count: "exact", head: true }),
    supabase.from("sites").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("equipment").select("*", { count: "exact", head: true }),
    supabase.from("alerts").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("alerts")
      .select(`
        *,
        sites(name),
        equipment(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  const stats = [
    {
      title: "Network Sites",
      value: totalSites || 0,
      description: "Total cell tower sites",
      trend: "+2.1%"
    },
    {
      title: "Online Sites",
      value: activeSites || 0,
      description: "Currently operational",
      trend: "+1.3%"
    },
    {
      title: "Equipment Units",
      value: totalEquipment || 0,
      description: "Monitored devices",
      trend: "+5.2%"
    },
    {
      title: "Active Alerts",
      value: activeAlerts || 0,
      description: "Requiring attention",
      trend: "-12.5%"
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Network Overview</h2>
          <p className="text-slate-600 mt-1">
            Real-time monitoring and management dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">Power Status</p>
                <p className="text-sm text-slate-500">All systems normal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Security</p>
                <p className="text-sm text-slate-500">No threats detected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium">Maintenance</p>
                <p className="text-sm text-slate-500">3 scheduled today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <p className="font-medium">Performance</p>
                <p className="text-sm text-slate-500">98.7% uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SiteStatusChart />
        <RecentAlerts alerts={recentAlerts || []} />
      </div>
    </div>
  );
}