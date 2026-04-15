import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFcm } from "@/hooks/use-fcm";

export function NotificationSettings() {
  const { permission, registerNotifications, loading } = useFcm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure email and push notification settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Send emails for important events.
            </p>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              {permission === "denied" 
                ? "Notification permission is blocked. Please enable it in browser settings."
                : "Receive push notifications on this device."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {permission === "default" && (
              <Button size="sm" variant="outline" onClick={registerNotifications} disabled={loading}>
                Open Popup
              </Button>
            )}
            <Switch 
              id="push-notifications" 
              checked={permission === "granted"}
              onCheckedChange={(checked) => {
                if (checked) registerNotifications();
              }}
              disabled={loading || permission === "denied"}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Save Changes</Button>
        {permission === "denied" && (
          <p className="text-xs text-destructive">
            Please reset browser permissions (click lock icon next to URL)
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
