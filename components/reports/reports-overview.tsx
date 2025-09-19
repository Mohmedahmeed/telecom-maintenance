import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Antenna, Cpu, Wrench, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface ReportsOverviewProps {
  stats: {
    totalSites: number;
    activeSites: number;
    totalEquipment: number;
    operationalEquipment: number;
    totalInterventions: number;
    completedInterventions: number;
    totalAlerts: number;
    activeAlerts: number;
  };
}

export function ReportsOverview({ stats }: ReportsOverviewProps) {
  const overviewData = [
    {
      title: "Network Sites",
      value: stats.totalSites,
      active: stats.activeSites,
      percentage: ((stats.activeSites / (stats.totalSites || 1)) * 100).toFixed(1),
      icon: Antenna,
      color: "blue",
      trend: "+2.5%"
    },
    {
      title: "Equipment",
      value: stats.totalEquipment,
      active: stats.operationalEquipment,
      percentage: ((stats.operationalEquipment / (stats.totalEquipment || 1)) * 100).toFixed(1),
      icon: Cpu,
      color: "green",
      trend: "+1.8%"
    },
    {
      title: "Maintenance",
      value: stats.totalInterventions,
      active: stats.completedInterventions,
      percentage: ((stats.completedInterventions / (stats.totalInterventions || 1)) * 100).toFixed(1),
      icon: Wrench,
      color: "purple",
      trend: "+12.3%"
    },
    {
      title: "Alerts",
      value: stats.totalAlerts,
      active: stats.activeAlerts,
      percentage: ((stats.activeAlerts / (stats.totalAlerts || 1)) * 100).toFixed(1),
      icon: AlertTriangle,
      color: "red",
      trend: "-8.2%"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          border: 'border-l-blue-500',
          icon: 'text-blue-500',
          bg: 'bg-blue-500',
          text: 'text-blue-600'
        };
      case 'green':
        return {
          border: 'border-l-green-500',
          icon: 'text-green-500',
          bg: 'bg-green-500',
          text: 'text-green-600'
        };
      case 'purple':
        return {
          border: 'border-l-purple-500',
          icon: 'text-purple-500',
          bg: 'bg-purple-500',
          text: 'text-purple-600'
        };
      case 'red':
        return {
          border: 'border-l-red-500',
          icon: 'text-red-500',
          bg: 'bg-red-500',
          text: 'text-red-600'
        };
      default:
        return {
          border: 'border-l-gray-500',
          icon: 'text-gray-500',
          bg: 'bg-gray-500',
          text: 'text-gray-600'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewData.map((item, index) => {
        const colors = getColorClasses(item.color);
        const isPositiveTrend = item.trend.startsWith('+');
        
        return (
          <Card key={index} className={`${colors.border} border-l-4 shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                  <item.icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div className={`flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveTrend ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {item.trend}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-600">{item.title}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900">{item.value}</span>
                  <span className="text-sm text-slate-500">total</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-semibold ${colors.text}`}>
                    {item.active} active
                  </span>
                  <span className="text-sm text-slate-500">
                    {item.percentage}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`${colors.bg} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}