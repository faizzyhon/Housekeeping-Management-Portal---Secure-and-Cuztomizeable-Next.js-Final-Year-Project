"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, Clock, AlertTriangle, Camera, MapPin, Calendar } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Room {
  number: string
  floor: number
  type: string
  status: "clean" | "dirty" | "in-progress" | "maintenance" | "overdue"
  lastCleaned: string
  assignedTo: string
  priority: "low" | "medium" | "high"
  issues: string[]
}

interface RoomManagementProps {
  onSelectRoom: (roomNumber: string) => void
}

export default function RoomManagement({ onSelectRoom }: RoomManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [floorFilter, setFloorFilter] = useState("all")

  const [rooms] = useLocalStorage<Room[]>("rooms-data", [
    {
      number: "101",
      floor: 1,
      type: "Standard",
      status: "clean",
      lastCleaned: "2 hours ago",
      assignedTo: "Maria S.",
      priority: "low",
      issues: [],
    },
    {
      number: "102",
      floor: 1,
      type: "Standard",
      status: "overdue",
      lastCleaned: "6 hours ago",
      assignedTo: "John D.",
      priority: "high",
      issues: ["Bathroom needs attention"],
    },
    {
      number: "103",
      floor: 1,
      type: "Deluxe",
      status: "in-progress",
      lastCleaned: "30 min ago",
      assignedTo: "Sarah L.",
      priority: "medium",
      issues: [],
    },
    {
      number: "201",
      floor: 2,
      type: "Standard",
      status: "dirty",
      lastCleaned: "4 hours ago",
      assignedTo: "Mike R.",
      priority: "medium",
      issues: [],
    },
    {
      number: "202",
      floor: 2,
      type: "Suite",
      status: "clean",
      lastCleaned: "1 hour ago",
      assignedTo: "Lisa K.",
      priority: "low",
      issues: [],
    },
    {
      number: "203",
      floor: 2,
      type: "Standard",
      status: "maintenance",
      lastCleaned: "8 hours ago",
      assignedTo: "Tom B.",
      priority: "high",
      issues: ["AC repair needed"],
    },
    {
      number: "301",
      floor: 3,
      type: "Deluxe",
      status: "clean",
      lastCleaned: "3 hours ago",
      assignedTo: "Anna M.",
      priority: "low",
      issues: [],
    },
    {
      number: "302",
      floor: 3,
      type: "Standard",
      status: "dirty",
      lastCleaned: "5 hours ago",
      assignedTo: "Carlos R.",
      priority: "medium",
      issues: [],
    },
    {
      number: "303",
      floor: 3,
      type: "Suite",
      status: "in-progress",
      lastCleaned: "45 min ago",
      assignedTo: "Emma W.",
      priority: "medium",
      issues: [],
    },
    {
      number: "401",
      floor: 4,
      type: "Standard",
      status: "overdue",
      lastCleaned: "7 hours ago",
      assignedTo: "David L.",
      priority: "high",
      issues: ["Guest complaint"],
    },
  ])

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.includes(searchTerm) || room.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter
    return matchesSearch && matchesStatus && matchesFloor
  })

  const getStatusIcon = (status: Room["status"]) => {
    switch (status) {
      case "clean":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "maintenance":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "clean":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: Room["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Room Management
          </CardTitle>
          <CardDescription>Monitor and manage all room cleaning operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search rooms or staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="dirty">Dirty</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
                <SelectItem value="4">Floor 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <Card
                key={room.number}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
                onClick={() => onSelectRoom(room.number)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Room {room.number}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(room.status)}
                      <Badge className={getPriorityColor(room.priority)}>{room.priority}</Badge>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <span>{room.type}</span>
                    <span>•</span>
                    <span>Floor {room.floor}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}
                  >
                    {room.status.replace("-", " ").toUpperCase()}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Last cleaned: {room.lastCleaned}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Assigned to:</span>
                      <span className="font-medium">{room.assignedTo}</span>
                    </div>
                  </div>

                  {room.issues.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-red-600">Issues:</span>
                      {room.issues.map((issue, index) => (
                        <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full mt-3"
                    variant={room.status === "overdue" ? "destructive" : "default"}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectRoom(room.number)
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Cleaning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
