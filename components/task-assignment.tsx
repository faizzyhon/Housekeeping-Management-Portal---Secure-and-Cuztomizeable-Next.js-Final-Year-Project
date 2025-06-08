"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, Clock, CheckCircle, AlertTriangle, Plus, UserCheck } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { format } from "date-fns"

interface Staff {
  id: string
  name: string
  status: "available" | "busy" | "break"
  currentRoom?: string
  tasksToday: number
  efficiency: number
}

interface Assignment {
  id: string
  roomNumber: string
  staffId: string
  staffName: string
  priority: "low" | "medium" | "high"
  estimatedTime: number
  status: "pending" | "in-progress" | "completed"
  assignedAt: string
  dueTime: string
}

export default function TaskAssignment() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedStaff, setSelectedStaff] = useState<string>("")
  const [selectedRoom, setSelectedRoom] = useState<string>("")

  const [staff] = useLocalStorage<Staff[]>("staff-data", [
    { id: "1", name: "Maria Santos", status: "available", tasksToday: 8, efficiency: 95 },
    { id: "2", name: "John Davis", status: "busy", currentRoom: "205", tasksToday: 6, efficiency: 88 },
    { id: "3", name: "Sarah Lee", status: "available", tasksToday: 7, efficiency: 92 },
    { id: "4", name: "Mike Rodriguez", status: "break", tasksToday: 5, efficiency: 85 },
    { id: "5", name: "Lisa Kim", status: "busy", currentRoom: "318", tasksToday: 9, efficiency: 97 },
    { id: "6", name: "Tom Brown", status: "available", tasksToday: 4, efficiency: 90 },
  ])

  const [assignments, setAssignments] = useLocalStorage<Assignment[]>("assignments-data", [
    {
      id: "1",
      roomNumber: "101",
      staffId: "1",
      staffName: "Maria Santos",
      priority: "high",
      estimatedTime: 45,
      status: "completed",
      assignedAt: "09:00",
      dueTime: "10:00",
    },
    {
      id: "2",
      roomNumber: "205",
      staffId: "2",
      staffName: "John Davis",
      priority: "high",
      estimatedTime: 60,
      status: "in-progress",
      assignedAt: "10:30",
      dueTime: "11:30",
    },
    {
      id: "3",
      roomNumber: "318",
      staffId: "5",
      staffName: "Lisa Kim",
      priority: "medium",
      estimatedTime: 40,
      status: "in-progress",
      assignedAt: "11:00",
      dueTime: "12:00",
    },
    {
      id: "4",
      roomNumber: "402",
      staffId: "3",
      staffName: "Sarah Lee",
      priority: "low",
      estimatedTime: 35,
      status: "pending",
      assignedAt: "12:00",
      dueTime: "13:00",
    },
  ])

  const availableRooms = ["102", "103", "201", "202", "203", "301", "302", "303", "401", "403", "404"]

  const getStatusColor = (status: Staff["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-blue-100 text-blue-800"
      case "break":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAssignmentStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const handleAssignTask = () => {
    if (!selectedStaff || !selectedRoom) return

    const staffMember = staff.find((s) => s.id === selectedStaff)
    if (!staffMember) return

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      roomNumber: selectedRoom,
      staffId: selectedStaff,
      staffName: staffMember.name,
      priority: "medium",
      estimatedTime: 45,
      status: "pending",
      assignedAt: format(new Date(), "HH:mm"),
      dueTime: format(new Date(Date.now() + 45 * 60000), "HH:mm"),
    }

    setAssignments((prev) => [...prev, newAssignment])
    setSelectedStaff("")
    setSelectedRoom("")
  }

  return (
    <div className="space-y-6">
      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Task Assignment
          </CardTitle>
          <CardDescription>Assign cleaning tasks to available staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Staff Member</label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staff
                    .filter((s) => s.status === "available")
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} (Efficiency: {member.efficiency}%)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Room</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      Room {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAssignTask} disabled={!selectedStaff || !selectedRoom} className="w-full">
                Assign Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Staff Status
            </CardTitle>
            <CardDescription>Current availability and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{member.tasksToday} tasks today</span>
                        <span>•</span>
                        <span>{member.efficiency}% efficiency</span>
                      </div>
                      {member.currentRoom && (
                        <p className="text-xs text-blue-600">Currently in Room {member.currentRoom}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Assignments
            </CardTitle>
            <CardDescription>Active and pending task assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getAssignmentStatusIcon(assignment.status)}
                    <div>
                      <p className="font-medium">Room {assignment.roomNumber}</p>
                      <p className="text-sm text-gray-600">{assignment.staffName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {assignment.assignedAt} - {assignment.dueTime}
                        </span>
                        <span>•</span>
                        <span>{assignment.estimatedTime} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getPriorityColor(assignment.priority)}>{assignment.priority}</Badge>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{assignment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Staff performance and task completion insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">94%</div>
              <p className="text-sm text-gray-600">Average Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">38 min</div>
              <p className="text-sm text-gray-600">Average Task Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">91%</div>
              <p className="text-sm text-gray-600">Staff Efficiency</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
