"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Lock, Shield, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface StaffLoginProps {
  onLogin: (user: any) => void
}

export default function StaffLogin({ onLogin }: StaffLoginProps) {
  const [staffId, setStaffId] = useState("")
  const [pin, setPin] = useState("")
  const [selectedStaff, setSelectedStaff] = useState("")
  const [error, setError] = useState("")

  const staffMembers = [
    { id: "1", name: "Maria Santos", role: "Senior Housekeeper", pin: "1234", status: "available", shift: "Morning" },
    { id: "2", name: "John Davis", role: "Housekeeper", pin: "2345", status: "available", shift: "Morning" },
    { id: "3", name: "Sarah Lee", role: "Supervisor", pin: "3456", status: "available", shift: "Evening" },
    { id: "4", name: "Mike Rodriguez", role: "Housekeeper", pin: "4567", status: "available", shift: "Morning" },
    { id: "5", name: "Lisa Kim", role: "Senior Housekeeper", pin: "5678", status: "available", shift: "Evening" },
    { id: "6", name: "Tom Brown", role: "Manager", pin: "6789", status: "available", shift: "Full Day" },
  ]

  const handleLogin = () => {
    const staff = staffMembers.find((s) => s.id === selectedStaff && s.pin === pin)

    if (!staff) {
      setError("Invalid staff ID or PIN")
      return
    }

    // Record login time
    const loginRecord = {
      staffId: staff.id,
      name: staff.name,
      role: staff.role,
      loginTime: new Date().toISOString(),
      shift: staff.shift,
    }

    // Save login record
    const loginHistory = JSON.parse(localStorage.getItem("login-history") || "[]")
    loginHistory.push(loginRecord)
    localStorage.setItem("login-history", JSON.stringify(loginHistory))

    onLogin(staff)
  }

  const quickLogin = (staff: any) => {
    setSelectedStaff(staff.id)
    setPin(staff.pin)
    setTimeout(() => handleLogin(), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold">Staff Verification</CardTitle>
                <CardDescription>Secure access to housekeeping portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="staff-select">Select Staff Member</Label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>
                              {staff.name} - {staff.role}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin">Security PIN</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="pin"
                      type="password"
                      placeholder="Enter your 4-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="pl-10"
                      maxLength={4}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm text-center bg-red-50 p-2 rounded"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={!selectedStaff || !pin}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify & Login
                  </Button>
                </motion.div>

                <div className="text-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Login time will be recorded for shift tracking
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="text-xl">Quick Access</CardTitle>
                <CardDescription>Click on your profile for instant login (Demo)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffMembers.map((staff, index) => (
                    <motion.div
                      key={staff.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => quickLogin(staff)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{staff.name}</p>
                          <p className="text-xs text-gray-600">{staff.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {staff.shift}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">PIN: {staff.pin}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
