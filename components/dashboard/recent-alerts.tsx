import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecentAlerts({ alerts }: { alerts: any[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent alerts 🎉</p>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{alert.title}</p>
              <p className="text-sm text-muted-foreground">
                {alert.sites?.name} • {alert.equipment?.name || "General"}
              </p>
            </div>
            <Badge
              variant={
                alert.severity === "critical"
                  ? "destructive"
                  : alert.severity === "warning"
                  ? "secondary"
                  : "outline"
              }
            >
              {alert.severity}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
