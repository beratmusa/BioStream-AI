import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IoT Sensor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time monitoring of laboratory environmental conditions and equipment status.
        </p>
      </div>
      
      <DashboardGrid />
    </div>
  );
}
