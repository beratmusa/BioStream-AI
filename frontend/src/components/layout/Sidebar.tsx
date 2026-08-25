"use client";

import Link from "next/link";
import { Activity, Dna, Settings, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="flex md:h-screen md:sticky md:top-0 w-full md:w-64 flex-col border-b md:border-b-0 md:border-r bg-muted/20 relative z-10">
        {/* Header (Top on Mobile, Top of Sidebar on Desktop) */}
        <div className="flex h-16 items-center justify-between md:justify-start border-b px-4 md:px-6 bg-background md:bg-transparent">
          <div className="flex items-center">
            <Activity className="mr-2 h-6 w-6 text-primary" />
            <span className="text-lg font-bold">BioStream AI</span>
          </div>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
        
        {/* Desktop Navigation & Mobile Bottom Bar */}
        <div className="flex flex-1 flex-col justify-between fixed bottom-0 left-0 w-full z-50 bg-background border-t md:border-t-0 md:static md:bg-transparent md:z-auto">
          <nav className="flex md:flex-col justify-around md:justify-start space-x-0 md:space-y-2 p-2 md:p-4">
            <Link 
              href="/" 
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg px-3 py-2 transition-all flex-1 md:flex-none justify-center ${
                isActive("/") ? "text-primary md:bg-primary/10" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs md:text-base">Dashboard</span>
            </Link>
            <Link 
              href="/fasta" 
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg px-3 py-2 transition-all flex-1 md:flex-none justify-center ${
                isActive("/fasta") ? "text-primary md:bg-primary/10" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Dna className="h-5 w-5" />
              <span className="text-xs md:text-base">FASTA</span>
            </Link>
            <Link 
              href="/settings" 
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg px-3 py-2 transition-all flex-1 md:flex-none justify-center ${
                isActive("/settings") ? "text-primary md:bg-primary/10" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs md:text-base">Settings</span>
            </Link>
          </nav>
          
          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex p-4 border-t items-center justify-between mt-auto">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
