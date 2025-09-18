"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { 
  LayoutDashboard, 
  Antenna, 
  Cpu, 
  Wrench, 
  AlertTriangle, 
  FileBarChart,
  Settings,
  Users,
  Zap,
  Signal
} from "lucide-react";

interface SidebarProps {
  user: any;
  profile: any;
}

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "System overview"
  },
  {
    name: "Cell Sites",
    href: "/dashboard/sites",
    icon: Antenna,
    description: "Base stations"
  },
  {
    name: "Equipment",
    href: "/dashboard/equipment",
    icon: Cpu,
    description: "Hardware status"
  },
  {
    name: "Maintenance",
    href: "/dashboard/interventions",
    icon: Wrench,
    description: "Service tasks"
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
    description: "System alerts"
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
    description: "Analytics"
  }
];

const adminNavigation = [
  {
    name: "Team",
    href: "/dashboard/users",
    icon: Users,
    description: "User management"
  },
  {
    name: "System",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Configuration"
  }
];

export function AppSidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname();

  const allNavigation = [
    ...navigation,
    ...(profile?.role === 'admin' ? adminNavigation : [])
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl">
      <div className="flex flex-col h-full">
        {/* Logo Header */}
        <div className="flex items-center justify-center h-20 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Signal className="h-10 w-10 text-blue-400" />
              <Zap className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">TelecomOps</div>
              <div className="text-xs text-slate-400">Network Management</div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {profile?.full_name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">
                {profile?.full_name || user.email.split('@')[0]}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-slate-300 text-sm capitalize">
                  {profile?.role || 'technician'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {allNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                )}
              >
                <div className={cn(
                  "mr-4 p-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-slate-700/30 group-hover:bg-slate-600/40"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>v2.1.0</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}