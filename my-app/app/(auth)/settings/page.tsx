import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  Settings,
  Key,
  Users,
  Shield,
  Plus,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react"

const apiKeys = [
  {
    id: "key-1",
    name: "Production API Key",
    key: "pk_live_***********************abc",
    created: "2024-02-01",
    lastUsed: "2024-03-05",
    status: "Active"
  },
  {
    id: "key-2",
    name: "Development API Key",
    key: "pk_test_***********************xyz",
    created: "2024-02-15",
    lastUsed: "2024-03-04",
    status: "Active"
  }
]

const userRoles = [
  {
    id: "role-1",
    name: "Administrator",
    description: "Full system access and control",
    users: 3,
    permissions: ["create", "read", "update", "delete", "manage_users", "manage_settings"]
  },
  {
    id: "role-2",
    name: "Project Manager",
    description: "Manage RFPs and project workflows",
    users: 8,
    permissions: ["create", "read", "update", "manage_projects"]
  },
  {
    id: "role-3",
    name: "Bid Manager",
    description: "Handle bid submissions and evaluations",
    users: 12,
    permissions: ["create", "read", "update", "manage_bids"]
  }
]

const integrations = [
  {
    id: "int-1",
    name: "Document Storage",
    provider: "AWS S3",
    status: "Connected",
    lastSync: "5 minutes ago"
  },
  {
    id: "int-2",
    name: "Email Service",
    provider: "SendGrid",
    status: "Connected",
    lastSync: "1 hour ago"
  },
  {
    id: "int-3",
    name: "AI Provider",
    provider: "OpenAI",
    status: "Connected",
    lastSync: "15 minutes ago"
  }
]

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your API keys, user roles, and system configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">API Keys</CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{apiKey.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {apiKey.key}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">User Roles</CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-start justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-xs bg-muted px-2 py-1 rounded">
                          {role.users} users
                        </div>
                        {role.permissions.map((permission) => (
                          <div
                            key={permission}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {permission}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Requirements</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Minimum 12 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Require special characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked className="rounded" />
                      <span className="text-sm">Require numbers</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked className="rounded" />
                    <span className="text-sm">Require 2FA for all admin users</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Session Management</Label>
                  <div className="space-y-2">
                    <Input type="number" placeholder="Session timeout (minutes)" defaultValue="30" />
                  </div>
                </div>
              </div>

              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Provider: {integration.provider}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last synced: {integration.lastSync}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <span className="h-2 w-2 rounded-full bg-green-600" />
                        {integration.status}
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Sync
                      </Button>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
