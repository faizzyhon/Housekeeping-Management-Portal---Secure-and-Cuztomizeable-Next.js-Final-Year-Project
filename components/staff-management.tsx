"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Search,
  UserPlus,
  Building,
  Settings,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: "manager" | "supervisor" | "housekeeper" | "maintenance"
  status: "available" | "busy" | "break" | "off-duty"
  shift: "morning" | "evening" | "night" | "full-day"
  pin: string
  hireDate: string
  efficiency: number
  roomsAssigned: string[]
  specializations: string[]
  notes: string
  avatar?: string
}

interface Room {
  id: string
  number: string
  floor: number
  type: string
  status: string
}

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)

  const [staff, setStaff] = useLocalStorage<Staff[]>("staff-data", [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@hotel.com",
      phone: "+1-555-0101",
      role: "housekeeper",
      status: "available",
      shift: "morning",
      pin: "1234",
      hireDate: "2023-01-15",
      efficiency: 95,
      roomsAssigned: ["101", "102", "103", "201", "202"],
      specializations: ["Deep Cleaning", "VIP Suites"],
      notes: "Excellent attention to detail. Preferred for VIP guests.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "John Davis",
      email: "john@hotel.com",
      phone: "+1-555-0102",
      role: "housekeeper",
      status: "busy",
      shift: "morning",
      pin: "2345",
      hireDate: "2023-03-20",
      efficiency: 88,
      roomsAssigned: ["104", "105", "203", "204"],
      specializations: ["Standard Rooms", "Quick Turnovers"],
      notes: "Fast and reliable. Good for high-volume days.",
    },
    {
      id: "3",
      name: "Sarah Lee",
      email: "sarah@hotel.com",
      phone: "+1-555-0103",
      role: "supervisor",
      status: "available",
      shift: "full-day",
      pin: "3456",
      hireDate: "2022-08-10",
      efficiency: 92,
      roomsAssigned: [],
      specializations: ["Quality Control", "Training", "Inventory"],
      notes: "Team leader with excellent organizational skills.",
    },
    {
      id: "4",
      name: "Mike Rodriguez",
      email: "mike@hotel.com",
      phone: "+1-555-0104",
      role: "maintenance",
      status: "available",
      shift: "morning",
      pin: "4567",
      hireDate: "2023-05-12",
      efficiency: 85,
      roomsAssigned: [],
      specializations: ["HVAC", "Plumbing", "Electrical"],
      notes: "Handles all maintenance requests efficiently.",
    },
  ])

  const [rooms, setRooms] = useLocalStorage<Room[]>("rooms-data", [
    { id: "1", number: "101", floor: 1, type: "Standard", status: "clean" },
    { id: "2", number: "102", floor: 1, type: "Standard", status: "dirty" },
    { id: "3", number: "103", floor: 1, type: "Deluxe", status: "maintenance" },
    { id: "4", number: "104", floor: 1, type: "Standard", status: "clean" },
    { id: "5", number: "105", floor: 1, type: "Suite", status: "dirty" },
    { id: "6", number: "201", floor: 2, type: "Standard", status: "clean" },
    { id: "7", number: "202", floor: 2, type: "Deluxe", status: "dirty" },
    { id: "8", number: "203", floor: 2, type: "Standard", status: "clean" },
    { id: "9", number: "204", floor: 2, type: "Suite", status: "maintenance" },
  ])

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    email: "",
    phone: "",
    role: "housekeeper",
    shift: "morning",
    pin: "",
    specializations: [],
    notes: "",
  })

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesStatus = filterStatus === "all" || member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddStaff = () => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      role: (formData.role as Staff["role"]) || "housekeeper",
      status: "available",
      shift: (formData.shift as Staff["shift"]) || "morning",
      pin: formData.pin || Math.floor(1000 + Math.random() * 9000).toString(),
      hireDate: new Date().toISOString().split("T")[0],
      efficiency: 80,
      roomsAssigned: [],
      specializations: formData.specializations || [],
      notes: formData.notes || "",
    }

    setStaff((prev) => [...prev, newStaff])
    setFormData({})
    setIsAddDialogOpen(false)
  }

  const handleEditStaff = () => {
    if (!selectedStaff) return

    setStaff((prev) => prev.map((member) => (member.id === selectedStaff.id ? { ...member, ...formData } : member)))
    setIsEditDialogOpen(false)
    setSelectedStaff(null)
    setFormData({})
  }

  const handleDeleteStaff = (staffId: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaff((prev) => prev.filter((member) => member.id !== staffId))
    }
  }

  const openEditDialog = (member: Staff) => {
    setSelectedStaff(member)
    setFormData(member)
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: Staff["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "busy":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "break":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "off-duty":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleColor = (role: Staff["role"]) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800"
      case "supervisor":
        return "bg-blue-100 text-blue-800"
      case "housekeeper":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: staff.length,
    available: staff.filter((s) => s.status === "available").length,
    busy: staff.filter((s) => s.status === "busy").length,
    avgEfficiency: Math.round(staff.reduce((acc, s) => acc + s.efficiency, 0) / staff.length),
    totalRooms: rooms.length,
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6"
      >
        {[
          { label: "Total Staff", value: stats.total, icon: Users, color: "blue" },
          { label: "Available", value: stats.available, icon: UserPlus, color: "green" },
          { label: "Working", value: stats.busy, icon: Clock, color: "yellow" },
          { label: "Avg Efficiency", value: `${stats.avgEfficiency}%`, icon: TrendingUp, color: "purple" },
          { label: "Total Rooms", value: stats.totalRooms, icon: Building, color: "orange" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.div
                      key={stat.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-xl lg:text-2xl font-bold text-${stat.color}-600 mb-1`}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 text-${stat.color}-600 opacity-20`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="overview" className="text-xs lg:text-sm">
              <Users className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="text-xs lg:text-sm">
              <Settings className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="text-xs lg:text-sm">
              <Building className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs lg:text-sm">
              <TrendingUp className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="overview" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Search and Filters */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <Search className="w-5 h-5" />
                  Staff Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search staff by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-full lg:w-[140px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="housekeeper">Housekeeper</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full lg:w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="break">On Break</SelectItem>
                        <SelectItem value="off-duty">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              <AnimatePresence>
                {filteredStaff.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="transform transition-all duration-200"
                  >
                    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg"
                            >
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm lg:text-base truncate">{member.name}</h3>
                              <p className="text-xs lg:text-sm text-gray-600 truncate">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={getStatusColor(member.status)} variant="outline">
                              {member.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleColor(member.role)} variant="outline">
                            {member.role}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{member.efficiency}%</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{member.shift} shift</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{member.roomsAssigned.length} rooms assigned</span>
                          </div>
                        </div>

                        {member.specializations.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Specializations:</p>
                            <div className="flex flex-wrap gap-1">
                              {member.specializations.slice(0, 2).map((spec, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {member.specializations.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{member.specializations.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(member)}
                              className="w-full"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteStaff(member.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Staff Management
                    </CardTitle>
                    <CardDescription>Add, edit, and manage staff members</CardDescription>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="w-full lg:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Staff Member
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>Enter the details for the new staff member</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pin">Security PIN</Label>
                          <Input
                            id="pin"
                            value={formData.pin || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, pin: e.target.value }))}
                            placeholder="4-digit PIN"
                            maxLength={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={formData.role || "housekeeper"}
                            onValueChange={(value) =>
                              setFormData((prev) => ({ ...prev, role: value as Staff["role"] }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="housekeeper">Housekeeper</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shift">Shift</Label>
                          <Select
                            value={formData.shift || "morning"}
                            onValueChange={(value) =>
                              setFormData((prev) => ({ ...prev, shift: value as Staff["shift"] }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                              <SelectItem value="evening">Evening (2PM - 10PM)</SelectItem>
                              <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                              <SelectItem value="full-day">Full Day (8AM - 6PM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes about the staff member"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row gap-2 lg:justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="w-full lg:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddStaff} className="w-full lg:w-auto">
                          Add Staff Member
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Room Management
                </CardTitle>
                <CardDescription>Manage room assignments and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {rooms.map((room, index) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Room {room.number}</h3>
                        <Badge variant="outline">{room.type}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Floor: {room.floor}</p>
                        <p>
                          Status: <span className="capitalize">{room.status}</span>
                        </p>
                        <p>
                          Assigned Staff:{" "}
                          {staff.find((s) => s.roomsAssigned.includes(room.number))?.name || "Unassigned"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Staff Analytics
                </CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Efficiency by Role</h4>
                    <div className="space-y-3">
                      {["manager", "supervisor", "housekeeper", "maintenance"].map((role) => {
                        const roleStaff = staff.filter((s) => s.role === role)
                        const avgEfficiency =
                          roleStaff.length > 0
                            ? Math.round(roleStaff.reduce((acc, s) => acc + s.efficiency, 0) / roleStaff.length)
                            : 0
                        return (
                          <div key={role} className="flex items-center justify-between">
                            <span className="capitalize">{role}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded">
                                <motion.div
                                  className="h-full bg-blue-500 rounded"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${avgEfficiency}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                              <span className="text-sm w-12">{avgEfficiency}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Staff Distribution</h4>
                    <div className="space-y-3">
                      {["morning", "evening", "night", "full-day"].map((shift) => {
                        const shiftStaff = staff.filter((s) => s.shift === shift).length
                        const percentage = staff.length > 0 ? (shiftStaff / staff.length) * 100 : 0
                        return (
                          <div key={shift} className="flex items-center justify-between">
                            <span className="capitalize">{shift}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded">
                                <motion.div
                                  className="h-full bg-green-500 rounded"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.7 }}
                                />
                              </div>
                              <span className="text-sm w-8">{shiftStaff}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pin">Security PIN</Label>
              <Input
                id="edit-pin"
                value={formData.pin || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, pin: e.target.value }))}
                maxLength={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role || "housekeeper"}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as Staff["role"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="housekeeper">Housekeeper</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shift">Shift</Label>
              <Select
                value={formData.shift || "morning"}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, shift: value as Staff["shift"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                  <SelectItem value="evening">Evening (2PM - 10PM)</SelectItem>
                  <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                  <SelectItem value="full-day">Full Day (8AM - 6PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status || "available"}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Staff["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="break">On Break</SelectItem>
                  <SelectItem value="off-duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-efficiency">Efficiency (%)</Label>
              <Input
                id="edit-efficiency"
                type="number"
                min="0"
                max="100"
                value={formData.efficiency || 80}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, efficiency: Number.parseInt(e.target.value) || 80 }))
                }
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 lg:justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button onClick={handleEditStaff} className="w-full lg:w-auto">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
