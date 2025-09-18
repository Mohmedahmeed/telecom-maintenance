"use client";

import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut, Bell, Search, Wifi, Activity } from "lucide-react";
import { useState, useEffect } from 'react';

interface HeaderProps {
  user: any;
  profile: any;
}

export function Header({ user, profile }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    // Set initial time
    updateTime();
    
    // Update time every second
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-500" />
            <span>Network Operations Center</span>
          </h1>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Wifi className="h-3 w-3 text-green-500" />
              <span>Network Status: Operational</span>
            </div>
            <div className="text-xs text-slate-400">
              Last Updated: {currentTime || 'Loading...'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search sites, equipment..."
            className="pl-10 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
          />
        </div>
        
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            3
          </span>
        </Button>
        
        {/* User info */}
        {profile && (
          <div className="text-sm text-slate-700 hidden md:block">
            {profile.full_name || profile.email}
          </div>
        )}
        
        {/* Logout */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </header>
  );
}