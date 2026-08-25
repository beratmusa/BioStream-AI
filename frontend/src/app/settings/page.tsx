import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto flex flex-col items-center text-center md:text-left md:items-start">
      <div className="w-full">
        <h1 className="text-3xl font-bold tracking-tight text-center md:text-left">Settings</h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          Configure backend connections, MQTT broker settings, and application preferences.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6 flex flex-col items-center mx-auto text-left">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>MQTT Connection</CardTitle>
            <CardDescription>Settings for the IoT sensor data stream.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="broker">Broker Address</Label>
              <Input id="broker" defaultValue="ws://localhost:9001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" defaultValue="biolab/sensors" />
            </div>
            <Button className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>General dashboard settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Mock Sensor Mode</Label>
                <p className="text-sm text-muted-foreground">Use Python simulator instead of real hardware</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-background rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
