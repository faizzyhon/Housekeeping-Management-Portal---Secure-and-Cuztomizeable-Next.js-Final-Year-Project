"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Plus,
  Eye,
  Reply,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"

interface CustomerReport {
  id: string
  roomNumber: string
  guestName: string
  reportType: "complaint" | "compliment" | "suggestion" | "maintenance"
  priority: "low" | "medium" | "high" | "urgent"
  subject: string
  description: string
  rating: number
  status: "new" | "in-progress" | "resolved" | "closed"
  submittedAt: string
  assignedTo?: string
  response?: string
  photos?: string[]
}

export default function CustomerReports() {
  const [activeTab, setActiveTab] = useState("reports")
  const [selectedReport, setSelectedReport] = useState<CustomerReport | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [newResponse, setNewResponse] = useState("")

  const [reports, setReports] = useLocalStorage<CustomerReport[]>("customer-reports", [
    {
      id: "1",
      roomNumber: "205",
      guestName: "John Smith",
      reportType: "complaint",
      priority: "high",
      subject: "Bathroom cleanliness issue",
      description: "Found hair in the shower and the toilet wasn't properly cleaned. The towels also seemed used.",
      rating: 2,
      status: "in-progress",
      submittedAt: "2024-01-15T10:30:00Z",
      assignedTo: "Maria Santos",
      photos: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: "2",
      roomNumber: "318",
      guestName: "Sarah Johnson",
      reportType: "compliment",
      priority: "low",
      subject: "Excellent housekeeping service",
      description: "The room was spotless and the housekeeping staff was very professional. Thank you!",
      rating: 5,
      status: "closed",
      submittedAt: "2024-01-15T14:20:00Z",
      response: "Thank you for your kind words! We'll share this with our housekeeping team.",
    },
    {
      id: "3",
      roomNumber: "102",
      guestName: "Mike Davis",
      reportType: "maintenance",
      priority: "urgent",
      subject: "AC not working properly",
      description: "The air conditioning unit is making loud noises and not cooling the room effectively.",
      rating: 3,
      status: "new",
      submittedAt: "2024-01-15T16:45:00Z",
    },
    {
      id: "4",
      roomNumber: "401",
      guestName: "Lisa Chen",
      reportType: "suggestion",
      priority: "medium",
      subject: "Additional amenities request",
      description: "It would be great to have more eco-friendly toiletries and perhaps a coffee machine in the room.",
      rating: 4,
      status: "new",
      submittedAt: "2024-01-15T18:10:00Z",
    },
  ])

  const filteredReports = reports.filter((report) => {
    const statusMatch = filterStatus === "all" || report.status === filterStatus
    const typeMatch = filterType === "all" || report.reportType === filterType
    return statusMatch && typeMatch
  })

  const getStatusColor = (status: CustomerReport["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: CustomerReport["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: CustomerReport["reportType"]) => {
    switch (type) {
      case "complaint":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "compliment":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "suggestion":
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      case "maintenance":
        return <Clock className="w-4 h-4 text-orange-600" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = (reportId: string, newStatus: CustomerReport["status"]) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
  }

  const handleAddResponse = (reportId: string) => {
    if (!newResponse.trim()) return

    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, response: newResponse, status: "resolved" } : report,
      ),
    )
    setNewResponse("")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const stats = {
    total: reports.length,
    new: reports.filter((r) => r.status === "new").length,
    inProgress: reports.filter((r) => r.status === "in-progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    avgRating: reports.reduce((acc, r) => acc + r.rating, 0) / reports.length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {[
          { label: "Total Reports", value: stats.total, color: "blue" },
          { label: "New", value: stats.new, color: "purple" },
          { label: "In Progress", value: stats.inProgress, color: "yellow" },
          { label: "Resolved", value: stats.resolved, color: "green" },
          { label: "Avg Rating", value: stats.avgRating.toFixed(1), color: "orange" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg">
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="new-report">New Report</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="complaint">Complaints</SelectItem>
                      <SelectItem value="compliment">Compliments</SelectItem>
                      <SelectItem value="suggestion">Suggestions</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Customer Reports</CardTitle>
                <CardDescription>Manage guest feedback and service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredReports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-lg p-4 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getTypeIcon(report.reportType)}
                              <h3 className="font-semibold">{report.subject}</h3>
                              <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>Room {report.roomNumber}</span>
                              <span>•</span>
                              <span>{report.guestName}</span>
                              <span>•</span>
                              <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
                            </div>

                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{report.description}</p>

                            <div className="flex items-center gap-2">
                              {renderStars(report.rating)}
                              <span className="text-sm text-gray-600">({report.rating}/5)</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(report.status)}>{report.status.replace("-", " ")}</Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Customer Feedback Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Report Types Distribution</h4>
                    <div className="space-y-3">
                      {["complaint", "compliment", "suggestion", "maintenance"].map((type) => {
                        const count = reports.filter((r) => r.reportType === type).length
                        const percentage = (count / reports.length) * 100
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize">{type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded">
                                <div className="h-full bg-blue-500 rounded" style={{ width: `${percentage}%` }} />
                              </div>
                              <span className="text-sm">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Response Time Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Average Response Time</span>
                        <span className="font-medium">2.5 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolution Rate</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="font-medium">4.2/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="new-report">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Report
                </CardTitle>
                <CardDescription>Add a new customer report or feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Room Number</Label>
                      <Input placeholder="e.g., 205" />
                    </div>
                    <div>
                      <Label>Guest Name</Label>
                      <Input placeholder="Guest name" />
                    </div>
                    <div>
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="compliment">Compliment</SelectItem>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Subject</Label>
                      <Input placeholder="Brief description" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Detailed description of the issue or feedback" className="min-h-[120px]" />
                    </div>
                    <div>
                      <Label>Rating (1-5)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Poor</SelectItem>
                          <SelectItem value="2">2 - Poor</SelectItem>
                          <SelectItem value="3">3 - Average</SelectItem>
                          <SelectItem value="4">4 - Good</SelectItem>
                          <SelectItem value="5">5 - Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedReport.subject}</h2>
                  <p className="text-gray-600">
                    Room {selectedReport.roomNumber} • {selectedReport.guestName}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedReport(null)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className={getPriorityColor(selectedReport.priority)}>{selectedReport.priority}</Badge>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status.replace("-", " ")}
                  </Badge>
                  <div className="flex items-center gap-1">{renderStars(selectedReport.rating)}</div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedReport.description}</p>
                </div>

                {selectedReport.response && (
                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedReport.response}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Select
                    value={selectedReport.status}
                    onValueChange={(value) => handleStatusUpdate(selectedReport.id, value as CustomerReport["status"])}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!selectedReport.response && (
                  <div className="space-y-2">
                    <Label>Add Response</Label>
                    <Textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Type your response to the customer..."
                    />
                    <Button onClick={() => handleAddResponse(selectedReport.id)}>
                      <Reply className="w-4 h-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
