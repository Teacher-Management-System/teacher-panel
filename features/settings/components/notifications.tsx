import React, { useState, useEffect } from "react";
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
import {
  AlertCircle,
  Check,
  Copy,
  Send,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import notificationService from "@/features/notifications/api.service";
import { toast } from "sonner";

export function NotificationSettings() {
  const {
    permission,
    token,
    registerNotifications,
    loading: fcmLoading,
  } = useFcm();
  const [testLoading, setTestLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Automatically fetch token on mount if permission is already granted
  useEffect(() => {
    if (permission === "granted" && !token) {
      registerNotifications(true); // silent fetch
    }
  }, [permission, token, registerNotifications]);

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success("Token copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = async () => {
    setTestLoading(true);
    try {
      await notificationService.sendTestNotification();
    } catch (error) {
      console.error("Test notification failed:", error);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preference</CardTitle>
          <CardDescription>
            Configure how you want to receive alerts and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <div className="space-y-0.5">
              <Label
                htmlFor="email-notifications"
                className="text-base font-semibold"
              >
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive important account and platform updates via email.
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="push-notifications"
                  className="text-base font-semibold"
                >
                  Push Notifications
                </Label>
                {permission === "granted" && (
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {permission === "denied"
                  ? "Status: Blocked. Please reset browser permissions using the lock icon in the address bar."
                  : "Status: Active. Receive real-time alerts directly on your device."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {permission === "default" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => registerNotifications()}
                  disabled={fcmLoading}
                  className="font-medium"
                >
                  Enable Now
                </Button>
              )}
              <Switch
                id="push-notifications"
                checked={permission === "granted"}
                onCheckedChange={(checked) => {
                  if (checked) registerNotifications();
                }}
                disabled={fcmLoading || permission === "denied"}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 border-t px-6 py-4">
          <Button className="font-semibold">Save Preferences</Button>
        </CardFooter>
      </Card>

      {permission === "granted" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3 text-primary">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <CardTitle className="text-lg">Diagnostic Tools</CardTitle>
            </div>
            <CardDescription className="text-primary/70">
              Use these tools to verify your notification setup is working
              correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-primary/80">
                Device Registration Token
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    readOnly
                    value={token || "Retrieving token..."}
                    className="w-full rounded-md border border-primary/20 bg-background px-3 py-2 pr-10 text-xs font-mono text-muted-foreground focus:outline-none"
                  />
                  {token && (
                    <button
                      onClick={handleCopyToken}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleSendTest}
                  disabled={testLoading || !token}
                  className="gap-2 font-semibold shadow-sm"
                >
                  {testLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Test
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-md bg-background/50 p-3 text-xs border border-primary/10">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-primary/80 leading-relaxed">
                Click <strong>Send Test</strong> to trigger a push notification
                through your backend. If you don't receive it, verify your VAPID
                keys and FCM configuration on the server.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {permission === "denied" && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            Push notifications are blocked. Please click the{" "}
            <strong>lock icon</strong> next to the URL in your address bar to
            reset permissions.
          </p>
        </div>
      )}
    </div>
  );
}
