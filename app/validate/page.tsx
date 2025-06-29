"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, CameraOff, CheckCircle, XCircle, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  college: string
  role: string
  registeredAt: string
  validated: boolean
}

interface ValidationResult {
  success: boolean
  student?: Student
  message: string
}

export default function ValidatePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [manualId, setManualId] = useState("")
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [recentScans, setRecentScans] = useState<Student[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load students and recent scans from API
    fetchStudents()
    fetchRecentScans()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (response.ok) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchRecentScans = async () => {
    try {
      const response = await fetch("/api/validate/recent")
      const data = await response.json()
      if (response.ok) {
        setRecentScans(data.recentScans.map((scan: any) => scan.student))
      }
    } catch (error) {
      console.error("Error fetching recent scans:", error)
    }
  }

  const validateStudent = async (studentId: string) => {
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, method: "manual" }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh students and recent scans
        fetchStudents()
        fetchRecentScans()
        return data
      } else {
        return data
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error occurred",
      }
    }
  }

  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a student ID",
        variant: "destructive",
      })
      return
    }

    validateStudent(manualId.trim()).then((result) => {
      setValidationResult(result as any)

      if (result && result.success) {
        toast({
          title: "Validation Successful",
          description: `${(result as any).student?.name} has been validated`,
        })
        setManualId("")
      } else {
        toast({
          title: "Validation Failed",
          description: (result as any).message,
          variant: "destructive",
        })
      }
    })
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please use manual entry.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    // Simulate scanning a random student's QR code
    const unvalidatedStudents = students.filter((s) => !s.validated)
    if (unvalidatedStudents.length === 0) {
      toast({
        title: "No Students to Validate",
        description: "All students have already been validated",
        variant: "destructive",
      })
      return
    }

    const randomStudent = unvalidatedStudents[Math.floor(Math.random() * unvalidatedStudents.length)]
    validateStudent(randomStudent.id).then((result) => {
      setValidationResult(result as any)

      toast({
        title: "QR Code Scanned",
        description: `Validated ${(result as any).student?.name}`,
      })
    })
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      participant: "bg-blue-100 text-blue-800",
      volunteer: "bg-green-100 text-green-800",
      organizer: "bg-purple-100 text-purple-800",
      judge: "bg-orange-100 text-orange-800",
      sponsor: "bg-red-100 text-red-800",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Entry Validation</h1>
          <p className="text-gray-600">Scan QR codes or manually enter student IDs to validate entries</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Validation Methods */}
          <div className="space-y-6">
            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>Use camera to scan student QR codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isScanning ? (
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-lg p-8 mb-4">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Camera not active</p>
                    </div>
                    <Button onClick={startCamera} className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-black rounded-lg p-4 mb-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={simulateQRScan} className="flex-1">
                        Simulate Scan
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        <CameraOff className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>Enter student ID manually for validation</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualValidation} className="space-y-4">
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="Enter student ID (e.g., FEST-1234567890-123)"
                      className="font-mono"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Validate Student
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Validation Result & Recent Scans */}
          <div className="space-y-6">
            {/* Validation Result */}
            {validationResult && (
              <Card
                className={
                  (validationResult as any).success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }
              >
                <CardHeader>
                  <div className="flex items-center">
                    {(validationResult as any).success ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mr-2" />
                    )}
                    <CardTitle className={(validationResult as any).success ? "text-green-800" : "text-red-800"}>
                      {(validationResult as any).success ? "Validation Successful" : "Validation Failed"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`mb-4 ${(validationResult as any).success ? "text-green-700" : "text-red-700"}`}>
                    {(validationResult as any).message}
                  </p>

                  {(validationResult as any).student && (
                    <div className="bg-white p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{(validationResult as any).student.name}</h4>
                        <Badge className={getRoleBadgeColor((validationResult as any).student.role)}>
                          {(validationResult as any).student.role.charAt(0).toUpperCase() +
                            (validationResult as any).student.role.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">{(validationResult as any).student.id}</p>
                      <p className="text-sm text-gray-600">{(validationResult as any).student.college}</p>
                      <p className="text-sm text-gray-600">{(validationResult as any).student.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Validations</CardTitle>
                <CardDescription>Last 10 validated students</CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent validations</p>
                ) : (
                  <div className="space-y-3">
                    {recentScans.map((student, index) => (
                      <div
                        key={`${student.id}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600 font-mono">{student.id}</p>
                        </div>
                        <Badge className={getRoleBadgeColor(student.role)} variant="secondary">
                          {student.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
