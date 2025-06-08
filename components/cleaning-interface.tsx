"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Camera, CheckCircle, Clock, Upload, MessageSquare, Sparkles } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface CleaningTask {
  id: string
  area: string
  tasks: {
    id: string
    description: string
    completed: boolean
    photoRequired: boolean
    photoUploaded: boolean
  }[]
}

interface CleaningInterfaceProps {
  roomNumber: string
  onBack: () => void
  currentUser: any
}

export default function CleaningInterface({ roomNumber, onBack, currentUser }: CleaningInterfaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const [cleaningTasks, setCleaningTasks] = useLocalStorage<CleaningTask[]>(`cleaning-tasks-${roomNumber}`, [
    {
      id: "bathroom",
      area: "Bathroom",
      tasks: [
        {
          id: "toilet",
          description: "Clean and disinfect toilet",
          completed: false,
          photoRequired: true,
          photoUploaded: false,
        },
        {
          id: "shower",
          description: "Clean shower/bathtub",
          completed: false,
          photoRequired: true,
          photoUploaded: false,
        },
        {
          id: "sink",
          description: "Clean sink and mirror",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
        {
          id: "floor",
          description: "Mop bathroom floor",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
        { id: "towels", description: "Replace towels", completed: false, photoRequired: false, photoUploaded: false },
        {
          id: "supplies",
          description: "Restock bathroom supplies",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
      ],
    },
    {
      id: "bedroom",
      area: "Bedroom",
      tasks: [
        { id: "bed", description: "Change bed linens", completed: false, photoRequired: true, photoUploaded: false },
        {
          id: "vacuum",
          description: "Vacuum carpet/floor",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
        {
          id: "dust",
          description: "Dust furniture and surfaces",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
        {
          id: "windows",
          description: "Clean windows and mirrors",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
        { id: "trash", description: "Empty trash bins", completed: false, photoRequired: false, photoUploaded: false },
      ],
    },
    {
      id: "general",
      area: "General",
      tasks: [
        { id: "entry", description: "Clean entry area", completed: false, photoRequired: false, photoUploaded: false },
        { id: "ac", description: "Check AC/heating", completed: false, photoRequired: false, photoUploaded: false },
        {
          id: "amenities",
          description: "Restock amenities",
          completed: false,
          photoRequired: false,
          photoUploaded: false,
        },
        { id: "final", description: "Final inspection", completed: false, photoRequired: true, photoUploaded: false },
      ],
    },
  ])

  const totalTasks = cleaningTasks.reduce((acc, area) => acc + area.tasks.length, 0)
  const completedTasks = cleaningTasks.reduce(
    (acc, area) => acc + area.tasks.filter((task) => task.completed).length,
    0,
  )
  const progress = (completedTasks / totalTasks) * 100

  const handleTaskToggle = (areaId: string, taskId: string) => {
    setCleaningTasks((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? {
              ...area,
              tasks: area.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
            }
          : area,
      ),
    )

    // Simulate AI suggestions based on completed tasks
    if (Math.random() > 0.7) {
      const suggestions = [
        "Consider checking for water spots on faucets",
        "Don't forget to fluff pillows after changing linens",
        "Ensure all light switches are wiped down",
        "Check under the bed for any missed items",
      ]
      setAiSuggestions([suggestions[Math.floor(Math.random() * suggestions.length)]])
    }
  }

  const handlePhotoUpload = (areaId: string, taskId: string) => {
    setCurrentTaskId(`${areaId}-${taskId}`)
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && currentTaskId) {
      const [areaId, taskId] = currentTaskId.split("-")
      setCleaningTasks((prev) =>
        prev.map((area) =>
          area.id === areaId
            ? {
                ...area,
                tasks: area.tasks.map((task) => (task.id === taskId ? { ...task, photoUploaded: true } : task)),
              }
            : area,
        ),
      )
      setCurrentTaskId(null)
    }
  }

  const handleComplete = () => {
    // Save completion data
    const completionData = {
      roomNumber,
      completedAt: new Date().toISOString(),
      completedTasks,
      totalTasks,
      notes,
      completionRate: progress,
    }

    localStorage.setItem(`completion-${roomNumber}-${Date.now()}`, JSON.stringify(completionData))

    // Show success message and go back
    alert(`Room ${roomNumber} cleaning completed successfully! ${completedTasks}/${totalTasks} tasks finished.`)
    onBack()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-4 lg:p-6 space-y-6 lg:space-y-8">
        <div className="mb-6 lg:mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-white/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Room {roomNumber}</h1>
              <p className="text-gray-600 text-sm lg:text-base">Cleaning Checklist & Photo Verification</p>
              <p className="text-xs text-gray-500 mt-1">Assigned to: {currentUser?.name}</p>
            </div>
            <Badge variant="outline" className="text-base lg:text-lg px-4 py-2">
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {cleaningTasks.map((area) => (
              <Card key={area.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {area.area}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {area.tasks.filter((task) => task.completed).length}/{area.tasks.length} tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {area.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          task.completed
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleTaskToggle(area.id, task.id)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <div>
                            <p
                              className={`font-medium ${task.completed ? "text-green-800 line-through" : "text-gray-900"}`}
                            >
                              {task.description}
                            </p>
                            {task.photoRequired && (
                              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <Camera className="w-3 h-3" />
                                Photo required
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {task.photoRequired && (
                            <Button
                              size="sm"
                              variant={task.photoUploaded ? "default" : "outline"}
                              onClick={() => handlePhotoUpload(area.id, task.id)}
                              className={task.photoUploaded ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              {task.photoUploaded ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Uploaded
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-1" />
                                  Photo
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Sparkles className="w-5 h-5" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Notes & Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any notes, issues, or special observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Started</span>
                  <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Photos Required</span>
                  <span className="text-sm font-medium">
                    {cleaningTasks.reduce(
                      (acc, area) => acc + area.tasks.filter((task) => task.photoRequired).length,
                      0,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Photos Uploaded</span>
                  <span className="text-sm font-medium">
                    {cleaningTasks.reduce(
                      (acc, area) => acc + area.tasks.filter((task) => task.photoUploaded).length,
                      0,
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Complete Button */}
            <Button
              onClick={handleComplete}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              disabled={progress < 100}
            >
              {progress < 100 ? (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  Complete All Tasks ({Math.round(progress)}%)
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark Room Complete
                </>
              )}
            </Button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  )
}
