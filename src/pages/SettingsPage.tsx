import { Settings, Key, Bell, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform configuration and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* API Keys */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage your API keys for external services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">OpenAI API Key</p>
                <p className="text-sm text-muted-foreground">Required for GPT models</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Lovable AI Gateway</p>
                <p className="text-sm text-muted-foreground">For Gemini & Claude access</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="safety-alerts" className="flex flex-col gap-1">
                <span>Safety Alerts</span>
                <span className="font-normal text-muted-foreground text-sm">Get notified about critical safety issues</span>
              </Label>
              <Switch id="safety-alerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="performance-alerts" className="flex flex-col gap-1">
                <span>Performance Alerts</span>
                <span className="font-normal text-muted-foreground text-sm">Alerts when system performance drops</span>
              </Label>
              <Switch id="performance-alerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="decision-logs" className="flex flex-col gap-1">
                <span>Decision Logs</span>
                <span className="font-normal text-muted-foreground text-sm">Log all meta-decisions for review</span>
              </Label>
              <Switch id="decision-logs" />
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
            <CardDescription>
              Supabase connection and data management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="font-medium text-foreground">Connected</p>
                  <p className="text-sm text-muted-foreground">Supabase PostgreSQL</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Tables</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
