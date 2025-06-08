"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  ClipboardList,
  Package,
  Camera,
  Bell,
  TrendingUp,
  Calendar,
  Settings,
  MessageSquare,
  LogOut,
  User,
} from "lucide-react"
import RoomManagement from "@/components/room-management"
import TaskAssignment from "@/components/task-assignment"
import SupplyManagement from "@/components/supply-management"
import CleaningInterface from "@/components/cleaning-interface"
import CustomerReports from "@/components/customer-reports"
import SettingsPanel from "@/components/settings-panel"
import StaffLogin from "@/components/staff-login"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"
import StaffManagement from "@/components/staff-management"

interface DashboardStats {
  totalRooms: number
  completedToday: number
  pendingTasks: number
  overdueTasks: number
  activeStaff: number
  completionRate: number
}

interface AppSettings {
  title: string
  logo: string
  theme: string
}

export default function HousekeepingPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [settings, setSettings] = useLocalStorage<AppSettings>("app-settings", {
    title: "Housekeeping Management Portal",
    logo: "/placeholder.svg?height=40&width=40",
    theme: "default",
  })

  const [stats, setStats] = useLocalStorage<DashboardStats>("dashboard-stats", {
    totalRooms: 120,
    completedToday: 45,
    pendingTasks: 28,
    overdueTasks: 7,
    activeStaff: 12,
    completionRate: 78,
  })

  const [recentAlerts] = useLocalStorage("recent-alerts", [
    { id: 1, room: "205", issue: "Missed cleaning - 2 hours overdue", severity: "high", time: "2 hours ago" },
    { id: 2, room: "318", issue: "Low supply alert - Towels needed", severity: "medium", time: "45 min ago" },
    { id: 3, room: "102", issue: "Quality check failed - Bathroom", severity: "high", time: "1 hour ago" },
  ])

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("current-user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    // Simulate real-time updates with animations
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        completedToday: prev.completedToday + Math.floor(Math.random() * 2),
        pendingTasks: Math.max(0, prev.pendingTasks - Math.floor(Math.random() * 2)),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [setStats])

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    localStorage.setItem("current-user", JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("current-user")
    setActiveTab("dashboard")
  }

  if (!isAuthenticated) {
    return <StaffLogin onLogin={handleLogin} />
  }

  if (selectedRoom) {
    return (
      <CleaningInterface roomNumber={selectedRoom} onBack={() => setSelectedRoom(null)} currentUser={currentUser} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={settings.logo}
              alt="Logo"
              className="w-16 h-16 lg:w-12 lg:h-12 rounded-lg shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{settings.title}</h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Streamline cleaning operations with intelligent task management
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg w-full sm:w-auto"
            >
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">{currentUser?.name}</p>
                <p className="text-xs text-gray-600">{currentUser?.role}</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white/80 backdrop-blur-sm w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white/80 backdrop-blur-sm shadow-lg overflow-x-auto">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="rooms"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <ClipboardList className="w-4 h-4" />
                Rooms
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="supplies"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4" />
                Supplies
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Bell className="w-4 h-4" />
                Alerts
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="dashboard" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                  {[
                    { title: "Total Rooms", value: stats.totalRooms, icon: ClipboardList, color: "blue" },
                    { title: "Completed Today", value: stats.completedToday, icon: CheckCircle, color: "green" },
                    { title: "Pending Tasks", value: stats.pendingTasks, icon: Clock, color: "yellow" },
                    { title: "Overdue", value: stats.overdueTasks, icon: AlertTriangle, color: "red" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="transform transition-all duration-200"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                          <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            key={stat.value}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-2xl font-bold text-${stat.color}-600`}
                          >
                            {stat.value}
                          </motion.div>
                          <p className="text-xs text-muted-foreground">
                            {stat.title === "Completed Today"
                              ? "+12% from yesterday"
                              : stat.title === "Pending Tasks"
                                ? "In progress"
                                : stat.title === "Overdue"
                                  ? "Requires attention"
                                  : "Managed properties"}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Completion Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Daily Completion Rate</CardTitle>
                      <CardDescription>Overall performance metrics for today</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <motion.span
                          key={stats.completionRate}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-sm text-muted-foreground"
                        >
                          {stats.completionRate}%
                        </motion.span>
                      </div>
                      <Progress value={stats.completionRate} className="h-3" />
                      <div className="flex items-center gap-4 text-sm">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{stats.activeStaff} Active Staff</span>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>Photo Verification: ON</span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest updates from housekeeping operations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            room: "301",
                            action: "Cleaning completed",
                            staff: "Maria S.",
                            time: "5 min ago",
                            status: "success",
                          },
                          {
                            room: "205",
                            action: "Photo verification uploaded",
                            staff: "John D.",
                            time: "12 min ago",
                            status: "info",
                          },
                          {
                            room: "418",
                            action: "Supply request submitted",
                            staff: "Sarah L.",
                            time: "18 min ago",
                            status: "warning",
                          },
                          {
                            room: "102",
                            action: "Quality check passed",
                            staff: "Mike R.",
                            time: "25 min ago",
                            status: "success",
                          },
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50/80 hover:bg-white/80 transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={
                                  activity.status === "success"
                                    ? "default"
                                    : activity.status === "warning"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                Room {activity.room}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">by {activity.staff}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="rooms">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <RoomManagement onSelectRoom={setSelectedRoom} />
              </motion.div>
            </TabsContent>

            <TabsContent value="tasks">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TaskAssignment />
              </motion.div>
            </TabsContent>

            <TabsContent value="supplies">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SupplyManagement />
              </motion.div>
            </TabsContent>

            <TabsContent value="reports">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <CustomerReports />
              </motion.div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Active Alerts
                    </CardTitle>
                    <CardDescription>Real-time notifications and quality issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlerts.map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50/80 hover:bg-red-100/80 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <AlertTriangle
                                className={`w-5 h-5 ${alert.severity === "high" ? "text-red-600" : "text-yellow-600"}`}
                              />
                            </motion.div>
                            <div>
                              <p className="font-medium">Room {alert.room}</p>
                              <p className="text-sm text-muted-foreground">{alert.issue}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                              {alert.severity}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SettingsPanel settings={settings} onSettingsChange={setSettings} />
              </motion.div>
            </TabsContent>
            <TabsContent value="staff">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <StaffManagement />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  )
}
