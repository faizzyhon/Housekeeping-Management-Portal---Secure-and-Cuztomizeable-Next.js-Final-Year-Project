"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings, Upload, Palette, Bell, Database, Save, Download, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

interface AppSettings {
  title: string
  logo: string
  theme: string
}

interface SettingsPanelProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings) => void
}

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    alerts: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    onSettingsChange(localSettings)
    // Show success message
    alert("Settings saved successfully!")
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLocalSettings((prev) => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExportData = () => {
    const data = {
      settings: localSettings,
      rooms: JSON.parse(localStorage.getItem("rooms-data") || "[]"),
      staff: JSON.parse(localStorage.getItem("staff-data") || "[]"),
      supplies: JSON.parse(localStorage.getItem("supplies-data") || "[]"),
      reports: JSON.parse(localStorage.getItem("customer-reports") || "[]"),
      assignments: JSON.parse(localStorage.getItem("assignments-data") || "[]"),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `housekeeping-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear()
      alert("All data has been cleared. Please refresh the page.")
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Application Settings
            </CardTitle>
            <CardDescription>Customize your housekeeping portal</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic application configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="app-title">Application Title</Label>
                  <Input
                    id="app-title"
                    value={localSettings.title}
                    onChange={(e) => setLocalSettings((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter application title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={localSettings.logo}
                      alt="Current logo"
                      className="w-16 h-16 rounded-lg border object-cover"
                    />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-600">Recommended: 200x200px, PNG or JPG</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex justify-end">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of your portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={localSettings.theme}
                    onValueChange={(value) => setLocalSettings((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Blue</SelectItem>
                      <SelectItem value="purple">Purple Gradient</SelectItem>
                      <SelectItem value="green">Green Nature</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Color Scheme Preview</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { name: "Primary", color: "bg-blue-500" },
                      { name: "Secondary", color: "bg-purple-500" },
                      { name: "Success", color: "bg-green-500" },
                      { name: "Warning", color: "bg-yellow-500" },
                    ].map((color) => (
                      <motion.div key={color.name} whileHover={{ scale: 1.1 }} className="text-center">
                        <div className={`w-full h-12 rounded-lg ${color.color} mb-2`} />
                        <p className="text-xs text-gray-600">{color.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Apply Theme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: "email", label: "Email Notifications", description: "Receive updates via email" },
                  { key: "push", label: "Push Notifications", description: "Browser push notifications" },
                  { key: "sms", label: "SMS Alerts", description: "Text message alerts for urgent issues" },
                  { key: "alerts", label: "In-App Alerts", description: "Show alerts within the application" },
                ].map((notification) => (
                  <motion.div
                    key={notification.key}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50/80 transition-all duration-200"
                  >
                    <div>
                      <p className="font-medium">{notification.label}</p>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <Switch
                      checked={notifications[notification.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [notification.key]: checked }))
                      }
                    />
                  </motion.div>
                ))}

                <div className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="data">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Manage your application data and backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Data Export</h4>
                    <p className="text-sm text-gray-600">Download all your data as a backup</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleExportData} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                      </Button>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Data Reset</h4>
                    <p className="text-sm text-gray-600">Clear all data and start fresh</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleClearData} variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All Data
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Storage Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Rooms", count: JSON.parse(localStorage.getItem("rooms-data") || "[]").length },
                      { label: "Staff", count: JSON.parse(localStorage.getItem("staff-data") || "[]").length },
                      { label: "Reports", count: JSON.parse(localStorage.getItem("customer-reports") || "[]").length },
                      { label: "Supplies", count: JSON.parse(localStorage.getItem("supplies-data") || "[]").length },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-lg bg-gray-50"
                      >
                        <div className="text-2xl font-bold text-blue-600">{item.count}</div>
                        <p className="text-sm text-gray-600">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
