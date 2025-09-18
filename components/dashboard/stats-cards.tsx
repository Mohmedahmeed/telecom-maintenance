import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "../../lib/utils";


interface Stat {
  title: string;
  value: number;
  description: string;
  trend: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

const statIcons = [
  "🏢", // Total Sites
  "✅", // Active Sites  
  "⚙️", // Equipment
  "🚨"  // Alerts
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const isPositive = stat.trend.startsWith('+');
        const isNegative = stat.trend.startsWith('-');
        
        return (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200 border-0 bg-gradient-to-br from-white to-slate-50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-50"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className="text-2xl">{statIcons[index]}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <div className="text-3xl font-bold text-slate-900">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className={cn(
                    "flex items-center text-sm font-medium px-2 py-1 rounded-full",
                    isPositive ? 'text-green-700 bg-green-100' : 
                    isNegative ? 'text-red-700 bg-red-100' : 
                    'text-slate-600 bg-slate-100'
                  )}>
                    {isPositive && <ArrowUpIcon className="w-3 h-3 mr-1" />}
                    {isNegative && <ArrowDownIcon className="w-3 h-3 mr-1" />}
                    {!isPositive && !isNegative && <TrendingUpIcon className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}